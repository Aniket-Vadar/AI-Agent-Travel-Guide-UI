'use client';

import React from 'react';
import styles from './CategoryStrip.module.css';

interface CategoryStripProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES = [
  { id: 'All', label: 'All Journeys', emoji: '✨' },
  { id: 'Spring', label: 'Cherry Blossoms', emoji: '🌸' },
  { id: 'Coastal', label: 'Coastal & Islands', emoji: '🌊' },
  { id: 'Cultural', label: 'Ancient Temples', emoji: '⛩️' },
  { id: 'Mountains', label: 'Alpine & Peaks', emoji: '🏔️' },
  { id: 'Foodie', label: 'Culinary Capitals', emoji: '🍜' },
  { id: 'Romantic', label: 'Romantic Escapes', emoji: '💎' },
  { id: 'Heritage', label: 'Royal Palaces', emoji: '🏰' },
];

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.track}>
          {CATEGORIES.map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                onClick={() => {
                  onSelectCategory(item.id);
                  const el = document.getElementById('destinations');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className={styles.emoji}>{item.emoji}</span>
                <span className={styles.label}>{item.label}</span>
                {isActive && <span className={styles.indicator} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
