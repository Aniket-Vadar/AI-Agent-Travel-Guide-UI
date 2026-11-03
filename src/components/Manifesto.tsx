'use client';

import React from 'react';
import { Star, ShieldCheck, Heart } from 'lucide-react';
import styles from './Manifesto.module.css';

const REVIEWS = [
  {
    name: 'Elena Rostova',
    location: 'Berlin, Germany',
    dest: '⛩️ Kyoto, Japan',
    days: '5-Day Explorer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    quote:
      'The morning Torii gate walk before dawn and the quiet Arashiyama bamboo grove route were pure magic. The audio guide felt like having a local monk whispering history in my ear.',
  },
  {
    name: 'Marcus & Chloe Vance',
    location: 'London, UK',
    dest: '🍋 Amalfi Coast, Italy',
    days: '4-Day Honeymoon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    quote:
      'Wayfarer guided us down the Path of the Gods and into a cliffside lemon trattoria that was completely missing from standard guidebooks. An unforgettable honeymoon.',
  },
  {
    name: 'David & Maya Lin',
    location: 'San Francisco, USA',
    dest: '🏔️ Swiss Alps & Zurich',
    days: '7-Day Alpine Trek',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=80',
    quote:
      'Seamless transit timings between cogwheel mountain trains, stunning lake promenades, and the instant PDF dossier kept our family organized without any stress.',
  },
];

export const Manifesto: React.FC = () => {
  return (
    <section className={styles.section}>
      {/* Background travel image with subtle parallax feel */}
      <div className={styles.bgImage}>
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=85"
          alt="Sunset over Alpine peaks"
          className={styles.bgImg}
        />
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>VOICES OF THE WANDERLUST COMMUNITY</span>
          <h2 className={styles.title}>Over 28,000 Journeys Inspired</h2>
          <p className={styles.subtitle}>
            From solo backpackers to romantic escapes, see how travelers explore the world with Wayfarer.
          </p>
        </div>

        <div className={styles.reviewsGrid}>
          {REVIEWS.map((rev) => (
            <div key={rev.name} className={styles.reviewCard}>
              <div className={styles.cardTop}>
                <div className={styles.authorRow}>
                  <img src={rev.avatar} alt={rev.name} className={styles.avatar} />
                  <div>
                    <h4 className={styles.authorName}>{rev.name}</h4>
                    <span className={styles.authorLocation}>{rev.location}</span>
                  </div>
                </div>
                <div className={styles.destBadge}>
                  <span>{rev.dest}</span>
                </div>
              </div>

              <div className={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F0B866" color="#F0B866" />
                ))}
                <span className={styles.verifiedText}>Verified Traveler</span>
              </div>

              <p className={styles.quoteText}>&ldquo;{rev.quote}&rdquo;</p>
              <span className={styles.daysBadge}>Planned {rev.days}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
