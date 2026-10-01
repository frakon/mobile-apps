# Blind test log: avokado ("avokádo")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `avokado.png.txt` (final) and task folder `Temp/Batches/batch_01/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 01, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_c29xraiv.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | avokádo | child may not know avocado |
| B | avokádo | none |
| C | avokádo | two halves may read as two things |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - two halves of one avocado read as one object.

## Final status: **ACCEPTED**
