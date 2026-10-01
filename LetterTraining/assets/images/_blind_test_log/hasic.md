# Blind test log: hasic ("hasič")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `hasic.png.txt` (final) and task folder `Temp/Batches/batch_05/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 05, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_qaf39ba8.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | hasič | none |
| B | hasič | hose ends loose/torn |
| C | hasič | hose ends loose, not connected |

Evaluator-stage verdict: **3/3 correct, but defect**

## Round 2 — blind copy `obrazek_p1obgbv7.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | hasič | child in costume |
| B | hasič | child in costume; hadice prominent |
| C | hasič | hadice prominent; suit looks dirty |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 1 verifier: FAIL - loose torn hose end (continuity defect). Round 2 verifier: PASS - hose coiled on shoulder, no loose end; alternativeNames [požárník (synonym)]; no flags.

## Final status: **ACCEPTED**
