# Blind test log: chobot ("chobot")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `chobot.png.txt` (final) and task folder `Temp/Batches/batch_03/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 03, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_pcwq8x5b.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | slon | elephant head with trunk |

Evaluator-stage verdict: **FAIL after trial A (slon)**

## Round 2 — blind copy `obrazek_6n2g4ldk.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | chobot | only trunk, cut at top edge |
| B | chobot | same remark |
| C | chobot | could be tail/snake |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - single trunk, watercolour; ocas/had each raised once.

## Final status: **ACCEPTED**
