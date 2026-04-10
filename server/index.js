import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { WebSocketServer } from 'ws';

import { collectWorkspaceInsights } from './lib/workspace-insights.js';
import { getAdapter, listAvailableIdes, getDefaultIdeId } from './lib/adapters/adapter-registry.js';
import { GitHubProfileService } from './lib/github-profile.js';
import { displayPath } from './lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

class CodexPixelBridge {
  constructor() {
    this.currentIdeId = getDefaultIdeId();
    this.adapter = getAdapter(this.currentIdeId);
    this.recentProjects = [];
    this.requestedWorkspace = '';
    this.currentSession = null;
    this.workspaceInsights = null;
    this.model = null;
    this.tailer = null;
    this.workspaceTimer = null;
    this.sessionRotationTimer = null;
    this.wss = null;
    this.connectionError = null;
  }

  attachServer(wss) {
    this.wss = wss;
  }

  async boot() {
    await this.refreshRecentProjects();
    await this.connectToWorkspace('');
    this.sessionRotationTimer = setInterval(() => {
      this.refreshRecentProjects().catch(() => {});
      this.refreshSessionBinding().catch(() => {});
    }, 15_000);
  }

  async refreshRecentProjects() {
    this.recentProjects = this.adapter.listRecentProjects();
  }

  async connectToWorkspace(workspacePath) {
    this.requestedWorkspace = displayPath(workspacePath || '');
    this.connectionError = null;

    const session = this.adapter.findLatestSession(this.requestedWorkspace);
    if (!session) {
      this.stopLiveResources();
      this.currentSession = null;
      this.model = null;
      this.workspaceInsights = await collectWorkspaceInsights(this.requestedWorkspace);
      this.connectionError = this.requestedWorkspace
        ? `No ${this.adapter.displayName} session was found for ${this.requestedWorkspace}.`
        : `No ${this.adapter.displayName} session was found.`;
      this.broadcast();
      return this.buildPayload();
    }

    if (this.currentSession?.filePath === session.filePath && this.model) {
      this.workspaceInsights = await collectWorkspaceInsights(session.cwd);
      this.broadcast();
      return this.buildPayload();
    }

    this.stopLiveResources();
    this.currentSession = session;
    this.model = this.adapter.createModel(session);
    this.workspaceInsights = await collectWorkspaceInsights(session.cwd);

    this.tailer = this.adapter.createTailer(session, (line) => {
      this.model.applyLine(line);
      this.broadcast();
    });

    await this.tailer.start();
    this.workspaceTimer = setInterval(async () => {
      this.workspaceInsights = await collectWorkspaceInsights(this.currentSession?.cwd || this.requestedWorkspace);
      this.broadcast();
    }, 5_000);

    this.broadcast();
    return this.buildPayload();
  }

  async refreshSessionBinding() {
    if (!this.requestedWorkspace) return;
    const freshest = this.adapter.findLatestSession(this.requestedWorkspace);
    if (!freshest || !this.currentSession) return;
    if (freshest.filePath !== this.currentSession.filePath && freshest.updatedAtMs > this.currentSession.updatedAtMs) {
      await this.connectToWorkspace(this.requestedWorkspace);
    }
  }

  stopLiveResources() {
    if (this.tailer) {
      this.tailer.stop();
      this.tailer = null;
    }
    if (this.workspaceTimer) {
      clearInterval(this.workspaceTimer);
      this.workspaceTimer = null;
    }
  }

  buildPayload() {
    if (!this.model) {
      return {
        ok: false,
        error: this.connectionError,
        ide: this.currentIdeId,
        ideName: this.adapter.displayName,
        requestedWorkspace: this.requestedWorkspace,
        recentProjects: this.recentProjects,
        workspace: this.workspaceInsights,
      };
    }

    return {
      ok: true,
      error: this.connectionError,
      ide: this.currentIdeId,
      ideName: this.adapter.displayName,
      requestedWorkspace: this.requestedWorkspace || this.currentSession?.cwd || '',
      ...this.model.buildSnapshot(this.workspaceInsights, this.recentProjects),
    };
  }

  broadcast() {
    if (!this.wss) return;
    const payload = JSON.stringify({
      type: 'snapshot',
      data: this.buildPayload(),
    });

    for (const client of this.wss.clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  }
}

const bridge = new CodexPixelBridge();
const playerService = new GitHubProfileService();
const app = express();

app.use(express.json());
app.use(express.static(publicDir));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    ide: bridge.currentIdeId,
    ideName: bridge.adapter.displayName,
    connected: !!bridge.model,
  });
});

app.get('/api/available-ides', (_req, res) => {
  res.json({
    ides: listAvailableIdes(),
    current: bridge.currentIdeId,
  });
});

app.post('/api/set-ide', async (req, res) => {
  const ideId = req.body?.ide || getDefaultIdeId();
  bridge.currentIdeId = ideId;
  bridge.adapter = getAdapter(ideId);
  bridge.stopLiveResources();
  bridge.currentSession = null;
  bridge.model = null;
  bridge.recentProjects = [];
  bridge.connectionError = null;
  await bridge.boot();
  res.json(bridge.buildPayload());
});

app.get('/api/recent-projects', async (_req, res) => {
  await bridge.refreshRecentProjects();
  res.json({
    projects: bridge.recentProjects,
  });
});

app.get('/api/player', async (req, res) => {
  const workspacePath = req.query?.workspacePath || bridge.requestedWorkspace || bridge.currentSession?.cwd || '';
  const payload = await playerService.getProfile({
    workspacePath: displayPath(workspacePath),
    force: req.query?.refresh === '1',
  });
  res.json(payload);
});

app.post('/api/player/refresh', async (req, res) => {
  const payload = await playerService.getProfile({
    workspacePath: displayPath(req.body?.workspacePath || bridge.requestedWorkspace || bridge.currentSession?.cwd || ''),
    force: true,
  });
  res.json(payload);
});

app.post('/api/connect', async (req, res) => {
  const payload = await bridge.connectToWorkspace(req.body?.workspacePath || '');
  res.json(payload);
});

app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
bridge.attachServer(wss);

wss.on('connection', async (socket) => {
  socket.send(
    JSON.stringify({
      type: 'snapshot',
      data: bridge.buildPayload(),
    }),
  );

  socket.on('message', async (data) => {
    try {
      const message = JSON.parse(String(data));
      if (message.type === 'connect') {
        await bridge.connectToWorkspace(message.workspacePath || '');
        return;
      }
      if (message.type === 'refreshProjects') {
        await bridge.refreshRecentProjects();
        bridge.broadcast();
      }
    } catch {
      // Ignore malformed messages from the client.
    }
  });
});

const port = Number(process.env.PORT || 3000);

server.listen(port, async () => {
  await bridge.boot();
  console.log(`Pixel Lab listening on http://localhost:${port} [IDE: ${bridge.adapter.displayName}]`);
});
