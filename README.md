# QuranVoc 80

A React Native (Expo) app for learning the 300 most frequent Quranic words, which cover roughly 80% of the Quran's text. Based on the book *80% of Quranic Words* by Dr. Abdulazeez Abdulraheem.

## Run

```bash
cd app
npm install
npm start          # scan the QR code with Expo Go
npm run android    # or open on an Android emulator
```

## Layout

- `app/` — the Expo app (`src/screens`, `src/utils`, `src/data/vocab.json`, `src/constants/theme.js`)
- `docs/data-pipeline.md` — word schema and the state of data extraction
- `data/pdf/` — hand-transcribed PDF pages (source for `vocab.json`; rebuild with `scripts/build_vocab.py`)
- `scripts/` — Python helpers for PDF analysis and vocab validation
- `source/` — local copy of the source PDF (git-ignored)
- `plan.md` — audit and roadmap

## Status

The vocabulary (570 entries, PDF pages 8-41) is transcribed from the PDF into `data/pdf/` and built into `app/src/data/vocab.json`. It still needs a proofread against the PDF; see `docs/data-pipeline.md`.
