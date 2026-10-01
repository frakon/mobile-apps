# Blind test log: sane ("sáně")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `sane.png.txt` (final) and task folder `Temp/Batches/batch_12/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 12, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_3p5wa0jv.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | sáňky | child sledge with spiral runners |

Evaluator-stage verdict: **early stop after trial A: sáňky (different word)**

## Round 2 — blind copy `obrazek_dlh1g9h2.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | sáňky | big sledge still read as child sledge |

Evaluator-stage verdict: **early stop after trial A: sáňky (different word)**

## Round 3 — blind copy `obrazek_ztk6doz9.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | saně | drawbar with nothing attached; Santa sleigh look |
| B | saně | backrest like armchair/bench |
| C | saně | short drawbar; sáňky possible, shape fits saně |

Evaluator-stage verdict: **3/3 correct**

Earlier-round images kept in task folder: `Temp/Batches/batch_12/rejected/sane_r1.png`, `Temp/Batches/batch_12/rejected/sane_r2.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 3) - alternativeNames saně; L2 'sa' (saně, standard form used by evaluators) vs 'sá' (sáně): accept both at L2 or set excludeLevel2 / respell target to saně.

## Final status: **ACCEPTED**
