# Blind test log: trychtyr ("trychtýř")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `trychtyr.png.txt` (final) and task folder `Temp/Batches/batch_14/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 14, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_d47hp2pf.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | trychtýř | child may not know name |
| B | nálevka | trychtýř and nálevka used equally |
| C | trychtýř | child might say nálevka |

Evaluator-stage verdict: **2/3 target, 1x synonym nálevka**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (per-level rule) - alternativeNames nálevka (raised by 2, changes L1 and L2); proposed excludeLevel1=true, excludeLevel2=true; L3 (týř) kept. Fallback: drop the word if L3-only is too weak.

## Final status: **ACCEPTED**
