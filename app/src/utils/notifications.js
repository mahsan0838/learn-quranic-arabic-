import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getPreferences, savePreferences, getStreak } from './storage';
import { getGame } from './game';
import { DAILY_GOAL, dateKey } from './gamification';
import { computeReminderDates, reminderMessage } from './reminders';

const CHANNEL_ID = 'daily-review';

// Local notifications don't exist in the browser build.
export const REMINDERS_SUPPORTED = Platform.OS !== 'web';

if (REMINDERS_SUPPORTED) Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const ensureChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Daily review',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
};

// Returns true when notifications may be shown (asking once if needed).
export const ensurePermission = async () => {
  if (!REMINDERS_SUPPORTED) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
};

// Rebuilds the schedule from scratch: one notification per upcoming day, minus today
// if the goal is already met. Cheap enough to call on every app open / review.
export const syncReminders = async () => {
  if (!REMINDERS_SUPPORTED) return false;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const prefs = await getPreferences();
    if (!prefs.dailyReminder) return false;
    if (!(await Notifications.getPermissionsAsync()).granted) return false;

    await ensureChannel();
    const game = await getGame();
    const goalReachedToday = (game.reviewsByDate[dateKey()] ?? 0) >= DAILY_GOAL;
    const content = reminderMessage(await getStreak());
    const dates = computeReminderDates({
      hour: prefs.reminderHour,
      minute: prefs.reminderMinute,
      goalReachedToday,
    });

    for (const date of dates) {
      await Notifications.scheduleNotificationAsync({
        content,
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
      });
    }
    return true;
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    return false;
  }
};

// Turns reminders on/off. Returns false if the user refused permission.
export const setReminderEnabled = async (enabled) => {
  if (enabled && !(await ensurePermission())) return false;
  const prefs = await getPreferences();
  await savePreferences({ ...prefs, dailyReminder: enabled });
  await syncReminders();
  return true;
};

export const setReminderTime = async (hour, minute) => {
  const prefs = await getPreferences();
  await savePreferences({ ...prefs, reminderHour: hour, reminderMinute: minute });
  await syncReminders();
};
