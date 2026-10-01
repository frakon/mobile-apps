# Blind test log: ubrus

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `ubrus.png.txt`; all prompts: task folder `Temp/Batches/batch_15/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 15, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_nswlnqmc.png`

- Trial(s) A **stůl** (ubrus possible) -> FAIL r1
- Round verdict: MISS (early stop, regenerated)

## Round 2 — blind copy `obrazek_hoqi6jui.png`

- Trial(s) A **ubrousek** (ubrus/šátek possible) -> FAIL r2
- Round verdict: MISS (early stop, regenerated)

## Round 3 — blind copy `obrazek_e49fozsg.png`

- Trial(s) A ubrus (stůl possible; table hidden)
- Trial(s) B ubrus (stůl possible; table hidden), C ubrus (stůl possible; shape a bit like covered box/bed)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched 5 images)

PASS (round 3) - floor-length white tablecloth with red embroidered border hiding a table, 3/3 ubrus; all 3 noted stůl possible. Round 1 = stůl, round 2 (flat cloth) = ubrousek. alternativeNames [stůl]; optional excludeLevel1 (L3 'rus' stays usable).

## Final status: **ACCEPTED** (round 3)
