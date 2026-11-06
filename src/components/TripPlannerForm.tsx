'use client';

import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Loader2, CheckCircle2, Maximize2, Headphones } from 'lucide-react';
import styles from './TripPlannerForm.module.css';
import { api } from '@/services/api';
import { lookupCityCountrySync, resolveCityCountry } from '@/utils/cityCountryMap';

interface TripPlannerFormProps {
  initialCity?: string;
  initialCountry?: string;
  initialDays?: number;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
  onOpenModal?: () => void;
}

const VIBES = [
  'Cultural & Historical',
  'Food & Local Dining',
  'Nature & Scenic Landscapes',
  'Relaxed & Wellness',
  'Fast-Paced Explorer',
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  initialCity = 'Pune',
  initialCountry = 'India',
  initialDays = 5,
  onToast,
  onOpenModal,
}) => {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [days, setDays] = useState(initialDays);
  const [selectedVibe, setSelectedVibe] = useState('Cultural & Historical');
  const [autoDetected, setAutoDetected] = useState<{ country: string; flag?: string } | null>(null);

  // Animated generation progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('Initializing AI agents...');

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

    setIsGenerating(true);
    setProgress(12);
    setStepLabel(`1/4: Analyzing cultural heritage & map coordinates for ${city}...`);

    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) {
          setStepLabel(`2/4: Sourcing authentic attractions & hidden culinary gems...`);
          return prev + 6;
        } else if (prev < 70) {
          setStepLabel(`3/4: Optimizing day-by-day routes and pacing...`);
          return prev + 4;
        } else if (prev < 90) {
          setStepLabel(`4/4: Formatting vector ReportLab PDF travel dossier...`);
          return prev + 2;
        }
        return prev;
      });
    }, 400);

    try {
      const blob = await api.generatePDF(
        city,
        country,
        days,
        `Vibe: ${selectedVibe}. Balanced schedule.`
      );

      clearInterval(pInterval);
      setProgress(100);
      setStepLabel(`✓ Generated! Downloading ${city} PDF...`);

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
      }, 3500);
    } catch (err: any) {
      clearInterval(pInterval);
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

            {/* ANIMATED PROGRESS BAR WHEN GENERATING */}
            {isGenerating && (
              <div className={styles.progressBox}>
                <div className={styles.progressTopRow}>
                  <div className={styles.progressStatus}>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{stepLabel}</span>
                  </div>
                  <span className={styles.progressPercent}>{progress}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
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
                    <Loader2 size={16} className="animate-spin" />
                    <span>Compiling PDF Itinerary ({progress}%)...</span>
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
                  onClick={onOpenModal}
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
