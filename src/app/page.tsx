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

  // Fetch story & audio
  const handleLoadStory = async (city: string, country = '') => {
    try {
      addToast(`Loading cultural story for ${city}...`, 'info');
      const data = await api.getStory(city, country);
      setCurrentStory(data.story);
    } catch (err: any) {
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

      {/* Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
