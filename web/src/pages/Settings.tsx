import { useState } from 'react';
import { Seg } from '../components/Seg';
import { Sheet } from '../components/Sheet';
import { Icon } from '../components/Icon';
import { InstallSteps } from '../components/Install';
import { useInstall } from '../hooks/useInstall';
import { resetProgress, setPrefs, useStore, type Theme } from '../lib/store';
import { HAS_URDU, TOTAL_WORDS } from '../lib/words';
import type { Language } from '../types';

export function Settings() {
  const prefs = useStore((s) => s.prefs);
  const { standalone, ios, canPrompt, install } = useInstall();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="settings">
      <header className="page-head">
        <p className="eyebrow">Make it yours</p>
        <h1 className="display">Settings</h1>
      </header>

      <section className="card setting">
        <div>
          <h2 className="display">Appearance</h2>
          <p>Night is easy on the eyes after Isha. Parchment is for daylight.</p>
        </div>
        <Seg<Theme>
          label="Theme"
          value={prefs.theme}
          onChange={(theme) => setPrefs({ theme })}
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'night', label: 'Night' },
            { value: 'parchment', label: 'Parchment' },
          ]}
        />
      </section>

      {HAS_URDU && (
        <section className="card setting">
          <div>
            <h2 className="display">Meaning language</h2>
            <p>Urdu glosses are a supplementary aid and have not yet been reviewed by a native speaker.</p>
          </div>
          <Seg<Language>
            label="Meaning language"
            value={prefs.language}
            onChange={(language) => setPrefs({ language })}
            options={[
              { value: 'english', label: 'English' },
              { value: 'urdu', label: 'اردو' },
            ]}
          />
        </section>
      )}

      <section className="card setting setting--stack">
        <div>
          <h2 className="display">Install the app</h2>
          <p>
            {standalone
              ? 'You are running QuranVoc as an installed app.'
              : 'Add QuranVoc to your phone or computer. It opens in its own window, works offline, and keeps your streak.'}
          </p>
        </div>
        {!standalone && (
          <>
            {canPrompt && (
              <button type="button" className="btn btn--gold" onClick={() => install()}>
                <Icon name="download" size={18} /> Install now
              </button>
            )}
            <div className="install-grid">
              <div>
                <h3>iPhone &amp; iPad</h3>
                <InstallSteps ios />
              </div>
              <div>
                <h3>Android &amp; desktop</h3>
                <InstallSteps ios={false} />
              </div>
            </div>
            {ios && <p className="muted">You are on iOS: use the Safari steps on the left.</p>}
          </>
        )}
      </section>

      <section className="card setting setting--stack">
        <div>
          <h2 className="display">About the words</h2>
          <p>
            All {TOTAL_WORDS} entries are transcribed from <i>80% of Qur’anic Words</i> by Dr. Abdulazeez Abdulraheem (Islamic Book Trust).
            The Arabic, English glosses and frequency counts follow the booklet. Please report any error you find so it can be corrected.
          </p>
        </div>
      </section>

      <section className="card setting">
        <div>
          <h2 className="display">Reset progress</h2>
          <p>Clears your cards, XP, streak and badges on this device. This cannot be undone.</p>
        </div>
        <button type="button" className="btn btn--danger" onClick={() => setConfirm(true)}>
          Reset…
        </button>
      </section>

      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Reset progress">
        <div className="detail">
          <h3 className="display sheet-title">Erase all progress?</h3>
          <p>Your reviewed words, XP, streak and badges will be removed from this device.</p>
          <div className="row">
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                resetProgress();
                setConfirm(false);
              }}
            >
              Yes, erase it
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirm(false)}>
              Keep my progress
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
