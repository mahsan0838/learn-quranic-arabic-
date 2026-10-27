import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Icon, type IconName } from './Icon';
import { StarMark } from './Ornament';
import { levelProgress, titleFor } from '../lib/gamification';
import { dashboard, useStore } from '../lib/store';
import type { RouteName } from '../hooks/useRoute';

const NAV: { route: RouteName; label: string; icon: IconName }[] = [
  { route: 'today', label: 'Today', icon: 'today' },
  { route: 'study', label: 'Study', icon: 'study' },
  { route: 'library', label: 'Library', icon: 'library' },
  { route: 'practice', label: 'Practice', icon: 'practice' },
  { route: 'progress', label: 'Progress', icon: 'progress' },
];

const activeNav = (route: RouteName): RouteName => (route === 'verbs' ? 'library' : route === 'settings' ? 'progress' : route);

function Brand() {
  return (
    <a className="brand" href="#/today" aria-label="QuranVoc 80, home">
      <StarMark size={40} />
      <span className="brand-text">
        <span className="brand-name display">
          QuranVoc <em>80</em>
        </span>
        <span className="brand-sub">Words of the Qur’an</span>
      </span>
    </a>
  );
}

export function Shell({ route, children }: { route: RouteName; children: ReactNode }) {
  const state = useStore((s) => s);
  const d = dashboard(state);
  const level = levelProgress(state.game.xp);
  const active = activeNav(route);

  return (
    <div className="shell">
      <aside className="sidebar">
        <Brand />
        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.route} href={`#/${item.route}`} className="nav-item" aria-current={active === item.route ? 'page' : undefined}>
              {active === item.route && (
                <motion.span layoutId="nav-active" className="nav-active" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
              )}
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="side-foot">
          <a href="#/progress" className="mini-level">
            <div className="mini-level-top">
              <span className="eyebrow">Level {level.level}</span>
              <span className="mini-streak">
                <Icon name="flame" size={15} /> {d.streak}
              </span>
            </div>
            <div className="mini-title display">{titleFor(level.level)}</div>
            <div className="bar">
              <i style={{ width: `${level.pct}%` }} />
            </div>
          </a>
          <a href="#/settings" className="nav-item nav-item--quiet" aria-current={route === 'settings' ? 'page' : undefined}>
            <Icon name="settings" />
            <span>Settings</span>
          </a>
        </div>
      </aside>

      <header className="topbar">
        <Brand />
        <div className="topbar-right">
          <span className="chip chip--flame" title="Day streak">
            <Icon name="flame" size={15} /> {d.streak}
          </span>
          <a href="#/settings" className="icon-btn" aria-label="Settings">
            <Icon name="settings" size={20} />
          </a>
        </div>
      </header>

      <main className="main">{children}</main>

      <nav className="tabbar" aria-label="Primary">
        {NAV.map((item) => (
          <a key={item.route} href={`#/${item.route}`} className="tab" aria-current={active === item.route ? 'page' : undefined}>
            {active === item.route && (
              <motion.span layoutId="tab-active" className="tab-active" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
            )}
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
