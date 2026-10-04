import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Phone, MessageSquare, Globe, Search, Lightbulb, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CONTACTS, CONTINENT_MAP, CONTINENT_ALIASES,
  getStoredCountry, getNearestHotline, requestLocationCountry, getUserLocation,
  contactHref, isTextLine, dialHint,
} from '@/lib/crisisContacts';

export default function EmergencyContacts() {
  const [search, setSearch] = useState('');
  const [calling, setCalling] = useState(false);
  const [callError, setCallError] = useState('');
  const [hotline, setHotline] = useState(() => getNearestHotline());

  const getFiltered = () => {
    const q = search.toLowerCase().trim();
    if (!q) return CONTACTS;

    const continentKey = CONTINENT_ALIASES[q];
    if (continentKey !== undefined) {
      const countriesInContinent = CONTINENT_MAP[continentKey] || [];
      return CONTACTS.filter(
        (c) => c.continent === continentKey || countriesInContinent.includes(c.country)
      );
    }

    return CONTACTS.filter(
      (c) => c.country.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  };

  const filtered = getFiltered();

  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.country]) acc[c.country] = [];
    acc[c.country].push(c);
    return acc;
  }, {});

  // Default order: the user's own country first, then same continent, then the rest.
  const userLoc = getUserLocation();
  const firstIndex = {};
  CONTACTS.forEach((c, i) => { if (firstIndex[c.country] === undefined) firstIndex[c.country] = i; });
  const scoreCountry = (country) => {
    if (!userLoc) return 0;
    if (country === userLoc.country) return 0;
    if (country === 'International') return 1;
    const cont = CONTACTS.find((c) => c.country === country)?.continent;
    if (cont && userLoc.continent && cont === userLoc.continent) return 2;
    return 3;
  };
  const orderedEntries = Object.entries(grouped).sort((a, b) => {
    const diff = scoreCountry(a[0]) - scoreCountry(b[0]);
    return diff !== 0 ? diff : (firstIndex[a[0]] ?? 0) - (firstIndex[b[0]] ?? 0);
  });

  const handleCall = async () => {
    setCallError('');
    let country = getStoredCountry();
    if (!country) {
      setCalling(true);
      try {
        country = await requestLocationCountry();
      } catch {
        setCalling(false);
        setCallError("Couldn't get your location. Browse the list below to find your local line.");
        return;
      }
      setCalling(false);
    }
    const found = getNearestHotline(country);
    const href = found && contactHref(found.number);
    if (href) {
      setHotline(found);
      window.location.href = href;
    } else if (found && dialHint(found.number)) {
      // e.g. Chile's *4141 — the phone won't dial it from a link
      setCallError(`${found.name}: ${dialHint(found.number)}.`);
    } else {
      setCallError("We couldn't find a hotline for your location. Browse the list below.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6"
        >
          <p className="text-xs text-muted-foreground">Help is always available. Reach out.</p>
        </motion.div>

        {/* Need help — call nearest hotline */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleCall}
          disabled={calling}
          className="w-full bg-destructive text-destructive-foreground rounded-2xl p-5 mb-2 border border-destructive/30 shadow-sm flex items-center gap-3 hover:bg-destructive/90 transition-colors disabled:opacity-70"
        >
          <Phone className="w-6 h-6 shrink-0" />
          <div className="text-left flex-1">
            <p className="text-base font-bold">Need help? Tap here</p>
            <p className="text-xs opacity-90 mt-0.5">
              {calling
                ? 'Finding your nearest hotline…'
                : hotline
                ? `Call ${hotline.name}${hotline.number ? ` · ${hotline.number}` : ''}`
                : 'Calls the crisis hotline nearest you'}
            </p>
          </div>
        </motion.button>
        {hotline && (
          <p className="text-[11px] text-muted-foreground px-1 mb-4 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Based on your location
          </p>
        )}
        {callError && (
          <p className="text-xs text-destructive px-1 mb-4">{callError}</p>
        )}

        {/* Alternatives Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Link
            to="/alternatives"
            className="flex items-center gap-3 bg-primary/10 rounded-2xl p-4 border border-primary/20 hover:bg-primary/15 transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Looking for alternatives?</p>
              <p className="text-xs text-muted-foreground">Butterfly project, bracelet method, paper chain & more</p>
            </div>
            <span className="text-primary text-xs font-semibold">View →</span>
          </Link>
        </motion.div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by country, continent, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl h-11"
          />
        </div>
        <div className="mb-5" />

        {/* Contacts List */}
        <div className="space-y-6">
          {orderedEntries.map(([country, contacts]) => (
            <motion.div
              key={country}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-primary" />
                {country}
                {userLoc && country === userLoc.country && (
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> Nearest
                  </span>
                )}
              </h2>
              <div className="space-y-2">
                {contacts.map((c, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-3 border border-border/50 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    {c.number && !contactHref(c.number) && (
                      <p className="flex items-center gap-1.5 text-primary text-sm mt-1 font-medium select-all">
                        <Phone className="w-3.5 h-3.5" />
                        {c.number}
                      </p>
                    )}
                    {contactHref(c.number) && (
                      <a
                        href={contactHref(c.number)}
                        className="flex items-center gap-1.5 text-primary text-sm mt-1 font-medium"
                      >
                        {isTextLine(c.number)
                          ? <MessageSquare className="w-3.5 h-3.5" />
                          : <Phone className="w-3.5 h-3.5" />}
                        {c.number}
                      </a>
                    )}
                    {dialHint(c.number) && (
                      <p className="text-xs text-muted-foreground mt-0.5">{dialHint(c.number)}</p>
                    )}
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary mt-1 inline-block"
                      >
                        {c.website.replace('https://', '')}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}