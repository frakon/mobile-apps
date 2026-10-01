# Blind test log: loupeznik

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_q5ui9bbg.png`

- Trial(s) A **zloděj** (lupič possible) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_adj86hfi.png`

- Trial(s) A **trpaslík** -> MISS r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_toft4a7f.png`

- Trial(s) A loupežník (zbojník/tulák/kovboj possible)
- Trial(s) B loupežník (kovboj/tulák possible); C loupežník (tulák/zálesák possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - 3/3 loupežník; club and sack point to robber; tulák raised by 3 but implausible instead of loupežník; kovboj from hat (2). Proposed alternativeNames [zbojník, tulák].

## Final status: **ACCEPTED** (round 3)
