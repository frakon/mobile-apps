# Blind test log: archa ("archa")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `archa.png.txt` (final) and task folder `Temp/Batches/batch_18/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 18, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně (max 5 řádků), co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ilvrtyg5.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | loď | giraffes too small; lod vs archa |

Round verdict: **early stop after trial A: wrong word (loď)**

## Round 2 — blind copy `obrazek_jj50je4x.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | loď | animals too large for windows; lod/archa/zviratka |

Round verdict: **early stop after trial A: wrong word (loď)**

## Round 3 — blind copy `obrazek_amwnp0y5.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | loď | on a hill, rainbow, dove; scene busy; archa less common for children |

Round verdict: **early stop after trial A: wrong word (loď)**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_18/rejected/archa_r1.png`, `Temp/Batches/batch_18/rejected/archa_r2.png`, `Temp/Batches/batch_18/rejected/archa_r3.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

No verifier run (no round reached 3/3). Rejected after 3 rounds: evaluators always name it loď (changes L1/L2/L3); not fixable by prompt. Proposed replacement: a new A word not yet in words.json, e.g. aktovka (school bag), alobal or angrešt.

## Final status: **REJECTED**
