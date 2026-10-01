# Blind test log: faraon

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_qdlq3euz.png`

- Trial(s) A faraon (král/Egypťan possible; modern bearded face)
- Trial(s) B faraon (král/Egypťan possible); C faraon (modern bearded face, flail fringe floats; král/Egypťan possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - pharaoh with nemes, uraeus, crook and flail; 3/3 faraon; modern bearded face and floating flail fringe minor. Proposed alternativeNames [král, Egypťan]; excludeLevel3 already set.

## Final status: **ACCEPTED** (round 1)
