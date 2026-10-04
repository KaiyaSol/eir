// Global crisis helpline directory + location-aware nearest-hotline lookup.
import { Geolocation } from '@capacitor/geolocation';

export const CONTINENT_MAP = {
  asia: ['India', 'Japan', 'China', 'Hong Kong', 'South Korea', 'Philippines', 'Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Israel', 'Turkey', 'Vietnam', 'Myanmar', 'Cambodia', 'Taiwan'],
  europe: ['United Kingdom', 'Germany', 'France', 'Ireland', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Italy', 'Portugal', 'Russia', 'Ukraine', 'Poland', 'Belgium', 'Switzerland', 'Austria', 'Denmark', 'Finland', 'Greece', 'Hungary'],
  'north america': ['United States', 'Canada', 'Mexico', 'Guatemala', 'Cuba', 'Jamaica', 'Honduras', 'El Salvador', 'Costa Rica', 'Panama'],
  'south america': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay'],
  africa: ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Zimbabwe', 'Uganda', 'Ethiopia', 'Tanzania', 'Rwanda', 'Senegal', 'Cameroon', 'Zambia', 'Mozambique', 'Egypt', 'Morocco'],
  australia: ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji'],
  oceania: ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji'],
};

export const CONTACTS = [
  // International
  { country: 'International', continent: null, name: 'Befrienders Worldwide', number: '', website: 'https://befrienders.org' },
  { country: 'International', continent: null, name: 'Crisis Text Line', number: 'Text HOME to 741741', website: 'https://crisistextline.org' },

  // North America
  { country: 'United States', continent: 'north america', name: 'Suicide & Crisis Lifeline', number: '988', website: 'https://988lifeline.org' },
  { country: 'United States', continent: 'north america', name: 'Crisis Text Line', number: 'Text HOME to 741741', website: '' },
  { country: 'United States', continent: 'north america', name: 'SAMHSA National Helpline', number: '1-800-662-4357', website: '' },
  { country: 'United States', continent: 'north america', name: 'Trevor Project (LGBTQ+)', number: '1-866-488-7386', website: 'https://thetrevorproject.org' },
  { country: 'United States', continent: 'north america', name: 'Veterans Crisis Line', number: '988 (press 1)', website: '' },
  { country: 'Canada', continent: 'north america', name: 'Talk Suicide Canada', number: '988', website: 'https://talksuicide.ca' },
  { country: 'Canada', continent: 'north america', name: 'Crisis Text Line Canada', number: 'Text HOME to 686868', website: '' },
  { country: 'Canada', continent: 'north america', name: 'Kids Help Phone', number: '1-800-668-6868', website: '' },
  { country: 'Mexico', continent: 'north america', name: 'SAPTEL', number: '55 5259 8121', website: '' },
  { country: 'Mexico', continent: 'north america', name: 'IMSS Mental Health Line', number: '800 290 0024', website: '' },
  { country: 'Guatemala', continent: 'north america', name: 'APROFAM', number: '1543', website: '' },
  { country: 'Costa Rica', continent: 'north america', name: 'Centro de Crisis', number: '2272-3774', website: '' },
  { country: 'Cuba', continent: 'north america', name: 'Línea de Apoyo', number: '103', website: '' },
  { country: 'Honduras', continent: 'north america', name: 'PSIHOS', number: '2221-6406', website: '' },

  // South America
  { country: 'Brazil', continent: 'south america', name: 'CVV', number: '188', website: 'https://cvv.org.br' },
  { country: 'Brazil', continent: 'south america', name: 'CAPS Crisis Line', number: '156', website: '' },
  { country: 'Argentina', continent: 'south america', name: 'Centro de Asistencia al Suicida', number: '135', website: '' },
  { country: 'Argentina', continent: 'south america', name: 'SAME Buenos Aires', number: '107', website: '' },
  { country: 'Chile', continent: 'south america', name: 'Fono Salud Responde', number: '600 360 7777', website: '' },
  { country: 'Chile', continent: 'south america', name: 'Crisis Lifeline Chile', number: '800 200 818', website: '' },
  { country: 'Colombia', continent: 'south america', name: 'Línea 106', number: '106', website: '' },
  { country: 'Colombia', continent: 'south america', name: 'Salud Mental Colombia', number: '01-800-911-2727', website: '' },
  { country: 'Peru', continent: 'south america', name: 'Línea 113', number: '113', website: '' },
  { country: 'Venezuela', continent: 'south america', name: 'Centro de Crisis', number: '0800-FAMILIA', website: '' },
  { country: 'Ecuador', continent: 'south america', name: 'Línea de Crisis', number: '171', website: '' },
  { country: 'Bolivia', continent: 'south america', name: 'Línea de Apoyo', number: '800-10-4100', website: '' },
  { country: 'Uruguay', continent: 'south america', name: 'ASSE Crisis Line', number: '0800 0767', website: '' },
  { country: 'Paraguay', continent: 'south america', name: 'SOS Vida', number: '021-498-251', website: '' },

  // Europe
  { country: 'United Kingdom', continent: 'europe', name: 'Samaritans', number: '116 123', website: 'https://samaritans.org' },
  { country: 'United Kingdom', continent: 'europe', name: 'CALM', number: '0800 58 58 58', website: 'https://thecalmzone.net' },
  { country: 'United Kingdom', continent: 'europe', name: 'Papyrus (Under 35)', number: '0800 068 4141', website: '' },
  { country: 'United Kingdom', continent: 'europe', name: 'Mind Infoline', number: '0300 123 3393', website: '' },
  { country: 'Ireland', continent: 'europe', name: 'Samaritans Ireland', number: '116 123', website: '' },
  { country: 'Ireland', continent: 'europe', name: 'Pieta House', number: '1800 247 247', website: 'https://pieta.ie' },
  { country: 'Germany', continent: 'europe', name: 'Telefonseelsorge', number: '0800 111 0 111', website: '' },
  { country: 'Germany', continent: 'europe', name: 'Telefonseelsorge (alt)', number: '0800 111 0 222', website: '' },
  { country: 'France', continent: 'europe', name: 'SOS Amitié', number: '09 72 39 40 50', website: '' },
  { country: 'France', continent: 'europe', name: 'Numéro National Prévention Suicide', number: '3114', website: '' },
  { country: 'Spain', continent: 'europe', name: 'Teléfono de la Esperanza', number: '717 003 717', website: '' },
  { country: 'Spain', continent: 'europe', name: 'Teléfono de la Esperanza (Suicide)', number: '024', website: '' },
  { country: 'Netherlands', continent: 'europe', name: '113 Zelfmoordpreventie', number: '0900-0113', website: 'https://113.nl' },
  { country: 'Sweden', continent: 'europe', name: 'Mind Självmordslinjen', number: '90101', website: '' },
  { country: 'Norway', continent: 'europe', name: 'Mental Helse', number: '116 123', website: '' },
  { country: 'Italy', continent: 'europe', name: 'Telefono Amico', number: '02 2327 2327', website: '' },
  { country: 'Italy', continent: 'europe', name: 'Telefono Azzurro (Youth)', number: '19696', website: '' },
  { country: 'Portugal', continent: 'europe', name: 'SOS Voz Amiga', number: '213 544 545', website: '' },
  { country: 'Russia', continent: 'europe', name: 'Psychological Help Line', number: '8-800-2000-122', website: '' },
  { country: 'Ukraine', continent: 'europe', name: 'Lifeline Ukraine', number: '7333', website: '' },
  { country: 'Poland', continent: 'europe', name: 'Telefon Zaufania', number: '116 123', website: '' },
  { country: 'Belgium', continent: 'europe', name: 'Centrum ter Preventie van Zelfdoding', number: '0800 32 123', website: '' },
  { country: 'Switzerland', continent: 'europe', name: 'Die Dargebotene Hand', number: '143', website: '' },
  { country: 'Austria', continent: 'europe', name: 'Telefonseelsorge', number: '142', website: '' },
  { country: 'Denmark', continent: 'europe', name: 'Livslinjen', number: '70 201 201', website: '' },
  { country: 'Finland', continent: 'europe', name: 'Mieli Crisis Line', number: '09-2525-0111', website: '' },
  { country: 'Greece', continent: 'europe', name: 'Klimaka', number: '1018', website: '' },
  { country: 'Hungary', continent: 'europe', name: 'Lelki Elsősegély', number: '116 123', website: '' },
  { country: 'Turkey', continent: 'europe', name: 'Mental Health Line', number: '182', website: '' },

  // Asia
  { country: 'India', continent: 'asia', name: 'AASRA', number: '9820466726', website: '' },
  { country: 'India', continent: 'asia', name: 'iCall', number: '9152987821', website: '' },
  { country: 'India', continent: 'asia', name: 'Vandrevala Foundation', number: '1860-2662-345', website: '' },
  { country: 'Japan', continent: 'asia', name: 'TELL Lifeline', number: '03-5774-0992', website: '' },
  { country: 'Japan', continent: 'asia', name: 'Inochi no Denwa', number: '0120-783-556', website: '' },
  { country: 'China', continent: 'asia', name: 'Beijing Suicide Research Center', number: '010-82951332', website: '' },
  { country: 'China', continent: 'asia', name: 'Hope 24 Hotline', number: '400-161-9995', website: '' },
  { country: 'Hong Kong', continent: 'asia', name: 'Samaritans HK', number: '2389 2222', website: '' },
  { country: 'Hong Kong', continent: 'asia', name: 'The Samaritan Befrienders HK', number: '2382 0000', website: '' },
  { country: 'South Korea', continent: 'asia', name: 'Korea Suicide Prevention Center', number: '1393', website: '' },
  { country: 'South Korea', continent: 'asia', name: 'Korea Lifeline', number: '1588-9191', website: '' },
  { country: 'Philippines', continent: 'asia', name: 'Hopeline', number: '(02) 804-4673', website: '' },
  { country: 'Philippines', continent: 'asia', name: 'In Touch Crisis Line', number: '(02) 893-7603', website: '' },
  { country: 'Singapore', continent: 'asia', name: 'Samaritans of Singapore', number: '1-767', website: 'https://sos.org.sg' },
  { country: 'Singapore', continent: 'asia', name: 'IMH Mental Health Helpline', number: '6389-2222', website: '' },
  { country: 'Malaysia', continent: 'asia', name: 'Befrienders KL', number: '03-7956 8145', website: '' },
  { country: 'Malaysia', continent: 'asia', name: 'Talian Kasih', number: '15999', website: '' },
  { country: 'Thailand', continent: 'asia', name: 'Department of Mental Health', number: '1323', website: '' },
  { country: 'Indonesia', continent: 'asia', name: 'Into The Light', number: '119 ext 8', website: '' },
  { country: 'Pakistan', continent: 'asia', name: 'Umang Pakistan', number: '0317-4288665', website: '' },
  { country: 'Bangladesh', continent: 'asia', name: 'Kaan Pete Roi', number: '01779-554391', website: '' },
  { country: 'Sri Lanka', continent: 'asia', name: 'CCC Line', number: '1333', website: '' },
  { country: 'Nepal', continent: 'asia', name: 'TPO Nepal', number: '1660-01-11116', website: '' },
  { country: 'Israel', continent: 'asia', name: 'ERAN', number: '1201', website: '' },
  { country: 'Vietnam', continent: 'asia', name: 'Mental Health Hotline', number: '1800 599 920', website: '' },
  { country: 'Taiwan', continent: 'asia', name: 'Taiwan Suicide Prevention Hotline', number: '1925', website: '' },
  { country: 'Myanmar', continent: 'asia', name: 'Thabyay Foundation', number: '09-43130643', website: '' },

  // Africa
  { country: 'South Africa', continent: 'africa', name: 'SADAG', number: '0800 567 567', website: '' },
  { country: 'South Africa', continent: 'africa', name: 'Lifeline SA', number: '0861 322 322', website: '' },
  { country: 'South Africa', continent: 'africa', name: 'Suicide Crisis Line', number: '0800 819 014', website: '' },
  { country: 'Nigeria', continent: 'africa', name: 'NEEM Foundation', number: '08062263699', website: '' },
  { country: 'Nigeria', continent: 'africa', name: 'Mentally Aware Nigeria', number: '08091116264', website: '' },
  { country: 'Kenya', continent: 'africa', name: 'Befrienders Kenya', number: '0800 723 253', website: '' },
  { country: 'Kenya', continent: 'africa', name: 'Niskize Crisis Line', number: '0900 620 800', website: '' },
  { country: 'Ghana', continent: 'africa', name: 'Mental Health Authority', number: '0800-111-222', website: '' },
  { country: 'Zimbabwe', continent: 'africa', name: 'Befrienders Zimbabwe', number: '(04) 737 000', website: '' },
  { country: 'Uganda', continent: 'africa', name: 'Mental Health Uganda', number: '0800-212-121', website: '' },
  { country: 'Ethiopia', continent: 'africa', name: 'Mental Health Helpline', number: '8337', website: '' },
  { country: 'Tanzania', continent: 'africa', name: 'Crisis Line Tanzania', number: '116', website: '' },
  { country: 'Rwanda', continent: 'africa', name: 'RBC Mental Health Line', number: '114', website: '' },
  { country: 'Senegal', continent: 'africa', name: 'SOS Detresse', number: '33 889 15 15', website: '' },
  { country: 'Cameroon', continent: 'africa', name: 'Crisis Line Cameroon', number: '116', website: '' },
  { country: 'Zambia', continent: 'africa', name: 'Lifeline Zambia', number: '116', website: '' },
  { country: 'Morocco', continent: 'africa', name: 'Association Stop Suicide', number: '0801 003 003', website: '' },
  { country: 'Egypt', continent: 'africa', name: 'Nefsy Mental Health Line', number: '08008880700', website: '' },
  { country: 'Mozambique', continent: 'africa', name: 'Lifeline Mozambique', number: '116', website: '' },

  // Australia / Oceania
  { country: 'Australia', continent: 'australia', name: 'Lifeline Australia', number: '13 11 14', website: 'https://lifeline.org.au' },
  { country: 'Australia', continent: 'australia', name: 'Beyond Blue', number: '1300 22 4636', website: 'https://beyondblue.org.au' },
  { country: 'Australia', continent: 'australia', name: 'Kids Helpline', number: '1800 55 1800', website: '' },
  { country: 'Australia', continent: 'australia', name: 'Suicide Call Back Service', number: '1300 659 467', website: '' },
  { country: 'Australia', continent: 'australia', name: 'headspace', number: '1800 650 890', website: '' },
  { country: 'New Zealand', continent: 'australia', name: 'Lifeline NZ', number: '0800 543 354', website: '' },
  { country: 'New Zealand', continent: 'australia', name: 'Need to Talk?', number: '1737', website: '' },
  { country: 'New Zealand', continent: 'australia', name: 'Youthline', number: '0800 376 633', website: '' },
  { country: 'Papua New Guinea', continent: 'australia', name: 'PNG Crisis Line', number: '675 325 5654', website: '' },
  { country: 'Fiji', continent: 'australia', name: 'Lifeline Fiji', number: '132', website: '' },
];

export const CONTINENT_ALIASES = {
  'asia': 'asia',
  'asian': 'asia',
  'europe': 'europe',
  'european': 'europe',
  'north america': 'north america',
  'north american': 'north america',
  'central america': 'north america',
  'south america': 'south america',
  'south american': 'south america',
  'latin america': 'south america',
  'africa': 'africa',
  'african': 'africa',
  'australia': null,
  'oceania': 'australia',
  'pacific': 'australia',
};

// Maps reverse-geocode country names to the country labels used in CONTACTS.
const COUNTRY_ALIASES = {
  'united states of america': 'United States',
  'united states': 'United States',
  'usa': 'United States',
  'united kingdom': 'United Kingdom',
  'united kingdom of great britain and northern ireland': 'United Kingdom',
  'russian federation': 'Russia',
  'republic of korea': 'South Korea',
  'korea, republic of': 'South Korea',
  'south korea': 'South Korea',
  'viet nam': 'Vietnam',
  'vietnam': 'Vietnam',
  'republic of indonesia': 'Indonesia',
  'indonesia': 'Indonesia',
  'republic of ireland': 'Ireland',
  'ireland': 'Ireland',
  'republic of south africa': 'South Africa',
  'south africa': 'South Africa',
  "people's republic of china": 'China',
  'china': 'China',
  'hong kong sar': 'Hong Kong',
  'hong kong': 'Hong Kong',
  'taiwan': 'Taiwan',
  'republic of china': 'Taiwan',
  'new zealand': 'New Zealand',
  'australia': 'Australia',
};

const COUNTRY_KEY = 'faded-user-country';
const ASKED_KEY = 'faded-location-asked';

export function getStoredCountry() {
  return localStorage.getItem(COUNTRY_KEY) || null;
}

export function isLocationAsked() {
  return localStorage.getItem(ASKED_KEY) === '1';
}

export function markLocationAsked() {
  localStorage.setItem(ASKED_KEY, '1');
}

function normalizeCountry(raw) {
  if (!raw) return null;
  const key = raw.toLowerCase().trim();
  if (COUNTRY_ALIASES[key] !== undefined) return COUNTRY_ALIASES[key];
  return raw;
}

export function findHotlineByCountry(rawCountry) {
  const target = normalizeCountry(rawCountry);
  if (!target) return null;

  let matches = CONTACTS.filter((c) => c.country === target);
  if (matches.length === 0) {
    const t = target.toLowerCase();
    matches = CONTACTS.filter(
      (c) => c.country.toLowerCase().includes(t) || t.includes(c.country.toLowerCase())
    );
  }
  const callable = matches.find((c) => c.number && /\d/.test(c.number));
  return callable || matches[0] || null;
}

export function getNearestHotline(country) {
  return findHotlineByCountry(country || getStoredCountry());
}

// Returns the user's normalized country label (matching CONTACTS) and its continent, if known.
export function getUserLocation() {
  const country = normalizeCountry(getStoredCountry());
  if (!country) return null;
  const match = CONTACTS.find((c) => c.country === country);
  return { country, continent: match ? match.continent : null };
}

// Request the user's country via geolocation + a keyless reverse-geocode lookup.
// Stores the resolved country and marks the prompt as answered. Rejects on deny/failure.
// Uses the Capacitor plugin so iOS/Android show their native permission prompt
// (the WebView's navigator.geolocation is denied without one); on web the plugin
// falls back to navigator.geolocation.
export async function requestLocationCountry() {
  try {
    const pos = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false });
    const { latitude, longitude } = pos.coords;
    // Only the country is ever needed — round to ~11km so the lookup never
    // receives a precise location.
    const lat = Math.round(latitude * 10) / 10;
    const lon = Math.round(longitude * 10) / 10;
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await res.json();
    const country = data.countryName || null;
    if (country) localStorage.setItem(COUNTRY_KEY, country);
    return country;
  } finally {
    markLocationAsked();
  }
}