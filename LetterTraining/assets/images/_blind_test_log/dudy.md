# Blind test log: dudy

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_b17gvr4p.png`

- Trial(s) A dudy (koza possible)
- Trial(s) B dudy (koza/trubka possible); C dudy (koza/trubka/flétna possible)
- Verifier FAIL: 3/3 dudy but all 3 raised 'koza' (prominent carved goat head); changes all levels. Fix: plain bag, no animal head.
- Round verdict: MISS

## Round 2 — blind copy `obrazek_70djjzr0.png`

- Trial(s) A dudy but DEFECT: pipes not visibly connected to the bag -> FAIL r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_s6q192wh.png`

- Trial(s) A dudy (simplified, one drone; bag like cloth)
- Trial(s) B dudy (one drone only; pytel/píšťala possible); C dudy (one drone; pytel/měch possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - bag with seam, blowpipe, chanter, one drone, all pipes attached, no goat head; 3/3 dudy; simplified; pytel/píšťala/měch one-offs. No flags.

## Final status: **ACCEPTED** (round 3)
