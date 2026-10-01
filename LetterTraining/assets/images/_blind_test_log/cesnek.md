# Blind test log: cesnek

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_byoyj8f3.png`

- Trial(s) A česnek (cibule possible)
- Trial(s) B česnek (cibule possible, clove decides); C česnek (stroužek possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - garlic bulb plus one clove, 3/3 česnek; cibule possibility (A,B), clove disambiguates. No flags.

## Final status: **ACCEPTED** (round 1)
