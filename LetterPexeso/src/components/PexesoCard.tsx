import { memo, useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

interface PexesoCardProps {
  readonly cardId: number;
  readonly letter: string;
  readonly isFaceUp: boolean;
  readonly isRemoved: boolean;
  readonly width: number;
  readonly height: number;
  readonly onTap: (cardId: number) => void;
}

const FLIP_DURATION_MS = 160;

function PexesoCardComponent({ cardId, letter, isFaceUp, isRemoved, width, height, onTap }: PexesoCardProps) {
  // Simple flip effect: the card "unfolds" horizontally whenever its face changes (content switches instantly,
  // so game logic never waits for the animation).
  const flip = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isRemoved) {
      // A removed card renders an empty slot - nothing to animate. A flip stopped mid-way by a fast match does not
      // matter: every new game mounts fresh cards (App keys them by the game number).
      return;
    }
    flip.setValue(0.05);
    // The native driver is not available on web (dev warning) - JS-driven there.
    const animation = Animated.timing(flip, { toValue: 1, duration: FLIP_DURATION_MS, useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
    // `isRemoved` is intentionally NOT a dependency: only a face change animates; `isRemoved` is read just to skip
    // the flip of a card removed by a match.
  }, [isFaceUp, flip]);

  if (isRemoved) {
    // Matched pair leaves an empty slot (grid does not reflow); a tap there is a "background" tap handled by the parent.
    return <View style={{ width, height }} />;
  }

  const fontSize = Math.min(width, height) * (letter.length > 1 ? 0.42 : 0.6);

  return (
    <Pressable onPressIn={() => onTap(cardId)} style={{ width, height }} accessibilityRole="button"
      accessibilityLabel={isFaceUp ? `Písmeno ${letter}` : 'Otočená kartička'}>
      <Animated.View
        style={[
          styles.card,
          isFaceUp ? styles.faceUp : styles.faceDown,
          { width, height, transform: [{ scaleX: flip }] },
        ]}
      >
        {isFaceUp ? (
          <Text allowFontScaling={false} numberOfLines={1} style={[styles.letter, { fontSize, lineHeight: fontSize * 1.25 }]}>
            {letter}
          </Text>
        ) : (
          <Text allowFontScaling={false} style={[styles.back, { fontSize: Math.min(width, height) * 0.35 }]}>
            ?
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const PexesoCard = memo(PexesoCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow* props are deprecated on web (dev warning) -> equivalent boxShadow there; iOS/Android unchanged.
    ...Platform.select({
      web: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      },
    }),
  },
  faceDown: {
    backgroundColor: colors.cardBack,
    borderWidth: 3,
    borderColor: colors.cardBackBorder,
  },
  faceUp: {
    backgroundColor: colors.cardFace,
    borderWidth: 3,
    borderColor: colors.cardFaceBorder,
  },
  letter: {
    color: colors.letter,
    fontWeight: '800',
    textAlign: 'center',
    // Android-only (no effect on iOS): keeps the font's extra top/bottom padding. On iOS the room for diacritics
    // above capitals (Ď, Ť, Ů, Ě ...) comes from `lineHeight: fontSize * 1.25` set in the component.
    includeFontPadding: true,
  },
  back: {
    color: colors.cardBackMark,
    fontWeight: '800',
  },
});
