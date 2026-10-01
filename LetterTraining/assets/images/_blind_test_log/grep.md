# Blind test log: grep ("grep")

Protocol: IMAGE_RULES.md 6.2 / 6.2.1 (3 fresh opus evaluators + 1 independent opus verifier, batched; early stop after a wrong word or defect; per-level ambiguity rule). Evaluators saw ONLY a neutrally named 512x512 copy. Prompts: `grep.png.txt` (final, if accepted) and `Temp/Batches/batch_20/prompts_r*.json` (all rounds). Answers are condensed, not verbatim. Batch 20, 2026-10-01.

## Round 1
- Trial A: SLOVO grapefruit -- could be confused with pomeranč; red flesh points to grapefruit
- Trial B: SLOVO grapefruit -- whole fruit orange, child may say pomeranč
- Trial C: SLOVO grapefruit -- whole fruit like pomeranč; red flesh -> grapefruit

## Verifier
PASS - 3/3 said grapefruit (same G; only L1 used). Proposed alternativeNames [grapefruit].

## Status: ACCEPTED (round 1)
