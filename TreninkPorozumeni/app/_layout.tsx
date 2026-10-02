// Expo Router root layout — migration from the single-screen App.tsx requested in
// _TreninkPorozumeni_Fields123_PROMPTS.md (section "User Q&A decisions", decision 4).

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { configureResourceBackend } from '../src/resources/resourceStore';

// Web dev preview runs in a browser on the dev machine, where the VPN backend is usually
// unreachable; use a ResourceBackend started locally (ResourceBackend/server.js with
// RESOURCE_BACKEND_HOST=127.0.0.1; porozumeni group lives under /porozumeni). The hot-audio
// file writer needs expo-file-system (unsupported on web) — null falls back to in-memory
// data-URI audio sources. Native apps keep the .env.local-provided default.
if (__DEV__ && Platform.OS === 'web' && typeof window !== 'undefined') {
  configureResourceBackend({
    baseUrl: `http://${window.location.hostname}:9080/porozumeni`,
    hotAudioWriter: null,
  });
}

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
