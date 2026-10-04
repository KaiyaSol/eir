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
  // Checked against findahelpline.com and official sources in October 2026.
  // Numbers change — re-check before each release.

  // International
  { country: 'International', continent: null, name: 'Find A Helpline', number: '', website: 'https://findahelpline.com' },
  { country: 'International', continent: null, name: 'Befrienders Worldwide', number: '', website: 'https://befrienders.org' },

  // North America
  { country: 'United States', continent: 'north america', name: '988 Suicide & Crisis Lifeline', number: '988', website: 'https://988lifeline.org' },
  { country: 'United States', continent: 'north america', name: 'Crisis Text Line', number: 'Text HOME to 741741', website: 'https://crisistextline.org' },
  { country: 'United States', continent: 'north america', name: 'SAMHSA National Helpline', number: '1-800-662-4357', website: '' },
  { country: 'United States', continent: 'north america', name: 'Trevor Project (LGBTQ+)', number: '1-866-488-7386', website: 'https://thetrevorproject.org' },
  { country: 'United States', continent: 'north america', name: 'Veterans Crisis Line', number: '988 (press 1)', website: '' },
  { country: 'Canada', continent: 'north america', name: '9-8-8 Suicide Crisis Helpline', number: '988', website: 'https://988.ca' },
  { country: 'Canada', continent: 'north america', name: 'Kids Help Phone', number: '1-800-668-6868', website: 'https://kidshelpphone.ca' },
  { country: 'Canada', continent: 'north america', name: 'Kids Help Phone (text)', number: 'Text CONNECT to 686868', website: '' },
  { country: 'Canada', continent: 'north america', name: 'Hope for Wellness (Indigenous peoples)', number: '1-855-242-3310', website: '' },
  { country: 'Mexico', continent: 'north america', name: 'Línea de la Vida', number: '800 911 2000', website: '' },
  { country: 'Mexico', continent: 'north america', name: 'SAPTEL', number: '55 5259 8121', website: '' },
  { country: 'Guatemala', continent: 'north america', name: 'Cruz Roja Guatemalteca', number: '125', website: '' },
  { country: 'Costa Rica', continent: 'north america', name: 'Línea Aquí Estoy', number: '800 273 7869', website: '' },
  { country: 'Cuba', continent: 'north america', name: 'Línea Confidencial', number: '103', website: '' },
  { country: 'Honduras', continent: 'north america', name: 'Teléfono de la Esperanza', number: '150', website: '' },

  // South America
  { country: 'Brazil', continent: 'south america', name: 'CVV – Centro de Valorização da Vida', number: '188', website: 'https://cvv.org.br' },
  { country: 'Argentina', continent: 'south america', name: 'Centro de Asistencia al Suicida', number: '0800 345 1435', website: '' },
  { country: 'Argentina', continent: 'south america', name: 'Línea de Salud Mental (Ministerio de Salud)', number: '0800-999-0091', website: '' },
  { country: 'Chile', continent: 'south america', name: 'Línea de Prevención del Suicidio', number: '*4141', website: '' },
  { country: 'Colombia', continent: 'south america', name: 'Línea 155 – SALVIA', number: '155', website: '' },
  { country: 'Colombia', continent: 'south america', name: 'Línea 106 (Bogotá)', number: '106', website: '' },
  { country: 'Peru', continent: 'south america', name: 'Línea 113 Salud', number: '113', website: '' },
  { country: 'Peru', continent: 'south america', name: 'La Voz Amiga', number: '0800 4 1212', website: '' },
  { country: 'Venezuela', continent: 'south america', name: 'LAPSI – Línea de Ayuda Psicológica', number: '0424 290 7338', website: '' },
  { country: 'Ecuador', continent: 'south america', name: 'Línea 171 Salud Mental', number: '171 (press 6)', website: '' },
  { country: 'Bolivia', continent: 'south america', name: 'Familia Segura', number: '800 11 30 40', website: '' },
  { country: 'Uruguay', continent: 'south america', name: 'Línea Nacional de Prevención del Suicidio', number: '0800 0767', website: '' },
  { country: 'Uruguay', continent: 'south america', name: 'Línea de Apoyo Emocional', number: '0800 1920', website: '' },
  { country: 'Paraguay', continent: 'south america', name: 'Línea 155 Te Escucha', number: '155', website: '' },

  // Europe
  { country: 'United Kingdom', continent: 'europe', name: 'Samaritans', number: '116 123', website: 'https://samaritans.org' },
  { country: 'United Kingdom', continent: 'europe', name: 'Shout', number: 'Text SHOUT to 85258', website: 'https://giveusashout.org' },
  { country: 'United Kingdom', continent: 'europe', name: 'CALM', number: '0800 58 58 58', website: 'https://thecalmzone.net' },
  { country: 'United Kingdom', continent: 'europe', name: 'Papyrus HOPELINE247 (under 35)', number: '0800 068 4141', website: '' },
  { country: 'United Kingdom', continent: 'europe', name: 'Childline (under 19)', number: '0800 1111', website: '' },
  { country: 'Ireland', continent: 'europe', name: 'Samaritans Ireland', number: '116 123', website: '' },
  { country: 'Ireland', continent: 'europe', name: 'Pieta', number: '1800 247 247', website: 'https://pieta.ie' },
  { country: 'Ireland', continent: 'europe', name: 'Text About It', number: 'Text HELLO to 50808', website: '' },
  { country: 'Germany', continent: 'europe', name: 'TelefonSeelsorge', number: '0800 111 0 111', website: '' },
  { country: 'Germany', continent: 'europe', name: 'TelefonSeelsorge (alt)', number: '0800 111 0 222', website: '' },
  { country: 'Germany', continent: 'europe', name: 'Nummer gegen Kummer (youth)', number: '116 111', website: '' },
  { country: 'France', continent: 'europe', name: '3114 – Numéro National de Prévention du Suicide', number: '3114', website: '' },
  { country: 'France', continent: 'europe', name: 'SOS Amitié', number: '09 72 39 40 50', website: '' },
  { country: 'Spain', continent: 'europe', name: 'Línea 024 (Suicide)', number: '024', website: '' },
  { country: 'Spain', continent: 'europe', name: 'Teléfono de la Esperanza', number: '717 003 717', website: '' },
  { country: 'Netherlands', continent: 'europe', name: '113 Zelfmoordpreventie', number: '113', website: 'https://113.nl' },
  { country: 'Netherlands', continent: 'europe', name: '113 Zelfmoordpreventie (free)', number: '0800 0113', website: '' },
  { country: 'Sweden', continent: 'europe', name: 'Mind Självmordslinjen', number: '90101', website: '' },
  { country: 'Norway', continent: 'europe', name: 'Mental Helse', number: '116 123', website: '' },
  { country: 'Norway', continent: 'europe', name: 'Kirkens SOS', number: '22 40 00 40', website: '' },
  { country: 'Italy', continent: 'europe', name: 'Telefono Amico', number: '02 2327 2327', website: '' },
  { country: 'Italy', continent: 'europe', name: 'Telefono Azzurro (youth)', number: '19696', website: '' },
  { country: 'Portugal', continent: 'europe', name: 'SNS 24 – Linha de Apoio Psicológico', number: '1411', website: '' },
  { country: 'Portugal', continent: 'europe', name: 'SOS Voz Amiga', number: '213 544 545', website: '' },
  { country: 'Russia', continent: 'europe', name: 'EMERCOM Psychological Help', number: '+7 495 989-50-50', website: '' },
  { country: 'Russia', continent: 'europe', name: 'Children\'s Helpline', number: '8-800-2000-122', website: '' },
  { country: 'Ukraine', continent: 'europe', name: 'Lifeline Ukraine', number: '7333', website: '' },
  { country: 'Ukraine', continent: 'europe', name: 'La Strada Youth Hotline', number: '0800 500 225', website: '' },
  { country: 'Poland', continent: 'europe', name: 'Telefon Zaufania 116 123', number: '116 123', website: '' },
  { country: 'Belgium', continent: 'europe', name: 'Centre de Prévention du Suicide (French)', number: '0800 32 123', website: '' },
  { country: 'Belgium', continent: 'europe', name: 'Zelfmoordlijn (Dutch)', number: '1813', website: '' },
  { country: 'Switzerland', continent: 'europe', name: 'Die Dargebotene Hand / La Main Tendue', number: '143', website: '' },
  { country: 'Austria', continent: 'europe', name: 'TelefonSeelsorge', number: '142', website: '' },
  { country: 'Denmark', continent: 'europe', name: 'Livslinien', number: '70 201 201', website: '' },
  { country: 'Finland', continent: 'europe', name: 'MIELI Crisis Line', number: '09 2525 0111', website: '' },
  { country: 'Greece', continent: 'europe', name: 'Klimaka Suicide Help Line', number: '1018', website: '' },
  { country: 'Hungary', continent: 'europe', name: 'Lelki Elsősegély', number: '116 123', website: '' },
  { country: 'Turkey', continent: 'europe', name: 'Emergency services', number: '112', website: '' },

  // Asia
  { country: 'India', continent: 'asia', name: 'Tele MANAS', number: '14416', website: '' },
  { country: 'India', continent: 'asia', name: 'AASRA', number: '+91 98204 66726', website: '' },
  { country: 'India', continent: 'asia', name: 'Vandrevala Foundation', number: '+91 9999 666 555', website: '' },
  { country: 'India', continent: 'asia', name: 'iCall', number: '+91 91529 87821', website: '' },
  { country: 'Japan', continent: 'asia', name: 'Kokoro no Kenko Sodan (national line)', number: '0570-064-556', website: '' },
  { country: 'Japan', continent: 'asia', name: 'Inochi no Denwa', number: '0120-783-556', website: '' },
  { country: 'Japan', continent: 'asia', name: 'TELL Lifeline (English)', number: '03-5774-0992', website: '' },
  { country: 'China', continent: 'asia', name: '12356 National Psychological Assistance Hotline', number: '12356', website: '' },
  { country: 'China', continent: 'asia', name: 'Hope 24 Hotline', number: '400-161-9995', website: '' },
  { country: 'China', continent: 'asia', name: 'Beijing Psychological Crisis Line', number: '010-82951332', website: '' },
  { country: 'Hong Kong', continent: 'asia', name: 'Suicide Prevention Services', number: '2382 0000', website: '' },
  { country: 'Hong Kong', continent: 'asia', name: 'Samaritan Befrienders (Cantonese)', number: '2389 2222', website: '' },
  { country: 'Hong Kong', continent: 'asia', name: 'The Samaritans (multilingual)', number: '2896 0000', website: '' },
  { country: 'South Korea', continent: 'asia', name: 'Suicide Prevention Hotline', number: '109', website: '' },
  { country: 'South Korea', continent: 'asia', name: 'Lifeline Korea', number: '1588-9191', website: '' },
  { country: 'Philippines', continent: 'asia', name: 'NCMH Crisis Hotline', number: '1800-1888-1553', website: '' },
  { country: 'Philippines', continent: 'asia', name: 'Hopeline', number: '(02) 8804-4673', website: '' },
  { country: 'Philippines', continent: 'asia', name: 'In Touch Crisis Line', number: '(02) 8893-7603', website: '' },
  { country: 'Singapore', continent: 'asia', name: 'Samaritans of Singapore', number: '1767', website: 'https://sos.org.sg' },
  { country: 'Singapore', continent: 'asia', name: 'National Mindline', number: '1771', website: '' },
  { country: 'Singapore', continent: 'asia', name: 'IMH Mental Health Helpline', number: '6389 2222', website: '' },
  { country: 'Malaysia', continent: 'asia', name: 'Talian HEAL', number: '15555', website: '' },
  { country: 'Malaysia', continent: 'asia', name: 'Befrienders KL', number: '03-7627 2929', website: '' },
  { country: 'Malaysia', continent: 'asia', name: 'Talian Kasih', number: '15999', website: '' },
  { country: 'Thailand', continent: 'asia', name: 'Department of Mental Health', number: '1323', website: '' },
  { country: 'Thailand', continent: 'asia', name: 'Samaritans of Thailand', number: '02-113-6789', website: '' },
  { country: 'Indonesia', continent: 'asia', name: 'Healing119 (Ministry of Health)', number: '119 ext 8', website: 'https://healing119.id' },
  { country: 'Pakistan', continent: 'asia', name: 'Rozan Counseling Helpline', number: '0304 111 1741', website: '' },
  { country: 'Bangladesh', continent: 'asia', name: 'Kaan Pete Roi', number: '+880 9612-119911', website: '' },
  { country: 'Bangladesh', continent: 'asia', name: 'Talk Hope', number: '+880 9638 881 888', website: '' },
  { country: 'Sri Lanka', continent: 'asia', name: 'CCC Line', number: '1333', website: '' },
  { country: 'Sri Lanka', continent: 'asia', name: 'National Mental Health Helpline', number: '1926', website: '' },
  { country: 'Nepal', continent: 'asia', name: 'Khabar Garaun Helpline', number: '1145', website: '' },
  { country: 'Nepal', continent: 'asia', name: 'TPO Nepal', number: '1660 0102005', website: '' },
  { country: 'Israel', continent: 'asia', name: 'ERAN', number: '1201', website: '' },
  { country: 'Vietnam', continent: 'asia', name: 'HOPE Suicide Prevention Hotline', number: '0865 044 400', website: '' },
  { country: 'Vietnam', continent: 'asia', name: 'Ngày Mai Hotline', number: '096 306 1414', website: '' },
  { country: 'Taiwan', continent: 'asia', name: '1925 Care Hotline', number: '1925', website: '' },
  { country: 'Taiwan', continent: 'asia', name: 'Lifeline Taiwan', number: '1995', website: '' },
  { country: 'Myanmar', continent: 'asia', name: 'Jue Jue\'s Safe Space', number: '', website: 'https://juejuessafespace.org' },

  // Africa
  { country: 'South Africa', continent: 'africa', name: 'SADAG Suicide Crisis Line', number: '0800 567 567', website: 'https://sadag.org' },
  { country: 'South Africa', continent: 'africa', name: 'Lifeline South Africa', number: '0861 322 322', website: '' },
  { country: 'Nigeria', continent: 'africa', name: 'SURPIN', number: '0800 078 7746', website: '' },
  { country: 'Nigeria', continent: 'africa', name: 'Mentally Aware Nigeria (MANI)', number: '0809 111 6264', website: '' },
  { country: 'Nigeria', continent: 'africa', name: 'Asido Foundation', number: '+234 902 808 0416', website: '' },
  { country: 'Kenya', continent: 'africa', name: 'Befrienders Kenya', number: '+254 722 178 177', website: '' },
  { country: 'Kenya', continent: 'africa', name: 'Childline Kenya (under 18)', number: '116', website: '' },
  { country: 'Ghana', continent: 'africa', name: 'National Mental Health & Suicide Prevention Helpline', number: '0800 678 678', website: '' },
  { country: 'Zimbabwe', continent: 'africa', name: 'Childline Zimbabwe (under 18)', number: '116', website: '' },
  { country: 'Tanzania', continent: 'africa', name: 'National Child Helpline (under 18)', number: '116', website: '' },
  { country: 'Zambia', continent: 'africa', name: 'Lifeline Zambia', number: '933', website: '' },
  { country: 'Zambia', continent: 'africa', name: 'Childline Zambia (under 18)', number: '116', website: '' },
  { country: 'Egypt', continent: 'africa', name: 'Mental Health Hotline (Ministry of Health)', number: '16328', website: '' },
  { country: 'Egypt', continent: 'africa', name: 'Mental Health & Addiction Hotline', number: '08008880700', website: '' },
  { country: 'Mozambique', continent: 'africa', name: 'Linha Fala Criança (under 18)', number: '116', website: '' },

  // Australia / Oceania
  { country: 'Australia', continent: 'australia', name: 'Lifeline Australia', number: '13 11 14', website: 'https://lifeline.org.au' },
  { country: 'Australia', continent: 'australia', name: 'Beyond Blue', number: '1300 22 4636', website: 'https://beyondblue.org.au' },
  { country: 'Australia', continent: 'australia', name: 'Kids Helpline', number: '1800 55 1800', website: '' },
  { country: 'Australia', continent: 'australia', name: 'Suicide Call Back Service', number: '1300 659 467', website: '' },
  { country: 'Australia', continent: 'australia', name: '13YARN (Aboriginal & Torres Strait Islander)', number: '13 92 76', website: '' },
  { country: 'New Zealand', continent: 'australia', name: 'Need to Talk?', number: '1737', website: '' },
  { country: 'New Zealand', continent: 'australia', name: 'Lifeline NZ', number: '0800 543 354', website: '' },
  { country: 'New Zealand', continent: 'australia', name: 'Suicide Crisis Helpline', number: '0508 828 865', website: '' },
  { country: 'New Zealand', continent: 'australia', name: 'Youthline', number: '0800 376 633', website: '' },
  { country: 'Papua New Guinea', continent: 'australia', name: '1-Tok Kaunselin Helpim Lain', number: '7150 8000', website: '' },
  { country: 'Fiji', continent: 'australia', name: 'Empower Pacific Counselling Helpline', number: '5626', website: '' },
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

