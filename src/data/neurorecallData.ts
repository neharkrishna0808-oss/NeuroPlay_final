import { MemoryItem, NeuroRecallLevelConfig } from '../types';

export const ALL_MEMORY_POOL: MemoryItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'Food' },
  { id: 'bicycle', name: 'Bicycle', emoji: '🚲', category: 'Transport' },
  { id: 'moon', name: 'Moon', emoji: '🌙', category: 'Space' },
  { id: 'guitar', name: 'Guitar', emoji: '🎸', category: 'Instrument' },
  { id: 'key', name: 'Key', emoji: '🔑', category: 'Object' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', category: 'Animal' },
  { id: 'pyramid', name: 'Pyramid', emoji: '🏛️', category: 'Place' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', category: 'Object' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', category: 'Food' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', category: 'Space' },
  { id: 'compass', name: 'Compass', emoji: '🧭', category: 'Tool' },
  { id: 'volcano', name: 'Volcano', emoji: '🌋', category: 'Nature' },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', category: 'Animal' },
  { id: 'crown', name: 'Crown', emoji: '👑', category: 'Object' },
  { id: 'piano', name: 'Piano', emoji: '🎹', category: 'Instrument' },
  { id: 'lighthouse', name: 'Lighthouse', emoji: '🗼', category: 'Place' },
  { id: 'lightning', name: 'Lightning', emoji: '⚡', category: 'Nature' },
  { id: 'telescope', name: 'Telescope', emoji: '🔭', category: 'Tool' },
  { id: 'camera', name: 'Camera', emoji: '📷', category: 'Device' },
  { id: 'island', name: 'Island', emoji: '🏝️', category: 'Place' },
  { id: 'star', name: 'Star', emoji: '⭐', category: 'Space' },
  { id: 'shield', name: 'Shield', emoji: '🛡️', category: 'Object' },
  { id: 'feather', name: 'Feather', emoji: '🪶', category: 'Nature' },
  { id: 'castle', name: 'Castle', emoji: '🏰', category: 'Place' },
  { id: 'watch', name: 'Watch', emoji: '⌚', category: 'Device' },
  { id: 'bell', name: 'Bell', emoji: '🔔', category: 'Object' },
  { id: 'bridge', name: 'Bridge', emoji: '🌉', category: 'Place' },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', category: 'Object' },
  { id: 'anchor', name: 'Anchor', emoji: '⚓', category: 'Tool' },
  { id: 'palette', name: 'Palette', emoji: '🎨', category: 'Tool' },
];

export const NEURORECALL_LEVELS: NeuroRecallLevelConfig[] = [
  {
    level: 1,
    itemsCount: 5,
    items: [
      ALL_MEMORY_POOL[0], // Apple
      ALL_MEMORY_POOL[1], // Bicycle
      ALL_MEMORY_POOL[2], // Moon
      ALL_MEMORY_POOL[3], // Guitar
      ALL_MEMORY_POOL[4], // Key
    ]
  },
  {
    level: 2,
    itemsCount: 8,
    items: [
      ALL_MEMORY_POOL[9], // Rocket
      ALL_MEMORY_POOL[5], // Tiger
      ALL_MEMORY_POOL[7], // Diamond
      ALL_MEMORY_POOL[8], // Coffee
      ALL_MEMORY_POOL[10], // Compass
      ALL_MEMORY_POOL[2],  // Moon
      ALL_MEMORY_POOL[0],  // Apple
      ALL_MEMORY_POOL[4],  // Key
    ]
  },
  {
    level: 3,
    itemsCount: 11,
    items: [
      ALL_MEMORY_POOL[6],  // Pyramid
      ALL_MEMORY_POOL[13], // Crown
      ALL_MEMORY_POOL[1],  // Bicycle
      ALL_MEMORY_POOL[14], // Piano
      ALL_MEMORY_POOL[11], // Volcano
      ALL_MEMORY_POOL[3],  // Guitar
      ALL_MEMORY_POOL[12], // Dolphin
      ALL_MEMORY_POOL[16], // Lightning
      ALL_MEMORY_POOL[7],  // Diamond
      ALL_MEMORY_POOL[9],  // Rocket
      ALL_MEMORY_POOL[8],  // Coffee
    ]
  },
  {
    level: 4,
    itemsCount: 14,
    items: [
      ALL_MEMORY_POOL[15], // Lighthouse
      ALL_MEMORY_POOL[4],  // Key
      ALL_MEMORY_POOL[17], // Telescope
      ALL_MEMORY_POOL[5],  // Tiger
      ALL_MEMORY_POOL[18], // Camera
      ALL_MEMORY_POOL[10], // Compass
      ALL_MEMORY_POOL[19], // Island
      ALL_MEMORY_POOL[0],  // Apple
      ALL_MEMORY_POOL[14], // Piano
      ALL_MEMORY_POOL[16], // Lightning
      ALL_MEMORY_POOL[2],  // Moon
      ALL_MEMORY_POOL[13], // Crown
      ALL_MEMORY_POOL[6],  // Pyramid
      ALL_MEMORY_POOL[11], // Volcano
    ]
  },
  {
    level: 5,
    itemsCount: 17,
    items: [
      ALL_MEMORY_POOL[12], // Dolphin
      ALL_MEMORY_POOL[9],  // Rocket
      ALL_MEMORY_POOL[3],  // Guitar
      ALL_MEMORY_POOL[18], // Camera
      ALL_MEMORY_POOL[7],  // Diamond
      ALL_MEMORY_POOL[1],  // Bicycle
      ALL_MEMORY_POOL[17], // Telescope
      ALL_MEMORY_POOL[8],  // Coffee
      ALL_MEMORY_POOL[15], // Lighthouse
      ALL_MEMORY_POOL[16], // Lightning
      ALL_MEMORY_POOL[13], // Crown
      ALL_MEMORY_POOL[5],  // Tiger
      ALL_MEMORY_POOL[10], // Compass
      ALL_MEMORY_POOL[19], // Island
      ALL_MEMORY_POOL[4],  // Key
      ALL_MEMORY_POOL[6],  // Pyramid
      ALL_MEMORY_POOL[14], // Piano
    ]
  }
];

// Helper to normalize input string for comparison (lowercased, trimmed, symbols removed)
export function normalizeItemName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

// Generate a randomized append bank with the target items plus extra decoy elements scattered in
export function generateAppendBank(targetItems: MemoryItem[], extraCount = 4): MemoryItem[] {
  const targetIds = new Set(targetItems.map(item => item.id));
  const unusedPool = ALL_MEMORY_POOL.filter(item => !targetIds.has(item.id));

  // Pick random decoys from unused pool
  const shuffledUnused = [...unusedPool].sort(() => Math.random() - 0.5);
  const decoys = shuffledUnused.slice(0, Math.min(extraCount, shuffledUnused.length));

  // Combine target items and decoys, then shuffle all together
  const combined = [...targetItems, ...decoys];
  return combined.sort(() => Math.random() - 0.5);
}
