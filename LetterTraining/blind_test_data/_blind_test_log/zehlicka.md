# Blind test log: zehlicka ("žehlička")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zehlicka.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_dqsyfz7a.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | žehlička | stands on heel and soleplate at once (ambiguous pose); short cord ends in air |
| B | žehlička | stands on silver flat pad that looks like a second soleplate (illogical); cord ends in air |
| C | žehlička | stands on soleplate not heel; cord ends in air, no plug |

Round verdict: **3 trials done**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - 3/3; stands on flat base, cord ends in air = minor stylization. No flags.

## Final status: **ACCEPTED**
