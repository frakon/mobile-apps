# TreninkPorozumeni — content-quality learnings (texts + images)

Extract of the user's improvement requests from task `20260930_135545_TreninkPorozumeniFields123` (endgame repo, `AGENTS/Tasks/.../_plan_description.md`). Written for a future agent creating NEW examples, explanation texts, or images — treat every rule below as a checkable acceptance criterion.

Related files (do NOT duplicate their content here):
- `ImageLearnings/<pictureFileBaseName>/` — per repaired picture: the ORIGINAL (pre-repair) image + its prompt `.txt`, `_user_comment.md` (verbatim user complaint), `_repair_result.md` (what prompt/composition change fixed it). This folder convention is MANDATORY for every future user-commented picture (User follow-up request 11).
- `_ImageGenerationLearnings.md` — generation-pipeline learnings (Muse Spark deep-prompt template, blind-test protocol, WebP decode, the abandoned SDXL-Turbo composite pipeline).
- `_TreninkPorozumeni_SPEC.md` — app behavior spec; `_TreninkPorozumeni_Fields123_PROMPTS.md` — all user prompts verbatim.

## Text learnings (explanation sentences and test sentences)

### 1. "Why wrong" explanations: short, child-pattern, never meta (User follow-up request 8)
User (verbatim):
> Ad some versions of the corrected texts (the texts that are played when wrong thing is pressed), e.g.: "Tady kreslí kluk holčičku. Věta říká, že holčička kreslí kluka." Such formulation is wrong: it is long and it is too adult. Make it smaller and more child friendly: "Tady kreslí kluk holčičku, ne holčička kluka." Repair all "red" sentences that contain "Věta říká", or which are too long and can be made shorter and child friendlier.

Rules:
- Pattern: one short contrast sentence — „Tady X, ne Y." (e.g. „Tady honí sestra bratra, ne bratr sestru." / „Tady kreslí kluk holčičku, ne holčička kluka.").
- NEVER use meta-language about the sentence itself: no „Věta říká…", no explanations of grammar.
- Length 5–20 words, single sentence preferred; understandable by a small child; no adult/teacher tone.
- Checklist for every new explanation: contains no „Věta říká"; could a 4-year-old repeat it?

### 2. Test sentences must be correct, natural Czech — check verb valence (User follow-up request 12)
User (verbatim):
> The sentence "Kluka stříká holčička" is not correct in czech: Change it to "Na kluka stříká holčička."

Rule: before accepting any sentence, verify the verb's real Czech valence/government (stříkat NA koho, not stříkat koho). A sentence that is grammatical only "on paper" is a defect.

### 3. Reversible-sentence items must be case-DISambiguable (content-spec learning)
„Autobus tlačí auto." was rejected during spec work because nominative = accusative for BOTH nouns — the child cannot tell subject from object by form at all, so the item tests nothing. Rule: in field 5.1, at least one noun must morphologically mark the case (kluka/holčička), or replace the item.

## Image learnings (per fault-class)

For every class: the user quote is in the matching `ImageLearnings/<name>/_user_comment.md`; the exact repair prompt in `_repair_result.md` and the installed `assets/images/*.png.txt`.

### A. "kolem / past" = same level as the object, mid-pass (request 5; `kolem_target`, `kolem_gram`)
Rejected: boy read as "already ran along" on one picture and "going towards" on the other — ambiguous pair; plus a leg rendered inside the tree.
> The "kolem stromu" shall be so that the boy is on the same level as the tree and he is just passing the tree (he is not before passing, neither after passing).
Fix/rules:
- Target: figure exactly level with the object, whole figure IN FRONT of it, prompt states the negation explicitly: "neither approaching it nor already past it".
- Distractor "toward": encode by DIRECTION + a clear DISTANCE gap + arms reaching toward the object — not by facing alone.
- NEVER let a limb be occluded by another object ("leg partly hidden behind the trunk") — the model renders it as missing/embedded. Whole figure in front, or clear gap.
- Verify relation pairs by blind FORCED-CHOICE between the two pictures (5/5 required), not by describing each alone.

