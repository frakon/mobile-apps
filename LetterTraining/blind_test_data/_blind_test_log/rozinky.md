# Blind test log: rozinky ("rozinky")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `rozinky.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO datle -- size/shape like dates; rozinky/švestky possible
Result: FAIL - trial A said datle

## Round 2
- Trial A: SLOVO rozinky -- kávová zrna/semínka/kamínky possible
- Trial B: SLOVO rozinka -- coffee beans/seeds possible from afar
- Trial C: SLOVO rozinky -- coffee beans/legumes possible

## Verifier
PASS (round 2) - 3/3 (rozinka inflection OK). No proposals.

## Status: ACCEPTED (round 2)
