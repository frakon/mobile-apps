// Intro (disambiguation) page: choose the training - `_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)"
// ("It shall have a disambigulation intro page where we choose the task/quest/game/training").

import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRAININGS } from '../src/trainings';

export default function IndexScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Trénink písmen</Text>
        <Text style={styles.subtitle}>Vyber si hru:</Text>
        {TRAININGS.map((training) => (
          <Pressable
            key={training.id}
            accessibilityRole="button"
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push(training.href)}
          >
            <Text style={styles.cardTitle}>{training.title}</Text>
            <Text style={styles.cardDescription}>{training.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6E5',
  },
  content: {
    padding: 20,
    alignItems: 'stretch',
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#5B3E96',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 20,
    color: '#6B5B7B',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFB23F',
    padding: 18,
    marginBottom: 14,
  },
  cardPressed: {
    backgroundColor: '#FFF0D0',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#5B3E96',
  },
  cardDescription: {
    fontSize: 17,
    color: '#6B5B7B',
    marginTop: 4,
  },
});
