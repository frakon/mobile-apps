# Blind test log: chlebicek

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_e1lgvqhv.png`

- Trial(s) A chlebíček (chleba/jídlo possible)
- Trial(s) B chlebíček (chleba/svačina possible); C chlebíček (chleba/jídlo possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - Czech open sandwich, 3/3 chlebíček; chleba already in alternativeNames; jídlo/svačina one-off. Keep L2/L3 excluded.

## Final status: **ACCEPTED** (round 1)
