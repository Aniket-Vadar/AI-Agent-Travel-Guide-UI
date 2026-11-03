'use client';

import React, { useEffect, useState } from 'react';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete?: () => void;
}

const QUOTES = [
  "Discovering hidden gems around the world...",
  "Mapping your next adventure...",
  "Curating personalized travel experiences...",
  "Preparing your journey planner...",
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 800);

    const startTime = Date.now();
    const duration = 2200;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        clearInterval(quoteTimer);
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 600);
        }, 200);
      }
    }, 30);

    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}>
      <div className={styles.inner}>
        {/* Animated Globe */}
        <div className={styles.globe}>
          <div className={styles.globeRing}></div>
          <div className={styles.globeRing2}></div>
          <div className={styles.globeRing3}></div>
          <span className={styles.globeIcon}>🌍</span>
        </div>

        {/* Brand */}
        <div className={styles.brandRow}>
          <h1 className={styles.brandName}>Wayfarer</h1>
          <span className={styles.brandTagline}>AI Travel Planner</span>
        </div>

        {/* Quote */}
        <p className={styles.quoteText}>{QUOTES[quoteIndex]}</p>

        {/* Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <div className={styles.progressMeta}>
            <span>Loading experience</span>
            <span>{progress}%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              setIsVisible(false);
              onComplete?.();
            }, 400);
          }}
          className={styles.skipBtn}
        >
          Skip →
        </button>
      </div>
    </div>
  );
};
