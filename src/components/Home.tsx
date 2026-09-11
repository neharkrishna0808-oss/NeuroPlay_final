import React, { useRef } from 'react';
import { BookOpen, Zap, Brain, Sparkles, Activity, ShieldAlert, Award } from 'lucide-react';
import { GameCard } from './GameCard';
import { NeuralNetworkVisual } from './NeuralNetworkVisual';
import { GameId, SessionScores } from '../types';

interface HomeProps {
  sessionScores: SessionScores;
  onSelectGame: (gameId: GameId) => void;
  onOpenHowItWorks: () => void;
}

export const Home: React.FC<HomeProps> = ({
  sessionScores,
  onSelectGame,
  onOpenHowItWorks,
}) => {
  const gamesSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between pb-16">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-12 px-4 sm:px-6 max-w-5xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BROWSER-BASED COGNITIVE TRAINING</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
          NEURO<span className="text-cyan-400">PLAY</span>
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-slate-200 tracking-tight mb-3">
          "Challenge the way you think."
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Three quick challenges. Test your reading, visual recall and memory.
        </p>

        {/* Abstract Neural Network Graphic */}
        <div className="my-4">
          <NeuralNetworkVisual />
        </div>
      </section>

      {/* Challenge Selection Section */}
      <section ref={gamesSectionRef} id="games" className="max-w-6xl mx-auto px-4 sm:px-6 w-full pt-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">
              Select Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              CHOOSE YOUR CHALLENGE
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="hidden sm:inline-flex text-xs font-semibold text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Review Science & Rules
          </button>
        </div>

        {/* 3 Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: NeuroRead */}
          <GameCard
            id="neuroread"
            title="NEUROREAD"
            subtitle="Decode. Read. Remember."
            description="Read through scrambled text before time runs out, then prove you understood it."
            buttonLabel="PLAY NEUROREAD"
            icon={<BookOpen className="w-6 h-6 text-cyan-400" />}
            accentColor="cyan"
            sessionScore={sessionScores.neuroread}
            onSelect={onSelectGame}
          />

          {/* Card 2: NeuroFlash */}
          <GameCard
            id="neuroflash"
            title="NEUROFLASH"
            subtitle="See it. Hold it. Recall it."
            description="Remember rapidly displayed coloured digits before they disappear."
            buttonLabel="PLAY NEUROFLASH"
            icon={<Zap className="w-6 h-6 text-amber-400" />}
            accentColor="amber"
            sessionScore={sessionScores.neuroflash}
            onSelect={onSelectGame}
          />

          {/* Card 3: NeuroRecall */}
          <GameCard
            id="neurorecall"
            title="NEURORECALL"
            subtitle="Observe. Remember. Reconstruct."
            description="Memorize a collection of visual items and recall them in the correct order."
            buttonLabel="PLAY NEURORECALL"
            icon={<Brain className="w-6 h-6 text-purple-400" />}
            accentColor="purple"
            sessionScore={sessionScores.neurorecall}
            onSelect={onSelectGame}
          />
        </div>
      </section>

      {/* Session Scores Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full pt-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                YOUR SESSION
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Current Browser State
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* NeuroRead Score */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">NeuroRead</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Best</span>
                <span className="font-mono-numbers text-lg font-bold">
                  {sessionScores.neuroread !== null ? (
                    <span className="text-cyan-400">{sessionScores.neuroread}%</span>
                  ) : (
                    <span className="text-slate-600 text-sm">NOT PLAYED</span>
                  )}
                </span>
              </div>
            </div>

            {/* NeuroFlash Score */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">NeuroFlash</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Best</span>
                <span className="font-mono-numbers text-lg font-bold">
                  {sessionScores.neuroflash !== null ? (
                    <span className="text-amber-400">{sessionScores.neuroflash}%</span>
                  ) : (
                    <span className="text-slate-600 text-sm">NOT PLAYED</span>
                  )}
                </span>
              </div>
            </div>

            {/* NeuroRecall Score */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">NeuroRecall</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Best</span>
                <span className="font-mono-numbers text-lg font-bold">
                  {sessionScores.neurorecall !== null ? (
                    <span className="text-purple-400">{sessionScores.neurorecall}%</span>
                  ) : (
                    <span className="text-slate-600 text-sm">NOT PLAYED</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
