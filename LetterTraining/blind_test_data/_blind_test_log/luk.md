# Blind test log: luk ("luk")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `luk.png.txt` (final) and task folder `Temp/Batches/batch_08/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 08, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_eyv4jlnu.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | luk | arrow next to bow |
| B | luk | two objects luk+šíp |
| C | luk | šíp might lead answer |

Evaluator-stage verdict: **3/3 correct, verifier FAIL (soft): only L1 left and 'šíp' changes it; fix: bow alone, no arrow**

## Round 2 — blind copy `obrazek_h6ip5xgd.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | luk | no arrow; could be klacek |
| B | luk | could be smyčec |
| C | luk | could be prut/hůl; string makes it clear |

Evaluator-stage verdict: **3/3 correct**

Round-1 image kept in task folder `Temp/Batches/batch_08/rejected/luk_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 PASS - recurve bow with string and grip, no arrow; klacek/prut/smyčec unlikely. No alternativeNames.

## Final status: **ACCEPTED**
