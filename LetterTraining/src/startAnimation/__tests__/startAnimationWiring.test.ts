// Source-level wiring checks of the start-animation gates — `_LetterTraining_PROMPTS.md` / "### Phase D — start
// animations". Text-based (brittle on refactors, update with them), same approach as trainScreenWiring.test.ts:
// each game's loading branch renders <StartAnimation scene=…>, the offline branch (OfflineRetry) is checked BEFORE it,
// and the old plain "Načítám…" placeholders are gone. Cut-on-ready = the gate stops rendering that branch.

declare const __dirname: string;
const fileSystem = jest.requireActual('fs') as { readFileSync(path: string, encoding: 'utf8'): string };
const paths = jest.requireActual('path') as { join(...parts: string[]): string };

const root = paths.join(__dirname, '..', '..', '..');
const read = (...parts: string[]): string => fileSystem.readFileSync(paths.join(root, ...parts), 'utf8');

const SCREENS: [string, string, string][] = [
  ['words', 'app/words.tsx', "resourceStatus === 'offline'"],
  ['compose', 'app/compose.tsx', "resourceStatus === 'offline'"],
  ['train', 'app/train.tsx', "resourceStatus === 'offline'"],
  ['pexeso', 'src/pexeso/PexesoGame.tsx', "status === 'offline'"],
];

test.each(SCREENS)('%s: loading branch shows the themed StartAnimation after the offline branch', (scene, file, offlineCheck) => {
  const source = read(...file.split('/'));
  const animationAt = source.indexOf(`<StartAnimation scene="${scene}" />`);
  expect(animationAt).toBeGreaterThan(0);
  expect(source.split('<StartAnimation').length - 1).toBe(1);
  const offlineAt = source.indexOf(offlineCheck);
  expect(offlineAt).toBeGreaterThan(0);
  expect(offlineAt).toBeLessThan(animationAt);
  expect(source).not.toMatch(/Načítám/);
});

test('pexeso imports the animation through the app glue (keeps PexesoGame.tsx identical in both apps)', () => {
  expect(read('src', 'pexeso', 'PexesoGame.tsx')).toMatch(/StartAnimation,[\s\S]*?\} from '\.\/pexesoPlatform';/);
  expect(read('src', 'pexeso', 'pexesoPlatform.ts')).toContain("export { StartAnimation } from '../startAnimation/StartAnimation';");
});
