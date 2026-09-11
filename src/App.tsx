/**
 * NEUROPLAY — Main Application Entry Component
 * 
 * "Challenge the way you think."
 * 
 * Browser-based brain-training game platform with three cognitive challenges:
 * 1. NEUROREAD — Speed reading with typoglycemia text scrambling and factual comprehension.
 * 2. NEUROFLASH — Rapid iconic digit recall under color distraction and decreasing exposure.
 * 3. NEURORECALL — Serial-position visual memory reconstruction with an expanding item pool.
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ConfirmModal } from './components/ConfirmModal';
import { NeuroRead } from './games/NeuroRead';
import { NeuroFlash } from './games/NeuroFlash';
import { NeuroRecall } from './games/NeuroRecall';
import { GameId, SessionScores } from './types';

export default function App() {
  // Current active game (null shows the main landing page)
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  // In-session best scores stored in React state (no localStorage or database)
  const [sessionScores, setSessionScores] = useState<SessionScores>({
    neuroread: null,
    neuroflash: null,
    neurorecall: null,
  });

  // Modal states
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState<boolean>(false);

  // Handle game selection from the home screen
  const handleSelectGame = (gameId: GameId) => {
    setActiveGame(gameId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when a user clicks the Back button in the navbar while playing
  const handleRequestBackToHome = () => {
    if (activeGame) {
      // Show confirmation dialog to prevent accidental navigation
      setIsConfirmExitOpen(true);
    } else {
      setActiveGame(null);
    }
  };

  // Confirm exiting current game session
  const handleConfirmExit = () => {
    setIsConfirmExitOpen(false);
    setActiveGame(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When a game session finishes all 5 rounds, update the session high score
  const handleFinishGame = (gameId: GameId, finalScorePercentage: number) => {
    setSessionScores(prev => {
      const currentBest = prev[gameId];
      const newBest = currentBest !== null ? Math.max(currentBest, finalScorePercentage) : finalScorePercentage;
      return {
        ...prev,
        [gameId]: newBest,
      };
    });
  };

  // Scroll to games section on homepage
  const handleScrollToGames = () => {
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Universal Top Navigation */}
      <Navbar
        activeGame={activeGame}
        onBackToHome={handleRequestBackToHome}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onScrollToGames={handleScrollToGames}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!activeGame && (
          <Home
            sessionScores={sessionScores}
            onSelectGame={handleSelectGame}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}

        {activeGame === 'neuroread' && (
          <NeuroRead
            onFinishGame={(score) => handleFinishGame('neuroread', score)}
            onBackToHome={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'neuroflash' && (
          <NeuroFlash
            onFinishGame={(score) => handleFinishGame('neuroflash', score)}
            onBackToHome={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'neurorecall' && (
          <NeuroRecall
            onFinishGame={(score) => handleFinishGame('neurorecall', score)}
            onBackToHome={() => setActiveGame(null)}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 bg-[#080b13] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono-numbers font-bold text-slate-400">NEUROPLAY</span>
            <span>•</span>
            <span className="italic">"Challenge the way you think."</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Frontend Cognitive Prototype • React, JavaScript, Tailwind CSS
          </div>
        </div>
      </footer>

      {/* Informational Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmExitOpen}
        title="Return to Main Menu?"
        message="Your active progress in this challenge will be discarded. Are you sure you want to exit to the home screen?"
        confirmLabel="Exit to NeuroPlay"
        cancelLabel="Keep Playing"
        onConfirm={handleConfirmExit}
        onCancel={() => setIsConfirmExitOpen(false)}
      />
    </div>
  );
}
