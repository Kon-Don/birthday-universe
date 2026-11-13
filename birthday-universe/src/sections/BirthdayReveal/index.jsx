import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { FloatingBalloons, SparkleField, ConfettiBurst } from '../../components/Animations';
import config from '../../data/config';
import './BirthdayReveal.css';

export default function BirthdayReveal({ onContinue, onSecretFound, soundEnabled }) {
  const [confettiActive, setConfettiActive] = useState(false);

  const handleMagicClick = () => {
    setConfettiActive(true);
    setTimeout(() => {
      onContinue();
    }, 1200);
  };

  const handleSecretStarClick = () => {
    setConfettiActive(true);
    if (onSecretFound) {
      onSecretFound('secret-star', "You wished upon the birthday star! ⭐ 'You make every moment shine!'");
    }
  };

  return (
    <div className="birthday-reveal-section" id="birthday-reveal">
      {/* Background Lighting & Animations */}
      <div className="reveal-gradient-glow" />
      <FloatingBalloons count={10} />
      <SparkleField count={35} />
      <ConfettiBurst active={confettiActive} count={80} duration={3500} />

      {/* Secret Star Easter Egg */}
      <motion.div
        className="secret-star-trigger"
        onClick={handleSecretStarClick}
        whileHover={{ scale: 1.3, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        title="A sparkling star..."
      >
        <Star size={24} className="star-icon" />
      </motion.div>

      <div className="reveal-content-container">
        {/* Subtitle intro */}
        <motion.p
          className="reveal-intro-text"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ✨ TODAY WE CELEBRATE YOU ✨
        </motion.p>

        {/* Happy Birthday Signature Text */}
        <div className="reveal-title-group">
          <motion.h1
            className="reveal-happy"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          >
            Happy
          </motion.h1>

          <motion.h1
            className="reveal-birthday"
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: 'easeOut' }}
          >
            Birthday
          </motion.h1>

          <motion.div
            className="reveal-name-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.4 }}
          >
            <span className="reveal-friend-name">{config.friendName}</span>
          </motion.div>
        </div>

        {/* 3D Birthday Cake Illustration */}
        <motion.div
          className="reveal-cake-wrapper"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 1, delay: 1.6 },
            scale: { duration: 1, delay: 1.6 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }
          }}
        >
          <svg className="reveal-cake-svg" viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cakeGradBottom" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C94C6E" />
                <stop offset="50%" stopColor="#E99BB9" />
                <stop offset="100%" stopColor="#C94C6E" />
              </linearGradient>
              <linearGradient id="cakeGradMid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E99BB9" />
                <stop offset="50%" stopColor="#F3BFD3" />
                <stop offset="100%" stopColor="#E99BB9" />
              </linearGradient>
              <linearGradient id="cakeGradTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F3BFD3" />
                <stop offset="50%" stopColor="#FFF8FC" />
                <stop offset="100%" stopColor="#F3BFD3" />
              </linearGradient>
              <radialGradient id="cakePlateShine" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C6E4F5" stopOpacity="0.3" />
              </radialGradient>
            </defs>

            {/* Cake Plate */}
            <ellipse cx="120" cy="205" rx="100" ry="12" fill="url(#cakePlateShine)" />
            <ellipse cx="120" cy="203" rx="90" ry="8" fill="#FFF8FC" />

            {/* Bottom Tier */}
            <rect x="40" y="145" width="160" height="55" rx="8" fill="url(#cakeGradBottom)" />
            <ellipse cx="120" cy="145" rx="80" ry="14" fill="#F8E1EB" />
            {/* Frosting Drips Bottom */}
            <path d="M40 155 Q55 170 70 155 Q85 172 100 155 Q115 170 130 155 Q145 172 160 155 Q175 170 190 155 Q195 165 200 155 L200 145 L40 145 Z" fill="#FFF8FC" />

            {/* Middle Tier */}
            <rect x="65" y="100" width="110" height="46" rx="6" fill="url(#cakeGradMid)" />
            <ellipse cx="120" cy="100" rx="55" ry="10" fill="#FFF8FC" />
            {/* Drips Middle */}
            <path d="M65 108 Q80 120 95 108 Q110 122 125 108 Q140 120 155 108 Q165 116 175 108 L175 100 L65 100 Z" fill="#FFF8FC" />

            {/* Top Tier */}
            <rect x="85" y="65" width="70" height="36" rx="5" fill="url(#cakeGradTop)" />
            <ellipse cx="120" cy="65" rx="35" ry="8" fill="#FFF8FC" />

            {/* Cherries */}
            <circle cx="95" cy="62" r="5" fill="#C94C6E" />
            <circle cx="120" cy="60" r="5.5" fill="#C94C6E" />
            <circle cx="145" cy="62" r="5" fill="#C94C6E" />

            {/* 3 Candles */}
            <rect x="100" y="42" width="4" height="22" rx="1" fill="#FFB6C1" />
            <rect x="118" y="38" width="4" height="24" rx="1" fill="#FFD700" />
            <rect x="136" y="42" width="4" height="22" rx="1" fill="#87CEFA" />

            {/* Animated Candle Flames */}
            <circle cx="102" cy="36" r="3.5" fill="#FFA500" className="flame-flicker" />
            <circle cx="102" cy="35" r="2" fill="#FFFF00" />
            <circle cx="120" cy="31" r="4.5" fill="#FFA500" className="flame-flicker" />
            <circle cx="120" cy="30" r="2.5" fill="#FFFF00" />
            <circle cx="138" cy="36" r="3.5" fill="#FFA500" className="flame-flicker" />
            <circle cx="138" cy="35" r="2" fill="#FFFF00" />
          </svg>
        </motion.div>

        {/* Action Button */}
        <motion.button
          className="magic-button reveal-continue-btn"
          onClick={handleMagicClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1 }}
        >
          <Sparkles size={18} />
          LET THE MAGIC BEGIN ✨
          <Sparkles size={18} />
        </motion.button>
      </div>
    </div>
  );
}

