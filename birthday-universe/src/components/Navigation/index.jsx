import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Compass, Menu, X } from 'lucide-react';
import './Navigation.css';

export default function Navigation({ soundEnabled, setSoundEnabled, onTriggerConfetti }) {
  const [activeSection, setActiveSection] = useState('birthday-reveal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sections = [
    { id: 'birthday-reveal', label: 'Surprise' },
    { id: 'birthday-letter', label: 'Letter' },
    { id: 'memory-lane', label: 'Memories' },
    { id: 'hippo-game', label: 'Hippo Game' },
    { id: 'mystery-gifts', label: 'Gifts' },
    { id: 'friendship-quiz', label: 'Quiz' },
    { id: 'make-a-wish', label: 'Wish & Cake' },
    { id: 'little-happiness', label: 'Sweet Corner' },
    { id: 'secret-surprises', label: 'Secrets' },
    { id: 'grand-finale', label: 'Finale' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Check which section is in view
      const scrollPos = window.scrollY + window.innerHeight / 3;
      sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="floating-nav-container">
      {/* Scroll Progress Bar at very top */}
      <div className="nav-top-progress-bar">
        <div className="nav-progress-indicator" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="nav-bar-pill glass-card">
        {/* Desktop Quick Nav Links */}
        <div className="nav-desktop-links">
          {sections.map((sec) => (
            <button
              key={sec.id}
              className={`nav-pill-item ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => scrollToSection(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="nav-controls-right">
          {/* Confetti Trigger */}
          <button
            className="nav-icon-btn confetti-trigger"
            onClick={onTriggerConfetti}
            title="Celebrate with Confetti!"
          >
            <Sparkles size={18} />
          </button>

          {/* Sound Toggle */}
          <button
            className="nav-icon-btn sound-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="nav-icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="nav-mobile-drawer glass-card"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="drawer-header">
              <span>EXPLORE CHAPTERS</span>
            </div>
            <div className="drawer-links-grid">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  className={`drawer-link-btn ${activeSection === sec.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(sec.id)}
                >
                  <span className="drawer-num">{idx + 1}.</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

