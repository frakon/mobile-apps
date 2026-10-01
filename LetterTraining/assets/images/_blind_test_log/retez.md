# Blind test log: retez ("řetěz")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `retez.png.txt` (final) and task folder `Temp/Batches/batch_12/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 12, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_nyzo2uvg.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | řetěz | chain curve like S or 2 |
| B | řetěz | shape like digit 2 / Z/S |
| C | řetěz | shape like S or 2; řetízek possible |

Evaluator-stage verdict: **3/3 correct, verifier FAIL: chain forms the digit 2 (symbol shape in a letter app); fix: straight/sagging chain, no letter/digit shape**

## Round 2 — blind copy `obrazek_ggbd04ah.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | řetěz | V-shaped hang; náhrdelník at most |
| B | řetěz | V shape; náhrdelník possible |
| C | řetěz | ~11 links V shape; free ends; slight letter-V / necklace resemblance, chain well recognizable |

Evaluator-stage verdict: **3/3 correct**

Earlier-round images kept in task folder: `Temp/Batches/batch_12/rejected/retez_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 PASS - plain steel chain, 3/3 řetěz; V-shaped hang (not U as prompted) is not a symbol-shape defect like round 1 '2' (only 1 evaluator mentioned slight letter-V resemblance); all links interlocked, none detached; náhrdelník remarks hedged, not plausible. No flags. Stricter optional fix: wider shallow U-sag, no single link at bottom.

## Final status: **ACCEPTED**
