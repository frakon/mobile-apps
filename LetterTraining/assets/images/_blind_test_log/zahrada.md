# Blind test log: zahrada ("zahrada")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zahrada.png.txt` (final) and task folder `Temp/Batches/batch_16/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 16, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_4r7quusk.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | zahrada | round island unreal; plot/záhon possible |
| B | zahrada | plot/jabloň possible; floating cut-out disc |
| C | zahrada | zahrádka/plot possible; many items distract |

Round verdict: **3 trials done**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - 3/3; floating disc slightly odd; plot/záhon/jabloň scattered; proposed alternativeNames [zahrádka] (optional excludeLevel3, raised by 1).

## Final status: **ACCEPTED**
