import { useCallback, useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const detectIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

let deferred: BeforeInstallPromptEvent | null = null;
const subscribers = new Set<() => void>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    subscribers.forEach((fn) => fn());
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    subscribers.forEach((fn) => fn());
  });
}

// Android and desktop Chrome/Edge fire `beforeinstallprompt`; iPhone/iPad Safari never do,
// so there we show "Share → Add to Home Screen" instructions instead.
export function useInstall() {
  const [, bump] = useState(0);
  useEffect(() => {
    const fn = () => bump((n) => n + 1);
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    deferred = null;
    subscribers.forEach((fn) => fn());
    return choice.outcome === 'accepted';
  }, []);

  const standalone = isStandalone();
  const ios = detectIOS();
  return {
    standalone,
    ios,
    canPrompt: !!deferred && !standalone,
    // Anything we can help install: a native prompt, or iOS manual steps.
    installable: !standalone && (!!deferred || ios),
    install,
  };
}
