import fs from 'node:fs';
import path from 'node:path';

import { IdeAdapter } from './adapter-interface.js';
import { defaultAntigravityHome } from '../utils.js';
import { normalizeFsPath, displayPath, truncate, compactText, firstMeaningfulLine, formatRelativeTime } from '../utils.js';

/**
 * Antigravity transcript model.
 *
 * Since Antigravity stores conversations as binary protobuf files, this model
 * derives activity from the readable `brain/` directory artifacts:
 *   - task.md, implementation_plan.md, walkthrough.md presence and timestamps
 *   - metadata.json files for summaries
 *   - file modification times as real-time activity signals
 *   - daemon log files for request/error timestamps
 */
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
    this.lastKnownMtime = 0;
  }

  pushFeed(kind, title, detail, level = 'info', at = new Date().toISOString()) {
    const normalizedDetail = compactText(detail);
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind,
      title,
      detail: normalizedDetail,
      level,
      at,
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
      // Non-JSON lines are daemon log lines, parse them differently.
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
        name: 'planner',
        kind: 'tool',
        label: 'Antigravity reasoning',
        command: '',
        arguments: {},
        startedAt: at,
      };
      this.lastTool = this.currentTool;
      this.lastCommentary = 'Antigravity is reasoning...';
      this.lastCommentaryAt = at;
      this.pushFeed('task', 'Turn active', `Antigravity turn ${this.turnCount}`, 'info', at);
    } else if (line.includes('error') || line.includes('ERROR')) {
      const errorText = line.replace(/^[EIW]\d+\s+[\d:.]+\s+\d+\s+\S+\]\s*/, '').trim();
      if (errorText && !errorText.includes('channel is full') && !errorText.includes('CheckTerminalShellSupport')) {
        this.lastError = {
          at,
          command: '',
          headline: truncate(errorText, 80),
          exitCode: 1,
        };
        this.pushFeed('warning', 'Error detected', truncate(errorText, 120), 'error', at);
      }
    } else if (line.includes('streamGenerateContent')) {
      this.lastCommentary = 'Generating content...';
      this.lastCommentaryAt = at;
    } else if (line.includes('CORTEX_STEP_TYPE_')) {
      const typeMatch = line.match(/CORTEX_STEP_TYPE_([A-Z_]+)/);
      if (typeMatch) {
        const type = typeMatch[1];
        let kind = 'tool';
        let label = type.toLowerCase().replace(/_/g, ' ');

        if (['CODE_ACTION', 'SEND_COMMAND_INPUT', 'WRITE_FILE', 'OPEN_BROWSER_URL'].includes(type)) {
          kind = 'shell'; // Triggers 'working' state
        } else if (['LIST_DIRECTORY', 'READ_FILE', 'SEARCH', 'GET_FILE_TREE', 'FIND_FILES'].includes(type)) {
          kind = 'research'; // Triggers 'research' state
        }

        this.currentTool = {
          id: `ag-step-${Date.now()}`,
          name: type,
          kind,
          label: `Executing ${label}`,
          command: '',
          arguments: {},
          startedAt: at,
        };
        this.lastTool = this.currentTool;
        this.lastCommentary = `Executing ${label}...`;
        this.lastCommentaryAt = at;
      }
    }
  }

  applyRecord(record) {
    const at = record.timestamp || new Date().toISOString();
    this.lastRecordAt = at;

    if (record.type === 'artifact_update') {
      this.lastCommentary = record.summary || `Updated ${record.artifact || 'artifact'}`;
      this.lastCommentaryAt = at;
      // Triggers 'working' state for artifacts
      this.currentTool = {
        id: `ag-art-${Date.now()}`,
        name: 'artifact',
        kind: 'shell', 
        label: `Updating ${record.artifact}`,
        command: '',
        arguments: {},
        startedAt: at,
      };
      this.pushFeed('assistant', 'Artifact updated', truncate(record.summary || record.artifact || '', 120), 'info', at);
    } else if (record.type === 'task_update') {
      this.lastCommentary = record.status || 'Task updated';
      this.lastCommentaryAt = at;
      this.pushFeed('task', 'Task update', truncate(record.status || '', 120), 'info', at);
    } else if (record.type === 'activity') {
      this.lastCommentary = record.message || 'Working...';
      this.lastCommentaryAt = at;
      this.pushFeed('commentary', 'Antigravity update', truncate(record.message || '', 120), 'info', at);
    }
  }

  getRuntimeStatus() {
    const now = Date.now();
    const lastRecordAt = this.lastRecordAt ? new Date(this.lastRecordAt).getTime() : 0;
    const lastErrorAt = this.lastError ? new Date(this.lastError.at).getTime() : 0;

    if (this.currentTool && now - new Date(this.currentTool.startedAt).getTime() < 300_000) {
      if (this.currentTool.kind === 'research') return 'research';
      if (this.currentTool.kind === 'shell') return 'working';
      return 'thinking';
    }

    if (this.lastError && now - lastErrorAt < 60_000) {
      return 'error';
    }

    if (this.lastCommentaryAt && now - new Date(this.lastCommentaryAt).getTime() < 30_000) {
      return 'talking';
    }

    if (lastRecordAt && now - lastRecordAt < 60_000) {
      return 'waiting';
    }

    return 'idle';
  }

  buildActors(workspace) {
    const runtimeStatus = this.getRuntimeStatus();

    return [
      {
        id: 'codex',
        name: 'Antigravity',
        role: 'Builder',
        sprite: 0,
        station: 'mainDesk',
        status: runtimeStatus,
        bubble: truncate(this.lastCommentary || 'Standing by for the next task', 120),
      },
      {
        id: 'trace',
        name: 'Trace',
        role: 'Debugger',
        sprite: 2,
        station: 'traceDesk',
        status: this.lastError ? 'error' : 'idle',
        bubble: truncate(
          this.lastError ? `Debugging: ${this.lastError.headline}` : 'Watching runtime logs and command health',
          56,
        ),
      },
      {
        id: 'scout',
        name: 'Scout',
        role: 'Watcher',
        sprite: 5,
        station: 'board',
        status: workspace?.dirtyCount ? 'working' : 'idle',
        bubble: truncate(
          workspace?.dirtyCount
            ? `Tracking ${workspace.projectName || 'workspace'} with ${workspace.dirtyCount} changed`
            : `Tracking ${workspace.projectName || 'workspace'} workspace`,
          56,
        ),
      },
    ];
  }

  buildSnapshot(workspace, recentProjects = []) {
    const runtimeStatus = this.getRuntimeStatus();

    return {
      session: {
        id: this.session?.id || null,
        cwd: this.session?.cwd || workspace?.cwd || '',
        label: this.session?.label || workspace?.projectName || 'Unknown workspace',
        startedAt: this.session?.startedAt || null,
        updatedAt: this.lastRecordAt || this.session?.updatedAt || null,
        source: 'antigravity',
        modelProvider: 'google',
        filePath: this.session?.filePath || null,
      },
      runtime: {
        status: runtimeStatus,
        model: this.model,
        reasoningEffort: null,
        currentTool: this.currentTool,
        lastTool: this.lastTool,
        lastError: this.lastError,
        lastCommentary: this.lastCommentary,
        lastUserPrompt: this.lastUserPrompt,
      },
      rateLimits: {
        planType: 'unknown',
        primaryPercent: 0,
        secondaryPercent: 0,
        primaryWindowMinutes: null,
        secondaryWindowMinutes: null,
        primaryResetsAt: null,
        secondaryResetsAt: null,
      },
      workspace,
      highlights: {
        headline: this.lastCommentary ? 'Antigravity active' : 'Transcript synced',
        summary: workspace?.cwd ? `Watching ${workspace.projectName || workspace.cwd}` : 'Waiting for an active Antigravity task.',
        debug: this.lastError?.headline || (workspace?.isGit ? (workspace.dirtyCount ? `${workspace.dirtyCount} files changed` : `Git clean on ${workspace.branch}`) : 'Workspace insights unavailable.'),
      },
      actors: this.buildActors(workspace),
      feed: this.feed,
      recentProjects,
      meta: {
        refreshedAt: new Date().toISOString(),
      },
    };
  }
}

