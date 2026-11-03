'use client';

import React, { useState } from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <div className={styles.brandWrap}>
              <span className={styles.brandIcon}>✈️</span>
              <span className={styles.brandName}>Wayfarer</span>
              <span className={styles.brandBadge}>AI</span>
            </div>
            <p className={styles.brandDesc}>
              Your AI-powered travel companion. Discover destinations through immersive 
              stories, audio guides, and personalized itineraries.
            </p>
            <div className={styles.engineStatus}>
              <span className={styles.statusDot}></span>
              <span>AI Travel Engine Active</span>
            </div>
          </div>

          {/* Destinations */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Destinations</h4>
            <a href="#destinations" className={styles.link}>Kyoto, Japan</a>
            <a href="#destinations" className={styles.link}>Paris, France</a>
            <a href="#destinations" className={styles.link}>Jaipur, India</a>
            <a href="#destinations" className={styles.link}>Amalfi Coast, Italy</a>
          </div>

          {/* Features */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Features</h4>
            <a href="#how-it-works" className={styles.link}>Audio Stories</a>
            <a href="#plan-trip" className={styles.link}>Trip Planner</a>
            <a href="#how-it-works" className={styles.link}>PDF Itineraries</a>
            <a href="#" className={styles.link}>AI Assistant</a>
          </div>

          {/* Newsletter */}
          <div className={styles.gazetteCol}>
            <h4 className={styles.colTitle}>Stay Inspired</h4>
            <p className={styles.gazetteDesc}>
              Get weekly travel inspiration and destination guides delivered to your inbox.
            </p>
            {subscribed ? (
              <span className={styles.subscribedMsg}>✓ You&apos;re subscribed!</span>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Wayfarer AI. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>Privacy</a>
            <a href="#" className={styles.legalLink}>Terms</a>
            <a href="#" className={styles.legalLink}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
