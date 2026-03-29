import os from 'node:os';
import path from 'node:path';

const WINDOWS_NAMESPACE_PREFIX = '\\\\?\\';

export function stripWindowsNamespace(input) {
  if (!input) return '';
  return input.startsWith(WINDOWS_NAMESPACE_PREFIX) ? input.slice(WINDOWS_NAMESPACE_PREFIX.length) : input;
}

export function normalizeFsPath(input) {
  if (!input) return '';
  const stripped = stripWindowsNamespace(String(input).trim());
  const resolved = path.resolve(stripped);
  return process.platform === 'win32' ? resolved.replace(/\//g, '\\').toLowerCase() : resolved;
}

export function displayPath(input) {
  return stripWindowsNamespace(input || '');
}

export function defaultCodexHome() {
  return path.resolve(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'));
}

export function truncate(value, max = 96) {
  const text = String(value || '').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function compactText(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function firstMeaningfulLine(value) {
  const lines = String(value || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter(
      (line) =>
        !/^Exit code:/i.test(line) &&
        !/^Wall time:/i.test(line) &&
        !/^Output:$/i.test(line) &&
        !/^Command:$/i.test(line),
    );

  return lines[0] || '';
}

export function isLikelyMetaUserMessage(text) {
  const normalized = compactText(text);
  if (!normalized) return true;
  return (
    normalized.startsWith('<environment_context>') ||
    normalized.startsWith('<turn_aborted>') ||
    normalized.startsWith('<image') ||
    normalized.startsWith('<permissions instructions>')
  );
}

export function formatRelativeTime(dateLike) {
  if (!dateLike) return 'now';
  const ms = Date.now() - new Date(dateLike).getTime();
  const sec = Math.max(1, Math.round(ms / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
