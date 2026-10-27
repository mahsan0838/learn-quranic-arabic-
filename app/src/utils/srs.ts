import type { Grade, SrsMap, SrsState, Word } from '../types';

// Leitner-style spaced repetition. A word moves up a box when remembered and
// back to box 0 when forgotten; each box has a review interval.
const DAY_MS = 24 * 60 * 60 * 1000;

export const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 8, 16, 32];
export const MAX_BOX = BOX_INTERVAL_DAYS.length - 1;

// A word counts as known once it has survived a review (box 2 = seen again after 2+ days).
export const KNOWN_BOX = 2;

const startOfDay = (time: number): number => {
  const d = new Date(time);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const review = (state: SrsState | undefined, grade: Grade, now: number = Date.now()): SrsState => {
  const box = state?.box ?? 0;
  let nextBox: number;
  if (grade === 'again') nextBox = 0;
  else if (grade === 'easy') nextBox = Math.min(box + 2, MAX_BOX);
  else nextBox = Math.min(box + 1, MAX_BOX);

  return {
    box: nextBox,
    due: nextBox === 0 ? now : startOfDay(now) + BOX_INTERVAL_DAYS[nextBox] * DAY_MS,
    reviews: (state?.reviews ?? 0) + 1,
    lapses: (state?.lapses ?? 0) + (grade === 'again' ? 1 : 0),
    lastReviewed: now,
  };
};

export const isDue = (state: SrsState | undefined, now: number = Date.now()): boolean =>
  !!state && state.due <= now;

export const isKnown = (state: SrsState | undefined): boolean => !!state && state.box >= KNOWN_BOX;

type SessionOptions = { size?: number; newLimit?: number; now?: number };

// Today's session: overdue words first (most overdue first), then new words
// in curriculum order, capped by `size` and `newLimit`.
export const buildSession = <T extends Pick<Word, 'id'>>(
  curriculum: T[],
  srsMap: SrsMap,
  { size = 20, newLimit = 10, now = Date.now() }: SessionOptions = {}
) => {
  const due = curriculum
    .filter((w) => isDue(srsMap[w.id], now))
    .sort((a, b) => srsMap[a.id].due - srsMap[b.id].due);
  const fresh = curriculum.filter((w) => !srsMap[w.id]);

  const dueCards = due.slice(0, size);
  const newCards = fresh.slice(0, Math.min(newLimit, size - dueCards.length));
  return { cards: [...dueCards, ...newCards], dueCount: due.length, newCount: fresh.length };
};
