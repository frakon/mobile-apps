# Blind test log: planeta ("planeta")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `planeta.png.txt` (final) and task folder `Temp/Batches/batch_18/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 18, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně (max 5 řádků), co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_v4qs8hf2.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | planeta | Saturn vs planeta |
| B | planeta | front ring edge at bottom faint; Saturn possible |
| C | planeta | Saturn vs planeta |

Round verdict: **3 trials done**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - 3/3; clean Saturn. Proposed alternativeNames [Saturn]; no flags.

## Final status: **ACCEPTED**
