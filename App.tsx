import React, { useState, useEffect } from 'react';
import { 
  Tab, 
  UserProgress, 
  Word 
} from './types';
import { VOCABULARY, MODULES } from './data/vocabulary';
import BottomNav from './components/BottomNav';
import WordCard from './components/WordCard';
import ProgressBar from './components/ProgressBar';
import Confetti from './components/Confetti';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Settings as SettingsIcon,
  RefreshCcw,
  ArrowRight,
  Bell,
  Clock,
  BookOpenCheck,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const INITIAL_PROGRESS: UserProgress = {
  learnedWordIds: [],
  streakDays: 0,
  lastStudyDate: '',
  quizScores: [],
  dailyGoal: 10
};

// --- Sub-Components ---

const OnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="fixed inset-0 z-50 bg-emerald-900 flex flex-col items-center justify-center p-6 text-center text-white">
    <div className="w-full max-w-md space-y-8 animate-fade-in-up">
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-800 p-6 rounded-full ring-4 ring-emerald-700">
          <BookOpenCheck size={64} className="text-emerald-300" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold font-arabic mb-2">QuranVoc 80</h1>
      
      <div className="space-y-4">
        <p className="text-xl font-medium text-emerald-100">
          Learn <span className="text-amber-400 font-bold">300 words</span>, <br/> 
          understand <span className="text-amber-400 font-bold">80%</span> of the Quran.
        </p>
        <p className="text-sm text-emerald-300/80 leading-relaxed max-w-xs mx-auto">
          Based on the statistical analysis by Dr. Abdulazeez Abdulraheem. 
          Focus on the most frequent words first to unlock the meaning of the Divine Book.
        </p>
      </div>

      <div className="pt-8">
        <button 
          onClick={onComplete}
          className="w-full bg-amber-500 text-emerald-900 font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Start Your Journey <ArrowRight size={20} />
        </button>
      </div>
    </div>
  </div>
);

