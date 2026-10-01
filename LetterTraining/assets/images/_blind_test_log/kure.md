# Blind test log: kure ("kuře")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `kure.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_em1sz2kg.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kuřátko | fluffy chick; most natural child word is 'kuřátko' |

Evaluator-stage verdict: **FAIL after 1 trial (diminutive = miss per IMAGE_RULES 6.2)**

## Round 2 — blind copy `obrazek_ne18r2o7.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kuře | half-grown chick with first white feathers; kuře vs kuřátko |
| B | kuře | could be confused with gosling/duckling, beak says chick |
| C | kuře | white feathers a bit prominent |

Evaluator-stage verdict: **3/3 correct**

