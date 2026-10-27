import { useState } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';
import { Sheet } from './Sheet';
import { useInstall } from '../hooks/useInstall';
import { setPrefs, useStore } from '../lib/store';

export function InstallSteps({ ios }: { ios: boolean }) {
  return ios ? (
    <ol className="steps">
      <li>
        Tap the <span className="inline-ico"><Icon name="share" size={16} /></span> <b>Share</b> button in Safari.
      </li>
      <li>
        Scroll and choose <b>Add to Home Screen</b>.
      </li>
      <li>
        Tap <b>Add</b>. QuranVoc opens full-screen, works offline, and keeps your progress.
      </li>
    </ol>
  ) : (
    <ol className="steps">
      <li>
        In Chrome or Edge, open the menu (<b>⋮</b>) or look for the <span className="inline-ico"><Icon name="download" size={16} /></span> icon in the address bar.
      </li>
      <li>
        Choose <b>Install QuranVoc 80</b> (on Android: <b>Add to Home screen</b>).
      </li>
      <li>On a Mac, Safari offers <b>File → Add to Dock</b>.</li>
    </ol>
  );
}

// The prominent invitation on the Today screen.
export function InstallCard() {
  const { installable, canPrompt, ios, install } = useInstall();
  const dismissed = useStore((s) => s.prefs.installDismissed);
  const [help, setHelp] = useState(false);

  if (!installable || dismissed) return null;

  return (
    <>
      <motion.section
        className="install card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="install-mark" aria-hidden="true">
          <Icon name="download" size={26} />
        </div>
        <div className="install-copy">
          <h3 className="display">Keep it close</h3>
          <p>Install QuranVoc on your {ios ? 'iPhone' : 'phone or computer'}. It opens like an app, works without internet, and keeps your streak.</p>
        </div>
        <div className="install-actions">
          <button
            type="button"
            className="btn btn--gold"
            onClick={() => (canPrompt ? install() : setHelp(true))}
          >
            {canPrompt ? 'Install app' : 'How to install'}
          </button>
          <button type="button" className="btn btn--quiet" onClick={() => setPrefs({ installDismissed: true })}>
            Not now
          </button>
        </div>
      </motion.section>
      <Sheet open={help} onClose={() => setHelp(false)} title="Install QuranVoc">
        <div className="eyebrow">Install</div>
        <h3 className="display sheet-title">Add QuranVoc to your {ios ? 'Home Screen' : 'device'}</h3>
        <InstallSteps ios={ios} />
      </Sheet>
    </>
  );
}
