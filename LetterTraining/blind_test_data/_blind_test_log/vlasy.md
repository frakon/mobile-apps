# Blind test log: vlasy ("vlasy")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `vlasy.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_xw0opnfl.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | vlasy | no shoulders, looks like paruka/chomáč; paruka/copánek possible |
| B | vlasy | no body, head peeks out, bell shape unreal; paruka/culík possible |
| C | vlasy | no face/body; looks like paruka/koště; paruka possible |

Round verdict: **3 trials done**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - 3/3 vlasy; bell shape with only top of head slightly unreal but naming unaffected; paruka one-off. No flags.

## Final status: **ACCEPTED**
