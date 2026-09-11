import React, { useState, useEffect, useRef } from 'react';
import { Zap, Check, X, ArrowRight, RotateCcw, Home, Clock, Eye, Sparkles, Lock } from 'lucide-react';
import { Timer } from '../components/Timer';
import { ScoreCounter } from '../components/ScoreCounter';
import { NEUROFLASH_LEVELS, FLASH_COLOR_PALETTES, generateRandomDigits } from '../data/neuroflashData';
import { NeuroFlashRoundResult, GamePhase } from '../types';

interface NeuroFlashProps {
  onFinishGame: (finalScorePercentage: number) => void;
  onBackToHome: () => void;
}

export const NeuroFlash: React.FC<NeuroFlashProps> = ({
  onFinishGame,
  onBackToHome,
}) => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0); // 0 to 4
  const [timeLeft, setTimeLeft] = useState<number>(2.0);
  const [targetDigits, setTargetDigits] = useState<string>('7382');
  const [userDigits, setUserDigits] = useState<string>('');
  const [colorPalette, setColorPalette] = useState<string[]>(FLASH_COLOR_PALETTES[0]);

  // Round results
  const [roundResults, setRoundResults] = useState<NeuroFlashRoundResult[]>([]);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLevelConfig = NEUROFLASH_LEVELS[currentLevelIndex];
  const currentDigitCount = currentLevelConfig.digitCount;

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

  // Auto-focus input when in answering phase
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
    const config = NEUROFLASH_LEVELS[levelIndex];
    const newTarget = generateRandomDigits(config.digitCount);
    setTargetDigits(newTarget);
    setUserDigits('');

    // Assign colors from palette for this level
    const palette = FLASH_COLOR_PALETTES[levelIndex % FLASH_COLOR_PALETTES.length];
    setColorPalette(palette);

    setTimeLeft(config.timeLimit);
    setPhase('playing');

    // Interval for high precision countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const nextTime = +(prev - 0.1).toFixed(1);
        if (nextTime <= 0) {
          clearCurrentTimer();
          handleFlashTimeout();
          return 0;
        }
        return nextTime;
      });
    }, 100);
  };

  const handleFlashTimeout = () => {
    clearCurrentTimer();
    setPhase('locked');
  };

  // User moves from locked screen to answer prompt
  const proceedToAnswer = () => {
    setUserDigits('');
    setPhase('answering');
  };

  // Handle digit input (allow numbers only, max currentDigitCount)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[^0-9]/g, '').slice(0, currentDigitCount);
    setUserDigits(filtered);
  };

  // Submit Answer & Calculate positional score
  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (userDigits.length === 0) return;

    const totalDigits = targetDigits.length;
    const paddedUser = userDigits.padEnd(totalDigits, ' ');

    let correctCount = 0;
    for (let i = 0; i < totalDigits; i++) {
      if (paddedUser[i] === targetDigits[i]) {
        correctCount++;
      }
    }

    const percentage = Math.round((correctCount / totalDigits) * 100);

    const newResult: NeuroFlashRoundResult = {
      level: currentLevelConfig.level,
      targetDigits: targetDigits,
      userDigits: userDigits,
      correctDigitsCount: correctCount,
      scorePercentage: percentage,
    };

    const updatedHistory = [...roundResults, newResult];
    setRoundResults(updatedHistory);
    setPhase('levelResult');
  };

  // Proceed to next level or final result
  const handleNextLevel = () => {
    if (currentLevelIndex < NEUROFLASH_LEVELS.length - 1) {
      startLevel(currentLevelIndex + 1);
    } else {
      // Completed all 5 rounds!
      const totalCorrect = roundResults.reduce((acc, r) => acc + r.correctDigitsCount, 0);
      const totalPossible = roundResults.reduce((acc, r) => acc + r.targetDigits.length, 0);
      const finalScore = Math.round((totalCorrect / (totalPossible || 30)) * 100);
      onFinishGame(finalScore);
      setPhase('finalResult');
    }
  };

  // Play again
  const handlePlayAgain = () => {
    setRoundResults([]);
    setCurrentLevelIndex(0);
    startLevel(0);
  };

  // Total summary calculations
  const totalDigitsCorrect = roundResults.reduce((acc, r) => acc + r.correctDigitsCount, 0);
  const totalPossibleDigits = roundResults.reduce((acc, r) => acc + r.targetDigits.length, 0) || 30;
  const finalPercentage = Math.round((totalDigitsCorrect / totalPossibleDigits) * 100);

  // Determine best level
  const bestLevel = roundResults.reduce((best, curr) => {
    return curr.scorePercentage > best.scorePercentage ? curr : best;
  }, roundResults[0] || { level: 1, scorePercentage: 0 });

  // ---------------- RENDER ----------------

  // 1. INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>VISUAL DIGIT RECALL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          NEUROFLASH
        </h1>
        <p className="text-amber-400 font-semibold text-lg mb-6">
          "See it. Hold it. Recall it."
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left mb-8 space-y-4">
          <p className="text-base text-slate-200 font-medium">
            "Can you remember what you barely had time to see?"
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Structure</span>
              <span className="text-sm font-bold text-white">5 Progressive Levels</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Length Scaling</span>
              <span className="text-sm font-bold text-amber-300">4 → 5 → 6 → 7 → 8 digits</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Distraction</span>
              <span className="text-sm font-bold text-amber-400">Chromatic colors</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Exposure</span>
              <span className="text-sm font-bold text-rose-400">2.0s down to 0.4s</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            Number lengths expand each round while display time steadily decreases. Memorize each digit in its exact positional order.
          </p>
        </div>

        <button
          type="button"
          onClick={() => startLevel(0)}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/20"
        >
          START CHALLENGE →
        </button>
      </div>
    );
  }

  // 2. PLAYING / FLASH SCREEN
  if (phase === 'playing') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in flex flex-col items-center">
        {/* Game Status */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-400 block">
              NEUROFLASH
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              LEVEL {currentLevelConfig.level} / 5 • {currentLevelConfig.digitCount} DIGITS
            </span>
          </div>
          <span className="text-xs font-mono-numbers text-amber-400 font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            {currentLevelConfig.timeLimit.toFixed(1)}s FLASH
          </span>
        </div>

        {/* Timer / Progress Bar */}
        <div className="w-full mb-10">
          <Timer
            timeLeft={timeLeft}
            totalTime={currentLevelConfig.timeLimit}
            label="REMEMBER"
            isUrgent={timeLeft <= 1.0}
          />
        </div>

        {/* Dynamic Digits rendered with distinct colors */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl flex items-center justify-center select-none overflow-x-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 font-mono-numbers flex-wrap">
            {targetDigits.split('').map((digit, idx) => (
              <div
                key={idx}
                className="w-12 sm:w-16 md:w-20 h-20 sm:h-28 md:h-32 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-inner"
              >
                <span
                  className="text-4xl sm:text-6xl md:text-7xl font-extrabold"
                  style={{ color: colorPalette[idx] || '#fff' }}
                >
                  {digit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Focus on digit positions. The sequence disappears immediately.
        </p>
      </div>
    );
  }

  // 3. NUMBER LOCKED SCREEN
  if (phase === 'locked') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
          TIME'S UP
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1 mb-3">
          NUMBER LOCKED
        </h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The rapidly displayed number has vanished. Reconstruct the {currentLevelConfig.digitCount}-digit sequence from your iconic visual memory.
        </p>

        <button
          type="button"
          onClick={proceedToAnswer}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <span>ENTER YOUR RECALL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 4. ANSWER INPUT SCREEN
  if (phase === 'answering') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 animate-fade-in text-center">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-400 block">
              NEUROFLASH • DIGIT RECALL
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              LEVEL {currentLevelConfig.level} / 5
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {currentLevelConfig.digitCount} DIGITS REQUIRED
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
          WHAT NUMBER DID YOU SEE?
        </h3>
        <p className="text-xs text-slate-400 mb-8">
          Enter the {currentLevelConfig.digitCount} digits in the exact order they appeared.
        </p>

        <form onSubmit={handleSubmitAnswer} className="space-y-6">
          {/* Digit Boxes Display */}
          <div className="flex justify-center gap-2 sm:gap-3 font-mono-numbers flex-wrap">
            {Array.from({ length: currentLevelConfig.digitCount }).map((_, pos) => {
              const char = userDigits[pos] || '';
              return (
                <div
                  key={pos}
                  className={`w-10 sm:w-14 h-14 sm:h-18 rounded-2xl border flex items-center justify-center text-2xl sm:text-3xl font-extrabold transition-all ${
                    char
                      ? 'bg-slate-900 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-600'
                  }`}
                >
                  {char || '•'}
                </div>
              );
            })}
          </div>

          {/* Hidden/Native Number Input */}
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={currentLevelConfig.digitCount}
            value={userDigits}
            onChange={handleInputChange}
            placeholder={`Type ${currentLevelConfig.digitCount} digits`}
            className="w-full max-w-xs mx-auto py-3 px-4 bg-slate-900 border border-slate-800 rounded-xl text-center text-lg font-mono-numbers font-bold text-white tracking-widest focus:outline-none focus:border-amber-400 transition-colors"
          />

          <div>
            <button
              type="submit"
              disabled={userDigits.length !== currentLevelConfig.digitCount}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                userDigits.length === currentLevelConfig.digitCount
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              SUBMIT ANSWER
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 5. LEVEL RESULT SCREEN
  if (phase === 'levelResult') {
    const lastResult = roundResults[roundResults.length - 1];
    const targetArray = lastResult.targetDigits.split('');
    const userArray = lastResult.userDigits.padEnd(targetArray.length, ' ').split('');

    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          ROUND EVALUATION
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-6">
          LEVEL {lastResult.level} COMPLETE
        </h2>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 mb-8 shadow-xl text-left">
          {/* Positional digit inspection */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase mb-3">
              <span>Position Comparison</span>
              <span className="text-amber-400">
                {lastResult.correctDigitsCount} / {targetArray.length} Correct
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono-numbers">
              {targetArray.map((targetDigit, i) => {
                const userChar = userArray[i] || '';
                const isMatch = userChar === targetDigit;

                return (
                  <div
                    key={i}
                    className={`p-2 sm:p-3 rounded-2xl border text-center ${
                      isMatch
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 uppercase">Pos {i + 1}</div>
                    <div className="text-xl sm:text-2xl font-bold my-1">{userChar || '-'}</div>
                    <div className="text-xs flex items-center justify-center">
                      {isMatch ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <X className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-[10px] font-semibold text-rose-300">({targetDigit})</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Answer text comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block mb-1">
                YOUR ANSWER
              </span>
              <span className="font-mono-numbers text-xl sm:text-2xl font-bold text-slate-200 break-all">
                {lastResult.userDigits || 'None'}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block mb-1">
                CORRECT ANSWER
              </span>
              <span className="font-mono-numbers text-xl sm:text-2xl font-bold text-amber-400 break-all">
                {lastResult.targetDigits}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Level score */}
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 block">
                DIGITS CORRECT
              </span>
              <span className="font-mono-numbers text-xl font-bold text-white">
                {lastResult.correctDigitsCount} / {targetArray.length}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 block">
                LEVEL SCORE
              </span>
              <span className="font-mono-numbers text-3xl font-extrabold text-amber-400">
                {lastResult.scorePercentage}%
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextLevel}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            EVALUATION COMPLETE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            NEUROFLASH COMPLETE
          </h1>
          <p className="text-xs text-slate-400">
            Based on your five-round performance.
          </p>
        </div>

        {/* Primary Visual Recall Score Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center mb-6 shadow-2xl relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            VISUAL RECALL SCORE
          </span>

          <div className="text-6xl sm:text-7xl font-extrabold text-white mb-2">
            <ScoreCounter value={finalPercentage} duration={1200} />
          </div>

          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Session Digit Accuracy
          </span>
        </div>

        {/* Level Breakdown Grid */}
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
                    ({r.targetDigits.length} digits, {NEUROFLASH_LEVELS[i]?.timeLimit.toFixed(1)}s)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-mono-numbers">
                    {r.correctDigitsCount} / {r.targetDigits.length} digits
                  </span>
                  <span className="font-mono-numbers text-sm font-bold text-amber-400 w-12 text-right">
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
              TOTAL DIGITS CORRECT
            </span>
            <span className="font-mono-numbers text-2xl font-bold text-white">
              {totalDigitsCorrect} / {totalPossibleDigits}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              BEST LEVEL
            </span>
            <span className="font-mono-numbers text-2xl font-bold text-amber-400">
              LEVEL {bestLevel.level}
            </span>
          </div>
        </div>

        {/* Objective Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center mb-8 px-4 leading-relaxed">
          This is a game-based score based on your performance in this session. It measures working memory capacity under brief perceptual exposure and chromatic interference.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
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
