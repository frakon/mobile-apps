# Blind test log: nos ("nos")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `nos.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_5yww3oqi.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | nos | glow circle on nose; could also be named dítě/holčička/kluk |

Evaluator-stage verdict: **FAIL after 1 trial (glow + alternative names)**

## Round 2 — blind copy `obrazek_tc0muhi2.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | nos | could say prst/obličej, gesture points to nose |
| B | nos | nose exaggerated, caricature; could read ukazovat/prst/obličej |
| C | nos | nose unnaturally big; hand small; could say obličej/pusa/prst |

Evaluator-stage verdict: **3/3 named correctly; caricature-nose + alternative-name remarks**

