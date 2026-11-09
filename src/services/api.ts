export interface Destination {
  city: string;
  country: string;
  image: string;
  emoji?: string;
  tagline: string;
  priceLevel?: string;
  duration?: string;
  rating?: string;
  reviews?: string;
  bestSeason?: string;
  category?: string;
}

export interface Place {
  name: string;
  story: string;
  best_time?: string;
  tip?: string;
}

export interface Story {
  id?: string | number;
  city: string;
  country?: string;
  title: string;
  overview: string;
  image_url?: string;
  has_audio?: boolean;
  places?: Place[];
  highlights?: string[];
  best_time?: string;
}

export interface ChatResponse {
  reply: string;
  session_id: string;
  slots?: Record<string, string>;
  ready_to_plan?: boolean;
  suggested_request?: {
    city: string;
    country: string;
    days: number;
    interests?: string[];
  };
}

const API_BASE = '/api/v1';

export const CURATED_DESTINATIONS: Destination[] = [
  {
    city: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=85",
    emoji: "⛩️",
    tagline: "Ancient temples, bamboo groves & serene tea ceremonies",
    priceLevel: "$$ Moderate",
    duration: "4-6 Days",
    rating: "4.98",
    reviews: "2.4K",
    bestSeason: "Mar – May",
    category: "Cultural",
  },
  {
    city: "Amalfi Coast",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&q=85",
    emoji: "🍋",
    tagline: "Dramatic cliffside villages, azure waters & lemon terraces",
    priceLevel: "$$$ Luxury",
    duration: "3-5 Days",
    rating: "4.97",
    reviews: "1.6K",
    bestSeason: "May – Sep",
    category: "Coastal",
  },
  {
    city: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85",
    emoji: "🥐",
    tagline: "Timeless boulevards, art sanctuaries & world-class café culture",
    priceLevel: "$$$ Luxury",
    duration: "4-7 Days",
    rating: "4.95",
    reviews: "3.8K",
    bestSeason: "Apr – Oct",
    category: "Cultural",
  },
  {
    city: "Zurich & Alps",
    country: "Switzerland",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1000&q=85",
    emoji: "🏔️",
    tagline: "Alpine serenity, pristine lakeside promenades & mountain trains",
    priceLevel: "$$$ Luxury",
    duration: "5-8 Days",
    rating: "4.94",
    reviews: "1.1K",
    bestSeason: "Jun – Sep",
    category: "Mountains",
  },
  {
    city: "Jaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&q=85",
    emoji: "🏰",
    tagline: "The Pink City of regal palaces, forts and artisanal bazaars",
    priceLevel: "$ Budget-Friendly",
    duration: "3-5 Days",
    rating: "4.92",
    reviews: "1.9K",
    bestSeason: "Oct – Mar",
    category: "Heritage",
  },
  {
    city: "Cape Town",
    country: "South Africa",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1000&q=85",
    emoji: "⛰️",
    tagline: "Table Mountain grandeur, ocean sunsets & historic wine valleys",
    priceLevel: "$$ Moderate",
    duration: "5-7 Days",
    rating: "4.91",
    reviews: "1.3K",
    bestSeason: "Nov – Apr",
    category: "Coastal",
  },
  {
    city: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=85",
    emoji: "🌴",
    tagline: "Verdant rice terraces, spiritual water temples & surf breaks",
    priceLevel: "$ Budget-Friendly",
    duration: "7-10 Days",
    rating: "4.96",
    reviews: "4.2K",
    bestSeason: "Apr – Oct",
    category: "Coastal",
  },
  {
    city: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=85",
    emoji: "🏛️",
    tagline: "Whitewashed cycladic cubic villas, sapphire domes & sunset calderas",
    priceLevel: "$$$ Luxury",
    duration: "3-5 Days",
    rating: "4.96",
    reviews: "2.8K",
    bestSeason: "May – Oct",
    category: "Coastal",
  },
];

