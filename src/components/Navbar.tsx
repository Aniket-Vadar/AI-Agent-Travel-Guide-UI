'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Compass, User as UserIcon, LogOut, ChevronDown, Calendar } from 'lucide-react';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onOpenChat: () => void;
  onNavigatePlan: () => void;
  onNavigateStories: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, onNavigatePlan, onNavigateStories }) => {
  const { user, openAuthModal, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Traveler';

  const avatarInitial = (displayName[0] || 'T').toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <a href="#top" className={styles.brand}>
          <span className={styles.brandName}>WAYFARER</span>
          <span className={styles.brandBadge}>AI</span>
        </a>

        {/* Center Navigation */}
        <nav className={styles.navLinks}>
          <a
            href="#destinations"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              onNavigateStories();
            }}
          >
            Destinations
          </a>
          <a
            href="#how-it-works"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How It Works
          </a>
          <a
            href="#plan-trip"
            className={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              onNavigatePlan();
            }}
          >
            Trip Planner
          </a>
        </nav>

        {/* Right Action */}
        <div className={styles.rightGroup}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            <span>Concierge Active</span>
          </div>

          <button
            type="button"
            className={styles.chatBtn}
            onClick={onOpenChat}
            aria-label="Open AI Assistant"
          >
            <Sparkles size={14} />
            <span>Ask AI</span>
          </button>

          {/* Supabase Authentication */}
          {user ? (
            <div className={styles.userMenuWrap} ref={menuRef}>
              <button
                type="button"
                className={styles.userPill}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="User account menu"
              >
                <div className={styles.userAvatar}>
                  {avatarInitial}
                </div>
                <span className={styles.userName}>{displayName}</span>
                <ChevronDown size={13} className={`${styles.chevron} ${isMenuOpen ? styles.chevronOpen : ''}`} />
              </button>

              {isMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownUserLabel}>Signed in as</div>
                    <div className={styles.dropdownUserEmail}>{user.email}</div>
                  </div>

                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onNavigatePlan();
                    }}
                  >
                    <Calendar size={14} />
                    <span>Plan a Journey</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.dropdownSignOut}`}
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOut();
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className={styles.authBtn}
              onClick={() => openAuthModal('signin')}
            >
              <UserIcon size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
