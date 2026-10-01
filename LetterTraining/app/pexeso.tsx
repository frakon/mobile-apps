// Pexeso route - LetterPexeso nested into LetterTraining (`_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)").
// Landscape lock/unlock lives in src/pexeso/PexesoGame.tsx (mount = enter, unmount = leave). app/pexeso-settings is pushed ON
// TOP of this screen, so the game stays mounted (landscape lock stays active; settings is shown in landscape too).
// Settings screen app/pexeso-settings.tsx; settings re-read on every focus (back from settings) -
// src/pexeso/_LetterPexeso_PROMPTS.md / "Follow-up prompt 6 — Pexeso improvements (standalone LetterPexeso + integrated in
// LetterTraining) (verbatim)".

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';

import PexesoGame from '../src/pexeso/PexesoGame';

export default function PexesoScreen() {
  const router = useRouter();
  const [settingsReloadToken, setSettingsReloadToken] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setSettingsReloadToken((token) => token + 1);
    }, []),
  );
  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);
  const openSettings = useCallback(() => router.push('/pexeso-settings'), [router]);
  return <PexesoGame onBack={goBack} onOpenSettings={openSettings} settingsReloadToken={settingsReloadToken} />;
}
