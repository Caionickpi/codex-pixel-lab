import { CodexAdapter } from './codex-adapter.js';
import { AntigravityAdapter } from './antigravity-adapter.js';

/**
 * Registry of available IDE adapters.
 *
 * Instantiates each adapter once and exposes look-up by IDE id.
 */

const adapters = new Map();

function register(adapter) {
  adapters.set(adapter.id, adapter);
}

// Register built-in adapters.
register(new CodexAdapter());
register(new AntigravityAdapter());

export function getAdapter(ideId) {
  return adapters.get(ideId) || adapters.get('codex');
}

export function listAvailableIdes() {
  return [...adapters.values()].map((adapter) => ({
    id: adapter.id,
    name: adapter.displayName,
    description: adapter.description,
  }));
}

export function getDefaultIdeId() {
  return 'codex';
}
