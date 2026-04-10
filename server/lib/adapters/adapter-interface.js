/**
 * Base adapter interface for IDE session bridges.
 *
 * Each supported IDE (Codex, Antigravity, etc.) implements this contract
 * so the bridge can discover sessions, tail activity, and build models
 * regardless of the underlying data format.
 */

export class IdeAdapter {
  /** Unique machine-readable identifier, e.g. 'codex' or 'antigravity'. */
  get id() {
    throw new Error('IdeAdapter.id must be overridden');
  }

  /** Human-readable display name, e.g. 'Codex Desktop'. */
  get displayName() {
    throw new Error('IdeAdapter.displayName must be overridden');
  }

  /** Short description shown in the IDE picker. */
  get description() {
    return '';
  }

  /** Home directory where this IDE stores its data. */
  getHomePath() {
    throw new Error('IdeAdapter.getHomePath must be overridden');
  }

  /**
   * Scan all known sessions and return an array of session records
   * sorted by most-recently-updated first.
   *
   * Each record should include at minimum:
   *   { id, filePath, cwd, cwdNormalized, source, startedAt, updatedAt, updatedAtMs, label }
   */
  scanSessions() {
    return [];
  }

  /**
   * Find the latest session whose workspace matches `workspacePath`.
   * Returns a session record or null.
   */
  findLatestSession(workspacePath) {
    return null;
  }

  /**
   * Return up to 10 distinct recent projects.
   */
  listRecentProjects() {
    return [];
  }

  /**
   * Create a tailer that calls `onLine(rawLine)` whenever new data
   * appears for the given session.  Must return an object with
   * `.start()` and `.stop()` methods.
   */
  createTailer(session, onLine) {
    return { start: async () => {}, stop: () => {} };
  }

  /**
   * Create a transcript model for the given session.
   * The model must expose `.applyLine(line)` and `.buildSnapshot(workspace, recentProjects)`.
   */
  createModel(session) {
    throw new Error('IdeAdapter.createModel must be overridden');
  }
}
