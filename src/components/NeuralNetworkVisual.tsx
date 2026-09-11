import React from 'react';

export const NeuralNetworkVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-md h-40 mx-auto flex items-center justify-center pointer-events-none select-none">
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full scale-75" />

      {/* SVG Neural Connections */}
      <svg className="w-full h-full text-cyan-400/30" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Synaptic Pathway Lines */}
        <line x1="60" y1="80" x2="130" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />
        <line x1="60" y1="80" x2="130" y2="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />
        <line x1="130" y1="40" x2="200" y2="80" stroke="currentColor" strokeWidth="2" className="opacity-80" />
        <line x1="130" y1="120" x2="200" y2="80" stroke="currentColor" strokeWidth="2" className="opacity-80" />
        <line x1="130" y1="40" x2="270" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="opacity-50" />
        <line x1="130" y1="120" x2="270" y2="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="opacity-50" />
        <line x1="200" y1="80" x2="270" y2="40" stroke="currentColor" strokeWidth="2" className="opacity-80" />
        <line x1="200" y1="80" x2="270" y2="120" stroke="currentColor" strokeWidth="2" className="opacity-80" />
        <line x1="270" y1="40" x2="340" y2="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />
        <line x1="270" y1="120" x2="340" y2="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />

        {/* Central Core Circle Accent */}
        <circle cx="200" cy="80" r="28" stroke="rgb(6 182 212 / 0.2)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Synaptic Node Dots */}
        <circle cx="60" cy="80" r="4" fill="#06b6d4" />
        <circle cx="130" cy="40" r="5" fill="#22d3ee" />
        <circle cx="130" cy="120" r="5" fill="#22d3ee" />
        
        {/* Central Hub Node */}
        <circle cx="200" cy="80" r="7" fill="#00f5d4" />

        <circle cx="270" cy="40" r="5" fill="#22d3ee" />
        <circle cx="270" cy="120" r="5" fill="#22d3ee" />
        <circle cx="340" cy="80" r="4" fill="#06b6d4" />
      </svg>
    </div>
  );
};
