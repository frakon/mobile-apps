# Blind test log: injekce ("injekce")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `injekce.png.txt` (final) and task folder `Temp/Batches/batch_06/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 06, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ebxvjv36.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | stříkačka | plain syringe; child might say injekce |

Evaluator-stage verdict: **FAIL after trial A (stříkačka)**

## Round 2 — blind copy `obrazek_q7f6q16u.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | injekce | gloved hand + syringe into arm; očkování; blue drop slightly odd |
| B | injekce | scene may be named injekce/očkování vs object stříkačka |
| C | injekce | blue drop looks like leaking liquid; očkování/injekce |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - 3/3 injekce; blue drop a minor oddity, not a structure defect. Alternatives očkování (3x remark), stříkačka (2x remark) recorded; verifier noted strict option excludeLevel1-3 (both differ on all levels) vs. no flags because target named 3/3.

## Final status: **ACCEPTED**
