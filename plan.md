# QuranVoc 80 — Audit & Improvement Plan

## Status (update)

- Phase 0-1 done: repo cleanup, bug fixes.
- Phase 2 done: 570 entries transcribed from the PDF (source of truth) and proofread against 190-dpi renders; supplementary Urdu added (not from the PDF). Decision taken: the PDF, not Quran Corpus, is the source.
- Phase 3 (partly) done: Leitner spaced repetition, XP/levels, daily goal, badges, streaks (+longest), frequency-weighted Qur'an-coverage meter (sums to the PDF's own 82.6%), unit tests for the pure logic (`npm test`).
- Done since: verb tables + drill, quiz modes (Arabic→meaning, meaning→Arabic; all / per-module / weak words).
- Done: Amiri Arabic font bundled (covers every character in the data).
- Done: daily reminders (local notifications, skipped on days the goal is met).
- Still open: human proofread of the Arabic, native review of the Urdu, word audio, TypeScript/lint, EAS build (needs an Android package id).

---


Written after reading the whole codebase (Expo / React Native app in `app/`, Python OCR tooling at the root, ~12 markdown guides).

## TL;DR

The app shell is nice (5 screens, theme, storage helpers), but **the app has ~5% of its content (15 of 300 words) and the data pipeline that is supposed to fill it doesn't work**. Several screens also have real bugs. Priority is: fix the data source → fix the bugs → make learning actually effective (SRS) → polish.

---

## 1. What we're doing wrong right now

### A. Data (the biggest problem)
1. **Only 15 of 300 words exist** (5 per module in `app/src/data/vocab.json`). Home says "300 words" but everything runs on 15.
2. **OCR approach is a dead end.** `all_modules_raw.txt` shows Tesseract only recovers English glosses, with garbage for Arabic (`FOI A IN EIS OY`, `Vadtés`), and word order/pairing is lost. 12 docs (`OCR_STEPS`, `TESSERACT_SETUP`, `POPPLER_INSTALL`, `DATA_ENTRY_*`, `TROUBLESHOOTING`...) document a workflow that doesn't produce usable data.
3. **`PROGRESS.md` is all unchecked** — manual entry was planned but never started; ~100 words/module by hand is unrealistic.
4. **Data accuracy is unverified.** Fields like `frequency: 450` look invented. Urdu translations and `grammatical_info` were typed by hand/AI with no source check. For Quranic content, wrong data is worse than no data.
5. Source PDF is committed **three times** (root, `quran app/`, inside zip) — 12 MB each.

### B. Bugs in the code
1. **Quiz options reshuffle on every render** (`QuizScreen.js`): `generateOptions()` runs in the render body, so tapping an answer (which sets state) re-randomizes the choices and can move/replace the correct option under the user's finger. Must be memoized per question.
2. **Quiz is hard-coded to the first 10 words** ("demo") — same quiz every time. Wrong options can also be duplicates/near-duplicates of the answer.
3. **Flashcards "completed" screen is unreachable**: index never goes past `length - 1`, so the last card just does nothing. "Review Again" doesn't actually re-queue the card.
4. **`expo-speech` is imported in `LearnScreen.js` but missing from `package.json`** → Learn screen will crash on a clean install. (`expo-av` is installed but unused.)
5. **`LearnScreen` reads `route.params` but is a tab screen**: opening it from the tab bar defaults to module 1 with no way to switch modules.
6. **Home progress doesn't refresh** — it loads once in `useEffect([])`; tab screens stay mounted, so stats are stale after learning/quizzing. Needs `useFocusEffect`.
7. Language toggle (English/Urdu) is duplicated per-screen state; the saved `preferences` in storage are never read. Urdu isn't RTL-styled/fonted.
8. `saveProgress` / `updateStreak` do read-modify-write on AsyncStorage with no locking; streak logic parses `toDateString()` strings (timezone/locale fragile). `Alert.alert` on every "mark as learned" is intrusive.
9. Quiz scores save with `moduleId = null` always; Flashcard "know" and Learn "learned" are separate stores, so "Words Learned" ignores flashcard mastery.

### C. Product / learning design
- "Spaced repetition" is claimed in README but there is **no scheduling** — only a 1–5 number stored and never read.
- No Arabic font specified (tashkeel can render badly on default Android fonts) — need e.g. Amiri / Noto Naskh.
- No audio assets; relies on device TTS `ar`, which many Android devices don't have installed.
- Emoji tab icons, no tests, no lint, no TypeScript, all data/logic inside screens (word list built in 3 places).

