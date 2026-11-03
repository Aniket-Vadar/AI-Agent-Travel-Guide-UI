'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, Sparkles, MapPin, Clock, Lightbulb, Calendar, Download } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioSource, setAudioSource] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Setup audio source if available
    if (story.has_audio) {
      setAudioSource(api.getAudioUrl(story.city, story.country));
    } else {
      setAudioSource(null);
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, [story]);

  const togglePlay = () => {
    if (!audioSource) {
      handleGenerateAudio();
      return;
    }
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        onToast('Audio playback could not be started', 'error');
      });
    }
  };

  const handleGenerateAudio = () => {
    setIsAudioLoading(true);
    onToast('Generating AI audio narration with neural voices... 🎙️', 'info');
    const url = api.getAudioUrl(story.city, story.country);
    setAudioSource(url);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsAudioLoading(false);
          onToast('Audio narration started! 🎧', 'success');
        }).catch(() => {
          setIsAudioLoading(false);
        });
      }
    }, 1500);
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

  const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Navigation back */}
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to All Destinations</span>
        </button>

        {/* Hero banner */}
        <div className={styles.heroBanner}>
          <img
            src={story.image_url || fallbackImage}
            alt={story.city}
            className={styles.bannerImg}
          />
          <div className={styles.bannerOverlay}></div>
          <div className={styles.bannerContent}>
            <div className={styles.badgeRow}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.9)', color: '#1A1614', padding: '5px 12px', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600, backdropFilter: 'blur(8px)' }}>
                <MapPin size={12} />
                <span>{story.city}, {story.country || 'Global'}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212, 160, 74, 0.2)', color: '#F0B866', padding: '5px 12px', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600 }}>
                ✦ AI Destination Guide
              </span>
            </div>
            <h1 className={styles.heroTitle}>{story.title || `Discover ${story.city}`}</h1>
          </div>
        </div>

        {/* Studio Audio Player Card */}
        <div className={styles.audioCard}>
          <div className={styles.audioMeta}>
            <div className={`${styles.audioIconBox} ${isPlaying ? styles.pulseIcon : ''}`}>
              <Volume2 size={20} />
            </div>
            <div>
              <h4 className={styles.audioTitle}>Audio Narration Experience</h4>
              <p className={styles.audioSubtitle}>
                {story.has_audio || audioSource 
                  ? 'Immersive voice guide narrating history, culture and secret passages'
                  : 'Synthesize voice guide using AI studio narration'}
              </p>
            </div>
          </div>

          <div className={styles.audioControls}>
            <button
              type="button"
              className={styles.playBtn}
              onClick={togglePlay}
              disabled={isAudioLoading}
            >
              {isAudioLoading ? (
                <div className={styles.miniSpinner}></div>
              ) : isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" style={{ marginLeft: 2 }} />
              )}
            </button>

            {/* Waveform Equalizer simulation */}
            <div className={styles.equalizer}>
              {[18, 28, 14, 34, 20, 10, 24, 30, 16, 26, 32, 12, 22].map((height, i) => (
                <span
                  key={i}
                  className={`${styles.eqBar} ${isPlaying ? styles.eqBarActive : ''}`}
                  style={{
                    animationDelay: `${(i * 0.1).toFixed(1)}s`,
                    height: isPlaying ? undefined : `${height * 0.4}px`,
                  }}
                ></span>
              ))}
            </div>

            {/* Time progress bar */}
            <div className={styles.progressWrap} onClick={handleSeek}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <div className={styles.timeLabels}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Generate button if no audio */}
            {!audioSource && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleGenerateAudio}
                disabled={isAudioLoading}
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <Sparkles size={13} />
                <span>{isAudioLoading ? 'Synthesizing...' : 'Generate Voice'}</span>
              </button>
            )}
          </div>

          <audio
            ref={audioRef}
            src={audioSource || undefined}
            onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
            onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        {/* Narrative Overview with Drop Cap */}
        <div className={styles.storyBody}>
          <div className={styles.overviewSection}>
            <h2 className={styles.sectionHeading}>The Narrative Atmosphere</h2>
            <div className={styles.editorialText}>
              <p className={styles.dropCapPara}>{story.overview}</p>
            </div>
          </div>

          {/* Top Places Section */}
          {story.places && story.places.length > 0 && (
            <div className={styles.placesSection}>
              <h2 className={styles.sectionHeading}>Curated Points of Interest</h2>
              <div className={styles.placesGrid}>
                {story.places.map((place, idx) => (
                  <div key={idx} className={styles.placeCard}>
                    <div className={styles.placeNumber}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>
                    <div className={styles.placeContent}>
                      <h3 className={styles.placeName}>{place.name}</h3>
                      <p className={styles.placeStory}>{place.story}</p>
                      
                      <div className={styles.placeTags}>
                        {place.best_time && (
                          <span className={styles.tagItem}>
                            <Clock size={12} />
                            <span>{place.best_time}</span>
                          </span>
                        )}
                        {place.tip && (
                          <span className={`${styles.tagItem} ${styles.tagTip}`}>
                            <Lightbulb size={12} />
                            <span>{place.tip}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Highlights & Best Time */}
          <div className={styles.metaRow}>
            {story.highlights && story.highlights.length > 0 && (
              <div className={styles.highlightsCard}>
                <h3 className={styles.cardHeading}>
                  <Sparkles size={16} />
                  <span>Cultural Highlights</span>
                </h3>
                <ul className={styles.highlightsList}>
                  {story.highlights.map((h, i) => (
                    <li key={i} className={styles.highlightItem}>
                      <span className={styles.diamond}>✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {story.best_time && (
              <div className={styles.seasonCard}>
                <h3 className={styles.cardHeading}>
                  <Calendar size={16} />
                  <span>Optimal Seasons to Visit</span>
                </h3>
                <p className={styles.seasonText}>{story.best_time}</p>
                <div className={styles.seasonNote}>
                  Weather patterns and crowd densities analyzed for peak cultural exploration.
                </div>
              </div>
            )}
          </div>

          {/* Plan Trip Call to Action */}
          <div className={styles.ctaBox}>
            <div className={styles.ctaText}>
              <h3 className={styles.ctaTitle}>Ready to Experience {story.city}?</h3>
              <p className={styles.ctaSubtitle}>
                Generate a publication-grade, day-by-day travel guide complete with logistics, food recommendations, and packing advice.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onPlanTrip(story.city, story.country)}
            >
              <Download size={16} />
              <span>Design Full Guide for {story.city}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
