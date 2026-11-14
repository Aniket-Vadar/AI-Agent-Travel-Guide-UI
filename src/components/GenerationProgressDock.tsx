'use client';

import React from 'react';
import {
  Compass,
  CheckCircle2,
  Loader2,
  Maximize2,
  Download,
  X,
  FileText,
  MapPin,
} from 'lucide-react';
import styles from './GenerationProgressDock.module.css';

interface GenerationProgressDockProps {
  city: string;
  country?: string;
  days: number;
  progress: number;
  currentStep: number;
  isComplete: boolean;
  pdfBlob: Blob | null;
  onExpand: () => void;
  onDismiss: () => void;
  onDownloadAgain: () => void;
}

const STEP_SUBTITLES = [
  'Neural Intake: Resolving geographic context & travel pace...',
  'Curator Agent: Gathering authentic heritage spots & gems...',
  'Route Optimizer: Sequencing day-by-day timing & transit routes...',
  'PDF Atelier: Formatting vector typography & layout...',
  'Custom vector PDF guide ready & downloaded!',
];

export const GenerationProgressDock: React.FC<GenerationProgressDockProps> = ({
  city,
  country,
  days,
  progress,
  currentStep,
  isComplete,
  pdfBlob,
  onExpand,
  onDismiss,
  onDownloadAgain,
}) => {
  const stepText = isComplete
    ? 'Custom PDF dossier ready & downloaded'
    : STEP_SUBTITLES[Math.min(currentStep, STEP_SUBTITLES.length - 1)] ||
      'Synthesizing bespoke itinerary...';

  return (
    <div
      className={styles.dockContainer}
      onClick={onExpand}
      role="region"
      aria-label="Itinerary Generation Status"
      title="Click to open full generation window"
    >
      {/* Top Row */}
      <div className={styles.topRow}>
        <div className={styles.infoCol}>
          <div
            className={`${styles.iconWrap} ${
              isComplete ? styles.iconWrapComplete : ''
            }`}
          >
            {isComplete ? (
              <CheckCircle2 size={16} />
            ) : (
              <Loader2 size={16} className={styles.spinner} />
            )}
          </div>

          <div className={styles.titleArea}>
            <div className={styles.headerTitle}>
              <span>{isComplete ? 'Dossier Ready' : 'Generating Itinerary'}</span>
              <span className={styles.cityBadge}>
                <MapPin size={10} style={{ display: 'inline', marginRight: 2 }} />
                {city}
                {days ? ` • ${days}D` : ''}
              </span>
            </div>
            <div className={styles.subText}>{stepText}</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className={styles.actionGroup}>
          <span
            className={`${styles.percentPill} ${
              isComplete ? styles.percentPillComplete : ''
            }`}
          >
            {isComplete ? '100%' : `${Math.round(progress)}%`}
          </span>

          {isComplete && (
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadAgain();
              }}
              title="Download PDF"
            >
              <Download size={13} />
              <span>PDF</span>
            </button>
          )}

          <button
            type="button"
            className={styles.expandBtn}
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            title="Expand to Full Screen"
          >
            <Maximize2 size={13} />
            <span>Open</span>
          </button>

          <button
            type="button"
            className={styles.dismissBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            aria-label="Dismiss progress dock"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className={styles.progressTrack}>
        <div
          className={`${styles.progressFill} ${
            isComplete ? styles.progressFillComplete : ''
          }`}
          style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
        />
      </div>
    </div>
  );
};

