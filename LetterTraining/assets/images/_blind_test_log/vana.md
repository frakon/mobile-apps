# Blind test log: vana

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompt: `vana.png.txt`; all prompts: task folder `Temp/Batches/batch_15/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 15, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_k2fnv82k.png`

- Trial(s) A vana (clawfoot old-style)
- Trial(s) B vana (empty), C vana (back leg hidden)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched 5 images)

PASS - clawfoot bathtub, 3/3 vana. No flags.

## Final status: **ACCEPTED** (round 1)
