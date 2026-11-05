'use client';

import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Loader2 } from 'lucide-react';
import styles from './TripPlannerForm.module.css';
import { api } from '@/services/api';

interface TripPlannerFormProps {
  initialCity?: string;
  initialCountry?: string;
  initialDays?: number;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const VIBES = [
  'Cultural & Historical',
  'Food & Local Dining',
  'Nature & Scenic Landscapes',
  'Relaxed & Wellness',
  'Fast-Paced Explorer',
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  initialCity = 'Kyoto',
  initialCountry = 'Japan',
  initialDays = 5,
  onToast,
}) => {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [days, setDays] = useState(initialDays);
  const [selectedVibe, setSelectedVibe] = useState('Cultural & Historical');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialCity) setCity(initialCity);
    if (initialCountry) setCountry(initialCountry);
    if (initialDays) setDays(initialDays);
  }, [initialCity, initialCountry, initialDays]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      onToast('Please enter a destination city', 'error');
      return;
    }

    setIsGenerating(true);
    onToast(`Generating ${days}-day guide for ${city}...`, 'info');

    try {
      const blob = await api.generatePDF(
        city,
        country,
        days,
        `Vibe: ${selectedVibe}. Balanced schedule.`
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${city.replace(/\s+/g, '_')}_${days}Day_Guide.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onToast(`Downloaded ${city} travel guide! ✈️`, 'success');
    } catch (err: any) {
      onToast(err.message || 'Failed to generate travel guide', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className={styles.section} id="plan-trip">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Custom Generator</span>
          <h2 className={styles.title}>Build Your Complete Itinerary</h2>
          <p className={styles.subtitle}>
            Enter your destination details and download an AI-generated PDF itinerary formatted with schedules and tips.
          </p>
        </div>

        <div className={styles.formCard}>
          <form onSubmit={handleGenerate}>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Destination City</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Kyoto, Paris, Rome"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Country</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Japan, France, Italy"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
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

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>AI Agents Generating Itinerary & PDF...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Generate Itinerary & Download PDF</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
