/**
 * Fast City to Country auto-detection map and geocode resolver.
 * Instantly maps popular cities and falls back to Nominatim OSM for any global city.
 */

export const CITY_COUNTRY_DICTIONARY: Record<string, { country: string; flag: string }> = {
  // India
  pune: { country: "India", flag: "🇮🇳" },
  mumbai: { country: "India", flag: "🇮🇳" },
  delhi: { country: "India", flag: "🇮🇳" },
  "new delhi": { country: "India", flag: "🇮🇳" },
  bangalore: { country: "India", flag: "🇮🇳" },
  bengaluru: { country: "India", flag: "🇮🇳" },
  jaipur: { country: "India", flag: "🇮🇳" },
  goa: { country: "India", flag: "🇮🇳" },
  hyderabad: { country: "India", flag: "🇮🇳" },
  kolkata: { country: "India", flag: "🇮🇳" },
  chennai: { country: "India", flag: "🇮🇳" },
  ahmedabad: { country: "India", flag: "🇮🇳" },
  udaipur: { country: "India", flag: "🇮🇳" },
  varanasi: { country: "India", flag: "🇮🇳" },
  agra: { country: "India", flag: "🇮🇳" },
  kochi: { country: "India", flag: "🇮🇳" },
  amritsar: { country: "India", flag: "🇮🇳" },
  manali: { country: "India", flag: "🇮🇳" },
  shimla: { country: "India", flag: "🇮🇳" },
  rishikesh: { country: "India", flag: "🇮🇳" },

  // Japan
  kyoto: { country: "Japan", flag: "🇯🇵" },
  tokyo: { country: "Japan", flag: "🇯🇵" },
  osaka: { country: "Japan", flag: "🇯🇵" },
  nara: { country: "Japan", flag: "🇯🇵" },
  sapporo: { country: "Japan", flag: "🇯🇵" },
  hiroshima: { country: "Japan", flag: "🇯🇵" },
  fukuoka: { country: "Japan", flag: "🇯🇵" },
  yokohama: { country: "Japan", flag: "🇯🇵" },

  // France
  paris: { country: "France", flag: "🇫🇷" },
  nice: { country: "France", flag: "🇫🇷" },
  lyon: { country: "France", flag: "🇫🇷" },
  marseille: { country: "France", flag: "🇫🇷" },
  bordeaux: { country: "France", flag: "🇫🇷" },
  strasbourg: { country: "France", flag: "🇫🇷" },

  // Italy
  rome: { country: "Italy", flag: "🇮🇹" },
  milan: { country: "Italy", flag: "🇮🇹" },
  florence: { country: "Italy", flag: "🇮🇹" },
  venice: { country: "Italy", flag: "🇮🇹" },
  amalfi: { country: "Italy", flag: "🇮🇹" },
  "amalfi coast": { country: "Italy", flag: "🇮🇹" },
  naples: { country: "Italy", flag: "🇮🇹" },
  positano: { country: "Italy", flag: "🇮🇹" },

  // United Kingdom
  london: { country: "United Kingdom", flag: "🇬🇧" },
  edinburgh: { country: "United Kingdom", flag: "🇬🇧" },
  manchester: { country: "United Kingdom", flag: "🇬🇧" },
  oxford: { country: "United Kingdom", flag: "🇬🇧" },
  cambridge: { country: "United Kingdom", flag: "🇬🇧" },

  // United States
  "new york": { country: "United States", flag: "🇺🇸" },
  nyc: { country: "United States", flag: "🇺🇸" },
  "los angeles": { country: "United States", flag: "🇺🇸" },
  "san francisco": { country: "United States", flag: "🇺🇸" },
  chicago: { country: "United States", flag: "🇺🇸" },
  miami: { country: "United States", flag: "🇺🇸" },
  "las vegas": { country: "United States", flag: "🇺🇸" },
  seattle: { country: "United States", flag: "🇺🇸" },
  boston: { country: "United States", flag: "🇺🇸" },

  // UAE & Middle East
  dubai: { country: "United Arab Emirates", flag: "🇦🇪" },
  "abu dhabi": { country: "United Arab Emirates", flag: "🇦🇪" },
  doha: { country: "Qatar", flag: "🇶🇦" },

  // Thailand & SE Asia
  bangkok: { country: "Thailand", flag: "🇹🇭" },
  phuket: { country: "Thailand", flag: "🇹🇭" },
  "chiang mai": { country: "Thailand", flag: "🇹🇭" },
  bali: { country: "Indonesia", flag: "🇮🇩" },
  jakarta: { country: "Indonesia", flag: "🇮🇩" },
  singapore: { country: "Singapore", flag: "🇸🇬" },
  "kuala lumpur": { country: "Malaysia", flag: "🇲🇾" },
  hanoi: { country: "Vietnam", flag: "🇻🇳" },
  "ho chi minh city": { country: "Vietnam", flag: "🇻🇳" },

  // Switzerland & Europe
  zurich: { country: "Switzerland", flag: "🇨🇭" },
  geneva: { country: "Switzerland", flag: "🇨🇭" },
  interlaken: { country: "Switzerland", flag: "🇨🇭" },
  lucerne: { country: "Switzerland", flag: "🇨🇭" },
  "swiss alps": { country: "Switzerland", flag: "🇨🇭" },
  barcelona: { country: "Spain", flag: "🇪🇸" },
  madrid: { country: "Spain", flag: "🇪🇸" },
  seville: { country: "Spain", flag: "🇪🇸" },
  amsterdam: { country: "Netherlands", flag: "🇳🇱" },
  berlin: { country: "Germany", flag: "🇩🇪" },
  munich: { country: "Germany", flag: "🇩🇪" },
  vienna: { country: "Austria", flag: "🇦🇹" },
  prague: { country: "Czech Republic", flag: "🇨🇿" },
  budapest: { country: "Hungary", flag: "🇭🇺" },
  lisbon: { country: "Portugal", flag: "🇵🇹" },
  porto: { country: "Portugal", flag: "🇵🇹" },
  athens: { country: "Greece", flag: "🇬🇷" },
  santorini: { country: "Greece", flag: "🇬🇷" },
  istanbul: { country: "Turkey", flag: "🇹🇷" },

  // Australia & Americas
  sydney: { country: "Australia", flag: "🇦🇺" },
  melbourne: { country: "Australia", flag: "🇦🇺" },
  toronto: { country: "Canada", flag: "🇨🇦" },
  vancouver: { country: "Canada", flag: "🇨🇦" },
  montreal: { country: "Canada", flag: "🇨🇦" },
  cairo: { country: "Egypt", flag: "🇪🇬" },
  "cape town": { country: "South Africa", flag: "🇿🇦" },
  "rio de janeiro": { country: "Brazil", flag: "🇧🇷" },
};

/**
 * Fast synchronous lookup for instant zero-latency UX.
 */
export function lookupCityCountrySync(city: string): { country: string; flag: string } | null {
  const norm = city.trim().toLowerCase();
  if (!norm) return null;
  return CITY_COUNTRY_DICTIONARY[norm] || null;
}

/**
 * Async resolver: checks dictionary first, then falls back to OpenStreetMap Nominatim.
 */
export async function resolveCityCountry(city: string): Promise<{ country: string; flag?: string } | null> {
  const syncMatch = lookupCityCountrySync(city);
  if (syncMatch) return syncMatch;

  const q = city.trim();
  if (q.length < 3) return null;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(q)}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const items = await res.json();
    if (items && items.length > 0 && items[0].address?.country) {
      return { country: items[0].address.country };
    }
  } catch {
    // Network or rate-limiting fallback
  }

  return null;
}