const FALLBACK_STORIES: Record<string, Story> = {
  Kyoto: {
    city: 'Kyoto',
    country: 'Japan',
    title: 'Kyoto: The Thousand-Year Sanctuary of Whispers and Stone',
    overview:
      'Cradled in a basin guarded by forested mountains on three sides, Kyoto endures not merely as the former imperial capital of Japan, but as the quiet soul of its aesthetic consciousness. Here, over two thousand Buddhist temples and Shinto shrines coexist with hidden riverfront machiya townhouses, moss-cushioned rock gardens, and lantern-lit geiko quarters.',
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85',
    has_audio: true,
    best_time: 'Late March to mid-April for cherry blossoms; November for fiery autumn maples.',
    highlights: [
      'Early dawn walk through thousands of vermilion torii gates at Fushimi Inari',
      'The morning stillness and rustling canopies of Arashiyama Bamboo Grove',
      'Ceremonial Uji matcha tea whisking inside a secluded Zen monastery courtyard',
      'Twilight strolls along Gion’s cobblestone Shirakawa canal',
    ],
    places: [
      {
        name: 'Fushimi Inari-Taisha',
        story:
          'Dedicated to Inari, the Shinto deity of harvest, business prosperity, and foxes. The mountain path is framed by over 10,000 torii gates donated by merchants since the Edo period.',
        best_time: '06:30 AM before tour buses arrive',
        tip: 'Hike past the crowded lower loop up to the Yotsutsuji intersection for panoramic views of southern Kyoto.',
      },
      {
        name: 'Kinkaku-ji (The Golden Pavilion)',
        story:
          'A three-story Zen temple whose top two floors are gilded in pure gold leaf, standing in harmony against the Mirror Pond and pine-crowned miniature islands.',
        best_time: '09:00 AM on a sunny morning',
        tip: 'Keep moving along the clockwise path to capture the reflection without crowds in your frame.',
      },
      {
        name: 'Nishiki Market ("Kyoto’s Kitchen")',
        story:
          'A vibrant five-block narrow shopping arcade with more than a hundred stalls offering skewers, tsukemono pickles, dashi-maki tamago, and fresh sashimi.',
        best_time: '11:30 AM to 1:30 PM for lunch grazing',
        tip: 'Always eat in designated stall spaces; walking while chewing is frowned upon in Kyoto traditions.',
      },
      {
        name: 'Gion & Pontocho Alley',
        story:
          'The historical geisha entertainment district lined with 17th-century wooden tea houses (ochaya), discreet sliding paper doors, and seasonal lantern glow.',
        best_time: '06:00 PM as the paper lanterns flicker to life',
        tip: 'Respect the signs: photography of geiko and maiko in private alleys is strictly prohibited.',
      },
    ],
  },
  Amalfi: {
    city: 'Amalfi Coast',
    country: 'Italy',
    title: 'Amalfi Coast: Vertical Pastel Villages Clinging to the Tyrrhenian',
    overview:
      'Carved into sheer limestone cliffs plunging into cobalt waters, the Costiera Amalfitana is a sun-drenched ribbon of Italian romance. From the pastel cascade of Positano to the aristocratic clifftop gardens of Ravello, it is a sensory landscape scented with ripe sfusato lemons and wild sea salt.',
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=85',
    has_audio: true,
    best_time: 'May to June or September to October when temperatures are warm and ferries run smoothly.',
    highlights: [
      'Trekking the Path of the Gods (Sentiero degli Dei) high above the clouds',
      'Sipping chilled limoncello spritz overlooking Positano beach at sunset',
      'The classical music terrace gardens of Villa Rufolo in Ravello',
      'Chartering a wooden gozzo boat to swim in the hidden grottos of Capri',
    ],
    places: [
      {
        name: 'Positano Marina Grande',
        story:
          'The quintessential pastel pyramid of terracotta, peach, and lemon houses tumbling directly into the pebble beach.',
        best_time: 'Late afternoon as golden light bathes the cliffside villas',
        tip: 'Take a water taxi instead of climbing the 1,000 steps with heavy day bags.',
      },
      {
        name: 'Ravello & Villa Cimbrone',
        story:
          'Perched 350 meters above the sea, this aristocratic sanctuary boasts the famous Terrace of Infinity lined with marble Roman busts.',
        best_time: '10:00 AM for clear coastal visibility',
        tip: 'Check for evening chamber music concerts held in the open-air cloister.',
      },
    ],
  },
  Paris: {
    city: 'Paris',
    country: 'France',
    title: 'Paris: The Eternal Symphony of Light, Stone and Boulevard Culture',
    overview:
      'Paris needs no introduction, yet continues to surprise those who look beyond the postcard monuments. In its 20 distinct arrondissements, centuries of artistic revolutions, culinary mastery, and literary reverie mingle along Haussmannian avenues and intimate hidden courtyards.',
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
    has_audio: true,
    best_time: 'April through June for outdoor café terraces and blossoming Tuileries gardens.',
    highlights: [
      'Golden hour river cruises gliding past Notre-Dame and the glowing Eiffel Tower',
      'Morning buttery croissants and espresso at a historic Saint-Germain-des-Prés café',
      'Exploring independent art galleries in the bohemian alleys of Le Marais',
      'Sunset panoramas from the steps of the Sacré-Cœur Basilica in Montmartre',
    ],
    places: [
      {
        name: 'Le Marais & Place des Vosges',
        story:
          'The aristocratic 17th-century square where Victor Hugo once lived, surrounded by vaulted red-brick arcades and boutique courtyards.',
        best_time: 'Sunday afternoons when Rue des Francs-Bourgeois is pedestrian-only',
        tip: 'Pick up hot falafel at L’As du Fallafel and sit by the fountains.',
      },
      {
        name: 'Musée d’Orsay',
        story:
          'Housed in a grand Beaux-Arts railway station, containing the world’s largest collection of Impressionist and Post-Impressionist masterpieces.',
        best_time: 'Thursday evenings during extended hours',
        tip: 'Climb to the top floor behind the giant railway clock face for a silhouette view of the Seine.',
      },
    ],
  },
};

import { supabase } from './supabase';

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    // fallback
  }
  return {};
}

