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

// Total words in the Qur'an as used by the PDF (82.6% = 64,282 of ~77,800).
export const QURAN_TOTAL_WORDS = 77800;

// Module 1 pages print one lump sum (41.5% = 32,263 words) instead of per-word
// counts, so each module-1 word carries an equal share of it.
const MODULE_1_OCCURRENCES = 32263;
const moduleOneCount = getModuleWords(1).length;

// How many Qur'an words this entry accounts for.
export const weightOf = (word) =>
  word.frequency ?? (moduleOneCount ? MODULE_1_OCCURRENCES / moduleOneCount : 0);

export const coveragePercent = (words) =>
  (words.reduce((sum, w) => sum + weightOf(w), 0) / QURAN_TOTAL_WORDS) * 100;

// Study order: module by module, most frequent words first within each module.
export const CURRICULUM = MODULE_IDS.flatMap((id) =>
  [...getModuleWords(id)].sort((a, b) => weightOf(b) - weightOf(a))
);

export const WORDS_BY_ID = Object.fromEntries(ALL_WORDS.map((w) => [w.id, w]));
