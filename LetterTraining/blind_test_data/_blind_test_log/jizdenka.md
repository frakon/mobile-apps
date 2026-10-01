# Blind test log: jizdenka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_21/prompts_r<N>.json` (and r2b/r3b/r3c/r3d/r3e for separate runs). Answers condensed, not verbatim. Batch 21, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_ns577vfh.png`

- Trial(s) A **lístek** (looks like tag/visačka) -> MISS r1
- Round verdict: MISS

## Round 2 — blind copy `obrazek_vglktqlx.png`

- Trial(s) A **vláček** (card with holes like tag) -> MISS r2
- Round verdict: MISS

## Round 3 — blind copy `obrazek_nxv0kmz6.png`

- Trial(s) A jízdenka (kartička/obálka possible)
- Trial(s) B jízdenka (notch odd; vstupenka/obálka/lístek possible); C jízdenka (vstupenka/kartička/obálka possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS - train ticket with locomotive icon, 3/3 jízdenka; notch small oddity; obálka not plausible (no flap); lístek (earlier rounds) is the real risk. Proposed alternativeNames [lístek, vstupenka, kartička].

## Final status: **ACCEPTED** (round 3)
