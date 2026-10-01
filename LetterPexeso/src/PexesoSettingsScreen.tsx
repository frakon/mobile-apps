// Pexeso settings screen - `_LetterPexeso_PROMPTS.md` / "Follow-up prompt 6 — Pexeso improvements (standalone LetterPexeso +
// integrated in LetterTraining) (verbatim)", "Q&A 8 — Pexeso improvements round 1", "Q&A 9 — Pexeso improvements round 2",
// "Follow-up prompt 7 (verbatim)", "Follow-up prompt 8 (verbatim)". Persisted via pexesoSettingsStorage.ts (load/save +
// race guard pattern of LetterTraining app/compose-settings.tsx).
// IDENTICAL file in LetterPexeso/src/PexesoSettingsScreen.tsx and LetterTraining/src/pexeso/PexesoSettingsScreen.tsx.

import { ReactNode, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { letterStyleTextStyle } from './components/letterFonts';
import {
  BOARD_SIZES,
  CardFaceType,
  ColumnSettings,
  DEFAULT_SETTINGS,
  LetterCase,
  LetterStyle,
  PexesoSettings,
  availableLetters,
  effectiveBoardSize,
  isSizeAvailable,
} from './game/pexesoLogic';
import { PEXESO_SAMPLE_IMAGES, PEXESO_WORDS } from './pexesoPlatform';
import { loadPexesoSettings, savePexesoSettings } from './pexesoSettingsStorage';
import { colors } from './theme';

const TYPE_CHOICES: readonly { value: CardFaceType; label: string }[] = [
  { value: 'letter', label: 'Písmena' },
  { value: 'image', label: 'Obrázky' },
  { value: 'sound', label: 'Jen zvuk (ucho)' },
];
const CASE_CHOICES: readonly { value: LetterCase; label: string }[] = [
  { value: 'upper', label: 'VELKÁ' },
  { value: 'lower', label: 'malá' },
];
const STYLE_CHOICES: readonly { value: LetterStyle; label: string }[] = [
  { value: 'print', label: 'Tiskací' },
  { value: 'cursiveComenia', label: 'Psací – nevázané (Comenia)' },
  { value: 'cursiveTraditional', label: 'Psací – tradiční vázané' },
];

interface PexesoSettingsScreenProps {
  readonly onBack: () => void;
}

export default function PexesoSettingsScreen({ onBack }: PexesoSettingsScreenProps) {
  const [settings, setSettings] = useState<PexesoSettings>(DEFAULT_SETTINGS);
  // Race guard: a tap before the async load resolves must not be overwritten by the stale stored value.
  const userChoseRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadPexesoSettings().then((stored) => {
      if (!cancelled && !userChoseRef.current) {
        setSettings(stored);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (next: PexesoSettings) => {
    userChoseRef.current = true;
    setSettings(next);
    void savePexesoSettings(next);
  };
  const updateColumn = (columnIndex: 0 | 1, column: Partial<ColumnSettings>) => {
    const columns: [ColumnSettings, ColumnSettings] = [settings.columns[0], settings.columns[1]];
    columns[columnIndex] = { ...columns[columnIndex], ...column };
    update({ ...settings, columns });
  };

  const letterCount = availableLetters(settings, PEXESO_WORDS).length;
  const playedSize = effectiveBoardSize(settings, letterCount);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Zpět" style={styles.backButton} hitSlop={8}>
          <Text style={styles.backButtonText}>‹ Zpět</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>Nastavení – Pexeso</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Písmena</Text>
        <View style={styles.row}>
          <Checkbox label="háčky (Č Ď Ě Ň Ř Š Ť Ž)" checked={settings.useHacky} onToggle={() => update({ ...settings, useHacky: !settings.useHacky })} />
          <Checkbox label="čárky (Á É Í Ó Ú Ý Ů)" checked={settings.useCarky} onToggle={() => update({ ...settings, useCarky: !settings.useCarky })} />
        </View>
        <Text style={styles.note}>CH je vždy zahrnuto. Dostupných písmen: {letterCount}</Text>

        <Text style={styles.sectionTitle}>Velikost</Text>
        <View style={styles.row}>
          {BOARD_SIZES.map((size) => {
            const enabled = isSizeAvailable(size, letterCount);
            return (
              <Choice
                key={size.id}
                label={size.id.replace('x', ' × ')}
                selected={settings.sizeId === size.id}
                disabled={!enabled}
                onPress={() => update({ ...settings, sizeId: size.id })}
              />
            );
          })}
        </View>
        {playedSize !== undefined && playedSize.id !== settings.sizeId && (
          <Text style={styles.note}>Na zvolenou velikost není dost písmen – hraje se {playedSize.id.replace('x', ' × ')}.</Text>
        )}
        {playedSize === undefined && <Text style={styles.warning}>Pro toto nastavení není dost obrázků.</Text>}

        <Text style={styles.sectionTitle}>Zvuk</Text>
        {/* Greyed when both columns are sound-only: the setting applies only to letters / images - "Follow-up prompt 6". */}
        <Checkbox
          label="Přehrávat písmena a obrázky"
          checked={settings.soundOn}
          disabled={settings.columns.every((column) => column.type === 'sound')}
          onToggle={() => update({ ...settings, soundOn: !settings.soundOn })}
        />
        <Text style={styles.note}>Kartičky „jen zvuk“ hrají vždy.</Text>

        <View style={styles.columns}>
          {([0, 1] as const).map((columnIndex) => {
            const column = settings.columns[columnIndex];
            const lettersOnly = column.type !== 'letter';
            return (
              <View key={columnIndex} style={styles.column}>
                <Text style={styles.sectionTitle}>Kartička {columnIndex + 1}</Text>
                {TYPE_CHOICES.map((choice) => (
                  <Choice key={choice.value} label={choice.label} selected={column.type === choice.value} onPress={() => updateColumn(columnIndex, { type: choice.value })} wide />
                ))}
                {column.type === 'image' && (
                  // Preview of the "Obrázky" card type: a few BUNDLED, DOWNSIZED sample pictures (the real board
                  // pictures are backend-served) — user decision 9 in `_LetterTraining_PROMPTS.md` /
                  // "## Follow-up prompt 9 — mobile-apps-preferences (backend resources, cache, preload)".
                  <View style={styles.sampleRow}>
                    {PEXESO_SAMPLE_IMAGES.map((sample, sampleIndex) => (
                      <Image key={sampleIndex} source={sample} style={styles.sampleImage} resizeMode="contain" />
                    ))}
                  </View>
                )}
                <Text style={[styles.subTitle, lettersOnly && styles.disabledText]}>Velikost písmen</Text>
                {CASE_CHOICES.map((choice) => (
                  <Choice key={choice.value} label={choice.label} selected={column.letterCase === choice.value} disabled={lettersOnly} onPress={() => updateColumn(columnIndex, { letterCase: choice.value })} wide />
                ))}
                <Text style={[styles.subTitle, lettersOnly && styles.disabledText]}>Písmo</Text>
                {STYLE_CHOICES.map((choice) => (
                  <Choice key={choice.value} label={choice.label} selected={column.letterStyle === choice.value} disabled={lettersOnly} onPress={() => updateColumn(columnIndex, { letterStyle: choice.value })} wide
                    labelStyleOf={choice.value} />
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Checkbox({ label, checked, disabled = false, onToggle }: { readonly label: string; readonly checked: boolean; readonly disabled?: boolean; readonly onToggle: () => void }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked, disabled }} disabled={disabled} onPress={onToggle} style={[styles.checkbox, disabled && styles.choiceDisabled]}>
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>{checked && <Text style={styles.checkboxMark}>✓</Text>}</View>
      <Text style={[styles.choiceLabel, disabled && styles.disabledText]}>{label}</Text>
    </Pressable>
  );
}

interface ChoiceProps {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled?: boolean;
  readonly wide?: boolean;
  readonly labelStyleOf?: LetterStyle;
  readonly onPress: () => void;
}

// Radio option; disabled = greyed out and not pressable - "Follow-up prompt 6" (case / style active only for letters,
// sizes exceeding the available letters greyed - "Q&A 8").
function Choice({ label, selected, disabled = false, wide = false, labelStyleOf, onPress }: ChoiceProps): ReactNode {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.choice, wide && styles.choiceWide, selected && styles.choiceSelected, disabled && styles.choiceDisabled]}
    >
      <Text style={[styles.choiceLabel, labelStyleOf !== undefined && letterStyleTextStyle(labelStyleOf), disabled && styles.disabledText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  backButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.panel },
  backButtonText: { fontSize: 18, fontWeight: '700', color: colors.statsText },
  headerTitle: { flex: 1, marginHorizontal: 10, fontSize: 20, fontWeight: '800', color: colors.title, textAlign: 'center' },
  body: { paddingHorizontal: 16, paddingBottom: 24, maxWidth: 900, width: '100%', alignSelf: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.title, marginTop: 14, marginBottom: 8 },
  subTitle: { fontSize: 16, fontWeight: '700', color: colors.statsText, marginTop: 10, marginBottom: 6 },
  note: { fontSize: 14, color: colors.statsText, marginTop: 2 },
  warning: { fontSize: 15, fontWeight: '700', color: colors.letter, marginTop: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  columns: { flexDirection: 'row', gap: 14 },
  column: { flex: 1 },
  checkbox: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, marginRight: 16 },
  checkboxBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.cardFaceBorder,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxBoxChecked: { backgroundColor: colors.cardFaceBorder },
  checkboxMark: { fontSize: 18, fontWeight: '900', color: colors.panel },
  choice: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#E8D9BC',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  choiceWide: { marginBottom: 6 },
  sampleRow: { flexDirection: 'row', gap: 8, marginTop: 2, marginBottom: 6 },
  sampleImage: { width: 56, height: 56, borderRadius: 10, backgroundColor: colors.panel },
  choiceSelected: { borderColor: colors.cardFaceBorder, backgroundColor: '#FFF0D0' },
  choiceDisabled: { opacity: 0.4 },
  choiceLabel: { fontSize: 17, fontWeight: '700', color: colors.title },
  disabledText: { color: '#A89DB5' },
});
