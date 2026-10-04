import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Leaf, CalendarDays, Sparkles, MessageCircle, Phone, Palette, Heart, ChevronRight, X } from 'lucide-react';

const STEPS = [
  {
    icon: <Leaf className="w-12 h-12 text-primary" />,
    title: 'Welcome',
    description: "This is your safe space. A private app designed to help you track how you're feeling, find healthy outlets, and reach out when things get hard.",
  },
  {
    icon: <CalendarDays className="w-12 h-12 text-primary" />,
    title: 'Calendar',
    description: "Log your mood each day by tapping any date. You can choose multiple emotions, note what you used instead of self-harm, and journal your thoughts.",
  },
  {
    icon: <Sparkles className="w-12 h-12 text-primary" />,
    title: 'Activities',
    description: 'When urges hit, come here. You\'ll find calming activities like breathing exercises, a drawing pad, a memory game, and more to help you get through the moment.',
  },
  {
    icon: <MessageCircle className="w-12 h-12 text-primary" />,
    title: 'Vent',
    description: "Need to get something off your chest? Write it out here. No judgment — your vents are private, and only you can see them.",
  },
  {
    icon: <Phone className="w-12 h-12 text-primary" />,
    title: 'Help',
    description: "This tab holds emergency contacts, crisis lines, and a list of alternatives to self-harm. Whether you need to talk to someone or just find a safer outlet, it's all here.",
  },
  {
    icon: <Palette className="w-12 h-12 text-primary" />,
    title: 'Settings',
    description: 'Customise your accent colour, set your name, and manage your account here.',
  },
  {
    icon: <Heart className="w-12 h-12 text-primary" />,
    title: "You're all set",
    description: "Remember: you don't have to be okay all the time, and you don't have to go through this alone. This app is here for you.",
  },
];

export default function TutorialOverlay({ onComplete }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm px-6"
    >
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip <X className="w-3 h-3" />
      </button>

      <div className="w-full max-w-sm">
        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mb-10">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-card border border-border shadow-lg">
              {current.icon}
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{current.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex flex-col gap-3">
          <Button onClick={goNext} className="w-full rounded-2xl h-12 text-sm font-semibold gap-2">
            {isLast ? "Let's go" : 'Next'}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}