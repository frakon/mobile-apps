# Blind test log: nahrdelnik

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_t0f6chg0.png`

- Trial(s) A náhrdelník (top pearls not joined; korále/perly possible)
- Trial(s) B náhrdelník (open at top though clasp closed at bottom; korále/perly possible); C **korále** (same open-top remark) -> MISS
- Round verdict: MISS

## Round 2 — blind copy `obrazek_jcld3wn1.png`

- Trial(s) A náhrdelník (heart shape -> srdce possible; clasp barely visible)
- Trial(s) B náhrdelník (heart shape -> srdce possible; clasp visible at top); C náhrdelník (srdce possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS (round 2) - pearl necklace in heart shape with pendant and visible clasp; 3/3 náhrdelník; srdce noted by all 3 (layout). Proposed alternativeNames [srdce] optional. (r1 open-top pearl string -> C 'korále' miss.)

## Final status: **ACCEPTED** (round 2)
