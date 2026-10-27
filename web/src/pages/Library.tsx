import { useDeferredValue, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { Word } from '../types';
import { MODULES, ALL_WORDS, HAS_URDU, meaningOf, noteOf, sectionOf, weightOf } from '../lib/words';
import { isKnown } from '../lib/srs';
import { markKnown, useStore } from '../lib/store';
import { Seg } from '../components/Seg';
import { Sheet } from '../components/Sheet';
import { Icon } from '../components/Icon';
import { WordForms } from '../components/WordForms';

// Strip vowel marks, tatweel and letter variants so "قال" finds "قَالَ".
const plain = (s: string) =>
  s
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .toLowerCase();

const MAX_FREQ = Math.max(...ALL_WORDS.map((w) => w.frequency ?? 0));

export function Library() {
  const srs = useStore((s) => s.srs);
  const language = useStore((s) => s.prefs.language);
  const [moduleId, setModuleId] = useState<number>(0);
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const [open, setOpen] = useState<Word | null>(null);

  const groups = useMemo(() => {
    const q = plain(deferred.trim());
    const pool = moduleId === 0 ? MODULES : MODULES.filter((m) => m.id === moduleId);
    return pool.flatMap((m) => {
      const bySection = new Map<string, Word[]>();
      for (const w of m.words) {
        if (q && !(plain(w.arabic).includes(q) || w.english.toLowerCase().includes(q) || (w.urdu ?? '').includes(q))) continue;
        const key = sectionOf(w);
        bySection.set(key, [...(bySection.get(key) ?? []), w]);
      }
      return [...bySection.entries()].map(([title, words]) => ({ module: m.id, title, words }));
    });
  }, [deferred, moduleId]);

  const count = groups.reduce((n, g) => n + g.words.length, 0);

  return (
    <div className="library">
      <header className="page-head">
        <p className="eyebrow">The booklet, page by page</p>
        <h1 className="display">Library</h1>
        <p className="lede">Every word from the booklet, grouped as the author arranged them. Tap any word for its details.</p>
      </header>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Search Arabic or English"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search words"
          />
        </label>
        <Seg
          label="Filter by stage"
          value={moduleId}
          onChange={setModuleId}
          options={[{ value: 0, label: 'All' }, ...MODULES.map((m) => ({ value: m.id, label: ['I', 'II', 'III'][m.id - 1] }))]}
        />
        <a href="#/verbs" className="btn btn--ghost btn--sm">
          <Icon name="verbs" size={16} /> Verb tables
        </a>
      </div>

      <p className="result-count num">
        {count} {count === 1 ? 'word' : 'words'}
      </p>

      {groups.length === 0 && (
        <div className="empty card">
          <p className="display">No words match “{deferred}”.</p>
          <p>Try fewer letters, or search in English.</p>
        </div>
      )}

      {groups.map((g, gi) => (
        <section key={`${g.module}-${g.title}`} className="group">
          <h2 className="group-title">
            <span className="display">{g.title}</span>
            <span className="group-stage">Stage {['I', 'II', 'III'][g.module - 1]}</span>
          </h2>
          <div className="tiles">
            {g.words.map((w, i) => (
              <motion.button
                key={w.id}
                type="button"
                className={`tile${isKnown(srs[w.id]) ? ' tile--known' : ''}`}
                onClick={() => setOpen(w)}
                initial={gi < 2 ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi < 2 ? Math.min(i * 0.03, 0.5) : 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="arabic tile-ar" lang="ar">
                  {w.arabic}
                </span>
                <span className="tile-en">{meaningOf(w, language)}</span>
                {isKnown(srs[w.id]) && (
                  <span className="tile-check" aria-label="Known">
                    <Icon name="check" size={13} />
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </section>
      ))}

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.english}>
        {open && <WordDetail word={open} />}
      </Sheet>
    </div>
  );
}

function WordDetail({ word }: { word: Word }) {
  const state = useStore((s) => s.srs[word.id]);
  const language = useStore((s) => s.prefs.language);
  const known = isKnown(state);
  const status = !state ? 'New' : known ? 'Known' : 'Learning';
  const note = noteOf(word);

  return (
    <div className="detail">
      <p className="eyebrow">{sectionOf(word)}</p>
      <p className="arabic detail-ar" lang="ar">
        {word.arabic}
      </p>
      <h3 className="display detail-meaning">{word.english}</h3>
      {HAS_URDU && word.urdu && language === 'urdu' && (
        <p className="urdu" lang="ur" dir="rtl">
          {word.urdu}
        </p>
      )}
      <div className="detail-tags">
        {note && <span className="tag">{note}</span>}
        <span className={`tag tag--${status.toLowerCase()}`}>{status}</span>
        <span className="tag">Booklet p. {word.page - 7}</span>
      </div>

      {word.frequency != null ? (
        <div className="freq">
          <div className="freq-top">
            <span>Appears in the Qur’an</span>
            <b className="num">{word.frequency.toLocaleString()}×</b>
          </div>
          <div className="bar">
            <i style={{ width: `${Math.max(2, (word.frequency / MAX_FREQ) * 100)}%` }} />
          </div>
        </div>
      ) : (
        <p className="freq-note">
          The booklet counts the first six pages together: roughly {Math.round(weightOf(word)).toLocaleString()} occurrences per word on average.
        </p>
      )}

      {word.forms && <WordForms forms={word.forms} />}

      {HAS_URDU && word.urdu && language !== 'urdu' && (
        <p className="urdu-note">
          Urdu: <bdi lang="ur" dir="rtl">{word.urdu}</bdi> <i>(supplementary gloss)</i>
        </p>
      )}

      {!known && (
        <button type="button" className="btn btn--ghost btn--wide" onClick={() => markKnown(word.id)}>
          <Icon name="check" size={18} /> I already know this word
        </button>
      )}
    </div>
  );
}
