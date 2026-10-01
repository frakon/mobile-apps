# Blind test log: tresen ("třešeň")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `tresen.png.txt` (final) and task folder `Temp/Batches/batch_14/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 14, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ubxj2mkc.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | třešně | višně possible |
| B | třešně | singular vs plural (two fruits) |
| C | třešeň | višeň possible |

Evaluator-stage verdict: **target named 3/3 (2x plural třešně)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - alternativeNames třešně; proposed excludeLevel3=true (plural changes L3 šeň->šně; L1 tř / L2 tře unchanged). Alternative: regenerate a single cherry to keep L3.

## Final status: **ACCEPTED**
