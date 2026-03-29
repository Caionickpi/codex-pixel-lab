import { compactText, firstMeaningfulLine, formatRelativeTime, isLikelyMetaUserMessage, truncate } from './utils.js';

function extractTextContent(content) {
  if (!content) return '';
  if (typeof content === 'string') return compactText(content);
  if (!Array.isArray(content)) return '';

  return compactText(
    content
      .map((block) => {
        if (typeof block === 'string') return block;
        if (block?.text) return block.text;
        if (block?.type === 'output_text' && block?.text) return block.text;
        if (block?.type === 'input_text' && block?.text) return block.text;
        return '';
      })
      .join(' '),
  );
}

function parseArguments(argumentsText) {
  if (!argumentsText) return {};
  try {
    return JSON.parse(argumentsText);
  } catch {
    return {};
  }
}

function summarizeShellOutput(output) {
  const exitCodeMatch = String(output || '').match(/Exit code:\s*(-?\d+)/i);
  const exitCode = exitCodeMatch ? Number(exitCodeMatch[1]) : null;
  const headline = firstMeaningfulLine(output) || (exitCode === 0 ? 'Command completed.' : 'Command returned an error.');
  return {
    exitCode,
    headline,
  };
}

function classifyTool(name, args) {
  if (name === 'shell_command') {
    return {
      kind: 'shell',
      label: args.command || 'Shell command',
    };
  }

  if (name === 'read_thread_terminal') {
    return {
      kind: 'terminal',
      label: 'Reading terminal output',
    };
  }

  if (name.startsWith('mcp__')) {
    return {
      kind: 'connector',
      label: name.replace(/^mcp__/, '').replace(/__/g, ' / '),
    };
  }

  return {
    kind: 'tool',
    label: name,
  };
}

function inferShellActivity(command = '') {
  const text = String(command).toLowerCase();
  if (!text) return 'Running shell';
  if (/\b(playwright|browser|screenshot)\b/.test(text)) return 'Testing view';
  if (/\b(npm|pnpm|yarn|bun)\b.*\b(dev|build|test|lint|start)\b/.test(text)) return 'Running task';
  if (/\bgit\b/.test(text)) return 'Checking git';
  if (/\b(rg|select-string|get-childitem|get-content|cat|ls|dir|find)\b/.test(text)) return 'Scanning files';
  if (/\b(node|python)\b/.test(text)) return 'Running script';
  if (/\b(curl|invoke-webrequest|wget)\b/.test(text)) return 'Checking endpoint';
  return 'Running shell';
}

function inferCommentaryActivity(text = '') {
  const lower = String(text).toLowerCase();
  if (!lower) return '';
  if (/\b(test|valid|verify|browser|screenshot|playwright)\b/.test(lower)) return 'Testing view';
  if (/\b(edit|ajust|polid|refactor|patch|css|design|ui)\b/.test(lower)) return 'Editing UI';
  if (/\b(read|inspect|review|scan|analis|revis|context)\b/.test(lower)) return 'Reviewing code';
  if (/\b(connect|sync|session|transcript)\b/.test(lower)) return 'Syncing session';
  if (/\b(plan|next|agora|vou|depois)\b/.test(lower)) return 'Planning next step';
  return truncate(firstMeaningfulLine(text) || 'Working', 32);
}

function conciseBranchLabel(workspace) {
  if (!workspace?.isGit) return 'Workspace linked';
  if (workspace.dirtyCount) {
    return `${workspace.dirtyCount} file${workspace.dirtyCount === 1 ? '' : 's'} changed`;
  }
  return workspace.branch ? `Git clean on ${workspace.branch}` : 'Git clean';
}

function summarizeMission(text = '') {
  const lower = compactText(text).toLowerCase();
  if (!lower) return 'current request';
  if (/\b(bubble|chat|agent)\b/.test(lower)) return 'agent dialogue';
  if (/\b(github|repo|repository|readme|english|commit)\b/.test(lower)) return 'GitHub launch pack';
  if (/\b(profile|level|progress|coin|upgrade|title)\b/.test(lower)) return 'player progression';
  if (/\b(design|ui|layout|style|visual|modal)\b/.test(lower)) return 'UI polish';
  if (/\b(scene|office|desk|animation|lighting|environment)\b/.test(lower)) return 'office world';
  if (/\b(debug|bug|fix|error|health)\b/.test(lower)) return 'debug pass';
  return truncate(firstMeaningfulLine(text) || 'current request', 42);
}