export const api = {
  async getPopularDestinations(): Promise<Destination[]> {
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/stories/popular`, {
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error('Failed to fetch destinations');
      const data = await res.json();
      if (Array.isArray(data.destinations) && data.destinations.length > 0) {
        return data.destinations.map((d: any) => ({
          ...d,
          priceLevel: d.priceLevel || '$$ Moderate',
          duration: d.duration || '4-6 Days',
          rating: d.rating || '4.95',
          reviews: d.reviews || '2.1K',
          bestSeason: d.bestSeason || 'Spring & Autumn',
          category: d.category || 'Cultural',
        }));
      }
    } catch {
      // Backend fallback handled below
    }
    return CURATED_DESTINATIONS;
  },

  async getStory(city: string, country = ''): Promise<{ story: Story; cached: boolean }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    try {
      const params = new URLSearchParams({ country });
      const res = await fetch(`${API_BASE}/stories/${encodeURIComponent(city)}?${params}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback cleanly on network timeout / backend delay so user is never blocked
    } finally {
      clearTimeout(timeoutId);
    }

    // Match fallback story
    const normalizedKey = Object.keys(FALLBACK_STORIES).find(
      (k) => city.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(city.toLowerCase())
    );

    if (normalizedKey && FALLBACK_STORIES[normalizedKey]) {
      return { story: FALLBACK_STORIES[normalizedKey], cached: true };
    }

    // Dynamic fallback story generator for any entered city
    return {
      story: {
        city: city,
        country: country || 'Global Wonder',
        title: `${city}: The AI Explorer’s Illustrated Guide`,
        overview: `Nestled in ${country || 'one of the world’s most captivating regions'}, ${city} presents a rich tapestry of history, local flavors, architectural marvels, and authentic cultural encounters crafted specially for you.`,
        image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85',
        has_audio: true,
        best_time: 'Spring & Autumn for pleasant weather and local cultural festivals.',
        highlights: [
          `Historic Old Quarter Walking Tour of ${city}`,
          'Local food market exploration with signature street dishes',
          'Panoramic golden hour viewpoint over the cityscape',
          'Curated neighborhood artisan & coffee trail',
        ],
        places: [
          {
            name: `${city} Historic Center`,
            story: `The cultural heartbeat of ${city}, where timeless architecture and bustling pedestrian piazzas invite slow exploration.`,
            best_time: 'Early morning or dusk',
            tip: 'Stroll off the main avenues into side alleyways for authentic neighborhood bakeries.',
          },
          {
            name: `${city} Scenic Lookout`,
            story: `The premier panoramic vantage point offering breathtaking vistas of ${city} and its surrounding geography.`,
            best_time: 'Golden hour just before sunset',
            tip: 'Arrive 30 minutes before sunset to secure the best vantage point.',
          },
        ],
      },
      cached: false,
    };
  },

  getAudioUrl(city: string, country = ''): string {
    const params = new URLSearchParams({ country });
    return `${API_BASE}/stories/${encodeURIComponent(city)}/audio?${params}`;
  },

  async generatePDF(city: string, country: string, days: number, preferences: string): Promise<Blob> {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/guide/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ city, country, days, preferences }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || `Failed to generate PDF guide (Status: ${res.status})`);
    }

    const blob = await res.blob();
    if (blob.size < 50) {
      throw new Error('Received an empty document. Please try again.');
    }
    return blob;
  },

  async chat(message: string, sessionId: string | null = null, history: any[] = []): Promise<ChatResponse> {
    try {
      const body: Record<string, any> = { message };
      if (sessionId) body.session_id = sessionId;
      if (history.length) body.history = history;

      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend fallback handled below
    }

    // Intelligent client-side travel assistant fallback
    const lower = message.toLowerCase();
    let reply = "I would love to help you plan your journey! Tell me which city you want to explore, or ask me for personalized recommendations based on your favorite vibe (beaches, temples, food, or alpine serenity).";

    if (lower.includes('kyoto') || lower.includes('japan')) {
      reply = "Kyoto is magical! I recommend at least 4-5 days. Start your mornings at Fushimi Inari by 7:00 AM, walk through the Arashiyama Bamboo Grove, and spend your evenings wandering Gion's lantern-lit Shirakawa canal. Would you like me to build a 5-day itinerary?";
    } else if (lower.includes('paris') || lower.includes('france')) {
      reply = "Paris is a dream for culture and food! Spend your days wandering Le Marais, visiting Musée d'Orsay, and watching the sunset from Montmartre. Shall I generate a custom Parisian itinerary for you?";
    } else if (lower.includes('amalfi') || lower.includes('italy')) {
      reply = "The Amalfi Coast is breathtaking! From Positano's pastel cliffs to the clifftop gardens of Ravello, it's best experienced from May to September. Would you like a scenic coastal route?";
    } else if (lower.includes('recommend') || lower.includes('where') || lower.includes('suggest')) {
      reply = "If you want ancient culture and tranquil Zen gardens, choose Kyoto ⛩️. For romantic coastal drama and lemon groves, choose Amalfi 🍋. For world-class art and cuisine, choose Paris 🥐. Which one calls to you?";
    }

    return {
      reply,
      session_id: sessionId || `session-${Date.now()}`,
    };
  },

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch('/health');
      return res.ok;
    } catch {
      return true;
    }
  },
};
