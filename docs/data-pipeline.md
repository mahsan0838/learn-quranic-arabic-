# Data pipeline

The vocabulary lives in `app/src/data/vocab.json`. Currently it holds only 15 sample words; the target is 300.

## Word schema

| field | notes |
| --- | --- |
| `id` | unique integer |
| `arabic` | with full tashkeel |
| `english`, `urdu` | meanings |
| `grammatical_info` | gender, number, verb form, ... |
| `frequency` | occurrences in the Quran (must be verified, not estimated) |
| `category` | pronouns, verbs, nouns, ... |
| `examples` | optional Quranic examples |

See `quran_vocab_template.json` / `quran_vocab_sample.json` for full examples.

## Status of extraction approaches

- **OCR (`scripts/extract_data.py`)**: tried, does not work. Tesseract recovers English glosses only; Arabic comes out as garbage and the word/gloss pairing is lost (see `docs/ocr_raw_output.txt`). Needs Tesseract + Poppler installed, and the PDF at `source/80_percent.pdf` (git-ignored; keep it local).
- **Manual entry**: tracked in `docs/PROGRESS.md`; not started.
- **Planned**: build the list from Quran Corpus data and cross-check against the PDF. See `plan.md`, Phase 2.

## Validating

```bash
python scripts/validate_vocab.py app/src/data/vocab.json
```
