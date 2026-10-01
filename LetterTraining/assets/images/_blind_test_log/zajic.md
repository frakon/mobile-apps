# Blind test log: zajic ("zajíc")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zajic.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_9jml83rh.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | zajíc | králík possible |
| B | zajíc | králík possible |
| C | zajíc | králík possible |

Round verdict: **3 trials done**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - 3/3 zajíc; králík raised 3x but never answered, hare features clear. No flags.

## Final status: **ACCEPTED**
