import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, RotateCcw, Heart, Flame } from 'lucide-react';
import { ConfettiBurst, SparkleField } from '../../components/Animations';
import './MakeAWish.css';

export default function MakeAWish() {
  const [wishState, setWishState] = useState('initial'); // 'initial' | 'wished' | 'blown'
  const [confettiActive, setConfettiActive] = useState(false);
  const [cherryMessage, setCherryMessage] = useState('');

  const candlePositions = [
    { x: 92, y: 55, h: 26, color: '#FF7BAC' },
    { x: 106, y: 48, h: 32, color: '#FFD700' },
    { x: 120, y: 45, h: 36, color: '#C6E4F5' },
    { x: 134, y: 48, h: 32, color: '#D9CFF0' },
    { x: 148, y: 55, h: 26, color: '#FF7BAC' },
  ];

  const handleMakeWish = () => {
    setWishState('wished');
  };

  const handleBlowCandles = () => {
    setWishState('blown');
    setConfettiActive(true);
  };

  const handleRelight = () => {
    setWishState('initial');
    setCherryMessage('');
  };

  const handleCherryClick = (index) => {
    const compliments = [
      "🍒 Sweetest friend in the whole galaxy!",
      "🍒 Your kindness warms everyone's heart!",
      "🍒 Born to sparkle and achieve greatness!",
    ];
    setCherryMessage(compliments[index % compliments.length]);
    setTimeout(() => setCherryMessage(''), 3000);
  };

  return (
    <section className="section-container make-a-wish-section" id="make-a-wish">
      <SparkleField count={25} />
      <ConfettiBurst active={confettiActive} count={100} duration={4500} />

      <motion.div
        className="wish-header-group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="wish-badge">MAGIC MOMENT ✨</span>
        <h2 className="section-heading">MAKE A WISH, BIRTHDAY GIRL!</h2>
        <p className="section-subtitle">Close your eyes and wish for something beautiful.</p>
      </motion.div>

      {/* Cherry compliment toast */}
      <div className="cherry-toast-container">
        <AnimatePresence>
          {cherryMessage && (
            <motion.div
              className="cherry-toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {cherryMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3-Tier Interactive Cake */}
      <div className="cake-stage">
        <div className="cake-halo-glow" />

        <svg viewBox="0 0 240 260" className="interactive-cake-svg" fill="none">
          <defs>
            <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C94C6E" />
              <stop offset="50%" stopColor="#E99BB9" />
              <stop offset="100%" stopColor="#C94C6E" />
            </linearGradient>
            <linearGradient id="tier2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E99BB9" />
              <stop offset="50%" stopColor="#F3BFD3" />
              <stop offset="100%" stopColor="#E99BB9" />
            </linearGradient>
            <linearGradient id="tier3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F3BFD3" />
              <stop offset="50%" stopColor="#FFF8FC" />
              <stop offset="100%" stopColor="#F3BFD3" />
            </linearGradient>
            <radialGradient id="cakePlateGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C6E4F5" stopOpacity="0.3" />
            </radialGradient>
          </defs>

          {/* Golden/Glass Stand Plate */}
          <ellipse cx="120" cy="240" rx="110" ry="14" fill="url(#cakePlateGrad)" />
          <ellipse cx="120" cy="237" rx="100" ry="10" fill="#FFF8FC" />
          <rect x="110" y="244" width="20" height="12" rx="2" fill="#D9CFF0" />

          {/* Tier 1 (Bottom Tier) */}
          <rect x="30" y="170" width="180" height="65" rx="10" fill="url(#tier1Grad)" />
          <ellipse cx="120" cy="170" rx="90" ry="16" fill="#F8E1EB" />
          {/* Decorative frosting piping bottom */}
          <path d="M30 180 Q45 198 60 180 Q75 200 90 180 Q105 198 120 180 Q135 200 150 180 Q165 198 180 180 Q195 200 210 180 L210 170 L30 170 Z" fill="#FFF8FC" />
          {/* Hearts on bottom tier */}
          <text x="60" y="215" fill="#FFF8FC" fontSize="12" opacity="0.8">♥</text>
          <text x="120" y="215" fill="#FFF8FC" fontSize="14" opacity="0.9">♥</text>
          <text x="180" y="215" fill="#FFF8FC" fontSize="12" opacity="0.8">♥</text>

          {/* Tier 2 (Middle Tier) */}
          <rect x="55" y="115" width="130" height="55" rx="8" fill="url(#tier2Grad)" />
          <ellipse cx="120" cy="115" rx="65" ry="12" fill="#FFF8FC" />
          {/* Piping middle */}
          <path d="M55 125 Q70 140 85 125 Q100 142 115 125 Q130 140 145 125 Q160 142 175 125 Q180 132 185 125 L185 115 L55 115 Z" fill="#FFF8FC" />
          {/* Sugar Pearls */}
          {[65, 85, 105, 120, 135, 155, 175].map((px, i) => (
            <circle key={i} cx={px} cy="155" r="3" fill="#FFF8FC" />
          ))}

          {/* Tier 3 (Top Tier) */}
          <rect x="80" y="75" width="80" height="40" rx="6" fill="url(#tier3Grad)" />
          <ellipse cx="120" cy="75" rx="40" ry="9" fill="#FFF8FC" />

          {/* Cherries (Clickable!) */}
          <g className="clickable-cherry" onClick={() => handleCherryClick(0)} style={{ cursor: 'pointer' }}>
            <circle cx="88" cy="70" r="6" fill="#C94C6E" />
            <path d="M88 64 Q92 56 96 58" stroke="#388E3C" strokeWidth="1.5" fill="none" />
          </g>
          <g className="clickable-cherry" onClick={() => handleCherryClick(1)} style={{ cursor: 'pointer' }}>
            <circle cx="120" cy="68" r="7" fill="#C94C6E" />
            <path d="M120 61 Q124 53 128 55" stroke="#388E3C" strokeWidth="1.5" fill="none" />
          </g>
          <g className="clickable-cherry" onClick={() => handleCherryClick(2)} style={{ cursor: 'pointer' }}>
            <circle cx="152" cy="70" r="6" fill="#C94C6E" />
            <path d="M152 64 Q156 56 160 58" stroke="#388E3C" strokeWidth="1.5" fill="none" />
          </g>

          {/* 5 Birthday Candles */}
          {candlePositions.map((c, i) => {
            const isLit = wishState !== 'blown';

            return (
              <g key={i}>
                {/* Candle Stick */}
                <rect
                  x={c.x - 2.5}
                  y={c.y}
                  width="5"
                  height={c.h}
                  rx="1.5"
                  fill={c.color}
                  stroke="#FFF"
                  strokeWidth="0.5"
                />
                {/* Candle Wick */}
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={c.x}
                  y2={c.y - 5}
                  stroke="#333"
                  strokeWidth="1"
                />

                {/* Animated Flame when LIT */}
                {isLit && (
                  <g className="candle-flame-group">
                    <ellipse
                      cx={c.x}
                      cy={c.y - 10}
                      rx="4"
                      ry="7"
                      fill="#FF9800"
                      className="flicker-outer"
                    />
                    <ellipse
                      cx={c.x}
                      cy={c.y - 9}
                      rx="2"
                      ry="4.5"
                      fill="#FFF700"
                      className="flicker-inner"
                    />
                    {/* Flame Glow */}
                    <circle
                      cx={c.x}
                      cy={c.y - 10}
                      r="12"
                      fill="rgba(255, 215, 0, 0.2)"
                    />
                  </g>
                )}

                {/* Smoke Animation when BLOWN */}
                {!isLit && (
                  <g className="candle-smoke-group">
                    <circle cx={c.x} cy={c.y - 12} r="3" fill="#A9A9B8" opacity="0.6" className="smoke-puff puff-1" />
                    <circle cx={c.x + 2} cy={c.y - 20} r="4" fill="#A9A9B8" opacity="0.4" className="smoke-puff puff-2" />
                    <circle cx={c.x - 1} cy={c.y - 28} r="5" fill="#A9A9B8" opacity="0.2" className="smoke-puff puff-3" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Controls & Messages */}
      <div className="wish-controls-area">
        {wishState === 'initial' && (
          <motion.div
            className="wish-step step-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="wish-guidance">Think of your biggest, sweetest wish for this year... 🌟</p>
            <button className="magic-button make-wish-btn" onClick={handleMakeWish}>
              <Sparkles size={18} />
              MAKE A WISH ✨
            </button>
          </motion.div>
        )}

        {wishState === 'wished' && (
          <motion.div
            className="wish-step step-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="wish-secret-whisper">
              <Sparkles size={16} />
              <span>Got your wish in mind? Now take a deep breath...</span>
              <Sparkles size={16} />
            </div>
            <button className="magic-button blow-candles-btn" onClick={handleBlowCandles}>
              <Wind size={20} />
              BLOW THE CANDLES! 💨
            </button>
          </motion.div>
        )}

        {wishState === 'blown' && (
          <motion.div
            className="wish-step step-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="wish-success-box glass-card">
              <Heart size={32} className="wish-success-heart" />
              <h3 className="wish-success-title">
                May all your beautiful wishes come true! ♡
              </h3>
              <p className="wish-success-text">
                The universe has received your wish and is working on making it happen! 🎂✨
              </p>
              <button className="relight-btn" onClick={handleRelight}>
                <RotateCcw size={16} /> Relight the Candles & Wish Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

