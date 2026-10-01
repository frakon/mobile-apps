# Blind test log: strecha

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `strecha.png.txt`; all prompts: task folder `Temp/Batches/batch_13/prompts_r1.json`. Answers condensed, not verbatim. Batch 13, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_o34y8kgb.png`

- Trial A střecha (roof shape half hip/half gable; tiles crooked at edge; dům possible)
- Trials B střecha (no walls, floats; dům possible; geometry between hip and gable); C střecha (asymmetric, ridge shifted, tile rows irregular; dům possible)

## Independent verifier (opus, fresh agent; batched 5 images)

PASS (borderline) - 3/3 střecha, but 3/3 noted roof geometry flaw (half hip/half gable, off-centre ridge, uneven tiles). No flags. Fix if regenerated: symmetric gable roof, straight ridge, even tile rows.

## Final status: **ACCEPTED** (round 1)
