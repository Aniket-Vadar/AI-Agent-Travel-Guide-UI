'use client';

import React from 'react';
import styles from './HowItWorks.module.css';

interface HowItWorksProps {
  onExploreClick?: () => void;
  onPlanClick?: () => void;
  onStoryDemo?: (city: string) => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Choose Destination',
    desc: 'Search any city or select from curated destinations. The Intake Agent analyzes your destination, travel duration, and style.',
  },
  {
    num: '02',
    title: 'Autonomous Research',
    desc: 'Researcher, Curator, and Storyteller agents fetch real historical landmarks from Wikipedia, calculate routes, and compose narratives.',
  },
  {
    num: '03',
    title: 'Get Audio & PDF Itinerary',
    desc: 'Listen to instant MP3 audio narrations generated via TTS and download complete, professionally formatted PDF travel dossiers.',
  },
];

export const HowItWorks: React.FC<HowItWorksProps> = () => {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>How It Works</span>
          <h2 className={styles.title}>Simple 3-Step Travel Planning</h2>
          <p className={styles.subtitle}>
            A network of specialized AI agents collaborates behind the scenes to build your journey.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((s) => (
            <div key={s.num} className={styles.stepCard}>
              <div className={styles.stepNumber}>{s.num}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
