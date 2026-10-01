# Blind test log: boruvka ("borůvka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `boruvka.png.txt` (final) and task folder `Temp/Batches/batch_01/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 01, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_aa8aq4qj.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | borůvky | kanadské borůvky |
| B | borůvky | cultivated look |
| C | borůvky | none |

Evaluator-stage verdict: **3/3 correct (plural)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - plural borůvky changes L3 (ky vs ka): excludeLevel3, alternativeNames [borůvky].

## Final status: **ACCEPTED**
