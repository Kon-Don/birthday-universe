import React, { useState, useEffect, useCallback } from 'react';
import HippoEntrance from './sections/HippoEntrance';
import BirthdayReveal from './sections/BirthdayReveal';
import BirthdayLetter from './sections/BirthdayLetter';
import MemoryLane from './sections/MemoryLane';
import HippoMatchingGame from './games/HippoMatchingGame';
import MysteryGifts from './sections/MysteryGifts';
import FriendshipQuiz from './sections/FriendshipQuiz';
import MakeAWish from './sections/MakeAWish';
import LittleHappiness from './sections/LittleHappiness';
import SecretSurprises from './sections/SecretSurprises';
import GrandFinale from './sections/GrandFinale';
import Navigation from './components/Navigation';
import { ConfettiBurst, NotificationToast } from './components/Animations';
import { useSound, useSecrets } from './utils/helpers';
import './styles/globals.css';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [globalConfetti, setGlobalConfetti] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const { soundEnabled, setSoundEnabled, playConfetti, playSuccess } = useSound();
  const { discovered: secretsFound, discoverSecret } = useSecrets();

  // Show Toast helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastVisible(true);
  }, []);

  // Handle Easter Egg secret discovered
  const handleSecretFound = useCallback(
    (id, message) => {
      if (!secretsFound[id]) {
        discoverSecret(id);
        playSuccess();
        showToast(`✨ SECRET UNLOCKED! ${message}`);
        setGlobalConfetti(true);
        setTimeout(() => setGlobalConfetti(false), 3000);
      }
    },
    [secretsFound, discoverSecret, playSuccess, showToast]
  );

  // Global 'B' key listener for Secret 05 (Birthday Confetti)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'b' || e.key === 'B') {
        playConfetti();
        setGlobalConfetti(true);
        setTimeout(() => setGlobalConfetti(false), 3500);
        handleSecretFound(
          'b-key-surprise',
          'You pressed B! B is for Bestie, Beautiful, and Birthday girl! 🎈'
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSecretFound, playConfetti]);

  // Entrance -> Main Universe
  const handleEnterUniverse = () => {
    playSuccess();
    setHasEntered(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continue from Birthday Reveal -> Letter
  const handleContinueToLetter = () => {
    const el = document.getElementById('birthday-letter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Replay entire experience
  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setHasEntered(false);
    }, 400);
  };

  // Back to memories
  const handleBackToMemories = () => {
    const el = document.getElementById('memory-lane');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerGlobalConfetti = () => {
    playConfetti();
    setGlobalConfetti(false);
    setTimeout(() => setGlobalConfetti(true), 50);
  };

  return (
    <div className="birthday-universe-root">
      {/* Global Notifications */}
      <NotificationToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Global Confetti Bursts */}
      <ConfettiBurst active={globalConfetti} count={80} duration={4000} />

      {!hasEntered ? (
        /* CHAPTER 1: The Hippo Entrance */
        <HippoEntrance
          onEnter={handleEnterUniverse}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onSecretFound={handleSecretFound}
        />
      ) : (
        /* CHAPTERS 2 - 10: Complete Birthday Universe */
        <div className="birthday-universe-journey">
          {/* Floating Navigation Bar */}
          <Navigation
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            onTriggerConfetti={triggerGlobalConfetti}
          />

          {/* Chapter 2: Birthday Reveal */}
          <BirthdayReveal
            onContinue={handleContinueToLetter}
            onSecretFound={handleSecretFound}
            soundEnabled={soundEnabled}
          />

          {/* Chapter 3: Birthday Letter */}
          <BirthdayLetter />

          {/* Chapter 4: Memory Lane */}
          <MemoryLane onSecretFound={handleSecretFound} />

          {/* Bonus Feature: Hippo Matching Card Game */}
          <HippoMatchingGame />

          {/* Chapter 5: Mystery Gift Boxes */}
          <MysteryGifts />

          {/* Chapter 6: Friendship Quiz */}
          <FriendshipQuiz />

          {/* Chapter 7: Make A Wish (Birthday Cake & Blowable Candles) */}
          <MakeAWish />

          {/* Chapter 8: Little Happiness (Compliments + Retro Vinyl Player) */}
          <LittleHappiness />

          {/* Chapter 9: Secret Surprises (Easter Egg Collection) */}
          <SecretSurprises
            secretsFound={secretsFound}
            onSecretFound={handleSecretFound}
          />

          {/* Chapter 10: Grand Finale */}
          <GrandFinale
            onReplay={handleReplay}
            onBackToMemories={handleBackToMemories}
            onSecretFound={handleSecretFound}
          />
        </div>
      )}
    </div>
  );
}
