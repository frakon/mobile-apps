# Blind test log: chnapka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_45d4x1nn.png`

- Trial(s) A chňapka (rukavice possible)
- Trial(s) B chňapka (rukavice possible); C chňapka (rukavice possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - checked oven mitt with loop; 3/3 chňapka; rukavice raised by all 3, target still named 3/3. Proposed alternativeNames [rukavice].

## Final status: **ACCEPTED** (round 1)
