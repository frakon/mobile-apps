// Themed exercise start animation shown by a game's preload gate while its resources load (mobile-apps-preferences
// skill, "Exercise start animation"; `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9" decision 4 "One themed
// animation per game" + "### Phase D — start animations"). One master clock drives the per-scene keyframe tracks of
// startAnimationLogic.ts; ≤5 s, then the last frame stays as the fixed screen. The gate cuts it simply by rendering the
// game instead (unmount stops the clock) — no waiting for the animation to finish.
//
// Uses React Native's core Animated (not Reanimated) so the same file runs in the standalone LetterPexeso app, which has
// no Reanimated dependency. Core Animated does not consult the system Reduce Motion setting, so the motion stays
// continuous — the same outcome as the train's NEVER_REDUCED opt-out.
//
// SHARED FILE: kept byte-identical in LetterTraining (src/startAnimation/) and LetterPexeso (src/startAnimation/).

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import {
  COMPOSE_PICTURE,
  COMPOSE_PLAN,
  COMPOSE_WORD,
  Keyframes,
  PEXESO_CARD_SHAPES,
  PEXESO_MATCH_PAIR,
  PEXESO_PLAN,
  PexesoShape,
  StartAnimationScene,
  TRAIN_LETTERS,
  TRAIN_PLAN,
  WORDS_CORRECT_INDEX,
  WORDS_OPTIONS,
  WORDS_PICTURE,
  WORDS_PLAN,
  sceneDurationMs,
  toInterpolation,
} from './startAnimationLogic';

const STAGE_WIDTH = 300;
const STAGE_HEIGHT = 220;

type StartAnimationProps = {
  scene: StartAnimationScene;
  // Optional caption under the stage (default fits all games).
  caption?: string;
};

export function StartAnimation({ scene, caption }: StartAnimationProps): React.ReactElement {
  const clock = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const run = Animated.timing(clock, {
      toValue: sceneDurationMs(scene),
      duration: sceneDurationMs(scene),
      easing: Easing.linear,
      useNativeDriver: true,
    });
    run.start();
    return () => run.stop();
  }, [clock, scene]);

  return (
    <View style={styles.container} accessibilityLabel="Připravuji hru">
      <View style={styles.stage}>
        {scene === 'words' && <WordsScene clock={clock} />}
        {scene === 'compose' && <ComposeScene clock={clock} />}
        {scene === 'train' && <TrainScene clock={clock} />}
        {scene === 'pexeso' && <PexesoScene clock={clock} />}
      </View>
      <Text style={styles.caption}>{caption ?? 'Připravuji hru…'}</Text>
    </View>
  );
}

type SceneProps = { clock: Animated.Value };

function track(clock: Animated.Value, keys: Keyframes): Animated.AnimatedInterpolation<number> {
  return clock.interpolate({ ...toInterpolation(keys), extrapolate: 'clamp' });
}

// Maps a 0→1 progress track onto a from→to coordinate.
function along(clock: Animated.Value, keys: Keyframes, from: number, to: number): Animated.AnimatedInterpolation<number> {
  return track(clock, keys).interpolate({ inputRange: [0, 1], outputRange: [from, to] });
}

function WordsScene({ clock }: SceneProps): React.ReactElement {
  return (
    <>
      <Animated.View style={[styles.pictureCard, { left: 100, top: 10, transform: [{ scale: track(clock, WORDS_PLAN.picture) }] }]}>
        <Text style={styles.pictureEmoji}>{WORDS_PICTURE}</Text>
      </Animated.View>
      <Animated.Text style={[styles.speaker, { left: 215, top: 35, transform: [{ scale: track(clock, WORDS_PLAN.speaker) }] }]}>
        🔊
      </Animated.Text>
      {WORDS_OPTIONS.map((letter, index) => (
        <Animated.View
          key={letter}
          style={[styles.letterBubble, { left: 45 + index * 80, top: 140, transform: [{ scale: track(clock, WORDS_PLAN.options[index]) }] }]}
        >
          {index === WORDS_CORRECT_INDEX && (
            <Animated.View style={[styles.highlight, { opacity: track(clock, WORDS_PLAN.correctHighlight) }]} />
          )}
          <Text style={styles.letterText}>{letter}</Text>
        </Animated.View>
      ))}
    </>
  );
}

function ComposeScene({ clock }: SceneProps): React.ReactElement {
  const boxLeft = (index: number): number => 60 + index * 65;
  // Pool order differs from the word order so the tiles visibly travel to their boxes.
  const poolLeft = [190, 60, 125];
  return (
    <>
      <Animated.View style={[styles.smallPicture, { left: 125, top: 0, transform: [{ scale: track(clock, COMPOSE_PLAN.picture) }] }]}>
        <Text style={styles.smallPictureEmoji}>{COMPOSE_PICTURE}</Text>
      </Animated.View>
      {COMPOSE_WORD.map((letter, index) => (
        <Animated.View key={`box-${index}`} style={[styles.box, { left: boxLeft(index), top: 70, opacity: track(clock, COMPOSE_PLAN.boxes) }]}>
          <Animated.View style={[styles.highlight, { opacity: track(clock, COMPOSE_PLAN.done) }]} />
        </Animated.View>
      ))}
      {COMPOSE_WORD.map((letter, index) => (
        <Animated.View
          key={`tile-${index}`}
          style={[
            styles.tile,
            {
              left: 0,
              top: 0,
              transform: [
                { translateX: along(clock, COMPOSE_PLAN.tiles[index], poolLeft[index] + 4, boxLeft(index) + 4) },
                { translateY: along(clock, COMPOSE_PLAN.tiles[index], 160, 74) },
              ],
            },
          ]}
        >
          <Text style={styles.letterText}>{letter}</Text>
        </Animated.View>
      ))}
    </>
  );
}

