const fs = require('fs');
const path = require('path');
const os = require('os');
const vscode = require('vscode');

/**
 * Bridge do Pixel Lab para a extensão VS Code.
 *
 * Substitui Express + WebSocket por postMessage direto ao webview.
 * Reutiliza toda a lógica de adapters do projeto original.
 */
class PixelLabBridge {
  constructor(panel) {
    this.panel = panel;
    this.currentIdeId = 'antigravity';
    this.adapter = null;
    this.recentProjects = [];
    this.requestedWorkspace = '';
    this.currentSession = null;
    this.workspaceInsights = null;
    this.model = null;
    this.tailer = null;
    this.sessionRotationTimer = null;
    this.workspaceTimer = null;
    this.connectionError = null;
  }

  async boot() {
    // Detectar workspace ativo do VS Code
    const folders = vscode.workspace.workspaceFolders;
    const workspacePath = folders?.[0]?.uri?.fsPath || '';

    // Listeners para mudanças de terminal para atualizar o mapa instantaneamente
    vscode.window.onDidOpenTerminal(() => this.broadcast());
    vscode.window.onDidCloseTerminal(() => this.broadcast());

    // Iniciar com Antigravity por padrão (estamos dentro do VS Code com Antigravity)
    this.adapter = createAntigravityAdapter();
    this.recentProjects = this.adapter.listRecentProjects();

    await this.connectToWorkspace(workspacePath);

    // Rotação de sessão a cada 10s + broadcast periódico
    this.sessionRotationTimer = setInterval(() => {
      this.refreshSessionBinding().catch(() => {});
      this.recentProjects = this.adapter.listRecentProjects();
      this.broadcast();
    }, 10_000);
  }

  async connectToWorkspace(workspacePath) {
    this.requestedWorkspace = workspacePath;
    this.connectionError = null;

    const session = this.adapter.findLatestSession(workspacePath);
    if (!session) {
      this.stopLiveResources();
      this.currentSession = null;
      this.model = null;
      this.workspaceInsights = collectWorkspaceInsights(workspacePath);
      this.connectionError = workspacePath
        ? `Nenhuma sessão Antigravity encontrada para ${workspacePath}`
        : 'Nenhuma sessão Antigravity encontrada.';
      this.broadcast();
      return;
    }

    if (this.currentSession?.id === session.id) {
      this.broadcast();
      return;
    }

    this.stopLiveResources();
    this.currentSession = session;
    this.model = this.adapter.createModel(session);
    this.workspaceInsights = collectWorkspaceInsights(session.cwd);

    this.tailer = this.adapter.createTailer(session, (line) => {
      this.model.applyLine(line);
      this.broadcast();
    });

    await this.tailer.start();
    this.broadcast();
  }

  stopLiveResources() {
    if (this.tailer) {
      this.tailer.stop();
      this.tailer = null;
    }
  }

  async refreshSessionBinding() {
    if (!this.requestedWorkspace) return;
    const freshest = this.adapter.findLatestSession(this.requestedWorkspace);
    if (!freshest || !this.currentSession) return;
    if (freshest.filePath !== this.currentSession.filePath && freshest.updatedAtMs > this.currentSession.updatedAtMs) {
      await this.connectToWorkspace(this.requestedWorkspace);
    }
  }

  switchIde(ideId) {
    this.currentIdeId = ideId;
    if (ideId === 'codex') {
      this.adapter = createCodexAdapter();
    } else {
      this.adapter = createAntigravityAdapter();
    }
    this.stopLiveResources();
    this.currentSession = null;
    this.model = null;
    this.recentProjects = [];
    this.connectionError = null;
    this.boot();
  }

  buildPayload() {
    if (!this.model) {
      return {
        ok: false,
        error: this.connectionError,
        ide: this.currentIdeId,
        ideName: this.currentIdeId === 'antigravity' ? 'Antigravity' : 'Codex Desktop',
        requestedWorkspace: this.requestedWorkspace,
        recentProjects: this.recentProjects,
        workspace: this.workspaceInsights,
      };
    }
    return {
      ok: true,
      error: this.connectionError,
      ide: this.currentIdeId,
      ideName: this.currentIdeId === 'antigravity' ? 'Antigravity' : 'Codex Desktop',
      requestedWorkspace: this.requestedWorkspace || this.currentSession?.cwd || '',
      ...this.model.buildSnapshot(this.workspaceInsights, this.recentProjects),
    };
  }

