export type VerbForms = {
  past: string;
  present: string;
  imperative: string;
  active_participle: string;
  verbal_noun: string;
};

// One entry of vocab.json, as built by scripts/build_vocab.py.
export type Word = {
  id: number;
  arabic: string;
  english: string;
  urdu: string | null;
  grammatical_info: string;
  frequency: number | null;
  category: string;
  page: number;
  forms?: VerbForms;
};

export type Grade = 'again' | 'good' | 'easy';

export type SrsState = {
  box: number;
  due: number;
  reviews: number;
  lapses: number;
  lastReviewed: number;
};

export type SrsMap = Record<number, SrsState>;

export type Language = 'english' | 'urdu';