const TEXT_LINE = /^text\s+(\S+)\s+to\s+([\d\s-]+)$/i;
const KEYPAD = { a: 2, b: 2, c: 2, d: 3, e: 3, f: 3, g: 4, h: 4, i: 4, j: 5, k: 5, l: 5, m: 6, n: 6, o: 6, p: 7, q: 7, r: 7, s: 7, t: 8, u: 8, v: 8, w: 9, x: 9, y: 9, z: 9 };

export function isTextLine(number) {
  return TEXT_LINE.test(number || '');
}

// Turns a directory number into a link the phone can act on. Text lines
// ("Text HOME to 741741") open Messages with the keyword filled in; extensions
// and menu options ("119 ext 8", "988 (press 1)") become a pause (`,`) followed
// by the digit; vanity letters ("0800-FAMILIA") map to keypad digits.
export function contactHref(number) {
  if (!number) return null;
  // Apple's Phone app refuses tel: links containing * or #, so these must be dialled by hand
  if (/[*#]/.test(number)) return null;
  const text = number.match(TEXT_LINE);
  if (text) return `sms:${text[2].replace(/\D/g, '')}?&body=${encodeURIComponent(text[1])}`;
  const dial = number
    .replace(/\s*(?:ext\.?|extension|\(press)\s*/gi, ',')
    .replace(/[a-z]/gi, (ch) => String(KEYPAD[ch.toLowerCase()]))
    .replace(/[^0-9+,]/g, '');
  return /\d/.test(dial) ? `tel:${dial}` : null;
}

// Spelled-out instructions for numbers with an extension or menu option. The
// `tel:` pause handles this in Apple's Phone app, but other calling apps (e.g.
// WhatsApp set as the default) drop it, so people may need to press it themselves.
export function dialHint(number) {
  if (/[*#]/.test(number || '')) return `Dial ${number} from your phone's keypad`;
  const m = (number || '').match(/^(.+?)\s*(?:ext\.?|extension|\(press)\s*(\d+)\)?$/i);
  return m ? `Call ${m[1]}, then press ${m[2]} when you hear the recording` : null;
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
  const callable = matches.find((c) => contactHref(c.number)?.startsWith('tel:'));
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