// Pure rules for XP, levels, daily goal and badges. No storage here.
export const XP = {
  again: 2,
  good: 10,
  easy: 15,
  learned: 5,
  quizCorrect: 15,
  quizPerfect: 50,
  dailyGoal: 25,
};

export const DAILY_GOAL = 15; // reviews per day

// Level n starts at 60 * (n-1)^2 XP.
export const levelFor = (xp) => Math.floor(Math.sqrt(xp / 60)) + 1;

export const levelProgress = (xp) => {
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
export const titleFor = (level) => TITLES[Math.min(level - 1, TITLES.length - 1)];

export const dateKey = (time = Date.now()) => {
  const d = new Date(time);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// stats: { reviewsTotal, known, streak, coveragePct, perfectQuizzes, xp }
export const BADGES = [
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

export const newlyEarned = (stats, alreadyEarned) =>
  BADGES.filter((b) => !alreadyEarned.includes(b.id) && b.test(stats));
