import React from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import { GameId } from '../types';

interface GameCardProps {
  id: GameId;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  icon: React.ReactNode;
  accentColor: string; // e.g. "cyan", "amber", "purple"
  sessionScore: number | null;
  onSelect: (gameId: GameId) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  subtitle,
  description,
  buttonLabel,
  icon,
  accentColor,
  sessionScore,
  onSelect,
}) => {
  // Border and accent styling based on game
  const colorMap: Record<string, { borderHover: string; glowHover: string; buttonBg: string; textAccent: string; badgeBg: string }> = {
    cyan: {
      borderHover: 'hover:border-cyan-500/60',
      glowHover: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]',
      buttonBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
      textAccent: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    },
    amber: {
      borderHover: 'hover:border-amber-500/60',
      glowHover: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
      buttonBg: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
      textAccent: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    },
    purple: {
      borderHover: 'hover:border-purple-500/60',
      glowHover: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]',
      buttonBg: 'bg-purple-500 hover:bg-purple-400 text-white',
      textAccent: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    },
  };

  const currentTheme = colorMap[accentColor] || colorMap.cyan;

  return (
    <div
      className={`group relative flex flex-col justify-between bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 ${currentTheme.borderHover} ${currentTheme.glowHover}`}
    >
      <div>
        {/* Top bar: Icon and Session Best Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3.5 rounded-2xl border ${currentTheme.badgeBg} transition-transform duration-300 group-hover:scale-105`}>
            {icon}
          </div>

          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              Session Best
            </span>
            <span className="font-mono-numbers text-sm font-bold text-slate-300">
              {sessionScore !== null ? (
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <Trophy className="w-3.5 h-3.5" />
                  {sessionScore}%
                </span>
              ) : (
                <span className="text-slate-600 font-medium">Not Played</span>
              )}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
          {title}
        </h3>
        <p className={`text-xs sm:text-sm font-semibold tracking-wide ${currentTheme.textAccent} mb-4`}>
          "{subtitle}"
        </p>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-6 font-normal">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onSelect(id)}
          className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${currentTheme.buttonBg} group-hover:gap-3`}
        >
          <span>{buttonLabel}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
