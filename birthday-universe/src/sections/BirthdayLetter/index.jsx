import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, RotateCcw, X, Sparkles } from 'lucide-react';
import { SparkleField, ConfettiBurst } from '../../components/Animations';
import config from '../../data/config';
import './BirthdayLetter.css';

export default function BirthdayLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const fullLetter = config.letter;

  // Typewriter effect when opened
  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setTypewriterComplete(false);
      return;
    }

    setConfettiActive(true);
    let index = 0;
    const interval = setInterval(() => {
      index += 3; // 3 chars per tick for smooth reading
      if (index >= fullLetter.length) {
        setDisplayedText(fullLetter);
        setTypewriterComplete(true);
        clearInterval(interval);
      } else {
        setDisplayedText(fullLetter.slice(0, index));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isOpen, fullLetter]);

  const handleOpenLetter = () => {
    setIsOpen(true);
  };

  const handleCloseLetter = () => {
    setIsOpen(false);
  };

  return (
    <section className="section-container birthday-letter-section" id="birthday-letter">
      <SparkleField count={20} />
      <ConfettiBurst active={confettiActive} count={40} duration={3000} />

      <motion.div
        className="letter-heading-group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-heading">You've Got a Special Letter!</h2>
        <p className="section-subtitle">Someone has something to tell you...</p>
      </motion.div>

      <div className="envelope-letter-area">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Closed Envelope View */
            <motion.div
              key="closed-envelope"
              className="envelope-closed-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="envelope-3d" onClick={handleOpenLetter}>
                {/* Back / Body of envelope */}
                <div className="envelope-back" />
                
                {/* Flap */}
                <div className="envelope-flap" />

                {/* Wax Seal with Heart */}
                <motion.div
                  className="wax-seal"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={22} className="seal-heart-icon" />
                </motion.div>

                {/* Sparkles */}
                <Sparkles size={20} className="env-sparkle top-l" />
                <Sparkles size={18} className="env-sparkle bottom-r" />
              </div>

              <motion.button
                className="magic-button open-letter-btn"
                onClick={handleOpenLetter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={18} />
                OPEN YOUR LETTER 💌
              </motion.button>
            </motion.div>
          ) : (
            /* Opened Letter Card View */
            <motion.div
              key="opened-letter"
              className="letter-card-container"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="letter-paper-texture">
                {/* Close Button Top Right */}
                <button
                  className="letter-close-btn"
                  onClick={handleCloseLetter}
                  title="Close Letter"
                  aria-label="Close Letter"
                >
                  <X size={20} />
                </button>

                <div className="letter-stamp-decor">
                  <span>POSTAGE PAID</span>
                  <div className="stamp-heart">♥</div>
                </div>

                <div className="letter-body-content">
                  <pre className="letter-text-rendered">
                    {displayedText}
                    {!typewriterComplete && <span className="typewriter-cursor">|</span>}
                  </pre>
                </div>

                {typewriterComplete && (
                  <motion.div
                    className="letter-footer-decor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Heart size={22} className="signature-animated-heart" />
                    <button className="reopen-btn" onClick={handleCloseLetter}>
                      <RotateCcw size={16} /> Re-fold & Put Back in Envelope
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