/**
 * File-system tailer for Antigravity brain directories.
 *
 * Watches a conversation's brain directory for file changes and emits
 * synthetic activity events as "lines" for the model to consume.
 */
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
    this.timer = setInterval(() => {
      this.poll().catch(() => {});
    }, this.pollMs);
  }

  async bootstrap() {
    // Read initial state of artifacts
    const artifacts = ['task.md', 'implementation_plan.md', 'walkthrough.md'];
    for (const name of artifacts) {
      const filePath = path.join(this.brainDir, name);
      try {
        const stat = fs.statSync(filePath);
        this.lastCheck.set(name, stat.mtimeMs);

        // Read metadata if available
        const metaPath = `${filePath}.metadata.json`;
        if (fs.existsSync(metaPath)) {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          this.onLine(JSON.stringify({
            type: 'artifact_update',
            artifact: name,
            summary: meta.summary || '',
            timestamp: meta.updatedAt || stat.mtime.toISOString(),
          }));
        }
      } catch {
        // File doesn't exist yet, that's fine.
      }
    }
    this.pollDaemon();
  }

  async poll() {
    const artifacts = ['task.md', 'implementation_plan.md', 'walkthrough.md'];
    for (const name of artifacts) {
      const filePath = path.join(this.brainDir, name);
      try {
        const stat = fs.statSync(filePath);
        const previousMtime = this.lastCheck.get(name) || 0;

        if (stat.mtimeMs > previousMtime) {
          this.lastCheck.set(name, stat.mtimeMs);

          const metaPath = `${filePath}.metadata.json`;
          let summary = '';
          if (fs.existsSync(metaPath)) {
            try {
              const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
              summary = meta.summary || '';
            } catch { /* ignore */ }
          }

          this.onLine(JSON.stringify({
            type: 'artifact_update',
            artifact: name,
            summary,
            timestamp: stat.mtime.toISOString(),
          }));
        }
      } catch {
        // File removed or not yet created — skip.
      }
    }

    // Also check for any new .pb conversation file changes
    try {
      const convPath = this.brainDir.replace(/[/\\]brain[/\\][^/\\]+$/, path.sep + 'conversations');
      const convId = path.basename(this.brainDir);
      const pbFile = path.join(convPath, `${convId}.pb`);
      if (fs.existsSync(pbFile)) {
        const stat = fs.statSync(pbFile);
        const prevMtime = this.lastCheck.get('conversation.pb') || 0;
        if (stat.mtimeMs > prevMtime) {
          this.lastCheck.set('conversation.pb', stat.mtimeMs);
          this.onLine(JSON.stringify({
            type: 'activity',
            message: 'Conversation updated',
            timestamp: stat.mtime.toISOString(),
          }));
        }
      }
    } catch { /* ignore */ }

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
        const tail = lines.slice(-10);
        for (const line of tail) {
          if (
            line.includes('Requesting planner') ||
            line.includes('streamGenerateContent') ||
            line.includes('CORTEX_STEP_TYPE_')
          ) {
            this.onLine(line);
          }
        }
      }
    } catch { /* ignore */ }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

