# Repair result — kolem_gram ("Kluk běží kolem stromu.", grammatical distractor: boy runs TOWARD the tree)

## What was wrong (original)
- Original prompt had the boy "facing the trunk head-on" running toward the tree; combined with the original target (which read as already-past), the pair contrast "kolem" (passing) vs. "toward" was ambiguous — the user judged both pictures as "runs kind of along the tree".

## Repair (task 20260930_135545, Temp/RepairKolemPodpolstar)
- New gram composition: strict SIDE VIEW — tree on the left, boy on the right running to the LEFT straight toward the trunk, still a clear distance away, both outstretched arms reaching toward (not touching) the trunk; "running toward the tree to reach it, not passing beside it".
- Used in both blind rounds; in the passing round 2 (target = boy directly in front of the trunk) the forced choice was PASS 5/5 and all five evaluators independently described this picture as the boy approaching/running toward the tree — contrast unambiguous. Independent verifier PASS (noted only cosmetic canopy crop at top/left edge).

## Key composition learnings
1. Distinguish "toward" from "past" by DIRECTION + DISTANCE, not by facing: side view, clear gap to the object, arms reaching toward it — while the target twin shows the figure level with the object mid-pass.
2. Keep both pair pictures in the same style/side-view so only the critical relation differs.
3. Blind forced-choice between the two pictures is the acceptance test (5/5 required).

Final installed prompt: see assets/images/kolem_gram.png.txt. Full trial log: endgame task folder Temp/RepairKolemPodpolstar/_kolem_podpolstar_repair_blindtrials.md.

## Archive provenance note
The exact pre-repair PNG in assets/images was overwritten by the repair. The kolem_gram.png here is the blind-trial copy of that same originally deployed image (batch4/blind/i06), and kolem_gram_original_raw.webp is the original raw Muse Spark output; the .png.txt is reconstructed from the batch prompt script (marked as such inside).
