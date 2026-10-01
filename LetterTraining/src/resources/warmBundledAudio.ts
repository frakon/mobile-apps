// Warm-up of BUNDLED audio modules (letter names — user decision 2: letter audio stays bundled)
// via expo-asset, so the first tap never waits on the Metro download in Expo Go (verification
// Phase C R1 M2). Fire-and-forget: failures are silent, the asset then lazy-loads on first play.
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import { Asset } from 'expo-asset';

export function warmBundledAudioModules(modules: Iterable<number | undefined>): void {
  for (const moduleId of modules) {
    if (moduleId === undefined) {
      continue;
    }
    try {
      Asset.fromModule(moduleId)
        .downloadAsync()
        .catch(() => undefined); // silent: lazy load later
    } catch {
      // Unknown module id: equally silent.
    }
  }
}
