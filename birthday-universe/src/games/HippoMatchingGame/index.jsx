import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, Clock, Move, CheckCircle2, Heart } from 'lucide-react';
import { ConfettiBurst } from '../../components/Animations';
import './HippoMatchingGame.css';

const HIPPO_CARDS_DATA = [
  {
    type: 'hippo-party-hat',
    name: 'Party Hat Hippo',
    image: '/images/hippo/hippo-card-a.png',
  },
  {
    type: 'hippo-heart',
    name: 'Sweet Heart Hippo',
    image: '/images/hippo/hippo-card-b.png',
  },
  {
    type: 'hippo-balloon',
    name: 'Birthday Balloon Hippo',
    image: '/images/hippo/hippo-card-c.png',
  },
];

export default function HippoMatchingGame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedTypes, setMatchedTypes] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [matchMessage, setMatchMessage] = useState('');
  const [victory, setVictory] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    try {
      const saved = localStorage.getItem('hippo-game-best-score');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const timerRef = useRef(null);

  // Initialize and shuffle 6 cards (3 pairs)
  const initializeGame = () => {
    // 3 unique pairs = 6 cards
    const deck = [];
    HIPPO_CARDS_DATA.forEach((hippo, typeIndex) => {
      deck.push({ id: `card-${typeIndex}-1`, type: hippo.type, image: hippo.image, name: hippo.name });
      deck.push({ id: `card-${typeIndex}-2`, type: hippo.type, image: hippo.image, name: hippo.name });
    });

    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMatchedTypes([]);
    setMoves(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setIsLocked(false);
    setMatchMessage('');
    setVictory(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer runner
  useEffect(() => {
    if (isTimerRunning && !victory) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, victory]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleCardClick = (index) => {
    // Rule: cannot click if locked, already flipped, or matched
    if (isLocked) return;
    if (flippedIndices.includes(index)) return;
    const card = cards[index];
    if (matchedTypes.includes(card.type)) return;

    // Start timer on first card selection
    if (!isTimerRunning && moves === 0 && flippedIndices.length === 0) {
      setIsTimerRunning(true);
    }

    // First card selected
    if (flippedIndices.length === 0) {
      setFlippedIndices([index]);
      return;
    }

    // Second card selected
    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      const firstCard = cards[firstIndex];
      const secondCard = card;

      setFlippedIndices([firstIndex, index]);
      setMoves((prev) => prev + 1);

      // Check match
      if (firstCard.type === secondCard.type) {
        // MATCH!
        setMatchedTypes((prev) => [...prev, firstCard.type]);
        setFlippedIndices([]);
        setMatchMessage('YAYYY! You found a matching hippo! ♡');
        setTimeout(() => setMatchMessage(''), 2200);

        // Check if all 3 matches found
        if (matchedTypes.length + 1 === 3) {
          setIsTimerRunning(false);
          setVictory(true);

          // Update best score
          const currentScore = { moves: moves + 1, time: timerSeconds };
          if (
            !bestScore ||
            currentScore.moves < bestScore.moves ||
            (currentScore.moves === bestScore.moves && currentScore.time < bestScore.time)
          ) {
            setBestScore(currentScore);
            try {
              localStorage.setItem('hippo-game-best-score', JSON.stringify(currentScore));
            } catch {}
          }
        }
      } else {
        // MISMATCH: wait ~900ms then flip back
        setIsLocked(true);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const matchesFound = matchedTypes.length;
  const remainingPairs = 3 - matchesFound;

  return (
    <section className="section-container hippo-game-section" id="hippo-game">
      <ConfettiBurst active={victory} count={90} duration={5000} />

      <motion.div
        className="game-header-group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="game-badge">MINI-GAME CHALLENGE 🦛</span>
        <h2 className="section-heading">FIND THE THREE HIPPO MATCHES!</h2>
        <p className="section-subtitle">Flip the cards and find all three matching pairs!</p>
      </motion.div>

      {/* Stats Bar */}
      <div className="game-stats-bar glass-card">
        <div className="stat-item">
          <Move size={18} className="stat-icon" />
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>

        <div className="stat-item">
          <CheckCircle2 size={18} className="stat-icon match" />
          <span className="stat-label">Matches Found:</span>
          <span className="stat-value">{matchesFound} / 3</span>
        </div>

        <div className="stat-item">
          <Heart size={18} className="stat-icon remaining" />
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{remainingPairs}</span>
        </div>

        <div className="stat-item">
          <Clock size={18} className="stat-icon time" />
          <span className="stat-label">Timer:</span>
          <span className="stat-value">{formatTime(timerSeconds)}</span>
        </div>

        <button className="game-reset-icon-btn" onClick={initializeGame} title="Restart Game">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Feedback banner */}
      <div className="game-feedback-banner">
        <AnimatePresence>
          {matchMessage && (
            <motion.div
              className="match-toast"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Sparkles size={16} />
              <span>{matchMessage}</span>
              <Sparkles size={16} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6-Card Grid: 3 cols x 2 rows (desktop), 2 cols x 3 rows (mobile) */}
      <div className="hippo-card-grid">
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedTypes.includes(card.type);
          const isMatched = matchedTypes.includes(card.type);

          return (
            <div
              key={card.id}
              className={`hippo-card-perspective ${isMatched ? 'card-matched' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              <motion.div
                className={`hippo-card-inner ${isFlipped ? 'is-flipped' : ''}`}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                whileHover={!isFlipped ? { scale: 1.04, y: -4 } : {}}
              >
                {/* Card Front (Face-down state) */}
                <div className="hippo-card-face card-front">
                  <div className="card-pattern">
                    <span className="card-question-mark">?</span>
                    <Heart size={16} className="card-front-heart" />
                  </div>
                </div>

                {/* Card Back (Face-up state with Hippo Illustration) */}
                <div className="hippo-card-face card-back">
                  <img src={card.image} alt={card.name} className="card-hippo-img" />
                  <span className="card-hippo-label">{card.name}</span>
                  {isMatched && (
                    <motion.div
                      className="card-matched-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓ MATCHED
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Best Score Tracker */}
      {bestScore && (
        <div className="best-score-tag">
          <Trophy size={14} />
          <span>
            Best Score: {bestScore.moves} moves ({formatTime(bestScore.time)})
          </span>
        </div>
      )}

      {/* Victory Modal Overlay */}
      <AnimatePresence>
        {victory && (
          <motion.div
            className="victory-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="victory-card glass-card"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8 }}
            >
              <div className="victory-crown">👑</div>
              <h3 className="victory-title">YOU FOUND ALL THREE HIPPOS!</h3>
              <p className="victory-subtitle">You're officially a Hippo Detective! 🦛✨</p>

              {/* Display all three hippos */}
              <div className="victory-hippo-gallery">
                {HIPPO_CARDS_DATA.map((h, i) => (
                  <div key={i} className="victory-hippo-item">
                    <img src={h.image} alt={h.name} className="victory-hippo-thumb" />
                    <span>{h.name}</span>
                  </div>
                ))}
              </div>

              <div className="victory-stats-summary">
                <div className="vic-stat">
                  <span className="vic-label">Total Moves:</span>
                  <span className="vic-val">{moves}</span>
                </div>
                <div className="vic-stat">
                  <span className="vic-label">Completion Time:</span>
                  <span className="vic-val">{formatTime(timerSeconds)}</span>
                </div>
              </div>

              <button className="magic-button victory-play-again-btn" onClick={initializeGame}>
                <RotateCcw size={18} />
                PLAY AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

