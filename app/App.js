import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Amiri_400Regular } from '@expo-google-fonts/amiri/400Regular';
import { Amiri_700Bold } from '@expo-google-fonts/amiri/700Bold';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { COLORS } from './src/constants/theme';

export default function App() {
  // Amiri renders Arabic diacritics far better than the default Android font.
  // If it fails to load we still start the app and fall back to the system font.
  const [fontsLoaded, fontError] = useFonts({ Amiri_400Regular, Amiri_700Bold });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AppNavigator />
      <StatusBar style="light" />
    </ErrorBoundary>
  );
}
