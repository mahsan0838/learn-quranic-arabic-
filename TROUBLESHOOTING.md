# QuranVoc 80 - Troubleshooting Guide

## ✅ Fixed Issues

### 1. Web Support Error
**Problem**: Missing dependencies for web platform
```
CommandError: It looks like you're trying to use web support but don't have the required dependencies installed.
```

**Solution**: ✅ Installed required packages
```bash
npx expo install react-dom react-native-web
```

### 2. Mobile Runtime Errors
**Problem**: Stack trace errors on Expo Go suggesting potential navigation/rendering issues

**Solutions Applied**:
1. ✅ Added `ErrorBoundary` component to catch and display errors gracefully
2. ✅ Improved error handling in `LearnScreen` with better fallback UI
3. ✅ Added validation for missing vocabulary data

## 🚀 Running the App

### Web Version
```bash
cd app
npm run web
```
- Opens on `http://localhost:8082` (or 8081)
- Works in any modern browser
- Good for quick testing

### Mobile Version (Expo Go)
```bash
cd app
npm start
```
Then scan QR code with Expo Go app

### Android Emulator
```bash
cd app
npm run android
```
Requires Android Studio and emulator setup

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Reinstall dependencies
```bash
cd app
rm -rf node_modules
npm install
```

### Issue: Metro bundler port conflict
**Solution**: Kill the process or use a different port
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Or just accept the alternate port when prompted
```

### Issue: Expo Go shows blank screen
**Possible causes**:
1. **Missing data**: Check if `src/data/vocab.json` exists and has valid JSON
2. **Navigation error**: Check console logs for errors
3. **Network issue**: Ensure phone and computer are on same WiFi

**Solution**: 
- Shake device → Reload
- Check terminal for error messages
- Verify JSON syntax in vocab.json

### Issue: Arabic text not displaying correctly
**Solution**: 
- Ensure device has Arabic font support
- Check that JSON file has proper UTF-8 encoding
- Verify diacritics are correctly entered

### Issue: "Cannot find module '../data/vocab.json'"
**Solution**: Ensure the file exists at:
```
app/src/data/vocab.json
```

## 📱 Testing Checklist

- [ ] Home screen loads with progress dashboard
- [ ] Can navigate between tabs (Home, Learn, Flashcards, Quiz, Profile)
- [ ] Learn screen shows vocabulary words
- [ ] Can toggle between English and Urdu
- [ ] Flashcards flip on tap
- [ ] Quiz shows questions and accepts answers
- [ ] Arabic text renders correctly
- [ ] No console errors

## 🔍 Debugging Tips

### View Console Logs
**Web**: Open browser DevTools (F12) → Console tab
**Expo Go**: Shake device → "Show Dev Menu" → "Debug Remote JS"

### Common Error Messages

**"Module data not found"**
- The vocab.json file is missing data for that module
- Check the module number in navigation params

**"Cannot read property 'words' of undefined"**
- The module structure in vocab.json is incorrect
- Verify JSON structure matches the sample

**"Network request failed"**
- Phone and computer not on same network
- Firewall blocking connection
- Try using tunnel: `expo start --tunnel`

## 📝 Next Steps

1. **Populate Data**: Add all 300 words to `vocab.json`
2. **Test Thoroughly**: Go through all screens and features
3. **Add TTS**: Integrate Arabic pronunciation
4. **Persistence**: Save user progress locally

## 🆘 Still Having Issues?

1. Clear Expo cache:
   ```bash
   expo start -c
   ```

2. Reset Metro bundler:
   ```bash
   npx expo start --clear
   ```

3. Check Expo diagnostics:
   ```bash
   npx expo-doctor
   ```

4. Verify Node/npm versions:
   ```bash
   node --version  # Should be 14+
   npm --version   # Should be 6+
   ```
