'use client';

import React, { useState, useEffect } from 'react';
import { Download, Sparkles, MapPin, Calendar, Compass, Check, Sliders, FileText, Headphones } from 'lucide-react';
import styles from './TripPlannerForm.module.css';
import { api } from '@/services/api';

interface TripPlannerFormProps {
  initialCity?: string;
  initialCountry?: string;
  initialDays?: number;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const THEMES = [
  'Heritage & Palaces',
  'Street Food & Fine Dining',
  'Hidden Local Gems',
  'Photography & Panoramas',
  'Nature & Serenity',
  'Artisanal Crafts & Tea',
];

const GENERATION_STAGES = [
  'Finding the best routes and attractions...',
  'Building your day-by-day itinerary...',
  'Adding local restaurants and dining spots...',
  'Creating your downloadable PDF guide...',
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  initialCity = 'Kyoto',
  initialCountry = 'Japan',
  initialDays = 7,
  onToast,
}) => {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [days, setDays] = useState(initialDays);
  const [tempo, setTempo] = useState<'Relaxed' | 'Balanced' | 'Intensive'>('Balanced');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([
    'Heritage & Palaces',
    'Street Food & Fine Dining',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStage, setGenStage] = useState(0);

  useEffect(() => {
    if (initialCity) setCity(initialCity);
    if (initialCountry) setCountry(initialCountry);
    if (initialDays) setDays(initialDays);
  }, [initialCity, initialCountry, initialDays]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      onToast('Please enter a destination city', 'error');
      return;
    }

    setIsGenerating(true);
    setGenStage(0);

    const interval = setInterval(() => {
      setGenStage((prev) => Math.min(GENERATION_STAGES.length - 1, prev + 1));
    }, 4000);

    try {
      const preferencesStr = `${selectedThemes.join(', ')} (Tempo: ${tempo})`;
      const blob = await api.generatePDF(city.trim(), country.trim(), days, preferencesStr);

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${city.replace(/\s+/g, '_')}_${days}Day_Dossier.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      onToast(`Your ${city} travel guide is ready! 📄✨`, 'success');
    } catch (err: any) {
      onToast(err.message || 'Guide generation failed. Please try again.', 'error');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <section className={styles.section} id="plan-trip">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Trip Planner</span>
          <h2 className={styles.title}>Plan Your Perfect Trip</h2>
          <p className={styles.subtitle}>
            Tell us your preferences and our AI will create a detailed, day-by-day travel guide tailored just for you.
          </p>
        </div>

        {/* 2-Card Layout */}
        <div className={styles.grid}>
          {/* Left Card: STEP 1 */}
          <div className={styles.formCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.stepBadge}>STEP 1</div>
              <h3 className={styles.cardHeaderTitle}>Your Trip Details</h3>
            </div>

            <form onSubmit={handleGenerate} className={styles.form}>
              {/* Row 1: City & Country */}
              <div className={styles.row}>
                <div className={styles.fieldBox}>
                  <label className={styles.fieldLabel}>DESTINATION CITY</label>
                  <div className={styles.inputWrap}>
                    <MapPin size={14} className={styles.fieldIcon} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kyoto"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={styles.input}
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <div className={styles.fieldBox}>
                  <label className={styles.fieldLabel}>COUNTRY / REGION</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      placeholder="e.g. Japan"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={styles.input}
                      disabled={isGenerating}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Duration Slider */}
              <div className={styles.durationBlock}>
                <div className={styles.durationHeader}>
                  <label className={styles.fieldLabel}>DURATION OF JOURNEY</label>
                  <span className={styles.durationBadge}>
                    {days} Days ({days <= 3 ? 'Weekend Escape' : days <= 7 ? 'Standard Escape' : 'Grand Odyssey'})
                  </span>
                </div>
                <div className={styles.sliderWrap}>
                  <span className={styles.sliderMin}>1d</span>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className={styles.rangeInput}
                    disabled={isGenerating}
                  />
                  <span className={styles.sliderMax}>14d</span>
                </div>
              </div>

              {/* Row 3: Exploration Tempo */}
              <div className={styles.tempoBlock}>
                <label className={styles.fieldLabel}>EXPLORATION TEMPO</label>
                <div className={styles.tempoButtons}>
                  <button
                    type="button"
                    className={`${styles.tempoBtn} ${tempo === 'Relaxed' ? styles.tempoBtnActive : ''}`}
                    onClick={() => setTempo('Relaxed')}
                  >
                    Relaxed (1-2 Spots)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tempoBtn} ${tempo === 'Balanced' ? styles.tempoBtnActive : ''}`}
                    onClick={() => setTempo('Balanced')}
                  >
                    Balanced (3-4 Spots)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tempoBtn} ${tempo === 'Intensive' ? styles.tempoBtnActive : ''}`}
                    onClick={() => setTempo('Intensive')}
                  >
                    Intensive (Full Day)
                  </button>
                </div>
              </div>

              {/* Row 4: Curated Themes & Passions */}
              <div className={styles.themesBlock}>
                <label className={styles.fieldLabel}>CURATED THEMES & PASSIONS</label>
                <div className={styles.themePills}>
                  {THEMES.map((theme) => {
                    const isSelected = selectedThemes.includes(theme);
                    return (
                      <button
                        key={theme}
                        type="button"
                        className={`${styles.themePill} ${isSelected ? styles.themePillActive : ''}`}
                        onClick={() => toggleTheme(theme)}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{theme}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isGenerating}
                style={{ width: '100%', padding: '16px 24px', fontSize: '0.98rem', marginTop: 10 }}
              >
                {isGenerating ? (
                  <>
                    <div className={styles.spinner}></div>
                    <span>{GENERATION_STAGES[genStage]}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate My Travel Guide (PDF)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Card: STEP 2 LIVE DOSSIER BLUEPRINT */}
          <div className={styles.previewCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.stepBadge}>STEP 2</div>
              <h3 className={styles.cardHeaderTitle}>Your Guide Preview</h3>
              <Compass size={16} className={styles.headerCompass} />
            </div>

            <div className={styles.blueprintInnerCard}>
              <span className={styles.blueprintBadge}>What You&apos;ll Get</span>
              <h4 className={styles.blueprintTitle}>
                Your {days}-Day {city || 'Destination'} Itinerary
              </h4>
              <p className={styles.blueprintDesc}>
                A complete travel guide with daily schedules, restaurant picks,
                local tips, and practical travel information.
              </p>

              {/* Checklist */}
              <div className={styles.checkList}>
                <div className={styles.checkItem}>
                  <div className={styles.checkCircle}><Check size={11} /></div>
                  <div>
                    <strong>Day-by-day schedule</strong> — morning, afternoon & evening activities
                  </div>
                </div>
                <div className={styles.checkItem}>
                  <div className={styles.checkCircle}><Check size={11} /></div>
                  <div>
                    <strong>Food & dining</strong> — local restaurants, cafés, and street food spots
                  </div>
                </div>
                <div className={styles.checkItem}>
                  <div className={styles.checkCircle}><Check size={11} /></div>
                  <div>
                    <strong>Practical tips</strong> — transport, budgets, and local customs
                  </div>
                </div>
                <div className={styles.checkItem}>
                  <div className={styles.checkCircle}><Check size={11} /></div>
                  <div>
                    <strong>Hidden gems</strong> — off-the-beaten-path recommendations
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.blueprintFooter}>
                <span className={styles.pagesCount}>📄 Estimated: 12–14 pages</span>
                <button 
                  type="button" 
                  className="btn btn-plum btn-sm" 
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  onClick={() => onToast('Audio guide will be included with your PDF! 🎧', 'info')}
                >
                  <Headphones size={12} />
                  <span>+ Audio Guide</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
