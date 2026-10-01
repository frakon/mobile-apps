# Blind test log: zaves ("závěs")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zaves.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO okno -- curtains billow with closed window; záclona/závěs possible
Result: FAIL - trial A said okno

## Round 2
- Trial A: SLOVO závěs -- opona (theatre) possible
- Trial B: SLOVO závěs -- záclona/opona possible; rings slightly irregular
- Trial C: SLOVO závěs -- hangs in space without window; záclona/opona possible

## Verifier
PASS (round 2) - 3/3; zaclona (same z/zá, L3 differs), opona. Proposed alternativeNames [záclona, opona]; proposed flag excludeLevel3.

## Status: ACCEPTED (round 2)
