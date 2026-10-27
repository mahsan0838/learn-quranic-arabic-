import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import data from '../data/conjugation.json';
import { buildConjugationDrill, type ConjugationData, type DrillQuestion } from '../lib/conjugation';
import { finishQuiz, type RewardResult } from '../lib/store';
import { Seg } from '../components/Seg';
import { Ring, CountUp } from '../components/Ring';
import { Icon } from '../components/Icon';

type Gender = 'masculine' | 'feminine';
type Tab = 'tables' | 'drill';

// Lets the Practice page open this screen straight on the drill.
let pendingTab: Tab | null = null;
export const requestVerbTab = (tab: Tab) => {
  pendingTab = tab;
};

type Row = { en: string; ar: string; number: string };
type Block = {
  active: { pronoun: string; past: string; pastEn: string; present: string; presentEn: string; suffix: string }[];
  imperative: Row[];
  negativeImperative: Row[];
  passive: { past: string; pastEn: string; present: string; presentEn: string };
  participles: { active: Participle; passive: Participle };
  verbalNoun: { ar: string; en: string };
};
type Participle = { singular: string; dual: string; plural: string; en: string };
const table = data as unknown as Record<Gender, Block> & { _source: string };

export function Verbs() {
  const [tab, setTab] = useState<Tab>(() => {
    const t = pendingTab ?? 'tables';
    pendingTab = null;
    return t;
  });
  const [gender, setGender] = useState<Gender>('masculine');

  return (
    <div className="verbs">
      <header className="page-head">
        <p className="eyebrow">فَعَلَ · “to do”</p>
        <h1 className="display">Verb tables</h1>
        <p className="lede">
          Every regular Arabic verb follows the pattern of فَعَلَ. Learn it once, and each verb in the library unlocks. From pages 35–38 of the booklet.
        </p>
      </header>

      <div className="toolbar">
        <Seg<Tab>
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'tables', label: 'Tables' },
            { value: 'drill', label: 'Drill' },
          ]}
        />
        {tab === 'tables' && (
          <Seg<Gender>
            label="Gender"
            value={gender}
            onChange={setGender}
            options={[
              { value: 'masculine', label: 'Masculine' },
              { value: 'feminine', label: 'Feminine' },
            ]}
          />
        )}
        <a href="#/library" className="btn btn--quiet btn--sm">
          <Icon name="back" size={16} /> Library
        </a>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab + (tab === 'tables' ? gender : '')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {tab === 'tables' ? <Tables gender={gender} /> : <Drill />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Tables({ gender }: { gender: Gender }) {
  const g = table[gender];
  return (
    <div className="tables">
      <section className="card table-card">
        <h2 className="display">Past &amp; present</h2>
        <div className="ct">
          <div className="ct-row ct-head">
            <span>Pronoun</span>
            <span>Past</span>
            <span>Present / future</span>
          </div>
          {g.active.map((r) => (
            <div key={r.pronoun + r.past} className="ct-row">
              <span className="arabic ct-pron" lang="ar">
                {r.pronoun}
              </span>
              <span className="ct-cell">
                <span className="arabic ct-ar" lang="ar">
                  {r.past}
                </span>
                <span className="ct-en">{r.pastEn}</span>
              </span>
              <span className="ct-cell">
                <span className="arabic ct-ar" lang="ar">
                  {r.present}
                </span>
                <span className="ct-en">{r.presentEn}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card table-card">
        <h2 className="display">Commands</h2>
        <div className="ct">
          <div className="ct-row ct-head">
            <span>Number</span>
            <span>Do!</span>
            <span>Don’t!</span>
          </div>
          {g.imperative.map((r) => {
            const neg = g.negativeImperative.find((n) => n.number === r.number)!;
            return (
              <div key={r.ar} className="ct-row">
                <span className="ct-num">{r.number}</span>
                <span className="ct-cell">
                  <span className="arabic ct-ar" lang="ar">
                    {r.ar}
                  </span>
                  <span className="ct-en">{r.en}</span>
                </span>
                <span className="ct-cell">
                  <span className="arabic ct-ar" lang="ar">
                    {neg.ar}
                  </span>
                  <span className="ct-en">{neg.en}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card table-card">
        <h2 className="display">Passive voice</h2>
        <div className="ct">
          <div className="ct-row ct-row--two">
            <span className="ct-cell">
              <span className="arabic ct-ar" lang="ar">
                {g.passive.past}
              </span>
              <span className="ct-en">{g.passive.pastEn}</span>
            </span>
            <span className="ct-cell">
              <span className="arabic ct-ar" lang="ar">
                {g.passive.present}
              </span>
              <span className="ct-en">{g.passive.presentEn}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <h2 className="display">Participles &amp; verbal noun</h2>
        <div className="ct">
          <div className="ct-row ct-head">
            <span />
            <span>Doer</span>
            <span>The one affected</span>
          </div>
          {(['singular', 'dual', 'plural'] as const).map((n) => (
            <div key={n} className="ct-row">
              <span className="ct-num">{n}</span>
              <span className="ct-cell">
                <span className="arabic ct-ar" lang="ar">
                  {g.participles.active[n]}
                </span>
              </span>
              <span className="ct-cell">
                <span className="arabic ct-ar" lang="ar">
                  {g.participles.passive[n]}
                </span>
              </span>
            </div>
          ))}
          <div className="ct-row">
            <span className="ct-num">noun of action</span>
            <span className="ct-cell">
              <span className="arabic ct-ar" lang="ar">
                {g.verbalNoun.ar}
              </span>
              <span className="ct-en">{g.verbalNoun.en}</span>
            </span>
            <span />
          </div>
        </div>
      </section>
    </div>
  );
}

function Drill() {
  const [questions, setQuestions] = useState<DrillQuestion[]>(() => buildConjugationDrill(data as unknown as ConjugationData));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [reward, setReward] = useState<RewardResult | null>(null);

  const q = questions[index];

  const restart = () => {
    setQuestions(buildConjugationDrill(data as unknown as ConjugationData));
    setIndex(0);
    setScore(0);
    setPicked(null);
    setReward(null);
  };

  if (reward) {
    return (
      <div className="study-empty card card--glow">
        <p className="eyebrow">Drill complete</p>
        <Ring value={score / questions.length} size={170} stroke={9} label={`${score} of ${questions.length}`}>
          <span className="ring-big display">
            <CountUp value={score} />
            <small>/{questions.length}</small>
          </span>
        </Ring>
        <p>+{reward.xpGained} XP earned.</p>
        <button type="button" className="btn btn--gold" onClick={restart}>
          Drill again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="eyebrow">
        Question {index + 1} of {questions.length} · Score {score}
      </p>
      <div className="card card--glow prompt">
        <p className="eyebrow">
          {q.gender === 'masculine' ? 'Masculine' : 'Feminine'} · {q.tense}
        </p>
        <p className="arabic prompt-ar" lang="ar">
          {q.pronoun}
        </p>
        <p className="prompt-hint">“{q.meaning}”</p>
      </div>
      <div className="options">
        {q.options.map((o, i) => {
          const state = picked === null ? '' : o === q.answer ? 'right' : o === picked ? 'wrong' : 'dim';
          return (
            <button
              key={o}
              type="button"
              className={`option ${state ? `option--${state}` : ''}`}
              disabled={picked !== null}
              onClick={() => {
                setPicked(o);
                if (o === q.answer) setScore((s) => s + 1);
              }}
            >
              <kbd>{i + 1}</kbd>
              <span className="arabic option-ar" lang="ar">
                {o}
              </span>
              {state === 'right' && <Icon name="check" size={20} />}
            </button>
          );
        })}
      </div>
      <div className="quiz-foot">
        {picked !== null && (
          <button
            type="button"
            className="btn btn--gold btn--lg"
            onClick={() => {
              if (index < questions.length - 1) {
                setIndex(index + 1);
                setPicked(null);
              } else {
                setReward(finishQuiz(score, questions.length, 'verbs'));
              }
            }}
          >
            {index < questions.length - 1 ? 'Next' : 'See results'} <Icon name="chevron" size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
