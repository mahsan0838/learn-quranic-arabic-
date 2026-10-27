import test from 'node:test';
import assert from 'node:assert/strict';
import { computeReminderDates, labelFor, reminderMessage } from '../src/utils/reminders.js';

const at = (d, h, m = 0) => new Date(2026, 0, d, h, m);

test('before the reminder time: today is included, 7 consecutive days', () => {
  const dates = computeReminderDates({ hour: 19, minute: 0, now: at(10, 8) });
  assert.equal(dates.length, 7);
  assert.deepEqual(dates[0], at(10, 19));
  assert.deepEqual(dates[6], at(16, 19));
});

test('after the reminder time: starts tomorrow', () => {
  const dates = computeReminderDates({ hour: 19, minute: 0, now: at(10, 20) });
  assert.deepEqual(dates[0], at(11, 19));
  assert.equal(dates.length, 7);
});

test('goal already reached today: today is skipped', () => {
  const dates = computeReminderDates({ hour: 19, minute: 0, now: at(10, 8), goalReachedToday: true });
  assert.deepEqual(dates[0], at(11, 19));
});

test('crosses month boundaries', () => {
  const dates = computeReminderDates({ hour: 7, minute: 0, now: new Date(2026, 0, 30, 9), days: 3 });
  assert.deepEqual(dates, [new Date(2026, 0, 31, 7), new Date(2026, 1, 1, 7), new Date(2026, 1, 2, 7)]);
});

test('labels and messages', () => {
  assert.equal(labelFor(19, 0), '7:00 PM');
  assert.equal(labelFor(0, 5), '12:05 AM');
  assert.match(reminderMessage(4).title, /4-day streak/);
  assert.match(reminderMessage(0).title, /Arabic review/);
});
