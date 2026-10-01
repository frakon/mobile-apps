# Blind test log: uhli ("uhlí")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `uhli.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO uhlí -- pieces unusually regular, crystal-like (drahokamy/kameny)
- Trial B: SLOVO uhlí -- edges too regular, crystal-like
- Trial C: SLOVO uhlí -- too geometric; kameny/krystaly possible
Result: FAIL - verifier FAIL: pieces too regular/faceted like crystals (all 3 flagged)

## Round 2
- Trial A: SLOVO uhlí -- shiny edges, dust; kamínky possible
- Trial B: SLOVO uhlí -- could look like black stones; shiny edges suggest coal
- Trial C: SLOVO uhlí -- could be black stone/lava/obsidian, most like coal

## Verifier
PASS (round 2) - 3/3; crystal look fixed. No proposals.

## Status: ACCEPTED (round 2)
