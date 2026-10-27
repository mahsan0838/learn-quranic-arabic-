import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Shell } from './components/Shell';
import { Toaster } from './components/Toaster';
import { Welcome } from './components/Welcome';
import { useRoute } from './hooks/useRoute';
import { useTheme } from './hooks/useTheme';
import { Today } from './pages/Today';
import { Study } from './pages/Study';
import { Library } from './pages/Library';
import { Practice } from './pages/Practice';
import { Verbs } from './pages/Verbs';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';

export function App() {
  useTheme();
  const [route] = useRoute();

  return (
    <MotionConfig reducedMotion="user">
      <Shell route={route}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={route}
            className="page"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {route === 'today' && <Today />}
            {route === 'study' && <Study />}
            {route === 'library' && <Library />}
            {route === 'practice' && <Practice />}
            {route === 'verbs' && <Verbs />}
            {route === 'progress' && <Progress />}
            {route === 'settings' && <Settings />}
          </motion.div>
        </AnimatePresence>
      </Shell>
      <Toaster />
      <Welcome />
    </MotionConfig>
  );
}
