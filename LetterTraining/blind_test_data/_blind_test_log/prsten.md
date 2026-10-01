# Blind test log: prsten ("prsten")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `prsten.png.txt` (final) and task folder `Temp/Batches/batch_11/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 11, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_858yib3q.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | prstýnek | prstýnek or prsten |
| B | prsten | engagement ring, clear |
| C | prstýnek | engagement ring |

Evaluator-stage verdict: **1/3 target + 2/3 diminutive prstýnek (same L1 P, same L2 prs-; L3 differs)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (accept with flags) - 2/3 prstýnek; L1 and L2 kept; alternativeNames [prstýnek]; proposed excludeLevel3.

## Final status: **ACCEPTED**
