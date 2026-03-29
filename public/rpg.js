export const TITLE_LADDER = [
  {
    level: 1,
    id: 'new-recruit',
    title: 'New Recruit',
    flavor: 'Booting the first workstation.',
    unlocks: ['Starter Loft scene', 'Basic desk rig'],
  },
  {
    level: 3,
    id: 'repo-builder',
    title: 'Repo Builder',
    flavor: 'Shipping consistently and wiring better tools.',
    unlocks: ['Signal Hub scene', 'Dual Rig upgrade'],
  },
  {
    level: 5,
    id: 'night-shift-captain',
    title: 'Night Shift Captain',
    flavor: 'Owns the late-night sprint glow.',
    unlocks: ['Neon Loft scene', 'Window Garden upgrade'],
  },
  {
    level: 7,
    id: 'commit-ranger',
    title: 'Commit Ranger',
    flavor: 'Navigates repos with calm precision.',
    unlocks: ['Server Vault scene', 'Scout Prime upgrade'],
  },
  {
    level: 9,
    id: 'merge-specialist',
    title: 'Merge Specialist',
    flavor: 'Turns chaos into release nights.',
    unlocks: ['Cloud Deck scene', 'Helper Drone upgrade'],
  },
  {
    level: 12,
    id: 'ship-architect',
    title: 'Ship Architect',
    flavor: 'Designs the whole floor, not just the patch.',
    unlocks: ['Sky Forge scene', 'Legendary Rig upgrade'],
  },
  {
    level: 15,
    id: 'pixel-legend',
    title: 'Pixel Legend',
    flavor: 'Your office feels like an endgame build.',
    unlocks: ['Orbital Bay scene', 'Arcade Corner upgrade'],
  },
  {
    level: 18,
    id: 'release-conductor',
    title: 'Release Conductor',
    flavor: 'Every system in the room answers to your shipping rhythm.',
    unlocks: ['Afterglow Deck scene', 'Night Shift Vending upgrade'],
  },
  {
    level: 22,
    id: 'studio-overlord',
    title: 'Studio Overlord',
    flavor: 'The office now feels like a legendary dev base.',
    unlocks: ['Prestige aura', 'Studio trophy flex'],
  },
];

export const OFFICE_TIER_LADDER = [
  {
    level: 1,
    id: 'workbench-den',
    name: 'Workbench Den',
    flavor: 'A compact room where every upgrade still feels huge.',
    unlocks: ['Layout Planner online', 'Starter builder XP rewards'],
  },
  {
    level: 2,
    id: 'patch-bunker',
    name: 'Patch Bunker',
    flavor: 'The room starts behaving like a real dev base.',
    unlocks: ['Power Grid online', 'First expansion route visible'],
  },
  {
    level: 3,
    id: 'signal-loft',
    name: 'Signal Loft',
    flavor: 'Systems become deliberate instead of improvised.',
    unlocks: ['Fabrication Bay online', 'Rare upgrade cadence improves'],
  },
  {
    level: 4,
    id: 'ops-wing',
    name: 'Ops Wing',
    flavor: 'You are no longer decorating a room. You are scaling a floor.',
    unlocks: ['Cooling Bay unlocked', 'Builder XP rewards scale harder'],
  },
  {
    level: 5,
    id: 'control-floor',
    name: 'Control Floor',
    flavor: 'The office now looks curated, not assembled.',
    unlocks: ['Service Room unlocked', 'Ambient systems tier up'],
  },
  {
    level: 6,
    id: 'launch-suite',
    name: 'Launch Suite',
    flavor: 'Power, comfort, and command surfaces start syncing together.',
    unlocks: ['Automation Spine online', 'Elite office bonus track'],
  },
  {
    level: 7,
    id: 'master-studio',
    name: 'Master Studio',
    flavor: 'This is the point where the room starts feeling aspirational.',
    unlocks: ['Command Deck unlocked', 'Legendary systems gain more value'],
  },
  {
    level: 8,
    id: 'prestige-nexus',
    name: 'Prestige Nexus',
    flavor: 'Everything in the office now reads as a prestige setup.',
    unlocks: ['Architect Core online', 'Expanded build slots'],
  },
  {
    level: 9,
    id: 'mythic-citadel',
    name: 'Mythic Citadel',
    flavor: 'The room looks like a final-tier base in a dev RPG.',
    unlocks: ['Master office bonus track', 'Mythic room prestige'],
  },
];

