# Blind test log: obvaz

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_23/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 23 (Track B), 2026-10-01; all 3 trials run in parallel (no early stop).

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Earlier rounds 1-3 (batch 21, all failed): r1 verifier FAIL (toaletní papír raised 3/3); r2 verifier FAIL (ruka raised 3/3, open hand dominant); r3 trial A obvaz but defect (metal carabiner clip). This batch = round 4 (plain tucked-in end, no clip).

## Round 4 (batch 23 round 1) — blind copy `obrazek_0dwmaodi.png`

- Trials A obvaz (forearm visible only at sides, could read as ruka/sádra); B obvaz (fáč colloquial possible; could look like roll/sleeve); C obvaz (could be role látky/mumie without arm)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - white gauze wrapped around a forearm, skin only at the edges; no clip, no dominant hand, no toilet-paper look; tucked plain end. 3/3 obvaz; ruka/sadra/fac/mumie one-off each. alternativeNames []; flags [].

## Final status: **ACCEPTED** (round 4)
