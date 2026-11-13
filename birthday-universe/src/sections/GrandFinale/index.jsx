import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, Image, PartyPopper, Key } from 'lucide-react';
import { ConfettiBurst, FloatingHearts, SparkleField } from '../../components/Animations';
import config from '../../data/config';
import './GrandFinale.css';

export default function GrandFinale({ onReplay, onBackToMemories, onSecretFound }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const handleOpenFinalSurprise = () => {
    setIsRevealed(true);
    setConfettiActive(true);
  };

  const handleExtraConfetti = () => {
    setConfettiActive(false);
    setTimeout(() => setConfettiActive(true), 50);
  };

  const handleFooterSecretClick = () => {
    if (onSecretFound) {
      onSecretFound(
        'footer-mystery',
        "You found the secret key in the footer! 🗝️ 'You deserve an infinite supply of birthday hugs!'"
      );
    }
  };

  return (
    <section className="grand-finale-section" id="grand-finale">
      <SparkleField count={40} />
      <FloatingHearts count={20} color="rgba(255, 123, 172, 0.4)" />
      <ConfettiBurst active={confettiActive} count={120} duration={6000} />

      <div className="finale-inner-content">
        {!isRevealed ? (
          /* Initial Screen */
          <motion.div
            className="finale-teaser-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="teaser-sparkle-halo">
              <Sparkles size={36} className="halo-icon" />
            </div>

            <h2 className="teaser-title">WAIT... ONE LAST THING.</h2>
            <p className="teaser-subtitle">
              Before you go, there's one final wish meant just for you...
            </p>

            <motion.button
              className="magic-button final-open-btn"
              onClick={handleOpenFinalSurprise}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={18} />
              OPEN YOUR FINAL SURPRISE
              <Heart size={18} />
            </motion.button>
          </motion.div>
        ) : (
          /* Final Cinematic Reveal */
          <motion.div
            className="finale-cinematic-card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div className="finale-glow-orbit" />

            <motion.p
              className="finale-intro-phrase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              TO MY FAVORITE HUMAN ON EARTH
            </motion.p>

            <motion.h1
              className="finale-happy-birthday"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Happy Birthday,
            </motion.h1>

            <motion.h2
              className="finale-friend-name"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              {config.friendName}!
            </motion.h2>

            <motion.div
              className="finale-message-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1.2 }}
            >
              <p className="finale-message-text">{config.finalMessage}</p>
            </motion.div>

            <motion.div
              className="finale-signature-signoff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              <span className="finale-tagline">HAPPY BIRTHDAY! ♡</span>
              <span className="finale-sender">Forever your bestie, {config.yourName}</span>
            </motion.div>

            {/* 3 Working Action Buttons */}
            <motion.div
              className="finale-actions-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <button className="finale-btn replay" onClick={onReplay}>
                <RotateCcw size={18} />
                REPLAY THE MAGIC
              </button>

              <button className="finale-btn memories" onClick={onBackToMemories}>
                <Image size={18} />
                BACK TO MEMORIES
              </button>

              <button className="finale-btn confetti-btn" onClick={handleExtraConfetti}>
                <PartyPopper size={18} />
                ONE MORE CONFETTI! 🎉
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer with Secret 04 (Hidden Key) */}
      <footer className="birthday-universe-footer">
        <p className="footer-credit">
          Crafted with endless love & magic for {config.friendName}'s Birthday • 2026
        </p>

        {/* Secret 04 Mystery Footer Trigger */}
        <span
          className="footer-mystery-key"
          onClick={handleFooterSecretClick}
          title="A tiny mysterious key..."
        >
          <Key size={14} />
        </span>
      </footer>
    </section>
  );
}

