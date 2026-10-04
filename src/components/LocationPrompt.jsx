import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { requestLocationCountry, markLocationAsked } from '@/lib/crisisContacts';

// Shown once on first login: explains why we ask for location and lets the
// user opt in to one-tap nearest-hotline calling.
export default function LocationPrompt({ onComplete }) {
  const [busy, setBusy] = useState(false);

  const handleShare = async () => {
    setBusy(true);
    try {
      await requestLocationCountry();
    } catch {
      /* best-effort — they can still browse helplines manually */
    } finally {
      markLocationAsked();   // only ever ask once, whatever the outcome
      setBusy(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    markLocationAsked();
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm px-6"
    >
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-card border border-border shadow-lg">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-3">One tap to help</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          If you ever need urgent support, Eir can call the crisis hotline nearest you with a single tap.
          To find your country, your approximate location (rounded to about 11 km) is checked once with a
          location lookup service. Only your country is kept, on this device — we never store or track where you are.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleShare}
            disabled={busy}
            className="w-full rounded-2xl h-12 text-sm font-semibold gap-2"
          >
            {busy ? 'Finding your nearest hotline…' : 'Share my location'}
          </Button>
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
          >
            Not now <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}