# Blind test log: duch

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_b3vz32li.png`

- Trial(s) A **strašidlo** (older child: duch) -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_zd5i62kx.png`

- Trial(s) A duch (arms/hair dissolve into curls, víla/vodník slight)
- Trial(s) B duch (edges like water/ice sprite slight); C duch (tendrils like octopus/jellyfish slight)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS (round 2) - translucent bluish ghost with face, arms, curling tail, 3/3 duch; víla/vodník/medúza one-off slight. Round 1 sheet ghost was named strašidlo (fixed). Keep L2/L3 excluded.

## Final status: **ACCEPTED** (round 2)
