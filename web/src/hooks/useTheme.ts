import { useEffect } from 'react';
import { useStore } from '../lib/store';

// Keeps <html data-theme> in sync with the saved preference (and the OS when set to auto).
export function useTheme() {
  const theme = useStore((s) => s.prefs.theme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const apply = () => {
      const dark = theme === 'night' || (theme === 'auto' && !media.matches);
      document.documentElement.dataset.theme = dark ? 'night' : 'parchment';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#06130e' : '#f3ead2');
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
}
