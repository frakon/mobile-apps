// Expo Router root layout (same setup as TreninkPorozumeni) - `_LetterTraining_PROMPTS.md` /
// "## Initial request (2026-10-01)".

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { configureResourceBackend } from '../src/resources/resourceStore';

// Web dev preview runs in a browser on the dev machine, where the VPN address 10.67.0.1 is
// usually unreachable; use a ResourceBackend started locally (ResourceBackend/server.js with
// RESOURCE_BACKEND_HOST=127.0.0.1) on the same host that serves the page. Native apps keep the default.
if (__DEV__ && Platform.OS === 'web' && typeof window !== 'undefined') {
  configureResourceBackend({ baseUrl: `http://${window.location.hostname}:9080` });
}

import {
  CURSIVE_COMENIA_FONT_FAMILY,
  CURSIVE_TRADITIONAL_FONT_FAMILY,
  setLetterFontsLoaded,
} from '../src/pexeso/components/letterFonts';

// Bundled psací fonts - `_LetterTraining_PROMPTS.md` / "## Q&A 10 — psací fonts" (keys = family names used in letterFonts.ts).
const LETTER_FONT_SOURCES = {
  [CURSIVE_COMENIA_FONT_FAMILY]: require('../assets/fonts/PlaywriteFRModerne-Regular.ttf'),
  [CURSIVE_TRADITIONAL_FONT_FAMILY]: require('../assets/fonts/PlaywriteCZ-Regular.ttf'),
};

export default function RootLayout() {
  // Nothing renders until the fonts finished loading; on load error the cursive styles fall back to system italic.
  const [areFontsLoaded, fontLoadError] = useFonts(LETTER_FONT_SOURCES);
  if (!areFontsLoaded && fontLoadError === null) {
    return null;
  }
  setLetterFontsLoaded(areFontsLoaded);

  // GestureHandlerRootView: required by the drag & drop of "Skládání slov" (app/compose.tsx) -
  // `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 4 — new game "Skládání slov" (verbatim)".
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFF6E5' },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
