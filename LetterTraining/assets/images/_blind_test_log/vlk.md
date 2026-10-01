# Blind test log: vlk

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `vlk.png.txt`; all prompts: task folder `Temp/Batches/batch_15/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 15, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_npxo2sy0.png`

- Trial(s) A vlk (husky/pes possible)
- Trial(s) B vlk (pes/husky), C vlk (pes/husky)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched 5 images)

PASS - grey wolf, 3/3 vlk; pes/husky side remarks. Optional alternativeNames [pes]; keep excludeLevel2/3.

## Final status: **ACCEPTED** (round 1)
