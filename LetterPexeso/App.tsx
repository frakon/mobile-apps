import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PexesoGame from './src/PexesoGame';
import PexesoSettingsScreen from './src/PexesoSettingsScreen';
import { PEXESO_LETTER_AUDIO } from './src/pexesoPlatform';
import { warmBundledAudioModules } from './src/resources/warmBundledAudio';
import { colors } from './src/theme';
import {
  CURSIVE_COMENIA_FONT_FAMILY,
  CURSIVE_TRADITIONAL_FONT_FAMILY,
  setLetterFontsLoaded,
} from './src/components/letterFonts';

// Bundled psací fonts - `_LetterPexeso_PROMPTS.md` / "## Q&A 10 — psací fonts" (keys = family names used in letterFonts.ts).
const LETTER_FONT_SOURCES = {
  [CURSIVE_COMENIA_FONT_FAMILY]: require('./assets/fonts/PlaywriteFRModerne-Regular.ttf'),
  [CURSIVE_TRADITIONAL_FONT_FAMILY]: require('./assets/fonts/PlaywriteCZ-Regular.ttf'),
};

// Standalone LetterPexeso root. The game (src/PexesoGame.tsx, identical to LetterTraining's) locks landscape while mounted
// - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape" (app.json "orientation": "landscape" for standalone builds).
// Settings screen - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6 — Pexeso improvements (standalone LetterPexeso +
// integrated in LetterTraining) (verbatim)": shown ON TOP of the still-mounted game (DECISION, not user-specified: no
// navigation library; keeping the game mounted keeps the landscape lock), settings re-read when it is closed.
export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsReloadToken, setSettingsReloadToken] = useState(0);
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
    setSettingsReloadToken((token) => token + 1);
  }, []);
  // Android hardware back closes the settings overlay instead of leaving the app (verification pexeso R1 finding 9).
  useEffect(() => {
    if (!isSettingsOpen) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      closeSettings();
      return true;
    });
    return () => subscription.remove();
  }, [isSettingsOpen, closeSettings]);
  // Letter/sound card types play BUNDLED letter audio (letter audio stays bundled) — warmed at app level (so the shared
  // PexesoGame.tsx needs no warm-up code of its own, LetterTraining does the same in app/pexeso.tsx) so the first card
  // flip never waits on the Metro download in Expo Go. Image-card word audio comes hot from the backend archives -
  // `_LetterPexeso_PROMPTS.md` / "## Phase E — mobile-apps-preferences in the standalone app".
  useEffect(() => {
    warmBundledAudioModules(Object.values(PEXESO_LETTER_AUDIO));
  }, []);
  // Nothing renders until the fonts finished loading; on load error the cursive styles fall back to system italic.
  const [areFontsLoaded, fontLoadError] = useFonts(LETTER_FONT_SOURCES);
  if (!areFontsLoaded && fontLoadError === null) {
    return null;
  }
  setLetterFontsLoaded(areFontsLoaded);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <PexesoGame onOpenSettings={openSettings} settingsReloadToken={settingsReloadToken} />
      {isSettingsOpen && (
        <View style={styles.settingsLayer}>
          <PexesoSettingsScreen onBack={closeSettings} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  settingsLayer: {
    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
    backgroundColor: colors.background,
  },
});
