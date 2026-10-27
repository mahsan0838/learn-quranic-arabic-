# Tesseract OCR Installation & Setup Guide

## Step 1: Download Tesseract OCR

**Download the latest Windows installer:**
- Direct link: [tesseract-ocr-w64-setup-5.5.0.20241111.exe](https://github.com/tesseract-ocr/tesseract/releases/download/5.5.0/tesseract-ocr-w64-setup-5.5.0.20241111.exe)
- Or visit: https://github.com/UB-Mannheim/tesseract/wiki

## Step 2: Install Tesseract

1. **Run the installer** (`tesseract-ocr-w64-setup-5.5.0.20241111.exe`)

2. **IMPORTANT**: During installation, make sure to:
   - ✅ Check "Additional language data (download)" option
   - ✅ Select **Arabic** language pack
   - ✅ Select **English** language pack
   - ✅ Note the installation path (default: `C:\Program Files\Tesseract-OCR`)

3. **Complete the installation**

## Step 3: Verify Installation

Open PowerShell and run:
```powershell
& "C:\Program Files\Tesseract-OCR\tesseract.exe" --version
```

You should see version information like:
```
tesseract 5.5.0
```

## Step 4: Update extract_data.py

The extraction script needs to know where Tesseract is installed.

**File to edit**: `extract_data.py`

**Find this line** (around line 18):
```python
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

**Uncomment it** (remove the `#`):
```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

**If you installed Tesseract in a different location**, update the path accordingly.

## Step 5: Install poppler (for pdf2image)

`pdf2image` requires poppler to convert PDF pages to images.

### Option A: Download Pre-built Binary (Recommended)

1. Download poppler for Windows: https://github.com/oschwartz10612/poppler-windows/releases/
2. Extract the ZIP file (e.g., to `C:\poppler`)
3. Add poppler's `bin` folder to your PATH:
   - `C:\poppler\Library\bin`

### Option B: Use Conda
```bash
conda install -c conda-forge poppler
```

## Step 6: Test the Setup

Run this test script to verify everything works:

```powershell
cd "c:\Users\Muhammad Ahsan\Documents\VS Code\quran app"
.\venv\Scripts\python -c "import pytesseract; import pdf2image; print('All dependencies OK!')"
```

If you see "All dependencies OK!", you're ready to proceed!

## Step 7: Run the Extraction Script

```powershell
cd "c:\Users\Muhammad Ahsan\Documents\VS Code\quran app"
.\venv\Scripts\python extract_data.py
```

This will:
1. Convert PDF pages to images
2. Run OCR on each page
3. Extract Arabic text, English meanings, and Urdu translations
4. Save to `quran_vocab.json`

## Expected Output

The script will show progress like:
```
Starting data extraction...
Testing OCR on page 8...
Extracted text sample:
[Arabic text and translations]
```

## Troubleshooting

### Error: "TesseractNotFoundError"
**Solution**: Update the `tesseract_cmd` path in `extract_data.py`

### Error: "Unable to get page count. Is poppler installed?"
**Solution**: Install poppler (see Step 5)

### Error: "No module named 'pytesseract'"
**Solution**: 
```powershell
.\venv\Scripts\pip install pytesseract pdf2image
```

### Poor OCR Quality
**Tips**:
- Ensure Arabic language pack is installed
- PDF quality matters - higher resolution = better results
- You may need to manually review and correct OCR output

## Next Steps After Extraction

1. **Review the output**: Check `quran_vocab.json` for accuracy
2. **Correct errors**: Fix any OCR mistakes in Arabic text or translations
3. **Copy to app**: Replace `app/src/data/vocab.json` with the extracted data
4. **Test the app**: Reload and verify all 300 words display correctly

---

**Note**: OCR is not 100% accurate, especially with Arabic diacritics. Manual review is recommended for religious content to ensure accuracy.
