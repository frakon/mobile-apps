# Blind test log: pilot

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_rierm01v.png`

- Trial(s) A pilot (small plane floats at shoulder; letec/kapitán possible)
- Trial(s) B pilot (kapitán/stevard, letadlo possible; plane extra object); C pilot (plane unrealistically small, floating by shoulder; letec/letadlo possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - pilot in uniform/cap with headset, 3/3 pilot; small plane by shoulder is an extra object (B,C: unrealistically small) but supports the reading. letec/kapitán one-off. No flags.

## Final status: **ACCEPTED** (round 1)