export const STUDIO_EXPANSIONS = [
  {
    level: 1,
    id: 'main-bay',
    name: 'Main Bay',
    summary: 'The core office floor where daily editing happens.',
    reward: 'Base room editing online',
    artIcon: 'dual-rig',
  },
  {
    level: 2,
    id: 'service-room',
    name: 'Service Room',
    summary: 'Utility layer inspired by room management loops and support systems.',
    reward: 'Unlocks room service modules',
    artIcon: 'server-rack',
  },
  {
    level: 4,
    id: 'cooling-bay',
    name: 'Cooling Bay',
    summary: 'Advanced hardware maintenance lane for higher-end desk upgrades.',
    reward: 'Computer upgrades gain more office power',
    artIcon: 'liquid-loop',
  },
  {
    level: 6,
    id: 'fabrication-wing',
    name: 'Fabrication Wing',
    summary: 'A dedicated workshop for refining layouts and tuning build flow.',
    reward: 'Builder XP gains step up',
    artIcon: 'monitor-wall',
  },
  {
    level: 7,
    id: 'command-deck',
    name: 'Command Deck',
    summary: 'Top-tier control surface for late game office prestige.',
    reward: 'Command aura and elite unlock routing',
    artIcon: 'master-desk',
  },
];

export const SERVICE_MODULE_DEFS = [
  {
    id: 'layout-planner',
    name: 'Layout Planner',
    unlockLevel: 1,
    artIcon: 'monitor-wall',
    descriptions: [
      'Offline',
      'Turns office edits into meaningful Studio XP.',
      'Builder XP from room edits scales up.',
      'Layout reworks become a real progression source.',
      'Master planner: every major edit pays off better.',
    ],
  },
  {
    id: 'power-grid',
    name: 'Power Grid',
    unlockLevel: 2,
    artIcon: 'smart-lights',
    descriptions: [
      'Offline',
      'Routes more energy through the room and boosts office power.',
      'Ambient systems glow harder and room power climbs.',
      'Elite rigs gain stronger synergy with the room.',
      'Master grid: whole-room prestige power bonus.',
    ],
  },
  {
    id: 'fabrication-bay',
    name: 'Fabrication Bay',
    unlockLevel: 3,
    artIcon: 'legendary-rig',
    descriptions: [
      'Offline',
      'Gives future upgrades a small fabrication discount.',
      'Upgrade pricing gets noticeably better.',
      'Shop efficiency reaches late-game value.',
      'Master forge: max discount lane online.',
    ],
  },
  {
    id: 'automation-spine',
    name: 'Automation Spine',
    unlockLevel: 5,
    artIcon: 'router-node',
    descriptions: [
      'Offline',
      'Activates utility rails and extra room slots.',
      'Service room capacity expands.',
      'Command systems gain more room to breathe.',
      'Master spine: full office support lane online.',
    ],
  },
  {
    id: 'architect-core',
    name: 'Architect Core',
    unlockLevel: 7,
    artIcon: 'quantum-core',
    descriptions: [
      'Offline',
      'Prestige logic unlocks: the office feels curated end-to-end.',
      'Late game layouts gain stronger synergy.',
      'Mythic tier office rewards accelerate.',
      'Architect maxed: full prestige office status.',
    ],
  },
];

