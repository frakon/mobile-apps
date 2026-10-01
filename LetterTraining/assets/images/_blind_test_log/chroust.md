# Blind test log: chroust

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_su6dj1o4.png`

- Trial(s) A **brouk** (only 4 legs, odd tail point, beruška possible) -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_9gj1pfys.png`

- Trial(s) A chroust (brouk possible; pointed rear tip real feature)
- Trial(s) B **brouk** (identifies chroust in description); C **brouk** (probably chroust) -> FAIL r2 (2/3 hypernym brouk)
- Round verdict: MISS

## Round 3 — blind copy `obrazek_qr1fn70v.png`

- Trial(s) A **čmelák** (DEFECT: hairy bumblebee-like body mixed with chroust antennae, ~8 legs) -> FAIL r3
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 -> 'brouk' (4 legs); r2 realistic maybug -> A chroust, B+C 'brouk' (hypernym); r3 flying maybug -> 'čmelák' + anatomy defects. No replacement needed: CH has 13 other words in words.json (chobotnice, chameleon, chalupa, ...); children name the beetle by the hypernym brouk.
