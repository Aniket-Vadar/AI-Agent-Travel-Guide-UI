'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Calendar,
  Sparkles,
  Loader2,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import styles from './StoryView.module.css';
import { Story, api } from '@/services/api';

interface StoryViewProps {
  story: Story;
  onBack: () => void;
  onPlanTrip: (city: string, country?: string) => void;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  story,
  onBack,
  onPlanTrip,
  onToast,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<'generating' | 'ready' | 'playing' | 'error'>('generating');
  const [progress, setProgress] = useState(15);
  const [stageText, setStageText] = useState('Synthesizing bespoke audio narration script...');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoPlayRequested, setAutoPlayRequested] = useState(false);
  const [audioUrlKey, setAudioUrlKey] = useState(0);

  const audioUrl = `${api.getAudioUrl(story.city, story.country)}&t=${audioUrlKey}`;

  // Reset and start generation animation when story changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAudioState('generating');
    setProgress(15);
    setStageText(`Synthesizing cultural voice narrative for ${story.city}...`);
    setCurrentTime(0);
    setDuration(0);
    setAutoPlayRequested(false);

    // Continuous progress animation while generating
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) {
          setStageText(`Composing cultural narrative & historical chronicle for ${story.city}...`);
          return prev + 4;
        } else if (prev < 70) {
          setStageText('Synthesizing studio voice narration with Google Speech & gTTS...');
          return prev + 2.5;
        } else if (prev < 92) {
          setStageText('Mastering acoustic stream & buffering bespoke audio guide...');
          return prev + 1;
        } else if (prev < 97) {
          return prev + 0.3;
        }
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [story, audioUrlKey]);

  // Audio lifecycle handlers
  const handleCanPlay = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (dur && !isNaN(dur) && isFinite(dur)) {
        setDuration(dur);
      }
    }
    setProgress(100);
    setAudioState((prev) => (prev === 'playing' ? 'playing' : 'ready'));

    if (autoPlayRequested && audioRef.current) {
      audioRef.current.play().then(() => {
        setAudioState('playing');
      }).catch(() => {
        setAudioState('ready');
      });
      setAutoPlayRequested(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleAudioError = () => {
    setAudioState('error');
    onToast('Audio generation is busy. Click retry to generate again.', 'error');
  };

  const handleRetry = () => {
    setAudioState('generating');
    setProgress(15);
    setAudioUrlKey((prev) => prev + 1);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const togglePlay = () => {
    if (audioState === 'generating') {
      setAutoPlayRequested(true);
      onToast(`Audio guide is synthesizing. It will play automatically when ready.`, 'info');
      return;
    }

    if (!audioRef.current) return;

    if (audioState === 'playing') {
      audioRef.current.pause();
      setAudioState('ready');
    } else {
      audioRef.current.play().then(() => {
        setAudioState('playing');
      }).catch(() => {
        onToast('Unable to start audio playback', 'error');
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleDownloadAudio = () => {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${story.city}_Audio_Guide.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    onToast(`Downloading audio guide for ${story.city}`, 'info');
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isPlaying = audioState === 'playing';
  const isGenerating = audioState === 'generating';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Destinations</span>
        </button>

        {/* Hero Banner */}
        <div className={styles.heroBanner}>
          <img
            src={story.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85'}
            alt={story.title}
            className={styles.bannerImg}
          />
          <div className={styles.bannerOverlay} />
          <div className={styles.bannerContent}>
            <span className={styles.locationPill}>
              {story.city}{story.country ? `, ${story.country}` : ''}
            </span>
            <h1 className={styles.title}>{story.title}</h1>
          </div>
        </div>

        {/* Audio Narration & Studio Generator */}
        <div className={styles.audioCard}>
          {/* Hidden HTML5 Audio Element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="auto"
            onCanPlay={handleCanPlay}
            onCanPlayThrough={handleCanPlay}
            onLoadedData={handleCanPlay}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setAudioState('playing')}
            onPause={() => setAudioState('ready')}
            onEnded={() => {
              setAudioState('ready');
              setCurrentTime(0);
            }}
            onError={handleAudioError}
          />

          <div className={styles.audioHeader}>
            <div className={styles.audioMeta}>
              <div className={styles.audioTagRow}>
                {isGenerating ? (
                  <span className={styles.audioTagLive}>
                    <span className={styles.liveDot} />
                    <span>AI Synthesizing Audio</span>
                  </span>
                ) : (
                  <span className={styles.audioTag}>Bespoke Audio Guide</span>
                )}
                <span className={styles.audioTag}>
                  {story.city} Voice Edition
                </span>
              </div>
              <h3 className={styles.audioTitle}>
                {isGenerating ? `Synthesizing Audio for ${story.city}...` : `Audio Narration: ${story.title}`}
              </h3>
              <p className={styles.audioSubtitle}>
                {isGenerating
                  ? 'Autonomous AI narrator is recording your personalized travel guide in studio quality'
                  : `Curated oral chronicle & insider commentary for ${story.city}`}
              </p>
            </div>

            {/* Waveform Equalizer */}
            <div className={styles.waveformContainer}>
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
              <div className={`${styles.waveBar} ${isGenerating || isPlaying ? styles.waveBarActive : ''}`} />
            </div>
          </div>

          {/* ACTIVE GENERATING ANIMATION */}
          {isGenerating && (
            <div className={styles.generatingBox}>
              <div className={styles.generatingHeader}>
                <span className={styles.generatingStatusText}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{stageText}</span>
                </span>
                <span className={styles.generatingPercent}>{Math.round(progress)}%</span>
              </div>

              {/* Shimmering Progress Bar */}
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${Math.min(progress, 98)}%` }}
                />
              </div>

              <div className={styles.generatingSubtext}>
                Powered by Google Studio Voice & gTTS • Live multi-agent synthesis
              </div>
            </div>
          )}

          {/* READY / PLAYING PLAYER CONTROLS */}
          {!isGenerating && audioState !== 'error' && (
            <div className={styles.playerControls}>
              <button
                type="button"
                className={styles.playBtn}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause Narration' : 'Play Narration'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
              </button>

              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className={styles.seekSlider}
              />

              <div className={styles.timeDisplay}>
                {formatTime(currentTime)} / {formatTime(duration || 90)}
              </div>

              <button
                type="button"
                className={styles.downloadAudioBtn}
                onClick={handleDownloadAudio}
              >
                <Download size={14} />
                <span>MP3</span>
              </button>
            </div>
          )}

          {/* ERROR STATE */}
          {audioState === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: '0.85rem', color: '#F87171' }}>
                Voice synthesis temporarily busy. Please retry.
              </span>
              <button type="button" className={styles.retryBtn} onClick={handleRetry}>
                <RotateCcw size={14} />
                <span>Retry Generation</span>
              </button>
            </div>
          )}
        </div>

        {/* Story Overview */}
        <div className={styles.overviewBlock}>
          <p>{story.overview}</p>
        </div>

        {/* Highlights */}
        {story.highlights && story.highlights.length > 0 && (
          <div>
            <h2 className={styles.sectionHeading}>Key Experiences</h2>
            <ul className={styles.highlightsList}>
              {story.highlights.map((h, i) => (
                <li key={i} className={styles.highlightItem}>
                  <span className={styles.highlightDot} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Places */}
        {story.places && story.places.length > 0 && (
          <div>
            <h2 className={styles.sectionHeading}>Must-Visit Places</h2>
            <div className={styles.placesGrid}>
              {story.places.map((place, idx) => (
                <div key={idx} className={styles.placeCard}>
                  <h3 className={styles.placeName}>{place.name}</h3>
                  <p className={styles.placeStory}>{place.story}</p>
                  {place.tip && (
                    <div className={styles.placeTip}>
                      <strong>Insider Tip:</strong> {place.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Trip CTA */}
        <div className={styles.planCtaBox}>
          <button
            type="button"
            className={styles.planCtaBtn}
            onClick={() => onPlanTrip(story.city, story.country)}
          >
            <Calendar size={16} />
            <span>Plan Itinerary for {story.city}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
