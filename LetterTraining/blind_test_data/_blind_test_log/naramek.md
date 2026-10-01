# Blind test log: naramek ("náramek")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word/defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `naramek.png.txt` (final) and task folder `Temp/Batches/batch_09/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 09, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_1iibvjqg.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | korále | náramek or korále? |

Evaluator-stage verdict: **FAIL after trial A (wrong word)**

## Round 2 — blind copy `obrazek_u6us3i4y.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | náramek | ruka? |
| B | náramek | ruka? |
| C | ruka | náramek? |

Evaluator-stage verdict: **2/3 correct, 3/3 raise ruka -> FAIL**

## Round 3 — blind copy `obrazek_u1cpeb9u.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | náramek | korálkový náhrdelník/korálky? |
| B | náramek | korálky/přívěsek/řetízek? |
| C | náramek | korále/přívěsek? |

Evaluator-stage verdict: **3/3 correct**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 3 verifier: PASS (with flags) - single bead ring with gold heart charm, no defects; náramek 3/3 but korálky/korále raised 3/3 (changes all levels) -> alternativeNames [korálky, korále].

## Final status: **ACCEPTED**
