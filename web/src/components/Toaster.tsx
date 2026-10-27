import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { onReward, type RewardResult } from '../lib/store';
import { starPoints } from './Ornament';

const GOLDS = ['#f6e2ae', '#e0bd6c', '#b38a35', '#3cb08a', '#f4ecd8'];

// Small seeded PRNG so each burst is a pure function of its seed (no impure calls in render).
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const makePieces = (seed: number) => {
  const rand = rng(seed);
  return Array.from({ length: 34 }, (_, i) => ({
    id: i,
    x: (rand() - 0.5) * 520,
    y: -120 - rand() * 260,
    rot: rand() * 540 - 270,
    color: GOLDS[i % GOLDS.length],
    size: 8 + rand() * 9,
    delay: rand() * 0.15,
  }));
};

function Confetti({ seed }: { seed: number }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(() => makePieces(seed), [seed]);
  if (reduce) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <motion.svg
          key={p.id}
          width={p.size}
          height={p.size}
          viewBox="0 0 48 48"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 340], opacity: [1, 1, 0], rotate: p.rot, scale: 1 }}
          transition={{ duration: 1.9, delay: p.delay, ease: 'easeOut', times: [0, 0.4, 1] }}
        >
          <polygon points={starPoints(24, 24, 23, 15)} fill={p.color} />
        </motion.svg>
      ))}
    </div>
  );
}

type Toast = { key: number; lines: string[]; celebrate: boolean };

// Floats a small gold pill after each reward; level-ups and new badges get a full celebration.
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [celebration, setCelebration] = useState<{ key: number; title: string; sub: string; icon?: string } | null>(null);

  useEffect(
    () =>
      onReward((r: RewardResult) => {
        const lines = [`+${r.xpGained} XP`];
        if (r.goalReached) lines.push('Daily goal complete');
        const toast: Toast = { key: r.id, lines, celebrate: false };
        setToasts((t) => [...t.slice(-2), toast]);
        window.setTimeout(() => setToasts((t) => t.filter((x) => x.key !== r.id)), 2200);

        if (r.leveledUp) {
          setCelebration({ key: r.id, title: `Level ${r.level}`, sub: 'Your understanding deepens.' });
        } else if (r.newBadges.length) {
          const b = r.newBadges[0];
          setCelebration({ key: r.id, title: b.title, sub: b.description, icon: b.icon });
        }
      }),
    []
  );

  useEffect(() => {
    if (!celebration) return;
    const t = window.setTimeout(() => setCelebration(null), 3400);
    return () => window.clearTimeout(t);
  }, [celebration]);

  return (
    <>
      <div className="toasts" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.key}
              className="toast"
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              {t.lines.join(' · ')}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {celebration && (
          <motion.div
            key={celebration.key}
            className="celebrate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCelebration(null)}
          >
            <Confetti seed={celebration.key * 7919 + 13} />
            <motion.div
              className="celebrate-card"
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <div className="eyebrow">{celebration.icon ? 'Badge earned' : 'Level up'}</div>
              <div className="celebrate-emblem">{celebration.icon ?? '✦'}</div>
              <h3 className="display">{celebration.title}</h3>
              <p>{celebration.sub}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
