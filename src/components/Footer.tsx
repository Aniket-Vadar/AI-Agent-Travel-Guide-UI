'use client';

import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <div className={styles.brandWrap}>
              <span className={styles.brandName}>WAYFARER</span>
              <span className={styles.brandBadge}>AI</span>
            </div>
            <p className={styles.brandTagline}>
              Autonomous multi-agent travel companion. Discover global destinations through
              AI-curated stories, voice narrations, and custom PDF itineraries.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.linksCol}>
            <div className={styles.colTitle}>Navigation</div>
            <a href="#top" className={styles.link}>Home</a>
            <a href="#destinations" className={styles.link}>Explore Destinations</a>
            <a href="#how-it-works" className={styles.link}>How It Works</a>
            <a href="#plan-trip" className={styles.link}>Custom Trip Planner</a>
          </div>

          {/* Travel Experiences */}
          <div className={styles.linksCol}>
            <div className={styles.colTitle}>Experiences</div>
            <a href="#plan-trip" className={styles.link}>
              Bespoke PDF Itineraries
            </a>
            <a href="#destinations" className={styles.link}>
              Voice Narrated Audio Stories
            </a>
            <a href="#destinations" className={styles.link}>
              Cultural Heritage Guides
            </a>
            <a href="#plan-trip" className={styles.link}>
              Day-by-Day Route Planner
            </a>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div>© {new Date().getFullYear()} Wayfarer AI Travel Guide. All rights reserved.</div>
          <div className={styles.engineStatus}>
            <span className={styles.statusDot} />
            <span>Autonomous Neural Travel Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
