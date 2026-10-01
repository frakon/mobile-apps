// Word-length range bar of the "Skládání slov" settings - `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 19"
// ("visually like a bar with minimum and maximum knots"). Pure React Native (PanResponder, no new dependency): a touch
// grabs the nearer knot, dragging snaps it to integer counts (logic: rangeValueAtPosition / moveRangeKnot); the knots
// never cross. `onChange` fires on every snapped change, `onCommit` once on release (persisting).

import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, Text, View } from 'react-native';

import {
  ComposeLengthRange,
  RangeKnot,
  moveRangeKnot,
  nearestRangeKnot,
  resolveDragKnot,
  rangePositionOfValue,
  rangeValueAtPosition,
} from './logic';

const KNOT_SIZE = 36;

interface RangeBarProps {
  readonly bounds: ComposeLengthRange;
  readonly value: ComposeLengthRange;
  readonly onChange: (range: ComposeLengthRange) => void;
  readonly onCommit: (range: ComposeLengthRange) => void;
}

export function RangeBar({ bounds, value, onChange, onCommit }: RangeBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  // Refs: the PanResponder is created once, its callbacks read the current props / drag state.
  const latest = useRef({ bounds, value, onChange, onCommit, trackWidth });
  latest.current = { bounds, value, onChange, onCommit, trackWidth };
  const drag = useRef<{ knot: RangeKnot; range: ComposeLengthRange } | null>(null);
  const barPageX = useRef(0);

  const valueAt = (locationX: number) =>
    rangeValueAtPosition(locationX - KNOT_SIZE / 2, latest.current.trackWidth, latest.current.bounds);

  const update = (locationX: number) => {
    const current = drag.current;
    if (current === null) {
      return;
    }
    const value = valueAt(locationX);
    const knot = resolveDragKnot(current.range, current.knot, value);
    const next = moveRangeKnot(current.range, knot, value);
    if (next.min !== current.range.min || next.max !== current.range.max) {
      drag.current = { knot, range: next };
      latest.current.onChange(next);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Keep the gesture (no parent scroll steal while dragging a knot).
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        // Children are pointerEvents="none", so locationX is relative to the bar; remember the bar's page x for moves.
        const x = event.nativeEvent.locationX;
        barPageX.current = event.nativeEvent.pageX - x;
        drag.current = { knot: nearestRangeKnot(latest.current.value, valueAt(x)), range: latest.current.value };
        update(x);
      },
      // Page coordinates minus the bar's page x (taken at grant).
      onPanResponderMove: (_event, gesture) => update(gesture.moveX - barPageX.current),
      onPanResponderRelease: () => {
        if (drag.current !== null) {
          latest.current.onCommit(drag.current.range);
        }
        drag.current = null;
      },
      onPanResponderTerminate: () => {
        if (drag.current !== null) {
          latest.current.onCommit(drag.current.range);
        }
        drag.current = null;
      },
    })
  ).current;

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(Math.max(0, event.nativeEvent.layout.width - KNOT_SIZE));

  const minX = rangePositionOfValue(value.min, trackWidth, bounds);
  const maxX = rangePositionOfValue(value.max, trackWidth, bounds);

  return (
    <View>
      <View
        style={styles.bar}
        onLayout={onLayout}
        {...panResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel={`Délka slov od ${value.min} do ${value.max}`}
      >
        <View pointerEvents="none" style={[styles.track, { left: KNOT_SIZE / 2, right: KNOT_SIZE / 2 }]} />
        <View pointerEvents="none" style={[styles.selected, { left: KNOT_SIZE / 2 + minX, width: maxX - minX }]} />
        {trackWidth > 0 && (
          <>
            <View pointerEvents="none" style={[styles.knot, { left: minX }]}>
              <Text style={styles.knotLabel}>{value.min}</Text>
            </View>
            <View pointerEvents="none" style={[styles.knot, { left: maxX }]}>
              <Text style={styles.knotLabel}>{value.max}</Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.boundsRow}>
        <Text style={styles.boundLabel}>{bounds.min}</Text>
        <Text style={styles.boundLabel}>{bounds.max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: KNOT_SIZE + 12, justifyContent: 'center' },
  track: { position: 'absolute', height: 8, borderRadius: 4, backgroundColor: '#E8D9BC' },
  selected: { position: 'absolute', height: 8, borderRadius: 4, backgroundColor: '#FFB23F' },
  knot: {
    position: 'absolute',
    width: KNOT_SIZE,
    height: KNOT_SIZE,
    borderRadius: KNOT_SIZE / 2,
    backgroundColor: '#5B3E96',
    alignItems: 'center',
    justifyContent: 'center',
  },
  knotLabel: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  boundsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: KNOT_SIZE / 2 - 4 },
  boundLabel: { fontSize: 14, color: '#6B5B7B' },
});
