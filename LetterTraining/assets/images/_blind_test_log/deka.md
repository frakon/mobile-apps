# Blind test log: deka ("deka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `deka.png.txt` (final) and task folder `Temp/Batches/batch_03/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 03, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_k683sd3a.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | deka | 3D render style, two stacked blankets; ubrus |

Evaluator-stage verdict: **FAIL after trial A (style break + two objects)**

## Round 2 — blind copy `obrazek_463lb0vc.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | ubrus | checkered square, pillow-like edge |

Evaluator-stage verdict: **FAIL after trial A (ubrus)**

## Round 3 — blind copy `obrazek_7lcc44jp.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | deka | peřina?; texture like pastry |
| B | deka | like palačinka |
| C | deka | like bread/croissant |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - folded fluffy blanket; pastry guesses differ, none fatal.

## Final status: **ACCEPTED**
