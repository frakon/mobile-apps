# Blind test log: vazka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_9syf6o2s.png`

- Trial(s) A vážka (legs wrong count/placement, spider-like; still clearly vážka)
- Trial(s) B vážka (legs grow oddly, front pair like antennae; cartoon eyes); C vážka (legs stick out sideways; cartoon eyes)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS (anatomy note) - dragonfly, 4 wings, long abdomen, 3/3 vážka; legs splayed spider-like, front pair near head like antennae (A,B,C), cartoon eyes. Children still say vážka. Later fix: 6 short legs tucked under thorax.

## Final status: **ACCEPTED** (round 1)
