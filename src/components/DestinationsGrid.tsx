'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Loader2,
  LayoutGrid,
  List,
  Search,
  Volume2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import styles from './DestinationsGrid.module.css';
import { Destination } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

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
  onToast,
  loadingCity = null,
}) => {
  const { user, openAuthModal } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterQuery, setFilterQuery] = useState('');

  const handleActionSelect = (dest: Destination) => {
    if (!user) {
      openAuthModal('signup');
      onToast?.('Account required: Please create a free account or sign in to listen to audio stories.', 'info');
      return;
    }
    onSelectDestination(dest);
  };

  const handleActionPlan = (dest: Destination) => {
    if (!user) {
      openAuthModal('signup');
      onToast?.('Account required: Please create a free account or sign in to compile itineraries & PDF guides.', 'info');
      return;
    }
    onPlanDestination(dest);
  };

  // Filter by category
  const categoryFiltered =
    activeCategory === 'All'
      ? destinations
      : destinations.filter((d) => {
          const cat = (d.category || '').toLowerCase();
          const tag = (d.tagline || '').toLowerCase();
          const query = activeCategory.toLowerCase();
          return cat.includes(query) || tag.includes(query);
        });

  // Filter by local text input
  const displayList = categoryFiltered.filter((d) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      d.city.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      (d.tagline || '').toLowerCase().includes(q)
    );
  });

  return (
    <section className={styles.section} id="destinations">
      <div className={styles.container}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div className={styles.titleCol}>
            <span className={styles.eyebrow}>Global Directory</span>
            <h2 className={styles.title}>Curated World Destinations</h2>
            <p className={styles.subtitle}>
              High-resolution cultural chronicles, neural audio broadcasts, and verified day-by-day itineraries.
            </p>
          </div>
        </div>

        {/* SaaS Controls Bar: Local Search & View Switcher */}
        <div className={styles.controlsRow}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.filterInput}
              placeholder="Filter destinations or countries..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>

          <div className={styles.viewSwitcher}>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'table' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('table')}
              title="Directory Table View"
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Grid */}
        {viewMode === 'grid' ? (
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
                      onClick={() => handleActionSelect(dest)}
                      disabled={Boolean(loadingCity)}
                      title={`Listen to neural story audio for ${dest.city}`}
                    >
                      {loadingCity?.toLowerCase() === dest.city.toLowerCase() ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} />
                          <span>Story & Audio</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className={styles.planCardBtn}
                      onClick={() => handleActionPlan(dest)}
                      title={`Compile itinerary for ${dest.city}`}
                    >
                      <Calendar size={14} />
                      <span>Plan Trip</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* View Mode 2: SaaS Table / Directory */
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Destination</th>
                  <th className={styles.th}>Region / Country</th>
                  <th className={styles.th}>Chronicle Focus</th>
                  <th className={styles.th}>Est. Duration</th>
                  <th className={styles.th}>Voice Studio</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayList.map((dest) => (
                  <tr key={dest.city} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.tableCityRow}>
                        <img
                          src={dest.image}
                          alt={dest.city}
                          className={styles.tableThumb}
                          loading="lazy"
                        />
                        <div>
                          <div className={styles.tableCityName}>{dest.city}</div>
                          <div className={styles.tableCountry}>{dest.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span style={{ fontSize: '0.84rem', color: '#52525B' }}>
                        {dest.country}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span style={{ fontSize: '0.84rem', color: '#52525B', maxWidth: '300px', display: 'inline-block' }}>
                        {dest.tagline}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#F4F4F5',
                        color: '#18181B',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {dest.duration || '4-6 Days'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#ECFDF5',
                        color: '#065F46',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Volume2 size={11} />
                        Neural Aria/Neerja
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div className={styles.tableActions} style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className={styles.tableActionBtn}
                          onClick={() => handleActionSelect(dest)}
                          disabled={Boolean(loadingCity)}
                        >
                          {loadingCity?.toLowerCase() === dest.city.toLowerCase() ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Volume2 size={13} />
                          )}
                          <span>Audio</span>
                        </button>
                        <button
                          type="button"
                          className={styles.tableActionBtn}
                          style={{ background: '#000000', color: '#FFFFFF', borderColor: '#000000' }}
                          onClick={() => handleActionPlan(dest)}
                        >
                          <Calendar size={13} />
                          <span>Plan Trip</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
