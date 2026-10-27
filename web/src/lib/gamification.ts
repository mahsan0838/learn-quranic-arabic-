// Pure rules for XP, levels, daily goal and badges. No storage here.
export const XP = {
  again: 2,
  good: 10,
  easy: 15,
  learned: 5,
  quizCorrect: 15,
  quizPerfect: 50,
  dailyGoal: 25,
} as const;

export const DAILY_GOAL = 15; // reviews per day

// Level n starts at 60 * (n-1)^2 XP.
export const levelFor = (xp: number): number => Math.floor(Math.sqrt(xp / 60)) + 1;

export const levelProgress = (xp: number) => {
  const level = levelFor(xp);
  const floor = 60 * (level - 1) ** 2;
  const ceiling = 60 * level ** 2;
  return {
    level,
    xpIntoLevel: xp - floor,
    xpForLevel: ceiling - floor,
    pct: Math.round(((xp - floor) / (ceiling - floor)) * 100),
  };
};

const TITLES = ['Beginner', 'Seeker', 'Reader', 'Student', 'Reciter', 'Scholar', 'Hafiz-in-training'];
export const titleFor = (level: number): string => TITLES[Math.min(level - 1, TITLES.length - 1)];

export const dateKey = (time: number = Date.now()): string => {
  const d = new Date(time);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export type Stats = {
  reviewsTotal: number;
  known: number;
  streak: number;
  coveragePct: number;
  perfectQuizzes: number;
  xp: number;
};

export type Badge = {
  id: string;
  icon: string;
  title: string;
  description: string;
  test: (stats: Stats) => boolean;
};

export const BADGES: Badge[] = [
  { id: 'first-review', icon: '🌱', title: 'First Steps', description: 'Review your first card', test: (s) => s.reviewsTotal >= 1 },
  { id: 'ten-words', icon: '🔟', title: 'Ten Words', description: 'Know 10 words', test: (s) => s.known >= 10 },
  { id: 'fifty-words', icon: '📘', title: 'Fifty Words', description: 'Know 50 words', test: (s) => s.known >= 50 },
  { id: 'hundred-words', icon: '💯', title: 'Hundred Club', description: 'Know 100 words', test: (s) => s.known >= 100 },
  { id: 'streak-3', icon: '🔥', title: 'On Fire', description: '3-day streak', test: (s) => s.streak >= 3 },
  { id: 'streak-7', icon: '⚡', title: 'Week Warrior', description: '7-day streak', test: (s) => s.streak >= 7 },
  { id: 'perfect-quiz', icon: '🎯', title: 'Sharpshooter', description: 'Score 100% on a quiz', test: (s) => s.perfectQuizzes >= 1 },
  { id: 'coverage-25', icon: '🌙', title: 'A Quarter', description: 'Understand 25% of the Quran', test: (s) => s.coveragePct >= 25 },
  { id: 'coverage-50', icon: '⭐', title: 'Half the Quran', description: 'Understand 50% of the Quran', test: (s) => s.coveragePct >= 50 },
  { id: 'level-5', icon: '🏅', title: 'Level 5', description: 'Reach level 5', test: (s) => levelFor(s.xp) >= 5 },
];

export const newlyEarned = (stats: Stats, alreadyEarned: string[]): Badge[] =>
  BADGES.filter((b) => !alreadyEarned.includes(b.id) && b.test(stats));

const parseKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const shiftKey = (key: string, days: number): string => {
  const d = parseKey(key);
  d.setDate(d.getDate() + days);
  return dateKey(d.getTime());
};

// Consecutive active days ending today (or yesterday, so the streak survives until
// the day is over) and the longest run ever.
export const streakFrom = (activity: Record<string, number>, today: string = dateKey()) => {
  const active = (key: string) => (activity[key] ?? 0) > 0;

  let current = 0;
  let cursor = active(today) ? today : shiftKey(today, -1);
  while (active(cursor)) {
    current += 1;
    cursor = shiftKey(cursor, -1);
  }

  const days = Object.keys(activity).filter(active).sort();
  let longest = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of days) {
    run = previous && shiftKey(previous, 1) === day ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = day;
  }
  return { current, longest: Math.max(longest, current) };
};

export { shiftKey };
