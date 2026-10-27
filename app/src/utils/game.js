import AsyncStorage from '@react-native-async-storage/async-storage';
import { review, isKnown, KNOWN_BOX } from './srs';
import { XP, DAILY_GOAL, dateKey, levelFor, newlyEarned } from './gamification';
import { updateStreak, getStreak, getLongestStreak, getProgress } from './storage';
import { ALL_WORDS, WORDS_BY_ID, coveragePercent } from '../data/words';

const KEYS = {
  SRS: '@quranvoc_srs',
  GAME: '@quranvoc_game',
};

const EMPTY_GAME = {
  xp: 0,
  reviewsTotal: 0,
  perfectQuizzes: 0,
  reviewsByDate: {},
  goalAwardedOn: null,
  badges: [],
};

// Every write goes through this queue so two quick taps can't overwrite each other.
let queue = Promise.resolve();
const serialize = (task) => {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
};

const readJson = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error('Error reading', key, error);
    return fallback;
  }
};

export const getSrsMap = () => readJson(KEYS.SRS, {});
export const getGame = async () => ({ ...EMPTY_GAME, ...(await readJson(KEYS.GAME, {})) });

const computeStats = async (game, srsMap) => {
  const knownWords = ALL_WORDS.filter((w) => isKnown(srsMap[w.id]));
  const progress = await getProgress();
  const learnedOnly = ALL_WORDS.filter((w) => !isKnown(srsMap[w.id]) && progress[w.id]);
  return {
    xp: game.xp,
    reviewsTotal: game.reviewsTotal,
    perfectQuizzes: game.perfectQuizzes,
    known: knownWords.length + learnedOnly.length,
    streak: await getStreak(),
    coveragePct: coveragePercent([...knownWords, ...learnedOnly]),
  };
};

// Applies XP, the daily-goal bonus and badge checks; mutates `game`.
const applyReward = async (game, srsMap, xpGained) => {
  const before = levelFor(game.xp);
  game.xp += xpGained;
  const today = dateKey();
  let goalReached = false;
  if ((game.reviewsByDate[today] ?? 0) >= DAILY_GOAL && game.goalAwardedOn !== today) {
    game.goalAwardedOn = today;
    game.xp += XP.dailyGoal;
    xpGained += XP.dailyGoal;
    goalReached = true;
  }
  const stats = await computeStats(game, srsMap);
  const badges = newlyEarned(stats, game.badges);
  game.badges = [...game.badges, ...badges.map((b) => b.id)];
  return {
    xpGained,
    goalReached,
    newBadges: badges,
    leveledUp: levelFor(game.xp) > before,
    level: levelFor(game.xp),
  };
};

// grade: 'again' | 'good' | 'easy'
export const recordReview = (wordId, grade) =>
  serialize(async () => {
    const [srsMap, game] = await Promise.all([getSrsMap(), getGame()]);
    srsMap[wordId] = review(srsMap[wordId], grade);
    const today = dateKey();
    game.reviewsTotal += 1;
    game.reviewsByDate[today] = (game.reviewsByDate[today] ?? 0) + 1;
    await updateStreak();
    const result = await applyReward(game, srsMap, XP[grade]);
    await AsyncStorage.multiSet([
      [KEYS.SRS, JSON.stringify(srsMap)],
      [KEYS.GAME, JSON.stringify(game)],
    ]);
    return result;
  });

export const recordQuiz = (score, total) =>
  serialize(async () => {
    const [srsMap, game] = await Promise.all([getSrsMap(), getGame()]);
    const perfect = total > 0 && score === total;
    if (perfect) game.perfectQuizzes += 1;
    await updateStreak();
    const result = await applyReward(game, srsMap, score * XP.quizCorrect + (perfect ? XP.quizPerfect : 0));
    await AsyncStorage.setItem(KEYS.GAME, JSON.stringify(game));
    return result;
  });

export const recordLearned = (wordId) =>
  serialize(async () => {
    const [srsMap, game] = await Promise.all([getSrsMap(), getGame()]);
    const result = await applyReward(game, srsMap, XP.learned);
    await AsyncStorage.setItem(KEYS.GAME, JSON.stringify(game));
    return result;
  });

export const getDashboard = async () => {
  const [srsMap, game] = await Promise.all([getSrsMap(), getGame()]);
  const stats = await computeStats(game, srsMap);
  const now = Date.now();
  return {
    ...stats,
    longestStreak: Math.max(await getLongestStreak(), stats.streak),
    dueCount: Object.values(srsMap).filter((s) => s.due <= now).length,
    newCount: ALL_WORDS.filter((w) => !srsMap[w.id]).length,
    reviewsToday: game.reviewsByDate[dateKey()] ?? 0,
    badges: game.badges,
    srsMap,
  };
};

export const resetGame = () => AsyncStorage.multiRemove([KEYS.SRS, KEYS.GAME]);

export { KNOWN_BOX, WORDS_BY_ID };