export const THEME_DEFS = {
  starter: {
    id: 'starter',
    name: 'Starter Loft',
    unlockLevel: 1,
    mood: 'Calm studio with warm wood and slate walls.',
    wallTop: '#344564',
    wallMid: '#212d45',
    wallBottom: '#151e30',
    wallGlow: '255, 203, 121',
    accent: '255, 203, 121',
    secondary: '143, 243, 207',
    marker: '#dffef3',
    windowTop: '#3a5a8b',
    windowBottom: '#121b2c',
    floorA: '#3c2934',
    floorB: '#34242d',
    rugs: [
      ['#40516f', '#34445f', '#2c394f'],
      ['#584459', '#463246', '#38293a'],
      ['#66524d', '#4c3b37', '#3c2d2a'],
    ],
  },
  signal: {
    id: 'signal',
    name: 'Signal Hub',
    unlockLevel: 3,
    mood: 'Cleaner walls, cooler signal tones, and a more focused monitoring vibe.',
    wallTop: '#32405f',
    wallMid: '#202a41',
    wallBottom: '#141d30',
    wallGlow: '166, 226, 255',
    accent: '166, 226, 255',
    secondary: '143, 243, 207',
    marker: '#dbfbff',
    windowTop: '#3f5d88',
    windowBottom: '#101a2a',
    floorA: '#31303c',
    floorB: '#262632',
    rugs: [
      ['#49617b', '#394e65', '#293a4d'],
      ['#4e4a5d', '#3d3a4a', '#2a2735'],
      ['#4c5f58', '#394a44', '#26332f'],
    ],
  },
  neon: {
    id: 'neon',
    name: 'Neon Loft',
    unlockLevel: 5,
    mood: 'More electric, more contrast, more nightlife energy.',
    wallTop: '#2d355c',
    wallMid: '#1b2140',
    wallBottom: '#11152b',
    wallGlow: '134, 214, 255',
    accent: '255, 143, 207',
    secondary: '125, 255, 236',
    marker: '#e7fffb',
    windowTop: '#4d5cd3',
    windowBottom: '#171b38',
    floorA: '#352237',
    floorB: '#29192f',
    rugs: [
      ['#51407b', '#433266', '#2f244b'],
      ['#593958', '#472b47', '#341d34'],
      ['#243f56', '#1f3144', '#162433'],
    ],
  },
  server: {
    id: 'server',
    name: 'Server Vault',
    unlockLevel: 7,
    mood: 'Cool LEDs, darker room, more ops energy.',
    wallTop: '#29354c',
    wallMid: '#172233',
    wallBottom: '#0e1622',
    wallGlow: '121, 255, 236',
    accent: '121, 255, 236',
    secondary: '124, 169, 255',
    marker: '#ddf6ff',
    windowTop: '#29496f',
    windowBottom: '#0f1624',
    floorA: '#232630',
    floorB: '#1c2028',
    rugs: [
      ['#214a60', '#18384a', '#122937'],
      ['#3a3e56', '#2a2f46', '#1f2236'],
      ['#3f4e52', '#2d3a3d', '#1c2629'],
    ],
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud Deck',
    unlockLevel: 9,
    mood: 'Airier glass tones, cool steel, and a calmer high-scale ops floor.',
    wallTop: '#445470',
    wallMid: '#2d3950',
    wallBottom: '#192331',
    wallGlow: '164, 245, 255',
    accent: '164, 245, 255',
    secondary: '255, 214, 142',
    marker: '#ecffff',
    windowTop: '#6b86b4',
    windowBottom: '#1b2639',
    floorA: '#2c323b',
    floorB: '#232831',
    rugs: [
      ['#51708a', '#3f5b72', '#2b4155'],
      ['#5f5e74', '#4c4b61', '#353449'],
      ['#766345', '#5f5038', '#453924'],
    ],
  },
  skyforge: {
    id: 'skyforge',
    name: 'Sky Forge',
    unlockLevel: 12,
    mood: 'High-rise creative suite with warm gold detail.',
    wallTop: '#485269',
    wallMid: '#293243',
    wallBottom: '#171d29',
    wallGlow: '255, 214, 142',
    accent: '255, 214, 142',
    secondary: '164, 245, 255',
    marker: '#fff0c7',
    windowTop: '#6d7ba7',
    windowBottom: '#1b2133',
    floorA: '#433124',
    floorB: '#35261d',
    rugs: [
      ['#6b5a3d', '#56492f', '#3f351f'],
      ['#62637d', '#4d4d64', '#37384a'],
      ['#31536b', '#254356', '#18303e'],
    ],
  },
  orbital: {
    id: 'orbital',
    name: 'Orbital Bay',
    unlockLevel: 15,
    mood: 'Endgame tech floor with a polished sci-fi vibe.',
    wallTop: '#2d3144',
    wallMid: '#171b28',
    wallBottom: '#0d1018',
    wallGlow: '255, 174, 121',
    accent: '255, 174, 121',
    secondary: '119, 255, 214',
    marker: '#fff2da',
    windowTop: '#5769b7',
    windowBottom: '#121626',
    floorA: '#26222f',
    floorB: '#1d1a26',
    rugs: [
      ['#5a436d', '#473457', '#332540'],
      ['#395268', '#294150', '#1b2d39'],
      ['#5f4730', '#493621', '#332514'],
    ],
  },
  afterglow: {
    id: 'afterglow',
    name: 'Afterglow Deck',
    unlockLevel: 18,
    mood: 'Late-night neon gold mix with a premium post-launch atmosphere.',
    wallTop: '#3e3650',
    wallMid: '#241e33',
    wallBottom: '#14101c',
    wallGlow: '255, 189, 117',
    accent: '255, 189, 117',
    secondary: '150, 255, 235',
    marker: '#fff1d4',
    windowTop: '#6659aa',
    windowBottom: '#1a1530',
    floorA: '#35263a',
    floorB: '#291c2e',
    rugs: [
      ['#7d5a46', '#654736', '#462f24'],
      ['#554e74', '#40395c', '#2d2843'],
      ['#29535a', '#1f4147', '#153036'],
    ],
  },
};