  broadcast() {
    if (!this.panel) return;
    try {
      this.panel.webview.postMessage({
        type: 'snapshot',
        data: this.buildPayload(),
      });
    } catch {
      // Panel disposed
    }
  }

  dispose() {
    this.stopLiveResources();
    if (this.sessionRotationTimer) {
      clearInterval(this.sessionRotationTimer);
      this.sessionRotationTimer = null;
    }
  }
}

// ─── Adapters inline (CommonJS, sem import ESM) ─────────────────────

function defaultAntigravityHome() {
  return path.resolve(process.env.ANTIGRAVITY_HOME || path.join(os.homedir(), '.gemini', 'antigravity'));
}

function defaultCodexHome() {
  return path.resolve(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'));
}

function normalizeFsPath(p) {
  if (!p) return '';
  return path.resolve(p).replace(/\\/g, '/').toLowerCase();
}

function truncate(value, max = 96) {
  const text = String(value || '').trim();
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

function compactText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function formatRelativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return 'agora';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m atrás`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h atrás`;
  return `${Math.floor(diff / 86_400_000)}d atrás`;
}

function collectWorkspaceInsights(cwd) {
  if (!cwd || !fs.existsSync(cwd)) {
    return { cwd: cwd || '', projectName: '', isGit: false, branch: '', dirtyCount: 0 };
  }
  const projectName = path.basename(cwd);
  let isGit = false;
  let branch = '';
  let dirtyCount = 0;

  try {
    const gitHead = path.join(cwd, '.git', 'HEAD');
    if (fs.existsSync(gitHead)) {
      isGit = true;
      const head = fs.readFileSync(gitHead, 'utf8').trim();
      branch = head.startsWith('ref: refs/heads/') ? head.replace('ref: refs/heads/', '') : head.slice(0, 8);
    }
  } catch { /* ignore */ }

  return { cwd, projectName, isGit, branch, dirtyCount };
}

// ─── Antigravity Transcript Model ───────────────────────────────────

class AntigravityTranscriptModel {
  constructor(session) {
    this.session = session;
    this.feed = [];
    this.currentTool = null;
    this.lastTool = null;
    this.lastCommentary = '';
    this.lastCommentaryAt = null;
    this.lastUserPrompt = '';
    this.lastError = null;
    this.lastRecordAt = session?.updatedAt || null;
    this.model = 'gemini';
    this.turnCount = 0;
  }

  pushFeed(kind, title, detail, level = 'info', at = new Date().toISOString()) {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind, title,
      detail: compactText(detail),
      level, at,
      relative: formatRelativeTime(at),
    };
    const previous = this.feed[0];
    if (previous && previous.title === item.title && previous.detail === item.detail) {
      this.feed[0] = item;
    } else {
      this.feed.unshift(item);
      this.feed = this.feed.slice(0, 36);
    }
  }

  applyLine(line) {
    if (!line || !line.trim()) return;
    try {
      const record = JSON.parse(line);
      this.applyRecord(record);
    } catch {
      this.applyDaemonLogLine(line);
    }
  }

  applyDaemonLogLine(line) {
    const at = new Date().toISOString();
    this.lastRecordAt = at;

    if (line.includes('Requesting planner')) {
      this.turnCount += 1;
      this.currentTool = {
        id: `ag-turn-${Date.now()}`,
        name: 'planner', kind: 'tool',
        label: 'Antigravity pensando', command: '', arguments: {},
        startedAt: at,
      };
      this.lastTool = this.currentTool;
      this.lastCommentary = 'Antigravity está raciocinando...';
      this.lastCommentaryAt = at;
      this.pushFeed('task', 'Turno ativo', `Turno ${this.turnCount} do Antigravity`, 'info', at);
    } else if (line.includes('error') || line.includes('ERROR')) {
      const errorText = line.replace(/^[EIW]\d+\s+[\d:.]+\s+\d+\s+\S+\]\s*/, '').trim();
      if (errorText && !errorText.includes('channel is full') && !errorText.includes('CheckTerminalShellSupport')) {
        this.lastError = { at, command: '', headline: truncate(errorText, 80), exitCode: 1 };
        this.pushFeed('warning', 'Erro detectado', truncate(errorText, 120), 'error', at);
      }
    } else if (line.includes('streamGenerateContent')) {
      this.lastCommentary = 'Gerando conteúdo...';
      this.lastCommentaryAt = at;
    }
  }

  applyRecord(record) {
    const at = record.timestamp || new Date().toISOString();
    this.lastRecordAt = at;

    if (record.type === 'artifact_update') {
      this.lastCommentary = record.summary || 'Artefato atualizado';
      this.lastCommentaryAt = at;
      this.pushFeed('assistant', 'Artefato atualizado', truncate(record.summary || '', 120), 'info', at);
    } else if (record.type === 'task_update') {
      this.lastCommentary = record.status || 'Tarefa atualizada';
      this.lastCommentaryAt = at;
      this.pushFeed('task', 'Atualização de tarefa', truncate(record.status || '', 120), 'info', at);
    } else if (record.type === 'activity') {
      this.lastCommentary = record.message || 'Trabalhando...';
      this.lastCommentaryAt = at;
    }
  }

  getRuntimeStatus() {
    const now = Date.now();
    if (this.currentTool && now - new Date(this.currentTool.startedAt).getTime() < 90_000) return 'thinking';
    if (this.lastError && now - new Date(this.lastError.at).getTime() < 90_000) return 'error';
    if (this.lastCommentaryAt && now - new Date(this.lastCommentaryAt).getTime() < 30_000) return 'talking';
    const lastRecordAt = this.lastRecordAt ? new Date(this.lastRecordAt).getTime() : 0;
    if (lastRecordAt && now - lastRecordAt < 60_000) return 'waiting';
    return 'idle';
  }

  buildActors(workspace) {
    const status = this.getRuntimeStatus();
    const actors = [];
    
    let allTerminalsCount = 0;
    let activeTerminals = [];
    if (vscode && vscode.window) {
      allTerminalsCount = vscode.window.terminals.length;
      activeTerminals = vscode.window.terminals.filter(t => 
        t.name.toLowerCase().includes('gemini') || 
        t.name.toLowerCase().includes('antigravity') ||
        t.name.toLowerCase().includes('agent')
      );
    }

    // Agente base / Builder
    actors.push({ 
      id: 'codex', 
      name: 'Gemini Main', 
      role: 'Builder / Ext', 
      sprite: 0, 
      station: 'mainDesk', 
      status, 
      bubble: truncate(this.lastCommentary || `Terminals: ${allTerminalsCount} | Ativos: ${activeTerminals.length}`, 56) 
    });

    if (vscode && vscode.window) {
      const activeTerminals = vscode.window.terminals.filter(t => 
        t.name.toLowerCase().includes('gemini') || 
        t.name.toLowerCase().includes('antigravity') ||
        t.name.toLowerCase().includes('agent')
      );
      
      const stations = ['traceDesk', 'board', 'desk4', 'desk5'];
      
      activeTerminals.forEach((term, idx) => {
        const isSubAgent = term.name.toLowerCase().includes('sub-agent');
        actors.push({
          id: `cli_agent_${idx}`,
          name: term.name,
          role: isSubAgent ? 'Helper' : 'Terminal Agent',
          sprite: isSubAgent ? 5 : ((idx % 4) + 1), // Sprites 1..4 = normal, 5 = helper drone
          station: stations[idx % stations.length],
          status: 'working',
          bubble: truncate(isSubAgent ? 'Supervisionando tarefa...' : 'Processo CLI em execução', 56)
        });
      });
    } else {
      // Fallback: se não carregar o vscode, exibe bots estáticos
      actors.push(
        { id: 'trace', name: 'Trace', role: 'Debugger', sprite: 2, station: 'traceDesk', status: this.lastError ? 'error' : 'idle', bubble: truncate(this.lastError ? `Debug: ${this.lastError.headline}` : 'Monitorando logs', 56) },
        { id: 'scout', name: 'Scout', role: 'Watcher', sprite: 5, station: 'board', status: workspace?.dirtyCount ? 'working' : 'idle', bubble: truncate(workspace?.dirtyCount ? `${workspace.dirtyCount} arquivos modificados` : `Monitorando ${workspace?.projectName || 'workspace'}`, 56) }
      );
    }

    return actors;
  }

  buildSnapshot(workspace, recentProjects = []) {
    const runtimeStatus = this.getRuntimeStatus();
    return {
      session: {
        id: this.session?.id || null,
        cwd: this.session?.cwd || workspace?.cwd || '',
        label: this.session?.label || workspace?.projectName || 'Workspace desconhecido',
        startedAt: this.session?.startedAt || null,
        updatedAt: this.lastRecordAt || this.session?.updatedAt || null,
        source: 'antigravity',
        modelProvider: 'google',
        filePath: this.session?.filePath || null,
      },
      runtime: {
        status: runtimeStatus, model: this.model,
        reasoningEffort: null, currentTool: this.currentTool, lastTool: this.lastTool,
        lastError: this.lastError, lastCommentary: this.lastCommentary, lastUserPrompt: this.lastUserPrompt,
      },
      rateLimits: { planType: 'unknown', primaryPercent: 0, secondaryPercent: 0 },
      workspace,
      highlights: {
        headline: this.lastCommentary ? 'Antigravity ativo' : 'Transcript sincronizado',
        summary: workspace?.cwd ? `Monitorando ${workspace.projectName || workspace.cwd}` : 'Aguardando tarefa ativa.',
        debug: this.lastError?.headline || (workspace?.isGit ? (workspace.dirtyCount ? `${workspace.dirtyCount} arquivos alterados` : `Git limpo em ${workspace.branch}`) : 'Sem insights de workspace.'),
      },
      actors: this.buildActors(workspace),
      feed: this.feed,
      recentProjects,
      meta: { refreshedAt: new Date().toISOString() },
    };
  }
}

