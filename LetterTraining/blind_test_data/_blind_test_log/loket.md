# Blind test log: loket ("loket")

Protocol: IMAGE_RULES.md 6.2 (3 fresh opus evaluators + 1 independent verifier). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: see `loket.png.txt` (final) and task folder `Temp/ImagePilot/prompts_r*.json` (all rounds). Answers below are condensed (key remarks), not verbatim.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru \"SLOVO: <slovo>\" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Early-stop rule used in the pilot: a round was stopped after the first evaluator gave a wrong word or a concrete visual defect (remaining trials skipped to save cost).

## Round 1 — blind copy `obrazek_90mxzv3n.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | loket | glow on bend; bend close to sleeve -> could be 'rameno'; child may say 'ruka' |

Evaluator-stage verdict: **FAIL after 1 trial**

## Round 2 — blind copy `obrazek_dgwglsvo.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | ruka | finger points to forearm, adult arm; child says 'ruka' |

Evaluator-stage verdict: **FAIL (wrong word)**

## Round 3 — blind copy `obrazek_imzvrnxe.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | loket | crop only; loket or koleno?; may say ruka |
| B | loket | no hand/shoulder; may say ruka; V like letter V |
| C | loket | may say ruka/paže; loket vs koleno slightly confusing |

Evaluator-stage verdict: **3/3 named correctly; ALL 3 remark ruka/koleno ambiguity**

