'use client';

import React, { useState } from 'react';
import { Play, Pause, Download } from 'lucide-react';
import styles from './NowPlayingBar.module.css';

interface NowPlayingBarProps {
  onPlayDemo: () => void;
  onDownloadGuide: () => void;
}

export const NowPlayingBar: React.FC<NowPlayingBarProps> = ({ onPlayDemo, onDownloadGuide }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    onPlayDemo();
  };

  return (
    <div className={styles.barContainer}>
      <div className={styles.card}>
        {/* Play button */}
        <button
          type="button"
          className={`${styles.playBtn} ${isPlaying ? styles.playingGlow : ''}`}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play Kyoto audio guide'}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" style={{ marginLeft: 2 }} />}
        </button>

        {/* Info */}
        <div className={styles.infoCol}>
          <div className={styles.topMeta}>
            <span className={styles.label}>Now Playing • Audio Guide</span>
            <span className={styles.voiceBadge}>AI Voice</span>
          </div>
          <h3 className={styles.storyTitle}>Kyoto: The Whisper of Arashiyama Bamboo Groves</h3>
          <p className={styles.narratorMeta}>4 min listen • AI-generated narration</p>
        </div>

        {/* Equalizer */}
        <div className={styles.waveformCol}>
          <div className={styles.equalizer}>
            {[10, 22, 14, 28, 16, 26, 12, 24, 18, 12, 20].map((h, i) => (
              <span
                key={i}
                className={`${styles.eqBar} ${isPlaying ? styles.eqBarActive : ''}`}
                style={{
                  height: isPlaying ? undefined : `${h * 0.4}px`,
                  animationDelay: `${(i * 0.1).toFixed(2)}s`,
                }}
              ></span>
            ))}
          </div>
          <span className={styles.timeText}>{isPlaying ? '1:15 / 4:18' : '0:00 / 4:18'}</span>
        </div>

        {/* Download */}
        <button
          type="button"
          className="btn btn-plum btn-sm"
          onClick={onDownloadGuide}
        >
          <Download size={14} />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
