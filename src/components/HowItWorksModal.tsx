import React from 'react';
import { X, BookOpen, Zap, Brain, ShieldCheck } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            COGNITIVE FOUNDATIONS
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How NEUROPLAY Works
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore the cognitive mechanisms behind each of the three training disciplines.
          </p>
        </div>

        <div className="space-y-4">
          {/* NeuroRead */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">NEUROREAD</h3>
                <p className="text-xs text-cyan-400 font-medium">Speed Reading & Typoglycemia Decoding</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the cognitive phenomenon of typoglycemia: the human brain reads words as holistic units rather than letter-by-letter, provided the first and last letters remain fixed. As the clock ticks down, your brain is forced to suppress subvocalization and synthesize meaning directly from distorted glyphs.
            </p>
          </div>

          {/* NeuroFlash */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">NEUROFLASH</h3>
                <p className="text-xs text-amber-400 font-medium">Visual Iconic Storage & Positional Recall</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tests sensory iconic memory under chromatic interference. Number lengths expand across rounds (4 up to 8 digits) while exposure time steadily decreases (2.0s down to 0.4s) with each digit rendered in contrasting colors. This forces your working memory to separate numerical identity from distracting perceptual noise.
            </p>
          </div>

          {/* NeuroRecall */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">NEURORECALL</h3>
                <p className="text-xs text-purple-400 font-medium">Serial-Position Memory & Spatial Anchoring</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every level provides a constant 45 seconds to memorize visual item sets that expand from 5 up to 17 items. You must reconstruct the precise ordered sequence, exercising serial position chunking, associative mnemonic linking, and working memory capacity.
            </p>
          </div>
        </div>

        {/* Responsible score disclaimer note */}
        <div className="mt-6 flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            Scores and percentiles on NEUROPLAY are calibrated for session gamification and focus training. They reflect situational challenge performance and are not clinical or diagnostic measures.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