/**
 * Adapter for Antigravity (Google Gemini coding agent).
 */
export class AntigravityAdapter extends IdeAdapter {
  get id() {
    return 'antigravity';
  }

  get displayName() {
    return 'Antigravity';
  }

  get description() {
    return 'Google Antigravity — Gemini-powered coding agent';
  }

  getHomePath() {
    return defaultAntigravityHome();
  }

  scanSessions() {
    const brainDir = path.join(this.getHomePath(), 'brain');
    if (!fs.existsSync(brainDir)) return [];

    const entries = fs.readdirSync(brainDir, { withFileTypes: true });
    const sessions = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name === 'tempmediaStorage') continue;

      const convDir = path.join(brainDir, entry.name);
      try {
        const stat = fs.statSync(convDir);

        // Try to read metadata from task.md or implementation_plan.md
        let label = entry.name.slice(0, 8);
        let summary = '';
        const taskPath = path.join(convDir, 'task.md.metadata.json');
        const planPath = path.join(convDir, 'implementation_plan.md.metadata.json');

        for (const metaPath of [taskPath, planPath]) {
          if (fs.existsSync(metaPath)) {
            try {
              const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
              if (meta.summary) {
                summary = meta.summary;
                label = truncate(meta.summary, 40);
                break;
              }
            } catch { /* ignore */ }
          }
        }

        // Try to find workspace path from any task.md content mentioning paths
        let cwd = '';
        const taskMdPath = path.join(convDir, 'task.md');
        if (fs.existsSync(taskMdPath)) {
          try {
            const content = fs.readFileSync(taskMdPath, 'utf8').slice(0, 2000);
            const pathMatch = content.match(/[A-Z]:\\[^\s`"']+/);
            if (pathMatch) {
              cwd = displayPath(pathMatch[0]);
            }
          } catch { /* ignore */ }
        }

        sessions.push({
          id: entry.name,
          filePath: convDir,
          cwd,
          cwdNormalized: normalizeFsPath(cwd),
          source: 'antigravity',
          modelProvider: 'google',
          startedAt: stat.birthtime.toISOString(),
          updatedAt: stat.mtime.toISOString(),
          updatedAtMs: stat.mtimeMs,
          label,
          originator: 'Antigravity Desktop',
        });
      } catch {
        // Skip broken entries.
      }
    }

    return sessions.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  }

  findLatestSession(workspacePath) {
    const sessions = this.scanSessions();
    if (!workspacePath) return sessions[0] || null;

    const normalized = normalizeFsPath(workspacePath);
    for (const session of sessions) {
      if (!session.cwdNormalized) continue;
      if (session.cwdNormalized === normalized) return session;
      if (session.cwdNormalized.startsWith(`${normalized}${path.sep}`)) return session;
      if (normalized.startsWith(`${session.cwdNormalized}${path.sep}`)) return session;
    }

    return sessions[0] || null;
  }

  listRecentProjects() {
    const sessions = this.scanSessions();
    const distinct = new Map();

    for (const session of sessions) {
      const key = session.cwdNormalized || session.id;
      if (!distinct.has(key)) {
        distinct.set(key, {
          cwd: session.cwd || session.filePath,
          cwdNormalized: session.cwdNormalized || session.id,
          label: session.label,
          updatedAt: session.updatedAt,
          updatedAtMs: session.updatedAtMs,
        });
      }
    }

    return [...distinct.values()]
      .sort((a, b) => b.updatedAtMs - a.updatedAtMs)
      .slice(0, 10);
  }

  createTailer(session, onLine) {
    return new AntigravityBrainTailer(session.filePath, onLine);
  }

  createModel(session) {
    return new AntigravityTranscriptModel(session);
  }
}
