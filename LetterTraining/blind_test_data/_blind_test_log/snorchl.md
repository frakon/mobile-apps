# Blind test log: snorchl

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ebpn5o0y.png`

- Trial(s) A **maska** (two objects, mask dominates) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_94uzpunu.png`

- Trial(s) A šnorchl (clip unclear; trubka/hadice possible)
- Trial(s) B šnorchl (clip unclear; trubka/hůlka possible); C šnorchl (trubka/hadice possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - J-shaped snorkel with mouthpiece, 3/3 šnorchl; clip unclear (minor); trubka/hadice remarks only. Proposed alternativeNames [trubka]; excludeLevel3 stays.

## Final status: **ACCEPTED** (round 2)
