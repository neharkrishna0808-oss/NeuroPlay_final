import React from 'react';
import { ProgressBar } from './ProgressBar';

interface TimerProps {
  timeLeft: number; // in seconds, can have decimals e.g. 24.3
  totalTime: number; // in seconds
  showProgressBar?: boolean;
  label?: string;
  isUrgent?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  totalTime,
  showProgressBar = true,
  label = 'TIME REMAINING',
  isUrgent = false,
}) => {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  
  // Format to 1 decimal place (e.g. "30.0" or "02.4")
  const formattedTime = Math.max(0, timeLeft).toFixed(1);

  // Dynamic colors: cyan -> amber (<25%) -> rose (<15%)
  const isWarning = percentage < 25 || timeLeft <= 5;
  const isCritical = percentage < 15 || timeLeft <= 2;

  let colorClass = 'bg-cyan-400';
  let textColorClass = 'text-cyan-400';

  if (isCritical || isUrgent) {
    colorClass = 'bg-rose-500';
    textColorClass = 'text-rose-400';
  } else if (isWarning) {
    colorClass = 'bg-amber-400';
    textColorClass = 'text-amber-400';
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center select-none">
      <div className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-1">
        {label}
      </div>

      <div className={`font-mono-numbers text-4xl sm:text-5xl font-bold tracking-tight mb-3 ${textColorClass} transition-colors duration-200`}>
        {formattedTime}
        <span className="text-xl sm:text-2xl text-slate-500 ml-1 font-normal">s</span>
      </div>

      {showProgressBar && (
        <div className="w-full px-2">
          <ProgressBar progress={percentage} colorClass={colorClass} heightClass="h-2" />
        </div>
      )}
    </div>
  );
};
