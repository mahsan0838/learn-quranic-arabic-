import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getPreferences, savePreferences } from '../utils/storage';

// Meaning language ('english' | 'urdu') persisted in preferences and shared
// by every screen that shows translations.
export default function useLanguage() {
  const [language, setLanguageState] = useState('english');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getPreferences().then((prefs) => {
        if (active) setLanguageState(prefs.language || 'english');
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const setLanguage = useCallback(async (next) => {
    setLanguageState(next);
    const prefs = await getPreferences();
    await savePreferences({ ...prefs, language: next });
  }, []);

  return [language, setLanguage];
}
