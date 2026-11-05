'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Download, Calendar } from 'lucide-react';
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
  const audioUrl = api.getAudioUrl(story.city, story.country);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsPlaying(false);
  }, [story]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        onToast('Unable to start audio playback', 'error');
      });
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

        {/* Audio Narration Bar */}
        <div className={styles.audioCard}>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onError={() => setIsPlaying(false)}
          />
          <div className={styles.audioInfo}>
            <button
              type="button"
              className={styles.playBtn}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play audio narration'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
            </button>
            <div>
              <div className={styles.audioTitle}>Audio Narration</div>
              <div className={styles.audioSubtitle}>AI voice guide for {story.city}</div>
            </div>
          </div>

          <button
            type="button"
            className={styles.downloadAudioBtn}
            onClick={handleDownloadAudio}
          >
            <Download size={14} />
            <span>Download MP3</span>
          </button>
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
