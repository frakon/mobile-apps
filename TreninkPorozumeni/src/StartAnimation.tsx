// Exercise start animation, shown while the round's resources (and ideally the next rounds) load from the
// ResourceBackend. Requested in _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26" (mobile-apps-preferences
// skill, "Exercise start animation"): programmatic (RN Animated, no GIF), under 5 s, ends on a FIXED frame that stays
// until the resources are ready; the game unmounts it IMMEDIATELY when they are ready (even mid-animation).
// It hints at the task, not a tutorial: a speaker "speaks" (waves), picture cards fly in, one of them turns green
// with a check mark — "listen, then tap the matching picture". The card glyphs are themed per test type (field).

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { FieldId } from './items';

// Per-field card glyphs (4 cards; index 0 becomes the green "matching" card). Every one of the 15 fields has its own
// themed set (_TreninkPorozumeni_Fields123_PROMPTS.md — User request 26: "one themed animation per activity").
const FIELD_CARD_GLYPHS: Record<FieldId, string[]> = {
  field51: ['🐻➡🦁', '🦁➡🐻', '🐶', '🐱'],
  field52: ['📦⚽', '⚽📦', '🛏', '🐝'],
  field53: ['🍎🍎🍎', '🍎', '🍐🍐🍐', '🍌'],
  field55: ['🌧', '☀', '🌂', '🌈'],
  field59: ['🐘', '🐭', '🐢', '🐇'],
  field510: ['⭐⭐⭐', '⭐', '🌙', '☁'],
  field54: ['🐱🫳🐶', '🐶🫳🐱', '🧸', '🪁'], // passive/active: who is doing it to whom
  field56: ['⏳', '⌛', '⏰', '📅'], // tenses: before / now / later
  field57: ['👦🎈', '👧🎈', '🐕', '🌻'], // relative clauses: "the boy who has the balloon"
  field58: ['👧', '👦', '👫', '👨‍👩‍👧'], // subject-verb agreement: she / he / they
  field511: ['👩🎁', '👨🎁', '👶', '🐈'], // pronouns: who does "she/he" point to
  field512: ['🍎🧒🍎🧒', '🍎🍎🧒', '🍌', '🍇'], // distributive: each child one apple
  field513: ['🎁➡👧', '🎁➡👦', '📮', '🧁'], // dative: to whom is it given
  field514: ['✏️', '🖌', '✂️', '🔨'], // instrumental: with what
  field515: ['🍪', '🍪🍪', '🧩', '🏰'], // aspect: finished vs still going
};
const DEFAULT_CARD_GLYPHS = ['🏠', '🌳', '🚗', '🎈'];

// Multi-emoji glyphs must fit the card's inner width (~98 px): shrink the font with the emoji count
// instead of letting overflow:hidden clip them (_TreninkPorozumeni_Fields123_PROMPTS.md — User request 26).
function glyphFontSize(glyph: string): number {
  const emojiCount = Math.max(1, Array.from(glyph.replace(/[‍️]/g, '')).length);
  return Math.min(34, Math.floor(80 / emojiCount));
}

const WAVE_COUNT = 3;
const CARD_COUNT = 4;

export function StartAnimation({ field }: { field?: FieldId }): React.ReactElement {
  const glyphs = (field !== undefined ? FIELD_CARD_GLYPHS[field] : undefined) ?? DEFAULT_CARD_GLYPHS;
  const waves = useRef([...Array(WAVE_COUNT)].map(() => new Animated.Value(0))).current;
  const cards = useRef([...Array(CARD_COUNT)].map(() => new Animated.Value(0))).current;
  const highlight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Timeline (~4.2 s total): waves 0-1.4 s, cards fly in 1.2-2.4 s, the matching card turns green 3.0-3.6 s.
    // Afterwards everything stays as it is (fixed final frame) until the game unmounts this component.
    const animation = Animated.parallel([
      Animated.stagger(
        250,
        waves.map((wave) =>
          Animated.sequence([
            Animated.timing(wave, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(wave, { toValue: 0.35, duration: 300, useNativeDriver: true }),
          ])
        )
      ),
      Animated.sequence([
        Animated.delay(1200),
        Animated.stagger(
          220,
          cards.map((card) =>
            Animated.spring(card, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true })
          )
        ),
      ]),
      Animated.sequence([
        Animated.delay(3000),
        Animated.timing(highlight, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]);
    animation.start();
    return () => animation.stop();
  }, [waves, cards, highlight]);

  return (
    <View style={styles.container} accessibilityLabel="Připravuji obrázky a zvuky">
      <View style={styles.speakerRow}>
        <Text style={styles.speaker}>🔊</Text>
        {waves.map((wave, index) => (
          <Animated.View
            key={index}
            style={[
              styles.wave,
              { width: 18 + index * 14, height: 36 + index * 22 },
              { opacity: wave, transform: [{ scale: wave.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] },
            ]}
          />
        ))}
      </View>
      <View style={styles.cardsRow}>
        {cards.map((card, index) => {
          const isMatch = index === 0;
          return (
            <Animated.View
              key={index}
              style={[
                styles.card,
                {
                  opacity: card,
                  transform: [
                    { translateY: card.interpolate({ inputRange: [0, 1], outputRange: [140, 0] }) },
                    { rotate: card.interpolate({ inputRange: [0, 1], outputRange: [`${index % 2 === 0 ? -20 : 20}deg`, '0deg'] }) },
                  ],
                },
              ]}
            >
              {isMatch && <Animated.View style={[styles.greenTint, { opacity: highlight }]} />}
              <Text
                style={[styles.cardGlyph, { fontSize: glyphFontSize(glyphs[index % glyphs.length]) }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.4}
              >
                {glyphs[index % glyphs.length]}
              </Text>
              {isMatch && (
                <Animated.Text style={[styles.check, { opacity: highlight }]}>✓</Animated.Text>
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF8EF',
    gap: 28,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 96,
  },
  speaker: {
    fontSize: 64,
    marginRight: 8,
  },
  wave: {
    borderRightWidth: 5,
    borderColor: '#F2A541',
    borderRadius: 60,
    marginLeft: -6,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 18,
  },
  card: {
    width: 104,
    height: 104,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#E3D6BE',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenTint: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 15,
    backgroundColor: '#CDEFD3',
  },
  cardGlyph: {
    fontSize: 34,
    maxWidth: 92,
    textAlign: 'center',
  },
  check: {
    position: 'absolute',
    right: 8,
    bottom: 2,
    fontSize: 30,
    fontWeight: '800',
    color: '#2E9E4A',
  },
});
