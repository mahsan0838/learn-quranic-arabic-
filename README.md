# QuranVoc 80

Learn the 570 most frequent Qur'anic words, which cover 82.6% of the text. Words, glosses and frequency counts are transcribed from Dr. Abdulazeez Abdulraheem's booklet *80% of Qur'anic Words*.

A web app that installs like a native app (PWA) on iPhone, Android and desktop, works offline, and keeps progress on the device.

## Run

```bash
cd web
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into web/dist
npm test           # logic tests (spaced repetition, quiz, streaks, verb drill)
npm run lint
```

## Layout

- `web/` the app (Vite, React, TypeScript, Motion). `src/lib` holds the pure logic, `src/pages` the screens.
- `data/pdf/` hand-transcribed pages from the booklet. `data/supplement/urdu.txt` supplementary Urdu (not from the book).
- `scripts/build_vocab.py` builds `web/src/data/vocab.json`; `scripts/make_icons.py` regenerates the app icons.
- `docs/data-pipeline.md` the data workflow and proofreading log. `plan.md` the roadmap.
- `source/` local copy of the PDF (git-ignored).

The earlier React Native / Expo version is preserved at the git tag `expo-native-v1`.

## Installing the app

Open the site, then: Android/desktop Chrome or Edge, use the "Install app" button (or the browser's install icon). iPhone/iPad: Safari, Share, Add to Home Screen.
