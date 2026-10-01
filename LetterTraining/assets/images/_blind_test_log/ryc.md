# Blind test log: ryc ("rýč")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `ryc.png.txt` (final) and task folder `Temp/Batches/batch_12/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 12, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_jt0tls4j.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | lopata | footrest on one side looks detached; blade very wide |

Evaluator-stage verdict: **early stop after trial A: wrong word lopata + structure defect**

## Round 2 — blind copy `obrazek_uexmhyz5.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | rýč | blade narrow and knife-like (zahradní nůž/dláto/škrabka); hard to recognize |

Evaluator-stage verdict: **early stop after trial A: concrete structure defect (knife-like blade)**

## Round 3 — blind copy `obrazek_w34yscpz.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | lopata | blade very wide and boxy; handle attachment unclear; lopata vs rýč |

Evaluator-stage verdict: **early stop after trial A: wrong word lopata**

Earlier-round images kept in task folder: `Temp/Batches/batch_12/rejected/ryc_r1.png`, `Temp/Batches/batch_12/rejected/ryc_r2.png`, `Temp/Batches/batch_12/rejected/ryc_r3.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

No verifier (failed at evaluator stage in all 3 rounds). FAIL - rýč vs lopata not separable by picture; replacement proposed.

## Final status: **REJECTED**
