# Blind test log: mec ("meč")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `mec.png.txt` (final) and task folder `Temp/Batches/batch_09/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 09, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_5zg82dzl.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | meč | dýka/krátký meč? |
| B | meč | dýka? |
| C | meč | dýka?; short blade |

Evaluator-stage verdict: **3/3 correct, but 3/3 raise dýka**

## Round 2 — blind copy `obrazek_2wjgwz2s.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | meč | šavle/dýka? but clearly sword |
| B | meč | dýka? but clearly long |
| C | meč | none |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 1 verifier: FAIL - short blade, all 3 raised dýka which changes L1 (the only level served). Round 2 verifier: PASS - long sword, dýka/šavle only hedges; L1 M holds; no new flags.

## Final status: **ACCEPTED**
