# Blind test log: skola

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `skola.png.txt`; all prompts: task folder `Temp/Batches/batch_13/prompts_r1.json`. Answers condensed, not verbatim. Batch 13, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_tl48n4q4.png`

- Trial A škola (zámek/radnice/dům possible; clock+tower point to school)
- Trials B škola (radnice/zámeček/dům possible); C škola (dům/zámek/radnice possible)

## Independent verifier (opus, fresh agent; batched 5 images)

PASS (with reservation) - 3/3 škola, but 3/3 said could be zámek/radnice/dům. alternativeNames [budova]; no flags. Optional later fix: add school cues.

## Final status: **ACCEPTED** (round 1)
