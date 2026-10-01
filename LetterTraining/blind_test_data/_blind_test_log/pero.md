# Blind test log: pero ("pero")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `pero.png.txt` (final) and task folder `Temp/Batches/batch_10/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 10, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_h1twr2rp.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | propiska | could be called pero |
| B | propiska | child could say pero; clip slightly detached |
| C | propiska | no push button, pen with cap |

Evaluator-stage verdict: **3/3 named propiska (existing alternativeName; same first letter P; only L1 in use)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - clear ballpoint pen; 3/3 propiska (existing alternativeName, same first letter P, per user Follow-up 2 fine for L1); keep excludeLevel2+3.

## Final status: **ACCEPTED**
