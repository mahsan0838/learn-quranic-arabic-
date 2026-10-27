import { useSyncExternalStore } from 'react';
import type { Grade, Language, SrsMap } from '../types';
import { review, isKnown } from './srs';
import {
  XP,
  DAILY_GOAL,
  dateKey,
  levelFor,
  newlyEarned,
  streakFrom,
  type Badge,
  type Stats,
} from './gamification';
import { ALL_WORDS, coveragePercent } from './words';

export type Theme = 'auto' | 'night' | 'parchment';

export type Prefs = {
  theme: Theme;
  language: Language;
  installDismissed: boolean;
  welcomed: boolean;
};

export type GameState = {
  xp: number;
  reviewsTotal: number;
  perfectQuizzes: number;
  reviewsByDate: Record<string, number>; // flashcard reviews, drives the daily goal
  activity: Record<string, number>; // any study action, drives the streak
  goalAwardedOn: string | null;
  badges: string[];
};

export type QuizResult = { date: string; score: number; total: number; scope: string };

export type AppState = {
  srs: SrsMap;
  game: GameState;
  quizzes: QuizResult[];
  prefs: Prefs;
};

export type RewardResult = {
  id: number;
  xpGained: number;
  goalReached: boolean;
  newBadges: Badge[];
  leveledUp: boolean;
  level: number;
};

const STATE_KEY = 'quranvoc.state.v1';
const PREFS_KEY = 'quranvoc.prefs'; // also read by the inline script in index.html

const defaultPrefs: Prefs = { theme: 'auto', language: 'english', installDismissed: false, welcomed: false };
const defaultGame: GameState = {
  xp: 0,
  reviewsTotal: 0,
  perfectQuizzes: 0,
  reviewsByDate: {},
  activity: {},
  goalAwardedOn: null,
  badges: [],
};

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

const load = (): AppState => {
  const saved = readJson<Partial<AppState>>(STATE_KEY, {});
  return {
    srs: saved.srs ?? {},
    game: { ...defaultGame, ...saved.game },
    quizzes: saved.quizzes ?? [],
    prefs: readJson<Prefs>(PREFS_KEY, defaultPrefs),
  };
};

let state: AppState = load();
const listeners = new Set<() => void>();
const rewardListeners = new Set<(r: RewardResult) => void>();
let rewardCounter = 0;

const persist = () => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ srs: state.srs, game: state.game, quizzes: state.quizzes }));
    localStorage.setItem(PREFS_KEY, JSON.stringify(state.prefs));
  } catch {
    // Private mode or full storage: the session still works, it just won't be remembered.
  }
};

const commit = (next: AppState) => {
  state = next;
  persist();
  listeners.forEach((l) => l());
};

export const getState = () => state;
export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export const onReward = (l: (r: RewardResult) => void) => {
  rewardListeners.add(l);
  return () => {
    rewardListeners.delete(l);
  };
};

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

// ---- derived numbers -------------------------------------------------------

export const knownWords = (s: AppState) => ALL_WORDS.filter((w) => isKnown(s.srs[w.id]));

const statsFor = (s: AppState): Stats => {
  const known = knownWords(s);
  return {
    xp: s.game.xp,
    reviewsTotal: s.game.reviewsTotal,
    perfectQuizzes: s.game.perfectQuizzes,
    known: known.length,
    streak: streakFrom(s.game.activity).current,
    coveragePct: coveragePercent(known),
  };
};

export const dashboard = (s: AppState) => {
  const known = knownWords(s);
  const now = Date.now();
  const { current, longest } = streakFrom(s.game.activity);
  return {
    known,
    coverage: coveragePercent(known),
    streak: current,
    longestStreak: longest,
    dueCount: Object.values(s.srs).filter((x) => x.due <= now).length,
    newCount: ALL_WORDS.filter((w) => !s.srs[w.id]).length,
    reviewsToday: s.game.reviewsByDate[dateKey()] ?? 0,
    goal: DAILY_GOAL,
  };
};

// ---- actions ---------------------------------------------------------------

// Applies XP, the daily-goal bonus and badge checks to `next` (mutating its game copy).
const applyReward = (next: AppState, xpGained: number): RewardResult => {
  const before = levelFor(next.game.xp);
  next.game.xp += xpGained;
  const today = dateKey();
  let goalReached = false;
  if ((next.game.reviewsByDate[today] ?? 0) >= DAILY_GOAL && next.game.goalAwardedOn !== today) {
    next.game.goalAwardedOn = today;
    next.game.xp += XP.dailyGoal;
    xpGained += XP.dailyGoal;
    goalReached = true;
  }
  const newBadges = newlyEarned(statsFor(next), next.game.badges);
  next.game.badges = [...next.game.badges, ...newBadges.map((b) => b.id)];
  const result: RewardResult = {
    id: ++rewardCounter,
    xpGained,
    goalReached,
    newBadges,
    leveledUp: levelFor(next.game.xp) > before,
    level: levelFor(next.game.xp),
  };
  rewardListeners.forEach((l) => l(result));
  return result;
};

const touch = (game: GameState, key = dateKey()) => {
  game.activity = { ...game.activity, [key]: (game.activity[key] ?? 0) + 1 };
};

export const reviewWord = (wordId: number, grade: Grade): RewardResult => {
  const today = dateKey();
  const next: AppState = {
    ...state,
    srs: { ...state.srs, [wordId]: review(state.srs[wordId], grade) },
    game: { ...state.game },
  };
  next.game.reviewsTotal += 1;
  next.game.reviewsByDate = { ...next.game.reviewsByDate, [today]: (next.game.reviewsByDate[today] ?? 0) + 1 };
  touch(next.game, today);
  const result = applyReward(next, XP[grade]);
  commit(next);
  return result;
};

export const finishQuiz = (score: number, total: number, scope: string): RewardResult => {
  const perfect = total > 0 && score === total;
  const next: AppState = {
    ...state,
    game: { ...state.game },
    quizzes: [...state.quizzes, { date: new Date().toISOString(), score, total, scope }].slice(-200),
  };
  if (perfect) next.game.perfectQuizzes += 1;
  touch(next.game);
  const result = applyReward(next, score * XP.quizCorrect + (perfect ? XP.quizPerfect : 0));
  commit(next);
  return result;
};

// "I already know this" from the library: jumps straight to a known box.
export const markKnown = (wordId: number): RewardResult | null => {
  if (isKnown(state.srs[wordId])) return null;
  const next: AppState = {
    ...state,
    srs: { ...state.srs, [wordId]: review(review(undefined, 'easy'), 'easy') },
    game: { ...state.game },
  };
  touch(next.game);
  const result = applyReward(next, XP.learned);
  commit(next);
  return result;
};

export const setPrefs = (patch: Partial<Prefs>) => commit({ ...state, prefs: { ...state.prefs, ...patch } });

export const resetProgress = () =>
  commit({ srs: {}, game: { ...defaultGame }, quizzes: [], prefs: state.prefs });

export const quizAverage = (s: AppState): number =>
  s.quizzes.length ? Math.round((s.quizzes.reduce((sum, q) => sum + q.score / q.total, 0) / s.quizzes.length) * 100) : 0;
