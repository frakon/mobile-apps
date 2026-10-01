# Blind test log: hlava ("hlava")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `hlava.png.txt` (final) and task folder `Temp/Batches/batch_05/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 05, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_jm23x94e.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kluk | front portrait; kluk/chlapec/hlava/obličej |

Evaluator-stage verdict: **FAIL after trial A (kluk)**

## Round 2 — blind copy `obrazek_qkz2kjmc.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | obvaz | bandaged head; obvaz/náplast/kluk/zranění |

Evaluator-stage verdict: **FAIL after trial A (obvaz)**

## Round 3 — blind copy `obrazek_ls1eqyid.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | hlava | side profile; vlasy/kluk/ucho |
| B | hlava | kluk/vlasy/ucho |
| C | hlava | vlasy/kluk/ucho; closed eyes -> spí? |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 3) - side-profile child's head, correct anatomy; alternativeNames [kluk, vlasy, ucho]; no flags (no evaluator answered an alternative).

## Final status: **ACCEPTED**
