# Blind test log: jachta ("jachta")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `jachta.png.txt` (final) and task folder `Temp/Batches/batch_06/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 06, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_uirvy5s1.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | loďka | white sailboat, unambiguous boat |

Evaluator-stage verdict: **FAIL after trial A (loďka)**

## Round 2 — blind copy `obrazek_bs9o9xif.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | plachetnice | racing yacht; front sail attached illogically, hull odd |

Evaluator-stage verdict: **FAIL after trial A (plachetnice + structure defect)**

## Round 3 — blind copy `obrazek_uzk4vnj6.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | loď | luxury motor yacht; child says loď rather than jachta |

Evaluator-stage verdict: **FAIL after trial A (loď)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

No verifier (failed at evaluator stage in all 3 rounds). Children name any yacht loď/loďka/plachetnice.

## Final status: **REJECTED**

Images: task folder `Temp/Batches/batch_06/rejected/jachta_r1..r3.png`. Proposed replacement J word (not in words.json, untested): jaguár (risk: leopard/gepard) or jitrnice (Czech-specific; risk: klobása).
