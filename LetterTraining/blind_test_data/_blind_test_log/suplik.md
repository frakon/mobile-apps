# Blind test log: suplik

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_wuw8ws76.png`

- Trial(s) A **komoda** (stolek/skříňka possible) -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_sa2zevbx.png`

- Trial(s) A šuplík (krabice/bedna possible)
- Trial(s) B šuplík (krabice/bedna possible); C šuplík (krabice/bedýnka possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS (round 2) - single wooden drawer with knob; 3/3 šuplík; krabice/bedna noted by all 3 as side remark. Proposed alternativeNames [krabice, bedna]. (r1 chest of drawers -> 'komoda' miss.)

## Final status: **ACCEPTED** (round 2)
