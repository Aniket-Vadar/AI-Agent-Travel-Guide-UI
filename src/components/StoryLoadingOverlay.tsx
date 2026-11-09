'use client';

import React from 'react';
import { Loader2, Sparkles, Compass } from 'lucide-react';
import styles from './StoryLoadingOverlay.module.css';

interface StoryLoadingOverlayProps {
  city: string;
  stage: string;
  progress: number;
}

export const StoryLoadingOverlay: React.FC<StoryLoadingOverlayProps> = ({
  city,
  stage,
  progress,
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Top Badge & Soundwave Animation */}
        <div className={styles.topRow}>
          <div className={styles.agentBadge}>
            <span className={styles.liveDot} />
            <span>AI Story Engine Active</span>
          </div>

          <div className={styles.waveform}>
            <div className={styles.waveBar} />
            <div className={styles.waveBar} />
            <div className={styles.waveBar} />
            <div className={styles.waveBar} />
            <div className={styles.waveBar} />
            <div className={styles.waveBar} />
          </div>
        </div>

        {/* Headings */}
        <div>
          <h2 className={styles.title}>
            Unlocking <span className={styles.cityHighlight}>{city}</span>
          </h2>
          <p className={styles.subtitle}>
            Autonomous multi-agent system is compiling cultural chronicles, insider gems, and studio voice narration.
          </p>
        </div>

        {/* Progress Box */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <div className={styles.stageText}>
              <Loader2 size={15} className="animate-spin" />
              <span>{stage}</span>
            </div>
            <span className={styles.percentText}>{Math.round(progress)}%</span>
          </div>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(progress, 98)}%` }}
            />
          </div>
        </div>

        <div className={styles.footerNote}>
          Powered by Gemini 2.5 & Neural Voice Studio • Generating in real time
        </div>
      </div>
    </div>
  );
};

