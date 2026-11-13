import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';
import MusicPlayer from '../../components/MusicPlayer';
import config from '../../data/config';
import './LittleHappiness.css';

export default function LittleHappiness() {
  const compliments = config.compliments;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNextCompliment = () => {
    setIsAnimating(true);
    // Avoid showing the exact same compliment consecutively
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * compliments.length);
    } while (nextIdx === currentIdx && compliments.length > 1);

    setTimeout(() => {
      setCurrentIdx(nextIdx);
      setIsAnimating(false);
    }, 250);
  };

  return (
    <section className="section-container little-happiness-section" id="little-happiness">
      <motion.div
        className="happiness-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="happiness-badge">SWEET CORNER ♡</span>
        <h2 className="section-heading">LITTLE HAPPINESS</h2>
        <p className="section-subtitle">A dose of warmth, pure love, and good tunes.</p>
      </motion.div>

      <div className="happiness-duo-container">
        {/* Card A: Compliment Generator */}
        <motion.div
          className="compliment-generator-card glass-card"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="compliment-card-header">
            <Sparkles size={20} className="comp-sparkle" />
            <h3 className="comp-heading">A LITTLE REMINDER OF HOW SPECIAL YOU ARE</h3>
          </div>

          <div className="fortune-message-box">
            <div className="cookie-accent">✨ 🥠 ✨</div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIdx}
                className="compliment-text"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                "{compliments[currentIdx]}"
              </motion.p>
            </AnimatePresence>
          </div>

          <button
            className="magic-button sweet-tell-btn"
            onClick={handleNextCompliment}
            disabled={isAnimating}
          >
            <Heart size={18} className="sweet-heart-icon" />
            TELL ME SOMETHING SWEET ♡
          </button>
        </motion.div>

        {/* Card B: Retro Music Player */}
        <motion.div
          className="music-player-wrapper"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MusicPlayer />
        </motion.div>
      </div>
    </section>
  );
}

