import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildConjugationDrill } from '../src/utils/conjugation.js';

const data = JSON.parse(readFileSync(new URL('../src/data/conjugation.json', import.meta.url), 'utf8'));

test('conjugation drill: answer matches the table and options are distinct', () => {
  const drill = buildConjugationDrill(data, 8);
  assert.equal(drill.length, 8);
  for (const q of drill) {
    const rows = data[q.gender].active.filter((r) => r.pronoun === q.pronoun);
    assert.ok(rows.some((r) => r.past === q.answer || r.present === q.answer));
    assert.ok(q.options.includes(q.answer));
    assert.equal(new Set(q.options).size, q.options.length);
    assert.equal(q.options.length, 4);
  }
});

test('table has every pronoun in both genders', () => {
  assert.equal(data.masculine.active.length, 8);
  assert.equal(data.feminine.active.length, 8);
  for (const g of ['masculine', 'feminine']) {
    assert.equal(data[g].imperative.length, 3);
    assert.equal(data[g].negativeImperative.length, 3);
  }
});
