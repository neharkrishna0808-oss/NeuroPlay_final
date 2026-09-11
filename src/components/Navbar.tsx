import React from 'react';
import { ArrowLeft, BrainCircuit, Sparkles, HelpCircle } from 'lucide-react';
import { GameId } from '../types';

interface NavbarProps {
  activeGame: GameId | null;
  onBackToHome: () => void;
  onOpenHowItWorks: () => void;
  onScrollToGames?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeGame,
  onBackToHome,
  onOpenHowItWorks,
  onScrollToGames,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Side: Brand or Back Button */}
        <div className="flex items-center gap-4">
          {activeGame ? (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to NeuroPlay</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold tracking-wider text-lg sm:text-xl text-white font-mono-numbers">
                  NEURO<span className="text-cyan-400">PLAY</span>
                </span>
                <span className="hidden sm:inline-block ml-2.5 text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                  Challenge the way you think
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {!activeGame && onScrollToGames && (
            <button
              type="button"
              onClick={onScrollToGames}
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Games
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>How It Works</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
