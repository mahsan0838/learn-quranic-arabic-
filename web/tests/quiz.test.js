import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildQuiz, weakWords } from '../src/lib/quiz.ts';

const vocab = JSON.parse(readFileSync(new URL('../src/data/vocab.json', import.meta.url), 'utf8'));
const ALL = ['module_1', 'module_2', 'module_3'].flatMap((k) => vocab[k].words);

for (const direction of ['toMeaning', 'toArabic']) {
  test(`real vocab, ${direction}: a single unambiguous correct option per question`, () => {
    for (let run = 0; run < 20; run++) {
      for (const q of buildQuiz(ALL, 10, 4, { direction, pool: ALL })) {
        assert.equal(q.options.length, 4);
        assert.equal(new Set(q.options).size, 4);
        assert.ok(q.options.includes(q.answer));
        // No wrong option may also be a valid answer for the same word.
        const validLabels = new Set(
          ALL.filter((w) => w.english === q.word.english || w.arabic === q.word.arabic)
            .map((w) => (direction === 'toArabic' ? w.arabic : w.english))
        );
        for (const o of q.options.filter((o) => o !== q.answer)) {
          assert.ok(!validLabels.has(o), `${o} is also valid for ${q.word.english}`);
        }
      }
    }
  });
}

test('questions are drawn from the given scope only', () => {
  const m2 = vocab.module_2.words;
  const ids = new Set(m2.map((w) => w.id));
  for (const q of buildQuiz(m2, 10, 4, { pool: ALL })) assert.ok(ids.has(q.word.id));
});

test('weak words: reviewed and (lapsed or low box), worst first', () => {
  const words = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const srs = {
    1: { box: 4, lapses: 0, reviews: 5 },
    2: { box: 1, lapses: 0, reviews: 1 },
    3: { box: 3, lapses: 2, reviews: 6 },
  };
  assert.deepEqual(weakWords(words, srs).map((w) => w.id), [3, 2]);
});
