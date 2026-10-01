# Blind test log: cmelak ("čmelák")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `cmelak.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_5p94va9s.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | čmelák | only 4-5 legs, too many stripes; child may say 'včela' |

Evaluator-stage verdict: **FAIL after 1 trial (legs, včela)**

## Round 2 — blind copy `obrazek_hrcuf79p.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | čmelák | 8-9 legs - unrealistic; may say včela |

Evaluator-stage verdict: **FAIL after 1 trial (8-9 legs)**

## Round 3 — blind copy `obrazek_yhyhl154.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | čmelák | ~4 legs visible (others may be hidden); may say včela |
| B | čmelák | only ~4 legs visible; čmelák or včela |
| C | čmelák | fewer legs than should be; may say včela |

Evaluator-stage verdict: **3/3 named correctly; leg-count + včela remarks**

