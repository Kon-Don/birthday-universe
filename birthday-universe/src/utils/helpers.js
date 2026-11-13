import { useState, useCallback, useRef, useEffect } from 'react';

// Sound effect utility using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const playTone = useCallback((frequency = 800, duration = 0.15, type = 'sine') => {
    if (!soundEnabled || !audioContext) return;
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = type;
      oscillator.frequency.setValueAtTarget(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTarget(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio not available
    }
  }, [soundEnabled]);

  const playClick = useCallback(() => playTone(600, 0.1, 'sine'), [playTone]);
  const playSuccess = useCallback(() => {
    playTone(523, 0.15, 'sine');
    setTimeout(() => playTone(659, 0.15, 'sine'), 100);
    setTimeout(() => playTone(784, 0.2, 'sine'), 200);
  }, [playTone]);
  const playConfetti = useCallback(() => {
    playTone(784, 0.1, 'sine');
    setTimeout(() => playTone(988, 0.1, 'sine'), 80);
    setTimeout(() => playTone(1175, 0.15, 'sine'), 160);
  }, [playTone]);
  const playMatch = useCallback(() => {
    playTone(660, 0.12, 'triangle');
    setTimeout(() => playTone(880, 0.15, 'triangle'), 100);
  }, [playTone]);
  const playFlip = useCallback(() => playTone(440, 0.08, 'sine'), [playTone]);
  const playVictory = useCallback(() => {
    [523, 587, 659, 784, 880, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'sine'), i * 120);
    });
  }, [playTone]);

  return { soundEnabled, setSoundEnabled, playClick, playSuccess, playConfetti, playMatch, playFlip, playVictory, playTone };
}

// Confetti generator
export function createConfettiPieces(count = 50) {
  const colors = ['#E99BB9', '#F3BFD3', '#B8A9D9', '#C6E4F5', '#D9CFF0', '#FFF8FC', '#C94C6E'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }));
}

// Sparkle positions
export function createSparkles(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 2 + 1,
  }));
}

// Secret discovery system
export function useSecrets() {
  const [discovered, setDiscovered] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday-secrets');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const discoverSecret = useCallback((id) => {
    setDiscovered(prev => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      localStorage.setItem('birthday-secrets', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetSecrets = useCallback(() => {
    setDiscovered({});
    localStorage.removeItem('birthday-secrets');
  }, []);

  const count = Object.keys(discovered).length;
  const total = 5;

  return { discovered, discoverSecret, resetSecrets, count, total };
}

