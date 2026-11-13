import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles, Heart } from 'lucide-react';
import { ConfettiBurst } from '../../components/Animations';
import config from '../../data/config';
import './MysteryGifts.css';

export default function MysteryGifts() {
  const [activePopupIndex, setActivePopupIndex] = useState(null);
  const [openedGifts, setOpenedGifts] = useState({});
  const [shakingIndex, setShakingIndex] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const handleGiftClick = (index) => {
    // Shake animation first
    setShakingIndex(index);
    setTimeout(() => {
      setShakingIndex(null);
      // Mark as opened
      setOpenedGifts((prev) => ({ ...prev, [index]: true }));
      // Open popup
      setActivePopupIndex(index);
      setConfettiActive(true);
    }, 450);
  };

  const handleClosePopup = () => {
    setActivePopupIndex(null);
  };

  const openedCount = Object.keys(openedGifts).length;

  const giftBoxStyles = [
    {
      boxGrad: 'linear-gradient(135deg, #C94C6E 0%, #871F42 100%)',
      ribbonColor: '#FFD700',
      bowColor: '#FFD700',
      accentGlow: 'rgba(201, 76, 110, 0.4)',
    },
    {
      boxGrad: 'linear-gradient(135deg, #E99BB9 0%, #D9206A 100%)',
      ribbonColor: '#FFF8FC',
      bowColor: '#FFF8FC',
      accentGlow: 'rgba(233, 155, 185, 0.4)',
    },
    {
      boxGrad: 'linear-gradient(135deg, #B8A9D9 0%, #7B68EE 100%)',
      ribbonColor: '#FF7BAC',
      bowColor: '#FF7BAC',
      accentGlow: 'rgba(184, 169, 217, 0.4)',
    },
  ];

  return (
    <section className="section-container mystery-gifts-section" id="mystery-gifts">
      <ConfettiBurst active={confettiActive} count={50} duration={3000} />

      <motion.div
        className="gifts-header-group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-heading">Mystery Gift Boxes</h2>
        <p className="section-subtitle">Click each gift box to reveal your hidden surprises!</p>

        {/* Progress tracker */}
        <div className="gifts-tracker-pill">
          <Gift size={16} className="gift-tracker-icon" />
          <span>
            {openedCount}/3 surprises discovered!
            {openedCount === 3 && ' 🎉 All Unlocked!'}
          </span>
        </div>
      </motion.div>

      {/* 3 Gift Boxes in a Row */}
      <div className="gift-boxes-row">
        {config.gifts.map((gift, idx) => {
          const isOpened = !!openedGifts[idx];
          const isShaking = shakingIndex === idx;
          const style = giftBoxStyles[idx % giftBoxStyles.length];

          return (
            <motion.div
              key={idx}
              className="gift-box-wrapper"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="gift-box-labels">
                <span className="gift-label-main">{gift.label}</span>
                <span className="gift-label-sub">{gift.subtitle}</span>
              </div>

              {/* 3D Gift Box Interactive */}
              <motion.div
                className={`gift-box-3d ${isOpened ? 'opened-state' : ''}`}
                style={{
                  background: style.boxGrad,
                  boxShadow: `0 15px 35px ${style.accentGlow}`,
                }}
                animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -6 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGiftClick(idx)}
              >
                {/* Lid */}
                <div
                  className={`gift-lid ${isOpened ? 'lid-open' : ''}`}
                  style={{ background: style.boxGrad }}
                >
                  {/* Decorative Bow */}
                  <div className="gift-bow">
                    <div className="bow-loop left" style={{ borderColor: style.bowColor }} />
                    <div className="bow-loop right" style={{ borderColor: style.bowColor }} />
                    <div className="bow-center" style={{ backgroundColor: style.bowColor }} />
                  </div>
                  {/* Lid Ribbon */}
                  <div
                    className="ribbon-horizontal"
                    style={{ backgroundColor: style.ribbonColor }}
                  />
                </div>

                {/* Vertical Ribbon */}
                <div
                  className="ribbon-vertical"
                  style={{ backgroundColor: style.ribbonColor }}
                />

                {/* Surprise Card emerging preview when opened */}
                {isOpened && (
                  <motion.div
                    className="emerged-card-preview"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: -30, opacity: 1 }}
                  >
                    <span>💌 {gift.title}</span>
                  </motion.div>
                )}

                <div className="gift-tap-hint">
                  {isOpened ? 'Click to Re-read' : 'TAP TO UNWRAP 🎁'}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Surprise Content Popup Modal */}
      <AnimatePresence>
        {activePopupIndex !== null && (
          <motion.div
            className="gift-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePopup}
          >
            <motion.div
              className="gift-modal-card glass-card"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gift-modal-close"
                onClick={handleClosePopup}
                aria-label="Close Surprise"
              >
                <X size={22} />
              </button>

              <div className="gift-modal-badge">
                <Sparkles size={16} />
                <span>{config.gifts[activePopupIndex].label}</span>
                <Sparkles size={16} />
              </div>

              <h3 className="gift-modal-title">
                {config.gifts[activePopupIndex].title}
              </h3>

              <div className="gift-modal-divider" />

              <p className="gift-modal-message">
                {config.gifts[activePopupIndex].message}
              </p>

              <button className="magic-button gift-modal-action-btn" onClick={handleClosePopup}>
                <Heart size={16} />
                Thank you so much! ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

