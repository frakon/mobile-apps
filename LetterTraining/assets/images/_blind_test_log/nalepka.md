# Blind test log: nalepka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_lf0aiath.png`

- Trial(s) A **hvězda** (samolepka possible) -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_ck58p81s.png`

- Trial(s) A **samolepka** (child may name single motifs) -> MISS
- Trial(s) B **samolepka** (4 separate motifs); C **samolepky** -> FAIL r2 (3/3 samolepka)
- Round verdict: MISS

## Round 3 — blind copy `obrazek_jldq8a53.png`

- Trial(s) A **samolepka** (white disc next to sticker confusing) -> FAIL r3 -> REJECTED
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 gold star sticker -> 'hvězda'; r2 sticker sheet -> 3/3 'samolepka'; r3 smiley sticker peeled from backing -> 'samolepka' (+ confusing white disc). Target never named; samolepka changes L1 (S) and L2 (sa-), only L3 -ka would match, so per-level rule cannot keep it (target not named). Images in task folder Temp/Batches/batch_19/rejected/. Replacement: none strictly needed (N has 17 words in words.json); synonym problem (samolepka dominates in child speech).