export const UPGRADE_DEFS = [
  {
    id: 'dual-rig',
    name: 'Dual Rig Mk II',
    unlockLevel: 3,
    cost: 120,
    type: 'rig',
    category: 'computer',
    rarity: 'common',
    icon: 'dual-rig',
    preview: 'MK-II',
    description: 'Installs a second side monitor and spreads the desk glow across the whole main station.',
    impact: ['Adds a second screen to the main desk', 'Extends workstation glow across the desk'],
  },
  {
    id: 'smart-lights',
    name: 'Smart Lights Grid',
    unlockLevel: 3,
    cost: 140,
    type: 'ambient',
    category: 'systems',
    rarity: 'common',
    icon: 'smart-lights',
    preview: 'LUX',
    description: 'Reactive ceiling strips and rim lights now answer to runtime mood in real time.',
    impact: ['Adds programmable ceiling strips', 'Makes room lighting react harder to runtime state'],
  },
  {
    id: 'signal-router',
    name: 'Signal Router Node',
    unlockLevel: 4,
    cost: 150,
    type: 'ops',
    category: 'systems',
    rarity: 'common',
    icon: 'router-node',
    preview: 'NET',
    description: 'Installs a compact uplink router with blinking antenna markers and status rails.',
    impact: ['Adds a signal uplink node', 'Makes the room feel more connected and live'],
  },
  {
    id: 'dev-poster-pack',
    name: 'Dev Poster Pack',
    unlockLevel: 4,
    cost: 110,
    type: 'decor',
    category: 'atmosphere',
    rarity: 'common',
    icon: 'poster-pack',
    preview: 'ART',
    description: 'Adds bold printed wall art with sharper frames and more visual identity on the left wall.',
    impact: ['Adds wall art and frames', 'Warms up the left side of the office'],
  },
  {
    id: 'coffee-station',
    name: 'Espresso Station',
    unlockLevel: 4,
    cost: 135,
    type: 'comfort',
    category: 'atmosphere',
    rarity: 'common',
    icon: 'espresso-bar',
    preview: 'BREW',
    description: 'Rebuilds the lounge table into a proper espresso corner with machine glow and cup detail.',
    impact: ['Adds a coffee machine setup', 'Makes the lounge corner feel richer'],
  },
  {
    id: 'window-garden',
    name: 'Window Garden',
    unlockLevel: 5,
    cost: 160,
    type: 'decor',
    category: 'atmosphere',
    rarity: 'common',
    icon: 'window-garden',
    preview: 'PLANT',
    description: 'Adds more floor plants and swinging greenery so the skyline wall feels alive.',
    impact: ['Adds more plants to the scene', 'Makes the skyline wall feel alive'],
  },
  {
    id: 'cable-management',
    name: 'Cable Raceway',
    unlockLevel: 5,
    cost: 145,
    type: 'rig',
    category: 'computer',
    rarity: 'common',
    icon: 'cable-raceway',
    preview: 'CBL',
    description: 'Tightens the desk setup with cleaner cable lanes, trays, and a premium under-desk finish.',
    impact: ['Adds under-desk cable lanes', 'Makes the setup feel more premium'],
  },
  {
    id: 'keyboard-upgrade',
    name: 'Mechanical Keyboard',
    unlockLevel: 5,
    cost: 170,
    type: 'rig',
    category: 'computer',
    rarity: 'common',
    icon: 'mech-board',
    preview: 'KEY',
    description: 'Drops in an RGB mechanical board that sharpens the main desk silhouette and desk glow.',
    impact: ['Adds an RGB keyboard bar', 'Improves the main desk silhouette'],
  },
  {
    id: 'scout-prime',
    name: 'Scout Prime',
    unlockLevel: 7,
    cost: 240,
    type: 'agent',
    category: 'agents',
    rarity: 'rare',
    icon: 'scout-prime',
    preview: 'AI',
    description: 'Upgrades Scout into a sharper watcher with cleaner callouts and a more premium station feel.',
    impact: ['Upgrades Scout status', 'Makes the watcher role feel stronger'],
  },
  {
    id: 'focus-timer',
    name: 'Focus Pulse Timer',
    unlockLevel: 7,
    cost: 180,
    type: 'display',
    category: 'systems',
    rarity: 'common',
    icon: 'focus-pulse',
    preview: 'FOCUS',
    description: 'Mounts a pulse timer to the wall so the sprint rhythm feels visible in the room.',
    impact: ['Adds a wall timer display', 'Supports the active sprint vibe'],
  },
  {
    id: 'server-rack',
    name: 'Server Rack',
    unlockLevel: 7,
    cost: 300,
    type: 'ops',
    category: 'systems',
    rarity: 'rare',
    icon: 'server-rack',
    preview: 'OPS',
    description: 'Installs a live rack with denser LED traffic and a stronger back-office ops presence.',
    impact: ['Adds a live server rack', 'Pushes the room deeper into ops mode'],
  },
  {
    id: 'ultrawide-array',
    name: 'Ultrawide Array',
    unlockLevel: 8,
    cost: 250,
    type: 'rig',
    category: 'computer',
    rarity: 'rare',
    icon: 'ultrawide',
    preview: 'UW-49',
    description: 'Stacks a wide center display into the main station and expands the desk into a true battlestation.',
    impact: ['Adds a wide center display cluster', 'Turns the main desk into a stronger battlestation'],
  },
  {
    id: 'liquid-cooling-loop',
    name: 'Liquid Cooling Loop',
    unlockLevel: 9,
    cost: 290,
    type: 'rig',
    category: 'computer',
    rarity: 'rare',
    icon: 'liquid-loop',
    preview: 'COOL',
    description: 'Adds a glowing cooling tower and coolant tubes so the setup feels custom-built, not stock.',
    impact: ['Adds a cooling tower and flowing tubes', 'Makes the rig read as custom and high-end'],
  },
  {
    id: 'trace-plus',
    name: 'Trace Plus',
    unlockLevel: 9,
    cost: 260,
    type: 'agent',
    category: 'agents',
    rarity: 'rare',
    icon: 'trace-plus',
    preview: 'DBG',
    description: 'Turns Trace into the senior debugger of the room with stronger identity and cleaner callouts.',
    impact: ['Upgrades Trace role presentation', 'Strengthens debugger identity'],
  },
  {
    id: 'helper-drone',
    name: 'Helper Drone',
    unlockLevel: 9,
    cost: 340,
    type: 'assistant',
    category: 'agents',
    rarity: 'rare',
    icon: 'helper-drone',
    preview: 'BOT',
    description: 'Adds a floating helper drone that patrols the room and makes the studio feel more alive.',
    impact: ['Adds a floating helper drone', 'Makes the office feel more game-like'],
  },
  {
    id: 'holo-board',
    name: 'Holo Board',
    unlockLevel: 10,
    cost: 360,
    type: 'display',
    category: 'systems',
    rarity: 'rare',
    icon: 'holo-board',
    preview: 'HUD',
    description: 'Layers a translucent holo surface over the board so sync and planning feel more futuristic.',
    impact: ['Adds a holographic board overlay', 'Makes sync surfaces feel more advanced'],
  },
  {
    id: 'mini-fridge',
    name: 'Mini Fridge',
    unlockLevel: 10,
    cost: 220,
    type: 'comfort',
    category: 'atmosphere',
    rarity: 'common',
    icon: 'mini-fridge',
    preview: 'COOL',
    description: 'Adds a compact fridge to the lounge edge to make the office feel like a real studio floor.',
    impact: ['Adds a compact fridge block', 'Enriches the break area'],
  },
  {
    id: 'ambient-speakers',
    name: 'Ambient Speakers',
    unlockLevel: 10,
    cost: 210,
    type: 'audio',
    category: 'atmosphere',
    rarity: 'common',
    icon: 'speaker-stack',
    preview: 'SND',
    description: 'Mounts a premium speaker pair so the desk reads like a tuned creative station, not a basic setup.',
    impact: ['Adds speaker stacks', 'Strengthens the premium desk feel'],
  },
  {
    id: 'wall-terminal',
    name: 'Wall Terminal',
    unlockLevel: 11,
    cost: 310,
    type: 'display',
    category: 'systems',
    rarity: 'rare',
    icon: 'wall-terminal',
    preview: 'TERM',
    description: 'Installs a side-wall terminal with live telemetry so the room feels more technical and alive.',
    impact: ['Adds an extra wall display', 'Makes the office feel more technical'],
  },
  {
    id: 'patch-bay',
    name: 'Patch Bay',
    unlockLevel: 11,
    cost: 295,
    type: 'ops',
    category: 'systems',
    rarity: 'rare',
    icon: 'patch-bay',
    preview: 'PATCH',
    description: 'Adds a live patch bay with status strips near the rack to deepen the backstage systems vibe.',
    impact: ['Adds a patch panel near the rack', 'Deepens the backstage systems vibe'],
  },
  {
    id: 'legendary-rig',
    name: 'Legendary Rig',
    unlockLevel: 12,
    cost: 480,
    type: 'rig',
    category: 'computer',
    rarity: 'epic',
    icon: 'legendary-rig',
    preview: 'XL',
    description: 'Transforms the main desk into an endgame battlestation with denser glow, side panels, and more authority.',
    impact: ['Upgrades the main desk to endgame tier', 'Makes the workstation unmistakably elite'],
  },
  {
    id: 'plant-lab',
    name: 'Plant Lab',
    unlockLevel: 12,
    cost: 255,
    type: 'decor',
    category: 'atmosphere',
    rarity: 'rare',
    icon: 'plant-lab',
    preview: 'BIO',
    description: 'Turns the office into a richer green studio with extra hanging plants and more organic depth.',
    impact: ['Adds more hanging and floor plants', 'Softens the technical room with organic detail'],
  },
  {
    id: 'monitor-wall',
    name: 'Monitor Wall',
    unlockLevel: 13,
    cost: 430,
    type: 'display',
    category: 'computer',
    rarity: 'epic',
    icon: 'monitor-wall',
    preview: 'GRID',
    description: 'Builds a multi-screen command wall behind the desks so the whole office reads as a control room.',
    impact: ['Adds a rear monitor wall', 'Pushes the whole office into command-center territory'],
  },
  {
    id: 'neon-signage',
    name: 'Neon Signage',
    unlockLevel: 13,
    cost: 320,
    type: 'ambient',
    category: 'atmosphere',
    rarity: 'rare',
    icon: 'neon-signage',
    preview: 'GLOW',
    description: 'Adds a glowing wall sign with a stronger halo so the room instantly reads as a late-night dev studio.',
    impact: ['Adds a glowing wall sign', 'Makes the room read instantly as a dev studio'],
  },
  {
    id: 'trophy-shelf',
    name: 'Trophy Shelf',
    unlockLevel: 15,
    cost: 360,
    type: 'decor',
    category: 'atmosphere',
    rarity: 'rare',
    icon: 'trophy-shelf',
    preview: 'WIN',
    description: 'Places glowing trophies and lit accents on the shelf to celebrate the grind at a glance.',
    impact: ['Adds shelf trophies', 'Makes high-level progression visible at a glance'],
  },
  {
    id: 'arcade-corner',
    name: 'Arcade Corner',
    unlockLevel: 15,
    cost: 620,
    type: 'decor',
    category: 'atmosphere',
    rarity: 'legendary',
    icon: 'arcade-corner',
    preview: 'PLAY',
    description: 'Adds a celebratory arcade cabinet with brighter screen glow and a real victory-corner vibe.',
    impact: ['Adds an arcade cabinet', 'Gives the office a visible victory corner'],
  },
  {
    id: 'quantum-core',
    name: 'Quantum Core Tower',
    unlockLevel: 16,
    cost: 640,
    type: 'rig',
    category: 'computer',
    rarity: 'legendary',
    icon: 'quantum-core',
    preview: 'QBIT',
    description: 'Adds a pulsing compute core beside the main desk and starts making the whole office feel elite.',
    impact: ['Adds a pulsing compute tower', 'Upgrades the entire room vibe toward master tier'],
  },
  {
    id: 'night-shift-vending',
    name: 'Night Shift Vending',
    unlockLevel: 16,
    cost: 420,
    type: 'comfort',
    category: 'atmosphere',
    rarity: 'rare',
    icon: 'night-vending',
    preview: '24H',
    description: 'Brings in a vending machine with stronger glow, making the office feel like a full studio floor.',
    impact: ['Adds a vending machine prop', 'Fills the lounge with more world-building detail'],
  },
  {
    id: 'master-control-desk',
    name: 'Master Control Desk',
    unlockLevel: 18,
    cost: 980,
    type: 'rig',
    category: 'computer',
    rarity: 'mythic',
    icon: 'master-desk',
    preview: 'MASTER',
    description: 'Overhauls the entire office into a prestige command deck with floor rails, panoramic displays, and elite glow.',
    impact: ['Turns the office into a prestige command deck', 'Makes every workstation feel top-tier'],
  },
];

