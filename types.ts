export enum WordCategory {
  PARTICLE = 'Particle',
  NOUN = 'Noun',
  VERB = 'Verb',
}

export interface Word {
  id: string;
  arabic: string;
  transliteration?: string;
  english: string;
  urdu: string;
  grammar?: string;
  root?: string; // Root letters for verbs/nouns
  frequency?: number; // Approximate occurrences in Quran
  category: WordCategory;
  subCategory?: string; // For grouping within modules
  moduleId: number;
  exampleVerse?: {
    arabic: string;
    english: string;
    reference: string;
  };
}

export interface Module {
  id: number;
  title: string;
  description: string;
  color: string;
  percentage: number; // Cumulative percentage of Quran covered
}

export interface UserProgress {
  learnedWordIds: string[];
  streakDays: number;
  lastStudyDate: string; // ISO date string
  quizScores: { date: string; score: number; total: number }[];
  dailyGoal: number; // minutes or words
}

export type Tab = 'home' | 'learn' | 'flashcards' | 'quiz' | 'settings';