# Blind test log: ptak ("pták")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `ptak.png.txt` (final) and task folder `Temp/Batches/batch_10/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 10, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_5gbp78rr.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | vrabec | house sparrow; ptáček possible |

Evaluator-stage verdict: **early stop after trial A: species name vrabec changes L1**

## Round 2 — blind copy `obrazek_95n4bp33.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | pták | stylized, species unknown |
| B | ptáček | species unclear (sýkorka/vrabec?) |
| C | ptáček | simplified, clear |

Evaluator-stage verdict: **target/diminutive with same letter P; only L1 in use**

Round-1 image kept in task folder `Temp/Batches/batch_10/rejected/ptak_r1.png`.

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 2 PASS - stylized generic bird (vrabec problem fixed); 1x ptak, 2x ptacek (diminutive, same letter P); only L1 in use. alternativeNames ptacek; keep excludeLevel2+3.

## Final status: **ACCEPTED**
