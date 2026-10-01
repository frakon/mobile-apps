# Blind test log: trakar ("trakař")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `trakar.png.txt` (final) and task folder `Temp/Batches/batch_14/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 14, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_h9n8kper.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kolečko | modern green metal wheelbarrow; trakař possible but child says kolečko |

Evaluator-stage verdict: **early stop after trial A: wrong word kolečko**

## Round 2 — blind copy `obrazek_doj8j51p.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kolečko | old wooden barrow with spoked wheel; kolečko/trakař/vozík |

Evaluator-stage verdict: **early stop after trial A: wrong word kolečko**

## Round 3 — blind copy `obrazek_cwxkv77v.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kolečko | old wooden barrow; four vertical posts, tiny wheel, confusing legs (structure defect); vozík/kára |

Evaluator-stage verdict: **early stop after trial A: wrong word kolečko + structure defect**

Earlier-round images kept in task folder: `Temp/Batches/batch_14/rejected/trakar_r1.png`, `Temp/Batches/batch_14/rejected/trakar_r2.png`, `Temp/Batches/batch_14/rejected/trakar_r3.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

No verifier (failed at evaluator stage in all 3 rounds). FAIL - trakař is named 'kolečko' by children regardless of style; replacement proposed.

## Final status: **REJECTED**
