# Blind test log: jablon ("jabloň")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `jablon.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO strom -- strom/jabloň/jablko possible
Result: FAIL - trial A said strom

## Round 2
- Trial A: SLOVO jabloň -- too many oversized apples on long thin stalks; strom/jablka possible
- Trial B: SLOVO jabloň -- apples oversized; strom/jablka possible; basket extra
- Trial C: SLOVO jabloň -- apples oversized, willow-like twigs; strom/jablka possible
Result: FAIL - verifier FAIL: oversized apples on long drooping stalks, basket; strom raised 3x

## Round 3
- Trial A: SLOVO strom -- strom/jabloň/jablka possible
Result: FAIL - trial A said strom

## Status: REJECTED (3 rounds failed; images in Temp/Batches/batch_20/rejected/)
Proposed replacement: J replacement, e.g. jachta (in words.json, no image yet)
