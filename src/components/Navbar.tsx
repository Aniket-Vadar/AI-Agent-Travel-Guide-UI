'use client';

import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import styles from './Navbar.module.css';

interface NavbarProps {
  onOpenChat: () => void;
  onNavigatePlan: () => void;
  onNavigateStories: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, onNavigatePlan, onNavigateStories }) => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <a href="#top" className={styles.brand}>
          <span className={styles.brandName}>WAYFARER</span>
          <span className={styles.brandBadge}>AI</span>
        </a>

        {/* Center Navigation */}
        <nav className={styles.navLinks}>
          <a
            href="#destinations"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              onNavigateStories();
            }}
          >
            Destinations
          </a>
          <a
            href="#how-it-works"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How It Works
          </a>
          <a
            href="#plan-trip"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              onNavigatePlan();
            }}
          >
            Trip Planner
          </a>
        </nav>

        {/* Right Action */}
        <div className={styles.rightGroup}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            <span>Concierge Active</span>
          </div>

          <button
            type="button"
            className={styles.chatBtn}
            onClick={onOpenChat}
            aria-label="Open AI Assistant"
          >
            <Sparkles size={14} />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
