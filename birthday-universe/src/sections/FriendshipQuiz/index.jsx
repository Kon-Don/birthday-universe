import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Award, RotateCcw, Sparkles, Smile, Check } from 'lucide-react';
import { ConfettiBurst } from '../../components/Animations';
import config from '../../data/config';
import './FriendshipQuiz.css';

export default function FriendshipQuiz() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [reaction, setReaction] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const questions = config.quizQuestions;
  const currentQ = questions[currentQuestionIdx];

  const reactionsList = [
    "Hahaha I KNEW you'd choose that! 😂",
    "Honestly, no lies detected here! 💯",
    "Wait, are you sure? Or are we in denial?! 😆",
    "Classic us, absolutely iconic! ✨",
    "I'm taking notes for our next friendship meeting! 📋",
  ];

  const handleSelectOption = (index) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(index);

    // Score point if matches correct index
    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const funReaction = reactionsList[currentQuestionIdx % reactionsList.length];
    setReaction(funReaction);

    // Wait 1.4s then advance or complete
    setTimeout(() => {
      if (currentQuestionIdx + 1 < questions.length) {
        setCurrentQuestionIdx((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setReaction('');
      } else {
        setIsComplete(true);
        setConfettiActive(true);
      }
    }, 1400);
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setReaction('');
    setIsAnswered(false);
    setIsComplete(false);
  };

  const getResultFeedback = () => {
    if (score === 5) {
      return {
        title: "Okayyy! You know me a little TOO well! 💖",
        badge: "FRIENDSHIP LEVEL: TELEPATHIC",
        desc: "You know every single quirk, laugh, and dramatic moment. We are literally two halves of the same chaotic brain!",
      };
    } else if (score >= 3) {
      return {
        title: "Not bad! We still have some memories to make! 🥰",
        badge: "FRIENDSHIP LEVEL: BESTIE CERTIFIED",
        desc: "You scored pretty awesome! Just means we need at least 10 more adventures together to get to 100%!",
      };
    } else {
      return {
        title: "Excuse me?! We need another friendship meeting! 🕵️‍♀️",
        badge: "FRIENDSHIP LEVEL: SUSPICIOUS",
        desc: "Did you just guess random buttons or do we urgently need a 4-hour coffee debrief?! Either way, I still love you!",
      };
    }
  };

  const progressPct = ((currentQuestionIdx + (isComplete ? 1 : 0)) / questions.length) * 100;

  return (
    <section className="section-container friendship-quiz-section" id="friendship-quiz">
      <ConfettiBurst active={confettiActive} count={70} duration={4000} />

      <motion.div
        className="quiz-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="quiz-badge">BEST FRIEND TEST</span>
        <h2 className="section-heading">HOW WELL DO YOU KNOW OUR FRIENDSHIP?</h2>
        <p className="section-subtitle">Let's see if you really know us!</p>
      </motion.div>

      <div className="quiz-card-container">
        {!isComplete ? (
          /* Active Question View */
          <motion.div
            key={currentQuestionIdx}
            className="quiz-box glass-card"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.4 }}
          >
            {/* Progress Bar */}
            <div className="quiz-progress-track">
              <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="quiz-step-info">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>

            <h3 className="quiz-question-text">{currentQ.question}</h3>

            {/* Answer Options */}
            <div className="quiz-options-list">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                return (
                  <motion.button
                    key={oIdx}
                    className={`quiz-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isAnswered}
                    whileHover={!isAnswered ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  >
                    <span className="option-marker">
                      {isSelected ? <Check size={16} /> : String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="option-label-text">{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Funny reaction text */}
            <div className="quiz-reaction-area">
              <AnimatePresence>
                {reaction && (
                  <motion.div
                    className="quiz-reaction-bubble"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Smile size={18} className="reaction-icon" />
                    <span>{reaction}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* Final Results Card */
          <motion.div
            className="quiz-results-box glass-card"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="results-trophy">
              <Award size={52} className="trophy-icon" />
            </div>

            <span className="results-badge">{getResultFeedback().badge}</span>
            <h3 className="results-score-display">{score} / {questions.length} Correct!</h3>
            <h4 className="results-headline">{getResultFeedback().title}</h4>
            <p className="results-description">{getResultFeedback().desc}</p>

            <button className="magic-button play-again-btn" onClick={handlePlayAgain}>
              <RotateCcw size={18} />
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

