'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, Headphones, FileText, ArrowRight } from 'lucide-react';
import styles from './HowItWorks.module.css';

interface HowItWorksProps {
  onExploreClick: () => void;
  onPlanClick: () => void;
  onStoryDemo: (city: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onExploreClick,
  onPlanClick,
  onStoryDemo,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="how-it-works" ref={sectionRef}>
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} reveal`}>
          <span className={styles.eyebrow}>How It Works</span>
          <h2 className={styles.title}>Your Journey in 3 Simple Steps</h2>
          <p className={styles.subtitle}>
            From choosing a destination to holding a complete travel guide — our AI does the heavy lifting while you dream.
          </p>
        </div>

        {/* 3 Cards */}
        <div className={styles.grid}>
          {/* Step 1 */}
          <div className={`${styles.card} reveal`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconWrap} ${styles.iconOrange}`}>
                <MapPin size={28} />
              </div>
              <span className={styles.stepNum}>Step 01</span>
            </div>
            <h3 className={styles.cardTitle}>Choose a Destination</h3>
            <p className={styles.cardDesc}>
              Search for any city or pick from our curated collection. Whether it&apos;s a 
              weekend escape or a grand tour — just tell us where.
            </p>
            <button
              type="button"
              className={`${styles.cardLink} ${styles.linkOrange}`}
              onClick={onExploreClick}
            >
              <span>Browse Destinations</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Step 2 */}
          <div className={`${styles.card} reveal`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconWrap} ${styles.iconBlue}`}>
                <Headphones size={28} />
              </div>
              <span className={styles.stepNum}>Step 02</span>
            </div>
            <h3 className={styles.cardTitle}>Explore Stories & Audio</h3>
            <p className={styles.cardDesc}>
              Immerse yourself in AI-crafted narratives about each destination. Listen to 
              voice-guided tours covering history, culture, and hidden gems.
            </p>
            <button
              type="button"
              className={`${styles.cardLink} ${styles.linkBlue}`}
              onClick={() => onStoryDemo('Kyoto')}
            >
              <span>Listen to Kyoto Preview</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Step 3 */}
          <div className={`${styles.card} reveal`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconWrap} ${styles.iconGreen}`}>
                <FileText size={28} />
              </div>
              <span className={styles.stepNum}>Step 03</span>
            </div>
            <h3 className={styles.cardTitle}>Get Your Travel Guide</h3>
            <p className={styles.cardDesc}>
              Receive a comprehensive day-by-day itinerary as a downloadable PDF — complete 
              with tips, timings, and local recommendations.
            </p>
            <button
              type="button"
              className={`${styles.cardLink} ${styles.linkGreen}`}
              onClick={onPlanClick}
            >
              <span>Create Your Itinerary</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