// ─── Brain Tailer (monitora filesystem) ─────────────────────────────

class AntigravityBrainTailer {
  constructor(brainDir, onLine, pollMs = 2000) {
    this.brainDir = brainDir;
    this.onLine = onLine;
    this.pollMs = pollMs;
    this.timer = null;
    this.lastCheck = new Map();
  }

  async start() {
    await this.bootstrap();
    this.timer = setInterval(() => this.poll().catch(() => {}), this.pollMs);
  }

  async bootstrap() {
    const artifacts = ['task.md', 'implementation_plan.md', 'walkthrough.md'];
    for (const name of artifacts) {
      const filePath = path.join(this.brainDir, name);
      try {
        const stat = fs.statSync(filePath);
        this.lastCheck.set(name, stat.mtimeMs);
        const metaPath = `${filePath}.metadata.json`;
        if (fs.existsSync(metaPath)) {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          this.onLine(JSON.stringify({ type: 'artifact_update', artifact: name, summary: meta.summary || '', timestamp: meta.updatedAt || stat.mtime.toISOString() }));
        }
      } catch { /* ignore */ }
    }
    // Também monitorar daemon logs
    this.pollDaemon();
  }

  async poll() {
    const artifacts = ['task.md', 'implementation_plan.md', 'walkthrough.md'];
    for (const name of artifacts) {
      const filePath = path.join(this.brainDir, name);
      try {
        const stat = fs.statSync(filePath);
        const prev = this.lastCheck.get(name) || 0;
        if (stat.mtimeMs > prev) {
          this.lastCheck.set(name, stat.mtimeMs);
          let summary = '';
          const metaPath = `${filePath}.metadata.json`;
          if (fs.existsSync(metaPath)) {
            try { summary = JSON.parse(fs.readFileSync(metaPath, 'utf8')).summary || ''; } catch {}
          }
          this.onLine(JSON.stringify({ type: 'artifact_update', artifact: name, summary, timestamp: stat.mtime.toISOString() }));
        }
      } catch { /* ignore */ }
    }
    this.pollDaemon();
  }