export function getCurrentTitle(level) {
  return [...TITLE_LADDER].reverse().find((entry) => level >= entry.level) || TITLE_LADDER[0];
}

export function getNextTitle(level) {
  return TITLE_LADDER.find((entry) => entry.level > level) || null;
}

export function getUnlockedThemes(level) {
  return Object.values(THEME_DEFS)
    .filter((theme) => level >= theme.unlockLevel)
    .sort((left, right) => left.unlockLevel - right.unlockLevel);
}

export function getThemeById(id) {
  return THEME_DEFS[id] || THEME_DEFS.starter;
}

export function getUpgradeById(id) {
  return UPGRADE_DEFS.find((upgrade) => upgrade.id === id) || null;
}

function normalizeStoredState(stored = {}) {
  const visitedThemeIds = Array.isArray(stored.visitedThemeIds) ? [...new Set(stored.visitedThemeIds.filter((id) => typeof id === 'string'))] : [];
  const purchaseCosts =
    stored.purchaseCosts && typeof stored.purchaseCosts === 'object'
      ? Object.fromEntries(
          Object.entries(stored.purchaseCosts).filter(
            ([key, value]) => typeof key === 'string' && Number.isFinite(Number(value)),
          ),
        )
      : {};

  return {
    purchasedIds: Array.isArray(stored.purchasedIds) ? [...new Set(stored.purchasedIds)] : [],
    activeThemeId: typeof stored.activeThemeId === 'string' ? stored.activeThemeId : '',
    visitedThemeIds,
    builderXp: Number.isFinite(Number(stored.builderXp)) ? Math.max(0, Math.floor(Number(stored.builderXp))) : 0,
    builderActions: Number.isFinite(Number(stored.builderActions)) ? Math.max(0, Math.floor(Number(stored.builderActions))) : 0,
    purchaseCosts,
  };
}

