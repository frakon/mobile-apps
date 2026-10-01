# Blind test log: zobak

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_9vr3adnn.png`

- Trial(s) A zobák but DEFECT: tiny head vs huge beak, looks like 2 birds -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_ss3xvej6.png`

- Trial(s) A **kos** -> MISS r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_0a339e49.png`

- Trial(s) A **ocas** (read as fish tail/plant) -> MISS r3 -> REJECTED
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 zobák but defect (tiny head vs huge beak, looks like two birds); r2 blackbird head -> 'kos'; r3 isolated open beak -> 'ocas' (read as fish tail/plant). A beak alone is not recognisable; with a head children name the bird. Replacement: none obvious. Images in task folder Temp/Batches/batch_21/rejected/ (blind copies in batch_21/blind/).
