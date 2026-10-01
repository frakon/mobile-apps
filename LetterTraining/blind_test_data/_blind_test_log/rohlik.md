# Blind test log: rohlik ("rohlík")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `rohlik.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_ia2sti58.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | rohlík | looks rather like 'veka/bageta' (size, slashes) |

Evaluator-stage verdict: **FAIL after 1 trial (veka)**

## Round 2 — blind copy `obrazek_1txk1ayd.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | rohlík | croissant shape/layers, odd snail spiral |

Evaluator-stage verdict: **FAIL after 1 trial (croissant)**

## Round 3 — blind copy `obrazek_lvnyqxpz.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | rohlík | at most confusable with croissant; salt+caraway clear |
| B | rohlík | spiral seams; could be confused with croissant |
| C | rohlík | fairly straight and thick - resembles loupák/croissant/slaná tyčka; real rohlík narrower |

Evaluator-stage verdict: **3/3 named correctly; croissant/loupák remarks**

