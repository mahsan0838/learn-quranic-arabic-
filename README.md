# QuranVoc 80

A React Native Android app for learning 80% of Quranic vocabulary (300 words).

## 🚀 Quick Start

### Run the App
```bash
cd app
npm start
```

Scan QR code with Expo Go app on Android.

### Run on Android Emulator
```bash
cd app
npm run android
```

## 📁 Project Structure

- **`app/`** - React Native application
  - `src/screens/` - 5 main screens (Home, Learn, Flashcards, Quiz, Profile)
  - `src/data/vocab.json` - Vocabulary data
  - `src/navigation/` - Bottom tab navigation
  - `src/constants/theme.js` - Islamic color scheme

- **`venv/`** - Python virtual environment
- **`extract_data.py`** - OCR-based PDF extraction script
- **`DATA_EXTRACTION_GUIDE.md`** - Guide for populating vocabulary data

## ✅ Completed Features

- ✅ 5 screens with Islamic-themed UI (Green/Gold)
- ✅ Bottom tab navigation
- ✅ Browse vocabulary by module
- ✅ Flashcards with spaced repetition
- ✅ Multiple-choice quizzes
- ✅ Progress dashboard
- ✅ English/Urdu language toggle

## ⏳ Next Steps

1. **Populate Data**: Add all 300 words from PDF to `app/src/data/vocab.json`
2. **TTS Integration**: Add Arabic text-to-speech
3. **Persistence**: Save progress with AsyncStorage
4. **Notifications**: Daily learning reminders

## 📖 Documentation

- [`app/README.md`](file:///c:/Users/Muhammad%20Ahsan/Documents/VS%20Code/quran%20app/app/README.md) - Detailed app documentation
- [`DATA_EXTRACTION_GUIDE.md`](file:///c:/Users/Muhammad%20Ahsan/Documents/VS%20Code/quran%20app/DATA_EXTRACTION_GUIDE.md) - Data extraction guide
- [`walkthrough.md`](file:///C:/Users/Muhammad%20Ahsan/.gemini/antigravity/brain/5296bb55-0c8b-4a3d-80f5-e4320d6bcfe6/walkthrough.md) - Development walkthrough

## 🎯 Vision

Learn 300 words, understand 80% of the Quran.

Based on research by Dr. Abdulazeez Abdulraheem.
