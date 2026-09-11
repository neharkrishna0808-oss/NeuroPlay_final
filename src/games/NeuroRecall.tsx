import React, { useState, useEffect, useRef } from 'react';
import { Brain, Check, X, ArrowRight, RotateCcw, Home, Clock, Sparkles, Lock, Plus, Trash2 } from 'lucide-react';
import { Timer } from '../components/Timer';
import { ScoreCounter } from '../components/ScoreCounter';
import { NEURORECALL_LEVELS, normalizeItemName, generateAppendBank } from '../data/neurorecallData';
import { NeuroRecallRoundResult, GamePhase, MemoryItem } from '../types';

interface NeuroRecallProps {
  onFinishGame: (finalScorePercentage: number) => void;
  onBackToHome: () => void;
}

export const NeuroRecall: React.FC<NeuroRecallProps> = ({
  onFinishGame,
  onBackToHome,
}) => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0); // 0 to 4
  const [timeLeft, setTimeLeft] = useState<number>(45.0); // Always 45.0 seconds
  const [appendBankItems, setAppendBankItems] = useState<MemoryItem[]>(() =>
    generateAppendBank(NEURORECALL_LEVELS[0].items)
  );

  // Answer tracking: user can input text or click item bank chips
  const [textInput, setTextInput] = useState<string>('');

  // Round results history
  const [roundResults, setRoundResults] = useState<NeuroRecallRoundResult[]>([]);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLevelConfig = NEURORECALL_LEVELS[currentLevelIndex];

  // Clean timer
  const clearCurrentTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearCurrentTimer();
    };
  }, []);

  // Focus input when answering begins
  useEffect(() => {
    if (phase === 'answering') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Start a level
  const startLevel = (levelIndex: number) => {
    clearCurrentTimer();
    setCurrentLevelIndex(levelIndex);
    setTimeLeft(45.0); // Exact 45 seconds for all levels
    setTextInput('');
    setAppendBankItems(generateAppendBank(NEURORECALL_LEVELS[levelIndex].items));
    setPhase('playing');

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const nextTime = +(prev - 0.1).toFixed(1);
        if (nextTime <= 0) {
          clearCurrentTimer();
          handleMemorizationTimeout();
          return 0;
        }
        return nextTime;
      });
    }, 100);
  };

  // Called when 45 seconds expires
  const handleMemorizationTimeout = () => {
    clearCurrentTimer();
    setPhase('locked');
  };

  // Early finish memorizing
  const handleFinishMemorizingEarly = () => {
    clearCurrentTimer();
    setPhase('locked');
  };

  const proceedToRecall = () => {
    setPhase('answering');
    setTextInput('');
  };

  // Parse comma-separated text into item names
  const parsedUserItems = textInput
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Helper to add item via chip click
  const handleAddItemFromBank = (itemName: string) => {
    const currentList = textInput
      ? textInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const updated = [...currentList, itemName];
    setTextInput(updated.join(', '));
  };

  // Helper to remove item at index
  const handleRemoveItemAt = (index: number) => {
    const currentList = textInput.split(',').map(s => s.trim()).filter(Boolean);
    currentList.splice(index, 1);
    setTextInput(currentList.join(', '));
  };

  // Submit Answer & Calculate strict positional score
  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (parsedUserItems.length === 0) return;

    const correctSequence = currentLevelConfig.items.map(item => item.name);
    const totalItems = correctSequence.length;

    let correctPositions = 0;
    for (let i = 0; i < totalItems; i++) {
      const userItem = parsedUserItems[i] ? normalizeItemName(parsedUserItems[i]) : '';
      const correctItem = normalizeItemName(correctSequence[i]);

      if (userItem === correctItem) {
        correctPositions++;
      }
    }

    const percentage = Math.round((correctPositions / totalItems) * 100);

    const newResult: NeuroRecallRoundResult = {
      level: currentLevelConfig.level,
      totalItems: totalItems,
      correctPositionsCount: correctPositions,
      scorePercentage: percentage,
      userSequence: parsedUserItems,
      correctSequence: correctSequence,
    };

    const updatedHistory = [...roundResults, newResult];
    setRoundResults(updatedHistory);
    setPhase('levelResult');
  };

  // Proceed to next level or final result
  const handleNextLevel = () => {
    if (currentLevelIndex < NEURORECALL_LEVELS.length - 1) {
      startLevel(currentLevelIndex + 1);
    } else {
      // Completed all 5 rounds! Total items = 5 + 8 + 11 + 14 + 17 = 55
      const totalCorrect = roundResults.reduce((acc, r) => acc + r.correctPositionsCount, 0);
      const overallPercentage = Math.round((totalCorrect / 55) * 100);
      onFinishGame(overallPercentage);
      setPhase('finalResult');
    }
  };

  const handlePlayAgain = () => {
    setRoundResults([]);
    setCurrentLevelIndex(0);
    startLevel(0);
  };

  // Final summary statistics
  const totalCorrectItems = roundResults.reduce((acc, r) => acc + r.correctPositionsCount, 0);
  const totalPossibleItems = roundResults.reduce((acc, r) => acc + r.totalItems, 0) || 55;
  const overallMemoryScore = Math.round((totalCorrectItems / totalPossibleItems) * 100);

  // ---------------- RENDER ----------------

  // 1. INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
          <Brain className="w-3.5 h-3.5" />
          <span>ORDERED VISUAL MEMORY</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          NEURORECALL
        </h1>
        <p className="text-purple-400 font-semibold text-lg mb-6">
          "Observe. Remember. Reconstruct."
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left mb-8 space-y-4">
          <p className="text-base text-slate-200 font-medium">
            Test visual working memory and sequential reconstruction.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Fixed Memorization Window</span>
              <span className="text-sm font-mono-numbers font-bold text-purple-400">45.0 seconds (all levels)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Sequential Difficulty</span>
              <span className="text-sm font-mono-numbers font-bold text-white">5 → 8 → 11 → 14 → 17 items</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Evaluation Rule</span>
              <span className="text-sm font-bold text-emerald-400">Exact sequence & positions</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            Reconstruct the sequence in the exact order they appeared. Each item must match its initial numbered position (Position 1, Position 2, etc.) rather than any random order.
          </p>
        </div>

        <button
          type="button"
          onClick={() => startLevel(0)}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-base transition-all duration-200 cursor-pointer shadow-lg shadow-purple-500/20"
        >
          START CHALLENGE →
        </button>
      </div>
    );
  }

  // 2. PLAYING / MEMORIZATION SCREEN
  if (phase === 'playing') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in flex flex-col items-center">
        {/* Game Status */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-purple-400 block">
              NEURORECALL
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              LEVEL {currentLevelConfig.level} / 5
            </span>
          </div>
          <span className="text-xs font-mono-numbers text-purple-400 font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            {currentLevelConfig.itemsCount} ITEMS TO MEMORIZE
          </span>
        </div>

        {/* 45s Timer */}
        <div className="w-full mb-8">
          <Timer
            timeLeft={timeLeft}
            totalTime={45.0}
            label="MEMORIZATION WINDOW"
          />
        </div>

        {/* Ordered Visual Cards Grid */}
        <div className="w-full mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4 text-center">
            Memorize these {currentLevelConfig.itemsCount} items in their numbered sequence:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 select-none">
            {currentLevelConfig.items.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md transition-all group"
              >
                {/* Positional Badge */}
                <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-[11px] font-mono-numbers font-bold flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                  {idx + 1}
                </span>

                {/* Emoji Icon */}
                <div className="text-3xl sm:text-4xl my-2">
                  {item.emoji}
                </div>

                {/* Name */}
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-400 font-normal">
            Items will disappear automatically when the 45-second timer reaches zero.
          </p>
          <button
            type="button"
            onClick={handleFinishMemorizingEarly}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            I've Memorized Them (Start Recall) →
          </button>
        </div>
      </div>
    );
  }

  // 3. MEMORY LOCKED TRANSITION
  if (phase === 'locked') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-purple-400">
          TIME'S UP
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1 mb-3">
          MEMORY LOCKED
        </h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          All visual stimuli have been removed. Reconstruct the ordered sequence from your working memory.
        </p>

        <button
          type="button"
          onClick={proceedToRecall}
          className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
        >
          <span>RECALL THE ITEMS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 4. RECALL ANSWER SCREEN
  if (phase === 'answering') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-purple-400 block">
              NEURORECALL • ORDERED RECONSTRUCTION
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              LEVEL {currentLevelConfig.level} / 5
            </span>
          </div>
          <span className="text-xs font-mono-numbers text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            {currentLevelConfig.itemsCount} ITEMS EXPECTED
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
            RECALL THE ITEMS
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter the items in the exact chronological order they appeared (positions 1 to {currentLevelConfig.itemsCount}). Separate each item with commas.
          </p>
        </div>

        <form onSubmit={handleSubmitAnswer} className="space-y-6">
          {/* Main Text Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 focus-within:border-purple-500 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="e.g. apple, bicycle, moon, guitar, key"
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          {/* Current Ordered Sequence Preview */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400">
              <span>Your Current Order ({parsedUserItems.length} of {currentLevelConfig.itemsCount})</span>
              {parsedUserItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTextInput('')}
                  className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {parsedUserItems.length === 0 ? (
              <p className="text-xs text-slate-600 italic py-2">
                No items entered yet. Type above or tap the quick-select chips below.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {parsedUserItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 font-medium"
                  >
                    <span className="font-mono-numbers text-[11px] text-purple-400 font-bold">
                      {idx + 1}.
                    </span>
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItemAt(idx)}
                      className="text-purple-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick-Select Bank of Items with Grayed Out State for Already Selected Items */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center justify-between">
              <span>Tap to append in order (unique items only):</span>
              <span className="text-[10px] text-purple-400 font-normal">Randomized bank with extra items</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {appendBankItems.map((item, idx) => {
                const isAlreadySelected = parsedUserItems.some(
                  u => normalizeItemName(u) === normalizeItemName(item.name)
                );

                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    disabled={isAlreadySelected}
                    onClick={() => handleAddItemFromBank(item.name)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isAlreadySelected
                        ? 'bg-slate-950/60 border-slate-800/40 text-slate-600 opacity-40 cursor-not-allowed'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/60 cursor-pointer shadow-sm'
                    }`}
                    title={isAlreadySelected ? 'Already added to sequence' : 'Add to sequence'}
                  >
                    <span className={isAlreadySelected ? 'grayscale opacity-60' : ''}>{item.emoji}</span>
                    <span>{item.name}</span>
                    {isAlreadySelected ? (
                      <Check className="w-3 h-3 text-slate-600" />
                    ) : (
                      <Plus className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={parsedUserItems.length === 0}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                parsedUserItems.length > 0
                  ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              SUBMIT ORDER RECALL
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 5. LEVEL RESULT SCREEN
  if (phase === 'levelResult') {
    const lastResult = roundResults[roundResults.length - 1];

    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
          ROUND EVALUATION
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-6">
          LEVEL {lastResult.level} COMPLETE
        </h2>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 mb-8 shadow-xl text-left">
          {/* Summary scores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 block mb-1">
                ITEMS REMEMBERED
              </span>
              <span className="font-mono-numbers text-2xl font-bold text-white">
                {lastResult.correctPositionsCount} / {lastResult.totalItems}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 block mb-1">
                ORDER ACCURACY
              </span>
              <span className="font-mono-numbers text-3xl font-extrabold text-purple-400">
                {lastResult.scorePercentage}%
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Positional Table Comparison */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-3">
              Sequential Position Breakdown
            </span>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {lastResult.correctSequence.map((correctItemName, i) => {
                const userItem = lastResult.userSequence[i] || '—';
                const isMatch = normalizeItemName(userItem) === normalizeItemName(correctItemName);

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                      isMatch
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 font-mono-numbers font-bold flex items-center justify-center text-slate-400 text-[10px]">
                        {i + 1}
                      </span>
                      <span>Guess: <strong>{userItem}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isMatch && (
                        <span className="text-slate-400 text-[11px]">
                          Target: {correctItemName}
                        </span>
                      )}
                      {isMatch ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextLevel}
          className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
        >
          <span>{currentLevelIndex < 4 ? 'NEXT LEVEL' : 'VIEW FINAL RESULTS'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 6. FINAL RESULT SCREEN
  if (phase === 'finalResult') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
            EVALUATION COMPLETE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            NEURORECALL COMPLETE
          </h1>
          <p className="text-xs text-slate-400">
            Based on your five-round visual memory performance.
          </p>
        </div>

        {/* Primary Memory Score Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center mb-6 shadow-2xl relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-2">
            MEMORY SCORE
          </span>

          <div className="text-6xl sm:text-7xl font-extrabold text-white mb-2">
            <ScoreCounter value={overallMemoryScore} duration={1200} />
          </div>

          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Session Ordered Recall Accuracy
          </span>
        </div>

        {/* 5-Round Breakdown List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            ROUND PERFORMANCE BREAKDOWN
          </h4>

          <div className="space-y-3">
            {roundResults.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">LEVEL {r.level}</span>
                  <span className="text-[11px] text-slate-500">
                    ({r.totalItems} items)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-mono-numbers">
                    {r.correctPositionsCount} / {r.totalItems} correct
                  </span>
                  <span className="font-mono-numbers text-sm font-bold text-purple-400 w-12 text-right">
                    {r.scorePercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              TOTAL ITEMS CORRECT
            </span>
            <span className="font-mono-numbers text-2xl font-bold text-white">
              {totalCorrectItems} / {totalPossibleItems}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              ORDER ACCURACY
            </span>
            <span className="font-mono-numbers text-2xl font-bold text-purple-400">
              {overallMemoryScore}%
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center mb-8 px-4 leading-relaxed">
          Based on your five-round visual memory performance. This reflects serial position retention and working memory capacity within a 45-second memorization window.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="flex-1 py-3.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all cursor-pointer border border-slate-700 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>BACK TO NEUROPLAY</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
