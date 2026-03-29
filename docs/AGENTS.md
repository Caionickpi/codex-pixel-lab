# Agent Roles

Codex Pixel Lab is built around three visible in-world roles.

The point is not to create fake lore for the sake of it.
The point is to make a real coding session legible at a glance.

## Codex

Role: `Builder`

Codex represents the active implementation loop.
When the user is editing, running commands, planning a patch, or preparing a publish step, Codex is the character that carries the main task energy in the room.

Typical bubble style:

- what part of the mission is being advanced
- whether the work is implementation, validation, or planning
- which immediate execution lane is active, such as shell verification or repo publishing

Examples:

- `Building UI polish via browser verification`
- `Preparing GitHub launch pack`
- `Editing live for office world`

## Trace

Role: `Debugger`

Trace watches command health, failures, validation runs, and terminal output.
This is the agent that should feel closest to runtime truth.

Typical bubble style:

- what command or check is being observed
- whether a failure is being investigated
- whether the system is validating a result or waiting for logs

Examples:

- `Watching browser verification output`
- `Verified local API check results`
- `Debugging failure: command returned an error`

## Scout

Role: `Watcher`

Scout tracks project context.
It keeps the room anchored to the actual workspace, git branch state, and project cleanliness.

Typical bubble style:

- which workspace is active
- whether the tree is clean or dirty
- whether the system is following sync or context work

Examples:

- `Tracking Agent on main, clean tree`
- `Tracking Agent on feature branch with 4 changed`
- `Tracking workspace sync`

## Bubble Design Rules

The dialogue system follows a few rules:

- short enough to scan while the scene is moving
- specific enough to say what the agent is actually doing
- role-aware so each character sounds different
- based on live transcript and tool state, not canned random chatter

The target is "informative game UI", not "chat log in a speech bubble."

## Why three roles

Three visible agents creates a useful split:

- one for intent and build momentum
- one for validation and failures
- one for project awareness and context

That makes the office readable without overwhelming the stage with too much text or too many entities.
