# Blind test log: nadrazi

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_47uxyhjh.png`

- Trial(s) A nádraží (vlak equally prominent)
- Trial(s) B nádraží (vlak equally prominent); C nádraží (vláček noticed first)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - station building with clock + platform + train; 3/3 nádraží; train equally prominent (all 3). Proposed alternativeNames [vlak, vláček]; optional excludeLevel1 to be safe.

## Final status: **ACCEPTED** (round 1)
