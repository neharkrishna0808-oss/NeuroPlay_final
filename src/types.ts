/**
 * Types and interfaces for NEUROPLAY platform
 */

export type GameId = 'neuroread' | 'neuroflash' | 'neurorecall';

export type GamePhase = 
  | 'intro'
  | 'playing'
  | 'locked'
  | 'answering'
  | 'levelResult'
  | 'finalResult';

export interface SessionScores {
  neuroread: number | null; // Best percentage
  neuroflash: number | null; // Best percentage
  neurorecall: number | null; // Best percentage
}

// ---------------- NEUROREAD ----------------
export interface ComprehensionQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
}

export interface NeuroReadPassage {
  level: number;
  levelTitle: string;
  timeLimit: number; // in seconds: 30, 40, 50, 60, 70
  title: string;
  scrambledText: string;
  questions: [ComprehensionQuestion, ComprehensionQuestion];
}

export interface NeuroReadRoundResult {
  level: number;
  correctCount: number; // 0, 1, or 2
  score: number; // 0, 50, or 100
  timeUsed: number;
  totalTime: number;
}

// ---------------- NEUROFLASH ----------------
export interface NeuroFlashLevelConfig {
  level: number;
  digitCount: number; // 4 to 8 digits
  timeLimit: number; // seconds
}

export interface NeuroFlashRoundResult {
  level: number;
  targetDigits: string; // e.g. "7382"
  userDigits: string; // e.g. "7385"
  correctDigitsCount: number; // 0-4
  scorePercentage: number; // 0, 25, 50, 75, 100
}

// ---------------- NEURORECALL ----------------
export interface MemoryItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface NeuroRecallLevelConfig {
  level: number;
  itemsCount: number; // 5, 8, 11, 14, 17
  items: MemoryItem[];
}

export interface NeuroRecallRoundResult {
  level: number;
  totalItems: number;
  correctPositionsCount: number;
  scorePercentage: number;
  userSequence: string[];
  correctSequence: string[];
}
