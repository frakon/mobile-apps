# Blind test log: divka ("dívka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `divka.png.txt` (final) and task folder `Temp/Batches/batch_04/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 04, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ijlq3e4w.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | holčička | holka/dívka |
| B | holčička | holka/dívka |
| C | holčička | holka/dívka |

Evaluator-stage verdict: **0/3 exact, 3/3 holčička (per-level rule: holčička ends with 'ka' like dív-ka, L3 valid; L1/L2 already excluded in words.json)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - keep excludeLevel1, excludeLevel2; alternativeNames [holka, holčička].

## Final status: **ACCEPTED**
