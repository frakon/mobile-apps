# Blind test log: taska ("taška")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `taska.png.txt` (final) and task folder `Temp/Batches/batch_14/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 14, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_34meqaks.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | taška | nákup/chleba possible |
| B | taška | bag vs contents; bag dominant |
| C | taška | nákup/bageta possible |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - alternativeNames kabelka (existing), nákupní taška. Flags unchanged (L1/L2 excluded). Optional future: empty bag.

## Final status: **ACCEPTED**
