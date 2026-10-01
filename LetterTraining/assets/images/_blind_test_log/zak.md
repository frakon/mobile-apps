# Blind test log: zak ("žák")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zak.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO školák -- škola/školák/žák/kluk possible; no chair visible
Result: FAIL - trial A said školák

## Round 2
- Trial A: SLOVO žák -- many items: žák/kluk/škola
- Trial B: SLOVO kluk -- main subject unclear: chlapec/žák/škola
- Trial C: SLOVO školák -- žák/školák/kluk/lavice/škola
Result: FAIL - trial B said kluk, trial C školák

## Round 3
- Trial A: SLOVO školák -- several competing items: školák/aktovka/psaní; no chair
Result: FAIL - trial A said školák

## Status: REJECTED (3 rounds failed; images in Temp/Batches/batch_20/rejected/)
Proposed replacement: no obvious Ž replacement; žvýkačka (in words.json, no image yet)
