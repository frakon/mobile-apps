# Blind test log: cyklista ("cyklista")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `cyklista.png.txt` (final) and task folder `Temp/Batches/batch_18/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 18, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně (max 5 řádků), co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_vdoqi48w.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | kolo | bicycle large and dominant, named by the bike |

Round verdict: **early stop after trial A: wrong word (kolo; bicycle dominant)**

## Round 2 — blind copy `obrazek_e9res6a5.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | cyklista | kolo possible |
| B | cyklista | kolo possible; minor pedal/derailleur imprecision |
| C | cyklista | kolo possible; drivetrain simplified; person main motif |

Round verdict: **3 trials done**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_18/rejected/cyklista_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 2) - 3/3; kolo raised by all 3 but the rider dominates. Proposed alternativeNames [kolo]; no flags.

## Final status: **ACCEPTED**
