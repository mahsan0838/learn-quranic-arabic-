import { useMemo } from 'react';
import { motion } from 'motion/react';
import { BADGES, dateKey, levelProgress, shiftKey, titleFor } from '../lib/gamification';
import { isKnown } from '../lib/srs';
import { dashboard, quizAverage, useStore } from '../lib/store';
import { MODULES, TARGET_COVERAGE } from '../lib/words';
import { Ring, CountUp } from '../components/Ring';
import { Icon } from '../components/Icon';

const WEEKS = 18;

function Heatmap({ activity }: { activity: Record<string, number> }) {
  const cells = useMemo(() => {
    const today = dateKey();
    const todayDow = (new Date().getDay() + 6) % 7; // Monday = 0
    const total = WEEKS * 7;
    const start = shiftKey(today, -(total - 1 + (6 - todayDow)));
    const out: { key: string; n: number; future: boolean }[] = [];
    for (let i = 0; i < total + (6 - todayDow); i++) {
      const key = shiftKey(start, i);
      out.push({ key, n: activity[key] ?? 0, future: key > today });
    }
    return out;
  }, [activity]);

  const level = (n: number) => (n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4);
  return (
    <div className="heat" role="img" aria-label="Study activity over the last months">
      {cells.map((c) => (
        <span key={c.key} className={`heat-cell heat-${c.future ? 'future' : level(c.n)}`} title={`${c.key}: ${c.n}`} />
      ))}
    </div>
  );
}

export function Progress() {
  const state = useStore((s) => s);
  const d = useMemo(() => dashboard(state), [state]);
  const level = levelProgress(state.game.xp);

  return (
    <div className="progress">
      <header className="page-head">
        <p className="eyebrow">Your journey</p>
        <h1 className="display">Progress</h1>
      </header>

      <section className="progress-hero card card--glow">
        <Ring value={level.pct / 100} size={168} stroke={9} tone="emerald" label={`Level ${level.level}`}>
          <span className="ring-big display">{level.level}</span>
          <span className="ring-cap">level</span>
        </Ring>
        <div className="progress-hero-copy">
          <h2 className="display">{titleFor(level.level)}</h2>
          <p className="num">
            <CountUp value={state.game.xp} /> XP · {level.xpForLevel - level.xpIntoLevel} to the next level
          </p>
          <div className="bar bar--wide">
            <i style={{ width: `${level.pct}%` }} />
          </div>
        </div>
      </section>

      <section className="stat-grid">
        {[
          { label: 'Words known', value: d.known.length, suffix: '' },
          { label: 'Of the Qur’an', value: d.coverage, decimals: 1, suffix: '%' },
          { label: 'Day streak', value: d.streak, suffix: '' },
          { label: 'Longest streak', value: d.longestStreak, suffix: '' },
          { label: 'Cards reviewed', value: state.game.reviewsTotal, suffix: '' },
          { label: 'Quiz average', value: quizAverage(state), suffix: '%' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="card stat-tile"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="stat-num display">
              <CountUp value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
            </div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </section>

      <section className="card block-card">
        <h2 className="display">By stage</h2>
        <p className="muted">
          Reaching {TARGET_COVERAGE}% of the Qur’an takes all three stages.
        </p>
        <div className="stages">
          {MODULES.map((m, i) => {
            const known = m.words.filter((w) => isKnown(state.srs[w.id])).length;
            return (
              <div key={m.id} className="stage">
                <div className="stage-top">
                  <span>
                    <b className="display stage-roman">{['I', 'II', 'III'][i]}</b> {m.name}
                  </span>
                  <span className="num">
                    {known} / {m.words.length}
                  </span>
                </div>
                <div className="bar">
                  <motion.i initial={{ width: 0 }} animate={{ width: `${(known / m.words.length) * 100}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card block-card">
        <h2 className="display">Consistency</h2>
        <Heatmap activity={state.game.activity} />
        <div className="heat-legend">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`heat-cell heat-${l}`} />
          ))}
          More
        </div>
      </section>

      <section className="block">
        <h2 className="display block-title">Badges</h2>
        <div className="badges">
          {BADGES.map((b) => {
            const earned = state.game.badges.includes(b.id);
            return (
              <div key={b.id} className={`badge${earned ? '' : ' badge--locked'}`}>
                <div className="badge-emblem">{earned ? b.icon : <Icon name="lock" size={22} />}</div>
                <div className="badge-title">{b.title}</div>
                <div className="badge-desc">{b.description}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
