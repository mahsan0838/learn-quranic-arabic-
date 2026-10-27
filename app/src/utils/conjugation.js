const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const TENSES = [
  { key: 'past', english: 'past tense', hint: 'pastEn' },
  { key: 'present', english: 'present / future tense', hint: 'presentEn' },
];

// "Which form goes with this pronoun and tense?" questions built from the
// PDF's sample verb table (conjugation.json). Options are fixed per question.
export const buildConjugationDrill = (data, count = 8, optionCount = 4) => {
  const pool = [];
  for (const gender of ['masculine', 'feminine']) {
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
