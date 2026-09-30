import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';

interface EndOverlayProps {
  readonly rightMatches: number;
  readonly wrongMatches: number;
  readonly attempts: number;
  readonly onPlayAgain: () => void;
}

// End-of-game statistics + "play again" - `_LetterPexeso_PROMPTS.md` / "User request (verbatim)".
// Texts follow Dynamic Type only up to MAX_FONT_SCALE and the panel scrolls, so "Hrát znovu" stays reachable
// even at the largest accessibility text sizes (verification finding "EndOverlay Dynamic Type").
const MAX_FONT_SCALE = 1.4;

// A short window (landscape phone, ~320-375 pt high) gets a compact panel so it fits without scrolling
// - `_LetterPexeso_PROMPTS.md` / "Follow-up 1: landscape".
const COMPACT_HEIGHT_LIMIT = 500;

export function EndOverlay({ rightMatches, wrongMatches, attempts, onPlayAgain }: EndOverlayProps) {
  const isCompact = useWindowDimensions().height < COMPACT_HEIGHT_LIMIT;
  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={[styles.scrollContent, isCompact && styles.scrollContentCompact]} bounces={false}>
          <View style={[styles.panel, isCompact && styles.panelCompact]}>
            <Text style={[styles.title, isCompact && styles.titleCompact]} maxFontSizeMultiplier={MAX_FONT_SCALE}>Výborně!</Text>
            <StatRow label="Správně" value={rightMatches} isCompact={isCompact} />
            <StatRow label="Špatně" value={wrongMatches} isCompact={isCompact} />
            <StatRow label="Pokusů celkem" value={attempts} isCompact={isCompact} />
            <Pressable
              onPress={onPlayAgain}
              accessibilityRole="button"
              style={({ pressed }) => [styles.button, isCompact && styles.buttonCompact, pressed && styles.buttonPressed]}
            >
              <Text style={[styles.buttonText, isCompact && styles.buttonTextCompact]} maxFontSizeMultiplier={MAX_FONT_SCALE}>
                Hrát znovu
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatRow({ label, value, isCompact }: { readonly label: string; readonly value: number; readonly isCompact: boolean }) {
  return (
    <View style={[styles.row, isCompact && styles.rowCompact]}>
      <Text style={[styles.rowLabel, isCompact && styles.rowLabelCompact]} maxFontSizeMultiplier={MAX_FONT_SCALE}>{label}</Text>
      <Text style={[styles.rowValue, isCompact && styles.rowValueCompact]} maxFontSizeMultiplier={MAX_FONT_SCALE}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.panel,
    borderRadius: 28,
    padding: 28,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.title,
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    flexShrink: 1,
    marginRight: 12,
    fontSize: 24,
    color: colors.statsText,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 28,
    color: colors.letter,
    fontWeight: '800',
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.button,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.buttonPressed,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.buttonText,
  },
  // Compact variants (short landscape window).
  scrollContentCompact: {
    padding: 12,
  },
  panelCompact: {
    padding: 16,
    borderRadius: 22,
  },
  titleCompact: {
    fontSize: 30,
    marginBottom: 6,
  },
  rowCompact: {
    paddingVertical: 3,
  },
  rowLabelCompact: {
    fontSize: 20,
  },
  rowValueCompact: {
    fontSize: 24,
  },
  buttonCompact: {
    marginTop: 12,
    paddingVertical: 10,
  },
  buttonTextCompact: {
    fontSize: 26,
  },
});
