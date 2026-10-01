# Blind test log: velryba ("velryba")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `velryba.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_4ipm0z45.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | velryba | blue-grey smiling whale, spout like clouds; 'could resemble dolphin but spout says whale' |
| B | velryba | stylized smile, spout from back as decorative clouds; unambiguous |
| C | velryba | spout looks almost like cloud/flower, otherwise clear |

Evaluator-stage verdict: **3/3 correct**

