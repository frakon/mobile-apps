# Blind test log: otaznik ("otazník")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `otaznik.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_isnmvhtb.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | otazník | clean; 'it is a symbol, a small child may not know it' |
| B | otazník | punctuation mark, not an object; little suited for letter training |
| C | otazník | it is a character/text, not a picture of a thing; may read as 'nevím' |

Evaluator-stage verdict: **3/3 named correctly; all 3 flag that the motif is a written sign**