function TrainScene({ clock }: SceneProps): React.ReactElement {
  const engineStop = 190;
  const wagonWidth = 55;
  return (
    <>
      <View style={styles.rail} />
      <Animated.View style={[styles.engine, { left: 0, transform: [{ translateX: along(clock, TRAIN_PLAN.engine, -120, engineStop) }] }]}>
        <View style={styles.chimney} />
        <View style={styles.cabin} />
        <Animated.Text style={[styles.puff, { opacity: track(clock, TRAIN_PLAN.puff) }]}>💨</Animated.Text>
        <Wheels />
      </Animated.View>
      {TRAIN_LETTERS.map((letter, index) => (
        <Animated.View
          key={letter}
          style={[
            styles.wagon,
            { left: 0, transform: [{ translateX: along(clock, TRAIN_PLAN.wagons[index], STAGE_WIDTH + 20, engineStop - (index + 1) * (wagonWidth + 6)) }] },
          ]}
        >
          <Text style={styles.wagonText}>{letter}</Text>
          <Wheels />
        </Animated.View>
      ))}
    </>
  );
}

function Wheels(): React.ReactElement {
  return (
    <>
      <View style={[styles.wheel, { left: 6 }]} />
      <View style={[styles.wheel, { right: 6 }]} />
    </>
  );
}

function PexesoScene({ clock }: SceneProps): React.ReactElement {
  const cardWidth = 70;
  const cardHeight = 90;
  const placeLeft = (index: number): number => 30 + (index % 3) * (cardWidth + 15);
  const placeTop = (index: number): number => 15 + Math.floor(index / 3) * (cardHeight + 15);
  return (
    <>
      {PEXESO_CARD_SHAPES.map((shape, index) => {
        const matched = (PEXESO_MATCH_PAIR as readonly number[]).includes(index);
        const presence = matched ? track(clock, PEXESO_PLAN.matchedPresence) : 1;
        return (
          <Animated.View
            key={index}
            style={[
              styles.card,
              {
                width: cardWidth,
                height: cardHeight,
                left: 0,
                top: 0,
                opacity: presence,
                transform: [
                  { translateX: along(clock, PEXESO_PLAN.deal[index], STAGE_WIDTH / 2 - cardWidth / 2, placeLeft(index)) },
                  { translateY: along(clock, PEXESO_PLAN.deal[index], -cardHeight - 20, placeTop(index)) },
                  { scale: presence },
                  { scaleX: track(clock, PEXESO_PLAN.flipScale[index]) },
                ],
              },
            ]}
          >
            <Animated.View style={[styles.cardFace, { opacity: track(clock, PEXESO_PLAN.face[index]) }]}>
              <Shape shape={shape} />
            </Animated.View>
          </Animated.View>
        );
      })}
      {PEXESO_MATCH_PAIR.map((index) => (
        <Animated.Text
          key={`sparkle-${index}`}
          style={[styles.sparkle, { left: placeLeft(index) + 18, top: placeTop(index) + 22, opacity: track(clock, PEXESO_PLAN.sparkle) }]}
        >
          ✨
        </Animated.Text>
      ))}
    </>
  );
}

function Shape({ shape }: { shape: PexesoShape }): React.ReactElement {
  switch (shape) {
    case 'circle':
      return <View style={[styles.shape, styles.circle]} />;
    case 'square':
      return <View style={[styles.shape, styles.square]} />;
    case 'diamond':
      return <View style={[styles.shape, styles.diamond]} />;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  stage: { width: STAGE_WIDTH, height: STAGE_HEIGHT, overflow: 'hidden' },
  caption: { marginTop: 16, fontSize: 20, color: '#555' },
  pictureCard: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#f0c040',
  },
  pictureEmoji: { fontSize: 56 },
  speaker: { position: 'absolute', fontSize: 36 },
  letterBubble: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  highlight: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#7ed67e' },
  letterText: { fontSize: 30, fontWeight: 'bold', color: '#234' },
  smallPicture: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f0c040',
  },
  smallPictureEmoji: { fontSize: 34 },
  box: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#88a',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#ffe08a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d9a520',
  },
  rail: { position: 'absolute', left: 0, right: 0, top: 168, height: 6, backgroundColor: '#8a6d4b' },
  engine: { position: 'absolute', top: 92, width: 100, height: 70, borderRadius: 10, backgroundColor: '#d9443a' },
  chimney: { position: 'absolute', left: 62, top: -22, width: 16, height: 24, backgroundColor: '#333', borderRadius: 3 },
  cabin: { position: 'absolute', left: 8, top: 8, width: 34, height: 28, borderRadius: 4, backgroundColor: '#bfe6ff' },
  puff: { position: 'absolute', left: 70, top: -58, fontSize: 30 },
  wagon: {
    position: 'absolute',
    top: 112,
    width: 55,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#3a7bd9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wagonText: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  wheel: { position: 'absolute', bottom: -8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#333' },
  card: { position: 'absolute', borderRadius: 10, backgroundColor: '#5b6fd6', borderWidth: 3, borderColor: '#fff', overflow: 'hidden' },
  cardFace: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#fffbe8', alignItems: 'center', justifyContent: 'center' },
  sparkle: { position: 'absolute', fontSize: 30 },
  shape: { width: 34, height: 34 },
  circle: { borderRadius: 17, backgroundColor: '#e54b4b' },
  square: { borderRadius: 4, backgroundColor: '#3fae5a' },
  diamond: { borderRadius: 4, backgroundColor: '#f2a71b', transform: [{ rotate: '45deg' }] },
});
