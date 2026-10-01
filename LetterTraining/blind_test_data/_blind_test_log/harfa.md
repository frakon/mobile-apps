# Blind test log: harfa ("harfa")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `harfa.png.txt` (final) and task folder `Temp/Batches/batch_05/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 05, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_b6h460en.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | harfa | lyra? |
| B | harfa | strings parallel |
| C | harfa | strings pass through sound box to base |

Evaluator-stage verdict: **3/3 correct, but defect**

## Round 2 — blind copy `obrazek_x7py9p1t.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | harfa | string attachment loose in drawing |
| B | harfa | strings not visibly joined to soundboard |
| C | harfa | no tuning pegs; lyra? |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 1 verifier: FAIL - strings run to base through sound box (structure). Round 2 verifier: PASS - strings end on sound box; alternativeNames [lyra]; no flags.

## Final status: **ACCEPTED**
