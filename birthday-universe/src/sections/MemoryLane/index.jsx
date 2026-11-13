import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Heart, Sparkles, BookOpen } from 'lucide-react';
import config from '../../data/config';
import './MemoryLane.css';

export default function MemoryLane({ onSecretFound }) {
  // Lightbox state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  // Memory Jar state
  const [selectedNote, setSelectedNote] = useState(null);
  const [openedNotesCount, setOpenedNotesCount] = useState(0);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev + 1) % config.memories.length);
      }
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev - 1 + config.memories.length) % config.memories.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % config.memories.length);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + config.memories.length) % config.memories.length);
  };

  const handleNoteClick = (index) => {
    setSelectedNote(index);
    setOpenedNotesCount((prev) => prev + 1);
  };

  const handleHiddenHeartClick = (e) => {
    e.stopPropagation();
    if (onSecretFound) {
      onSecretFound('hidden-heart', "You found the hidden heart! 💖 'Our friendship is my favourite treasure.'");
    }
  };

  return (
    <section className="section-container memory-lane-section" id="memory-lane">
      {/* Heading */}
      <motion.div
        className="memory-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-heading">Little Moments, Big Memories ♡</h2>
        <p className="section-subtitle">Some memories deserve to stay forever.</p>
      </motion.div>

      {/* Polaroid Photo Gallery */}
      <div className="polaroid-gallery-grid">
        {config.memories.map((photo, idx) => {
          // Slight alternating rotations
          const rotations = [-2.5, 2, -1.8, 3, -2, 1.5];
          const rot = rotations[idx % rotations.length];
          const tapeColors = ['#F3BFD3', '#C6E4F5', '#D9CFF0', '#FFF8FC', '#E99BB9', '#FFE4B5'];
          const tapeColor = tapeColors[idx % tapeColors.length];

          return (
            <motion.div
              key={photo.id}
              className="polaroid-card"
              style={{ '--card-rot': `${rot}deg` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              onClick={() => setSelectedPhotoIndex(idx)}
            >
              {/* Washi Tape */}
              <div className="washi-tape" style={{ backgroundColor: tapeColor }}>
                {/* Secret 02: Hidden Heart placed on the 3rd card tape */}
                {idx === 2 && (
                  <span
                    className="secret-heart-easter-egg"
                    onClick={handleHiddenHeartClick}
                    title="A tiny heart..."
                  >
                    ♥
                  </span>
                )}
              </div>

              <div className="polaroid-image-frame">
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="polaroid-img"
                  loading="lazy"
                />
              </div>

              <div className="polaroid-caption-area">
                <p className="polaroid-caption">{photo.caption}</p>
                {photo.date && <span className="polaroid-date">{photo.date}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Friendship Timeline */}
      <div className="timeline-container">
        <motion.div
          className="timeline-heading-group"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <BookOpen size={24} className="timeline-icon" />
          <h3 className="timeline-title">Our Story So Far...</h3>
        </motion.div>

        <div className="timeline-track">
          {config.timeline.map((entry, idx) => (
            <motion.div
              key={idx}
              className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="timeline-dot">
                <Heart size={14} className="timeline-dot-heart" />
              </div>
              <div className="timeline-card glass-card">
                <span className="timeline-tag">{entry.year}</span>
                <p className="timeline-desc">{entry.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Memory Jar */}
      <div className="memory-jar-section">
        <div className="memory-jar-header">
          <Sparkles size={20} className="jar-sparkle" />
          <h3 className="jar-title">The Jar of Special Memories</h3>
          <p className="jar-subtitle">Pick a folded note from the jar to unlock a sweet memory!</p>
        </div>

        <div className="jar-interactive-display">
          {/* Glass Jar SVG */}
          <div className="glass-jar-wrapper">
            <svg viewBox="0 0 200 250" className="glass-jar-svg">
              <defs>
                <linearGradient id="jarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="40%" stopColor="rgba(198,228,245,0.2)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                </linearGradient>
                <linearGradient id="jarLid" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C94C6E" />
                  <stop offset="100%" stopColor="#E99BB9" />
                </linearGradient>
              </defs>
              {/* Lid */}
              <rect x="60" y="15" width="80" height="18" rx="4" fill="url(#jarLid)" />
              <rect x="55" y="30" width="90" height="10" rx="3" fill="#A9A9B8" opacity="0.6" />
              {/* Neck & Body */}
              <path
                d="M60 40 Q40 50 30 75 L30 220 Q30 240 55 240 L145 240 Q170 240 170 220 L170 75 Q160 50 140 40 Z"
                fill="url(#jarGlass)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="3"
              />
              {/* Reflection */}
              <path d="M45 80 L45 210 Q45 225 60 225" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Ribbon around neck */}
              <path d="M50 45 Q100 55 150 45" stroke="#E99BB9" strokeWidth="5" fill="none" />
            </svg>

            {/* Folded Notes inside & around jar */}
            <div className="jar-notes-overlay">
              {config.memoryJarNotes.map((_, index) => {
                const colors = ['#FFD1DC', '#D9CFF0', '#C6E4F5', '#FFF3B0', '#F3BFD3'];
                return (
                  <motion.button
                    key={index}
                    className={`folded-note-btn note-${index}`}
                    style={{ backgroundColor: colors[index % colors.length] }}
                    whileHover={{ scale: 1.25, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNoteClick(index)}
                    title={`Open Memory Note #${index + 1}`}
                  >
                    <span>📜 #{index + 1}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Active Note Popup / Display */}
          <div className="jar-opened-note-view">
            <AnimatePresence mode="wait">
              {selectedNote !== null ? (
                <motion.div
                  key={selectedNote}
                  className="opened-paper-note"
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="note-pin">📌</div>
                  <h4 className="note-card-title">Memory Note #{selectedNote + 1}</h4>
                  <p className="note-card-content">{config.memoryJarNotes[selectedNote]}</p>
                  <button className="note-close-pill" onClick={() => setSelectedNote(null)}>
                    Fold Back Into Jar
                  </button>
                </motion.div>
              ) : (
                <div className="jar-placeholder-hint">
                  <p>✨ Click any note in or near the jar to reveal what it says!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setSelectedPhotoIndex(null)}
                aria-label="Close"
              >
                <X size={26} />
              </button>

              <button
                className="lightbox-nav-btn prev"
                onClick={handlePrevPhoto}
                aria-label="Previous photo"
              >
                <ChevronLeft size={36} />
              </button>

              <div className="lightbox-image-wrapper">
                <img
                  src={config.memories[selectedPhotoIndex].image}
                  alt={config.memories[selectedPhotoIndex].caption}
                  className="lightbox-img"
                />
                <div className="lightbox-caption-box">
                  <p className="lightbox-caption-text">
                    {config.memories[selectedPhotoIndex].caption}
                  </p>
                  {config.memories[selectedPhotoIndex].date && (
                    <span className="lightbox-date">
                      {config.memories[selectedPhotoIndex].date}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="lightbox-nav-btn next"
                onClick={handleNextPhoto}
                aria-label="Next photo"
              >
                <ChevronRight size={36} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

