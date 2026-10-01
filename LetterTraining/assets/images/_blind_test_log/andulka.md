# Blind test log: andulka ("andulka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `andulka.png.txt` (final) and task folder `Temp/Batches/batch_18/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 18, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně (max 5 řádků), co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_fihdt5pa.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | andulka | tail passes through bars; papousek/klec possible |
| B | papoušek | spherical cage without base, perch through bars; papousek/ptacek/klec |
| C | andulka | cage like wire globe without base; perch and tail through bars |

Round verdict: **3 trials done; FAIL: trial B said papoušek (L1 changes); cage defects (spherical cage without base, perch and tail through bars)**

## Round 2 — blind copy `obrazek_ge8dwkw8.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | papoušek | cage large; papousek (or andulka) |

Round verdict: **early stop after trial A: wrong word (papoušek); round-2 image generated under label '3' in gen_stats_r3.json**

## Round 3 — blind copy `obrazek_tdc1621t.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | papoušek | toy mirror + bell could also be named; budgie dominant |

Round verdict: **early stop after trial A: wrong word (papoušek); generated under label '3b'**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_18/rejected/andulka_r1.png`, `Temp/Batches/batch_18/rejected/andulka_r2.png`, `Temp/Batches/batch_18/rejected/andulka_r3.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

No verifier run (no round reached 3/3). Rejected after 3 rounds: evaluators consistently name the bird papoušek (hypernym; changes L1/L2/L3). Proposed replacement: a new A word not yet in words.json, e.g. aktovka (school bag), alobal or angrešt.

## Final status: **REJECTED**
