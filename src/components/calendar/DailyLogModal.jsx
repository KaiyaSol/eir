import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MOOD_OPTIONS = [
  { value: 1, label: 'Hopeless', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 2, label: 'Numb', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 3, label: 'Dissociated', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 21, label: 'Unsure', color: 'bg-slate-100 text-slate-600 border-slate-300' },
  { value: 4, label: 'Anxious', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 5, label: 'Sad', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { value: 6, label: 'Angry', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 7, label: 'Scared', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 8, label: 'Overwhelmed', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { value: 9, label: 'Restless', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 22, label: 'Tired', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { value: 23, label: 'Fidgety', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 10, label: 'Okay', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 11, label: 'Calm', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 12, label: 'Relieved', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { value: 13, label: 'Content', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 14, label: 'Hopeful', color: 'bg-lime-100 text-lime-700 border-lime-200' },
  { value: 15, label: 'Grateful', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { value: 16, label: 'Proud', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { value: 17, label: 'Loved', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 18, label: 'Joyful', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
  { value: 19, label: 'Happy', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 20, label: 'Excited', color: 'bg-orange-100 text-orange-700 border-orange-200' },
];

const ALTERNATIVE_SUGGESTIONS = [
  'Went for a walk', 'Called a friend', 'Art or crafts', 'Journaled',
  'Deep breathing', 'Listened to music', 'Took a bath', 'Held ice',
  'Exercised', 'Meditated', 'Watched a movie', 'Cooked something',
  'Played a game', 'Snapped a rubber band', 'Read a book',
  'Did a physical activity', 'Cried',
];

export default function DailyLogModal({ open, onClose, date, existingLog, onSave }) {
  const [moods, setMoods] = useState(existingLog?.moods || []);
  const [selfHarmed, setSelfHarmed] = useState(existingLog?.self_harmed || false);
  const [journal, setJournal] = useState(existingLog?.journal || '');
  const [alternatives, setAlternatives] = useState(existingLog?.alternatives_used || []);
  const [customAlt, setCustomAlt] = useState('');

  useEffect(() => {
    if (existingLog) {
      setMoods(existingLog.moods || (existingLog.mood ? [existingLog.mood] : []));
      setSelfHarmed(existingLog.self_harmed || false);
      setJournal(existingLog.journal || '');
      setAlternatives(existingLog.alternatives_used || []);
    } else {
      setMoods([]);
      setSelfHarmed(false);
      setJournal('');
      setAlternatives([]);
    }
  }, [existingLog, date]);

  const toggleMood = (value) => {
    setMoods(prev =>
      prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
    );
  };

  const toggleAlternative = (alt) => {
    setAlternatives(prev =>
      prev.includes(alt) ? prev.filter(a => a !== alt) : [...prev, alt]
    );
  };

  const addCustomAlternative = () => {
    if (customAlt.trim() && !alternatives.includes(customAlt.trim())) {
      setAlternatives(prev => [...prev, customAlt.trim()]);
      setCustomAlt('');
    }
  };

  const handleSave = () => {
    onSave({
      date: format(date, 'yyyy-MM-dd'),
      moods,
      self_harmed: selfHarmed,
      journal,
      alternatives_used: alternatives,
    });
    onClose();
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto text-foreground border border-border" style={{ backgroundColor: '#0a0a0a', color: 'hsl(var(--foreground))' }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {format(date, 'EEEE, MMMM d')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Mood */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">How are you feeling? <span className="text-muted-foreground font-normal">(select all that apply)</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {MOOD_OPTIONS.map(m => (
                <button
                  key={m.value}
                  onClick={() => toggleMood(m.value)}
                  className={`flex items-center justify-center p-2 rounded-xl border-2 transition-all ${
                    moods.includes(m.value) ? 'bg-primary text-primary-foreground border-primary scale-105' : 'border-transparent hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-[11px] font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Self Harm Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
            <Label className="text-sm font-semibold text-foreground">Did you self harm today?</Label>
            <button
              onClick={() => setSelfHarmed(!selfHarmed)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                selfHarmed ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-primary-foreground shadow transition-transform duration-200 ${
                  selfHarmed ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Alternatives */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">
              Alternatives you tried today
            </Label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {ALTERNATIVE_SUGGESTIONS.map(alt => (
                <Badge
                  key={alt}
                  variant={alternatives.includes(alt) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs py-1 px-2.5 transition-all"
                  onClick={() => toggleAlternative(alt)}
                >
                  {alt}
                </Badge>
              ))}
              {/* The user's own additions — selected by definition; tap to remove */}
              {alternatives.filter(alt => !ALTERNATIVE_SUGGESTIONS.includes(alt)).map(alt => (
                <Badge
                  key={alt}
                  variant="default"
                  className="cursor-pointer text-xs py-1 px-2.5 transition-all gap-1"
                  onClick={() => toggleAlternative(alt)}
                >
                  {alt}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add your own..."
                value={customAlt}
                onChange={e => setCustomAlt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomAlternative()}
                className="text-base"
              />
              <Button size="sm" variant="outline" onClick={addCustomAlternative}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Journal */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              Journal
            </Label>
            <Textarea
              placeholder="Write whatever is on your mind..."
              value={journal}
              onChange={e => setJournal(e.target.value)}
              className="min-h-[120px] text-base resize-none"
            />
          </div>

          <Button onClick={handleSave} className="w-full rounded-xl h-11 font-semibold">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}