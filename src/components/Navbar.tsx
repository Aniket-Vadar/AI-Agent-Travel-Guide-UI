'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle, Menu } from 'lucide-react';
import styles from './Navbar.module.css';

interface NavbarProps {
  onOpenChat: () => void;
  onNavigatePlan: () => void;
  onNavigateStories: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, onNavigatePlan, onNavigateStories }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : styles.heroMode}`}>
      <div className={styles.inner}>
        {/* Brand */}
        <a href="#top" className={styles.brand}>
          <span className={styles.brandIcon}>✈️</span>
          <span className={styles.brandName}>Wayfarer</span>
          <span className={styles.brandBadge}>AI</span>
        </a>

        {/* Center nav */}
        <nav className={styles.navLinks}>
          <a
            href="#destinations"
            className={styles.navLink}
            onClick={(e) => { e.preventDefault(); onNavigateStories(); }}
          >
            Destinations
          </a>
          <a
            href="#how-it-works"
            className={styles.navLink}
            onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            How It Works
          </a>
          <a
            href="#plan-trip"
            className={styles.navLink}
            onClick={(e) => { e.preventDefault(); onNavigatePlan(); }}
          >
            Plan a Trip
          </a>
          <button type="button" className={styles.navLink} onClick={onOpenChat}>
            AI Assistant
          </button>
        </nav>

        {/* Right */}
        <div className={styles.rightGroup}>
          <button
            type="button"
            className={styles.chatBtn}
            onClick={onOpenChat}
            aria-label="Open AI chat assistant"
          >
            <MessageCircle size={18} />
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onNavigatePlan}
          >
            Plan Your Trip
          </button>

          <button type="button" className={styles.mobileMenuBtn} aria-label="Menu">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};
