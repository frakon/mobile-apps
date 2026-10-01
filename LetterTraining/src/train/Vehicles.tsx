// Engine / wagon rendering of "Abecedový vlak" - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5 — new game
// "Abecedový vlak" (verbatim)" ("Every letter sits inside its wagon"; steam engine). Uses the generated images
// (src/train/assets.ts) and falls back to simple drawn placeholders while the images do not exist yet.
// The letter is drawn as text over the wagon's plain panel (evaluation "Final decisions").

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ENGINE_IMAGES, WAGON_IMAGES } from './assets';
import { FractionRectangle } from './types';

export const PLACEHOLDER_ENGINE_ASPECT = 2;
export const PLACEHOLDER_WAGON_ASPECT = 1.5;
const PLACEHOLDER_BASELINE = 1;
const PLACEHOLDER_PANEL: FractionRectangle = { x: 0.12, y: 0.08, width: 0.76, height: 0.62 };
const PLACEHOLDER_COLORS = ['#E0457B', '#3FA7D6', '#59C36A', '#FFB23F', '#8E6CCF', '#F2704E'];

export interface VehicleGeometry {
  readonly aspect: number;
  readonly baseline: number;
}

export function engineGeometry(engineIndex: number): VehicleGeometry {
  const image = ENGINE_IMAGES[engineIndex];
  return image === undefined ? { aspect: PLACEHOLDER_ENGINE_ASPECT, baseline: PLACEHOLDER_BASELINE } : image;
}

export function wagonGeometry(wagonIndex: number): VehicleGeometry {
  const image = WAGON_IMAGES[wagonIndex];
  return image === undefined ? { aspect: PLACEHOLDER_WAGON_ASPECT, baseline: PLACEHOLDER_BASELINE } : image;
}

// `imageUri` = hot in-memory data URI of the engine picture from the backend archive `train/train.zip`
// (`_LetterTraining_PROMPTS.md` / "## Follow-up prompt 9 — mobile-apps-preferences"); undefined -> drawn placeholder.
export function Engine({ engineIndex, width, imageUri }: { engineIndex: number; width: number; imageUri?: string }) {
  const geometry = engineGeometry(engineIndex);
  const height = width / geometry.aspect;
  if (imageUri !== undefined) {
    return <Image source={{ uri: imageUri }} style={{ width, height }} resizeMode="stretch" />;
  }
  // Placeholder steam engine (faces left): chimney, boiler, cabin, wheels.
  const wheel = height * 0.3;
  return (
    <View style={{ width, height }}>
      <View style={[styles.box, { left: width * 0.12, top: height * 0.05, width: width * 0.1, height: height * 0.3, backgroundColor: '#444' }]} />
      <View style={[styles.box, { left: width * 0.05, top: height * 0.32, width: width * 0.6, height: height * 0.42, borderRadius: height * 0.2, backgroundColor: '#D63B3B' }]} />
      <View style={[styles.box, { left: width * 0.6, top: height * 0.08, width: width * 0.36, height: height * 0.66, borderRadius: 6, backgroundColor: '#3060B0' }]} />
      <View style={[styles.box, { left: width * 0.68, top: height * 0.16, width: width * 0.2, height: height * 0.22, backgroundColor: '#CFE8FF' }]} />
      {[0.12, 0.38, 0.72].map((x) => (
        <View key={x} style={[styles.box, styles.wheel, { left: width * x, top: height - wheel, width: wheel, height: wheel, borderRadius: wheel / 2 }]} />
      ))}
    </View>
  );
}

// `imageUri` as in Engine: the wagon picture from `train/train.zip`; undefined -> drawn placeholder.
export function Wagon({ wagonIndex, width, label, colorSeed, imageUri }: { wagonIndex: number; width: number; label: string; colorSeed: number; imageUri?: string }) {
  const image = WAGON_IMAGES[wagonIndex];
  const geometry = wagonGeometry(wagonIndex);
  const height = width / geometry.aspect;
  const panel = image?.panel ?? PLACEHOLDER_PANEL;
  const panelHeight = panel.height * height;
  const letter = (
    <View
      pointerEvents="none"
      style={[styles.box, styles.center, { left: panel.x * width, top: panel.y * height, width: panel.width * width, height: panelHeight }]}
    >
      <Text style={[styles.letter, { fontSize: panelHeight * 0.78 }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4}>
        {label}
      </Text>
    </View>
  );
  if (imageUri !== undefined) {
    return (
      <View style={{ width, height }}>
        <Image source={{ uri: imageUri }} style={{ width, height }} resizeMode="stretch" />
        {letter}
      </View>
    );
  }
  const wheel = height * 0.26;
  return (
    <View style={{ width, height }}>
      <View
        style={[
          styles.box,
          { left: 0, top: 0, width, height: height - wheel * 0.6, borderRadius: 8, backgroundColor: PLACEHOLDER_COLORS[colorSeed % PLACEHOLDER_COLORS.length] },
        ]}
      />
      <View style={[styles.box, styles.panel, { left: panel.x * width, top: panel.y * height, width: panel.width * width, height: panelHeight }]} />
      {[0.14, 0.86].map((x) => (
        <View key={x} style={[styles.box, styles.wheel, { left: width * x - wheel / 2, top: height - wheel, width: wheel, height: wheel, borderRadius: wheel / 2 }]} />
      ))}
      {letter}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { position: 'absolute' },
  center: { alignItems: 'center', justifyContent: 'center' },
  wheel: { backgroundColor: '#333', borderWidth: 3, borderColor: '#999' },
  panel: { backgroundColor: '#FFFDF5', borderRadius: 6 },
  letter: { fontWeight: '900', color: '#3B2A63', textAlign: 'center', includeFontPadding: false },
});
