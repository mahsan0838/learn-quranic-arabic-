import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  LEARNED_WORDS: '@quranvoc_learned_words',
  QUIZ_SCORES: '@quranvoc_quiz_scores',
  FLASHCARD_PROGRESS: '@quranvoc_flashcard_progress',
  LAST_STUDY_DATE: '@quranvoc_last_study_date',
  STREAK: '@quranvoc_streak',
  PREFERENCES: '@quranvoc_preferences',
};

// Progress Management
export const saveProgress = async (wordId, status = 'learned') => {
  try {
    const existing = await getProgress();
    const updated = {
      ...existing,
      [wordId]: {
        status,
        learnedDate: new Date().toISOString(),
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.LEARNED_WORDS, JSON.stringify(updated));
    await updateStreak();
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

export const getProgress = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LEARNED_WORDS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting progress:', error);
    return {};
  }
};

export const getLearnedWordsCount = async () => {
  try {
    const progress = await getProgress();
    return Object.keys(progress).length;
  } catch (error) {
    return 0;
  }
};

// Quiz Management
export const saveQuizScore = async (score, totalQuestions, moduleId = null) => {
  try {
    const existing = await getQuizScores();
    const newScore = {
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      date: new Date().toISOString(),
      moduleId,
    };
    const updated = [...existing, newScore];
    await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(updated));
    await updateStreak();
    return true;
  } catch (error) {
    console.error('Error saving quiz score:', error);
    return false;
  }
};

export const getQuizScores = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting quiz scores:', error);
    return [];
  }
};

export const getAverageQuizAccuracy = async () => {
  try {
    const scores = await getQuizScores();
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s.percentage, 0);
    return Math.round(total / scores.length);
  } catch (error) {
    return 0;
  }
};

// Flashcard Progress (Spaced Repetition)
export const saveFlashcardProgress = async (wordId, familiarity) => {
  try {
    const existing = await getFlashcardProgress();
    const updated = {
      ...existing,
      [wordId]: {
        familiarity, // 1-5 scale
        lastReviewed: new Date().toISOString(),
        reviewCount: (existing[wordId]?.reviewCount || 0) + 1,
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.FLASHCARD_PROGRESS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving flashcard progress:', error);
    return false;
  }
};

export const getFlashcardProgress = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARD_PROGRESS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting flashcard progress:', error);
    return {};
  }
};

// Streak Management
export const updateStreak = async () => {
  try {
    const lastStudyDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_STUDY_DATE);
    const today = new Date().toDateString();
    
    if (!lastStudyDate) {
      // First time studying
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_STUDY_DATE, today);
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK, '1');
      return 1;
    }

    const lastDate = new Date(lastStudyDate);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let currentStreak = parseInt(await AsyncStorage.getItem(STORAGE_KEYS.STREAK) || '0');

    if (diffDays === 0) {
      // Same day, no change
      return currentStreak;
    } else if (diffDays === 1) {
      // Consecutive day
      currentStreak += 1;
    } else {
      // Streak broken
      currentStreak = 1;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.LAST_STUDY_DATE, today);
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, currentStreak.toString());
    return currentStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};

export const getStreak = async () => {
  try {
    const streak = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
    return parseInt(streak || '0');
  } catch (error) {
    return 0;
  }
};

// Preferences
export const savePreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
};

export const getPreferences = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      language: 'english',
      arabicFontSize: 'large',
      dailyReminder: false,
    };
  } catch (error) {
    return {
      language: 'english',
      arabicFontSize: 'large',
      dailyReminder: false,
    };
  }
};

// Clear all data (for testing/reset)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
