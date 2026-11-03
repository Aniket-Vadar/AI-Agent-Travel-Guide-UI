'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Calendar, Star, MapPin, Heart, Sparkles, ArrowRight } from 'lucide-react';
import styles from './DestinationsGrid.module.css';
import { Destination } from '@/services/api';

interface DestinationsGridProps {
  destinations: Destination[];
  activeCategory?: string;
  onSelectDestination: (dest: Destination) => void;
  onPlanDestination: (dest: Destination) => void;
  onToast?: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const CATEGORIES = [
  'All',
  'Spring',
  'Cultural',
  'Coastal',
  'Mountains',
  'Heritage',
  'Foodie',
];

const CARD_DATA: Record<string, { duration: string; season: string; rating: string; reviews: string; price: string; highlight: string }> = {
  Kyoto: { duration: '5 min audio', season: 'Mar – May', rating: '4.98', reviews: '2.4K', price: '$$ Moderate', highlight: 'Ancient shrines & bamboo serenity' },
  'Amalfi Coast': { duration: '4 min audio', season: 'May – Sep', rating: '4.97', reviews: '1.6K', price: '$$$ Luxury', highlight: 'Pastel cliff villages & lemon groves' },
  Paris: { duration: '6 min audio', season: 'Apr – Oct', rating: '4.95', reviews: '3.8K', price: '$$$ Luxury', highlight: 'Café culture & Beaux-Arts treasures' },
  'Zurich & Alps': { duration: '4 min audio', season: 'Jun – Sep', rating: '4.94', reviews: '1.1K', price: '$$$ Luxury', highlight: 'Alpine trains & pristine lakeside walks' },
  Zurich: { duration: '4 min audio', season: 'Jun – Sep', rating: '4.94', reviews: '1.1K', price: '$$$ Luxury', highlight: 'Alpine trains & pristine lakeside walks' },
  Jaipur: { duration: '5 min audio', season: 'Oct – Mar', rating: '4.92', reviews: '1.9K', price: '$ Budget-Friendly', highlight: 'Pink sandstone palaces & bazaars' },
  'Cape Town': { duration: '4 min audio', season: 'Nov – Apr', rating: '4.91', reviews: '1.3K', price: '$$ Moderate', highlight: 'Table Mountain & coastal vineyards' },
  Bali: { duration: '5 min audio', season: 'Apr – Oct', rating: '4.96', reviews: '4.2K', price: '$ Budget-Friendly', highlight: 'Sacred water temples & jungle villas' },
  Santorini: { duration: '4 min audio', season: 'May – Oct', rating: '4.96', reviews: '2.8K', price: '$$$ Luxury', highlight: 'Caldera cliff sunsets & blue domes' },
};

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({
  destinations,
  activeCategory = 'All',
  onSelectDestination,
  onPlanDestination,
  onToast,
}) => {
  const [selectedCat, setSelectedCat] = useState(activeCategory);
  const [wishlist, setWishlist] = useState<string[]>(['Kyoto']);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeCategory) {
      setSelectedCat(activeCategory);
    }
  }, [activeCategory]);

  const toggleWishlist = (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(city)) {
      setWishlist((prev) => prev.filter((c) => c !== city));
      onToast?.(`Removed ${city} from your wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, city]);
      onToast?.(`Saved ${city} to your Travel Wishlist! ❤️`, 'success');
    }
  };

  const filtered = destinations.filter((d) => {
    if (selectedCat === 'All') return true;
    if (selectedCat === 'Spring') {
      return ['Kyoto', 'Paris', 'Zurich'].some((c) => d.city.includes(c));
    }
    if (selectedCat === 'Cultural') {
      return ['Paris', 'Kyoto', 'Jaipur'].some((c) => d.city.includes(c));
    }
    if (selectedCat === 'Coastal') {
      return ['Amalfi', 'Cape Town', 'Bali', 'Santorini'].some((c) => d.city.includes(c));
    }
    if (selectedCat === 'Mountains') {
      return ['Zurich', 'Alps', 'Cape Town'].some((c) => d.city.includes(c));
    }
    if (selectedCat === 'Heritage') {
      return ['Jaipur', 'Kyoto', 'Paris'].some((c) => d.city.includes(c));
    }
    if (selectedCat === 'Foodie') {
      return ['Paris', 'Kyoto', 'Amalfi'].some((c) => d.city.includes(c));
    }
    return true;
  });

  const displayList = filtered.length > 0 ? filtered : destinations;

  return (
    <section className={styles.section} id="destinations" ref={sectionRef}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleCol}>
            <span className={styles.eyebrow}>
              <Sparkles size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 5 }} />
              EXPLORE CURATED EXPEDITIONS
            </span>
            <h2 className={styles.title}>Trending World Destinations</h2>
            <p className={styles.subtitle}>
              Each sanctuary features an AI-crafted narrative, offline voice walk, and verified neighborhood guides.
            </p>
          </div>

          <div className={styles.filterTabs}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.tabBtn} ${selectedCat === cat ? styles.tabActive : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {displayList.map((dest, idx) => {
            const meta = CARD_DATA[dest.city] || {
              duration: '4 min audio',
              season: 'Year-Round',
              rating: '4.95',
              reviews: '1.5K',
              price: '$$ Moderate',
              highlight: dest.tagline,
            };
            const isWishlisted = wishlist.includes(dest.city);

            return (
              <article
                key={`${dest.city}-${idx}`}
                className={styles.card}
                onClick={() => onSelectDestination(dest)}
              >
                {/* Image */}
                <div className={styles.imageWrapper}>
                  <img
                    src={dest.image}
                    alt={`${dest.city}, ${dest.country}`}
                    className={styles.cardImg}
                    loading="lazy"
                  />
                  <div className={styles.imageOverlay} />

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistActive : ''}`}
                    onClick={(e) => toggleWishlist(dest.city, e)}
                    aria-label={`Save ${dest.city} to wishlist`}
                  >
                    <Heart
                      size={16}
                      fill={isWishlisted ? '#E8652B' : 'none'}
                      color={isWishlisted ? '#E8652B' : '#FFFFFF'}
                    />
                  </button>

                  {/* Badges on Image */}
                  <div className={styles.countryBadge}>
                    {dest.emoji || '📍'} {dest.country}
                  </div>

                  <div className={styles.audioBadge}>
                    <Headphones size={11} />
                    <span>{meta.duration}</span>
                  </div>

                  <div className={styles.seasonTag}>
                    <Calendar size={11} />
                    <span>{meta.season}</span>
                  </div>
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <div>
                    <div className={styles.cityRow}>
                      <h3 className={styles.cityName}>{dest.city}</h3>
                      <div className={styles.ratingBox}>
                        <Star size={13} fill="#D4A04A" color="#D4A04A" />
                        <span className={styles.ratingVal}>{meta.rating}</span>
                        <span className={styles.reviewsVal}>({meta.reviews})</span>
                      </div>
                    </div>

                    <div className={styles.priceRow}>
                      <span className={styles.priceBadge}>{meta.price}</span>
                      <span className={styles.highlightText}>• {meta.highlight}</span>
                    </div>

                    <p className={styles.tagline}>{dest.tagline}</p>
                  </div>

                  {/* Buttons */}
                  <div className={styles.btnRow}>
                    <button
                      type="button"
                      className="btn btn-ocean btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDestination(dest);
                      }}
                      style={{ flex: 1 }}
                    >
                      <Headphones size={14} />
                      <span>Audio Guide</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlanDestination(dest);
                      }}
                      style={{ flex: 1 }}
                    >
                      <MapPin size={14} />
                      <span>Plan Trip</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
