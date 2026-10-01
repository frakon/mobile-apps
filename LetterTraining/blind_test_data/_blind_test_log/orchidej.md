# Blind test log: orchidej ("orchidej")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `orchidej.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO orchidej -- květina possible
- Trial B: SLOVO kytka -- may not know word orchidej
- Trial C: SLOVO orchidej -- kytka/květina possible
Result: FAIL - trial B said kytka

## Round 2
- Trial A: SLOVO orchidej -- kytka/květina possible
- Trial B: SLOVO orchidej -- kytka/květina possible
- Trial C: SLOVO orchidej -- květina/kytka possible

## Verifier
PASS (round 2) - 3/3. Proposed alternativeNames [kytka, květina].

## Status: ACCEPTED (round 2)
