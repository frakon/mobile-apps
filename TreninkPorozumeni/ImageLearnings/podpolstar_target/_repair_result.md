# Repair result — podpolstar_target ("Medvídek schoval kostku pod polštář.", target picture)

## What was wrong (original)
- User: the cube reads as INSIDE the pillow (inside the pillowcase), not UNDER it. The original prompt ("lifts one corner ... block lies under the lifted pillow, one corner peeking out") let the model render the block at the pillow's open end, so it looked tucked inside the pillowcase. This inside-vs-under ambiguity was already noted as "slight" by 2/5 describers in the original generation round but the item had passed.

## Repair (task 20260930_135545, Temp/RepairKolemPodpolstar)
- New composition (round-1 repair candidate = final installed): teddy bear holds up only ONE CORNER of the pillow, rest of the pillow lying on the bed, and in the open TRIANGULAR GAP under the lifted corner the cube sits ON THE BED SHEET, "directly beneath the raised pillow corner, half hidden under the pillow, clearly under the pillow and not on top of it".
- Blind test: PASS 5/5 — all five fresh describers independently said the block sits on the mattress under the lifted pillow edge, occluded but NOT embedded/inside; no anatomy defects. Independent verifier PASS.
- Residual (accepted) imperfections: pillow reads thin/deflated (one trial: could be an empty pillowcase) and the bear grips the near edge rather than a high-lifted corner — the under-relation is nonetheless clear.

## Key composition learnings
1. "Under a soft container-like object" must anchor the hidden object to the SURFACE BELOW ("sitting on the bed sheet"), inside an explicit visible GAP ("open triangular gap under the lifted pillow corner") — otherwise the model puts it at the opening and it reads as inside the pillowcase.
2. Add the explicit negation: "clearly under the pillow and not on top of it" / not inside.
3. A "slight ambiguity" note from even a minority of blind describers predicts a real user complaint — treat it as a fail signal, not a nitpick.

Final installed prompt: see assets/images/podpolstar_target.png.txt. Full trial log: endgame task folder Temp/RepairKolemPodpolstar/_kolem_podpolstar_repair_blindtrials.md.

## Archive provenance note
The exact pre-repair PNG in assets/images was overwritten by the repair. The podpolstar_target.png here is the blind-trial copy of that same originally deployed image (batch1/blind/i2/p1), and podpolstar_target_original_raw.webp is the original raw Muse Spark output; the .png.txt is reconstructed from the batch generation script run_all.ps1 (marked as such inside).