### B. "pod / under" a soft object ≠ inside it (request 6; `podpolstar_target`)
Rejected: cube looked INSIDE the pillowcase, not under the pillow.
Fix/rules:
- Anchor the hidden object to the SURFACE BELOW ("cube sitting on the bed sheet") inside an explicit visible GAP ("open triangular gap under the lifted pillow corner").
- Add the negation: "clearly under the pillow and not on top of it / not inside".
- A "slight ambiguity" note from even a minority of blind describers predicts a real user complaint — treat it as FAIL, not a nitpick.

### C. "tlačí / pushes" = from behind, with visible effort (request 9; `tlaci_a/_b/_lexa/_lexb`)
Rejected: pusher upright with front paws ON TOP of the pushee's back — reads as standing on/holding.
> The "tlačí" is more like push and that is usually not from top, but from behind and with somewhat visible effort.
Fix/rules (the 5/5 prompt): pusher directly BEHIND, hind legs bent and firmly planted at ground level, whole body leaning forward at a diagonal "like someone pushing a heavy cart", front paws pressed FLAT against the pushee's REAR/hindquarters (never "on the back"), pushee moving forward calmly, "all paws at the same ground level" (prevents airborne poses — the round-1 "hind legs stretched far back" version looked airborne and failed 1/5 for `tlaci_a`/`tlaci_b`/`tlaci_lexb`; `tlaci_lexa` passed 5/5 already with the round-1 prompt and was kept).

### D. "vede / leads": leader and led move in the SAME direction (request 10; `vede_a`)
Rejected: thief faced/walked opposite to the policeman.
Fix/rules: state the shared direction redundantly — "both people walking toward the left in the same direction", repeat it for the second figure, add "one behind the other in a single file line".

### E. Role-reversal pairs differ by WHO ACTS — never by emotion (request 11; `tahne_target`, `tahne_gram`)
Rejected: on both pictures the girl pulled; the pair differed only by anger vs. sadness.
> Remove the anger or sadness and make one picture truly so that a girl pulls boy and on another so that boy pulls girl (make them clearly distinguishable).
Fix/rules:
- No anger, no crying: always "calm friendly faces, mouths closed, a light playful mood".
- The composition that reads as pulling 5/5: puller IN FRONT striding away, leaning far forward, arms reaching BACK gripping the pullee's hands; pullee BEHIND leaning backward, heels dragging/braced. (Face-to-face mutual grip failed — read as tug-of-war.)
- Make the two pictures mirrored/parallel so the ONLY difference is who is active.

### F. Objects must be structurally complete (request 13; `lavicka_target`)
Rejected: bench with no legs, levitating.
Fix/rules: name the object's structural parts explicitly in the prompt ("four sturdy wooden legs clearly visible under the seat holding the bench up") and add a completeness sentence ("The bench is a complete piece of furniture: seat, backrest, and four legs.").

### G. Ropes/cords/tools must be connected and intact (request 14; `svihadlo_gram`)
Rejected (recurring defect): skipping rope leaving one handle and ending loose in mid-air.
Fix/rules: add an explicit end-to-end continuity clause — "one single continuous unbroken smooth taut curve from the handle in the left hand down under the feet and up to the handle in the right hand, with no breaks, no gaps, no loose ends, no extra loops, no spirals, no tangles". "Swinging under his feet" alone is NOT sufficient (failed twice).

### Cross-cutting image checklist (apply to every new image)
1. Spatial relation stated mechanically AND with an explicit negation of the wrong reading (A, B).
2. Anatomy: no limb occluded by objects; all figures/limbs complete; all feet/paws at the same ground level (A, C).
3. Objects: structural parts named; cords/ropes given a continuity clause (F, G).
4. Pairs: identical style/side, only the critical element differs; roles encoded by pose/position, never emotion (E).
5. Directionality of joint movement stated for both figures (D).
6. Acceptance: blind test per `_ImageGenerationLearnings.md` protocol; minority-ambiguity remarks = FAIL (B).
7. Any future user complaint about a picture → archive it under `ImageLearnings/<pictureFileBaseName>/` (original png + .txt + `_user_comment.md` + `_repair_result.md`) and extend this file.
