# Blind test log: televize

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_23/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 23 (Track B), 2026-10-01; all 3 trials run in parallel (no early stop).

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Regeneration of a previously ACCEPTED image (flaw: large nameable fish on screen + monitor-like stand). Previous image + its log kept in task folder `Temp/Batches/batch_23/replaced_old/`.

## Round 1 (batch 23 round 1) — blind copy `obrazek_cnbbmqrw.png`

- Trials A televize (abstract screen like duha/obloha, slightly confusing); B televize (abstract screen only odd thing); C televize (abstract rainbow screen could look like obloha/abstract picture)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - retro wooden TV with knobs, power light, short-legged TV cabinet; screen abstract rainbow streaks, nothing nameable (fish + monitor-stand flaw fixed). 3/3 televize; abstract screen odd (duha/obloha) raised by 3 but not an object name. alternativeNames [televizor] (existing); flags [] (keep excludeLevel3).

## Final status: **ACCEPTED** (round 1)
