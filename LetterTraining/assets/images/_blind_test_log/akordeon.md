# Blind test log: akordeon ("akordeon")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `akordeon.png.txt` (final) and task folder `Temp/Batches/batch_18/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 18, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně (max 5 řádků), co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_5wpgshug.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | harmonika | front view shows keys and buttons simultaneously |

Round verdict: **early stop after trial A: wrong word (harmonika)**

## Round 2 — blind copy `obrazek_gxv3svcf.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | harmonika | could also be called harmonika |

Round verdict: **early stop after trial A: wrong word (harmonika)**

## Round 3 — blind copy `obrazek_pj7j8b0t.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | harmonika | right side has button grid instead of keyboard; straps odd |

Round verdict: **early stop after trial A: wrong word (harmonika)**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_18/rejected/akordeon_r1.png`, `Temp/Batches/batch_18/rejected/akordeon_r2.png`, `Temp/Batches/batch_18/rejected/akordeon_r3.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

No verifier run (no round reached 3/3). Rejected after 3 rounds: evaluators always name it harmonika (changes L1/L2/L3); not fixable by prompt. Proposed replacement: a new A word not yet in words.json, e.g. aktovka (school bag), alobal or angrešt.

## Final status: **REJECTED**
