# Blind test log: osel ("osel")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `osel.png.txt` (final) and task folder `Temp/Batches/batch_10/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 10, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_bq47ei62.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | oslík | cute smiling donkey (diminutive = miss) |

Evaluator-stage verdict: **early stop after trial A: diminutive oslík**

## Round 2 — blind copy `obrazek_ey6spf57.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | osel | shoulder stripe natural |
| B | osel | none |
| C | osel | none |

Evaluator-stage verdict: **3/3 correct**

Round-1 image kept in task folder `Temp/Batches/batch_10/rejected/osel_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 PASS - clear adult donkey, 3/3 osel (oslik problem fixed); shoulder stripe natural. No flags.

## Final status: **ACCEPTED**
