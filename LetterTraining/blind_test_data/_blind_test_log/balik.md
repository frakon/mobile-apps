# Blind test log: balik ("balík")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `balik.png.txt` (final) and task folder `Temp/Batches/batch_01/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 01, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_m3ducoo3.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | krabice | cardboard box with string and bow; balík/dárek |

Evaluator-stage verdict: **FAIL after trial A (krabice)**

## Round 2 — blind copy `obrazek_mwrhuqr4.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | balík | balík vs dárek |
| B | balík | messy folds right; dárek/krabice |
| C | balík | small bow at knot; balíček/dárek |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - parcel in brown paper with string, knot not a real bow; balíček (L3 only) optional excludeLevel3; dárek/krabice raised once each.

## Final status: **ACCEPTED**
