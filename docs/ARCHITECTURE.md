# Architecture

## Overview

Codex Pixel Lab is split into two simple layers:

- a local bridge server
- a browser-rendered pixel office

The bridge converts Codex Desktop transcripts into a compact snapshot model.
The frontend turns that snapshot into characters, bubbles, room state, and player UI.

## Backend

### Responsibilities

- locate the latest Codex session for a workspace
- tail transcript JSONL files in real time
- derive role-aware agent state
- collect git workspace insights
- expose live snapshots over WebSocket
- expose GitHub-backed player profile data over HTTP

### Important files

- `server/index.js`
- `server/lib/transcript-model.js`
- `server/lib/transcript-tailer.js`
- `server/lib/session-index.js`
- `server/lib/workspace-insights.js`
- `server/lib/github-profile.js`

## Frontend

### Responsibilities

- render the office on a single canvas
- animate agents and environment
- map runtime state into room mood
- render bottom utility rail
- render player profile modal
- compute and persist RPG-style upgrades in local storage

### Important files

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `public/rpg.js`

## Data flow

1. User connects a workspace.
2. Server finds the latest matching Codex session.
3. Transcript tailer streams new JSONL records.
4. Transcript model converts raw records into a compact snapshot.
5. Snapshot is broadcast to the browser over WebSocket.
6. Browser updates the office, agents, bubbles, and utility rail.
7. Browser fetches GitHub player data through the local bridge.
8. RPG UI derives themes, titles, coins, and upgrade availability.

## Why local-first

This product is intentionally local-first:

- no private Codex API dependency
- no browser extension required
- no cloud sync needed to get a live office experience
- GitHub identity comes from the existing authenticated `gh` CLI session

That makes the prototype easier to run, understand, and evolve.

## Next architecture steps

- split rendering systems into smaller modules
- add a persistence layer for upgrades beyond local storage
- introduce event-driven unlocks for tests, builds, and PRs
- make the player profile and progression state available to multiple clients