### D. Repo hygiene
- Project dir has **a git repo with zero commits** and a `venv/` referenced but absent.
- README links to absolute paths on another machine (`C:\Users\Muhammad Ahsan\...`, a `.gemini` folder).
- Docs sprawl: 12 overlapping md files; `.expo/` cache files are in the tree.

---

## 2. Plan

### Phase 0 — Hygiene (½ day)
- [ ] Make a first commit; add the PDF to `.gitignore`/Git LFS or keep a single copy under `source/`; delete duplicates and the zip.
- [ ] Collapse the 12 docs into `README.md` + `docs/data-pipeline.md`; fix broken absolute links.
- [ ] Add `expo-speech` (`npx expo install expo-speech`) and remove unused `expo-av` if not used. Verify clean `npm install && npx expo start`.

### Phase 1 — Fix blocking bugs (1 day)
- [ ] Quiz: build question list once (`useMemo`/`useState` init) with options fixed per question; draw from all words (or selected module); distractors from same `category` where possible; dedupe by meaning.
- [ ] Flashcards: re-queue "Review Again" cards to the end of the session; show completion screen; session summary.
- [ ] Learn: add module selector (segmented control) instead of relying on route params; replace success `Alert` with inline check state.
- [ ] Home/Profile: refresh with `useFocusEffect`.
- [ ] Single `useWords()` / `words.js` module that flattens vocab once; single `useSettings()` for language persisted via `getPreferences`.

### Phase 2 — Get the real data (the critical path, 2–4 days)
Stop OCR-ing Arabic. Options, in order of preference:
1. **Use an existing structured source** instead of the PDF: Quran Corpus (corpus.quran.com) / Tanzil word-by-word + frequency lists give Arabic, lemma, root, POS and true frequency counts programmatically. Re-derive the "top 300 lemmas ≈ 80%" list and **cross-check against the PDF's word order/glosses**.
2. If the PDF must be the source: extract with a vision-capable model (render each page to PNG → structured JSON per page) then **human-verify** each page against the PDF image; track in `PROGRESS.md`.
3. Add `scripts/validate_vocab.py` to CI-ish pre-commit: unique ids, required fields, tashkeel present, no empty translations, frequency matches corpus.
- [ ] Add `root`, `lemma`, real `frequency`, `example` (ayah ref + text) per word. Mark any machine-translated Urdu as `reviewed: false` and get a native review.
- [ ] Ship at least Module 1 (~100 words) fully verified before moving on.

### Phase 3 — Make it actually teach (1 week)
- [ ] Real SRS (SM-2 or Leitner boxes): store `ease`, `interval`, `due` per word; "Today's review" queue on Home; flashcard grades Again/Hard/Good/Easy.
- [ ] Unify progress model: one `wordState` record (new → learning → mastered) fed by Learn, Flashcards and Quiz.
- [ ] Quiz modes: Arabic→meaning, meaning→Arabic, listening; per-module and "weak words" quizzes; store `moduleId`.
- [ ] Bundled Arabic font (Amiri/Noto Naskh Arabic) + Urdu Nastaliq font; proper RTL.
- [ ] Bundled audio per word (recorded/ licensed, e.g. from Quran Corpus recitation) with TTS only as fallback.
- [ ] Coverage meter that reflects real Quran coverage: sum of learned-word frequencies / total, not `learned/300`.

### Phase 4 — Polish & release (1 week)
- [ ] Replace emoji tab icons with `@expo/vector-icons`; dark mode; accessibility labels; font scaling.
- [ ] Daily reminder notifications (`expo-notifications`) — currently only a pref flag.
- [ ] Introduce TypeScript, ESLint + Prettier, and Jest tests for `storage`, SRS scheduler and quiz generator (pure functions — easy wins).
- [ ] EAS build, Android internal testing track, crash reporting.
- [ ] Optional: export/import progress backup, ayah-in-context reader.

---

## 3. Suggested first steps (this week)
1. Phase 0 + Phase 1 (everything is small and unblocks the rest).
2. Decide the data source (Phase 2 option 1 vs 2) — **this is the one decision needed from you**.
3. Prototype the Corpus-based extraction script and diff its top-300 list against the PDF.

## 4. Open questions
- Is the PDF (Dr. Abdulraheem's book) licensed for redistribution inside an app? If not, build the list from Quran Corpus data and treat the PDF as reference only.
- Android only, or iOS/web too? (affects audio & fonts choices)
- Is Urdu a hard requirement for v1 (needs a native reviewer)?
