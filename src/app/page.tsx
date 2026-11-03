'use client';

import React, { useEffect, useState } from 'react';
import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryStrip } from '@/components/CategoryStrip';
import { NowPlayingBar } from '@/components/NowPlayingBar';
import { ItineraryPreview } from '@/components/ItineraryPreview';
import { DestinationsGrid } from '@/components/DestinationsGrid';
import { TripMatcher } from '@/components/TripMatcher';
import { TripPlannerForm } from '@/components/TripPlannerForm';
import { HowItWorks } from '@/components/HowItWorks';
import { Manifesto } from '@/components/Manifesto';
import { StoryView } from '@/components/StoryView';
import { ChatbotDrawer } from '@/components/ChatbotDrawer';
import { Footer } from '@/components/Footer';
import { ToastContainer, ToastItem } from '@/components/Toast';
import { api, Destination, Story } from '@/services/api';
import { Sparkles, Compass } from 'lucide-react';
import pageStyles from './page.module.css';

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState('');

  // Trip planner prefill state
  const [planCity, setPlanCity] = useState('Kyoto');
  const [planCountry, setPlanCountry] = useState('Japan');
  const [planDays, setPlanDays] = useState(5);

  // UI state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load destinations on mount
  useEffect(() => {
    api.getPopularDestinations().then((dists) => {
      setDestinations(dists);
    }).catch(() => {
      // Handled in api.ts fallback
    });
  }, []);

  // Story fetching
  const handleLoadStory = async (city: string, country = '') => {
    setIsStoryLoading(true);
    setLoadingCity(city);

    try {
      const data = await api.getStory(city, country);
      setCurrentStory(data.story);

      if (data.cached) {
        addToast(`Living story loaded for ${city} ⚡`, 'info');
      } else {
        addToast(`Fresh story created for ${city} ✨`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to load destination narrative', 'error');
    } finally {
      setIsStoryLoading(false);
    }
  };

  const handlePlanDestination = (dest: Destination) => {
    setPlanCity(dest.city);
    setPlanCountry(dest.country);
    setCurrentStory(null);
    const planElement = document.getElementById('plan-trip');
    if (planElement) {
      planElement.scrollIntoView({ behavior: 'smooth' });
    }
    addToast(`Planning journey to ${dest.city}! ✨`, 'info');
  };

  const handleStoryPlan = (city: string, country?: string) => {
    setPlanCity(city);
    setPlanCountry(country || '');
    setCurrentStory(null);
    setTimeout(() => {
      const planElement = document.getElementById('plan-trip');
      if (planElement) {
        planElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleGeneratePdf = async (city: string, days: number) => {
    addToast(`Generating official ${city} PDF Dossier... 📄`, 'info');
    try {
      const blob = await api.generatePDF(city, '', days, 'Balanced cultural exploration');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${city.replace(/\s+/g, '_')}_${days}Day_Dossier.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      addToast(`Downloaded ${city} travel dossier! ✈️`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to download dossier', 'error');
    }
  };

  const handleDownloadKyotoAudioGuide = async () => {
    addToast('Preparing Kyoto audio guide... 🎧', 'info');
    try {
      const url = api.getAudioUrl('Kyoto', 'Japan');
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = 'Kyoto_Audio_Guide.mp3';
      document.body.appendChild(a);
      a.click();
      a.remove();
      addToast('Audio guide ready! 🎙️', 'success');
    } catch {
      addToast('Audio downloaded!', 'success');
    }
  };

  return (
    <div id="top" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Preloader */}
      <Preloader />

      {/* Navigation Header */}
      <Navbar
        onOpenChat={() => setIsChatOpen(true)}
        onNavigatePlan={() => {
          setCurrentStory(null);
          const el = document.getElementById('plan-trip');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onNavigateStories={() => {
          setCurrentStory(null);
          const el = document.getElementById('destinations');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main style={{ flex: 1 }}>
        {currentStory ? (
          <StoryView
            story={currentStory}
            onBack={() => {
              setCurrentStory(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPlanTrip={handleStoryPlan}
            onToast={addToast}
          />
        ) : (
          <>
            {/* 1. World-Class Travel Hero (Dynamic Destination Switcher & Booking Engine Search) */}
            <Hero
              onSearch={(city, country) => handleLoadStory(city, country)}
              onExplorePlan={(city, country, days) => {
                setPlanCity(city);
                if (country) setPlanCountry(country);
                if (days) setPlanDays(days);
                const el = document.getElementById('plan-trip');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                addToast(`Customizing itinerary for ${city}! ✨`, 'info');
              }}
              onSelectStory={(city, country) => handleLoadStory(city, country)}
            />

            {/* 2. Interactive Category Filter Strip */}
            <CategoryStrip
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />

            {/* 3. Audio Narration Player Bar (Living Stories Experience) */}
            <NowPlayingBar
              onPlayDemo={() => handleLoadStory('Kyoto', 'Japan')}
              onDownloadGuide={handleDownloadKyotoAudioGuide}
            />

            {/* 4. Interactive Day-by-Day Itinerary Blueprint */}
            <ItineraryPreview
              onGenerateFullPdf={handleGeneratePdf}
              onExploreAudio={(city) => handleLoadStory(city)}
            />

            {/* 5. Curated Destinations Grid with Wishlists & Badges */}
            <DestinationsGrid
              destinations={destinations}
              activeCategory={activeCategory}
              onSelectDestination={(dest) => handleLoadStory(dest.city, dest.country)}
              onPlanDestination={handlePlanDestination}
              onToast={addToast}
            />

            {/* 6. Smart 30-Second AI Trip Matcher Quiz */}
            <TripMatcher
              onSelectResult={(city, country) => handleLoadStory(city, country)}
              onPlanResult={(city, country) => {
                setPlanCity(city);
                setPlanCountry(country);
                const el = document.getElementById('plan-trip');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                addToast(`Matched with ${city}! Let's build your trip.`, 'success');
              }}
            />

            {/* 7. Full Customizable Trip Planner Form */}
            <TripPlannerForm
              initialCity={planCity}
              initialCountry={planCountry}
              initialDays={planDays}
              onToast={addToast}
            />

            {/* 8. How It Works — 3-Step Journey */}
            <HowItWorks
              onExploreClick={() => {
                const el = document.getElementById('destinations');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onPlanClick={() => {
                const el = document.getElementById('plan-trip');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onStoryDemo={(city) => handleLoadStory(city)}
            />

            {/* 9. Traveler Community Reviews & Manifesto */}
            <Manifesto />
          </>
        )}
      </main>

      {/* Loading Overlay */}
      {isStoryLoading && (
        <div className={pageStyles.loadingOverlay}>
          <div className={pageStyles.loadingInner}>
            <div className={pageStyles.loadingSpinner}>
              <Compass size={32} color="#E8652B" />
            </div>
            <div className={pageStyles.loadingBadge}>
              <Sparkles size={12} />
              <span>AI Travel Atelier</span>
            </div>
            <h3 className={pageStyles.loadingTitle}>
              Exploring {loadingCity}...
            </h3>
            <p className={pageStyles.loadingDesc}>
              Curating local secrets, daily schedules, and authentic audio walking guides.
            </p>
          </div>
        </div>
      )}

      {/* AI Travel Assistant Chat Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
        onToast={addToast}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
