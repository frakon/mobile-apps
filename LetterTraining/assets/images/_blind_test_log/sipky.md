# Blind test log: sipky

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_kjq56aap.png`

- Trial(s) A **terč** (darts have arrow feathers) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_tefqwluz.png`

- Trial(s) A šipka (singular; flights star-shaped like propellers)
- Trial(s) B šipka (star-shaped flights); C šipka (flights like flowers; šíp/jehla possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS with excludeLevel3 - three darts, no extra objects; 3/3 answered singular šipka (inflection, counts): L1 š and L2 šip match, L3 ka vs ky differs. Star-shaped flights minor style defect. Proposed alternativeNames [šipka]; proposed flags [excludeLevel3].

## Final status: **ACCEPTED** (round 2)
