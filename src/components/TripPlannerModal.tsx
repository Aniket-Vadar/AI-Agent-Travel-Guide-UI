'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Download,
  Calendar,
  Compass,
  Play,
  Pause,
  Headphones,
  CheckCircle2,
  Loader2,
  FileText,
  Volume2,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import styles from './TripPlannerModal.module.css';
import { api, Story } from '@/services/api';
import { lookupCityCountrySync, resolveCityCountry } from '@/utils/cityCountryMap';

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: string;
  initialCountry?: string;
  initialDays?: number;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const VIBES = [
  'Cultural & Historical',
  'Food & Local Dining',
  'Nature & Scenic',
  'Relaxed & Wellness',
  'Fast-Paced Explorer',
  'Art & Architecture',
];

const DURATION_PILLS = [2, 3, 4, 5, 7, 10];

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen,
  onClose,
  initialCity = 'Pune',
  initialCountry = 'India',
  initialDays = 5,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'audio'>('itinerary');
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [days, setDays] = useState(initialDays);
  const [vibe, setVibe] = useState('Cultural & Historical');
  const [autoDetected, setAutoDetected] = useState<{ country: string; flag?: string } | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  // Audio Book & Story state
  const [story, setStory] = useState<Story | null>(null);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Sync initial props
  useEffect(() => {
    if (initialCity) {
      setCity(initialCity);
      const match = lookupCityCountrySync(initialCity);
      if (match) {
        setCountry(match.country);
        setAutoDetected(match);
      } else if (initialCountry) {
        setCountry(initialCountry);
      }
    }
    if (initialDays) setDays(initialDays);
  }, [initialCity, initialCountry, initialDays, isOpen]);

  // Auto-detect country when typing city
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const sync = lookupCityCountrySync(newCity);
    if (sync) {
      setCountry(sync.country);
      setAutoDetected(sync);
    } else {
      setAutoDetected(null);
      // Debounced async geocode lookup for less common cities
      const timer = setTimeout(async () => {
        if (newCity.trim().length >= 3) {
          const resolved = await resolveCityCountry(newCity);
          if (resolved) {
            setCountry(resolved.country);
            setAutoDetected(resolved);
          }
        }
      }, 550);
      return () => clearTimeout(timer);
    }
  };

  // Pre-load story when switching to Audio Tab
  useEffect(() => {
    if (activeTab === 'audio' && (!story || story.city.toLowerCase() !== city.toLowerCase())) {
      loadStoryForCurrentCity();
    }
  }, [activeTab, city]);

  const loadStoryForCurrentCity = async () => {
    if (!city.trim()) return;
    setIsLoadingStory(true);
    try {
      const data = await api.getStory(city, country);
      setStory(data.story);
    } catch {
      // Fallback
    } finally {
      setIsLoadingStory(false);
    }
  };

  // Run the multi-agent generation sequence with visual progress animation
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      onToast('Please enter a destination city', 'error');
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setCurrentStep(0);
    setGeneratedPdfBlob(null);

    // Progress animation intervals (continuous animation while still generating)
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          setCurrentStep(1);
          return prev + 5;
        } else if (prev < 65) {
          setCurrentStep(2);
          return prev + 3;
        } else if (prev < 90) {
          setCurrentStep(3);
          return prev + 1.5;
        } else if (prev < 98) {
          setCurrentStep(3);
          return prev + 0.4;
        }
        return prev;
      });
    }, 350);

    try {
      const blob = await api.generatePDF(
        city,
        country,
        days,
        `Vibe: ${vibe}. Duration: ${days} days.`
      );

      clearInterval(pInterval);
      setProgress(100);
      setCurrentStep(4);
      setGeneratedPdfBlob(blob);

      // Automatically download PDF immediately
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${city.replace(/\s+/g, '_')}_${days}Day_Guide.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      onToast(`Generated and downloaded ${city} travel guide! 📄✈️`, 'success');
    } catch (err: any) {
      clearInterval(pInterval);
      setIsGenerating(false);
      onToast(err.message || 'Generation timed out. Please try again.', 'error');
    }
  };

  const handleDownloadAgain = () => {
    if (!generatedPdfBlob) return;
    const url = URL.createObjectURL(generatedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${city.replace(/\s+/g, '_')}_${days}Day_Guide.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onToast('Downloaded travel guide again!', 'success');
  };

  // Audio Playback Controls
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        onToast('Narrator audio is initializing, please try again in a moment', 'info');
      });
    }
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setAudioCurrentTime(val);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.window} onClick={(e) => e.stopPropagation()}>
        {/* Window Top Bar */}
        <div className={styles.windowHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.brandBadge}>WAYFARER AI</span>
            <h2 className={styles.headerTitle}>Travel Architect</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close Planner"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className={styles.tabsBar}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'itinerary' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <FileText size={16} />
            <span>Itinerary & PDF Dossier</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'audio' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <Headphones size={16} />
            <span>Audio Book & Cultural Story</span>
          </button>
        </div>

        {/* Window Body */}
        <div className={styles.modalBody}>
          {activeTab === 'itinerary' ? (
            /* TAB 1: ITINERARY & PDF */
            isGenerating ? (
              /* REAL-TIME ANIMATED GENERATION STATUS BOARD */
              <div className={styles.generationBoard}>
                <div className={styles.radarHeader}>
                  <div className={styles.radarIcon}>
                    <Compass size={24} />
                  </div>
                  <div className={styles.radarTexts}>
                    <h3 className={styles.radarTitle}>
                      {progress === 100
                        ? `Dossier Ready for ${city}!`
                        : `AI Agents Generating Itinerary for ${city}...`}
                    </h3>
                    <p className={styles.radarSubtitle}>
                      {progress === 100
                        ? 'Your custom PDF travel guide has compiled and downloaded.'
                        : 'Autonomous agent chain synthesizing cultural landmarks, logistics & ReportLab vector PDF...'}
                    </p>
                  </div>
                </div>

                {/* Shimmering Progress Bar */}
                <div className={styles.progressContainer}>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className={styles.progressLabel}>
                    <span>Compiling Neural Travel Model</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Multi-stage Agent Flow Tracker */}
                <div className={styles.agentStepsList}>
                  <div className={styles.agentStepItem}>
                    <div
                      className={`${styles.stepIconWrap} ${
                        currentStep >= 1 ? styles.stepDone : styles.stepActive
                      }`}
                    >
                      {currentStep >= 1 ? <CheckCircle2 size={14} /> : <Loader2 size={14} className="animate-spin" />}
                    </div>
                    <span className={styles.stepText}>
                      Neural Intake: Resolving geographic context & travel pace
                    </span>
                    <span className={`${styles.stepBadge} ${currentStep >= 1 ? styles.stepBadgeDone : styles.stepBadgeActive}`}>
                      {currentStep >= 1 ? 'Complete' : 'Processing'}
                    </span>
                  </div>

                  <div className={styles.agentStepItem}>
                    <div
                      className={`${styles.stepIconWrap} ${
                        currentStep >= 2 ? styles.stepDone : currentStep === 1 ? styles.stepActive : styles.stepPending
                      }`}
                    >
                      {currentStep >= 2 ? <CheckCircle2 size={14} /> : currentStep === 1 ? <Loader2 size={14} className="animate-spin" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A1A1AA' }} />}
                    </div>
                    <span className={`${styles.stepText} ${currentStep < 1 ? styles.stepTextInactive : ''}`}>
                      Curator Agent: Gathering authentic heritage spots & hidden gems
                    </span>
                    <span className={`${styles.stepBadge} ${currentStep >= 2 ? styles.stepBadgeDone : currentStep === 1 ? styles.stepBadgeActive : ''}`}>
                      {currentStep >= 2 ? 'Complete' : currentStep === 1 ? 'Curating' : 'Queued'}
                    </span>
                  </div>

                  <div className={styles.agentStepItem}>
                    <div
                      className={`${styles.stepIconWrap} ${
                        currentStep >= 3 ? styles.stepDone : currentStep === 2 ? styles.stepActive : styles.stepPending
                      }`}
                    >
                      {currentStep >= 3 ? <CheckCircle2 size={14} /> : currentStep === 2 ? <Loader2 size={14} className="animate-spin" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A1A1AA' }} />}
                    </div>
                    <span className={`${styles.stepText} ${currentStep < 2 ? styles.stepTextInactive : ''}`}>
                      Route Optimizer: Sequencing day-by-day timing & transit routes
                    </span>
                    <span className={`${styles.stepBadge} ${currentStep >= 3 ? styles.stepBadgeDone : currentStep === 2 ? styles.stepBadgeActive : ''}`}>
                      {currentStep >= 3 ? 'Complete' : currentStep === 2 ? 'Sequencing' : 'Queued'}
                    </span>
                  </div>

                  <div className={styles.agentStepItem}>
                    <div
                      className={`${styles.stepIconWrap} ${
                        progress === 100 ? styles.stepDone : currentStep >= 3 ? styles.stepActive : styles.stepPending
                      }`}
                    >
                      {progress === 100 ? <CheckCircle2 size={14} /> : currentStep >= 3 ? <Loader2 size={14} className="animate-spin" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A1A1AA' }} />}
                    </div>
                    <span className={`${styles.stepText} ${currentStep < 3 ? styles.stepTextInactive : ''}`}>
                      PDF Atelier: Generating typography, layout & downloading document
                    </span>
                    <span className={`${styles.stepBadge} ${progress === 100 ? styles.stepBadgeDone : currentStep >= 3 ? styles.stepBadgeActive : ''}`}>
                      {progress === 100 ? 'Downloaded' : currentStep >= 3 ? 'Compiling' : 'Queued'}
                    </span>
                  </div>
                </div>

                {/* Completion Actions */}
                {progress === 100 && (
                  <div className={styles.successActions}>
                    <button
                      type="button"
                      className={styles.downloadAgainBtn}
                      onClick={handleDownloadAgain}
                    >
                      <Download size={15} />
                      <span>Download PDF Again</span>
                    </button>
                    <button
                      type="button"
                      className={styles.storyAudioSwitchBtn}
                      onClick={() => setActiveTab('audio')}
                    >
                      <Headphones size={15} />
                      <span>Listen to {city} Audio Story</span>
                    </button>
                    <button
                      type="button"
                      className={styles.storyAudioSwitchBtn}
                      onClick={() => setIsGenerating(false)}
                    >
                      <span>Modify Trip Parameters</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* INPUT FORM */
              <form onSubmit={handleGeneratePlan}>
                <div className={styles.formGrid}>
                  {/* City with Auto-detection */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span>Destination City</span>
                      <span style={{ fontSize: '0.72rem', color: '#71717A', fontWeight: 500 }}>
                        Auto-detects country
                      </span>
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Pune, Kyoto, Paris, Rome, Tokyo"
                        value={city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Country (Auto-filled with animation!) */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span>Country</span>
                      {autoDetected && (
                        <span className={styles.autoDetectSubtext}>
                          <Sparkles size={11} /> Auto-detected
                        </span>
                      )}
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={`${styles.input} ${autoDetected ? styles.countryInputAuto : ''}`}
                        placeholder="e.g. India, Japan, France"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          setAutoDetected(null);
                        }}
                        required
                      />
                      {autoDetected && (
                        <div className={styles.autoDetectBadge}>
                          <span>{autoDetected.flag || '✨'}</span>
                          <span>{autoDetected.country}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Duration Pills */}
                <div className={styles.fieldGroup} style={{ marginBottom: 20 }}>
                  <label className={styles.label}>
                    <span>Trip Duration ({days} Days)</span>
                  </label>
                  <div className={styles.daysPills}>
                    {DURATION_PILLS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`${styles.dayPill} ${days === d ? styles.activeDayPill : ''}`}
                        onClick={() => setDays(d)}
                      >
                        {d} Days {d === 5 ? '(Recommended)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vibe / Style Pills */}
                <div className={styles.fieldGroup} style={{ marginBottom: 24 }}>
                  <label className={styles.label}>
                    <span>Travel Atmosphere & Interests</span>
                  </label>
                  <div className={styles.vibesContainer}>
                    {VIBES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        className={`${styles.vibePill} ${vibe === v ? styles.activeVibePill : ''}`}
                        onClick={() => setVibe(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.generateBtn}
                  disabled={!city.trim()}
                >
                  <Sparkles size={18} />
                  <span>Generate Bespoke Itinerary & PDF Dossier</span>
                </button>
              </form>
            )
          ) : (
            /* TAB 2: AUDIO BOOK & CULTURAL STORY */
            <div className={styles.audioTabContainer}>
              <div className={styles.audioHeroCard}>
                <div className={styles.audioHeroTop}>
                  <div>
                    <span className={styles.audioTag}>Voice Narration Engine</span>
                    <h3 className={styles.audioCityTitle}>{city || 'Destination'}</h3>
                    <p className={styles.audioStoryTitle}>
                      {story?.title || `Cultural Heritage & Hidden Tales of ${city || 'Destination'}`}
                    </p>
                  </div>

                  {/* Waveform Equalizer */}
                  <div className={styles.waveformContainer}>
                    <div className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ''}`} />
                    <div className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ''}`} />
                    <div className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ''}`} />
                    <div className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ''}`} />
                    <div className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ''}`} />
                    <div className={`${styles.waveBar} ${isPlayingAudio ? styles.waveBarActive : ''}`} />
                  </div>
                </div>

                {/* Hidden Audio Player Element */}
                <audio
                  ref={audioRef}
                  src={api.getAudioUrl(city, country)}
                  onTimeUpdate={() => {
                    if (audioRef.current) {
                      setAudioCurrentTime(audioRef.current.currentTime);
                      setAudioDuration(audioRef.current.duration || 0);
                    }
                  }}
                  onEnded={() => setIsPlayingAudio(false)}
                  onError={() => setIsPlayingAudio(false)}
                />

                {/* Player Bar */}
                <div className={styles.audioPlayerBar}>
                  <button
                    type="button"
                    className={styles.playPauseBtn}
                    onClick={toggleAudio}
                    aria-label={isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                  >
                    {isPlayingAudio ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max={audioDuration || 100}
                    value={audioCurrentTime}
                    onChange={handleAudioSeek}
                    className={styles.seekSlider}
                  />

                  <div className={styles.timeDisplay}>
                    {formatTime(audioCurrentTime)} / {formatTime(audioDuration || 180)}
                  </div>

                  <a
                    href={api.getAudioUrl(city, country)}
                    download={`${city}_Audio_Guide.mp3`}
                    className={styles.downloadAudioBtn}
                  >
                    <Download size={14} />
                    <span>MP3</span>
                  </a>
                </div>
              </div>

              {/* Story Narrative Card */}
              <div className={styles.narrativeCard}>
                {isLoadingStory ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#71717A' }}>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading cultural narrative & historical chronicle...</span>
                  </div>
                ) : (
                  <>
                    <p className={styles.narrativeOverview}>
                      {story?.overview ||
                        `${city} offers a mesmerizing journey where deep-rooted traditions harmonize with modern energy. Walk through historical stone alleys, savor authentic culinary gems, and experience sacred cultural sanctuaries.`}
                    </p>

                    {story?.highlights && story.highlights.length > 0 && (
                      <div className={styles.highlightsGrid}>
                        {story.highlights.map((h, i) => (
                          <div key={i} className={styles.highlightItem}>
                            <div className={styles.highlightDot} />
                            <span className={styles.highlightText}>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

