# Blind test log: zizala ("žížala")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zizala.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_bdp07a7l.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | žížala | light clitellum band drawn twice (unreal); ends look alike |
| B | žížala | two light bands (anatomically wrong); červík/červ possible |
| C | žížala | two light bands, second illogical; ends alike |

Round verdict: **3 trials done; Round 1 verifier: FAIL - two clitellum bands (anatomy defect, all 3 noticed); fix: exactly one band, distinct head/tail.**

## Round 2 — blind copy `obrazek_m0lcszr1.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | žížala | S shape like a wave; clear |
| B | žížala | one clitellum OK; had/červ possible |
| C | žížala | front end slightly unclear |

Round verdict: **3 trials done**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_16/rejected/zizala_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 2) - 3/3, defect fixed. No flags.

## Final status: **ACCEPTED**
