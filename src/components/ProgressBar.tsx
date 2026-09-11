import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClass?: string;
  heightClass?: string;
  showGlow?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorClass = 'bg-cyan-400',
  heightClass = 'h-2',
  showGlow = false,
}) => {
  // Clamp progress between 0 and 100
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${heightClass} bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 relative`}>
      <div
        className={`h-full ${colorClass} rounded-full transition-all duration-100 ease-linear ${
          showGlow ? 'shadow-[0_0_12px_rgba(6,182,212,0.6)]' : ''
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
