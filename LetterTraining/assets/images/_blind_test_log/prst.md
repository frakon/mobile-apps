# Blind test log: prst

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_23/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 23 (Track B), 2026-10-01; all 3 trials run in parallel (no early stop).

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Regeneration of a previously ACCEPTED image (flaw: cut-off fingertips of a second hand). Previous image + its log kept in task folder `Temp/Batches/batch_23/replaced_old/`.

## Round 1 (batch 23 round 1) — blind copy `obrazek_l3m96ozr.png`

- Trials A prst (ruka / gesture jedna/pozor possible); B prst (thumb a bit short; ruka/pozor possible); C prst (ruka/gesture possible; raised finger dominates)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - one hand with raised index finger, no second hand or cut-off fingertips (previous flaw fixed); wrist ends softly. 3/3 prst; ruka raised by all 3 as a possible name (and gesture jedna/pozor), target still named 3/3. Proposed alternativeNames [ruka] (would change L1 P->R if counted); flags [] (keep excludeLevel2+3).

## Final status: **ACCEPTED** (round 1)
