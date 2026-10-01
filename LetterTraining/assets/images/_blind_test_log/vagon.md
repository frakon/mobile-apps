# Blind test log: vagon

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `vagon.png.txt`; all prompts: task folder `Temp/Batches/batch_15/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 15, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ken9zvcc.png`

- Trial(s) A vagon (none)
- Trial(s) B vagon (vlak possible), C vagon (vlak possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched 5 images)

PASS - red boxcar on track, 3/3 vagon; vlak covered by existing alternativeNames + excludeLevel2/3.

## Final status: **ACCEPTED** (round 1)
