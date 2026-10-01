# Blind test log: most ("most")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `most.png.txt` (final) and task folder `Temp/Batches/batch_08/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 08, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_2g2btd3c.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | most | ends cut off; top like bench |
| B | most | no railing, ends in water |
| C | most | no railing, cut ends |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - cut-off ends are style. excludeL2/L3 already.

## Final status: **ACCEPTED**
