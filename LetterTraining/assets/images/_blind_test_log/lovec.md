# Blind test log: lovec

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_vco2azh6.png`

- Trial(s) A **myslivec** (lovec/voják possible) -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_0tdhs7hr.png`

- Trial(s) A **pračlověk** (pravěký člověk/lovec/jeskynní muž possible) -> FAIL r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_1bivudk8.png`

- Trial(s) A lovec (figure child-like, big head; voják/střelec possible)
- Trial(s) B **voják** (voják/myslivec/lovec possible; safari hunter or colonial soldier); C lovec (voják/myslivec possible) -> FAIL r3 (1/3 miss voják; voják raised by A,B,C)
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 green-clad hunter with rifle -> 'myslivec'; r2 stone-age spear hunter -> 'pračlověk'; r3 safari hunter -> B 'voják' (voják raised by A,B,C). Images in task folder Temp/Batches/batch_17/rejected/. No replacement needed: L has 26 other words in words.json (myslivec dominates in Czech child speech for a hunter); if one is wanted, a concrete object such as lopata.
