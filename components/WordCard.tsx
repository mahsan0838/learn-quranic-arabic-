import React, { useState } from 'react';
import { Word } from '../types';
import { Volume2, BookOpen, Fingerprint } from 'lucide-react';

interface WordCardProps {
  word: Word;
  showUrdu: boolean;
  isFlashcard?: boolean;
  onFlip?: () => void;
  isFlipped?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  showUrdu, 
  isFlashcard = false,
  onFlip,
  isFlipped = false
}) => {
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9; 
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-Speech not supported in this browser.");
    }
  };

  if (isFlashcard) {
    return (
      <div 
        onClick={onFlip}
        className="w-full h-96 relative cursor-pointer perspective-1000 group"
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front Face */}
          <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg dark:shadow-slate-900/50 flex flex-col items-center justify-center p-6 text-center hover:border-islamic-primary transition-colors">
             <span className="absolute top-4 right-4 text-xs font-medium text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded">
               Tap to flip
             </span>
             <h3 className="text-6xl font-arabic text-gray-800 dark:text-gray-100 mb-8 leading-relaxed">{word.arabic}</h3>
             <button 
                onClick={playAudio} 
                className="mt-2 p-4 bg-islamic-light dark:bg-emerald-900/30 text-islamic-primary dark:text-emerald-400 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors shadow-sm active:scale-95"
                aria-label="Play pronunciation"
             >
                <Volume2 size={28} />
             </button>
             <div className="absolute bottom-6 flex space-x-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider px-2 py-1 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-100 dark:border-slate-600">{word.subCategory || word.category}</span>
             </div>
          </div>

          {/* Back Face */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-islamic-dark dark:bg-slate-900 border border-islamic-dark dark:border-slate-700 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 text-center overflow-y-auto hide-scrollbar">
            <h4 className="text-3xl font-bold mb-2 text-white dark:text-gray-100">{word.english}</h4>
            {showUrdu && (
               <p className="text-2xl font-urdu text-islamic-gold mt-1 mb-4">{word.urdu}</p>
            )}
            
            <div className="space-y-1 text-emerald-100/80 dark:text-slate-400 text-sm mb-4">
              {word.root && (
                 <div className="flex items-center justify-center space-x-1 mb-2">
                   <Fingerprint size={12} className="text-emerald-400" />
                   <p className="tracking-widest font-arabic text-lg text-emerald-300 dark:text-emerald-500">[{word.root}]</p>
                 </div>
              )}
              {word.grammar && <p>Grammar: <span className="font-semibold text-white dark:text-gray-200">{word.grammar}</span></p>}
              <p>Occurrences: <span className="font-semibold text-white dark:text-gray-200">{word.frequency}</span></p>
            </div>

            {word.exampleVerse && (
              <div className="mt-2 pt-4 border-t border-emerald-800 dark:border-slate-700 w-full">
                <div className="bg-emerald-900/30 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="font-arabic text-xl text-emerald-50 dark:text-gray-200 mb-2 leading-loose" dir="rtl">
                    {word.exampleVerse.arabic}
                  </p>
                  <p className="text-xs text-emerald-200/90 dark:text-slate-400 italic">
                    "{word.exampleVerse.english}"
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-1 uppercase tracking-widest text-right">
                    {word.exampleVerse.reference}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard List View Card
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-islamic-cream dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
             <span className="text-2xl font-arabic text-islamic-dark dark:text-emerald-400">{word.arabic}</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100">{word.english}</h4>
            {showUrdu && <p className="font-urdu text-gray-600 dark:text-gray-400 text-sm mt-0.5">{word.urdu}</p>}
            <div className="flex flex-wrap gap-2 mt-1">
               <span className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide">{word.category}</span>
               {word.root && (
                 <span className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-arabic border border-emerald-100 dark:border-emerald-900/30">{word.root}</span>
               )}
               {word.grammar && <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{word.grammar}</span>}
            </div>
          </div>
        </div>
        
        <button 
          onClick={playAudio}
          className="p-2 text-gray-400 dark:text-slate-500 hover:text-islamic-primary dark:hover:text-emerald-400 hover:bg-islamic-light dark:hover:bg-slate-700 rounded-full transition-colors active:scale-95"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Verse Context in List View */}
      {word.exampleVerse && (
        <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-700/50">
          <div className="bg-islamic-light/20 dark:bg-slate-900/50 rounded-lg p-3 border border-islamic-light/50 dark:border-slate-700 relative overflow-hidden">
            {/* Decorative watermark icon */}
            <BookOpen className="absolute -right-2 -bottom-2 text-islamic-primary/5 dark:text-white/5 w-12 h-12" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start gap-3">
                <span className="text-[10px] font-bold text-islamic-dark/60 dark:text-emerald-400/60 uppercase tracking-wider mt-1 shrink-0">Example</span>
                <p className="font-arabic text-lg text-gray-800 dark:text-gray-200 text-right leading-loose" dir="rtl">{word.exampleVerse.arabic}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 pl-12 text-left italic">
                "{word.exampleVerse.english}" 
                <span className="text-islamic-primary/60 dark:text-emerald-500/60 not-italic ml-2 text-[10px] font-semibold">({word.exampleVerse.reference})</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCard;