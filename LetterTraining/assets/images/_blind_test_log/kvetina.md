# Blind test log: kvetina ("květina")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `kvetina.png.txt` (final) and task folder `Temp/Batches/batch_07/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 07, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_uaeknkjs.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kytka | květináč? |
| B | květina | květináč? |
| C | kytka | květináč? |

Evaluator-stage verdict: **1/3 exact, 2/3 kytka (existing alternative, L1 k kept)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - existing alternativeNames [kytka] + excludeLevel2/3 cover it; no new flags.

## Final status: **ACCEPTED**
