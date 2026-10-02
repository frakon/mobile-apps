// TreninkPorozumeni copy (adapted): _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26" (mobile-apps-preferences skill).
// Child-friendly Czech offline screen: shown when the backend is unreachable AND the needed
// resources are not cached (decision 7 — "child-friendly Czech error message + retry button";
// games whose resources are fully cached/bundled still work and never show this).
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type OfflineRetryProps = {
  // Called when the child taps "Zkusit znovu" — the screen retries the failed preload.
  onRetry: () => void;
  // Optional override of the main message (default fits all games).
  message?: string;
};

export function OfflineRetry({ onRetry, message }: OfflineRetryProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.cloud}>☁️📡</Text>
      <Text style={styles.title}>Jejda!</Text>
      <Text style={styles.message}>
        {message ?? 'Obrázky a zvuky se teď nepodařilo stáhnout.\nZkontroluj připojení a zkus to znovu.'}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Zkusit znovu"
        onPress={onRetry}
        style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
      >
        <Text style={styles.retryText}>🔄 Zkusit znovu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF9EC',
  },
  cloud: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#5B4A2F',
    marginBottom: 10,
  },
  message: {
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    color: '#5B4A2F',
    marginBottom: 28,
  },
  retryButton: {
    backgroundColor: '#58B368',
    borderRadius: 24,
    paddingHorizontal: 34,
    paddingVertical: 16,
  },
  retryButtonPressed: {
    backgroundColor: '#3F9550',
  },
  retryText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
