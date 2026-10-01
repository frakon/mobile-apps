# Blind test log: klavir ("klavír")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `klavir.png.txt` (final) and task folder `Temp/Batches/batch_07/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 07, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_hv2mrnez.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | piano | upright piano; black key groups irregular |

Evaluator-stage verdict: **FAIL after trial A (piano)**

## Round 2 — blind copy `obrazek_ho4ri136.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | klavír | piano? |
| B | klavír | piano? |
| C | klavír | piano?; keys simplified |

Evaluator-stage verdict: **3/3 correct, but 3/3 raise piano**

## Round 3 — blind copy `obrazek_550aqa5i.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | klavír | křídlo technical |
| B | klavír | křídlo technical |
| C | klavír | křídlo technical; no strings inside |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 verifier: FAIL - all 3 raised piano (changes all levels). Round 3 verifier: PASS - grand piano, no piano remarks; alternativeNames [křídlo, piano (tolerance)]; no flags.

## Final status: **ACCEPTED**
