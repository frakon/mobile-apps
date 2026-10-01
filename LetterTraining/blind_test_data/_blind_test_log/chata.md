# Blind test log: chata ("chata")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after trial A on a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `chata.png.txt` (final) and task folder `Temp/Batches/batch_03/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 03, 2026-10-01.

Evaluator question (Czech, verbatim): "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného, nelogického, nejednoznačného, nějaký text/písmena, pozadí nebo další předměty navíc. Potom na poslední řádek napiš ve tvaru "SLOVO: <slovo>" jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje — tak, jak by to pojmenovalo malé dítě."

## Round 1 — blind copy `obrazek_9u3pjdra.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | domek | log cabin; domek/chaloupka/srub |

Evaluator-stage verdict: **FAIL after trial A (domek)**

## Round 2 — blind copy `obrazek_gfy0okws.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | chatka | plank hut |
| B | chaloupka | domeček remark |
| C | domek | chatka/domek/bouda |

Evaluator-stage verdict: **FAIL (chatka changes L2 chat-ka; domek)**

## Round 3 — blind copy `obrazek_fxjvs51s.png`

| Trial | SLOVO | Remarks (condensed) |
|---|---|---|
| A | chata | A-frame hut; dům/chaloupka remark |
| B | chaloupka | domeček remark |
| C | chaloupka | chata/chalupa/domek |

Evaluator-stage verdict: **1/3 exact, 2/3 chaloupka (keeps L1 ch, L2 cha; L3 already excluded)**

## Independent verifier (opus, fresh agent; batched up to 5 images)

PASS - A-frame mountain hut; alternativeNames [chaloupka, chalupa].

## Final status: **ACCEPTED**
