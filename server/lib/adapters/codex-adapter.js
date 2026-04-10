import { IdeAdapter } from './adapter-interface.js';
import { scanSessions, findLatestSessionForWorkspace, listRecentProjects } from '../session-index.js';
import { TranscriptTailer } from '../transcript-tailer.js';
import { CodexTranscriptModel } from '../transcript-model.js';
import { defaultCodexHome } from '../utils.js';

/**
 * Adapter for Codex Desktop.
 *
 * Wraps the existing JSONL transcript bridge logic into the adapter
 * interface so the main bridge can use it interchangeably with other IDEs.
 */
export class CodexAdapter extends IdeAdapter {
  get id() {
    return 'codex';
  }

  get displayName() {
    return 'Codex Desktop';
  }

  get description() {
    return 'OpenAI Codex Desktop — JSONL transcript bridge';
  }

  getHomePath() {
    return defaultCodexHome();
  }

  scanSessions() {
    return scanSessions(this.getHomePath());
  }

  findLatestSession(workspacePath) {
    return findLatestSessionForWorkspace(workspacePath, this.getHomePath());
  }

  listRecentProjects() {
    return listRecentProjects(this.getHomePath());
  }

  createTailer(session, onLine) {
    return new TranscriptTailer(session.filePath, onLine);
  }

  createModel(session) {
    return new CodexTranscriptModel(session);
  }
}
