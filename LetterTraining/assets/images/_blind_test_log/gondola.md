# Blind test log: gondola

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_4map7btl.png`

- Trial(s) A **loďka** (prow ornament looks like dragon head) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_nfasybce.png`

- Trial(s) A gondola (loď/loďka possible)
- Trial(s) B gondola (loďka possible); C gondola (loď/loďka possible)
- Verifier FAIL (borderline): 3/3 gondola but all 3 raised 'loď/loďka'; changes all levels.
- Round verdict: MISS

## Round 3 — blind copy `obrazek_f1w2kdaj.png`

- Trial(s) A **loďka** (gondolier tiny, armchair huge) -> MISS r3 -> REJECTED
- Round verdict: MISS

## Final status: **REJECTED**

REJECTED after 3 rounds: r1 -> 'loďka' (dragon-like prow); r2 3/3 gondola but verifier FAIL (all 3 raised loď/loďka, changes all levels); r3 -> 'loďka'. Replacement: none needed (G is a reduced-count letter). Images in task folder Temp/Batches/batch_21/rejected/ (blind copies in batch_21/blind/).
