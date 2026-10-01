# Blind test log: nota ("nota")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `nota.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_g0r1y4ch.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | nota | staff has 6 lines instead of 5; splashes |

Evaluator-stage verdict: **FAIL after 1 trial (6-line staff)**

## Round 2 — blind copy `obrazek_fpe3q0j6.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | nota | clean; could be called 'hudba' |
| B | nota | clean; small child may not know it, could read as J/d |
| C | nota | clean; may say 'hudba' |

Evaluator-stage verdict: **3/3 correct**

