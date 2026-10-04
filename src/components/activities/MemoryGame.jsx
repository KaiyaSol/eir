import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, Flame } from 'lucide-react';

// \uFE0E forces text (not emoji) rendering, so iOS draws the suits in the theme colour
const SYMBOLS = ['★', '♦\uFE0E', '♠\uFE0E', '♥\uFE0E', '◆', '▲', '●', '■'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const timeoutRef = useRef(null);

  const initGame = () => {
    const pairs = shuffle([...SYMBOLS, ...SYMBOLS]);
    setCards(pairs.map((symbol, i) => ({ id: i, symbol })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStreak(0);
  };

  useEffect(() => { initGame(); }, []);

  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched(prev => [...prev, first, second]);
        setStreak(s => s + 1);
        setFlipped([]);
      } else {
        setStreak(0);
        timeoutRef.current = setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const won = matched.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">Moves: <span className="font-bold text-foreground">{moves}</span></p>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-sm font-bold text-primary">
              <Flame className="w-4 h-4" />
              <span>{streak}</span>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={initGame} className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> New Game
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-[background-color,border-color,opacity] duration-300 font-bold ${
                isFlipped
                  ? 'bg-secondary border-2 border-primary/30 text-primary'
                  : 'bg-primary/10 border-2 border-transparent hover:bg-primary/20 text-transparent'
              } ${matched.includes(card.id) ? 'opacity-50' : ''}`}
            >
              {isFlipped ? card.symbol : '·'}
            </motion.button>
          );
        })}
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <p className="text-lg font-bold text-primary">Well done!</p>
          <p className="text-sm text-muted-foreground">Completed in {moves} moves</p>
        </motion.div>
      )}
    </div>
  );
}