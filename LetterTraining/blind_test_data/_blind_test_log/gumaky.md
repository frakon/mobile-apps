# Blind test log: gumaky

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_wboe1sjt.png`

- Trial(s) A **holínky** (gumáky/boty possible) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_1cg5bscx.png`

- Trial(s) A **holínky** (both boots point same way) -> MISS r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_00o4xkoh.png`

- Trial(s) A **holínky** (boots mismatched, both right) -> MISS r3 -> REJECTED
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 yellow rain boots -> 'holínky'; r2 green work boots -> 'holínky'; r3 black boots -> 'holínky' (+ mismatched pair). Synonym holínky dominates; changes all levels. Replacement: none (word problem). Images in task folder Temp/Batches/batch_21/rejected/ (blind copies in batch_21/blind/).
