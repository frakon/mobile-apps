# Blind test log: chlebnik

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_l5j1h017.png`

- Trial(s) A **chlebovka** (roll-top lid unrealistic) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_csiqqf22.png`

- Trial(s) A chlebník (looks like treasure chest; truhla/krabice possible)
- Trial(s) B **truhla**; C chlebník (truhla/krabice possible) -> MISS r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_6hglpvv1.png`

- Trial(s) A chlebník (chleba/krabice possible; lid edge overhangs slightly)
- Trial(s) B chlebník (chleba possible); C chlebník (chleba possible; lid perspective slightly off)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - wooden roll-top bread box with bread, 3/3 chlebník; lid overhang minor; chleba raised by 3 as fallback (would change only L3). No flags; optional excludeLevel3.

## Final status: **ACCEPTED** (round 3)
