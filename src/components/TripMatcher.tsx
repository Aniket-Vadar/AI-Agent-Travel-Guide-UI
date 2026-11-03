'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Compass, Heart, Mountain, Landmark, Utensils, Waves, ArrowRight, Check, Star } from 'lucide-react';
import styles from './TripMatcher.module.css';

interface TripMatcherProps {
  onSelectResult: (city: string, country: string) => void;
  onPlanResult: (city: string, country: string) => void;
}

const COMPANIONS = [
  { id: 'solo', label: 'Solo Explorer', icon: Compass },
  { id: 'couple', label: 'Romantic Couple', icon: Heart },
  { id: 'friends', label: 'Friends Group', icon: Users },
];

const VIBES = [
  {
    id: 'culture',
    label: 'Temples & Heritage',
    icon: Landmark,
    matchCity: 'Kyoto',
    matchCountry: 'Japan',
    emoji: '⛩️',
    score: '98%',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    why: 'Serene morning Zen gardens, vermilion mountain shrines, and private tea ceremonies ideal for mindful travel.',
  },
  {
    id: 'coast',
    label: 'Azure Coast & Sun',
    icon: Waves,
    matchCity: 'Amalfi Coast',
    matchCountry: 'Italy',
    emoji: '🍋',
    score: '99%',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    why: 'Dramatic limestone cliffs, pastel terrace villas, and cliffside sunset spritzes overlooking cobalt waters.',
  },
  {
    id: 'palace',
    label: 'Royal Forts & Bazaars',
    icon: Landmark,
    matchCity: 'Jaipur',
    matchCountry: 'India',
    emoji: '🏰',
    score: '96%',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
    why: 'The historic Pink City with astronomical observatories, hilltop Rajput forts, and bustling gemstone alleys.',
  },
  {
    id: 'nature',
    label: 'Alpine Lakes & Peaks',
    icon: Mountain,
    matchCity: 'Zurich & Alps',
    matchCountry: 'Switzerland',
    emoji: '🏔️',
    score: '97%',
    image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&q=80',
    why: 'Crystal clear glacial waters, scenic cogwheel mountain trains, and pristine wildflower meadows.',
  },
  {
    id: 'food',
    label: 'Bistros & Wine Capitals',
    icon: Utensils,
    matchCity: 'Paris',
    matchCountry: 'France',
    emoji: '🥐',
    score: '99%',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    why: 'World-renowned sidewalk café culture, Michelin-starred bistros, and golden hour walks along the Seine.',
  },
];

export const TripMatcher: React.FC<TripMatcherProps> = ({ onSelectResult, onPlanResult }) => {
  const [selectedCompanion, setSelectedCompanion] = useState('couple');
  const [selectedVibe, setSelectedVibe] = useState('culture');

  const currentMatch = VIBES.find((v) => v.id === selectedVibe) || VIBES[0];

  return (
    <section className={styles.section} id="trip-matcher">
      <div className={styles.container}>
        <div className={styles.innerCard}>
          {/* Left: Interactive Quiz Controls */}
          <div className={styles.textCol}>
            <div className={styles.badgePill}>
              <Sparkles size={13} color="#E8652B" />
              <span>30-Second AI Travel Matcher</span>
            </div>
            <h2 className={styles.title}>Not Sure Where to Wander?</h2>
            <p className={styles.subtitle}>
              Tell us who is traveling and your dream atmosphere. Our neural engine matches you
              with the highest-affinity destination in real time.
            </p>

            {/* Question 1 */}
            <div className={styles.questionBlock}>
              <span className={styles.qLabel}>1. Who is traveling on this journey?</span>
              <div className={styles.optionsRow}>
                {COMPANIONS.map((c) => {
                  const Icon = c.icon;
                  const isActive = selectedCompanion === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.optBtn} ${isActive ? styles.optActive : ''}`}
                      onClick={() => setSelectedCompanion(c.id)}
                    >
                      <Icon size={15} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div className={styles.questionBlock}>
              <span className={styles.qLabel}>2. What scenery speaks to your soul?</span>
              <div className={styles.optionsRow}>
                {VIBES.map((v) => {
                  const Icon = v.icon;
                  const isActive = selectedVibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`${styles.optBtn} ${isActive ? styles.optActive : ''}`}
                      onClick={() => setSelectedVibe(v.id)}
                    >
                      <Icon size={15} />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Instant Match Reveal Box with Photo */}
          <div className={styles.resultCol}>
            <div className={styles.resultCard}>
              {/* Photo Preview */}
              <div className={styles.resultImageWrap}>
                <img
                  src={currentMatch.image}
                  alt={currentMatch.matchCity}
                  className={styles.resultImg}
                />
                <div className={styles.matchScoreBadge}>
                  <Sparkles size={12} />
                  <span>{currentMatch.score} Compatibility Match</span>
                </div>
              </div>

              <div className={styles.resultBody}>
                <span className={styles.weSuggest}>Curated For Your Journey:</span>
                <h3 className={styles.matchedCity}>
                  {currentMatch.emoji} {currentMatch.matchCity}
                </h3>
                <span className={styles.matchedCountry}>{currentMatch.matchCountry}</span>

                <p className={styles.matchReason}>{currentMatch.why}</p>

                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className="btn btn-ocean btn-sm"
                    onClick={() => onSelectResult(currentMatch.matchCity, currentMatch.matchCountry)}
                    style={{ flex: 1 }}
                  >
                    <span>Listen Story</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onPlanResult(currentMatch.matchCity, currentMatch.matchCountry)}
                    style={{ flex: 1 }}
                  >
                    <span>Plan This Trip</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
