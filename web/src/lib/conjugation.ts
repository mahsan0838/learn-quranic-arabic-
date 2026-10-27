const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

type Gender = 'masculine' | 'feminine';

export type ActiveRow = {
  pronoun: string;
  past: string;
  pastEn: string;
  present: string;
  presentEn: string;
  suffix: string;
};

export type ConjugationData = Record<Gender, { active: ActiveRow[] }>;

export type DrillQuestion = {
  gender: Gender;
  pronoun: string;
  tense: string;
  meaning: string;
  answer: string;
  options: string[];
};

const TENSES = [
  { key: 'past', english: 'past tense', hint: 'pastEn' },
  { key: 'present', english: 'present / future tense', hint: 'presentEn' },
] as const;

// "Which form goes with this pronoun and tense?" questions built from the
// PDF's sample verb table (conjugation.json). Options are fixed per question.
export const buildConjugationDrill = (
  data: ConjugationData,
  count = 8,
  optionCount = 4
): DrillQuestion[] => {
  const pool: { gender: Gender; row: ActiveRow; tense: (typeof TENSES)[number] }[] = [];
  for (const gender of ['masculine', 'feminine'] as const) {
    for (const row of data[gender].active) {
      for (const tense of TENSES) pool.push({ gender, row, tense });
    }
  }
  return shuffle(pool)
    .slice(0, count)
    .map(({ gender, row, tense }) => {
      const answer = row[tense.key];
      const wrong = shuffle(
        data[gender].active.flatMap((r) => TENSES.map((t) => r[t.key])).filter((form) => form !== answer)
      );
      const distractors = [...new Set(wrong)].slice(0, optionCount - 1);
      return {
        gender,
        pronoun: row.pronoun,
        tense: tense.english,
        meaning: row[tense.hint],
        answer,
        options: shuffle([answer, ...distractors]),
      };
    });
};
