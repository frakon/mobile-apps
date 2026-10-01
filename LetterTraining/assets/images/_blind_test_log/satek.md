# Blind test log: satek

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 6; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_17/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 17, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_51jpsc06.png`

- Trial(s) A šátek (ubrousek/kapesník possible)
- Trial(s) B šátek (ubrousek/kapesník possible); C šátek (ubrousek/kapesník/trojúhelník possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - folded triangular polka-dot scarf, 3/3 šátek; ubrousek/kapesník possible (A,B,C) would change L1/L2, but excluding them would leave no level (L3 already excluded) and target was named 3/3 -> accept. Proposed alternativeNames [šála, kapesník]; keep excludeLevel3. Later fix: scarf tied/knotted.

## Final status: **ACCEPTED** (round 1)
