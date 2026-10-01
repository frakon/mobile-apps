# Blind test log: zokej ("žokej")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zokej.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO kůň -- horse main motif; rider looks like a small child; žokej/jezdec possible
Result: FAIL - trial A said kůň

## Round 2
- Trial A: SLOVO žokej -- horse only head/neck, incomplete, small; kůň/jezdec/sedlo possible
- Trial B: SLOVO žokej -- horse very small, no body; jezdec/kůň possible
- Trial C: SLOVO žokej -- horse head only, small next to boy; kůň/jezdec possible

## Verifier
PASS (round 2) - 3/3; horse only head/neck acceptable. Proposed alternativeNames [jezdec].

## Status: ACCEPTED (round 2)
