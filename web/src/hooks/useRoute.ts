import { useCallback, useEffect, useState } from 'react';

export type RouteName = 'today' | 'study' | 'library' | 'practice' | 'progress' | 'settings' | 'verbs';
const ROUTES: RouteName[] = ['today', 'study', 'library', 'practice', 'progress', 'settings', 'verbs'];

const read = (): RouteName => {
  const name = window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0] as RouteName;
  return ROUTES.includes(name) ? name : 'today';
};

// A tiny hash router: enough for seven screens, and it works offline and on any static host.
export function useRoute(): [RouteName, (to: RouteName) => void] {
  const [route, setRoute] = useState<RouteName>(read);

  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const go = useCallback((to: RouteName) => {
    window.location.hash = `#/${to}`;
  }, []);

  return [route, go];
}
