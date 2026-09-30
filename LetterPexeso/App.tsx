import { useCallback, useEffect, useReducer, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { EndOverlay } from './src/components/EndOverlay';
import { PexesoCard } from './src/components/PexesoCard';
import {
  MISMATCH_HIDE_DELAY_MS,
  createDeck,
  createNewGame,
  gameReducer,
  gridShapeFor,
  isCardFaceUp,
  isMismatchShown,
} from './src/game/pexesoLogic';
import { colors } from './src/theme';

const GAP = 10;
const LANDSCAPE_GAP = 8;

export default function App() {
  // Landscape game - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape". app.json sets "orientation": "landscape"
  // for standalone builds; the runtime lock makes it hold in Expo Go too. Web cannot lock (rejects) -> ignored,
  // the layout then follows the window shape (see gridShapeFor).
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <GameScreen />
    </SafeAreaProvider>
  );
}

function GameScreen() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createNewGame());
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  // Auto-hide of a shown mismatch after 1 s. The token makes a late timer harmless, and the cleanup
  // cancels the timer as soon as the mismatch is hidden early by a tap (or a new one appears).
  const mismatchShown = isMismatchShown(state);
  useEffect(() => {
    if (!mismatchShown) {
      return;
    }
    const token = state.mismatchToken;
    const handle = setTimeout(() => dispatch({ type: 'mismatchTimeout', token }), MISMATCH_HIDE_DELAY_MS);
    return () => clearTimeout(handle);
  }, [mismatchShown, state.mismatchToken]);

  const onTapCard = useCallback((cardId: number) => dispatch({ type: 'tapCard', cardId }), []);
  const onTapBackground = useCallback(() => dispatch({ type: 'tapBackground' }), []);
  const onPlayAgain = useCallback(() => dispatch({ type: 'newGame', cards: createDeck() }), []);

  const onGridLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setGridSize({ width, height });
  }, []);

  // 6 x 3 when the window is landscape, 3 x 6 fallback otherwise - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape".
  const windowSize = useWindowDimensions();
  const isLandscape = windowSize.width >= windowSize.height;
  const { columns, rows } = gridShapeFor(windowSize.width, windowSize.height);
  const gap = isLandscape ? LANDSCAPE_GAP : GAP;

  const cardWidth = Math.max(0, Math.floor((gridSize.width - gap * (columns - 1)) / columns));
  const cardHeight = Math.max(0, Math.floor((gridSize.height - gap * (rows - 1)) / rows));

  return (
    <View style={styles.root}>
      {/* Any tap outside a card hides a shown mismatch - including the top/bottom safe-area strips,
          so the background Pressable wraps the SafeAreaView (verification finding "safe-area strips"). */}
      <Pressable style={styles.root} onPressIn={onTapBackground} accessible={false}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
          <View style={[styles.screen, isLandscape && styles.screenLandscape]}>
            <View style={[styles.header, isLandscape && styles.headerLandscape]}>
              {/* Both texts may shrink (single line, font scaled down) so the row never overflows. */}
              <Text style={[styles.title, isLandscape && styles.titleLandscape]} allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                Pexeso písmen
              </Text>
              <Text style={[styles.stats, isLandscape && styles.statsLandscape]} allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                Správně {state.rightMatches}   Špatně {state.wrongMatches}
              </Text>
            </View>
            <View style={styles.grid} onLayout={onGridLayout}>
              {cardWidth > 0 && cardHeight > 0 &&
                state.cards.map((card) => (
                  <View
                    // The game number in the key mounts fresh cards (fresh flip values) for every new game - a flip
                    // stopped mid-way by a fast match can never leave a squeezed card in the next game
                    // (verification finding "flip stuck after fast match").
                    key={`${state.gameNumber}-${card.id}`}
                    style={{
                      position: 'absolute',
                      left: (card.id % columns) * (cardWidth + gap),
                      top: Math.floor(card.id / columns) * (cardHeight + gap),
                      // style.pointerEvents instead of the prop (deprecated on web).
                      pointerEvents: 'box-none',
                    }}
                  >
                    <PexesoCard
                      cardId={card.id}
                      letter={card.letter}
                      isFaceUp={isCardFaceUp(state, card.id)}
                      isRemoved={card.isRemoved}
                      width={cardWidth}
                      height={cardHeight}
                      onTap={onTapCard}
                    />
                  </View>
                ))}
            </View>
          </View>
        </SafeAreaView>
      </Pressable>
      {/* Overlay is a sibling of the background Pressable (not its child), so it handles its own safe area. */}
      {state.isGameOver && (
        <EndOverlay
          rightMatches={state.rightMatches}
          wrongMatches={state.wrongMatches}
          attempts={state.attempts}
          onPlayAgain={onPlayAgain}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  // Landscape: the short height goes to the cards - compact single-line header, smaller paddings
  // (`_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape").
  screenLandscape: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerLandscape: {
    paddingVertical: 4,
  },
  title: {
    flexShrink: 1,
    marginRight: 8,
    // adjustsFontSizeToFit is ignored on web -> a smaller base size there so the header does not truncate.
    fontSize: Platform.OS === 'web' ? 20 : 22,
    fontWeight: '800',
    color: colors.title,
  },
  titleLandscape: {
    fontSize: 18,
  },
  stats: {
    flexShrink: 1,
    fontSize: Platform.OS === 'web' ? 15 : 16,
    fontWeight: '600',
    color: colors.statsText,
  },
  statsLandscape: {
    fontSize: 15,
  },
  grid: {
    flex: 1,
  },
});
