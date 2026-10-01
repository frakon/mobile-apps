# Blind test log: zvonek ("zvonek")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zvonek.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_b8qtsvzj.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | zvonek | without door could be vypínač/tlačítko; low contrast white on white |
| B | zvonek | without door/name plate could be vypínač/tlačítko |
| C | zvonek | without door could be vypínač světla |

Round verdict: **3 trials done; Round 1 verifier: FAIL - all 3 raised vypínač/tlačítko (changes L1, the only level in use), low contrast; fix: door frame + sound lines.**

## Round 2 — blind copy `obrazek_zuwj2o4y.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | zvonek | sound waves + notes help; without them vypínač |
| B | zvonek | green post not clearly a door |
| C | zvonek | door frame only hinted |

Round verdict: **3 trials done**

Earlier/rejected images kept in task folder: `Temp/Batches/batch_16/rejected/zvonek_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (round 2) - 3/3 zvonek; vypínač only if waves/notes removed. alternativeNames [zvon] unchanged; flags unchanged (L2/L3 excluded).

## Final status: **ACCEPTED**
