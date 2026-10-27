import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Grade, Word } from '../types';
import { buildSession } from '../lib/srs';
import { CURRICULUM, meaningOf, noteOf, sectionOf } from '../lib/words';
import { getState, reviewWord, useStore } from '../lib/store';
import { CountUp } from '../components/Ring';
import { Icon } from '../components/Icon';
import { WordForms } from '../components/WordForms';

const GRADES: { grade: Grade; label: string; hint: string; key: string }[] = [
  { grade: 'again', label: 'Again', hint: 'see it soon', key: '1' },
  { grade: 'good', label: 'Good', hint: 'next box', key: '2' },
  { grade: 'easy', label: 'Easy', hint: 'skip ahead', key: '3' },
];

const newSession = () => buildSession(CURRICULUM, getState().srs);

export function Study() {
  const language = useStore((s) => s.prefs.language);
  const [session, setSession] = useState(newSession);
  const [queue, setQueue] = useState<Word[]>(session.cards);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState({ cards: 0, again: 0, xp: 0 });
  const busy = useRef(false);

  const total = session.cards.length;
  const current = queue[0];
  const finished = total > 0 && queue.length === 0;

  const grade = useCallback(
    (g: Grade) => {
      if (busy.current || !current || !flipped) return;
      busy.current = true;
      const result = reviewWord(current.id, g);
      setDone((d) => ({ cards: d.cards + 1, again: d.again + (g === 'again' ? 1 : 0), xp: d.xp + result.xpGained }));
      setFlipped(false);
      // Missed cards come back at the end of this session.
      setQueue((q) => (g === 'again' ? [...q.slice(1), current] : q.slice(1)));
      window.setTimeout(() => {
        busy.current = false;
      }, 220);
    },
    [current, flipped]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      const hit = GRADES.find((x) => x.key === e.key);
      if (hit) grade(hit.grade);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [grade]);

  const restart = () => {
    const next = newSession();
    setSession(next);
    setQueue(next.cards);
    setFlipped(false);
    setDone({ cards: 0, again: 0, xp: 0 });
  };

  if (total === 0) {
    return (
      <div className="study-empty card card--glow">
        <p className="arabic big-ar" lang="ar">
          مَا شَاءَ ٱللَّهُ
        </p>
        <h1 className="display">You are all caught up.</h1>
        <p>Nothing is due right now. Test yourself with a quiz, or wander the library.</p>
        <div className="row">
          <a className="btn btn--gold" href="#/practice">
            Take a quiz
          </a>
          <a className="btn btn--ghost" href="#/library">
            Open the library
          </a>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <motion.div className="study-empty card card--glow" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <p className="eyebrow">Session complete</p>
        <h1 className="display">
          <CountUp value={done.cards} /> cards, <CountUp value={done.xp} /> XP.
        </h1>
        <p>
          {done.again === 0
            ? 'Flawless. Every card was recalled.'
            : `${done.again} ${done.again === 1 ? 'card' : 'cards'} will return soon, which is exactly how memory is built.`}
        </p>
        <div className="row">
          <button type="button" className="btn btn--gold" onClick={restart}>
            Another session
          </button>
          <a className="btn btn--ghost" href="#/today">
            Back to today
          </a>
        </div>
      </motion.div>
    );
  }

  const progress = (total - queue.length) / total;

  return (
    <div className="study">
      <header className="study-head">
        <div>
          <p className="eyebrow">Today’s session</p>
          <p className="num study-count">
            {queue.length} {queue.length === 1 ? 'card' : 'cards'} left
          </p>
        </div>
        <div className="bar bar--wide">
          <motion.i animate={{ width: `${progress * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
      </header>

      <div className="scene">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.button
            key={`${current.id}-${queue.length}`}
            type="button"
            className="flip"
            onClick={() => setFlipped((f) => !f)}
            initial={{ opacity: 0, x: 60, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -70, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            aria-label={flipped ? 'Flip card to the Arabic' : 'Reveal the meaning'}
          >
            <motion.div
              className="flip-inner"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 22 }}
            >
              <div className="face face--front">
                <span className="eyebrow">{sectionOf(current)}</span>
                <span className="arabic face-ar" lang="ar">
                  {current.arabic}
                </span>
                <span className="face-hint">Tap or press Space to reveal</span>
              </div>
              <div className="face face--back">
                <span className="arabic face-ar face-ar--sm" lang="ar">
                  {current.arabic}
                </span>
                <span className="face-meaning display">{meaningOf(current, language)}</span>
                {noteOf(current) && <span className="face-note">{noteOf(current)}</span>}
                {current.frequency != null && (
                  <span className="face-freq">
                    appears <b className="num">{current.frequency}</b> times in the Qur’an
                  </span>
                )}
                {current.forms && <WordForms forms={current.forms} compact />}
              </div>
            </motion.div>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="grades" aria-hidden={!flipped}>
        {flipped ? (
          GRADES.map((g) => (
            <button key={g.grade} type="button" className={`grade grade--${g.grade}`} onClick={() => grade(g.grade)}>
              <span className="grade-label">{g.label}</span>
              <span className="grade-hint">{g.hint}</span>
              <kbd>{g.key}</kbd>
            </button>
          ))
        ) : (
          <button type="button" className="btn btn--gold btn--wide" onClick={() => setFlipped(true)}>
            <Icon name="sparkle" size={18} /> Show meaning
          </button>
        )}
      </div>
    </div>
  );
}
