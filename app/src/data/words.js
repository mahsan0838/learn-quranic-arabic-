import vocabData from './vocab.json';

export const MODULE_IDS = [1, 2, 3];

export const getModule = (moduleId) => vocabData[`module_${moduleId}`];

export const getModuleWords = (moduleId) => getModule(moduleId)?.words ?? [];

export const ALL_WORDS = MODULE_IDS.flatMap(getModuleWords);

export const TOTAL_WORDS = ALL_WORDS.length;

// The PDF only has English meanings; Urdu is shown once it is added to the data.
export const HAS_URDU = ALL_WORDS.some((w) => w.urdu);

export const meaningOf = (word, language) =>
  language === 'urdu' && word.urdu ? word.urdu : word.english;

export const pickSession = (words, size = 20) =>
  [...words].sort(() => Math.random() - 0.5).slice(0, size);
