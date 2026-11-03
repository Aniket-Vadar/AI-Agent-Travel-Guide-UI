'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, X, Maximize2, Headphones } from 'lucide-react';
import styles from './StickyAudioPlayer.module.css';

interface StickyAudioPlayerProps {
  city: string;
  country?: string;
  audioUrl: string | null;
  onExpandStory?: () => void;
  onClose?: () => void;
}

export const StickyAudioPlayer: React.FC<StickyAudioPlayerProps> = ({
  city,
  country,
  audioUrl,
  onExpandStory,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [audioUrl]);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  return (
    <div className={styles.playerBar}>
      <div className={styles.inner}>
        {/* Left: Info & Soundwave */}
        <div className={styles.leftInfo}>
          <div className={styles.audioIcon}>
            <Headphones size={18} />
          </div>
          <div className={styles.meta}>
            <span className={styles.barCity}>{city}{country ? `, ${country}` : ''}</span>
            <span className={styles.barLabel}>AI Neural Audio Narration</span>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className={styles.centerControls}>
          <button type="button" className={styles.playBtn} onClick={togglePlay}>
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />}
          </button>

          {/* Mini Waveform */}
          <div className={styles.equalizer}>
            {[14, 24, 10, 28, 16, 22, 12, 26].map((h, i) => (
              <span
                key={i}
                className={`${styles.eqBar} ${isPlaying ? styles.eqBarActive : ''}`}
                style={{ animationDelay: `${(i * 0.12).toFixed(2)}s` }}
              ></span>
            ))}
          </div>

          <div className={styles.scrubber} onClick={handleSeek}>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <div className={styles.timeDisplay}>
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className={styles.rightActions}>
          {onExpandStory && (
            <button type="button" className={styles.actionBtn} onClick={onExpandStory} title="View Story Details">
              <Maximize2 size={16} />
              <span>Full Narrative</span>
            </button>
          )}
          {onClose && (
            <button type="button" className={styles.closeBtn} onClick={onClose} title="Dismiss Player">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};
