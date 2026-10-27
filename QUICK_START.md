# QuranVoc 80 - Quick Start: Data Entry

## 🚀 You're All Set! Here's How to Start

### Files Created for You:
1. ✅ `quran_vocab_template.json` - Empty template ready for data entry
2. ✅ `validate_vocab.py` - Script to check your progress
3. ✅ `PROGRESS.md` - Checklist to track your work
4. ✅ `DATA_ENTRY_GUIDE.md` - Detailed instructions

### 📝 Quick Start Steps

#### 1. Open the Template
```powershell
code quran_vocab_template.json
```

#### 2. Start with Module 1, Page 8
Open the PDF (`80_percent (1).pdf`) to page 8 and start entering words.

#### 3. Add Your First Word
Copy this template for each word:
```json
{
  "id": 1,
  "arabic": "",
  "english": "",
  "urdu": "",
  "grammatical_info": "",
  "frequency": 0,
  "category": ""
}
```

**Example** (from page 8):
```json
{
  "id": 1,
  "arabic": "هٰذَا",
  "english": "this (masculine)",
  "urdu": "یہ (مذکر)",
  "grammatical_info": "demonstrative pronoun, masculine",
  "frequency": 450,
  "category": "pronouns"
}
```

#### 4. Add to Module 1 Words Array
In `quran_vocab_template.json`, find the `"module_1"` section and add your word to the `"words"` array:

```json
"module_1": {
  "name": "High-Frequency Words",
  "description": "Covers 41.5% of Quranic text",
  "pages": "8-13",
  "word_count": 1,
  "target_count": 100,
  "words": [
    {
      "id": 1,
      "arabic": "هٰذَا",
      "english": "this (masculine)",
      "urdu": "یہ (مذکر)",
      "grammatical_info": "demonstrative pronoun, masculine",
      "frequency": 450,
      "category": "pronouns"
    }
  ]
}
```

#### 5. Validate After Each Page
```powershell
.\venv\Scripts\python validate_vocab.py quran_vocab_template.json
```

This will show:
- ✓ JSON syntax is valid
- Word count progress
- Any missing fields

#### 6. Update Progress
Mark completed sections in `PROGRESS.md`

#### 7. Save to App When Ready
```powershell
copy quran_vocab_template.json app\src\data\vocab.json
```

### ⌨️ Keyboard Shortcuts

**Arabic Keyboard**:
- Windows: `Win + Space` to switch keyboards
- Add Arabic keyboard: Settings → Time & Language → Language

**Urdu Keyboard**:
- Add Urdu (Pakistan) keyboard the same way

### 💡 Pro Tips

1. **Work in batches**: 5-10 words at a time
2. **Validate frequently**: After each page or every 10 words
3. **Use VS Code**: Auto-formats JSON and shows errors
4. **Copy-paste template**: Faster than typing structure each time
5. **Save often**: `Ctrl+S` after each word

### 🎯 Daily Goal Suggestions

- **Casual**: 10-15 words/day = 20-30 days
- **Moderate**: 20-30 words/day = 10-15 days  
- **Intensive**: 50+ words/day = 6 days

### ✅ Quality Checklist

Before moving to next word:
- [ ] Arabic text with diacritics
- [ ] English meaning accurate
- [ ] Urdu translation added
- [ ] Grammatical info included
- [ ] Frequency number from PDF
- [ ] Category assigned
- [ ] JSON syntax valid (no red squiggles in VS Code)

### 🆘 Need Help?

**JSON Syntax Error?**
- Check for missing commas between objects
- Ensure quotes are properly closed
- Use https://jsonlint.com/ to find errors

**Arabic Not Displaying?**
- Ensure file is saved as UTF-8
- Check VS Code encoding (bottom right corner)

**Progress Not Showing in App?**
- Copy file to `app/src/data/vocab.json`
- Reload app (shake device → reload)

---

## 🎉 Ready to Start!

Open `quran_vocab_template.json` and the PDF side-by-side, and start entering words!

**First word to enter**: Page 8, "هٰذَا" (this - masculine)

Good luck! 🚀
