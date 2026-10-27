const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Builds a fixed list of questions. Options are decided once here, so they
// stay stable while the user taps an answer.
export const buildQuiz = (words, questionCount = 10, optionCount = 4) => {
  return shuffle(words)
    .slice(0, questionCount)
    .map((word) => {
      const candidates = words.filter(
        (w) => w.id !== word.id && w.english !== word.english
      );
      const sameCategory = shuffle(candidates.filter((w) => w.category === word.category));
      const others = shuffle(candidates.filter((w) => w.category !== word.category));

      const distractors = [];
      for (const candidate of [...sameCategory, ...others]) {
        if (distractors.length === optionCount - 1) break;
        if (!distractors.includes(candidate.english)) distractors.push(candidate.english);
      }

      return {
        word,
        options: shuffle([word.english, ...distractors]),
      };
    });
};
