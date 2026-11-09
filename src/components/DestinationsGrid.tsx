'use client';

import React from 'react';
import { BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import styles from './DestinationsGrid.module.css';
import { Destination } from '@/services/api';

interface DestinationsGridProps {
  destinations: Destination[];
  activeCategory?: string;
  onSelectDestination: (dest: Destination) => void;
  onPlanDestination: (dest: Destination) => void;
  onToast?: (msg: string, type?: 'info' | 'success' | 'error') => void;
  loadingCity?: string | null;
}

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({
  destinations,
  activeCategory = 'All',
  onSelectDestination,
  onPlanDestination,
  loadingCity = null,
}) => {
  const filtered = activeCategory === 'All'
    ? destinations
    : destinations.filter((d) => {
        const cat = (d.category || '').toLowerCase();
        const tag = (d.tagline || '').toLowerCase();
        const query = activeCategory.toLowerCase();
        return cat.includes(query) || tag.includes(query);
      });

  const displayList = filtered.length > 0 ? filtered : destinations;

  return (
    <section className={styles.section} id="destinations">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.titleCol}>
            <span className={styles.eyebrow}>Featured Cities</span>
            <h2 className={styles.title}>Curated World Destinations</h2>
            <p className={styles.subtitle}>
              Browse places with ready-to-listen audio narrations and verified day-by-day itineraries.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {displayList.map((dest) => (
            <div key={dest.city} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={dest.image}
                  alt={`${dest.city}, ${dest.country}`}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.durationBadge}>
                  {dest.duration || '4-6 Days'}
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <h3 className={styles.cityName}>{dest.city}</h3>
                  <span className={styles.countryName}>{dest.country}</span>
                </div>

                <p className={styles.tagline}>{dest.tagline}</p>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.readBtn}
                    onClick={() => onSelectDestination(dest)}
                    disabled={Boolean(loadingCity)}
                  >
                    {loadingCity?.toLowerCase() === dest.city.toLowerCase() ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={14} />
                        <span>Story & Audio</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={styles.planCardBtn}
                    onClick={() => onPlanDestination(dest)}
                  >
                    <Calendar size={14} />
                    <span>Plan Trip</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
