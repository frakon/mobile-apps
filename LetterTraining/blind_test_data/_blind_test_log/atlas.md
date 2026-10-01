# Blind test log: atlas ("atlas")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `atlas.png.txt` (final) and task folder `Temp/Batches/batch_01/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 01, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_5xq3bbue.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kniha | open book with world map; kniha/atlas/mapa; odd curled spine |

Evaluator-stage verdict: **FAIL after trial A (kniha)**

## Round 2 — blind copy `obrazek_8fkgyn32.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kniha | spine sticks up between pages like a cylinder (defect); kniha vs mapa |

Evaluator-stage verdict: **FAIL after trial A (kniha + defect)**

## Round 3 — blind copy `obrazek_l69pl6gj.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | mapa | atlas with world map; kniha/mapa/atlas ambiguous |

Evaluator-stage verdict: **FAIL after trial A (mapa)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

not reached (3 rounds failed at evaluator stage). Images: Temp/Batches/batch_01/rejected/atlas_r3.png (+ blind copies).

## Final status: **REJECTED**
