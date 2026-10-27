# Poppler Installation Guide for Windows

## Quick Install Steps

### Step 1: Download Poppler
Download the latest release:
- **Direct link**: [Release-25.12.0-0.zip](https://github.com/oschwartz10612/poppler-windows/releases/download/v25.12.0-0/Release-25.12.0-0.zip)
- Size: ~20 MB

### Step 2: Extract the ZIP file
1. Extract `Release-25.12.0-0.zip` to a location like:
   - `C:\poppler\` (recommended)
   - Or any location you prefer

After extraction, you should have a folder structure like:
```
C:\poppler\
├── Library\
│   ├── bin\          ← This is what we need!
│   ├── include\
│   └── lib\
└── poppler-XX.XX.X\
```

### Step 3: Add to System PATH

**Option A: Temporary (for this session only)**
Run in PowerShell:
```powershell
$env:PATH += ";C:\poppler\Library\bin"
```

**Option B: Permanent (recommended)**
1. Press `Win + X` → Select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path" and click "Edit"
5. Click "New"
6. Add: `C:\poppler\Library\bin`
7. Click "OK" on all dialogs
8. **Restart PowerShell** for changes to take effect

### Step 4: Verify Installation

Open a **NEW** PowerShell window and run:
```powershell
pdfinfo -v
```

You should see version information like:
```
pdfinfo version 25.12.0
```

If you see this, poppler is installed correctly! ✅

## Alternative: Use Without PATH

If you don't want to modify PATH, you can specify the poppler path directly in Python:

Edit `extract_data.py` and modify the `convert_from_path` calls:

```python
from pdf2image import convert_from_path

# Add poppler_path parameter
images = convert_from_path(
    pdf_path, 
    first_page=page_number, 
    last_page=page_number,
    poppler_path=r'C:\poppler\Library\bin'  # Add this line
)
```

## Next Steps

Once poppler is installed, you can proceed with:
1. Installing Tesseract OCR (if not done yet)
2. Running the extraction script

See `OCR_STEPS.md` for the complete workflow.
