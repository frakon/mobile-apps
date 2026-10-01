# Blind test log: talir ("talíř")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `talir.png.txt` (final) and task folder `Temp/Batches/batch_14/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 14, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_9ncemif9.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | talíř | oval; podnos/mísa possible; low contrast |
| B | talíř | oval; mísa/tác possible |
| C | talíř | oval; podnos/tác possible |

Evaluator-stage verdict: **3/3 correct, verifier FAIL: oval platter look, podnos/tác/mísa raised by all 3 (changes all levels), low contrast; fix: perfectly round plate, coloured rim, visible well**

## Round 2 — blind copy `obrazek_9myzspe2.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | talíř | a bit deep, miska possible |
| B | talíř | deeper well, miska possible |
| C | talíř | mísa/podšálek possible |

Evaluator-stage verdict: **3/3 correct**

Earlier-round images kept in task folder: `Temp/Batches/batch_14/rejected/talir_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 2) - round-1 oval platter fixed; perfectly round plate with wide dotted rim. miska/mísa remarks (2x) passing only; wide rim reads as talíř. alternativeNames: none (optional talířek). No flags.

## Final status: **ACCEPTED**
