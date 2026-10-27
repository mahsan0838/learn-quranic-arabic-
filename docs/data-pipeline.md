# Data pipeline

The PDF (`source/80_percent.pdf`, git-ignored) is the single source of truth. It is image-only, so the text was transcribed by reading each rendered page.

```
source/80_percent.pdf
   -> data/pdf/*.txt          hand-transcribed pages (edit these to fix mistakes)
   -> scripts/build_vocab.py  parses + validates + assigns ids/modules
   -> web/src/data/vocab.json generated; do not edit by hand
data/pdf/conjugation.json     sample verb tables from pp. 42-45 (copied to web/src/data/)
```

## Edit a word

1. Fix the row in `data/pdf/*.txt` (`arabic | english | note | frequency | category`; verb rows use `past ; present ; imperative ; participle ; verbal noun`).
2. `python scripts/build_vocab.py`
3. `python scripts/validate_vocab.py web/src/data/vocab.json`

## Coverage

| Module | PDF pages | Words |
| --- | --- | --- |
| 1 High-Frequency Words | 8-13 | 144 |
| 2 Key Nouns & Attributes | 14-21 | 192 |
| 3 Essential Verbs | 22-41 | 234 (+ 5 forms each) |

Frequencies are the counts printed in the PDF; module 1 pages print none, so `frequency` is `null` there (never estimated). The PDF has no Urdu: the `urdu` field comes from `data/supplement/urdu.txt`, written afterwards as a secondary aid (English from the PDF always wins; the build fails if a supplement line doesn't match the PDF English).

## Proofreading log

All pages 8-41 were re-read against 190-dpi renders of the PDF. Corrections made: pausal forms matched to the PDF on pp. 10-11 (e.g. فَوْق, بَعْد, قَبْل), `غَيْر`, `ذَات`, `بِئْس`, `عَلِيّ`, `حَيَّ`, `بَصُرَ يَبْصُرُ اُبْصُرْ`, `وَسِعَ يَوْسَعُ اِيْسَعْ` (as printed), imperatives `اُتْلُ/اُدْعُ/اُعْفُ`, `اِئْبَ`, `رَأْي`, `جَاءٍ`, `أَتْمِمْ`, `أَحْبِبْ`. The proofreader was the same model that transcribed, so a human pass is still advised. Rows carrying `check` in the note column (e.g. `حَسِبَ`) were ambiguous in the scan.

## Known gaps / to verify

- The Arabic and its diacritics were typed from images by a model, not copy-pasted. **Proofread every page against the PDF.** Rows marked `check` in the `note` column were unclear in the scan.
- Verbs in the PDF are listed under their root, so some words (e.g. `جَاءَ`) appear more than once with different meanings; this is faithful to the PDF.

## Verb tables
`data/pdf/conjugation.json` (copied to the app) holds the PDF's sample verb table (pp. 42-45, فَعَلَ). One evident PDF typo is corrected: the هُمَا (they two) present rows are glossed "You do/will do." in the print; the app shows "They two do/will do."
