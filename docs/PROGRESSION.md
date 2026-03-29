# Progression System

## Goal

The progression system should make the office feel earned.

Every level should unlock something visible, useful, or expressive:

- new scenes
- new titles
- new desk and computer tiers
- stronger helper agents
- office upgrades bought with coins

The player should always feel two things:

1. their real development activity matters
2. the room is becoming more personal over time

## Inputs

The current implementation uses the local authenticated GitHub account via `gh`.

Primary signals:

- total commits
- repository count
- follower count
- level milestones

These are translated into:

- XP
- level
- coins earned
- title unlocks
- scene unlocks
- shop availability

## Design principles

### 1. Real signals, playful output

The system should reward real work, but surface it in a fun way.

### 2. Visual unlocks first

Whenever possible, a reward should alter the room, the rig, or the agents.

### 3. Titles should feel earned

Titles should communicate a recognizable dev identity, not generic game jargon.

### 4. Coins should create choice

Not every improvement should be automatic.
Coins should let players decide what their office becomes.

## Current model

### Titles

- Level 1: `New Recruit`
- Level 3: `Repo Builder`
- Level 5: `Night Shift Captain`
- Level 7: `Commit Ranger`
- Level 9: `Merge Specialist`
- Level 12: `Ship Architect`
- Level 15: `Pixel Legend`

### Scene unlocks

- Level 1: `Starter Loft`
- Level 5: `Neon Loft`
- Level 7: `Server Vault`
- Level 12: `Sky Forge`
- Level 15: `Orbital Bay`

### Office upgrades

- `Dual Rig`
- `Smart Lights`
- `Window Garden`
- `Scout Prime`
- `Trace Plus`
- `Server Rack`
- `Helper Drone`
- `Holo Board`
- `Legendary Rig`
- `Arcade Corner`

## Future extensions

### Better economy

- mission rewards from completed coding sessions
- bonus coins for streaks
- milestone rewards for major repo events

### Better progression sources

- successful tests
- merged pull requests
- released versions
- fixed regressions
- project session length and consistency

### Better inventory system

- cosmetic-only unlocks
- room skins
- collectible desk items
- agent skins and accessories

### Better office growth

- unlock whole new floor layouts
- unlock room expansions
- unlock special workstations by role

## Product take

The progression system should not feel like unrelated gamification pasted on top of a coding tool.

It should feel like the room is a living mirror of the developer's work history.
