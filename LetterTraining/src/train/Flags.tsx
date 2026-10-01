// Small drawn flags (plain Views, no emoji) for the alphabet choice of "Abecedový vlak" - `_LetterTraining_PROMPTS.md` /
// "## Q&A 7 — Abecedový vlak round 2" ("Drawn flags ... Small drawn CZ/UK flags (emoji flags don't show on some Android
// devices)").

import React from 'react';
import { StyleSheet, View } from 'react-native';

const RED = '#D7141A';
const BLUE_CZ = '#11457E';
const BLUE_UK = '#012169';
const RED_UK = '#C8102E';

export function CzechFlag({ width }: { width: number }) {
  const height = (width * 2) / 3;
  // Wedge: a square (diagonal = flag height) centred on the left edge, rotated 45° and stretched horizontally so that its
  // right corner reaches half the flag width (CSS order: rotate first, then scaleX).
  const wedge = height / Math.SQRT2;
  const stretch = width / 2 / (height / 2);
  return (
    <View style={[styles.frame, { width, height }]}>
      <View style={{ height: height / 2, backgroundColor: '#FFFFFF' }} />
      <View style={{ height: height / 2, backgroundColor: RED }} />
      <View
        style={{
          position: 'absolute',
          width: wedge,
          height: wedge,
          left: -wedge / 2,
          top: height / 2 - wedge / 2,
          backgroundColor: BLUE_CZ,
          transform: [{ scaleX: stretch }, { rotate: '45deg' }],
        }}
      />
    </View>
  );
}

export function UnitedKingdomFlag({ width }: { width: number }) {
  const height = width / 2;
  const diagonal = Math.sqrt(width * width + height * height);
  const angle = Math.atan2(height, width);
  const bar = (stroke: number, color: string, rotation: number) => (
    <View
      style={{
        position: 'absolute',
        width: diagonal,
        height: stroke,
        left: (width - diagonal) / 2,
        top: (height - stroke) / 2,
        backgroundColor: color,
        transform: [{ rotate: `${rotation}rad` }],
      }}
    />
  );
  return (
    <View style={[styles.frame, { width, height, backgroundColor: BLUE_UK }]}>
      {bar(height * 0.2, '#FFFFFF', angle)}
      {bar(height * 0.2, '#FFFFFF', -angle)}
      {bar(height * 0.067, RED_UK, angle)}
      {bar(height * 0.067, RED_UK, -angle)}
      <View style={{ position: 'absolute', left: 0, right: 0, top: height * 0.333, height: height * 0.334, backgroundColor: '#FFFFFF' }} />
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: width / 2 - height * 0.167, width: height * 0.334, backgroundColor: '#FFFFFF' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: height * 0.4, height: height * 0.2, backgroundColor: RED_UK }} />
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: width / 2 - height * 0.1, width: height * 0.2, backgroundColor: RED_UK }} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', borderWidth: 1, borderColor: '#C9C2B5', borderRadius: 3 },
});
