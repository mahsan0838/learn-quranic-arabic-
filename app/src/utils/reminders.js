export const REMINDER_PRESETS = [
  { hour: 7, minute: 0, label: '7:00 AM' },
  { hour: 12, minute: 30, label: '12:30 PM' },
  { hour: 17, minute: 0, label: '5:00 PM' },
  { hour: 19, minute: 0, label: '7:00 PM' },
  { hour: 21, minute: 0, label: '9:00 PM' },
];

export const labelFor = (hour, minute) =>
  REMINDER_PRESETS.find((p) => p.hour === hour && p.minute === minute)?.label ??
  `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;

// The next `days` moments a reminder should fire. Today's slot is skipped when it has
// already passed or the daily goal is already met, so people who did their review
// are not nagged.
export const computeReminderDates = ({ hour, minute, now = new Date(), goalReachedToday = false, days = 7 }) => {
  const dates = [];
  for (let offset = 0; dates.length < days; offset++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, minute, 0, 0);
    if (offset === 0 && (goalReachedToday || at <= now)) continue;
    dates.push(at);
  }
  return dates;
};

export const reminderMessage = (streak) =>
  streak > 0
    ? { title: `🔥 ${streak}-day streak`, body: 'A few minutes of review keeps it alive. Your cards are waiting.' }
    : { title: 'Time for your Arabic review', body: 'A few minutes a day gets you to 80% of the Qur’an.' };
