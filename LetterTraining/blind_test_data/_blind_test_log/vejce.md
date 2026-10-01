# Blind test log: vejce ("vejce")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `vejce.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_xxbbamxc.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | vajíčko | egg large vs cup; kalíšek possible |
| B | vajíčko | egg large vs cup; 'vajíčko v kalíšku' |
| C | vejce | egg large vs cup; kalíšek possible |

Round verdict: **3 trials done**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS (per-level rule) - egg in cup, no defects; 1/3 vejce, 2/3 vajíčko (diminutive keeps L1 V, changes L2 vej->va and L3 ce->ko). Proposed alternativeNames [vajíčko]; proposed flags excludeLevel2, excludeLevel3.

## Final status: **ACCEPTED**