function deriveCoinsEarned(player) {
  const commits = Number(player?.progression?.totalCommits || 0);
  const repos = Number(player?.profile?.repositories || 0);
  const followers = Number(player?.profile?.followers || 0);
  const level = Number(player?.progression?.level || 1);
  return Math.max(180, Math.floor(commits * 3.6 + repos * 90 + followers * 28 + level * 120));
}

function rarityWeight(rarity) {
  const weights = {
    common: 1,
    rare: 1.18,
    epic: 1.42,
    legendary: 1.78,
    mythic: 2.2,
  };
  return weights[rarity] || 1;
}

function categoryWeight(category) {
  const weights = {
    computer: 1.18,
    systems: 1.08,
    atmosphere: 0.92,
    agents: 1.02,
  };
  return weights[category] || 1;
}

function builderXpRewardForUpgrade(upgrade) {
  return Math.max(60, Math.round(upgrade.cost * 0.52 * rarityWeight(upgrade.rarity)));
}

function officePowerForUpgrade(upgrade) {
  return Math.max(36, Math.round(upgrade.cost * 0.34 * rarityWeight(upgrade.rarity) * categoryWeight(upgrade.category)));
}

function spentCoins(purchasedIds, purchaseCosts = {}) {
  return purchasedIds.reduce((sum, id) => sum + Number(purchaseCosts[id] || getUpgradeById(id)?.cost || 0), 0);
}

