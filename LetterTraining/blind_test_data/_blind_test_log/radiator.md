# Blind test log: radiator

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_9zuy2iwm.png`

- Trial(s) A radiátor (topení possible)
- Trial(s) B **topení**; C **topení** -> MISS r1 (2/3 topení changes all levels)
- Round verdict: MISS

## Round 2 — blind copy `obrazek_m9qix6qw.png`

- Trial(s) A radiátor (topení possible)
- Trial(s) B radiátor (topení possible); C radiátor (topení possible)
- Verifier FAIL: 3/3 radiátor but all 3 raised 'topení'; changes all levels.
- Round verdict: MISS

## Round 3 — blind copy `obrazek_hzmkqmqg.png`

- Trial(s) A **topení** (texture like salami) -> MISS r3 -> REJECTED
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 -> 2/3 'topení'; r2 3/3 radiátor but verifier FAIL (all 3 raised topení); r3 red oil radiator -> 'topení'. Synonym topení changes all levels. Replacement: none obvious. Images in task folder Temp/Batches/batch_21/rejected/ (blind copies in batch_21/blind/).
