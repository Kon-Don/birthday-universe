import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { SparkleField, FloatingHearts, HeartBurst } from '../../components/Animations';
import './HippoEntrance.css';

export default function HippoEntrance({ onEnter, soundEnabled, setSoundEnabled, onSecretFound }) {
  const [clickCount, setClickCount] = useState(0);
  const [burstActive, setBurstActive] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [hippoBounce, setHippoBounce] = useState(false);

  const handleHippoClick = () => {
    setBurstActive(true);
    setHippoBounce(true);
    setTimeout(() => setHippoBounce(false), 600);
    setTimeout(() => setBurstActive(false), 1200);

    // Easter Egg tracking (5 clicks on hippo)
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5 && onSecretFound) {
      onSecretFound('hippo-magic', "You found the hippo's secret! 🦛");
    }
  };

  const handleEnterClick = () => {
    setIsEntering(true);
    setBurstActive(true);
    setTimeout(() => {
      onEnter();
    }, 1100);
  };

  return (
    <div className="hippo-entrance-container">
      {/* Background magical elements */}
      <div className="entrance-gradient-overlay" />
      <SparkleField count={30} />
      <FloatingHearts count={16} color="rgba(243, 191, 211, 0.45)" />

      {/* Top Bar with Sound Toggle */}
      <div className="entrance-top-bar">
        <button
          className="sound-toggle-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span>{soundEnabled ? 'SOUND ON' : 'MUTED'}</span>
        </button>
      </div>

      {/* Main Content Card */}
      <motion.div
        className="entrance-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          className="speech-bubble"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Sparkles size={16} className="sparkle-icon-left" />
          <p className="bubble-text">Heyyy! Someone special is here...</p>
          <Sparkles size={16} className="sparkle-icon-right" />
        </motion.div>

        {/* 3D Hippo Illustration */}
        <div className="hippo-wrapper" onClick={handleHippoClick}>
          <div className="hippo-halo" />
          <motion.div
            className="hippo-image-container"
            animate={
              hippoBounce
                ? { scale: [1, 1.15, 0.9, 1.05, 1], rotate: [0, -6, 6, -3, 0] }
                : { y: [0, -18, 0] }
            }
            transition={
              hippoBounce
                ? { duration: 0.6 }
                : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
            }
            whileHover={{ scale: 1.06, rotate: 2 }}
            whileTap={{ scale: 0.96 }}
          >
            <img
              src="/images/hippo/hippo-transparent.png"
              alt="Cute Pink Hippo"
              className="hippo-img"
              draggable={false}
            />
          </motion.div>

          <HeartBurst active={burstActive} x={50} y={45} />
        </div>

        {/* Subtitle */}
        <motion.p
          className="entrance-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          I made something for you!
        </motion.p>

        {/* Enter Button */}
        <motion.button
          className="magic-button entrance-cta"
          onClick={handleEnterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Heart size={18} className="btn-heart" />
          TAP THE HIPPO TO ENTER ♡
          <Heart size={18} className="btn-heart" />
        </motion.button>
      </motion.div>

      {/* Transition Loading Portal */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            className="portal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="portal-spinner"
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ rotate: { duration: 1.5, repeat: Infinity, ease: 'linear' }, scale: { duration: 1, repeat: Infinity } }}
            >
              ✨
            </motion.div>
            <p className="portal-text">Unfolding your magical universe...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