function deriveDeskRig(purchasedIds) {
  if (purchasedIds.includes('master-control-desk')) return 'Master Control Desk';
  if (purchasedIds.includes('quantum-core')) return 'Quantum Core Rig';
  if (purchasedIds.includes('legendary-rig')) return 'Legendary Rig';
  if (purchasedIds.includes('liquid-cooling-loop')) return 'Liquid-Cooled Rig';
  if (purchasedIds.includes('ultrawide-array')) return 'Ultrawide Array';
  if (purchasedIds.includes('dual-rig')) return 'Dual Rig';
  return 'Starter Rig';
}

function officeXpThreshold(level) {
  const thresholds = [0, 260, 620, 1080, 1700, 2500, 3500, 4700, 6100];
  if (level <= thresholds.length) return thresholds[level - 1];
  const overflow = level - thresholds.length;
  return thresholds[thresholds.length - 1] + overflow * 1800;
}

function getCurrentOfficeTier(level) {
  return [...OFFICE_TIER_LADDER].reverse().find((entry) => level >= entry.level) || OFFICE_TIER_LADDER[0];
}

function getNextOfficeTier(level) {
  return OFFICE_TIER_LADDER.find((entry) => entry.level > level) || null;
}

function deriveBuilderXpFloor(player, purchasedIds, visitedThemeIds) {
  const passiveXp = Number(player?.progression?.level || 1) * 110;
  const themeXp = visitedThemeIds.length * 55;
  const upgradeXp = purchasedIds.reduce((sum, id) => {
    const upgrade = getUpgradeById(id);
    return sum + (upgrade ? builderXpRewardForUpgrade(upgrade) : 0);
  }, 0);
  return passiveXp + themeXp + upgradeXp;
}

function deriveOfficeLevel(builderXp) {
  let level = 1;
  while (level < OFFICE_TIER_LADDER.length && builderXp >= officeXpThreshold(level + 1)) {
    level += 1;
  }
  return level;
}

function serviceModuleLevel(officeLevel, unlockLevel) {
  if (officeLevel < unlockLevel) return 0;
  return Math.min(4, 1 + Math.floor((officeLevel - unlockLevel) / 2));
}

function buildServiceModules(officeLevel) {
  return SERVICE_MODULE_DEFS.map((module) => {
    const level = serviceModuleLevel(officeLevel, module.unlockLevel);
    return {
      ...module,
      level,
      unlocked: level > 0,
      maxed: level >= 4,
      effect: module.descriptions[level],
    };
  });
}

function buildStudioExpansions(officeLevel) {
  const currentExpansion = [...STUDIO_EXPANSIONS].reverse().find((expansion) => officeLevel >= expansion.level) || STUDIO_EXPANSIONS[0];
  const nextExpansion = STUDIO_EXPANSIONS.find((expansion) => expansion.level > officeLevel) || null;
  return STUDIO_EXPANSIONS.map((expansion) => ({
    ...expansion,
    unlocked: officeLevel >= expansion.level,
    current: currentExpansion.id === expansion.id,
    upcoming: nextExpansion?.id === expansion.id,
  }));
}

function deriveOfficeState({ player, purchasedIds, builderXp, builderActions, visitedThemeIds, activeTheme }) {
  const level = deriveOfficeLevel(builderXp);
  const currentTier = getCurrentOfficeTier(level);
  const nextTier = getNextOfficeTier(level);
  const currentThreshold = officeXpThreshold(level);
  const nextThreshold = nextTier ? officeXpThreshold(nextTier.level) : officeXpThreshold(level) + 1800;
  const xpIntoLevel = Math.max(0, builderXp - currentThreshold);
  const xpForLevel = Math.max(1, nextThreshold - currentThreshold);
  const progress = nextTier ? xpIntoLevel / xpForLevel : 1;
  const modules = buildServiceModules(level);
  const expansions = buildStudioExpansions(level);

  const plannerLevel = modules.find((module) => module.id === 'layout-planner')?.level || 0;
  const powerGridLevel = modules.find((module) => module.id === 'power-grid')?.level || 0;
  const fabricationLevel = modules.find((module) => module.id === 'fabrication-bay')?.level || 0;
  const automationLevel = modules.find((module) => module.id === 'automation-spine')?.level || 0;
  const architectLevel = modules.find((module) => module.id === 'architect-core')?.level || 0;

  const editXpBonus = [0, 0.08, 0.14, 0.2, 0.28][plannerLevel];
  const officePowerBonus = [0, 0.06, 0.1, 0.15, 0.22][powerGridLevel];
  const fabricationDiscount = [0, 0.02, 0.04, 0.07, 0.1][fabricationLevel];
  const roomSlots = 1 + automationLevel;
  const prestigeBonus = [0, 0.04, 0.08, 0.12, 0.18][architectLevel];

  const basePower =
    purchasedIds.reduce((sum, id) => {
      const upgrade = getUpgradeById(id);
      return sum + (upgrade ? officePowerForUpgrade(upgrade) : 0);
    }, 0) +
    Number(player?.progression?.level || 1) * 28 +
    Number(activeTheme?.unlockLevel || 1) * 34;

  const power = Math.round(basePower * (1 + officePowerBonus + prestigeBonus));

  return {
    level,
    currentTier,
    nextTier,
    builderXp,
    builderActions,
    visitedThemeIds,
    progress,
    xpIntoLevel,
    xpForLevel,
    xpToNext: nextTier ? Math.max(0, nextThreshold - builderXp) : 0,
    power,
    bonuses: {
      editXpBonus,
      officePowerBonus,
      fabricationDiscount,
      roomSlots,
      prestigeBonus,
    },
    modules,
    expansions,
    currentExpansion: expansions.find((entry) => entry.current) || expansions[0],
    nextExpansion: expansions.find((entry) => entry.upcoming) || null,
  };
}

