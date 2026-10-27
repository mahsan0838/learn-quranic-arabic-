import { Sheet } from './Sheet';
import { Ornament } from './Ornament';
import { setPrefs, useStore } from '../lib/store';
import { TARGET_COVERAGE, TOTAL_WORDS } from '../lib/words';

// One quiet moment of orientation on the very first visit.
export function Welcome() {
  const welcomed = useStore((s) => s.prefs.welcomed);
  const close = () => setPrefs({ welcomed: true });

  return (
    <Sheet open={!welcomed} onClose={close} title="Welcome">
      <div className="welcome">
        <p className="arabic welcome-bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        <Ornament />
        <h2 className="display">Learn the words behind the recitation.</h2>
        <p>
          A small set of words carries most of the Qur’an. These {TOTAL_WORDS} entries, taken from Dr. Abdulazeez Abdulraheem’s
          booklet <i>80% of Qur’anic Words</i>, cover {TARGET_COVERAGE}% of its text.
        </p>
        <p>
          Review a few cards each day. The app brings back the ones you forget, and shows how much of the Qur’an you can now read
          with understanding.
        </p>
        <button type="button" className="btn btn--gold btn--wide" onClick={close}>
          Begin
        </button>
      </div>
    </Sheet>
  );
}
