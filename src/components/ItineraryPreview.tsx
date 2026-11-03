'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Utensils, Compass, Sparkles, Download, ArrowRight, Camera, Check, DollarSign } from 'lucide-react';
import styles from './ItineraryPreview.module.css';

interface ItineraryPreviewProps {
  onGenerateFullPdf: (city: string, days: number) => void;
  onExploreAudio?: (city: string) => void;
}

const SAMPLE_ITINERARIES: Record<string, {
  city: string;
  country: string;
  days: number;
  pace: string;
  budgetEst: string;
  highlights: string[];
  daysData: Array<{
    dayNumber: number;
    theme: string;
    items: Array<{
      time: string;
      title: string;
      desc: string;
      category: 'attraction' | 'food' | 'culture' | 'scenic';
      tip?: string;
    }>;
  }>;
}> = {
  Kyoto: {
    city: 'Kyoto',
    country: 'Japan',
    days: 3,
    pace: 'Cultural Harmony (3-4 Spots/Day)',
    budgetEst: '$95/day (Moderate)',
    highlights: ['Torii Gates at Dawn', 'Nishiki Market Street Eats', 'Gion Twilight Lanterns', 'Bamboo Grove Serenity'],
    daysData: [
      {
        dayNumber: 1,
        theme: 'Sacred Shrines & Historic Markets',
        items: [
          {
            time: '07:30 AM',
            title: 'Fushimi Inari Shrine Morning Walk',
            desc: 'Wander through thousands of vermilion torii gates winding up sacred Mount Inari before the midday crowds arrive.',
            category: 'attraction',
            tip: 'Hike to Yotsutsuji intersection for a panoramic view of south Kyoto.',
          },
          {
            time: '12:00 PM',
            title: 'Nishiki Market Street Food Exploration',
            desc: 'Savor freshly grilled unagi skewers, matcha ice cream, and dashi rolled omelets across a 400-year-old culinary street.',
            category: 'food',
            tip: 'Eat in designated stall spots; walking while eating is discouraged.',
          },
          {
            time: '03:30 PM',
            title: 'Kiyomizu-dera & Higashiyama Lanes',
            desc: 'Visit the grand wooden stage offering hillside views, then stroll down preserved Sannenzaka stone alleys.',
            category: 'culture',
          },
          {
            time: '07:00 PM',
            title: 'Twilight Stroll in Gion & Kaiseki Dinner',
            desc: 'Catch glimpses of geiko and maiko in historic lantern-lit alleys followed by a seasonal multi-course dinner.',
            category: 'food',
          },
        ],
      },
      {
        dayNumber: 2,
        theme: 'Zen Temples & Arashiyama Grove',
        items: [
          {
            time: '08:30 AM',
            title: 'Arashiyama Bamboo Forest & Tenryu-ji',
            desc: 'Listen to the rustling bamboo stalks and meditate in one of Kyoto’s most sublime world-heritage Zen gardens.',
            category: 'scenic',
            tip: 'Cross the Togetsukyo Bridge for riverside matcha tea.',
          },
          {
            time: '01:00 PM',
            title: 'Riverside Yudofu (Tofu Cuisine) Lunch',
            desc: 'Experience classic Kyoto simmered tofu hot pot in a serene garden overlooking the Katsura River.',
            category: 'food',
          },
          {
            time: '03:45 PM',
            title: 'Kinkaku-ji (The Golden Pavilion)',
            desc: 'Marvel at the top two floors completely covered in brilliant gold leaf, reflected seamlessly across the mirror pond.',
            category: 'attraction',
          },
        ],
      },
      {
        dayNumber: 3,
        theme: 'Philosopher’s Path & Artisanal Teahouses',
        items: [
          {
            time: '09:00 AM',
            title: 'Ginkaku-ji (Silver Pavilion) & Zen Dry Garden',
            desc: 'Admire the sea of silver sand and the cone-shaped moon viewing platform surrounded by moss greenery.',
            category: 'culture',
          },
          {
            time: '11:30 AM',
            title: 'Philosopher’s Walk & Craft Boutiques',
            desc: 'A tranquil stone canal path lined with cherry trees, small pottery studios, and independent artisanal cafés.',
            category: 'scenic',
          },
          {
            time: '02:30 PM',
            title: 'Authentic Uji Matcha Tea Ceremony',
            desc: 'Learn the meditative rituals of whisking seasonal ceremonial grade matcha with traditional wagashi sweets.',
            category: 'culture',
          },
        ],
      },
    ],
  },
  Amalfi: {
    city: 'Amalfi Coast',
    country: 'Italy',
    days: 3,
    pace: 'Relaxed Scenic Splendor',
    budgetEst: '$180/day (Boutique & Coastal)',
    highlights: ['Path of the Gods Trek', 'Positano Sunset Spritz', 'Ravello Clifftop Gardens', 'Emerald Grotto Swim'],
    daysData: [
      {
        dayNumber: 1,
        theme: 'Positano Pastel Cliffs & Beachside Spritz',
        items: [
          {
            time: '09:00 AM',
            title: 'Positano Village & Spiaggia Grande Walk',
            desc: 'Wander descending pebble alleys covered in wisteria, browsing linen boutiques and ceramics workshops.',
            category: 'scenic',
            tip: 'Wear sturdy flat sandals for navigating steep stone steps.',
          },
          {
            time: '01:00 PM',
            title: 'Seaside Trattoria: Scialatielli ai Frutti di Mare',
            desc: 'Fresh handmade Campania pasta tossed with local clams, mussels, and sweet cherry tomatoes.',
            category: 'food',
          },
          {
            time: '06:00 PM',
            title: 'Golden Hour Sunset Aperitivo',
            desc: 'Sip chilled Limoncello Spritz on a cliffside terrace as pink sunset lights envelop the coastline.',
            category: 'food',
          },
        ],
      },
      {
        dayNumber: 2,
        theme: 'Path of the Gods & Historic Amalfi Harbor',
        items: [
          {
            time: '08:30 AM',
            title: 'Sentiero degli Dei (Path of the Gods)',
            desc: 'Hike 6km along ancient cliff paths suspended between heaven and the sparkling Tyrrhenian Sea.',
            category: 'scenic',
            tip: 'Start in Bomerano and hike downwards toward Nocelle for easier grades.',
          },
          {
            time: '02:00 PM',
            title: 'Amalfi Town Duomo & Paper Museum',
            desc: 'Admire the 9th-century Arab-Norman cathedral and tour historic handmade cotton paper mills.',
            category: 'culture',
          },
        ],
      },
      {
        dayNumber: 3,
        theme: 'Ravello Clifftop Aristocracy & Villa Gardens',
        items: [
          {
            time: '10:00 AM',
            title: 'Villa Rufolo & Classical Garden Terraces',
            desc: 'Explore the 13th-century palace that inspired Wagner, with ancient pine trees framing deep blue sea views.',
            category: 'culture',
          },
          {
            time: '01:30 PM',
            title: 'Villa Cimbrone & The Terrace of Infinity',
            desc: 'Stand on the marble bust terrace 350 meters above the sea, overlooking the entire Gulf of Salerno.',
            category: 'scenic',
          },
        ],
      },
    ],
  },
  Paris: {
    city: 'Paris',
    country: 'France',
    days: 3,
    pace: 'Art & Gastronomy',
    budgetEst: '$140/day (Mid-Range)',
    highlights: ['Montmartre Bohemian Vibe', 'Louvre Masterpieces', 'Seine Golden Hour', 'Marais Hidden Patios'],
    daysData: [
      {
        dayNumber: 1,
        theme: 'Historic Bohemian Heart & Panoramic Views',
        items: [
          {
            time: '08:30 AM',
            title: 'Montmartre Cobblestones & Sacré-Cœur',
            desc: 'Climb the steps of the white basilica for early morning light over Paris rooftops, then explore quiet vineyard lanes.',
            category: 'scenic',
          },
          {
            time: '12:30 PM',
            title: 'Traditional Bistro Lunch in Le Marais',
            desc: 'Feast on steak frites, duck confit, or crisp falafel in the fashionable and historic aristocratic quarter.',
            category: 'food',
          },
          {
            time: '04:00 PM',
            title: 'Musée d’Orsay Impressionist Treasury',
            desc: 'Encounter Monet water lilies, Van Gogh portraits, and Renoir dances inside a converted Beaux-Arts railway terminal.',
            category: 'culture',
          },
          {
            time: '08:00 PM',
            title: 'Seine River Twilight Cruise with Champagne',
            desc: 'Watch the Eiffel Tower sparkle on the hour as illuminated gothic monuments drift by.',
            category: 'scenic',
          },
        ],
      },
      {
        dayNumber: 2,
        theme: 'Palatial Grandeur & Iconic Boulevards',
        items: [
          {
            time: '09:00 AM',
            title: 'The Louvre Wing: Sculptures & Renaissance',
            desc: 'Navigate straight to the Winged Victory of Samothrace and Dutch masters before afternoon museum tours.',
            category: 'attraction',
          },
          {
            time: '01:30 PM',
            title: 'Picnic in Jardin du Luxembourg',
            desc: 'Gather baguettes, Comté cheese, and fresh raspberries from local fromageries to dine by the Medici fountain.',
            category: 'food',
          },
          {
            time: '04:30 PM',
            title: 'Latin Quarter Bookshops & Saint-Germain',
            desc: 'Browse Shakespeare and Company, then sip espresso at historical literary haunt Café de Flore.',
            category: 'culture',
          },
        ],
      },
      {
        dayNumber: 3,
        theme: 'Modern Architecture & Architectural Wonders',
        items: [
          {
            time: '09:30 AM',
            title: 'Sainte-Chapelle 13th-Century Stained Glass',
            desc: 'Stand enclosed by 15-meter tall radiant jewel-toned glass windows recounting biblical epics.',
            category: 'culture',
          },
          {
            time: '01:00 PM',
            title: 'Canal Saint-Martin Boutiques & Bakery Treats',
            desc: 'Watch boat locks open while enjoying famous cardamom buns and natural wine from trendy neighborhood shops.',
            category: 'food',
          },
        ],
      },
    ],
  },
};

