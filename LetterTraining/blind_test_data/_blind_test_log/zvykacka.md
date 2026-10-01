# Blind test log: zvykacka ("žvýkačka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zvykacka.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_r4zplc09.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | žvýkačka | DEFECT: bubble grows from strip on a stem (unreal); strips like lízátka/rtěnky |

Round verdict: **early stop after trial A: concrete defect (bubble grows from strip on a stem)**

## Round 2 — blind copy `obrazek_z5f8e7em.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | žvýkačka | white box could be křída/guma |
| B | žvýkačka | pink blocks like guma/křída |
| C | žvýkačka | guma/křída; box like cigarettes |

Round verdict: **3 trials done; verifier FAIL: all 3 raised guma/křída (changes L1/L2/L3); fix: single stick + bubble, no box**

## Round 3 — blind copy `obrazek_qrfrlzx6.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | žvýkačka | stick in wrapper looks like rtěnka |
| B | žvýkačka | looks like rtěnka; bubble is the only clue |
| C | žvýkačka | rtěnka or žvýkačka; bubble floats unblown |

Round verdict: **3 trials done**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_16/rejected/zvykacka_r1.png`, `Temp/Batches/batch_16/rejected/zvykacka_r2.png`, `Temp/Batches/batch_16/rejected/zvykacka_r3.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 3 verifier: FAIL - all 3 raised rtěnka (changes L1, L2, L3; no level left). Rejected after 3 rounds (round-3 image generated under label '2b' in gen_stats_r2b.json). Proposed replacement: another Ž word, e.g. žampion; Ž already has 10 accepted words in this batch.

## Final status: **REJECTED**
