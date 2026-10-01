# Blind test log: branka ("branka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `branka.png.txt` (final) and task folder `Temp/Batches/batch_18/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 18, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně (max 5 řádků), co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_cfi2y227.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | branka | child might say mic |
| B | branka | right rear post of net slightly unclear; mic possible |
| C | branka | mic prominent; net slightly sagging |

Round verdict: **3 trials done**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - 3/3; míč raised 3x (changes L2/L3; L1 kept via brána). Proposed alternativeNames [míč, brána]; proposed flags excludeLevel2, excludeLevel3.

## Final status: **ACCEPTED**
