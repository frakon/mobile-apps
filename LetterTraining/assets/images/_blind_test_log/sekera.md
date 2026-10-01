# Blind test log: sekera ("sekera")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `sekera.png.txt` (final) and task folder `Temp/Batches/batch_12/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 12, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_lob75fjj.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | sekera | none |
| B | sekera | širočina/sekerka possible |
| C | sekera | looks like small sekerka |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - alternativeNames sekerka; proposed excludeLevel3 (or accept sekerka at L3).

## Final status: **ACCEPTED**
