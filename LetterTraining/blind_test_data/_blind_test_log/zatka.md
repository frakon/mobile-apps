# Blind test log: zatka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_itvs7a7x.png`

- Trial(s) A **špunt** (bread/mushroom possible) -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_ufws6zlw.png`

- Trial(s) A zátka (láhev/flaška possible, bottle takes more area)
- Trial(s) B **špunt** (láhev possible); C zátka (láhev possible) -> MISS
- Round verdict: MISS

## Round 3 — blind copy `obrazek_66o30vm6.png`

- Trial(s) A zátka (cork far too long/large, reaches into liquid; chleba/houba/med possible); B zátka (scale unrealistic, cork 2-3x jar); C **špunt** (same scale defect) -> FAIL r3 -> REJECTED
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 lone cork -> 'špunt'; r2 cork in bottle neck -> zátka, špunt, zátka; r3 cork in honey jar -> zátka, zátka, špunt + scale defect (cork 2-3x jar, all 3). špunt changes L1/L2/L3. Images in task folder Temp/Batches/batch_19/rejected/. Replacement: none strictly needed (Z has 20 words in words.json); children say špunt.
