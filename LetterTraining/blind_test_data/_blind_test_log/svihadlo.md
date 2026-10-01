# Blind test log: svihadlo

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ved8tnyl.png`

- Trial(s) A švihadlo (rope attachment odd)
- Trial(s) B švihadlo (rope attaches top/bottom inconsistently); C švihadlo (rope enters handles from side, nunčaky possible)
- Round verdict: passed to verifier
- Round 1 independent verifier (opus): FAIL - rope enters left handle from bottom and right handle from top (flagged by A,B,C), short rope reads as nunčaky. Prompt fix: identical handles, rope from same end of each, long wide U loop.

## Round 2 — blind copy `obrazek_b4njslvt.png`

- Trial(s) A švihadlo (plain handles); B švihadlo; C švihadlo (U shape)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS (round 2) - rope enters both handles the same way, wide U loop (r1 nunchaku defect fixed); 3/3 švihadlo. No flags.

## Final status: **ACCEPTED** (round 2)
