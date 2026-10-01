# Blind test log: maslo ("máslo")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `maslo.png.txt` (final) and task folder `Temp/Batches/batch_09/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 09, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ojgvv79h.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | máslo | sýr? triangular cut corner |
| B | máslo | sýr?; triangle face confusing |
| C | máslo | sýr?; triangle cut |

Evaluator-stage verdict: **3/3 correct, but 3/3 raise sýr**

## Round 2 — blind copy `obrazek_oflvd9p5.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | máslo | sýr/tuk/margarín? |
| B | máslo | sýr/dort? |
| C | máslo | sýr/mýdlo? |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 1 verifier: FAIL - triangle cut face looks like a cheese wedge, sýr changes all levels. Round 2 verifier: PASS (with optional flag) - triangle gone, foil + curls point to butter; sýr raised 3/3 as hedge -> optional alternativeNames [sýr].

## Final status: **ACCEPTED**
