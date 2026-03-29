import fs from 'node:fs';
import path from 'node:path';

import { defaultCodexHome, displayPath, normalizeFsPath } from './utils.js';

function walkRollouts(dir, output) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkRollouts(fullPath, output);
      continue;
    }
    if (entry.isFile() && entry.name.startsWith('rollout-') && entry.name.endsWith('.jsonl')) {
      output.push(fullPath);
    }
  }
}

function readFirstJsonLine(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const firstLine = text.split(/\r?\n/, 1)[0];
  return JSON.parse(firstLine);
}

function makeSessionRecord(filePath) {
  try {
    const firstRecord = readFirstJsonLine(filePath);
    const payload = firstRecord?.payload ?? {};
    const stats = fs.statSync(filePath);
    const cwd = displayPath(payload.cwd || '');
    return {
      id: payload.id || path.basename(filePath, '.jsonl'),
      filePath,
      cwd,
      cwdNormalized: normalizeFsPath(cwd),
      source: payload.source || 'codex',
      modelProvider: payload.model_provider || 'openai',
      startedAt: payload.timestamp || stats.birthtime.toISOString(),
      updatedAt: stats.mtime.toISOString(),
      updatedAtMs: stats.mtimeMs,
      label: path.basename(cwd || filePath),
      originator: payload.originator || 'Codex Desktop',
    };
  } catch {
    return null;
  }
}

export function scanSessions(codexHome = defaultCodexHome()) {
  const sessionsRoot = path.join(codexHome, 'sessions');
  const rolloutFiles = [];
  walkRollouts(sessionsRoot, rolloutFiles);

  return rolloutFiles
    .map(makeSessionRecord)
    .filter(Boolean)
    .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
}

function scoreWorkspaceMatch(sessionPath, workspacePath) {
  if (!workspacePath) return 0;
  if (sessionPath === workspacePath) return 3;
  if (sessionPath.startsWith(`${workspacePath}${path.sep}`)) return 2;
  if (workspacePath.startsWith(`${sessionPath}${path.sep}`)) return 1;
  return 0;
}

export function findLatestSessionForWorkspace(workspacePath, codexHome = defaultCodexHome()) {
  const sessions = scanSessions(codexHome);
  if (!workspacePath) return sessions[0] || null;

  const normalized = normalizeFsPath(workspacePath);
  const matches = sessions
    .map((session) => ({ session, score: scoreWorkspaceMatch(session.cwdNormalized, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.session.updatedAtMs - a.session.updatedAtMs);

  return matches[0]?.session || null;
}

export function listRecentProjects(codexHome = defaultCodexHome()) {
  const sessions = scanSessions(codexHome);
  const distinct = new Map();

  for (const session of sessions) {
    if (!session.cwdNormalized) continue;
    if (!distinct.has(session.cwdNormalized)) {
      distinct.set(session.cwdNormalized, {
        cwd: session.cwd,
        cwdNormalized: session.cwdNormalized,
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
