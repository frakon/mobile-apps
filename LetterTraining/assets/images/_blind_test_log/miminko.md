# Blind test log: miminko ("miminko")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `miminko.png.txt` (final) and task folder `Temp/Batches/batch_09/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 09, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ufkkf9fb.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | miminko | dítě? |
| B | miminko | dítě? |
| C | miminko | mimino/dítě? |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - existing alternativeNames [mimino] + excludeLevel3; dítě not a plausible substitute; no new flags.

## Final status: **ACCEPTED**
