// Types of the generated train asset module (src/train/assets.ts) - "Abecedový vlak",
// `_LetterTraining_PROMPTS.md` / "## Follow-up prompt 5 — new game "Abecedový vlak" (verbatim)".

export interface FractionRectangle {
  // All values are fractions (0..1) of the image width / height.
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface TrainImage {
  readonly source: number;
  // width / height of the (trimmed) image.
  readonly aspect: number;
  // Wheel baseline (rail contact) as a fraction of the image height from the top - used to align all wheels on one rail.
  readonly baseline: number;
}

export interface WagonImage extends TrainImage {
  // Plain panel where the letter is drawn as text.
  readonly panel: FractionRectangle;
}
