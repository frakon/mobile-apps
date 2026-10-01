# Blind test log: zinenka ("žíněnka")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `zinenka.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO polštář -- polštář/sedák/podložka/žíněnka/matrace
Result: FAIL - trial A said polštář

## Round 2
- Trial A: SLOVO žíněnka -- matrace/kotoul possible; head sinks too much
- Trial B: SLOVO žíněnka -- matrace possible; boy distracts, pose unnatural
- Trial C: SLOVO žíněnka -- matrace possible; falling child distracts (kotrmelec)
Result: FAIL - verifier FAIL: child head sinks into mat, odd pose; matrace raised 3x

## Round 3
- Trial A: SLOVO žíněnka -- girl too small (scale); matrace/podložka possible
- Trial B: SLOVO žíněnka -- girl unrealistically small; matrace possible
- Trial C: SLOVO žíněnka -- girl tiny; matrace/postel possible

## Verifier
PASS (round 3) - 3/3; girl too small (non-fatal); matrace raised 3x. Proposed alternativeNames [matrace, podložka].

## Status: ACCEPTED (round 3)
