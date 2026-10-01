# Blind test log: celo ("čelo")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `celo.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_1xbxkpvm.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | čelo | glow on forehead -> could mean 'myšlenka/nápad'; could be 'holčička' |

Evaluator-stage verdict: **FAIL after 1 trial (glow = idea, ambiguous)**

## Round 2 — blind copy `obrazek_ors43lf5.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | čelo | gesture could mean 'přemýšlet'/'hlava'; child may say 'obličej/holčička' |
| B | čelo | child could say holčička/hlava/obličej; headband splits attention |
| C | čelo | could also mean obličej/holčička/hlava |

Evaluator-stage verdict: **3/3 named correctly; ALL 3 remark alternative names (obličej/holčička/hlava)**

