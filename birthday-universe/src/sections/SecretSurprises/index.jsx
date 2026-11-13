import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Key, CheckCircle, Trophy, Eye, EyeOff } from 'lucide-react';
import { ConfettiBurst } from '../../components/Animations';
import './SecretSurprises.css';

export default function SecretSurprises({ secretsFound, onSecretFound }) {
  const [showDrawer, setShowDrawer] = useState(false);

  const secretsList = [
    {
      id: 'hippo-magic',
      name: 'Hippo Magic 🦛',
      hint: 'Tap the entrance hippo 5 times in a row!',
      unlockedMsg: "You found the hippo's secret! She thinks you are the coolest bestie ever! 🦛✨",
    },
    {
      id: 'hidden-heart',
      name: 'Hidden Heart 💖',
      hint: 'Find the tiny heart hiding on one of the memory tapes in Memory Lane.',
      unlockedMsg: 'Our friendship is the greatest treasure in the entire universe! 💖',
    },
    {
      id: 'secret-star',
      name: 'Birthday Star ⭐',
      hint: 'Tap the magical glowing star in the top corner of the Birthday Reveal.',
      unlockedMsg: 'You make every room sparkle with your bright energy! ⭐',
    },
    {
      id: 'footer-mystery',
      name: 'Footer Secret 🗝️',
      hint: 'Look for the tiny glowing key at the bottom of the page.',
      unlockedMsg: 'You unlocked the secret room: You deserve an infinite supply of birthday hugs! 🗝️',
    },
    {
      id: 'b-key-surprise',
      name: 'Magic B-Key ⌨️',
      hint: 'Press the "B" key on your keyboard anytime (or tap the B-button here)!',
      unlockedMsg: 'B is for Bestie, Beautiful, and Birthday girl! 🎈',
    },
  ];

  const total = secretsList.length;
  const discoveredCount = Object.keys(secretsFound).length;
  const allDiscovered = discoveredCount === total;

  const handleMobileBClick = () => {
    if (onSecretFound) {
      onSecretFound('b-key-surprise', 'B is for Bestie, Beautiful, and Birthday girl! 🎈');
    }
  };

  return (
    <section className="section-container secret-surprises-section" id="secret-surprises">
      <ConfettiBurst active={allDiscovered} count={80} duration={4000} />

      <motion.div
        className="secrets-header-group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="secrets-badge">SECRET EXPLORER 🕵️‍♀️</span>
        <h2 className="section-heading">SECRET SURPRISES</h2>
        <p className="section-subtitle">
          5 hidden Easter eggs are tucked away across this birthday universe!
        </p>
      </motion.div>

      {/* Tracker Card */}
      <motion.div
        className="secrets-tracker-card glass-card"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="tracker-top-status">
          <div className="tracker-title-row">
            <Compass size={22} className="compass-icon" />
            <h3 className="tracker-title">Easter Egg Collection</h3>
          </div>
          <span className="tracker-counter-badge">
            {discoveredCount} / {total} Discovered
          </span>
        </div>

        {/* Progress Bar */}
        <div className="secrets-prog-track">
          <div
            className="secrets-prog-fill"
            style={{ width: `${(discoveredCount / total) * 100}%` }}
          />
        </div>

        {allDiscovered ? (
          <div className="all-discovered-celebration">
            <Trophy size={40} className="trophy-all" />
            <h4 className="all-title">
              YOU FOUND ALL THE SECRETS! YOU'RE A TRUE EXPLORER! ♡
            </h4>
            <p className="all-text">
              Nothing escapes your sharp bestie senses! You've unlocked the full birthday magic! 🎉
            </p>
          </div>
        ) : (
          <div className="secrets-clues-preview">
            <p className="clues-guidance">
              Keep exploring the site! Tap around, press keys, and see what reveals itself...
            </p>
            {/* Quick button for mobile users to trigger the 'B' key secret */}
            {!secretsFound['b-key-surprise'] && (
              <button className="mobile-b-key-btn" onClick={handleMobileBClick}>
                <span>Tap "B" for Secret #5 (Touch Friendly)</span>
              </button>
            )}
          </div>
        )}

        {/* Toggleable Clue Drawer */}
        <button
          className="toggle-clues-btn"
          onClick={() => setShowDrawer(!showDrawer)}
        >
          {showDrawer ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{showDrawer ? 'Hide Clue Log' : 'View Detective Clues & Discoveries'}</span>
        </button>

        <AnimatePresence>
          {showDrawer && (
            <motion.div
              className="secrets-list-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {secretsList.map((secret, idx) => {
                const isFound = !!secretsFound[secret.id];

                return (
                  <div key={secret.id} className={`secret-item-row ${isFound ? 'found' : ''}`}>
                    <div className="secret-status-indicator">
                      {isFound ? (
                        <CheckCircle size={18} className="found-check" />
                      ) : (
                        <span className="unfound-dot">{idx + 1}</span>
                      )}
                    </div>
                    <div className="secret-row-info">
                      <span className="secret-row-name">{secret.name}</span>
                      <p className="secret-row-desc">
                        {isFound ? secret.unlockedMsg : secret.hint}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

