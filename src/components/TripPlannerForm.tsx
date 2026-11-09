'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, Sparkles, Loader2, CheckCircle2, Maximize2, Compass } from 'lucide-react';
import styles from './TripPlannerForm.module.css';
import { api } from '@/services/api';
import { lookupCityCountrySync, resolveCityCountry } from '@/utils/cityCountryMap';
import { useAuth } from '@/context/AuthContext';

interface TripPlannerFormProps {
  initialCity?: string;
  initialCountry?: string;
  initialDays?: number;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
  onOpenModal?: (city?: string, country?: string, days?: number) => void;
}

const VIBES = [
  'Cultural & Historical',
  'Food & Local Dining',
  'Nature & Scenic Landscapes',
  'Relaxed & Wellness',
  'Fast-Paced Explorer',
];

const GENERATION_PHRASES = [
  'Analyzing cultural heritage & geographical coordinates...',
  'Sourcing authentic landmarks & local food spots...',
  'Sequencing optimal day-by-day transit and routes...',
  'Formatting vector typography & printable PDF dossier...',
  'Polishing insider tips and packing recommendations...',
  'Finalizing high-resolution itinerary document...',
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  initialCity = 'Pune',
  initialCountry = 'India',
  initialDays = 5,
  onToast,
  onOpenModal,
}) => {
  const { user, openAuthModal } = useAuth();
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [days, setDays] = useState(initialDays);
  const [selectedVibe, setSelectedVibe] = useState('Cultural & Historical');
  const [autoDetected, setAutoDetected] = useState<{ country: string; flag?: string } | null>(null);

  // Animated generation progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState(GENERATION_PHRASES[0]);
  const phraseIndexRef = useRef(0);

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
  }, [initialCity, initialCountry, initialDays]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const sync = lookupCityCountrySync(newCity);
    if (sync) {
      setCountry(sync.country);
      setAutoDetected(sync);
    } else {
      setAutoDetected(null);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      onToast('Please enter a destination city', 'error');
      return;
    }

    if (!user) {
      openAuthModal('signup');
      onToast('Account required: Please create a free account or sign in to compile your travel dossier.', 'info');
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    phraseIndexRef.current = 0;
    setStepLabel(GENERATION_PHRASES[0]);

    // Continuously cycle phrases every 2.2 seconds so user sees continuous activity
    const phraseInterval = setInterval(() => {
      phraseIndexRef.current = (phraseIndexRef.current + 1) % GENERATION_PHRASES.length;
      setStepLabel(GENERATION_PHRASES[phraseIndexRef.current]);
    }, 2200);

    // Continuous progress bar that NEVER freezes, advancing up to 98% smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 4;
        if (prev < 75) return prev + 3;
        if (prev < 90) return prev + 1.5;
        if (prev < 98) return prev + 0.5; // keeps moving smoothly while still generating!
        return prev;
      });
    }, 350);

    try {
      const blob = await api.generatePDF(
        city,
        country,
        days,
        `Vibe: ${selectedVibe}. Balanced schedule.`
      );

      clearInterval(phraseInterval);
      clearInterval(progressInterval);
      setProgress(100);
      setStepLabel(`✓ Complete! Downloading ${city} PDF Dossier...`);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${city.replace(/\s+/g, '_')}_${days}Day_Guide.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onToast(`Downloaded ${city} travel guide! ✈️`, 'success');

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 4000);
    } catch (err: any) {
      clearInterval(phraseInterval);
      clearInterval(progressInterval);
      setIsGenerating(false);
      onToast(err.message || 'Failed to generate travel guide', 'error');
    }
  };

  return (
    <section className={styles.section} id="plan-trip">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Autonomous Travel Planner</span>
          <h2 className={styles.title}>Build Your Complete Itinerary</h2>
          <p className={styles.subtitle}>
            Enter your destination details and download an AI-generated PDF itinerary formatted with schedules, maps, and insider tips.
          </p>
        </div>

        <div className={styles.formCard}>
          <form onSubmit={handleGenerate}>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span>Destination City</span>
                  <span style={{ fontSize: '0.72rem', color: '#71717A', fontWeight: 500 }}>
                    Auto-detects country
                  </span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Pune, Kyoto, Paris, Rome, Tokyo"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span>Country</span>
                  {autoDetected && (
                    <span className={styles.autoDetectSubtext}>
                      <Sparkles size={11} /> Auto-detected {autoDetected.flag}
                    </span>
                  )}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className={`${styles.input} ${autoDetected ? styles.countryAuto : ''}`}
                    placeholder="e.g. India, Japan, France"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setAutoDetected(null);
                    }}
                  />
                  {autoDetected && (
                    <span className={styles.autoDetectBadge}>
                      {autoDetected.flag} {autoDetected.country}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Duration</label>
                <select
                  className={styles.select}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                >
                  <option value={3}>3 Days (Weekend Getaway)</option>
                  <option value={5}>5 Days (Recommended)</option>
                  <option value={7}>7 Days (Full Exploration)</option>
                  <option value={10}>10 Days (In-Depth Journey)</option>
                  <option value={14}>14 Days (Grand Tour)</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Travel Style / Focus</label>
                <div className={styles.vibesRow}>
                  {VIBES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`${styles.vibeBtn} ${selectedVibe === v ? styles.vibeBtnActive : ''}`}
                      onClick={() => setSelectedVibe(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTIVE CONTINUOUS ANIMATION WHEN GENERATING */}
            {isGenerating && (
              <div className={styles.progressBox}>
                <div className={styles.progressTopRow}>
                  <div className={styles.progressStatus}>
                    <span className={styles.livePulseDot} />
                    <span className={styles.phraseText}>{stepLabel}</span>
                  </div>
                  <div className={styles.generatingBadge}>
                    <Compass size={13} className={styles.spinIcon} />
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Animated progress bar with continuous moving wave shimmer */}
                <div className={styles.progressTrack}>
                  <div
                    className={`${styles.progressFill} ${progress < 100 ? styles.progressActiveAnimation : ''}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Subtitle animation indicator */}
                <div className={styles.subtextAnimation}>
                  <div className={styles.waveDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>Neural agents active & generating itinerary dossier in real-time</span>
                </div>
              </div>
            )}

            <div className={styles.actionRow}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isGenerating || !city.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className={styles.spinIcon} />
                    <span>Still Generating Itinerary & Dossier ({Math.round(progress)}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate & Download Itinerary PDF</span>
                  </>
                )}
              </button>

              {onOpenModal && (
                <button
                  type="button"
                  className={styles.openWindowBtn}
                  onClick={() => {
                    if (!user) {
                      openAuthModal('signup');
                      onToast('Account required: Please create a free account or sign in to open the interactive studio.', 'info');
                      return;
                    }
                    onOpenModal(city, country, days);
                  }}
                >
                  <Maximize2 size={16} />
                  <span>Open Interactive Window & Audio Book</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
