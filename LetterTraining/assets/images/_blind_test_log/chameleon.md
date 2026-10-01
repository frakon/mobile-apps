# Blind test log: chameleon ("chameleon")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `chameleon.png.txt` (final) and task folder `Temp/Batches/batch_03/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 03, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_tvf1vzsc.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | chameleon | none |
| B | chameleon | ještěrka remark |
| C | chameleon | ještěrka remark |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - clear chameleon; alternativeNames [ještěrka]; verifier cautiously proposed excludeLevel1/2 (ještěrka raised as remark by 2, but no evaluator answered it).

## Final status: **ACCEPTED**
