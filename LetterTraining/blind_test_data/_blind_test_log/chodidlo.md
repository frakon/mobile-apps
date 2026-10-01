# Blind test log: chodidlo ("chodidlo")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `chodidlo.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_z9luqjj2.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | noha | sole from below; child would say noha |

Evaluator-stage verdict: **FAIL (wrong word)**

## Round 2 — blind copy `obrazek_kbm0mhbd.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | chodidlo | arch drawn as odd pad; noha/šlapka possible |
| B | noha | noha vs chodidlo |
| C | noha | noha or chodidlo |

Evaluator-stage verdict: **FAIL 1/3**

## Round 3 — blind copy `obrazek_y629pq8f.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | nohy | two soles; nohy/nožičky/chodidla |
| B | chodidla | plural; nohy also possible |
| C | nohy | nohy/chodidla/ploska |

Evaluator-stage verdict: **FAIL 1/3 -> 3 rounds exhausted -> REPLACEMENT proposed**

