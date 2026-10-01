# Blind test log: beran ("beran")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `beran.png.txt` (final) and task folder `Temp/Batches/batch_01/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 01, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_yr8yajzj.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | beran | ovce vs beran |
| B | ovce | ram, child says ovce |
| C | ovce | beran or ovce |

Evaluator-stage verdict: **FAIL 1/3 (ovce changes all levels)**

## Round 2 — blind copy `obrazek_ldzzb2u4.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | beran | slightly asymmetric horns; ovce |
| B | beran | massive horns, short legs; ovce |
| C | beran | ovce |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - clearly a ram (big spiral horns); ovce raised as remark by all 3 but all answered beran; alternativeNames [ovce], no flags (strict option: exclude all levels).

## Final status: **ACCEPTED**
