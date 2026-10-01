# Blind test log: olej ("olej")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `olej.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO láhev -- yellow liquid could be oil or juice; child names the bottle
Result: FAIL - trial A said láhev

## Round 2
- Trial A: SLOVO olej -- could be med/sirup/džus
- Trial B: SLOVO olej -- med/sirup/džus or láhev possible; no label
- Trial C: SLOVO olej -- olej/med/sirup; thin light liquid suggests oil

## Verifier
PASS (round 2) - 3/3. Proposed alternativeNames [med, sirup].

## Status: ACCEPTED (round 2)