function summarizeShellFocus(command = '') {
  const text = compactText(command);
  const lower = text.toLowerCase();
  if (!lower) return 'shell task';
  if (/\bnode --check\b/.test(lower)) return 'syntax check';
  if (/\bplaywright\b/.test(lower)) return 'browser verification';
  if (/\binvoke-webrequest|curl|wget\b/.test(lower)) return 'local API check';
  if (/\bgh auth\b/.test(lower)) return 'GitHub auth';
  if (/\bgh repo create\b/.test(lower)) return 'repo publish';
  if (/\bgh api\b/.test(lower)) return 'GitHub data pull';
  if (/\bgit init\b/.test(lower)) return 'git bootstrap';
  if (/\bgit add|git commit\b/.test(lower)) return 'git commit flow';
  if (/\bget-content|cat\b/.test(lower)) return 'file read';
  if (/\brg|select-string|find\b/.test(lower)) return 'code search';
  return truncate(text, 36);
}

function describeCodexDuty(model) {
  if (model.currentTool?.kind === 'shell') {
    return `Building ${summarizeMission(model.lastUserPrompt)} via ${summarizeShellFocus(model.currentTool.command)}`;
  }

  if (model.currentTool?.kind === 'research') {
    return `Researching ${summarizeMission(model.lastUserPrompt)} sources`;
  }

  if (model.currentTool?.kind === 'terminal') {
    return 'Reading terminal state and next actions';
  }

  if (model.lastCommentary) {
    return `${inferCommentaryActivity(model.lastCommentary)} for ${summarizeMission(model.lastUserPrompt)}`;
  }

  if (model.lastUserPrompt) {
    return `Preparing ${summarizeMission(model.lastUserPrompt)}`;
  }

  return 'Standing by for the next build task';
}

function describeTraceDuty(model) {
  if (model.lastError) {
    return `Debugging failure: ${truncate(model.lastError.headline, 30)}`;
  }

  if (model.currentTool?.kind === 'shell') {
    return `Watching ${summarizeShellFocus(model.currentTool.command)} output`;
  }

  if (model.lastTool?.name === 'shell_command') {
    return `Verified ${summarizeShellFocus(model.lastTool.command)} results`;
  }

  if (model.currentTool?.kind === 'terminal') {
    return 'Checking terminal logs for regressions';
  }

  return 'Watching runtime logs and command health';
}

function describeScoutDuty(workspace, model) {
  const project = workspace?.projectName || 'workspace';

  if (!workspace?.isGit) {
    return `Tracking ${project} workspace sync`;
  }

  if (workspace.dirtyCount) {
    return `Tracking ${project} on ${workspace.branch || 'detached'} with ${workspace.dirtyCount} changed`;
  }

  if (model.currentTool?.kind === 'research') {
    return `Tracking ${project} context while research runs`;
  }

  return `Tracking ${project} on ${workspace.branch || 'detached'}, clean tree`;
}

