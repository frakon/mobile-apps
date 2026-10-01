# Blind test log: lepidlo

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_23/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 23 (Track B), 2026-10-01; all 3 trials run in parallel (no early stop).

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

Regeneration of a previously ACCEPTED image (flaw: glue stick read as balzám na rty by 3/3). Previous image + its log kept in task folder `Temp/Batches/batch_23/replaced_old/`.

## Round 1 (batch 23 round 1) — blind copy `obrazek_h1is4bby.png`

- Trials A lepidlo (could be krém/zubní pasta, drop+nozzle point to glue); B lepidlo (krém/mast possible); C lepidlo (krém/zubní pasta possible, drop points to glue)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - white tube with orange pointed nozzle, glue drop at tip, cap off; balzam flaw gone. 3/3 lepidlo; krém/mast/zubní pasta raised by 3 as possible tube contents but target named 3/3. alternativeNames []; flags [] (optional future fix: glue puddle / glued paper pieces).

## Final status: **ACCEPTED** (round 1)
