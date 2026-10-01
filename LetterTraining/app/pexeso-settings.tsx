// Pexeso settings route (same pattern as app/compose-settings.tsx) - src/pexeso/_LetterPexeso_PROMPTS.md /
// "Follow-up prompt 6 — Pexeso improvements (standalone LetterPexeso + integrated in LetterTraining) (verbatim)".

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';

import PexesoSettingsScreen from '../src/pexeso/PexesoSettingsScreen';

export default function PexesoSettingsRoute() {
  const router = useRouter();
  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/pexeso');
    }
  }, [router]);
  return <PexesoSettingsScreen onBack={goBack} />;
}
