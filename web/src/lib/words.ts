import vocab from '../data/vocab.json';
import type { Word } from '../types';

export type ModuleInfo = { id: number; name: string; description: string; pages: string; words: Word[] };

type RawModule = { name: string; description: string; pages: string; words: Word[] };
const raw = vocab as unknown as Record<string, RawModule>;

export const MODULES: ModuleInfo[] = [1, 2, 3].map((id) => ({ id, ...raw[`module_${id}`] }));

export const ALL_WORDS: Word[] = MODULES.flatMap((m) => m.words);
export const TOTAL_WORDS = ALL_WORDS.length;
export const WORDS_BY_ID: Record<number, Word> = Object.fromEntries(ALL_WORDS.map((w) => [w.id, w]));

export const moduleOf = (word: Word): number => MODULES.find((m) => m.words.includes(word))!.id;

// The PDF has no Urdu; ours is a supplementary gloss (data/supplement/urdu.txt).
export const meaningOf = (word: Word, language: 'english' | 'urdu'): string =>
  language === 'urdu' && word.urdu ? word.urdu : word.english;

// "Prophets and Allah's Signs · fg" -> section title, note
export const sectionOf = (word: Word): string => word.grammatical_info.split(' · ')[0];
export const noteOf = (word: Word): string | null => word.grammatical_info.split(' · ')[1] ?? null;

// Total words in the Qur'an as used by the PDF (82.6% = 64,282 of ~77,800).
export const QURAN_TOTAL_WORDS = 77800;
export const TARGET_COVERAGE = 82.6;

// Module 1 pages print one lump sum (41.5% = 32,263 words) instead of per-word counts,
// so each module-1 word carries an equal share of it.
const MODULE_1_OCCURRENCES = 32263;
const moduleOneCount = MODULES[0].words.length;

export const weightOf = (word: Word): number =>
  word.frequency ?? (moduleOneCount ? MODULE_1_OCCURRENCES / moduleOneCount : 0);

export const coveragePercent = (words: Word[]): number =>
  (words.reduce((sum, w) => sum + weightOf(w), 0) / QURAN_TOTAL_WORDS) * 100;

// Study order: module by module, most frequent words first within each module.
export const CURRICULUM: Word[] = MODULES.flatMap((m) =>
  [...m.words].sort((a, b) => weightOf(b) - weightOf(a))
);

export const HAS_URDU = ALL_WORDS.some((w) => w.urdu);
