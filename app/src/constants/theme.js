// Theme colors and constants
export const COLORS = {
  primary: '#2E7D32', // Islamic Green
  secondary: '#FFD700', // Gold
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  accent: '#4CAF50',
  error: '#D32F2F',
  success: '#388E3C',
};

export const FONTS = {
  arabic: 'Amiri_400Regular', // bundled via @expo-google-fonts/amiri (loaded in App.js)
  urdu: 'System',
  english: 'System',
};

// Amiri's tall marks need extra line height or the diacritics get clipped.
export const arabicStyle = (fontSize) => ({
  fontFamily: FONTS.arabic,
  fontSize,
  lineHeight: Math.round(fontSize * 1.7),
});

export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
