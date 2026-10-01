# Blind test log: farma ("farma")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `farma.png.txt` (final) and task folder `Temp/Batches/batch_04/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 04, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_gtj6lqt4.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | stodola | barn + silo dominate |

Evaluator-stage verdict: **FAIL after trial A (stodola)**

## Round 2 — blind copy `obrazek_kwhq19rx.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | statek | farmyard with farmhouse |

Evaluator-stage verdict: **FAIL after trial A (statek)**

## Round 3 — blind copy `obrazek_vlff0tp1.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | farma | stodola/krávy/traktor |
| B | farma | stodola/krávy/traktor; floating island |
| C | farma | statek/stodola/kravičky |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (borderline: whole scene) - alternativeNames [statek, stodola]; verifier proposed excludeLevel1.

## Final status: **ACCEPTED**
