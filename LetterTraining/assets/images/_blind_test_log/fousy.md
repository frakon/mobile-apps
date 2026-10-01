# Blind test log: fousy ("fousy")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `fousy.png.txt` (final) and task folder `Temp/Batches/batch_04/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 04, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_tzr9gslq.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | pán | man's head with beard; vousy/děda |

Evaluator-stage verdict: **FAIL after trial A (pán)**

## Round 2 — blind copy `obrazek_63tmwmgl.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | vousy | lower face only; nose continues in odd strip (defect) |

Evaluator-stage verdict: **FAIL after trial A (vousy + defect)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

not reached. Stopped after 2 rounds: the picture cannot separate colloquial 'fousy' from standard 'vousy' (different first letter); no prompt fix. Images: Temp/Batches/batch_04/rejected/fousy_r1.png, fousy_r2.png.

## Final status: **REJECTED**
