# Blind test log: zabradli ("zábradlí")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zabradli.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO schody -- staircase floating, handrail ends without post
Result: FAIL - trial A said schody

## Round 2
- Trial A: SLOVO zábradlí -- schody/plot possible; base slightly illogical, handrail cut off right
- Trial B: SLOVO zábradlí -- steps barely visible; schody/plot possible
- Trial C: SLOVO zábradlí -- schody/plot possible

## Verifier
PASS (round 2) - 3/3; rail cut off minor. Proposed alternativeNames [schody, plot].

## Status: ACCEPTED (round 2)
