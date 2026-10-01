// Source-level wiring check of app/words.tsx - `_LetterTraining_PROMPTS.md` / "## Specification change 14":
// a correct tap keeps the slight green tint but shows NO green check mark (it hid the letter(s)). Text-based, brittle on
// refactors - update it with them.

declare const __dirname: string;
const fileSystem = jest.requireActual('fs') as { readFileSync(path: string, encoding: 'utf8'): string };
const paths = jest.requireActual('path') as { join(...parts: string[]): string };

const source = fileSystem.readFileSync(paths.join(__dirname, '..', '..', '..', 'app', 'words.tsx'), 'utf8');

test('correct answer: green tint stays, no check mark is rendered ("## Specification change 14")', () => {
  expect(source).toMatch(/showGreen && <View style=\{\[styles\.optionOverlay, styles\.greenOverlay\]\} \/>/);
  expect(source).toMatch(/greenOverlay: \{\s*backgroundColor: 'rgba\(70, 190, 90, 0\.35\)'/);
  expect(source).not.toMatch(/<Text[^>]*>✓<\/Text>/);
  expect(source).not.toMatch(/styles\.checkmark/);
});
