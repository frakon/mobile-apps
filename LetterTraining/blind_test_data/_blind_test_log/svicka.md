# Blind test log: svicka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `svicka.png.txt`; all prompts: task folder `Temp/Batches/batch_13/prompts_r1.json`. Answers condensed, not verbatim. Batch 13, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_0myujz1j.png`

- Trial A svíčka (svícen possible)
- Trials B svíčka (svícen secondary); C svíčka (none)

## Independent verifier (opus, fresh agent; batched 5 images)

PASS - lit candle in small holder, 3/3 svíčka; svícen secondary. Keep alternativeNames [svíce], excludeLevel2+3.

## Final status: **ACCEPTED** (round 1)
