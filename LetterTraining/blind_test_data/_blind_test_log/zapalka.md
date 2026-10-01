# Blind test log: zapalka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_y11wuap1.png`

- Trial(s) A **sirka** (flame offset above head) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_o9sn8yyw.png`

- Trial(s) A **sirka** -> MISS r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_xmm56emw.png`

- Trial(s) A zápalky (plural; krabička possible)
- Trial(s) B **sirky**; C **sirky** -> MISS r3 -> REJECTED
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 burning match -> 'sirka'; r2 upright match -> 'sirka'; r3 matchbox + burning match -> A zápalky, B/C 'sirky'. Synonym sirka dominates in child speech and changes L1 (S), L2 (sir-), L3 (-ka same only). Replacement: none obvious with Z needed (Z well covered); synonym problem. Images in task folder Temp/Batches/batch_21/rejected/ (blind copies in batch_21/blind/).
