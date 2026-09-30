# Repair result — kolem_target ("Kluk běží kolem stromu.", target picture)

## What was wrong (original)
- Original prompt placed the boy "passing close beside the trunk ... one of his legs partly hidden behind the trunk". The trunk occlusion produced the anatomy defect the user reported: one leg reads as inside the tree, the other leg missing.
- Semantically the original read as already-past ("just ran along") rather than exactly level with the tree, making the target/gram pair ambiguous.

## Repair (task 20260930_135545, Temp/RepairKolemPodpolstar)
- Round 1 candidate: boy exactly beside the trunk with a clear white gap, no occlusion, both legs fully visible. Blind forced-choice against the new gram picture: FAIL 4/5 (one evaluator picked the gram picture; two describers still read the boy as already past the tree).
- Round 2 candidate (FINAL, installed): boy passing directly IN FRONT of the trunk, trunk directly behind him, whole boy in front of the trunk, both arms and both legs completely visible, "neither approaching it nor already past it" stated in the prompt. Blind forced-choice: PASS 5/5, no anatomy defects reported; independent verifier PASS.

## Key composition learnings
1. Never let a limb be occluded by another object ("leg partly hidden behind the trunk") — the model renders it as missing/embedded. Put the whole figure IN FRONT of the occluder, or leave a clear gap.
2. For "kolem/past" state the negative constraints explicitly in the prompt: "neither approaching it nor already past it", "the boy exactly at the same spot as the tree".
3. Verify relation pairs by blind FORCED-CHOICE between both pictures (5 fresh evaluators, counterbalanced 1/2 positions), not by describing each picture alone.

Final installed prompt: see assets/images/kolem_target.png.txt. Full trial log: endgame task folder Temp/RepairKolemPodpolstar/_kolem_podpolstar_repair_blindtrials.md.

## Archive provenance note
The exact pre-repair PNG in assets/images was overwritten by the repair. The kolem_target.png here is the blind-trial copy of that same originally deployed image (batch4/blind/i05), and kolem_target_original_raw.webp is the original raw Muse Spark output; the .png.txt is reconstructed from the batch prompt script (marked as such inside).
