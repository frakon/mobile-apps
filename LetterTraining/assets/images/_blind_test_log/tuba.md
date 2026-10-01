# Blind test log: tuba

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_t3plnzcb.png`

- Trial(s) A tuba (tubing crossings illogical; eufonium/trubka possible)
- Trial(s) B tuba (tangled illogical tubing); C tuba (tangled tubing, mouthpiece like 2nd bell) -> FAIL r1 (structure defect noted by A,B,C)
- Round verdict: MISS

## Round 2 — blind copy `obrazek_tcvtylve.png`

- Trial(s) A tuba (wavy flower-like bell, tubing not fully logical; trumpeta/trubka possible)
- Trial(s) B tuba (bell too big, wavy; tubing illogical); C tuba (wavy bell, simplified tubing)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS (minor defect) - 3/3 tuba; bell too wavy, tubing simplified but no longer tangled; trubka/trumpeta raised by 3 (L1 T stays; L2/L3 change). Proposed alternativeNames [trubka, trumpeta]; proposed flags [excludeLevel2, excludeLevel3].

## Final status: **ACCEPTED** (round 2)
