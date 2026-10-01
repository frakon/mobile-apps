# Blind test log: sroub

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_am1pyr3h.png`

- Trial(s) A šroubek (diminutive of šroub; vrut possible; same first letter Š, L2/L3 excluded)
- Trial(s) B šroubek (vrut possible; slot slightly deformed); C šroub (vrut possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - Phillips screw; answers šroubek, šroubek, šroub: diminutive keeps Š (L1 ok), L2/L3 already excluded. Proposed alternativeNames [šroubek, vrut]; keep excludeLevel2/3.

## Final status: **ACCEPTED** (round 1)
