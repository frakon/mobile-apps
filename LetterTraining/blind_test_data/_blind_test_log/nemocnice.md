# Blind test log: nemocnice ("nemocnice")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `nemocnice.png.txt` (final) and task folder `Temp/Batches/batch_10/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 10, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_shyyuht8.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | nemocnice | sanitka possible |
| B | nemocnice | ambulance prominent, sanitka |
| C | nemocnice | ambulance prominent, sanitka |

Evaluator-stage verdict: **3/3 correct, verifier FAIL: 3/3 raised sanitka (changes all levels); fix: no ambulance/vehicles**

## Round 2 — blind copy `obrazek_lb8w4tkj.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | nemocnice | office building without cross |
| B | nemocnice | budova/dům possible |
| C | nemocnice | dům/škola without crosses |

Evaluator-stage verdict: **3/3 correct**

Round-1 image kept in task folder `Temp/Batches/batch_10/rejected/nemocnice_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 PASS - building only with two red crosses, no ambulance; budova/dum/skola remarks are about a picture without crosses. No flags, all levels kept.

## Final status: **ACCEPTED**
