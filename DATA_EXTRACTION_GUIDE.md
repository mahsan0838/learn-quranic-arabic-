# QuranVoc 80 - Data Extraction Guide

## Approach

Since the PDF is image-based, we have two options:

### Option 1: OCR (Automated but Complex)
- Requires installing Tesseract OCR
- May have accuracy issues with Arabic diacritics
- Script: `extract_data.py`

**To use OCR:**
1. Download Tesseract OCR: https://github.com/UB-Mannheim/tesseract/wiki
2. Install with Arabic language pack
3. Update `tesseract_cmd` path in `extract_data.py`
4. Run: `.\venv\Scripts\python extract_data.py`

### Option 2: Manual Entry (Recommended for Accuracy)
- Use `quran_vocab_sample.json` as template
- Manually type words from PDF
- Ensures 100% accuracy for Arabic text with diacritics
- Better for religious content where precision is critical

## JSON Structure

Each word entry should have:
- `id`: Unique identifier
- `arabic`: Arabic text with proper diacritics
- `english`: English meaning
- `urdu`: Urdu meaning
- `grammatical_info`: Gender, number, verb form, etc.
- `frequency`: How many times it appears in Quran
- `category`: pronouns, verbs, nouns, etc.
- `examples`: Optional Quranic verse examples

## Next Steps

1. Choose extraction method (OCR or Manual)
2. Extract/enter data for all 300 words
3. Validate JSON structure
4. Begin app development

## Notes

- The PDF has ~300 words across 3 modules
- Manual entry might take 4-6 hours but ensures accuracy
- OCR might need significant post-processing for Arabic diacritics
