import { useMemo } from 'react';
import { motion, type Variants } from 'motion/react';
import { Ring, CountUp } from '../components/Ring';
import { Icon } from '../components/Icon';
import { Ornament } from '../components/Ornament';
import { InstallCard } from '../components/Install';
import { dashboard, useStore } from '../lib/store';
import { levelProgress, titleFor, DAILY_GOAL } from '../lib/gamification';
import { isKnown } from '../lib/srs';
import { CURRICULUM, MODULES, TARGET_COVERAGE, TOTAL_WORDS, sectionOf } from '../lib/words';

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Peace for the night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

export function Today() {
  const state = useStore((s) => s);
  const d = useMemo(() => dashboard(state), [state]);
  const level = levelProgress(state.game.xp);
  const upNext = useMemo(() => CURRICULUM.filter((w) => !state.srs[w.id]).slice(0, 4), [state.srs]);
  const toReview = d.dueCount + Math.min(d.newCount, 10);
  const goalPct = Math.min(1, d.reviewsToday / DAILY_GOAL);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="today">
      <section className="hero">
        <motion.div variants={rise} className="hero-copy">
          <p className="eyebrow">{greeting()}</p>
          <p className="arabic hero-salaam" lang="ar">
            السَّلَامُ عَلَيْكُمْ
          </p>
          <h1 className="display hero-title">
            Understand the Qur’an,
            <br />
            <em>one word at a time.</em>
          </h1>
          <p className="hero-sub">
            You know <b className="num">{d.known.length}</b> of {TOTAL_WORDS} words. Each one opens more of the verses you already recite.
          </p>
          <div className="hero-actions">
            <a href="#/study" className="btn btn--gold btn--lg">
              {toReview > 0 ? 'Begin today’s session' : 'Practise cards'}
              <Icon name="chevron" size={18} />
            </a>
            <span className="hero-meta num">
              {d.dueCount} due · {Math.min(d.newCount, 10)} new
            </span>
          </div>
        </motion.div>

        <motion.div variants={rise} className="hero-ring card card--glow">
          <Ring value={d.coverage / TARGET_COVERAGE} size={236} stroke={11} label={`${d.coverage.toFixed(1)} percent of the Qur’an understood`}>
            <span className="ring-big display">
              <CountUp value={d.coverage} decimals={1} />
              <small>%</small>
            </span>
            <span className="ring-cap">of the Qur’an’s words</span>
          </Ring>
          <p className="ring-note">
            Goal: <b>{TARGET_COVERAGE}%</b> with all {TOTAL_WORDS} words
          </p>
        </motion.div>
      </section>

      <motion.div variants={rise}>
        <InstallCard />
      </motion.div>

      <motion.section variants={rise} className="stat-row" aria-label="Today at a glance">
        <div className="card stat">
          <div className="stat-ico stat-ico--flame">
            <Icon name="flame" size={22} />
          </div>
          <div>
            <div className="stat-num display num">
              <CountUp value={d.streak} />
            </div>
            <div className="stat-label">day streak</div>
          </div>
        </div>

        <div className="card stat">
          <Ring value={goalPct} size={58} stroke={5} tone="emerald" label="Daily goal">
            <Icon name="check" size={18} />
          </Ring>
          <div>
            <div className="stat-num display num">
              {d.reviewsToday}
              <small>/{DAILY_GOAL}</small>
            </div>
            <div className="stat-label">reviews today</div>
          </div>
        </div>

        <a href="#/progress" className="card stat card--link">
          <div className="stat-ico">
            <Icon name="sparkle" size={22} />
          </div>
          <div className="stat-grow">
            <div className="stat-num stat-title display">{titleFor(level.level)}</div>
            <div className="stat-label">
              Level {level.level} · {level.xpIntoLevel}/{level.xpForLevel} XP
            </div>
            <div className="bar">
              <i style={{ width: `${level.pct}%` }} />
            </div>
          </div>
        </a>
      </motion.section>

      <motion.section variants={rise} className="block">
        <header className="block-head">
          <h2 className="display">Your path</h2>
          <p>Three stages from the booklet, most frequent words first.</p>
        </header>
        <div className="module-grid">
          {MODULES.map((m, i) => {
            const known = m.words.filter((w) => isKnown(state.srs[w.id])).length;
            return (
              <a key={m.id} href="#/library" className="card card--link module">
                <span className="module-num display">{['I', 'II', 'III'][i]}</span>
                <h3 className="display">{m.name}</h3>
                <p>{m.description}</p>
                <div className="module-foot">
                  <div className="bar">
                    <i style={{ width: `${(known / m.words.length) * 100}%` }} />
                  </div>
                  <span className="num">
                    {known}/{m.words.length}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </motion.section>

      {upNext.length > 0 && (
        <motion.section variants={rise} className="block">
          <Ornament label="Up next" />
          <div className="upnext">
            {upNext.map((w) => (
              <div key={w.id} className="card upnext-card">
                <div className="arabic upnext-ar" lang="ar">
                  {w.arabic}
                </div>
                <div className="upnext-sec">{sectionOf(w)}</div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