const HomeView: React.FC<{ 
  progress: UserProgress, 
  calculatedPercentage: number, 
  learnedCount: number, 
  totalWords: number 
}> = ({ progress, calculatedPercentage, learnedCount, totalWords }) => (
  <div className="space-y-6 pb-20 p-4 animate-fade-in-up">
    {/* Header */}
    <div className="flex justify-between items-center mt-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assalamu Alaikum</h1>
        <p className="text-sm text-gray-500">Let's continue learning.</p>
      </div>
      <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
        <Flame size={18} className="text-amber-500 fill-amber-500" />
        <span className="font-bold text-amber-700">{progress.streakDays} Day Streak</span>
      </div>
    </div>

    {/* Main Stats Card */}
    <div className="bg-gradient-to-br from-islamic-dark to-islamic-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
      <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10 group-hover:opacity-20 transition-opacity">
          <Trophy size={180} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-emerald-300" />
          <h2 className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Current Impact</h2>
        </div>
        <div className="flex items-baseline space-x-2">
           <span className="text-5xl font-bold">{calculatedPercentage}%</span>
           <span className="text-emerald-200 text-sm font-medium">of Quranic text unlocked</span>
        </div>
        <div className="mt-5 bg-black/20 rounded-full h-2.5 w-full backdrop-blur-sm">
          <div 
            className="bg-islamic-gold h-full rounded-full transition-all duration-1000 relative" 
            style={{ width: `${Math.max(5, (calculatedPercentage / 80) * 100)}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
          </div>
        </div>
        <p className="mt-3 text-sm text-emerald-50 opacity-90 flex justify-between">
           <span>{learnedCount} / {totalWords} words learned</span>
           <span className="text-emerald-300">Target: 80%</span>
        </p>
      </div>
    </div>

    {/* Modules Overview */}
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Your Journey</h3>
      <div className="space-y-3">
        {MODULES.map(module => {
          const moduleWords = VOCABULARY.filter(w => w.moduleId === module.id);
          const learnedInModule = moduleWords.filter(w => progress.learnedWordIds.includes(w.id)).length;
          const percent = Math.round((learnedInModule / moduleWords.length) * 100);

          return (
            <div key={module.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{module.title}</h4>
                  <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{learnedInModule}/{moduleWords.length}</span>
                </div>
                <ProgressBar percentage={percent} colorClass={module.color.replace('bg-', 'bg-')} heightClass="h-2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Insights */}
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Activity</h3>
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { day: 'M', val: 15 }, { day: 'T', val: 25 }, { day: 'W', val: 10 }, 
            { day: 'T', val: 30 }, { day: 'F', val: 20 }, { day: 'S', val: 45 }, { day: 'S', val: 10 }
          ]}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="val" radius={[4, 4, 0, 0]}>
              {
                [0,1,2,3,4,5,6].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#10B981' : '#E5E7EB'} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const LearnView: React.FC<{
  selectedModule: number | null,
  setSelectedModule: (id: number | null) => void,
  showUrdu: boolean,
  learnedWordIds: string[]
}> = ({ selectedModule, setSelectedModule, showUrdu, learnedWordIds }) => {
  // If a module is selected, show words
  if (selectedModule) {
    const words = VOCABULARY.filter(w => w.moduleId === selectedModule);
    
    // Group words by subCategory
    const groupedWords: { [key: string]: Word[] } = {};
    const categories: string[] = [];
    
    words.forEach(word => {
      const sub = word.subCategory || 'General';
      if (!groupedWords[sub]) {
        groupedWords[sub] = [];
        categories.push(sub);
      }
      groupedWords[sub].push(word);
    });

    return (
      <div className="pb-20 p-4 animate-fade-in-up">
         <button 
           onClick={() => setSelectedModule(null)}
           className="flex items-center text-gray-500 mb-4 hover:text-islamic-primary transition-colors"
         >
           <ArrowRight className="rotate-180 mr-1" size={18} />
           Back to Modules
         </button>
         <h2 className="text-2xl font-bold text-gray-800 mb-1">{MODULES.find(m => m.id === selectedModule)?.title}</h2>
         <p className="text-sm text-gray-500 mb-6">{words.length} Words</p>
         
         <div className="space-y-8">
           {categories.map(category => (
             <div key={category}>
               <h3 className="text-lg font-bold text-islamic-dark border-l-4 border-islamic-gold pl-3 mb-4">{category}</h3>
               <div className="space-y-3">
                 {groupedWords[category].map(word => (
                   <div key={word.id} className="relative">
                     <WordCard word={word} showUrdu={showUrdu} />
                     {learnedWordIds.includes(word.id) && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
                           <CheckCircle2 size={18} className="text-islamic-primary fill-islamic-light" />
                        </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </div>
      </div>
    )
  }

  // Default: Show Module List
  return (
    <div className="space-y-6 pb-20 p-4 animate-fade-in-up">
       <div className="flex justify-between items-center mt-2">
         <h1 className="text-2xl font-bold text-gray-800">Browse Content</h1>
       </div>
       
       <div className="grid gap-4">
         {MODULES.map(module => (
           <button 
             key={module.id} 
             onClick={() => setSelectedModule(module.id)}
             className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-left hover:border-islamic-primary hover:shadow-md transition-all group relative overflow-hidden"
           >
             <div className={`absolute top-0 left-0 w-1 h-full ${module.color}`}></div>
             <div className="flex items-start justify-between">
               <div>
                 <span className={`inline-block px-2 py-1 rounded text-[10px] uppercase tracking-wider text-white font-bold mb-2 ${module.color}`}>
                   Module {module.id}
                 </span>
                 <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-islamic-primary transition-colors">{module.title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed">{module.description}</p>
               </div>
               <div className="bg-gray-50 p-3 rounded-full group-hover:bg-islamic-light transition-colors">
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-islamic-primary" />
               </div>
             </div>
           </button>
         ))}
       </div>
    </div>
  );
};

const FlashcardsView: React.FC<{
  learnedWordIds: string[],
  showUrdu: boolean,
  onMarkKnown: (id: string) => void,
  onMarkUnknown: (id: string) => void
}> = ({ learnedWordIds, showUrdu, onMarkKnown, onMarkUnknown }) => {
  const unknownWords = VOCABULARY.filter(w => !learnedWordIds.includes(w.id));
  const wordsToStudy = unknownWords.length > 0 ? unknownWords : VOCABULARY; // Fallback if all learned
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finishedSession, setFinishedSession] = useState(false);

  const currentWord = wordsToStudy[currentIndex];

  const handleNext = (known: boolean) => {
    if (known) {
      onMarkKnown(currentWord.id);
    } else {
      onMarkUnknown(currentWord.id);
    }

    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < wordsToStudy.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setFinishedSession(true);
      }
    }, 200);
  };

  const restart = () => {
    setCurrentIndex(0);
    setFinishedSession(false);
    setIsFlipped(false);
  };

  if (finishedSession) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center animate-fade-in-up">
        <div className="bg-emerald-100 p-6 rounded-full mb-6 ring-8 ring-emerald-50">
           <Trophy size={64} className="text-islamic-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Complete!</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">You've reviewed all available cards for now. Come back tomorrow to keep your streak!</p>
        <button 
          onClick={restart}
          className="bg-islamic-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
        >
          Review Again
        </button>
      </div>
    );
  }

  if (!currentWord) return <div className="p-10 text-center">No words loaded.</div>;

  return (
    <div className="flex flex-col h-[90vh] pb-20 p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mt-2 mb-6">
         <h1 className="text-2xl font-bold text-gray-800">Flashcards</h1>
         <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
           {currentIndex + 1} / {wordsToStudy.length}
         </span>
      </div>

      <div className="flex-1 flex items-center justify-center mb-6">
         <WordCard 
           word={currentWord} 
           showUrdu={showUrdu} 
           isFlashcard={true}
           isFlipped={isFlipped}
           onFlip={() => setIsFlipped(!isFlipped)}
         />
      </div>

      <div className="grid grid-cols-2 gap-4">
         <button 
           onClick={() => handleNext(false)}
           className="bg-white border-2 border-red-100 text-red-500 py-4 rounded-xl font-bold hover:bg-red-50 transition-colors flex flex-col items-center justify-center shadow-sm"
         >
           <RefreshCcw size={20} className="mb-1" />
           Review Again
         </button>
         <button 
           onClick={() => handleNext(true)}
           className="bg-islamic-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-islamic-dark transition-colors flex flex-col items-center justify-center"
         >
           <CheckCircle2 size={20} className="mb-1" />
           I Know It
         </button>
      </div>
    </div>
  );
};

const QuizView: React.FC<{
  showUrdu: boolean,
  onComplete: (score: number, total: number) => void,
  onContinue: () => void
}> = ({ showUrdu, onComplete, onContinue }) => {
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Generate 5 random questions on mount
  const [quizQuestions] = useState(() => {
    const questions = [];
    const deck = [...VOCABULARY].sort(() => 0.5 - Math.random());
    const selected = deck.slice(0, 5);

    for (const correctWord of selected) {
       const distractors = VOCABULARY
         .filter(w => w.id !== correctWord.id)
         .sort(() => 0.5 - Math.random())
         .slice(0, 3);
       
       const options = [...distractors, correctWord].sort(() => 0.5 - Math.random());
       questions.push({ correctWord, options });
    }
    return questions;
  });

  const handleAnswer = (word: Word) => {
    const isCorrect = word.id === quizQuestions[qIndex].correctWord.id;
    const newScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) {
      setScore(newScore);
    }
    
    if (qIndex < quizQuestions.length - 1) {
      setQIndex(q => q + 1);
    } else {
      setShowResult(true);
      onComplete(newScore, quizQuestions.length); 
    }
  };

  if (showResult) {
     return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center animate-fade-in-up relative">
        <Confetti />
        <div className="bg-amber-100 p-6 rounded-full mb-6 ring-8 ring-amber-50">
           <Trophy size={64} className="text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Finished!</h2>
        <p className="text-4xl font-bold text-islamic-primary mb-2">{score} / {quizQuestions.length}</p>
        <p className="text-gray-500 mb-8">Streak updated & Score saved!</p>
        <button 
          onClick={onContinue}
          className="bg-islamic-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow z-10 relative"
        >
          Continue Learning
        </button>
      </div>
    );
  }

  const currentQ = quizQuestions[qIndex];

  return (
    <div className="flex flex-col h-[90vh] pb-20 p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mt-2 mb-8">
         <h1 className="text-2xl font-bold text-gray-800">Quiz</h1>
         <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-500">
           {qIndex + 1} / {quizQuestions.length}
         </span>
      </div>

      <div className="text-center mb-10 flex-1 flex flex-col justify-center">
         <h2 className="text-6xl font-arabic text-gray-800 mb-6 leading-relaxed">{currentQ.correctWord.arabic}</h2>
         <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">Select the correct meaning</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {currentQ.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt)}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-lg font-medium text-gray-700 hover:border-islamic-primary hover:bg-islamic-light/30 transition-all text-left shadow-sm active:scale-[0.99]"
          >
            {opt.english} {showUrdu && <span className="text-gray-400 text-sm font-urdu ml-2">({opt.urdu})</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

const SettingsView: React.FC<{
  showUrdu: boolean,
  setShowUrdu: (val: boolean) => void,
  reminderTime: string,
  setReminderTime: (val: string) => void,
  onReset: () => void
}> = ({ showUrdu, setShowUrdu, reminderTime, setReminderTime, onReset }) => (
  <div className="space-y-6 pb-20 p-4 animate-fade-in-up">
     <h1 className="text-2xl font-bold text-gray-800 mt-2">Settings</h1>
     
     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500"><SettingsIcon size={20} /></div>
             <span className="font-medium text-gray-700">Urdu Translations</span>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
             <input type="checkbox" className="sr-only peer" checked={showUrdu} onChange={() => setShowUrdu(!showUrdu)} />
             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-islamic-primary"></div>
           </label>
        </div>

        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-amber-50 p-2 rounded-lg text-amber-500"><Bell size={20} /></div>
             <span className="font-medium text-gray-700">Daily Reminder</span>
           </div>
           <div className="flex items-center bg-gray-50 rounded-lg px-2 border border-gray-200">
             <Clock size={14} className="text-gray-400 mr-2" />
             <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 p-1 outline-none"
             />
           </div>
        </div>

        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-red-50 p-2 rounded-lg text-red-500"><RefreshCcw size={20} /></div>
             <span className="font-medium text-gray-700">Reset Progress</span>
           </div>
           <button 
              onClick={() => {
                if(confirm("Are you sure? This will delete all progress.")) {
                  onReset();
                }
              }}
              className="text-sm font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
           >
              Reset
           </button>
        </div>
     </div>

     <div className="bg-islamic-cream border border-islamic-primary/20 p-6 rounded-xl text-center">
        <h3 className="font-bold text-islamic-dark mb-2">About 80% Quranic Words</h3>
        <p className="text-sm text-gray-600 mb-4">
          This vocabulary list is based on the statistical analysis of Quranic words by Dr. Abdulazeez Abdulraheem (Understand Quran Academy). By learning these words, you can understand approximately 80% of the Holy Quran's text.
        </p>
        <p className="text-xs text-gray-400">Version 1.1.0</p>
     </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  
  // Lazy initialize state from LocalStorage
  const [showUrdu, setShowUrdu] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quranvoc_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.showUrdu !== undefined ? parsed.showUrdu : true;
      }
    } catch (e) {}
    return true;
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('quranvoc_progress');
      return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    } catch (e) {
      return INITIAL_PROGRESS;
    }
  });

  const [reminderTime, setReminderTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('quranvoc_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.reminderTime || '09:00';
      }
    } catch (e) {}
    return '09:00';
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('quranvoc_onboarded');
  });

  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  // Save progress & settings whenever they change
  useEffect(() => {
    localStorage.setItem('quranvoc_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('quranvoc_settings', JSON.stringify({ reminderTime, showUrdu }));
  }, [reminderTime, showUrdu]);

  const completeOnboarding = () => {
    localStorage.setItem('quranvoc_onboarded', 'true');
    setShowOnboarding(false);
  };

  // --- Logic: Streak Calculation ---
  const updateStreak = (current: UserProgress): UserProgress => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // If we already studied today, just return current state
    if (current.lastStudyDate && current.lastStudyDate.startsWith(today)) {
      return current; 
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // Check if last study was yesterday (continuation) or older (break)
    const lastDate = current.lastStudyDate ? current.lastStudyDate.split('T')[0] : null;
    
    let newStreak = current.streakDays;
    
    if (lastDate === yesterdayString) {
      newStreak += 1;
    } else if (lastDate !== today) {
      // If last date wasn't yesterday AND wasn't today, streak resets
      newStreak = 1; 
    }

    return {
      ...current,
      streakDays: newStreak,
      lastStudyDate: now.toISOString()
    };
  };

  const handleQuizComplete = (score: number, total: number) => {
    setProgress(prev => {
      const withStreak = updateStreak(prev);
      return {
        ...withStreak,
        quizScores: [
          ...withStreak.quizScores, 
          { date: new Date().toISOString(), score, total }
        ]
      };
    });
  };

  const markAsKnown = (wordId: string) => {
    setProgress(prev => {
      const withStreak = updateStreak(prev);
      if (!withStreak.learnedWordIds.includes(wordId)) {
        return {
          ...withStreak,
          learnedWordIds: [...withStreak.learnedWordIds, wordId]
        };
      }
      return withStreak;
    });
  };

  const markAsUnknown = (wordId: string) => {
    if (progress.learnedWordIds.includes(wordId)) {
      setProgress(prev => ({
        ...prev,
        learnedWordIds: prev.learnedWordIds.filter(id => id !== wordId)
      }));
    }
  };

  const handleReset = () => {
    setProgress(INITIAL_PROGRESS);
    setShowOnboarding(true);
  };

  // Derived Stats
  const totalWords = VOCABULARY.length;
  const learnedCount = progress.learnedWordIds.length;
  const appCoverage = 80; 
  const calculatedPercentage = Math.round((learnedCount / totalWords) * appCoverage * 10) / 10; 

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-stone-50 md:flex md:justify-center">
       <div className="w-full max-w-md bg-stone-50 min-h-screen shadow-2xl relative overflow-hidden">
          
          {showOnboarding && <OnboardingView onComplete={completeOnboarding} />}

          <main className="pt-4 h-full">
            {currentTab === 'home' && (
              <HomeView 
                progress={progress}
                calculatedPercentage={calculatedPercentage}
                learnedCount={learnedCount}
                totalWords={totalWords}
              />
            )}
            {currentTab === 'learn' && (
              <LearnView 
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
                showUrdu={showUrdu}
                learnedWordIds={progress.learnedWordIds}
              />
            )}
            {currentTab === 'flashcards' && (
              <FlashcardsView 
                learnedWordIds={progress.learnedWordIds}
                showUrdu={showUrdu}
                onMarkKnown={markAsKnown}
                onMarkUnknown={markAsUnknown}
              />
            )}
            {currentTab === 'quiz' && (
              <QuizView 
                showUrdu={showUrdu}
                onComplete={handleQuizComplete}
                onContinue={() => setCurrentTab('learn')}
              />
            )}
            {currentTab === 'settings' && (
              <SettingsView 
                showUrdu={showUrdu}
                setShowUrdu={setShowUrdu}
                reminderTime={reminderTime}
                setReminderTime={setReminderTime}
                onReset={handleReset}
              />
            )}
          </main>

          <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
       </div>
    </div>
  );
};

export default App;