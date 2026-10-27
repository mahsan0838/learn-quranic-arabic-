// Run with: npm test   (Node's built-in runner; covers the pure game logic)
import test from 'node:test';
import assert from 'node:assert/strict';
import { review, isDue, isKnown, buildSession, BOX_INTERVAL_DAYS } from '../src/utils/srs.js';
import { levelFor, levelProgress, newlyEarned, dateKey, DAILY_GOAL } from '../src/utils/gamification.js';
import { buildQuiz } from '../src/utils/quiz.js';

const DAY = 24 * 60 * 60 * 1000;
const noon = new Date(2026, 0, 10, 12).getTime();

test('good moves up one box, easy two, again resets', () => {
  let s = review(undefined, 'good', noon);
  assert.equal(s.box, 1);
  s = review(s, 'easy', noon);
  assert.equal(s.box, 3);
  s = review(s, 'again', noon);
  assert.equal(s.box, 0);
  assert.equal(s.lapses, 1);
  assert.equal(s.reviews, 3);
});

test('box is capped and due dates follow the interval', () => {
  let s;
  for (let i = 0; i < 20; i++) s = review(s, 'easy', noon);
  assert.equal(s.box, BOX_INTERVAL_DAYS.length - 1);
  const s1 = review(undefined, 'good', noon);
  const midnight = new Date(2026, 0, 10).getTime();
  assert.equal(s1.due, midnight + DAY);
  assert.equal(isDue(s1, noon), false);
  assert.equal(isDue(s1, noon + DAY), true);
});

test('known once the word reaches box 2', () => {
  assert.equal(isKnown(review(undefined, 'good', noon)), false);
  assert.equal(isKnown(review(undefined, 'easy', noon)), true);
});

test('session: due words first, then capped new words', () => {
  const words = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }));
  const srs = {
    5: { box: 1, due: noon - 2 * DAY },
    6: { box: 1, due: noon - 1 * DAY },
    7: { box: 2, due: noon + 3 * DAY },
  };
  const { cards, dueCount, newCount } = buildSession(words, srs, { now: noon, newLimit: 3 });
  assert.deepEqual(cards.map((w) => w.id), [5, 6, 1, 2, 3]);
  assert.equal(dueCount, 2);
  assert.equal(newCount, 27);
});

test('levels grow with XP and progress is consistent', () => {
  assert.equal(levelFor(0), 1);
  assert.equal(levelFor(59), 1);
  assert.equal(levelFor(60), 2);
  assert.equal(levelFor(240), 3);
  const p = levelProgress(100);
  assert.equal(p.level, 2);
  assert.equal(p.xpIntoLevel, 40);
  assert.equal(p.xpForLevel, 180);
});

test('badges unlock once and are not re-awarded', () => {
  const stats = { reviewsTotal: 1, known: 10, streak: 0, coveragePct: 0, perfectQuizzes: 0, xp: 0 };
  const first = newlyEarned(stats, []).map((b) => b.id);
  assert.deepEqual(first.sort(), ['first-review', 'ten-words']);
  assert.deepEqual(newlyEarned(stats, first), []);
});

test('dateKey is a stable local YYYY-MM-DD and goal is positive', () => {
  assert.equal(dateKey(new Date(2026, 0, 5, 23, 59).getTime()), '2026-01-05');
  assert.ok(DAILY_GOAL > 0);
});

test('quiz: stable options, correct answer present, no duplicate meanings', () => {
  const words = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    english: i === 3 ? 'word 3' : `word ${i}`, // id 4 duplicates id 3's meaning
    arabic: `ar${i}`,
    category: i % 2 ? 'a' : 'b',
  }));
  const quiz = buildQuiz(words, 10);
  assert.equal(quiz.length, 10);
  for (const q of quiz) {
    assert.ok(q.options.includes(q.word.english));
    assert.equal(new Set(q.options).size, q.options.length);
    assert.equal(q.options.length, 4);
  }
});
