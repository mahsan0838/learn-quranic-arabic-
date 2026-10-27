import type { SrsMap, Word } from '../types';

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export type Direction = 'toMeaning' | 'toArabic';

export type QuizQuestion = {
  word: Word;
  direction: Direction;
  prompt: string;
  hint: string;
  answer: string;
  options: string[];
};

type QuizOptions = { direction?: Direction; pool?: Word[] };

// direction 'toMeaning': Arabic shown, pick the English meaning.
// direction 'toArabic':  English shown, pick the Arabic word.
// Questions come from `words`; wrong options are drawn from `pool`.
// Options are decided once here, so they stay stable while the user taps.
export const buildQuiz = (
  words: Word[],
  questionCount = 10,
  optionCount = 4,
  { direction = 'toMeaning', pool = words }: QuizOptions = {}
): QuizQuestion[] => {
  const label = (w: Word) => (direction === 'toArabic' ? w.arabic : w.english);

  return shuffle(words)
    .slice(0, questionCount)
    .map((word) => {
      // Several entries share an Arabic form or a meaning (e.g. هٰذِهِ is both "this" and
      // "these"), so any option that is also valid for this word must be kept out.
      const validLabels = new Set(
        pool.filter((w) => w.english === word.english || w.arabic === word.arabic).map(label)
      );
      validLabels.add(label(word));
      const candidates = pool.filter((w) => w.id !== word.id && !validLabels.has(label(w)));
      const sameCategory = shuffle(candidates.filter((w) => w.category === word.category));
      const others = shuffle(candidates.filter((w) => w.category !== word.category));

      const distractors: string[] = [];
      for (const candidate of [...sameCategory, ...others]) {
        if (distractors.length === optionCount - 1) break;
        if (!distractors.includes(label(candidate))) {
          distractors.push(label(candidate));
        }
      }

      return {
        word,
        direction,
        prompt: direction === 'toArabic' ? word.english : word.arabic,
        hint: word.grammatical_info,
        answer: label(word),
        options: shuffle([label(word), ...distractors]),
      };
    });
};

// Words the learner has reviewed and still struggles with, worst first.
export const weakWords = <T extends Pick<Word, 'id'>>(words: T[], srsMap: SrsMap): T[] =>
  words
    .filter((w) => {
      const s = srsMap[w.id];
      return s && s.reviews > 0 && (s.lapses > 0 || s.box <= 1);
    })
    .sort((a, b) => srsMap[b.id].lapses - srsMap[a.id].lapses);
