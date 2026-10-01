# Blind test log: carodej ("čaroděj")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `carodej.png.txt` (final) and task folder `Temp/Batches/batch_03/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 03, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_i90af8wf.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kouzelník | blue starry robe, wand; kouzelník/čaroděj/děda |

Evaluator-stage verdict: **FAIL after trial A (kouzelník changes all levels)**

## Round 2 — blind copy `obrazek_6x2yu6i5.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kouzelník | cauldron + owl distract |

Evaluator-stage verdict: **FAIL after trial A (kouzelník)**

## Round 3 — blind copy `obrazek_kflqopdv.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kouzelník | black robe, staff with raven |

Evaluator-stage verdict: **FAIL after trial A (kouzelník)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

not reached (3 rounds failed at evaluator stage: children name it kouzelník). Images: Temp/Batches/batch_03/rejected/carodej_r3.png (+ blind copies).

## Final status: **REJECTED**
