# Blind test log: choditko

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_c9pzzy8o.png`

- Trial(s) A chodítko but DEFECT: frame self-crossing spiral, seat not attached -> FAIL r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_9lx35oph.png`

- Trial(s) A chodítko but DEFECT: ring vertical like a wheel, seat holes look like a ghost face -> FAIL r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_91jfx9hp.png`

- Trial(s) A chodítko (seat fabric unclear)
- Trial(s) B chodítko (seat like a rag; autíčko/sedátko possible); C chodítko (seat shapeless; ohrádka possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - 3/3 chodítko; seat fabric loosely drawn but ring, wheels and toy tray make it clear; ohrádka/autíčko/sedátko one-offs. No flags.

## Final status: **ACCEPTED** (round 3)
