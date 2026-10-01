# Blind test log: les ("les")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `les.png.txt` (final) and task folder `Temp/Batches/batch_08/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 08, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_zl0kyc1f.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | les | small isolated cluster, stromy |
| B | les | floating island, stromy/strom |
| C | les | bouquet-like, stromy/strom |

Evaluator-stage verdict: **3/3 correct, verifier FAIL: child would say stromy instead (changes L1, no level left)**

## Round 2 — blind copy `obrazek_ntqfdelx.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | les | no single tree stands out; strom/smrk |
| B | les | stromy/strom possible |
| C | les | stromy/strom possible |

Evaluator-stage verdict: **3/3 correct**

Round-1 image kept in task folder `Temp/Batches/batch_08/rejected/les_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 PASS - wide dense forest strip with forest floor reads as forest; alternativeNames stromy (record only), L1 served.

## Final status: **ACCEPTED**
