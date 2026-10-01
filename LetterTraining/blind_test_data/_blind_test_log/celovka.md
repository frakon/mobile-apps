# Blind test log: celovka

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched up to 5; per-level ambiguity rule; early stop after trial A on a miss). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: task folder `Temp/Batches/batch_19/prompts_r<N>.json`. Answers condensed, not verbatim. Batch 19, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_8zvam395.png`

- Trial(s) A čelovka (strap looks like two materials; baterka possible)
- Trial(s) B čelovka (beam points sideways, strap confusing; baterka possible); C čelovka (strap not one loop, lower part different material; baterka possible)
- Round verdict: passed to verifier
- Round 1 independent verifier (opus): FAIL - strap not one continuous loop (top flat band, bottom different ruched material; flagged by A,B,C), beam points sideways. Prompt fix: single continuous uniform headband, lamp facing forward.

## Round 2 — blind copy `obrazek_09kr5a66.png`

- Trial(s) A čelovka (obojek/náramek possible without head; baterka); B čelovka (baterka/lampička possible); C čelovka (baterka/lampička/světlo possible)
- Round verdict: passed to verifier

## Independent verifier (opus, fresh agent; batched)

PASS (round 2) - continuous headband loop with buckle, lamp facing forward (r1 defects fixed); 3/3 čelovka; baterka raised by all 3. Proposed alternativeNames [baterka].

## Final status: **ACCEPTED** (round 2)
