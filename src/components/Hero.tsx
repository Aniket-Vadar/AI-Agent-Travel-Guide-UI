'use client';

import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Volume2,
  Calendar,
  Loader2,
  Zap,
  Globe,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import styles from './Hero.module.css';
import { useAuth } from '@/context/AuthContext';

interface HeroProps {
  onSearch: (city: string, country?: string) => void;
  onExplorePlan: (city: string, country?: string, days?: number, vibe?: string) => void;
  onSelectStory: (city: string, country?: string) => void;
  isLoadingStory?: boolean;
}

const PRESET_DESTINATIONS = [
  { city: 'Pune', country: 'India', flag: '🇮🇳' },
  { city: 'Kyoto', country: 'Japan', flag: '🇯🇵' },
  { city: 'Paris', country: 'France', flag: '🇫🇷' },
  { city: 'Amalfi Coast', country: 'Italy', flag: '🇮🇹' },
  { city: 'Swiss Alps', country: 'Switzerland', flag: '🇨🇭' },
  { city: 'Bali', country: 'Indonesia', flag: '🇮🇩' },
  { city: 'Goa', country: 'India', flag: '🇮🇳' },
];

const VIBES = [
  'Cultural & Heritage',
  'Food & Local Dining',
  'Nature & Scenic Landscapes',
  'Relaxed & Wellness',
  'Fast-Paced Explorer',
];

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onExplorePlan,
  onSelectStory,
  isLoadingStory = false,
}) => {
  const { user, openAuthModal } = useAuth();
  const [city, setCity] = useState('Pune');
  const [country, setCountry] = useState('India');
  const [days, setDays] = useState(5);
  const [vibe, setVibe] = useState('Cultural & Heritage');
  const [isOpeningPlan, setIsOpeningPlan] = useState(false);

  // Auto-detect country for common cities
  const handleCityChange = (val: string) => {
    setCity(val);
    const lower = val.toLowerCase().trim();
    if (['pune', 'mumbai', 'delhi', 'goa', 'jaipur', 'manali', 'bangalore', 'kerala'].some((c) => lower.includes(c))) {
      setCountry('India');
    } else if (['kyoto', 'tokyo', 'osaka', 'hokkaido'].some((c) => lower.includes(c))) {
      setCountry('Japan');
    } else if (['paris', 'nice', 'lyon'].some((c) => lower.includes(c))) {
      setCountry('France');
    } else if (['amalfi', 'rome', 'florence', 'venice', 'milan'].some((c) => lower.includes(c))) {
      setCountry('Italy');
    } else if (['bali', 'jakarta'].some((c) => lower.includes(c))) {
      setCountry('Indonesia');
    } else if (['zurich', 'alps', 'geneva', 'zermatt'].some((c) => lower.includes(c))) {
      setCountry('Switzerland');
    }
  };

  const handlePlan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city.trim()) return;

    if (!user) {
      openAuthModal('signup');
      return;
    }

    setIsOpeningPlan(true);
    onExplorePlan(city, country, days, vibe);
    setTimeout(() => setIsOpeningPlan(false), 500);
  };

  const handleStory = () => {
    if (!city.trim()) return;

    if (!user) {
      openAuthModal('signup');
      return;
    }

    onSelectStory(city, country);
  };

  const selectPreset = (c: string, co: string) => {
    setCity(c);
    setCountry(co);
  };

  return (
    <section className={styles.hero} id="top">
      <div className={styles.heroContainer}>
        {/* SaaS Engine Status Badge */}
        <div className={styles.badge}>
          <span className={styles.pulseDot} />
          <span>Autonomous Travel Intelligence • Multi-Agent Mesh v2.5</span>
        </div>

        {/* Hero Title */}
        <h1 className={styles.title}>
          Travel planning made effortless.
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Orchestrate bespoke day-by-day itineraries, broadcast-grade neural voice narrations,
          and vector PDF dossiers with real-time transit and cultural curation.
        </p>

        {/* Interactive SaaS Parameter Console */}
        <div className={styles.studioConsole}>
          <div className={styles.consoleHeader}>
            <div className={styles.consoleTabs}>
              <span className={`${styles.consoleTab} ${styles.consoleTabActive}`}>
                <Sliders size={13} />
                <span>Journey Studio</span>
              </span>
            </div>
            <div className={styles.engineIndicator}>
              <CheckCircle2 size={13} />
              <span>Agents Ready</span>
            </div>
          </div>

          <div className={styles.inputsGrid}>
            {/* City Field */}
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>
                <span>Destination City</span>
                {country && <span className={styles.countryPill}>{country}</span>}
              </label>
              <div className={styles.searchBoxWrap}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="e.g. Pune, Kyoto, Paris, Rome, Bali"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                />
              </div>
            </div>

            {/* Duration Segmented Bar */}
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>
                <span>Duration</span>
                <span style={{ fontSize: '0.7rem', color: '#71717A' }}>Interactive Schedule</span>
              </label>
              <div className={styles.durationBar}>
                {[3, 5, 7, 10, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`${styles.durationPill} ${days === d ? styles.durationPillActive : ''}`}
                    onClick={() => setDays(d)}
                  >
                    {d}D {d === 5 ? '★' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vibe Selector */}
          <div className={styles.vibeRow}>
            <label className={styles.fieldLabel}>Travel Style & Atmosphere</label>
            <div className={styles.vibeList}>
              {VIBES.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`${styles.vibeBtn} ${vibe === v ? styles.vibeBtnActive : ''}`}
                  onClick={() => setVibe(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.voiceBtn}
              onClick={handleStory}
              disabled={!city.trim() || isLoadingStory}
            >
              {isLoadingStory ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Loading Story & Voice...</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} />
                  <span>Story & Audio Guide</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={styles.planBtn}
              onClick={handlePlan}
              disabled={!city.trim()}
            >
              {isOpeningPlan ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Launching Studio...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Compile Itinerary & PDF Dossier</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className={styles.presetsBar}>
          <span className={styles.presetLabel}>Quick Presets:</span>
          {PRESET_DESTINATIONS.map((p) => (
            <button
              key={p.city}
              type="button"
              className={styles.presetBtn}
              onClick={() => selectPreset(p.city, p.country)}
            >
              <span>{p.flag}</span>
              <span>{p.city}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
