# Blind test log: jezdec ("jezdec")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `jezdec.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO kůň -- horse dominates; koník/jezdec possible
Result: FAIL - trial A said kůň

## Round 2
- Trial A: SLOVO koník -- rider as prominent as pony; kůň/poník/jezdec
Result: FAIL - trial A said koník

## Round 3
- Trial A: SLOVO jezdec -- pony small; kůň/jezdec/žokej possible
- Trial B: SLOVO jezdec -- horse very small vs rider, proportions off
- Trial C: SLOVO kůň -- horse small, legs cut off at edge; kůň/jezdec
Result: FAIL - trial C said kůň (A/B jezdec); kůň raised by all 3; horse proportions off

## Status: REJECTED (3 rounds failed; images in Temp/Batches/batch_20/rejected/)
Proposed replacement: J replacement, e.g. jaguár
