# Blind test log: hreben ("hřeben")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `hreben.png.txt` (final) and task folder `Temp/Batches/batch_05/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 05, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_pt516jx9.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | hřeben | none |
| B | hřeben | speckles like dirt/rust |
| C | hřeben | speckles like dirt/rust |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - speckles read as wood grain/watercolour, not a defect.

## Final status: **ACCEPTED**
