# QuranVoc 80 - Android App

A structured, engaging Android app that teaches the exact vocabulary from **80% of Quranic Words** (PDF by Dr. Abdulazeez Abdulraheem).

## 🎯 Vision

Enable users who can read Arabic script to understand the meaning of 80% of the Quran's words by learning just 300 high-frequency words.

## ✨ Features

- **Structured Learning Journey**: 3 modules covering high-frequency words, key nouns, and essential verbs
- **Interactive Flashcards**: Spaced repetition system with swipe gestures
- **Quiz Mode**: Multiple-choice tests with adaptive difficulty
- **Progress Tracking**: Visual dashboard showing learning progress and streaks
- **Bilingual Support**: English and Urdu translations
- **Islamic Design**: Clean, respectful UI with green and gold accents

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app (for testing on mobile)

### Installation

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

### Running on Android

```bash
npm run android
```

### Running on Web

```bash
npm run web
```

## 📁 Project Structure

```
app/
├── src/
│   ├── screens/          # Main app screens
│   │   ├── HomeScreen.js
│   │   ├── LearnScreen.js
│   │   ├── FlashcardsScreen.js
│   │   ├── QuizScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/       # Navigation setup
│   ├── components/       # Reusable components
│   ├── data/            # Vocabulary data (JSON)
│   └── constants/       # Theme and constants
├── assets/              # Images and fonts
└── App.js              # Entry point
```

## 📊 Data

The app currently includes sample data. To populate with full vocabulary:

1. See `DATA_EXTRACTION_GUIDE.md` in the root directory
2. Update `src/data/vocab.json` with extracted words
3. Follow the JSON structure in the sample file

## 🎨 Customization

- **Theme**: Edit `src/constants/theme.js` to change colors
- **Data**: Update `src/data/vocab.json` with new vocabulary
- **Screens**: Modify screens in `src/screens/`

## 📱 Tech Stack

- **React Native** with Expo
- **React Navigation** for routing
- **expo-av** for Text-to-Speech (future)

## 🔮 Future Features

- Text-to-Speech for Arabic pronunciation
- Offline-first data storage
- Daily reminders and notifications
- Advanced grammar explanations
- Community challenges

## 📄 License

Based on research by Dr. Abdulazeez Abdulraheem

---

**QuranVoc 80** - Learn 300 words, understand 80% of the Quran