export function computeRpgState(player, stored = {}) {
  const normalized = normalizeStoredState(stored);
  const level = Number(player?.progression?.level || 1);
  const currentTitle = getCurrentTitle(level);
  const nextTitle = getNextTitle(level);
  const unlockedThemes = getUnlockedThemes(level);
  const purchasedIds = normalized.purchasedIds.filter((id) => Boolean(getUpgradeById(id)));
  const purchaseCosts = Object.fromEntries(
    Object.entries(normalized.purchaseCosts).filter(([id]) => purchasedIds.includes(id)),
  );
  const defaultTheme = unlockedThemes[unlockedThemes.length - 1] || THEME_DEFS.starter;
  const activeThemeId = unlockedThemes.some((theme) => theme.id === normalized.activeThemeId)
    ? normalized.activeThemeId
    : defaultTheme.id;
  const activeTheme = getThemeById(activeThemeId);
  const builderXpFloor = deriveBuilderXpFloor(player, purchasedIds, normalized.visitedThemeIds);
  const builderXp = Math.max(normalized.builderXp, builderXpFloor);
  const builderActions = Math.max(normalized.builderActions, purchasedIds.length + normalized.visitedThemeIds.length);
  const office = deriveOfficeState({
    player,
    purchasedIds,
    builderXp,
    builderActions,
    visitedThemeIds: normalized.visitedThemeIds,
    activeTheme,
  });
  const coinsEarned = deriveCoinsEarned(player);
  const coinsSpent = spentCoins(purchasedIds, purchaseCosts);
  const coins = Math.max(0, coinsEarned - coinsSpent);
  const upgradeCatalog = UPGRADE_DEFS.map((upgrade) => ({
    ...upgrade,
    builderXpReward: builderXpRewardForUpgrade(upgrade),
    officePower: officePowerForUpgrade(upgrade),
    price: purchasedIds.includes(upgrade.id)
      ? Number(purchaseCosts[upgrade.id] || upgrade.cost)
      : Math.max(20, Math.round(upgrade.cost * (1 - office.bonuses.fabricationDiscount))),
    unlocked: level >= upgrade.unlockLevel,
    owned: purchasedIds.includes(upgrade.id),
    affordable: coins >= (purchasedIds.includes(upgrade.id) ? Number(purchaseCosts[upgrade.id] || upgrade.cost) : Math.max(20, Math.round(upgrade.cost * (1 - office.bonuses.fabricationDiscount)))),
  }));

  const loadout = {
    scene: activeTheme.name,
    sceneMood: activeTheme.mood,
    deskRig: deriveDeskRig(purchasedIds),
    studioTier: office.currentTier.name,
    officePower: office.power,
    agents: [
      purchasedIds.includes('trace-plus') ? 'Trace Plus' : 'Trace',
      purchasedIds.includes('scout-prime') ? 'Scout Prime' : 'Scout',
      purchasedIds.includes('helper-drone') ? 'Helper Drone' : 'Codex support',
    ],
    officePerks: upgradeCatalog.filter((upgrade) => upgrade.owned).map((upgrade) => upgrade.name),
    modules: office.modules.filter((module) => module.unlocked).map((module) => `${module.name} Lv ${module.level}`),
  };

  return {
    level,
    currentTitle,
    nextTitle,
    titleRoadmap: TITLE_LADDER.map((entry) => ({
      ...entry,
      unlocked: level >= entry.level,
      current: entry.id === currentTitle.id,
      upcoming: nextTitle?.id === entry.id,
    })),
    unlockedThemes,
    activeThemeId,
    activeTheme,
    purchasedIds,
    upgradeCatalog,
    coinsEarned,
    coinsSpent,
    coins,
    office,
    storage: {
      purchasedIds,
      activeThemeId,
      visitedThemeIds: normalized.visitedThemeIds,
      builderXp,
      builderActions,
      purchaseCosts,
    },
    loadout,
  };
}
