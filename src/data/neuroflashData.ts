import { NeuroFlashLevelConfig } from '../types';

export const NEUROFLASH_LEVELS: NeuroFlashLevelConfig[] = [
  { level: 1, digitCount: 4, timeLimit: 2.0 }, // 4 digits, 2.0s exposure
  { level: 2, digitCount: 5, timeLimit: 1.6 }, // 5 digits, 1.6s exposure
  { level: 3, digitCount: 6, timeLimit: 1.2 }, // 6 digits, 1.2s exposure
  { level: 4, digitCount: 7, timeLimit: 0.8 }, // 7 digits, 0.8s exposure
  { level: 5, digitCount: 8, timeLimit: 0.4 }, // 8 digits, 0.4s exposure
];

// Vibrant high-contrast neon colors for each digit to provide chromatic distraction
export const FLASH_COLOR_PALETTES: string[][] = [
  ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#a855f7', '#3b82f6', '#f97316', '#84cc16', '#e11d48', '#14b8a6'],
  ['#a855f7', '#3b82f6', '#f97316', '#84cc16', '#06b6d4', '#ec4899', '#eab308', '#22c55e', '#f43f5e', '#38bdf8'],
  ['#14b8a6', '#e11d48', '#eab308', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#fb923c'],
  ['#0ea5e9', '#d946ef', '#22c55e', '#f43f5e', '#facc15', '#a855f7', '#2dd4bf', '#fb923c', '#818cf8', '#e2e8f0'],
  ['#2dd4bf', '#fb923c', '#818cf8', '#f472b6', '#4ade80', '#38bdf8', '#c084fc', '#fbbf24', '#f87171', '#34d399'],
];

// Helper to generate a random N-digit number string
export function generateRandomDigits(count: number): string {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}
