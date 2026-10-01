# Blind test log: sirka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `sirka.png.txt`; all prompts: task folder `Temp/Batches/batch_13/prompts_r1.json`. Answers condensed, not verbatim. Batch 13, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_jxuye07g.png`

- Trial A sirka (calls it zápalka in description)
- Trials B sirka (described as zápalka; big, like stick/torch); C **zápalka** (sirka/špejle possible)

## Independent verifier (opus, fresh agent; batched 5 images)

PASS (some levels only) - burning match; 2/3 sirka, 1/3 zápalka, A/B also used zápalka in descriptions. alternativeNames [zápalka]; proposed excludeLevel1=true, excludeLevel2=true (L3 -ka kept).

## Final status: **ACCEPTED** (round 1)
