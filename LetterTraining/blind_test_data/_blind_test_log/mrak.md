# Blind test log: mrak

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_23/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 23 (Track B), 2026-10-01; all 3 trials run in parallel (no early stop).

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Regeneration of a previously ACCEPTED image (flaw: low contrast vs white background). Previous image + its log kept in task folder `Temp/Batches/batch_23/replaced_old/`.

## Round 1 (batch 23 round 1) — blind copy `obrazek_6gy8vuxg.png`

- Trials A mrak (slightly weak contrast white on white; vata unlikely); B mrak (visible thanks to outlines); C mrak (stylised, clear)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - white cloud with blue-grey outline and shading, good contrast (previous flaw fixed). 3/3 mrak; weak-contrast/vata one-off. alternativeNames []; flags [] (keep excludeLevel2+3).

## Final status: **ACCEPTED** (round 1)
