# Blind test log: chalupa ("chalupa")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `chalupa.png.txt` (final) and task folder `Temp/Batches/batch_03/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 03, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_du66rwgl.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | domek | whitewashed cottage |

Evaluator-stage verdict: **FAIL after trial A (domek)**

## Round 2 — blind copy `obrazek_6nnmj2cu.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | domek | thatched cottage, bench extra |

Evaluator-stage verdict: **FAIL after trial A (domek)**

## Round 3 — blind copy `obrazek_z6mwk7vb.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | chaloupka | log cottage, detailed |
| B | chaloupka | none |
| C | chaloupka | or dům |

Evaluator-stage verdict: **3/3 chaloupka (keeps L1 ch, L2 cha; L3 already excluded)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

Round 3: FAIL - style break, near-photorealistic rendering instead of watercolour. 3-round cap reached. Image: Temp/Batches/batch_03/rejected/chalupa_r3.png.

## Earlier final status (batch 03): REJECTED

## Batch 23 rerun (Track B) — round-3 prompt + "loose watercolour, not photorealistic"

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_23/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 23 (Track B), 2026-10-01; all 3 trials run in parallel (no early stop).

### Batch 23 round 1 — blind copy `obrazek_atafe706.png`

- Trials A **domek** (chaloupka/chata possible); B **dům** (domeček/chaloupka/chalupa possible); C **chaloupka** (dům/domek possible) -> MISS r1
- Round verdict: MISS

### Batch 23 round 2 — blind copy `obrazek_bbmem0du.png`

- Trials A **chaloupka** (big gate looks like stodola; chalupa/stodola possible); B **chaloupka** (gate like stodola); C **domek** (chaloupka/chalupa possible) -> MISS r2 (domek changes L1; 2x chaloupka = diminutive, would keep L1+L2 but the round has a 1/3 domek miss)
- Round verdict: MISS

### Batch 23 round 3 — blind copy `obrazek_nfr0436z.png`

- Trials A **dům** (domek/chaloupka possible); B **dům** (chata/chalupa possible); C **dům** (chalupa/chata possible) -> MISS r3 (3/3 dům changes L1) -> REJECTED after 3 rounds in batch 23
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after batch 23 rounds 1-3 (6 rounds total): style now watercolour, but children name it dům/domek (hypernym, changes L1 CH->D) or the diminutive chaloupka. Images: task folder Temp/Batches/batch_23/rejected/. Replacement: none obvious (CH has few words; chata also tends to dům).
