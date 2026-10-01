# Blind test log: rohozka ("rohožka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `rohozka.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO rohožka -- door prominent, child could say dvere
- Trial B: SLOVO rohožka -- kobereček/rohož possible; door ~1/3 of image
- Trial C: SLOVO rohožka -- door draws attention (dvere), mat is main and largest
Result: FAIL - verifier FAIL: door ~1/3 of image, dvere raised by 2

## Round 2
- Trial A: SLOVO podnos -- standalone mat read as tray/cutting board/cork pad
Result: FAIL - trial A said podnos (mat alone)

## Round 3
- Trial A: SLOVO rohožka -- boots and door draw attention; koberec possible; bristles long like grass
- Trial B: SLOVO rohožka -- holínky/dveře may distract; koberec possible
- Trial C: SLOVO rohožka -- boots distract; mat slightly overhangs tiles; koberec possible

## Verifier
PASS (round 3) - 3/3; koberec raised 3x (changes all levels) but target held 3/3. Proposed alternativeNames [koberec, rohož].

## Status: ACCEPTED (round 3)
