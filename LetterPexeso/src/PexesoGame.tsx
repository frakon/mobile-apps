import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EndOverlay } from './components/EndOverlay';
import { PexesoCard } from './components/PexesoCard';
import {
  BoardSize,
  Card,
  MISMATCH_HIDE_DELAY_MS,
  PexesoSettings,
  availableLetters,
  createDeck,
  createInitialState,
  effectiveBoardSize,
  gameReducer,
  gridShapeFor,
  isCardFaceUp,
  isMismatchShown,
  pairCountOf,
} from './game/pexesoLogic';
import { PEXESO_LETTER_AUDIO, PEXESO_WORDS, playAudio, stopAudioIfOwnedBy } from './pexesoPlatform';
import { loadPexesoSettings } from './pexesoSettingsStorage';
import { colors } from './theme';

const GAP = 10;
const LANDSCAPE_GAP = 8;
// Big boards (4x8, 4x10 on a phone) need thinner gaps - DECISION (not user-specified).
const BIG_BOARD_GAP = 4;
const BIG_BOARD_CARD_COUNT = 24;

// LetterPexeso game nested into LetterTraining - `_LetterTraining_PROMPTS.md` / "## Initial request (2026-10-01)"
// ("Pexeso: the same game as is already implemented in LetterPexeso shall be nested under this app").
// IDENTICAL file in LetterPexeso/src/PexesoGame.tsx and LetterTraining/src/pexeso/PexesoGame.tsx (app glue = pexesoPlatform.ts).
// Settings / card types / audio / scoring - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6 — Pexeso improvements
// (standalone LetterPexeso + integrated in LetterTraining) (verbatim)", "Q&A 8 ...", "Q&A 9 ...".
interface PexesoGameProps {
  // Back to the training selection (header back button + "Zpět na výběr" in the end overlay).
  readonly onBack?: () => void;
  // Opens the settings screen (header gear button).
  readonly onOpenSettings?: () => void;
  // Changed by the host when the settings screen was left -> settings are re-read; a changed setting starts a new game.
  readonly settingsReloadToken?: number;
  // Settings shown before the async load finishes (tests); undefined = blank screen until loaded.
  readonly initialSettings?: PexesoSettings;
}

