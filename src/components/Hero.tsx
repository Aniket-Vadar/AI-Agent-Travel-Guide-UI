'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Sparkles, Compass, Users, Headphones, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import styles from './Hero.module.css';

interface HeroProps {
  onSearch: (city: string, country?: string) => void;
  onExplorePlan: (city: string, country?: string, days?: number) => void;
  onSelectStory: (city: string, country?: string) => void;
}

const HERO_DESTINATIONS = [
  {
    city: 'Kyoto',
    country: 'Japan',
    tagline: 'Ancient temples, bamboo groves & quiet morning zen',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=85',
    emoji: '⛩️',
    rating: '4.98',
    badge: '🌸 Cherry Blossom Season Active',
  },
  {
    city: 'Amalfi Coast',
    country: 'Italy',
    tagline: 'Pastel cliffside villas tumbling into sapphire Mediterranean waters',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=85',
    emoji: '🍋',
    rating: '4.97',
    badge: '☀️ Trending Summer Coastal Escape',
  },
  {
    city: 'Swiss Alps',
    country: 'Switzerland',
    tagline: 'Majestic snow-capped peaks, crystal alpine lakes & panoramic trains',
    image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1920&q=85',
    emoji: '🏔️',
    rating: '4.95',
    badge: '🚞 Top Scenic Train Journeys',
  },
  {
    city: 'Paris',
    country: 'France',
    tagline: 'Timeless Haussmannian avenues, art sanctuaries & golden sunsets',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=85',
    emoji: '🥐',
    rating: '4.96',
    badge: '🎨 Culture & Fine Dining Capital',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    tagline: 'Misty emerald rice terraces, cliffside temples & tranquil waterfalls',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85',
    emoji: '🌴',
    rating: '4.94',
    badge: '🧘 Ultimate Wellness & Nature',
  },
];

const QUICK_SUGGESTIONS = [
  { name: 'Kyoto', country: 'Japan', emoji: '⛩️' },
  { name: 'Amalfi Coast', country: 'Italy', emoji: '🍋' },
  { name: 'Paris', country: 'France', emoji: '🗼' },
  { name: 'Swiss Alps', country: 'Switzerland', emoji: '🏔️' },
  { name: 'Jaipur', country: 'India', emoji: '🏰' },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴' },
];

