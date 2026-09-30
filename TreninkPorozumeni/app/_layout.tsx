// Expo Router root layout — migration from the single-screen App.tsx requested in
// _TreninkPorozumeni_Fields123_PROMPTS.md (section "User Q&A decisions", decision 4).

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FDF8EF' },
        }}
      />
    </SafeAreaProvider>
  );
}
