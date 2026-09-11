import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, Sparkles, Clock, Check, Lock } from 'lucide-react';
import { Timer } from '../components/Timer';
import { ScoreCounter } from '../components/ScoreCounter';
import { NEUROREAD_PASSAGES } from '../data/neuroreadData';
import { NeuroReadRoundResult, GamePhase } from '../types';

interface NeuroReadProps {
  onFinishGame: (finalScorePercentage: number) => void;
  onBackToHome: () => void;
}

export const NeuroRead: React.FC<NeuroReadProps> = ({
  onFinishGame,
  onBackToHome,
}) => {
  // Game state
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0); // 0 to 4 (Levels 1 to 5)
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isReadingDone, setIsReadingDone] = useState<boolean>(false);

  // Comprehension questions state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // 0 or 1
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [levelQuestionsCorrect, setLevelQuestionsCorrect] = useState<number>(0);

  // Round tracking for all 5 levels
  const [roundResults, setRoundResults] = useState<NeuroReadRoundResult[]>([]);

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentPassage = NEUROREAD_PASSAGES[currentLevelIndex];
  const scrambledText = currentPassage.scrambledText;

  // Clean up timers on unmount or phase change
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

  // Handle starting a level
  const startLevel = (levelIndex: number) => {
    clearCurrentTimer();
    setCurrentLevelIndex(levelIndex);
    const timeLimit = NEUROREAD_PASSAGES[levelIndex].timeLimit;
    setTimeLeft(timeLimit);
    setIsReadingDone(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setLevelQuestionsCorrect(0);
    setPhase('playing');

    startTimeRef.current = Date.now();

    // Start high-precision interval
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const nextTime = +(prev - 0.1).toFixed(1);
        if (nextTime <= 0) {
          clearCurrentTimer();
          handlePassageTimeout();
          return 0;
        }
        return nextTime;
      });
    }, 100);
  };

  // Called when reading time expires
  const handlePassageTimeout = () => {
    clearCurrentTimer();
    setPhase('locked');
  };

  // User voluntarily finishes reading before timer hits zero
  const handleFinishedReadingEarly = () => {
    clearCurrentTimer();
    setPhase('locked');
  };

  // Transition from locked passage to questions
  const proceedToQuestions = () => {
    setPhase('answering');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  // Submit current comprehension question answer
  const handleSubmitQuestion = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const currentQ = currentPassage.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;

    setIsAnswerSubmitted(true);
    const updatedCorrect = isCorrect ? levelQuestionsCorrect + 1 : levelQuestionsCorrect;
    if (isCorrect) {
      setLevelQuestionsCorrect(prev => prev + 1);
    }

    // After brief feedback, advance to question 2 or level result
    setTimeout(() => {
      if (currentQuestionIndex === 0) {
        setCurrentQuestionIndex(1);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
      } else {
        // Both questions answered! Record level results
        const timeUsed = Math.max(1, currentPassage.timeLimit - timeLeft);
        const levelScore = updatedCorrect * 50; // 0, 50, or 100

        const newResult: NeuroReadRoundResult = {
          level: currentPassage.level,
          correctCount: updatedCorrect,
          score: levelScore,
          timeUsed: timeUsed,
          totalTime: currentPassage.timeLimit,
        };

        const updatedHistory = [...roundResults, newResult];
        setRoundResults(updatedHistory);
        setPhase('levelResult');
      }
    }, 1200);
  };

  // Proceed to next level or final result
  const handleNextLevel = () => {
    if (currentLevelIndex < NEUROREAD_PASSAGES.length - 1) {
      startLevel(currentLevelIndex + 1);
    } else {
      // Finished Level 5!
      const totalScore = roundResults.reduce((acc, r) => acc + r.score, 0);
      const finalPercent = Math.round((totalScore / 500) * 100);
      onFinishGame(finalPercent);
      setPhase('finalResult');
    }
  };

  // Reset and replay
  const handlePlayAgain = () => {
    setRoundResults([]);
    setCurrentLevelIndex(0);
    startLevel(0);
  };

  // Calculate final summary metrics
  const totalQuestionsCorrect = roundResults.reduce((acc, r) => acc + r.correctCount, 0);
  const totalScore = roundResults.reduce((acc, r) => acc + r.score, 0);
  const sessionReadingScore = Math.round((totalScore / 500) * 100);

  // Comprehension accuracy percentage
  const comprehensionMetric = Math.round((totalQuestionsCorrect / 10) * 100);

  // Reading Speed Metric: based on reading efficiency within allocated time
  const readingSpeedMetric = useMemo(() => {
    if (roundResults.length === 0) return 80;
    const avgRemainingRatio = roundResults.reduce((acc, r) => {
      const remaining = r.totalTime - r.timeUsed;
      return acc + (remaining / r.totalTime);
    }, 0) / roundResults.length;
    // Score scaled nicely between 65% and 98%
    return Math.min(98, Math.max(65, Math.round(70 + avgRemainingRatio * 30)));
  }, [roundResults]);

  // Consistency Metric: variance in scores across rounds
  const consistencyMetric = useMemo(() => {
    if (roundResults.length === 0) return 90;
    const scores = roundResults.map(r => r.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length;
    // Lower variance = higher consistency
    return Math.min(96, Math.max(70, Math.round(95 - Math.sqrt(variance) * 0.4)));
  }, [roundResults]);

  // ---------------- RENDER ----------------

  // 1. INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SPEED READING PROTOCOL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          NEUROREAD
        </h1>
        <p className="text-cyan-400 font-semibold text-lg mb-6">
          "Decode. Read. Remember."
        </p>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Typoglycemia Decryption</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                Each passage's internal word letters are scrambled, but first and last letters remain intact. Train your mind to read past the visual chaos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">5 Progressive Levels</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                Passages grow progressively longer and more intricate with dedicated timers (Level 1: 30s, Level 2: 40s, Level 3: 50s, Level 4: 60s, Level 5: 70s). The text completely locks when time runs out!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">2 Comprehension Checks</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                After reading, answer two multiple-choice questions per round to prove genuine comprehension.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => startLevel(0)}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          START CHALLENGE →
        </button>
      </div>
    );
  }

  // 2. PLAYING / READING SCREEN
  if (phase === 'playing') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in flex flex-col items-center">
        {/* Game Status Header */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-cyan-400 block">
              NEUROREAD
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              LEVEL {currentPassage.level} / 5
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
            {currentPassage.levelTitle}
          </span>
        </div>

        {/* Large Timer + Progress Bar */}
        <div className="w-full mb-8">
          <Timer
            timeLeft={timeLeft}
            totalTime={currentPassage.timeLimit}
            label="READING WINDOW"
          />
        </div>

        {/* The Scrambled Passage */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-8 shadow-xl">
          <div className="text-xs uppercase tracking-wider font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {currentPassage.title}
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-100 font-medium leading-relaxed tracking-normal select-none">
            {scrambledText}
          </p>
        </div>

        {/* Bottom Note & Early Done Button */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-400 font-normal">
            Read carefully. The passage disappears when time runs out.
          </p>
          <button
            type="button"
            onClick={handleFinishedReadingEarly}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            I've Finished Reading →
          </button>
        </div>
      </div>
    );
  }

  // 3. PASSAGE LOCKED / TIME'S UP TRANSITION
  if (phase === 'locked') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-rose-400">
          TIME'S UP
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1 mb-3">
          PASSAGE LOCKED
        </h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The scrambled text has been sealed. Now, prove your factual comprehension of what you just read.
        </p>

        <button
          type="button"
          onClick={proceedToQuestions}
          className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <span>CONTINUE TO QUESTIONS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 4. COMPREHENSION QUESTIONS SCREEN
  if (phase === 'answering') {
    const question = currentPassage.questions[currentQuestionIndex];
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-cyan-400 block">
              NEUROREAD • COMPREHENSION CHECK
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              LEVEL {currentPassage.level} / 5
            </span>
          </div>
          <span className="text-xs font-mono-numbers font-semibold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            QUESTION {currentQuestionIndex + 1} / 2
          </span>
        </div>

        {/* Question Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-6">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (idx === question.correctIndex) {
                  optionStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold';
                } else if (isSelected && idx !== question.correctIndex) {
                  optionStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-shake';
                }
              } else if (isSelected) {
                optionStyle = 'bg-cyan-500/10 border-cyan-400 text-white font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center gap-4 cursor-pointer ${optionStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {optionLabels[idx]}
                  </span>
                  <span className="text-sm leading-normal flex-1">
                    {optionText}
                  </span>

                  {isAnswerSubmitted && idx === question.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && idx !== question.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={selectedOption === null || isAnswerSubmitted}
            onClick={handleSubmitQuestion}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
              selectedOption !== null && !isAnswerSubmitted
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isAnswerSubmitted ? 'EVALUATING...' : 'SUBMIT ANSWER'}
          </button>
        </div>
      </div>
    );
  }

  // 5. LEVEL RESULT SCREEN
  if (phase === 'levelResult') {
    const lastResult = roundResults[roundResults.length - 1];

    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
          ROUND EVALUATION
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-8">
          LEVEL {lastResult.level} COMPLETE
        </h2>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 mb-8 shadow-xl">
          {/* Comprehension metric */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 block mb-1">
              COMPREHENSION
            </span>
            <span className="font-mono-numbers text-3xl font-bold text-white">
              {lastResult.correctCount} / 2
            </span>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Level score */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 block mb-1">
              SCORE
            </span>
            <span className="font-mono-numbers text-4xl font-extrabold text-cyan-400">
              {lastResult.score} / 100
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextLevel}
          className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            EVALUATION COMPLETE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            NEUROREAD COMPLETE
          </h1>
          <p className="text-xs text-slate-400">
            Based on your performance across five rounds.
          </p>
        </div>

        {/* Primary Score Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center mb-6 shadow-2xl relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-2">
            READING PERFORMANCE
          </span>

          <div className="text-6xl sm:text-7xl font-extrabold text-white mb-2">
            <ScoreCounter value={sessionReadingScore} duration={1200} />
          </div>

          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Session Reading Score
          </span>
        </div>

        {/* Three Calculated Sub-Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              COMPREHENSION
            </span>
            <span className="font-mono-numbers text-2xl font-bold text-white">
              {comprehensionMetric}%
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              READING SPEED
            </span>
            <span className="font-mono-numbers text-2xl font-bold text-white">
              {readingSpeedMetric}%
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              CONSISTENCY
            </span>
            <span className="font-mono-numbers text-2xl font-bold text-white">
              {consistencyMetric}%
            </span>
          </div>
        </div>

        {/* Session Stats Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">LEVELS COMPLETED</span>
            <span className="font-mono-numbers font-bold text-white">5 / 5</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">QUESTIONS CORRECT</span>
            <span className="font-mono-numbers font-bold text-cyan-400">{totalQuestionsCorrect} / 10</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">TOTAL SCORE</span>
            <span className="font-mono-numbers font-bold text-white">{totalScore} / 500</span>
          </div>
        </div>

        {/* Objective Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center mb-8 px-4 leading-relaxed">
          Your NeuroRead session score measures reading speed and factual retention under typoglycemia distortion. It is designed for cognitive engagement and focus training.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="flex-1 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
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