  pollDaemon() {
    try {
      const daemonDir = path.join(defaultAntigravityHome(), 'daemon');
      if (!fs.existsSync(daemonDir)) return;
      const files = fs.readdirSync(daemonDir).filter(f => f.endsWith('.log')).sort();
      if (files.length === 0) return;

      const latestLog = path.join(daemonDir, files[files.length - 1]);
      const stat = fs.statSync(latestLog);
      const prevMtime = this.lastCheck.get('daemon.log') || 0;

      if (stat.mtimeMs > prevMtime) {
        this.lastCheck.set('daemon.log', stat.mtimeMs);
        // Ler as últimas linhas do log
        const content = fs.readFileSync(latestLog, 'utf8');
        const lines = content.split('\n').filter(Boolean);
        const tail = lines.slice(-5);
        for (const line of tail) {
          if (line.includes('Requesting planner') || line.includes('streamGenerateContent')) {
            this.onLine(line);
          }
        }
      }
    } catch { /* ignore */ }
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
}

// ─── Antigravity Adapter (inline CJS) ───────────────────────────────

function createAntigravityAdapter() {
  return {
    id: 'antigravity',
    displayName: 'Antigravity',
    description: 'Google Antigravity — Gemini AI coding agent',

    getHomePath() { return defaultAntigravityHome(); },

    scanSessions() {
      const brainDir = path.join(this.getHomePath(), 'brain');
      if (!fs.existsSync(brainDir)) return [];
      const entries = fs.readdirSync(brainDir, { withFileTypes: true });
      const sessions = [];

      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'tempmediaStorage') continue;
        const convDir = path.join(brainDir, entry.name);
        try {
          const stat = fs.statSync(convDir);
          let label = entry.name.slice(0, 8);
          for (const metaFile of ['task.md.metadata.json', 'implementation_plan.md.metadata.json']) {
            const metaPath = path.join(convDir, metaFile);
            if (fs.existsSync(metaPath)) {
              try {
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                if (meta.summary) { label = truncate(meta.summary, 40); break; }
              } catch {}
            }
          }

          // Extrair cwd do task.md
          let cwd = '';
          const taskPath = path.join(convDir, 'task.md');
          if (fs.existsSync(taskPath)) {
            try {
              const content = fs.readFileSync(taskPath, 'utf8').slice(0, 2000);
              const m = content.match(/[A-Z]:\\[^\s`"']+/);
              if (m) cwd = m[0];
            } catch {}
          }

          sessions.push({
            id: entry.name, filePath: convDir, cwd, cwdNormalized: normalizeFsPath(cwd),
            source: 'antigravity', modelProvider: 'google',
            startedAt: stat.birthtime.toISOString(), updatedAt: stat.mtime.toISOString(),
            updatedAtMs: stat.mtimeMs, label,
          });
        } catch {}
      }
      return sessions.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
    },

    findLatestSession(workspacePath) {
      const sessions = this.scanSessions();
      if (!workspacePath) return sessions[0] || null;
      const normalized = normalizeFsPath(workspacePath);
      for (const s of sessions) {
        if (!s.cwdNormalized) continue;
        if (s.cwdNormalized === normalized || s.cwdNormalized.startsWith(normalized + '/') || normalized.startsWith(s.cwdNormalized + '/')) return s;
      }
      return sessions[0] || null;
    },

    listRecentProjects() {
      const sessions = this.scanSessions();
      const seen = new Map();
      for (const s of sessions) {
        const key = s.cwdNormalized || s.id;
        if (!seen.has(key)) seen.set(key, { cwd: s.cwd || s.filePath, cwdNormalized: s.cwdNormalized || s.id, label: s.label, updatedAt: s.updatedAt, updatedAtMs: s.updatedAtMs });
      }
      return [...seen.values()].sort((a, b) => b.updatedAtMs - a.updatedAtMs).slice(0, 10);
    },

    createTailer(session, onLine) { return new AntigravityBrainTailer(session.filePath, onLine); },
    createModel(session) { return new AntigravityTranscriptModel(session); },
  };
}

// ─── Codex Adapter (inline CJS) ─────────────────────────────────────

function createCodexAdapter() {
  return {
    id: 'codex',
    displayName: 'Codex Desktop',

    scanSessions() {
      const sessionsDir = path.join(defaultCodexHome(), 'sessions');
      if (!fs.existsSync(sessionsDir)) return [];
      return [];
    },
    findLatestSession() { return null; },
    listRecentProjects() { return []; },
    createTailer(_s, _cb) { return { start: async () => {}, stop: () => {} }; },
    createModel(session) { return new AntigravityTranscriptModel(session); },
  };
}

module.exports = { PixelLabBridge };
