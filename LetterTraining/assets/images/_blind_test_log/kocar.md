# Blind test log: kocar ("kočár")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `kocar.png.txt` (final) and task folder `Temp/Batches/batch_07/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 07, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_afqq2t3b.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kočár | kůň?; harness unclear |
| B | kočár | kůň?; no coachman |
| C | kočár | kůň?; only two wheels? |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (with flags) - 4 wheels visible, harness ok; all 3 raised kůň -> alternativeNames [kůň], excludeLevel2, excludeLevel3.

## Final status: **ACCEPTED**
