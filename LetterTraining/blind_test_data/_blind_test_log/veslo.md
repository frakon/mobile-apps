# Blind test log: veslo ("veslo")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `veslo.png.txt` (final) and task folder `Temp/Batches/batch_18/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 18, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně (max 5 řádků), co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_j9tl9a2r.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | pádlo | T-grip, wide blade -> padlo; vařečka/lopata possible |

Round verdict: **early stop after trial A: wrong word (pádlo; T-grip, wide blade)**

## Round 2 — blind copy `obrazek_jra1m713.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | veslo | black oarlock ring may confuse; striped blade like candy cane; padlo possible |
| B | veslo | ring unclear; padlo possible |
| C | veslo | ring odd; blade small; padlo possible |

Round verdict: **3 trials done**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_18/rejected/veslo_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 2) - 3/3; pádlo raised by all 3 (changes L1/L2, L3 -lo matches). Oarlock ring and striped blade look odd but do not change the answer. Proposed alternativeNames [pádlo]; proposed flags excludeLevel1, excludeLevel2.

## Final status: **ACCEPTED**
