# QuranVoc 80 - OCR Data Extraction Steps

## 📋 Quick Start Checklist

Follow these steps in order:

### ✅ Step 1: Download Tesseract OCR
- [ ] Download installer: [tesseract-ocr-w64-setup-5.5.0.20241111.exe](https://github.com/tesseract-ocr/tesseract/releases/download/5.5.0/tesseract-ocr-w64-setup-5.5.0.20241111.exe)

### ✅ Step 2: Install Tesseract
- [ ] Run the installer
- [ ] **IMPORTANT**: Select Arabic language pack during installation
- [ ] **IMPORTANT**: Select English language pack during installation
- [ ] Note installation path (default: `C:\Program Files\Tesseract-OCR`)
- [ ] Complete installation

### ✅ Step 3: Install Poppler (for PDF conversion)

**Option A: Download Binary (Easiest)**
- [ ] Download: https://github.com/oschwartz10612/poppler-windows/releases/latest
- [ ] Extract to `C:\poppler`
- [ ] Add to PATH: `C:\poppler\Library\bin`

**Option B: Use Conda**
```bash
conda install -c conda-forge poppler
```

### ✅ Step 4: Verify Installation
Open PowerShell and run:
```powershell
cd "c:\Users\Muhammad Ahsan\Documents\VS Code\quran app"
.\venv\Scripts\python -c "import pytesseract; print('Tesseract OK!')"
```

### ✅ Step 5: Update Tesseract Path (if needed)
The script is already configured with the default path:
```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

If you installed elsewhere, edit `extract_data.py` line 16.

### ✅ Step 6: Test OCR on One Page
```powershell
cd "c:\Users\Muhammad Ahsan\Documents\VS Code\quran app"
.\venv\Scripts\python extract_data.py
```

This will test OCR on page 8 and show you a sample of extracted text.

### ✅ Step 7: Review Test Output
Check if:
- [ ] Arabic text is extracted correctly
- [ ] English text is readable
- [ ] Diacritics are preserved

### ✅ Step 8: Extract All Pages (if test looks good)
Edit `extract_data.py` and uncomment lines 74-85 to extract all modules.

### ✅ Step 9: Run Full Extraction
```powershell
.\venv\Scripts\python extract_data.py
```

This will process all 30 pages (8-37) and create `quran_vocab.json`.

### ✅ Step 10: Review & Correct
- [ ] Open `quran_vocab.json`
- [ ] Check for OCR errors
- [ ] Correct any mistakes in Arabic text or translations
- [ ] Verify all 300 words are present

### ✅ Step 11: Copy to App
```powershell
copy quran_vocab.json app\src\data\vocab.json
```

### ✅ Step 12: Test in App
- [ ] Reload the app (shake device → reload in Expo Go)
- [ ] Browse through all modules
- [ ] Verify words display correctly
- [ ] Check Arabic rendering
- [ ] Test flashcards and quiz

---

## 🆘 Troubleshooting

See [`TESSERACT_SETUP.md`](file:///c:/Users/Muhammad%20Ahsan/Documents/VS%20Code/quran%20app/TESSERACT_SETUP.md) for detailed troubleshooting.

**Common Issues**:
- **"TesseractNotFoundError"**: Update path in `extract_data.py`
- **"Unable to get page count"**: Install poppler
- **Poor OCR quality**: Ensure Arabic language pack is installed

---

## 📝 Notes

- OCR is not 100% accurate, especially with Arabic diacritics
- Manual review is **strongly recommended** for religious content
- Budget 2-4 hours for review and corrections
- Consider manual entry for critical words if OCR quality is poor
