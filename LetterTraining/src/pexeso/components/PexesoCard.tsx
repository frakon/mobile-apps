import { memo, useEffect, useRef } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CardFace } from '../game/pexesoLogic';
import { EAR_IMAGE } from '../pexesoPlatform';
import { colors } from '../theme';
import { letterStyleTextStyle } from './letterFonts';

interface PexesoCardProps {
  readonly cardId: number;
  // Face content per column type (letter / image / sound-only ear) - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6 —
  // Pexeso improvements (standalone LetterPexeso + integrated in LetterTraining) (verbatim)".
  readonly face: CardFace;
  readonly isFaceUp: boolean;
  readonly isRemoved: boolean;
  readonly width: number;
  readonly height: number;
  readonly onTap: (cardId: number) => void;
}

const FLIP_DURATION_MS = 160;

function PexesoCardComponent({ cardId, face, isFaceUp, isRemoved, width, height, onTap }: PexesoCardProps) {
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

  const minSide = Math.min(width, height);
  // Smaller boards (4x10 on a phone) give small cards -> thinner border + radius.
  const borderStyle = minSide < 60 ? styles.smallCard : undefined;
  const accessibilityLabel = !isFaceUp
    ? 'Otočená kartička'
    : face.type === 'letter'
      ? `Písmeno ${face.text}`
      : face.type === 'image'
        ? `Obrázek ${face.word.word}`
        : 'Zvuk písmene';

  return (
    <Pressable onPressIn={() => onTap(cardId)} style={{ width, height }} accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Animated.View
        style={[
          styles.card,
          isFaceUp ? styles.faceUp : styles.faceDown,
          borderStyle,
          { width, height, transform: [{ scaleX: flip }] },
        ]}
      >
        {isFaceUp ? (
          <CardFaceContent face={face} width={width} height={height} />
        ) : (
          <Text allowFontScaling={false} style={[styles.back, { fontSize: minSide * 0.35 }]}>
            ?
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

function CardFaceContent({ face, width, height }: { readonly face: CardFace; readonly width: number; readonly height: number }) {
  const minSide = Math.min(width, height);
  if (face.type === 'image') {
    return <Image source={face.word.image} style={{ width: width * 0.86, height: height * 0.86 }} resizeMode="contain" />;
  }
  if (face.type === 'sound') {
    // The same ear picture on every sound card - "Q&A 9 — Pexeso improvements round 2".
    return <Image source={EAR_IMAGE} style={{ width: width * 0.86, height: height * 0.86 }} resizeMode="contain" />;
  }
  // Playwrite cursive fonts have ascent + descent ~1.9-2.2 em (carons of Ď Ť, ring of Ů, descenders): a 1.25 em line box
  // would clip them on Android, so cursive gets a 2.2 em line box and a slightly smaller size to still fit the card
  // (verification pexeso R1 finding L4).
  const isCursive = face.letterStyle !== 'print';
  const fontSize = Math.min(minSide * (face.text.length > 1 ? 0.42 : 0.6), width * (face.text.length > 1 ? 0.4 : 0.62)) * (isCursive ? 0.8 : 1);
  const lineHeight = fontSize * (isCursive ? 2.2 : 1.25);
  return (
    <Text allowFontScaling={false} numberOfLines={1} style={[styles.letter, letterStyleTextStyle(face.letterStyle), { fontSize, lineHeight }]}>
      {face.text}
    </Text>
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
  smallCard: {
    borderRadius: 8,
    borderWidth: 2,
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
    // above capitals (Ď, Ť, Ů, Ě ...) comes from the lineHeight set in the component (1.25 em print, 2.2 em cursive).
    includeFontPadding: true,
  },
  back: {
    color: colors.cardBackMark,
    fontWeight: '800',
  },
});
