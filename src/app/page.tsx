'use client';

import React, { useEffect, useState } from 'react';
import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryStrip } from '@/components/CategoryStrip';
import { DestinationsGrid } from '@/components/DestinationsGrid';
import { HowItWorks } from '@/components/HowItWorks';
import { TripPlannerForm } from '@/components/TripPlannerForm';
import { TripPlannerModal } from '@/components/TripPlannerModal';
import { StoryView } from '@/components/StoryView';
import { ChatbotDrawer } from '@/components/ChatbotDrawer';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { StoryLoadingOverlay } from '@/components/StoryLoadingOverlay';
import { ToastContainer, ToastItem } from '@/components/Toast';
import { api, Destination, Story } from '@/services/api';

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  // Trip planner state
  const [planCity, setPlanCity] = useState('Pune');
  const [planCountry, setPlanCountry] = useState('India');
  const [planDays, setPlanDays] = useState(5);

  // Story loading animation state
  const [loadingStoryCity, setLoadingStoryCity] = useState<string | null>(null);
  const [storyProgress, setStoryProgress] = useState(15);
  const [storyStage, setStoryStage] = useState('Curator Agent: Gathering authentic heritage spots & hidden chronicles...');

  // UI modal states
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
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

  // Load destinations from Render backend on mount
  useEffect(() => {
    api.getPopularDestinations().then((dists) => {
      setDestinations(dists);
    }).catch(() => {
      // Handled in api.ts fallback
    });
  }, []);

  // Fetch story & audio with responsive multi-stage loading animation
  const handleLoadStory = async (city: string, country = '') => {
    if (!city.trim()) return;

    setLoadingStoryCity(city);
    setStoryProgress(18);
    setStoryStage(`Curator Agent: Gathering cultural chronicles for ${city}...`);

    const pInterval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev < 40) {
          setStoryStage(`Curator Agent: Compiling historical landmarks & hidden gems...`);
          return prev + 6;
        } else if (prev < 75) {
          setStoryStage(`Audio Atelier: Synthesizing studio voice narrative...`);
          return prev + 3;
        } else if (prev < 94) {
          setStoryStage(`PDF Atelier: Preparing typography & high-definition dossier...`);
          return prev + 1.2;
        }
        return prev;
      });
    }, 280);

    try {
      const data = await api.getStory(city, country);
      setStoryProgress(100);
      clearInterval(pInterval);
      setTimeout(() => {
        setCurrentStory(data.story);
        setLoadingStoryCity(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 350);
    } catch (err: any) {
      clearInterval(pInterval);
      setLoadingStoryCity(null);
      addToast(err.message || 'Failed to load destination narrative', 'error');
    }
  };

  // Plan trip action: Opens the rich planner modal window
  const handlePlanDestination = (dest: Destination) => {
    setPlanCity(dest.city);
    setPlanCountry(dest.country);
    setIsPlannerModalOpen(true);
  };

  const handleStoryPlan = (city: string, country?: string) => {
    setPlanCity(city);
    if (country) setPlanCountry(country);
    setIsPlannerModalOpen(true);
  };

  return (
    <div id="top" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      {/* Fast Preloader */}
      <Preloader />

      {/* Clean Monochrome Navigation */}
      <Navbar
        onOpenChat={() => setIsChatOpen(true)}
        onNavigatePlan={() => {
          setIsPlannerModalOpen(true);
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
            {/* 1. Clear, Focused Hero */}
            <Hero
              onSearch={(city, country) => handleLoadStory(city, country)}
              onExplorePlan={(city, country, days) => {
                setPlanCity(city);
                if (country) setPlanCountry(country);
                if (days) setPlanDays(days);
                setIsPlannerModalOpen(true);
              }}
              onSelectStory={(city, country) => handleLoadStory(city, country)}
              isLoadingStory={Boolean(loadingStoryCity)}
            />

            {/* 2. Category Filter */}
            <CategoryStrip
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />

            {/* 3. Curated Destinations Grid */}
            <DestinationsGrid
              destinations={destinations}
              activeCategory={activeCategory}
              onSelectDestination={(dest) => handleLoadStory(dest.city, dest.country)}
              onPlanDestination={handlePlanDestination}
              onToast={addToast}
              loadingCity={loadingStoryCity}
            />

            {/* 4. How It Works: 3 Steps */}
            <HowItWorks />

            {/* 5. Custom Trip Planner Form */}
            <TripPlannerForm
              initialCity={planCity}
              initialCountry={planCountry}
              initialDays={planDays}
              onToast={addToast}
              onOpenModal={() => setIsPlannerModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* DEDICATED TRIP PLANNER WINDOW / MODAL WITH AUDIO BOOK & STORY OPTION */}
      <TripPlannerModal
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
        initialCity={planCity}
        initialCountry={planCountry}
        initialDays={planDays}
        onToast={addToast}
      />

      {/* AI Assistant Chat Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onToast={addToast}
      />

      {/* Clean Minimal Footer */}
      <Footer />

      {/* Supabase Authentication Modal */}
      <AuthModal />

      {/* Fullscreen Animated Story Loading Overlay */}
      {loadingStoryCity && (
        <StoryLoadingOverlay
          city={loadingStoryCity}
          stage={storyStage}
          progress={storyProgress}
        />
      )}

      {/* Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
