# Blind test log: eskalator ("eskalátor")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `eskalator.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO eskalátor -- child may say schody; top end open
- Trial B: SLOVO eskalátor -- schody possible; top simplified
- Trial C: SLOVO eskalátor -- schody possible; small paint splashes

## Verifier
PASS - 3/3; schody raised 3x, affects only L3 (L1/L2 excluded). Proposed alternativeNames [schody]; optional excludeLevel3.

## Status: ACCEPTED (round 1)
