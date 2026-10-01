# Blind test log: kalhoty ("kalhoty")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `kalhoty.png.txt` (final) and task folder `Temp/Batches/batch_07/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 07, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_cjsx6hrf.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kalhoty | džíny? |
| B | kalhoty | džíny? |
| C | kalhoty | džíny? |

Evaluator-stage verdict: **3/3 correct, but 3/3 raise džíny**

## Round 2 — blind copy `obrazek_cckaycly.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kalhoty | oblekové kalhoty |
| B | kalhoty | gatě?; many belt loops |
| C | kalhoty | společenské kalhoty |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 1 verifier: FAIL - blue denim, all 3 raised džíny, which changes every level. Round 2 verifier: PASS - grey cloth trousers, 6 belt loops normal; no alternativeNames needed (gatě optional, dialect); no flags.

## Final status: **ACCEPTED**
