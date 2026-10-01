# Blind test log: ubrousek ("ubrousek")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `ubrousek.png.txt` (final) and task folder `Temp/Batches/batch_14/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 14, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_689fo0yp.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kapesník | folded triangle napkin with blue flower border; kapesník/ubrousek/šátek |

Evaluator-stage verdict: **early stop after trial A: wrong word kapesník**

## Round 2 — blind copy `obrazek_mmtdb4zh.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | ubrousek | fan from stack center like tissue box; kapesníky/stojánek possible |
| B | ubrousek | tissue-box fan; kapesník possible |
| C | ubrousek | fan illogical; ubrousky/kapesníky possible |

Evaluator-stage verdict: **3/3 correct**

Earlier-round images kept in task folder: `Temp/Batches/batch_14/rejected/ubrousek_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 2) - alternativeNames kapesník, kapesníky, ubrousky (target named 3/3; serves L1/L3). No flags. Minor: fan of napkins slightly unreal.

## Final status: **ACCEPTED**