export const Hero: React.FC<HeroProps> = ({ onSearch, onExplorePlan, onSelectStory }) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'plan' | 'audio' | 'matcher'>('plan');
  const [destination, setDestination] = useState('Kyoto, Japan');
  const [duration, setDuration] = useState(5);
  const [season, setSeason] = useState('Spring (Mar - May)');
  const [travelers, setTravelers] = useState('Couple (2 Travelers)');

  const currentHero = HERO_DESTINATIONS[activeHeroIndex];

  // Optional background rotation every 10 seconds if user hasn't manually clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % HERO_DESTINATIONS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    const parts = destination.split(',').map((s) => s.trim());
    const city = parts[0];
    const country = parts[1] || '';

    if (activeTab === 'audio') {
      onSelectStory(city, country);
    } else if (activeTab === 'matcher') {
      const el = document.getElementById('trip-matcher');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExplorePlan(city, country, duration);
    }
  };

  const selectHeroDestination = (index: number) => {
    setActiveHeroIndex(index);
    const dest = HERO_DESTINATIONS[index];
    setDestination(`${dest.city}, ${dest.country}`);
  };

  return (
    <section className={styles.hero} id="top">
      {/* Background Image Carousel with Smooth Crossfade */}
      <div className={styles.heroBgContainer}>
        {HERO_DESTINATIONS.map((dest, i) => (
          <div
            key={dest.city}
            className={`${styles.heroBgSlide} ${i === activeHeroIndex ? styles.slideActive : ''}`}
            style={{ backgroundImage: `url(${dest.image})` }}
          />
        ))}
      </div>
      <div className={styles.heroGradientOverlay} />

      {/* Main Container */}
      <div className={styles.heroContainer}>
        {/* Floating Top Badge */}
        <div className={styles.topBadgeRow}>
          <div className={styles.verifiedBadge}>
            <span className={styles.pulseDot} />
            <Sparkles size={13} className={styles.badgeIcon} />
            <span>AI Travel Concierge & Living Audio Stories</span>
          </div>
          <div className={styles.activeSeasonPill}>
            <span>{currentHero.badge}</span>
          </div>
        </div>

        {/* Dynamic Catchy Title */}
        <h1 className={styles.heroTitle}>
          Your World Journey,<br />
          <span className={styles.heroTitleEmphasized}>Artfully Curated by AI</span>
        </h1>

        <p className={styles.heroSubtitle}>
          {currentHero.tagline}. Generate personalized day-by-day itineraries,
          immersive voice-guided walking tours, and verified local secrets in seconds.
        </p>

        {/* Travel Search Widget (The iconic travel booking box) */}
        <div className={styles.searchEngineCard}>
          {/* Booking Engine Tabs */}
          <div className={styles.searchTabs}>
            <button
              type="button"
              className={`${styles.searchTab} ${activeTab === 'plan' ? styles.searchTabActive : ''}`}
              onClick={() => setActiveTab('plan')}
            >
              <Compass size={15} />
              <span>Day-by-Day Itinerary</span>
            </button>
            <button
              type="button"
              className={`${styles.searchTab} ${activeTab === 'audio' ? styles.searchTabActive : ''}`}
              onClick={() => setActiveTab('audio')}
            >
              <Headphones size={15} />
              <span>Audio Walking Tour</span>
            </button>
            <button
              type="button"
              className={`${styles.searchTab} ${activeTab === 'matcher' ? styles.searchTabActive : ''}`}
              onClick={() => {
                setActiveTab('matcher');
                const el = document.getElementById('trip-matcher');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Sparkles size={15} />
              <span>AI Vibe Matcher</span>
            </button>
          </div>

          {/* Unified Travel Search Bar */}
          <form onSubmit={handleSearchSubmit} className={styles.searchBarForm}>
            {/* Field 1: Destination */}
            <div className={styles.searchCol}>
              <span className={styles.searchColLabel}>
                <MapPin size={12} className={styles.colLabelIcon} />
                DESTINATION
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to? (e.g. Kyoto, Paris, Amalfi)"
                className={styles.searchColInput}
                required
              />
            </div>

            <div className={styles.searchDivider} />

            {/* Field 2: When / Season */}
            <div className={styles.searchCol}>
              <span className={styles.searchColLabel}>
                <Calendar size={12} className={styles.colLabelIcon} />
                SEASON & TIMING
              </span>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className={styles.searchColSelect}
              >
                <option value="Spring (Mar - May)">🌸 Spring (Mar – May)</option>
                <option value="Summer (Jun - Aug)">☀️ Summer (Jun – Aug)</option>
                <option value="Autumn (Sep - Nov)">🍁 Autumn (Sep – Nov)</option>
                <option value="Winter (Dec - Feb)">❄️ Winter (Dec – Feb)</option>
                <option value="Flexible">✨ Flexible Anytime</option>
              </select>
            </div>

            <div className={styles.searchDivider} />

            {/* Field 3: Duration */}
            <div className={styles.searchCol}>
              <span className={styles.searchColLabel}>
                <Calendar size={12} className={styles.colLabelIcon} />
                DURATION
              </span>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={styles.searchColSelect}
              >
                <option value={3}>3 Days (Weekend Getaway)</option>
                <option value={5}>5 Days (Optimal Explorer)</option>
                <option value={7}>7 Days (Full 1-Week Trip)</option>
                <option value={10}>10 Days (Deep Cultural Immersion)</option>
                <option value={14}>14 Days (Grand Expedition)</option>
              </select>
            </div>

            <div className={styles.searchDivider} />

            {/* Field 4: Travelers */}
            <div className={styles.searchCol}>
              <span className={styles.searchColLabel}>
                <Users size={12} className={styles.colLabelIcon} />
                TRAVELERS
              </span>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className={styles.searchColSelect}
              >
                <option value="Solo (1 Traveler)">Solo Explorer (1)</option>
                <option value="Couple (2 Travelers)">Romantic Couple (2)</option>
                <option value="Friends (3-4 Travelers)">Friends Group (3-4)</option>
                <option value="Family with Kids">Family with Children</option>
              </select>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className={styles.searchSubmitBtn}
              aria-label="Generate travel guide"
            >
              <Sparkles size={18} />
              <span>{activeTab === 'audio' ? 'Listen Guide' : 'Build Trip'}</span>
            </button>
          </form>
        </div>

        {/* Quick Suggestion Chips with flags */}
        <div className={styles.quickPicksRow}>
          <span className={styles.quickPicksLabel}>Popular Journeys:</span>
          {QUICK_SUGGESTIONS.map((item) => (
            <button
              key={item.name}
              type="button"
              className={styles.quickPickChip}
              onClick={() => {
                setDestination(`${item.name}, ${item.country}`);
                onSelectStory(item.name, item.country);
              }}
            >
              <span className={styles.chipEmoji}>{item.emoji}</span>
              <span className={styles.chipName}>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Destination Switcher Pills (Travel site carousel thumbnails) */}
        <div className={styles.heroDestinationSwitcher}>
          <span className={styles.switcherLabel}>Featured Destinations:</span>
          <div className={styles.switcherPills}>
            {HERO_DESTINATIONS.map((dest, idx) => (
              <button
                key={dest.city}
                type="button"
                className={`${styles.switcherPill} ${idx === activeHeroIndex ? styles.switcherPillActive : ''}`}
                onClick={() => selectHeroDestination(idx)}
              >
                <span className={styles.pillEmoji}>{dest.emoji}</span>
                <span className={styles.pillCity}>{dest.city}</span>
                <span className={styles.pillRating}>★ {dest.rating}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Social Proof & Live Traveler Metrics Bar */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <div className={styles.metricNumber}>12,400+</div>
            <div className={styles.metricLabel}>Trips Planned This Month</div>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <div className={styles.metricNumber}>
              <Star size={16} fill="#F0B866" color="#F0B866" style={{ display: 'inline', marginRight: 4 }} />
              4.97 / 5
            </div>
            <div className={styles.metricLabel}>Rated by 28,000+ Travelers</div>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <div className={styles.metricNumber}>50+ Cities</div>
            <div className={styles.metricLabel}>With Voice-Guided Walking Tours</div>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <div className={styles.metricNumber}>100% Free</div>
            <div className={styles.metricLabel}>Instant Downloadable PDF Dossiers</div>
          </div>
        </div>
      </div>
    </section>
  );
};