export class CodexTranscriptModel {
  constructor(session) {
    this.session = session;
    this.feed = [];
    this.pendingCalls = new Map();
    this.currentTool = null;
    this.lastTool = null;
    this.lastCommentary = '';
    this.lastCommentaryAt = null;
    this.lastUserPrompt = '';
    this.lastWebQuery = '';
    this.lastError = null;
    this.lastRecordAt = session?.updatedAt || null;
    this.rateLimits = null;
    this.model = null;
    this.reasoningEffort = null;
    this.turnCount = 0;
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
      // Ignore malformed partial lines during polling.
    }
  }

  applyRecord(record) {
    const at = record.timestamp || new Date().toISOString();
    this.lastRecordAt = at;

    switch (record.type) {
      case 'turn_context':
        this.model = record.payload?.model || this.model;
        this.reasoningEffort = record.payload?.effort || this.reasoningEffort;
        break;
      case 'event_msg':
        this.handleEvent(record.payload || {}, at);
        break;
      case 'response_item':
        this.handleResponseItem(record.payload || {}, at);
        break;
      default:
        break;
    }
  }

  handleEvent(payload, at) {
    switch (payload.type) {
      case 'task_started':
        this.turnCount += 1;
        this.pushFeed('task', 'New turn started', `Turn ${this.turnCount} is now active.`, 'info', at);
        break;
      case 'agent_message':
        if (payload.message) {
          this.lastCommentary = compactText(payload.message);
          this.lastCommentaryAt = at;
          this.pushFeed('commentary', 'Codex update', this.lastCommentary, 'info', at);
        }
        break;
      case 'token_count':
        this.rateLimits = payload.rate_limits || null;
        break;
      case 'turn_aborted':
        this.pushFeed('warning', 'Turn interrupted', 'The current turn was aborted and may have partial side effects.', 'warning', at);
        break;
      default:
        break;
    }
  }

  handleResponseItem(payload, at) {
    switch (payload.type) {
      case 'message':
        this.handleMessage(payload, at);
        break;
      case 'function_call':
        this.handleFunctionCall(payload, at);
        break;
      case 'function_call_output':
        this.handleFunctionOutput(payload, at);
        break;
      case 'web_search_call':
        this.handleWebSearch(payload, at);
        break;
      case 'reasoning':
        this.pushFeed('reasoning', 'Codex is reasoning', 'High-effort reasoning is active in the current turn.', 'info', at);
        break;
      default:
        break;
    }
  }

  handleMessage(payload, at) {
    const role = payload.role;
    const text = extractTextContent(payload.content);
    if (!text) return;

    if (role === 'user' && !isLikelyMetaUserMessage(text)) {
      this.lastUserPrompt = text;
      this.pushFeed('mission', 'Mission updated', truncate(text, 160), 'info', at);
      return;
    }

    if (role === 'assistant') {
      this.lastCommentary = text;
      this.lastCommentaryAt = at;
      const title = payload.phase === 'commentary' ? 'Codex update' : 'Codex reply';
      this.pushFeed('assistant', title, truncate(text, 180), 'info', at);
    }
  }

  handleFunctionCall(payload, at) {
    const args = parseArguments(payload.arguments);
    const info = classifyTool(payload.name || 'tool', args);
    const entry = {
      id: payload.call_id,
      name: payload.name || 'tool',
      kind: info.kind,
      label: info.label,
      command: args.command || '',
      arguments: args,
      startedAt: at,
    };

    this.pendingCalls.set(payload.call_id, entry);
    this.currentTool = entry;
    this.lastTool = entry;

    const detail = entry.command ? truncate(entry.command, 150) : entry.label;
    this.pushFeed('tool', `Tool: ${entry.name}`, detail, 'info', at);
  }

  handleFunctionOutput(payload, at) {
    const pending = this.pendingCalls.get(payload.call_id) || null;
    if (pending) {
      this.pendingCalls.delete(payload.call_id);
    }

    const tool = pending || this.lastTool;
    const output = String(payload.output || '');

    if (tool?.name === 'shell_command') {
      const summary = summarizeShellOutput(output);
      this.lastTool = {
        ...tool,
        finishedAt: at,
        exitCode: summary.exitCode,
        headline: summary.headline,
      };

      if (summary.exitCode !== null && summary.exitCode !== 0) {
        this.lastError = {
          at,
          command: tool.command,
          headline: summary.headline,
          exitCode: summary.exitCode,
        };
        this.pushFeed('shell', 'Shell command failed', `${truncate(tool.command, 92)} • ${summary.headline}`, 'error', at);
      } else {
        this.lastError = null;
        this.pushFeed('shell', 'Shell command finished', `${truncate(tool.command, 92)} • ${summary.headline}`, 'success', at);
      }
    } else if (tool) {
      this.lastTool = {
        ...tool,
        finishedAt: at,
        headline: firstMeaningfulLine(output) || 'Tool finished.',
      };
      this.pushFeed('tool', `${tool.name} finished`, this.lastTool.headline, 'success', at);
    }

    if (this.currentTool?.id === payload.call_id) {
      this.currentTool = null;
    }
  }

  handleWebSearch(payload, at) {
    const action = payload.action || {};
    const query = action.query || action.url || '';
    this.lastWebQuery = compactText(query);
    this.currentTool = {
      id: `web-${at}`,
      name: action.type || 'web_search',
      kind: 'research',
      label: this.lastWebQuery || 'Web research',
      command: '',
      arguments: action,
      startedAt: at,
    };
    this.lastTool = this.currentTool;
    this.pushFeed('web', 'Web research', truncate(this.lastWebQuery || 'Opening web source', 150), 'info', at);
  }

  getRuntimeStatus() {
    const now = Date.now();
    const currentStartedAt = this.currentTool ? new Date(this.currentTool.startedAt).getTime() : 0;
    const lastErrorAt = this.lastError ? new Date(this.lastError.at).getTime() : 0;
    const lastCommentaryAt = this.lastCommentaryAt ? new Date(this.lastCommentaryAt).getTime() : 0;
    const lastRecordAt = this.lastRecordAt ? new Date(this.lastRecordAt).getTime() : 0;

    if (this.currentTool && now - currentStartedAt < 90_000) {
      if (this.currentTool.kind === 'research') return 'research';
      if (this.currentTool.kind === 'shell' || this.currentTool.kind === 'terminal') return 'working';
      return 'thinking';
    }

    if (this.lastError && now - lastErrorAt < 90_000) {
      return 'error';
    }

    if (this.lastCommentary && now - lastCommentaryAt < 30_000) {
      return 'talking';
    }

    if (lastRecordAt && now - lastRecordAt < 60_000) {
      return 'waiting';
    }

    return 'idle';
  }

  buildActors(workspace) {
    const runtimeStatus = this.getRuntimeStatus();
    const mainBubble = describeCodexDuty(this);
    const traceBubble = describeTraceDuty(this);
    const scoutBubble = describeScoutDuty(workspace, this);

    return [
      {
        id: 'codex',
        name: 'Codex',
        role: 'Builder',
        sprite: 0,
        station: 'mainDesk',
        status: runtimeStatus,
        bubble: truncate(mainBubble, 56),
      },
      {
        id: 'trace',
        name: 'Trace',
        role: 'Debugger',
        sprite: 2,
        station: 'traceDesk',
        status: this.lastError ? 'error' : this.currentTool?.kind === 'shell' ? 'working' : 'idle',
        bubble: truncate(traceBubble, 56),
      },
      {
        id: 'scout',
        name: 'Scout',
        role: 'Watcher',
        sprite: 5,
        station: 'board',
        status: workspace?.dirtyCount ? 'working' : 'idle',
        bubble: truncate(scoutBubble, 56),
      },
    ];
  }

  buildSnapshot(workspace, recentProjects = []) {
    const runtimeStatus = this.getRuntimeStatus();
    const primary = this.rateLimits?.primary || null;
    const secondary = this.rateLimits?.secondary || null;

    return {
      session: {
        id: this.session?.id || null,
        cwd: this.session?.cwd || workspace?.cwd || '',
        label: this.session?.label || workspace?.projectName || 'Unknown workspace',
        startedAt: this.session?.startedAt || null,
        updatedAt: this.lastRecordAt || this.session?.updatedAt || null,
        source: this.session?.source || 'codex',
        modelProvider: this.session?.modelProvider || 'openai',
        filePath: this.session?.filePath || null,
      },
      runtime: {
        status: runtimeStatus,
        model: this.model,
        reasoningEffort: this.reasoningEffort,
        currentTool: this.currentTool,
        lastTool: this.lastTool,
        lastError: this.lastError,
        lastCommentary: this.lastCommentary,
        lastUserPrompt: this.lastUserPrompt,
      },
      rateLimits: {
        planType: this.rateLimits?.plan_type || 'unknown',
        primaryPercent: primary?.used_percent ?? 0,
        secondaryPercent: secondary?.used_percent ?? 0,
        primaryWindowMinutes: primary?.window_minutes ?? null,
        secondaryWindowMinutes: secondary?.window_minutes ?? null,
        primaryResetsAt: primary?.resets_at ? new Date(primary.resets_at * 1000).toISOString() : null,
        secondaryResetsAt: secondary?.resets_at ? new Date(secondary.resets_at * 1000).toISOString() : null,
      },
      workspace,
      highlights: {
        headline:
          this.currentTool?.kind === 'shell'
            ? inferShellActivity(this.currentTool.command)
            : this.currentTool?.kind === 'research'
              ? 'Researching web'
              : inferCommentaryActivity(this.lastCommentary) || 'Transcript synced',
        summary: workspace?.cwd ? `Watching ${workspace.projectName || workspace.cwd}` : 'Waiting for an active Codex task.',
        debug: this.lastError?.headline || (workspace?.isGit ? conciseBranchLabel(workspace) : 'Workspace insights unavailable.'),
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
