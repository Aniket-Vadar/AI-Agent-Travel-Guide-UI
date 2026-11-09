'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Calendar,
  Volume2,
  Compass,
  ArrowRight,
  User,
  Zap,
} from 'lucide-react';
import styles from './CommandPalette.module.css';
import { useAuth } from '@/context/AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStory: (city: string, country?: string) => void;
  onOpenPlan: (city: string, country?: string) => void;
  onOpenChat: () => void;
}

const DESTINATIONS = [
  { city: 'Pune', country: 'India', badge: 'Cultural Hub' },
  { city: 'Kyoto', country: 'Japan', badge: 'Ancient Temples' },
  { city: 'Paris', country: 'France', badge: 'Culinary & Art' },
  { city: 'Amalfi Coast', country: 'Italy', badge: 'Scenic Coastal' },
  { city: 'Swiss Alps', country: 'Switzerland', badge: 'Alpine Peaks' },
  { city: 'Bali', country: 'Indonesia', badge: 'Tropical Temples' },
  { city: 'Goa', country: 'India', badge: 'Coastal Heritage' },
  { city: 'Rome', country: 'Italy', badge: 'Imperial History' },
  { city: 'Tokyo', country: 'Japan', badge: 'Futuristic Capital' },
  { city: 'Manali', country: 'India', badge: 'Himalayan Escape' },
  { city: 'Mumbai', country: 'India', badge: 'Metropolis' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectStory,
  onOpenPlan,
  onOpenChat,
}) => {
  const { user, openAuthModal } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDestinations = DESTINATIONS.filter(
    (d) =>
      d.city.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase()) ||
      d.badge.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectCity = (city: string, country: string, mode: 'story' | 'plan') => {
    onClose();
    if (mode === 'story') {
      onSelectStory(city, country);
    } else {
      onOpenPlan(city, country);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className={styles.searchRow}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Type a city or command (e.g. Pune, Kyoto, Plan, Ask AI)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className={styles.escBadge}>ESC</span>
        </div>

        {/* Results List */}
        <div className={styles.list}>
          {/* Quick System Actions */}
          {(!query || 'chat ask ai concierge'.includes(query.toLowerCase())) && (
            <div>
              <div className={styles.sectionHeader}>Quick Actions</div>
              <button
                type="button"
                className={styles.item}
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
              >
                <div className={styles.itemLeft}>
                  <div className={styles.itemIcon}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className={styles.itemTitle}>Ask Wayfarer Concierge</span>
                    <span className={styles.itemSubtitle}>Interactive AI travel assistant</span>
                  </div>
                </div>
                <span className={styles.itemTag}>Assistant</span>
              </button>

              <button
                type="button"
                className={styles.item}
                onClick={() => {
                  onClose();
                  onOpenPlan('Kyoto', 'Japan');
                }}
              >
                <div className={styles.itemLeft}>
                  <div className={styles.itemIcon}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className={styles.itemTitle}>Launch Itinerary Studio</span>
                    <span className={styles.itemSubtitle}>Build custom day-by-day plan & PDF</span>
                  </div>
                </div>
                <span className={styles.itemTag}>Builder</span>
              </button>

              {!user && (
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => {
                    onClose();
                    openAuthModal('signin');
                  }}
                >
                  <div className={styles.itemLeft}>
                    <div className={styles.itemIcon}>
                      <User size={16} />
                    </div>
                    <div>
                      <span className={styles.itemTitle}>Sign In / Create Account</span>
                      <span className={styles.itemSubtitle}>Supabase Authentication</span>
                    </div>
                  </div>
                  <span className={styles.itemTag}>Account</span>
                </button>
              )}
            </div>
          )}

          {/* Destinations Matches */}
          <div className={styles.sectionHeader}>
            {filteredDestinations.length > 0 ? 'Destinations Directory' : 'No Destinations Found'}
          </div>

          {filteredDestinations.map((d) => (
            <div key={d.city} style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                className={styles.item}
                onClick={() => handleSelectCity(d.city, d.country, 'story')}
                title={`Read story & listen to audio for ${d.city}`}
              >
                <div className={styles.itemLeft}>
                  <div className={styles.itemIcon}>
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <span className={styles.itemTitle}>{d.city}</span>
                    <span className={styles.itemSubtitle}>{d.country} • {d.badge}</span>
                  </div>
                </div>
                <span className={styles.itemTag}>Voice & Story</span>
              </button>

              <button
                type="button"
                className={styles.item}
                style={{ width: 'auto', padding: '10px 14px', flexShrink: 0 }}
                onClick={() => handleSelectCity(d.city, d.country, 'plan')}
                title={`Plan trip for ${d.city}`}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Plan Trip →</span>
              </button>
            </div>
          ))}

          {/* Custom query fallback */}
          {query.trim() && filteredDestinations.length === 0 && (
            <button
              type="button"
              className={styles.item}
              onClick={() => handleSelectCity(query.trim(), '', 'plan')}
            >
              <div className={styles.itemLeft}>
                <div className={styles.itemIcon}>
                  <Zap size={16} />
                </div>
                <div>
                  <span className={styles.itemTitle}>Generate Custom Dossier for &quot;{query}&quot;</span>
                  <span className={styles.itemSubtitle}>Multi-agent compilation</span>
                </div>
              </div>
              <span className={styles.itemTag}>Custom City</span>
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className={styles.footer}>
          <div className={styles.footerHints}>
            <span className={styles.hintItem}>
              <span className={styles.escBadge}>↵</span> to select
            </span>
            <span className={styles.hintItem}>
              <span className={styles.escBadge}>esc</span> to dismiss
            </span>
          </div>
          <span>Wayfarer AI Studio</span>
        </div>
      </div>
    </div>
  );
};
