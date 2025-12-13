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
  ChevronDown,
  Moon,
  Sun,
  User,
  Brain,
  BookOpen,
  Zap
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
  totalWords: number,
  onNavigate: (tab: Tab) => void,
  onSelectModule: (id: number) => void
}> = ({ progress, calculatedPercentage, learnedCount, totalWords, onNavigate, onSelectModule }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find next module to study (first one that isn't 100% complete)
  const nextModuleId = MODULES.find(m => {
    const moduleWords = VOCABULARY.filter(w => w.moduleId === m.id);
    const learned = moduleWords.filter(w => progress.learnedWordIds.includes(w.id)).length;
    return learned < moduleWords.length;
  })?.id || 1;

  return (
    <div className="pb-32 animate-fade-in-up font-sans">
      {/* Dynamic Sticky Header */}
      <div 
        className={`fixed top-0 left-0 right-0 w-full max-w-md mx-auto z-40 transition-all duration-300 ease-in-out px-6 flex justify-between items-center ${
          isScrolled 
            ? 'bg-stone-50/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm py-3 border-b border-gray-100 dark:border-slate-800' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="flex flex-col">
           <span className={`text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100 mb-1'}`}>
             Welcome Back
           </span>
           <h1 className={`font-bold text-slate-800 dark:text-slate-100 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-3xl'}`}>
             {isScrolled ? 'QuranVoc 80' : 'Assalamu Alaikum'}
           </h1>
        </div>
        <button 
          onClick={() => onNavigate('settings')}
          className={`rounded-full p-2 transition-colors ${isScrolled ? 'bg-gray-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-800 shadow-sm'}`}
        >
          <User size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Spacer for content below fixed header */}
      <div className="h-24"></div>

      <div className="px-6 space-y-8">
        
        {/* Hero Progress Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-xl shadow-emerald-900/20 group">
          <div className="absolute inset-0 bg-pattern opacity-20"></div>
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 p-6 flex flex-col items-center">
             <div className="relative w-40 h-40 mb-6 mt-2">
                {/* Background Circle */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                    className="text-amber-400 transition-all duration-1000 ease-out"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * calculatedPercentage / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold tracking-tight">{calculatedPercentage}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 opacity-80">Quranic Text</span>
                </div>
             </div>
             
             {/* Stats Row */}
             <div className="flex w-full justify-between items-center border-t border-white/10 pt-5">
                <div className="text-center">
                  <p className="text-2xl font-bold">{learnedCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-200 opacity-80">Words</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalWords}</p>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-200 opacity-80">Total</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-2xl font-bold">{progress.streakDays}</p>
                    <Flame size={16} className="text-amber-400 fill-amber-400" />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-200 opacity-80">Streak</p>
                </div>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
           <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-1 flex items-center gap-2">
             <Zap size={18} className="text-amber-500 fill-amber-500" /> Quick Actions
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  onSelectModule(nextModuleId);
                  onNavigate('learn');
                }}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-start hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all active:scale-[0.98] group"
              >
                 <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400 mb-3 group-hover:rotate-6 transition-transform">
                    <BookOpen size={24} />
                 </div>
                 <div className="text-left">
                   <span className="block font-bold text-gray-800 dark:text-gray-100 text-lg">Continue</span>
                   <span className="text-xs text-gray-500 dark:text-gray-400">Module {nextModuleId}</span>
                 </div>
              </button>

              <button 
                onClick={() => onNavigate('quiz')}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-start hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all active:scale-[0.98] group"
              >
                 <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400 mb-3 group-hover:-rotate-6 transition-transform">
                    <Brain size={24} />
                 </div>
                 <div className="text-left">
                   <span className="block font-bold text-gray-800 dark:text-gray-100 text-lg">Daily Quiz</span>
                   <span className="text-xs text-gray-500 dark:text-gray-400">Test knowledge</span>
                 </div>
              </button>
           </div>
        </div>

        {/* Learning Path */}
        <div>
           <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">Learning Path</h3>
           <div className="space-y-4">
             {MODULES.map((module, idx) => {
                const moduleWords = VOCABULARY.filter(w => w.moduleId === module.id);
                const learnedInModule = moduleWords.filter(w => progress.learnedWordIds.includes(w.id)).length;
                const percent = Math.round((learnedInModule / moduleWords.length) * 100);
                const isLocked = idx > 0 && Math.round((VOCABULARY.filter(w => w.moduleId === MODULES[idx-1].id && progress.learnedWordIds.includes(w.id)).length / VOCABULARY.filter(w => w.moduleId === MODULES[idx-1].id).length) * 100) < 50;

                return (
                  <div 
                    key={module.id} 
                    onClick={() => {
                      // Optional: prevent click if locked, for now allowing free exploration
                      onSelectModule(module.id);
                      onNavigate('learn');
                    }}
                    className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all relative overflow-hidden group cursor-pointer active:scale-[0.99] ${isLocked ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'}`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${module.color}`}></div>
                    
                    <div className="flex justify-between items-start mb-3 pl-2">
                       <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">Module {module.id}</span>
                          <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight">{module.title}</h4>
                       </div>
                       <div className="text-right">
                          <span className={`text-xl font-bold ${percent === 100 ? 'text-emerald-500' : 'text-gray-800 dark:text-gray-200'}`}>{percent}%</span>
                       </div>
                    </div>
                    
                    <div className="pl-2">
                       <ProgressBar percentage={percent} colorClass={module.color.replace('bg-', 'bg-')} heightClass="h-2" />
                       <p className="text-xs text-gray-400 mt-2 truncate">{module.description}</p>
                    </div>
                  </div>
                );
             })}
           </div>
        </div>

        {/* Weekly Chart */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">Weekly Focus</h3>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'M', val: 15 }, { day: 'T', val: 25 }, { day: 'W', val: 10 }, 
                { day: 'T', val: 30 }, { day: 'F', val: 20 }, { day: 'S', val: 45 }, { day: 'S', val: 10 }
              ]}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#1E293B', color: '#fff' }} 
                />
                <Bar dataKey="val" radius={[6, 6, 6, 6]} barSize={24}>
                  {
                    [0,1,2,3,4,5,6].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#10B981' : '#E2E8F0'} className="dark:fill-slate-700 dark:[&.recharts-rectangle]:fill-emerald-500" />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

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
      <div className="pb-32 p-4 animate-fade-in-up">
         <div className="sticky top-0 bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-sm z-30 pt-safe pb-4 mb-4 border-b border-gray-200 dark:border-slate-800">
           <button 
             onClick={() => setSelectedModule(null)}
             className="flex items-center text-gray-500 dark:text-gray-400 mb-2 hover:text-islamic-primary transition-colors pl-2"
           >
             <ArrowRight className="rotate-180 mr-1" size={18} />
             Back
           </button>
           <div className="px-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{MODULES.find(m => m.id === selectedModule)?.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{words.length} Words</p>
           </div>
         </div>
         
         <div className="space-y-8 px-2">
           {categories.map(category => (
             <div key={category}>
               <h3 className="text-lg font-bold text-islamic-dark dark:text-emerald-400 border-l-4 border-islamic-gold pl-3 mb-4">{category}</h3>
               <div className="space-y-3">
                 {groupedWords[category].map(word => (
                   <div key={word.id} className="relative">
                     <WordCard word={word} showUrdu={showUrdu} />
                     {learnedWordIds.includes(word.id) && (
                        <div className="absolute top-2 right-2 bg-white dark:bg-slate-700 rounded-full p-0.5 shadow-sm">
                           <CheckCircle2 size={18} className="text-islamic-primary fill-islamic-light dark:fill-emerald-900" />
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
    <div className="space-y-6 pb-32 p-4 animate-fade-in-up">
       <div className="flex justify-between items-center mt-2 px-2">
         <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Browse Content</h1>
       </div>
       
       <div className="grid gap-4 px-2">
         {MODULES.map(module => (
           <button 
             key={module.id} 
             onClick={() => setSelectedModule(module.id)}
             className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm text-left hover:border-islamic-primary hover:shadow-md transition-all group relative overflow-hidden"
           >
             <div className={`absolute top-0 left-0 w-1 h-full ${module.color}`}></div>
             <div className="flex items-start justify-between">
               <div>
                 <span className={`inline-block px-2 py-1 rounded text-[10px] uppercase tracking-wider text-white font-bold mb-2 ${module.color}`}>
                   Module {module.id}
                 </span>
                 <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-islamic-primary transition-colors">{module.title}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{module.description}</p>
               </div>
               <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-full group-hover:bg-islamic-light dark:group-hover:bg-emerald-900/30 transition-colors">
                  <ArrowRight size={20} className="text-gray-400 dark:text-gray-500 group-hover:text-islamic-primary" />
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-fade-in-up">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
           <Trophy size={64} className="text-islamic-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Session Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">You've reviewed all available cards for now. Come back tomorrow to keep your streak!</p>
        <button 
          onClick={restart}
          className="bg-islamic-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95 transition-transform"
        >
          Review Again
        </button>
      </div>
    );
  }

  if (!currentWord) return <div className="p-10 text-center text-gray-500">No words loaded.</div>;

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] pb-24 p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mt-2 mb-6">
         <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Flashcards</h1>
         <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
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
           className="bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/30 text-red-500 py-4 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex flex-col items-center justify-center shadow-sm"
         >
           <RefreshCcw size={20} className="mb-1" />
           Review Again
         </button>
         <button 
           onClick={() => handleNext(true)}
           className="bg-islamic-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 hover:bg-islamic-dark transition-colors flex flex-col items-center justify-center"
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-fade-in-up relative">
        <Confetti />
        <div className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-full mb-6 ring-8 ring-amber-50 dark:ring-amber-900/10">
           <Trophy size={64} className="text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz Finished!</h2>
        <p className="text-4xl font-bold text-islamic-primary mb-2">{score} / {quizQuestions.length}</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Streak updated & Score saved!</p>
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
    <div className="flex flex-col min-h-[calc(100vh-100px)] pb-24 p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mt-2 mb-8">
         <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Quiz</h1>
         <span className="text-sm font-medium bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-gray-500 dark:text-gray-400">
           {qIndex + 1} / {quizQuestions.length}
         </span>
      </div>

      <div className="text-center mb-10 flex-1 flex flex-col justify-center">
         <h2 className="text-6xl font-arabic text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">{currentQ.correctWord.arabic}</h2>
         <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">Select the correct meaning</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {currentQ.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt)}
            className="bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 p-4 rounded-xl text-lg font-medium text-gray-700 dark:text-gray-200 hover:border-islamic-primary hover:bg-islamic-light/30 dark:hover:bg-slate-700 transition-all text-left shadow-sm active:scale-[0.99]"
          >
            {opt.english} {showUrdu && <span className="text-gray-400 dark:text-gray-500 text-sm font-urdu ml-2">({opt.urdu})</span>}
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
  darkMode: boolean,
  setDarkMode: (val: boolean) => void,
  onReset: () => void
}> = ({ showUrdu, setShowUrdu, reminderTime, setReminderTime, darkMode, setDarkMode, onReset }) => (
  <div className="space-y-6 pb-32 p-4 animate-fade-in-up">
     <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">Settings</h1>
     
     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden divide-y divide-gray-100 dark:divide-slate-700">
        
        {/* Dark Mode Toggle */}
        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg text-slate-600 dark:text-slate-300">
               {darkMode ? <Moon size={20} /> : <Sun size={20} />}
             </div>
             <span className="font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
             <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
             <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-islamic-primary"></div>
           </label>
        </div>

        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-500"><SettingsIcon size={20} /></div>
             <span className="font-medium text-gray-700 dark:text-gray-200">Urdu Translations</span>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
             <input type="checkbox" className="sr-only peer" checked={showUrdu} onChange={() => setShowUrdu(!showUrdu)} />
             <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-islamic-primary"></div>
           </label>
        </div>

        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg text-amber-500"><Bell size={20} /></div>
             <span className="font-medium text-gray-700 dark:text-gray-200">Daily Reminder</span>
           </div>
           <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-lg px-2 border border-gray-200 dark:border-slate-600">
             <Clock size={14} className="text-gray-400 mr-2" />
             <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-0 p-1 outline-none dark:[color-scheme:dark]"
             />
           </div>
        </div>

        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-red-500"><RefreshCcw size={20} /></div>
             <span className="font-medium text-gray-700 dark:text-gray-200">Reset Progress</span>
           </div>
           <button 
              onClick={() => {
                if(confirm("Are you sure? This will delete all progress.")) {
                  onReset();
                }
              }}
              className="text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded transition-colors"
           >
              Reset
           </button>
        </div>
     </div>

     <div className="bg-islamic-cream dark:bg-slate-800 border border-islamic-primary/20 dark:border-slate-700 p-6 rounded-xl text-center">
        <h3 className="font-bold text-islamic-dark dark:text-emerald-400 mb-2">About 80% Quranic Words</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This vocabulary list is based on the statistical analysis of Quranic words by Dr. Abdulazeez Abdulraheem (Understand Quran Academy). By learning these words, you can understand approximately 80% of the Holy Quran's text.
        </p>
        <p className="text-xs text-gray-400">Version 1.2.0 (Dark Mode)</p>
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

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quranvoc_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.darkMode !== undefined ? parsed.darkMode : false;
      }
      // Check system preference if no setting saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {}
    return false;
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

  // Apply Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save progress & settings whenever they change
  useEffect(() => {
    localStorage.setItem('quranvoc_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('quranvoc_settings', JSON.stringify({ reminderTime, showUrdu, darkMode }));
  }, [reminderTime, showUrdu, darkMode]);

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
    <div className="min-h-screen font-sans text-gray-900 dark:text-gray-100 bg-stone-50 dark:bg-slate-950 transition-colors duration-300 md:flex md:justify-center">
       {/* Main App Wrapper - Removing overflow-hidden to allow native scrolling */}
       <div className="w-full max-w-md bg-stone-50 dark:bg-slate-950 min-h-screen shadow-2xl shadow-black/20 relative">
          
          {showOnboarding && <OnboardingView onComplete={completeOnboarding} />}

          {/* Main Content Area - Padding top for status bar spacing if needed, but flex grow ensures it fills */}
          <main className="h-full">
            {currentTab === 'home' && (
              <HomeView 
                progress={progress}
                calculatedPercentage={calculatedPercentage}
                learnedCount={learnedCount}
                totalWords={totalWords}
                onNavigate={setCurrentTab}
                onSelectModule={setSelectedModule}
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
                darkMode={darkMode}
                setDarkMode={setDarkMode}
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