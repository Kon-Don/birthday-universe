import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// === CONFETTI BURST ===
export function ConfettiBurst({ active, count = 60, duration = 4000 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) { setPieces([]); return; }
    const colors = ['#E99BB9', '#F3BFD3', '#B8A9D9', '#C6E4F5', '#D9CFF0', '#C94C6E', '#FFD700'];
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 4,
      delay: Math.random() * 0.8,
      dur: Math.random() * 2 + 2,
      wobble: (Math.random() - 0.5) * 200,
      shape: ['circle', 'rect', 'triangle'][Math.floor(Math.random() * 3)],
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), duration);
    return () => clearTimeout(timer);
  }, [active, count, duration]);

  if (pieces.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', x: `${p.x + (Math.random() - 0.5) * 20}vw`, opacity: 0, rotate: 720 * (Math.random() > 0.5 ? 1 : -1) }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.shape === 'rect' ? p.size * 0.6 : p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0' : '2px',
            clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// === FLOATING HEARTS ===
export function FloatingHearts({ count = 15, color = '#E99BB9' }) {
  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 16 + 8,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {hearts.map(h => (
        <motion.div
          key={h.id}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.sin(h.id) * 30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            bottom: `${Math.random() * 60}%`,
            fontSize: h.size,
            opacity: h.opacity,
            color: color,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

// === SPARKLE FIELD ===
export function SparkleField({ count = 25 }) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 6px 2px rgba(255,255,255,0.6)',
          }}
        />
      ))}
    </div>
  );
}

// === FLOATING BALLOONS ===
export function FloatingBalloons({ count = 8 }) {
  const colors = ['#E99BB9', '#F3BFD3', '#B8A9D9', '#C6E4F5', '#C94C6E'];
  const balloons = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + (i / count) * 90,
    color: colors[i % colors.length],
    delay: Math.random() * 4,
    duration: Math.random() * 4 + 8,
    size: Math.random() * 20 + 30,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {balloons.map(b => (
        <motion.div
          key={b.id}
          initial={{ y: '120vh' }}
          animate={{ y: '-20vh' }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', left: `${b.x}%` }}
        >
          <svg width={b.size} height={b.size * 1.3} viewBox="0 0 40 55" fill="none">
            <ellipse cx="20" cy="18" rx="17" ry="18" fill={b.color} opacity="0.7" />
            <ellipse cx="20" cy="18" rx="17" ry="18" fill="url(#balloonShine)" opacity="0.3" />
            <path d="M20 36 L18 38 L22 38 Z" fill={b.color} opacity="0.7" />
            <line x1="20" y1="38" x2="20" y2="55" stroke={b.color} strokeWidth="0.8" opacity="0.5" />
            <defs>
              <radialGradient id="balloonShine" cx="35%" cy="30%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// === HEART BURST (from a point) ===
export function HeartBurst({ active, x = 50, y = 50 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (!active) return;
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: (360 / 12) * i,
      distance: Math.random() * 100 + 50,
      size: Math.random() * 14 + 8,
    }));
    setHearts(newHearts);
    const timer = setTimeout(() => setHearts([]), 1500);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <AnimatePresence>
      {hearts.map(h => {
        const rad = (h.angle * Math.PI) / 180;
        const endX = Math.cos(rad) * h.distance;
        const endY = Math.sin(rad) * h.distance;
        return (
          <motion.div
            key={h.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: endX, y: endY, opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              fontSize: h.size,
              color: '#E99BB9',
              pointerEvents: 'none',
              zIndex: 100,
            }}
          >
            ♥
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

// === NOTIFICATION TOAST ===
export function NotificationToast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 248, 252, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '14px 28px',
            borderRadius: 50,
            boxShadow: '0 8px 32px rgba(81, 66, 103, 0.2)',
            zIndex: 10000,
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9rem',
            color: '#514267',
            border: '1px solid rgba(233, 155, 185, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

