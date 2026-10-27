import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { buildQuiz, weakWords, type Direction, type QuizQuestion } from '../lib/quiz';
import { ALL_WORDS, MODULES } from '../lib/words';
import { finishQuiz, getState, useStore, type RewardResult } from '../lib/store';
import { Seg } from '../components/Seg';
import { Ring, CountUp } from '../components/Ring';
import { Icon } from '../components/Icon';
import { requestVerbTab } from './Verbs';

type Scope = 'all' | 'weak' | 1 | 2 | 3;

export function Practice() {
  const srs = useStore((s) => s.srs);
  const [direction, setDirection] = useState<Direction>('toMeaning');
  const [scope, setScope] = useState<Scope>('all');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);

  const weak = weakWords(ALL_WORDS, srs);
  const canStart = scope !== 'weak' || weak.length >= 4;

  const start = useCallback(() => {
    const source = scope === 'all' ? ALL_WORDS : scope === 'weak' ? weakWords(ALL_WORDS, getState().srs) : MODULES[scope - 1].words;
    setQuiz(buildQuiz(source, 10, 4, { direction, pool: ALL_WORDS }));
  }, [direction, scope]);

  if (quiz) return <QuizRun questions={quiz} scope={String(scope)} onExit={() => setQuiz(null)} onAgain={start} />;

  return (
    <div className="practice">
      <header className="page-head">
        <p className="eyebrow">Test what you know</p>
        <h1 className="display">Practice</h1>
        <p className="lede">Ten questions, four choices. Correct answers earn XP, and a perfect round earns a bonus.</p>
      </header>

      <div className="practice-grid">
        <section className="card card--glow setup">
          <h2 className="display">Word quiz</h2>

          <div className="field">
            <span className="field-label">Question</span>
            <Seg
              label="Question direction"
              value={direction}
              onChange={setDirection}
              options={[
                { value: 'toMeaning', label: 'Arabic → meaning' },
                { value: 'toArabic', label: 'Meaning → Arabic' },
              ]}
            />
          </div>

          <div className="field">
            <span className="field-label">Words</span>
            <Seg<Scope>
              label="Word scope"
              value={scope}
              onChange={setScope}
              options={[
                { value: 'all', label: 'All' },
                { value: 1, label: 'I' },
                { value: 2, label: 'II' },
                { value: 3, label: 'III' },
                { value: 'weak', label: `Weak (${weak.length})` },
              ]}
            />
            {scope === 'weak' && (
              <p className="field-hint">
                {canStart ? 'Words you have missed or are still learning.' : 'Study a few cards first. Four weak words are needed.'}
              </p>
            )}
          </div>

          <button type="button" className="btn btn--gold btn--lg" disabled={!canStart} onClick={start}>
            Start quiz <Icon name="chevron" size={18} />
          </button>
        </section>

        <section className="card card--link drill-card">
          <p className="eyebrow">Grammar</p>
          <h2 className="display">Verb conjugation drill</h2>
          <p>Match each pronoun to the right past or present form of فَعَلَ, straight from the booklet’s tables.</p>
          <a
            href="#/verbs"
            className="btn btn--ghost"
            onClick={() => requestVerbTab('drill')}
          >
            Open the drill <Icon name="chevron" size={16} />
          </a>
        </section>
      </div>
    </div>
  );
}

function QuizRun({ questions, scope, onExit, onAgain }: { questions: QuizQuestion[]; scope: string; onExit: () => void; onAgain: () => void }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [reward, setReward] = useState<RewardResult | null>(null);

  const q = questions[index];
  const done = reward !== null;
  const toArabic = q.direction === 'toArabic';

  const choose = useCallback(
    (option: string) => {
      if (picked !== null) return;
      setPicked(option);
      if (option === q.answer) setScore((s) => s + 1);
    },
    [picked, q.answer]
  );

  const next = useCallback(() => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setPicked(null);
    } else {
      setReward(finishQuiz(score, questions.length, scope));
    }
  }, [index, questions.length, score, scope]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) choose(q.options[n - 1]);
      if ((e.key === 'Enter' || e.key === ' ') && picked !== null) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, next, picked, q, done]);

  if (done) {
    const pct = score / questions.length;
    return (
      <motion.div className="study-empty card card--glow" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <p className="eyebrow">Quiz complete</p>
        <Ring value={pct} size={190} stroke={10} label={`${score} of ${questions.length} correct`}>
          <span className="ring-big display">
            <CountUp value={score} />
            <small>/{questions.length}</small>
          </span>
        </Ring>
        <h1 className="display">{pct === 1 ? 'Flawless.' : pct >= 0.7 ? 'Well done.' : 'Every round teaches.'}</h1>
        <p>+{reward.xpGained} XP earned.</p>
        <div className="row">
          <button type="button" className="btn btn--gold" onClick={onAgain}>
            Same quiz again
          </button>
          <button type="button" className="btn btn--ghost" onClick={onExit}>
            Change settings
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="quiz">
      <header className="study-head">
        <div>
          <p className="eyebrow">Question {index + 1} of {questions.length}</p>
          <p className="num study-count">Score {score}</p>
        </div>
        <div className="bar bar--wide">
          <motion.i animate={{ width: `${(index / questions.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
        <button type="button" className="btn btn--quiet btn--sm" onClick={onExit}>
          Quit
        </button>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="card card--glow prompt">
            <p className="eyebrow">{toArabic ? 'Which Arabic word means' : 'What does this mean'}</p>
            {toArabic ? <p className="display prompt-en">{q.prompt}</p> : <p className="arabic prompt-ar" lang="ar">{q.prompt}</p>}
            <p className="prompt-hint">{q.hint}</p>
          </div>

          <div className="options">
            {q.options.map((o, i) => {
              const state = picked === null ? '' : o === q.answer ? 'right' : o === picked ? 'wrong' : 'dim';
              return (
                <motion.button
                  key={o}
                  type="button"
                  className={`option ${state ? `option--${state}` : ''}`}
                  onClick={() => choose(o)}
                  disabled={picked !== null}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, x: state === 'wrong' ? [0, -7, 7, -4, 4, 0] : 0 }}
                  transition={{ delay: picked === null ? i * 0.06 : 0, duration: state === 'wrong' ? 0.42 : 0.4 }}
                >
                  <kbd>{i + 1}</kbd>
                  <span className={toArabic ? 'arabic option-ar' : 'option-text'} lang={toArabic ? 'ar' : undefined}>
                    {o}
                  </span>
                  {state === 'right' && <Icon name="check" size={20} />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="quiz-foot">
        {picked !== null && (
          <motion.button
            type="button"
            className="btn btn--gold btn--lg"
            onClick={next}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {index < questions.length - 1 ? 'Next question' : 'See results'} <Icon name="chevron" size={18} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