export const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({ onGenerateFullPdf, onExploreAudio }) => {
  const [selectedCity, setSelectedCity] = useState<'Kyoto' | 'Amalfi' | 'Paris'>('Kyoto');
  const [activeDay, setActiveDay] = useState(1);

  const itinerary = SAMPLE_ITINERARIES[selectedCity];
  const currentDayData = itinerary.daysData.find((d) => d.dayNumber === activeDay) || itinerary.daysData[0];

  return (
    <section className={styles.section} id="itinerary-preview">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badgePill}>
            <Sparkles size={13} color="#E8652B" />
            <span>Interactive Itinerary Blueprint</span>
          </div>
          <h2 className={styles.title}>What Your Day-by-Day Journey Looks Like</h2>
          <p className={styles.subtitle}>
            Explore realistic, verified daily routes built by our neural travel engine —
            with timed morning to evening milestones, curated culinary spots, and insider secrets.
          </p>

          {/* City switcher pill */}
          <div className={styles.citySwitcher}>
            <button
              type="button"
              className={`${styles.cityTab} ${selectedCity === 'Kyoto' ? styles.cityTabActive : ''}`}
              onClick={() => { setSelectedCity('Kyoto'); setActiveDay(1); }}
            >
              <span>⛩️ Kyoto (3 Days)</span>
            </button>
            <button
              type="button"
              className={`${styles.cityTab} ${selectedCity === 'Amalfi' ? styles.cityTabActive : ''}`}
              onClick={() => { setSelectedCity('Amalfi'); setActiveDay(1); }}
            >
              <span>🍋 Amalfi Coast (3 Days)</span>
            </button>
            <button
              type="button"
              className={`${styles.cityTab} ${selectedCity === 'Paris' ? styles.cityTabActive : ''}`}
              onClick={() => { setSelectedCity('Paris'); setActiveDay(1); }}
            >
              <span>🥐 Paris (3 Days)</span>
            </button>
          </div>
        </div>

        {/* Interactive Timeline Card */}
        <div className={styles.timelineCard}>
          {/* Card Top: Highlights Bar */}
          <div className={styles.topBar}>
            <div className={styles.topInfo}>
              <h3 className={styles.itineraryTitle}>
                {itinerary.days}-Day Itinerary: {itinerary.city}, {itinerary.country}
              </h3>
              <div className={styles.metaRow}>
                <span className={styles.paceTag}>
                  <Compass size={13} />
                  <span>{itinerary.pace}</span>
                </span>
                <span className={styles.budgetTag}>
                  <DollarSign size={13} />
                  <span>Est: {itinerary.budgetEst}</span>
                </span>
              </div>
            </div>

            <div className={styles.topActionGroup}>
              {onExploreAudio && (
                <button
                  type="button"
                  className="btn btn-ocean btn-sm"
                  onClick={() => onExploreAudio(itinerary.city)}
                >
                  <span>Listen Audio Guide</span>
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onGenerateFullPdf(itinerary.city, itinerary.days)}
              >
                <Download size={15} />
                <span>Download PDF Dossier</span>
              </button>
            </div>
          </div>

          {/* Day Navigation Tabs */}
          <div className={styles.dayTabs}>
            {itinerary.daysData.map((d) => (
              <button
                key={d.dayNumber}
                type="button"
                className={`${styles.dayTabBtn} ${activeDay === d.dayNumber ? styles.dayTabActive : ''}`}
                onClick={() => setActiveDay(d.dayNumber)}
              >
                <span className={styles.dayTabNum}>DAY 0{d.dayNumber}</span>
                <span className={styles.dayTabTheme}>{d.theme}</span>
              </button>
            ))}
          </div>

          {/* Timeline Items */}
          <div className={styles.timelineBody}>
            <div className={styles.themeBanner}>
              <span className={styles.themeLabel}>Day {currentDayData.dayNumber} Route Focus:</span>
              <span className={styles.themeTitle}>{currentDayData.theme}</span>
            </div>

            <div className={styles.timelineList}>
              {currentDayData.items.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  {/* Left Column: Time & Icon */}
                  <div className={styles.timeCol}>
                    <div className={styles.timeTag}>
                      <Clock size={12} />
                      <span>{item.time}</span>
                    </div>
                    <div className={styles.connectorLine} />
                  </div>

                  {/* Right Content Card */}
                  <div className={styles.itemContent}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <span className={`${styles.categoryBadge} ${styles[item.category]}`}>
                        {item.category === 'attraction' && '🏛️ Landmark'}
                        {item.category === 'food' && '🍜 Dining Spot'}
                        {item.category === 'culture' && '⛩️ Cultural Site'}
                        {item.category === 'scenic' && '🌿 Scenic Vista'}
                      </span>
                    </div>

                    <p className={styles.itemDesc}>{item.desc}</p>

                    {item.tip && (
                      <div className={styles.tipBox}>
                        <Sparkles size={13} color="#E8652B" />
                        <span><strong>Local Secret:</strong> {item.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
