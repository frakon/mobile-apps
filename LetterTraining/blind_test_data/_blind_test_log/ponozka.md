# Blind test log: ponozka ("ponožka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `ponozka.png.txt` (final) and task folder `Temp/Batches/batch_10/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 10, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ajcnjyh3.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | ponožka | heel drawn as concentric target rings, not matching stripes (defect) |

Evaluator-stage verdict: **early stop after trial A: structure defect**

## Round 2 — blind copy `obrazek_z49qdc4e.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | ponožka | Christmas stocking look |
| B | ponožka | punčocha possible |
| C | ponožka | ponožka vs vánoční punčocha |

Evaluator-stage verdict: **3/3 correct**

Round-1 image kept in task folder `Temp/Batches/batch_10/rejected/ponozka_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 PASS - heel defect gone, 3/3 ponozka; alternativeNames puncocha (2x, Christmas-stocking look); optional excludeLevel2+3. Optional future prompt tweak: everyday sock without white cuff/heel/toe.

## Final status: **ACCEPTED**