export default function PexesoGame({ onBack, onOpenSettings, settingsReloadToken = 0, initialSettings }: PexesoGameProps) {
  // Landscape game - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape". In LetterTraining only THIS screen is
  // landscape (app.json "orientation": "default"): lock while the game is mounted, unlock when the screen is left
  // (the pexeso screen is a stack leaf, so mount/unmount == focus/leave). Web cannot lock (rejects) -> ignored,
  // the layout then follows the window shape (see gridShapeFor).
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => undefined);
    return () => {
      ScreenOrientation.unlockAsync().catch(() => undefined);
    };
  }, []);

  // Settings are loaded asynchronously; the board is shown once they are known.
  const [settings, setSettings] = useState<PexesoSettings | undefined>(initialSettings);
  useEffect(() => {
    let cancelled = false;
    loadPexesoSettings().then((loaded) => {
      if (!cancelled) {
        // Same content -> keep the same object (no new game when nothing changed).
        setSettings((previous) => (previous !== undefined && JSON.stringify(previous) === JSON.stringify(loaded) ? previous : loaded));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [settingsReloadToken]);

  if (settings === undefined) {
    return <View style={styles.root} />;
  }
  const letters = availableLetters(settings, PEXESO_WORDS);
  const boardSize = effectiveBoardSize(settings, letters.length);
  if (boardSize === undefined) {
    // Not even 2x2 possible (e.g. images vs images with too few pictures) - DECISION (not user-specified): explain.
    return (
      <SafeAreaView style={[styles.root, styles.notPossible]}>
        <Text style={styles.notPossibleText}>Pro toto nastavení není dost obrázků. Změň nastavení.</Text>
        {onOpenSettings !== undefined && (
          <Pressable onPress={onOpenSettings} accessibilityRole="button" style={styles.backButton}>
            <Text style={styles.backButtonText}>⚙ Nastavení</Text>
          </Pressable>
        )}
        {onBack !== undefined && (
          <Pressable onPress={onBack} accessibilityRole="button" style={[styles.backButton, styles.notPossibleButton]}>
            <Text style={styles.backButtonText}>‹ Zpět</Text>
          </Pressable>
        )}
      </SafeAreaView>
    );
  }
  // Keyed by the settings content: changed settings mount a fresh game.
  return <GameScreen key={JSON.stringify(settings)} onBack={onBack} onOpenSettings={onOpenSettings} settings={settings} boardSize={boardSize} />;
}

interface GameScreenProps extends PexesoGameProps {
  readonly settings: PexesoSettings;
  readonly boardSize: BoardSize;
}

function newDeck(settings: PexesoSettings, boardSize: BoardSize): Card[] {
  return createDeck(settings, PEXESO_WORDS, pairCountOf(boardSize));
}

// Sound of a card turned face-up (only on flip, not again on match - "Q&A 9"). Letter + image cards are muted by the
// sound setting; sound-only cards always play - "Follow-up prompt 6".
// `onDone` runs when the sound finished or failed (not when it was stopped by a newer sound); returns whether a sound started.
function playCardSound(card: Card, soundOn: boolean, owner: object, onDone?: () => void): boolean {
  if (card.face.type !== 'sound' && !soundOn) {
    return false;
  }
  const source = card.face.type === 'image' ? card.face.word.audio : PEXESO_LETTER_AUDIO[card.letter];
  if (source === undefined) {
    return false;
  }
  playAudio(source, { key: `pexeso:${card.id}`, owner, rate: 1, onFinish: onDone, onFailure: onDone });
  return true;
}

function GameScreen({ onBack, onOpenSettings, settings, boardSize }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState(newDeck(settings, boardSize)));
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const audioOwner = useRef({}).current;
  // True while the sound of a sound-only FIRST card of an attempt is playing; the second card's sound then waits for it
  // (a sound-only card can only be "read" by listening - verification pexeso R1 finding "sound-vs-sound cut off").
  const soundCardPlayingRef = useRef(false);
  const queuedCardRef = useRef<Card | undefined>(undefined);

  // Leaving the game stops only this game's card sound (never another screen's sound).
  useEffect(() => () => stopAudioIfOwnedBy(audioOwner), [audioOwner]);

  // Only a new reveal plays (revealToken changes on every card turned face-up).
  const { revealToken, lastRevealedCardId } = state;
  const revealedCard = lastRevealedCardId === undefined ? undefined : state.cards[lastRevealedCardId];
  const isSecondCardOfAttempt = state.openCardIds.length === 2 || (revealedCard?.isRemoved ?? false);
  useEffect(() => {
    if (revealedCard === undefined || revealToken <= 0) {
      return;
    }
    if (isSecondCardOfAttempt && soundCardPlayingRef.current) {
      queuedCardRef.current = revealedCard; // played when the first (sound-only) card's sound ends
      return;
    }
    queuedCardRef.current = undefined;
    const isSoundCard = revealedCard.face.type === 'sound';
    soundCardPlayingRef.current = false;
    const started = playCardSound(revealedCard, settings.soundOn, audioOwner, () => {
      soundCardPlayingRef.current = false;
      const queued = queuedCardRef.current;
      queuedCardRef.current = undefined;
      if (queued !== undefined) {
        playCardSound(queued, settings.soundOn, audioOwner);
      }
    });
    soundCardPlayingRef.current = started && isSoundCard && !isSecondCardOfAttempt;
  }, [revealToken]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const onPlayAgain = useCallback(() => dispatch({ type: 'newGame', cards: newDeck(settings, boardSize) }), [settings, boardSize]);

  const onGridLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setGridSize({ width, height });
  }, []);

  // Longer board side along the longer window side - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape".
  const windowSize = useWindowDimensions();
  const isLandscape = windowSize.width >= windowSize.height;
  const { columns, rows } = gridShapeFor(boardSize, windowSize.width, windowSize.height);
  const gap = state.cards.length >= BIG_BOARD_CARD_COUNT ? BIG_BOARD_GAP : isLandscape ? LANDSCAPE_GAP : GAP;

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
              {onBack !== undefined && (
                <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Zpět na výběr" style={styles.backButton} hitSlop={8}>
                  <Text style={styles.backButtonText} allowFontScaling={false}>‹ Zpět</Text>
                </Pressable>
              )}
              {/* Both texts may shrink (single line, font scaled down) so the row never overflows. */}
              <Text style={[styles.title, isLandscape && styles.titleLandscape]} allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                Pexeso písmen
              </Text>
              <Text style={[styles.stats, isLandscape && styles.statsLandscape]} allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                Správně {state.rightMatches}   Špatně {state.wrongMatches}   Pokusů {state.attempts}
              </Text>
              {onOpenSettings !== undefined && (
                <Pressable onPress={onOpenSettings} accessibilityRole="button" accessibilityLabel="Nastavení" style={styles.settingsButton} hitSlop={8}>
                  <Text style={styles.settingsButtonText} allowFontScaling={false}>⚙</Text>
                </Pressable>
              )}
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
                      face={card.face}
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
          onBackToSelection={onBack}
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
  backButton: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.panel,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.statsText,
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
  settingsButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: colors.panel,
  },
  settingsButtonText: {
    fontSize: 20,
    color: colors.statsText,
  },
  notPossible: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notPossibleText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.title,
    textAlign: 'center',
    marginBottom: 16,
  },
  notPossibleButton: {
    marginTop: 12,
  },
});
