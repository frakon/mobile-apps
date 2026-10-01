# LetterTraining — Image Rules and Blind-Testing Protocol

Purpose: collect ALL image rules from the TreninkPorozumeni app and the `image-generation` skill (quoted verbatim, with source references), then state how they apply to LetterTraining single-object word pictures (Word starts training, Levels 1-3, 500+ words). Written for user review (user prompt: "explore the rules there and print them into .md file in this app (for me to review)").

Sources (`endgame` = `C:\GIT\endgame2`, `mobile-apps` = `C:\GIT\mobile-apps2`):
- S1 `endgame:.claude/skills/image-generation/SKILL.md`
- S2 `endgame:.claude/skills/image-generation/children-pictures.md`
- S3 `endgame:.claude/skills/image-generation/picture-blind-test.md`
- S4 `endgame:.claude/skills/image-generation/fallback-image-gateway.md`
- S5 `mobile-apps:TreninkPorozumeni/_ImageGenerationLearnings.md`
- S6 `mobile-apps:TreninkPorozumeni/_TreninkPorozumeni_LEARNINGS.md` (image sections only; text/audio sections omitted as not image-relevant)

Text marked **Adaptation (proposal for user review)** is NOT from the sources — it is the agent's proposal.

## 1. Generation method

### S1 lines 8-14 — primary method
> ## Primary method: Muse Spark (Meta Model API)
> 
> `POST https://api.meta.ai/v1/images/generations`, auth `Authorization: Bearer <key>`, `Content-Type: application/json`.
> 
> - **API key**: `EndgameSolution/_personal_MuseSpark_ApiKey_NeverReadByAgent.txt` — NEVER read it into agent context; pipe it straight into a shell variable/header (the included script does this).
> - **Request body**: `{"model":"muse-image-1.0","prompt":"<text>","size":"1024x1024"}` (arguments: `model`, `prompt`, `size`).
> - **Response**: HTTP 200, JSON `{created, data, output_format, background, usage}`; `data[0].b64_json` = base64 image bytes. Despite the PNG-style fields, the API was observed to return 1600x1600 WebP bytes — decode the base64, then convert/downscale via Pillow to the required PNG size.

### S1 lines 32-34 — parallel generation
> ### Parallel generation
> 
> Multiple images may be generated in parallel through the Muse Spark API. WHY: it is an external provider, not limited by our infrastructure. If the API throttles/rate-limits: slow down and call less parallelly, and report to the user how many calls triggered the rate limits.

### S1 lines 36-38 — provenance file
> ## Provenance .txt file for every generated image
> 
> For every generated image `<image>.<extension>`, also write `<image>.<extension>.txt` in the same folder with how the image was created: 1. by what service with exact parameters, 2. the verbatim prompt used for the generation. WHY: to be able to A) reuse a good method from the past, B) compare which used method is better — with only images stored that would not be possible.

### S1 lines 40-48 — children pictures, blind test, fallback
> ## Children pictures
> 
> When generating pictures for children or children apps → load [children-pictures.md](children-pictures.md).
> 
> For deep verification that generated pictures show what is intended → load [picture-blind-test.md](picture-blind-test.md).
> 
> ## Fallback method
> 
> Load [fallback-image-gateway.md](fallback-image-gateway.md) only if the Muse Spark method does not work, or if the user wishes it.

### S5 lines 76-77 — WebP finding
> ## WebP finding
> The API returns **1600x1600 WebP** in `data[0].b64_json` even though the request asks for `"size":"1024x1024"` and the response says PNG-ish fields — always decode with Pillow and re-encode: `Image.open(bytes).convert("RGB").resize((512,512), Image.LANCZOS).save(x, "PNG")`.

### S4 lines 5-9, 24, 34-36 — fallback order, one at a time, provenance
> ## Order of methods
> 
> 1. **Default: `zimage`** (Z-Image Turbo), 768x768, 8 steps.
> 2. If it fails or is unsuitable: **`qwen`** (Qwen-Image-2.1, turbo mode = community distilled LoRA), 6 steps. Best text rendering; Qwen Research License — non-commercial.
> 3. Last resort / fast previews only: **`sdxl`** (SDXL-Turbo int8 OpenVINO), 512x512, 1 step (~3 s).
>
> - Generate 1 image at a time. WHY: it is our infrastructure and it does not scale.
>
> ## Provenance
> 
> The provenance `.txt` of SKILL.md applies: record `ImageGateway` + the `model` value + all parameters (size, steps, seed) + the verbatim prompt.

## 2. Children-picture style rules (S2)

### S2 lines 3-11 — scope, style, primary invariant
> Applies to any scene: any number of subjects/objects/actions, not just simple two-person sentences.
> 
> > Contributor note: sections below documenting past experiences (observed weaknesses, pitfalls, what worked) MUST stay in past tense — they describe what happened with a specific model/implementation, not universal truths. Keep documenting new experiences the same way.
> 
> ## Style and the primary invariant
> 
> - Style: children's book watercolor illustration.
> - **Primary invariant: pure empty/white background and surroundings — ONLY the described subjects/things present in the picture.** No ground, no shadow, no scenery, no text, nothing else. Keep it clean and simple.
> - Always end the prompt with: "floating in pure white empty space, no ground, no shadow, no scenery, no text, nothing else in the picture."

### S2 lines 13-29 — Muse Spark deep prompt, key ingredients, weaknesses
> ## Primary method: Muse Spark direct deep prompt
> 
> Generate the whole scene with ONE deep single prompt via the Muse Spark method in [SKILL.md](SKILL.md). Muse Spark obeys agency verbs and role reversal (which the fallback model never did), including anti-stereotype directions (female rescuer, patient examining doctor, pupil praising teacher).
> 
> Deep-prompt template (proven; generalize to any number of subjects):
> 
> ```
> Children's book watercolor illustration, side view: <actor with distinguishing look> <mechanical action: who stands/moves where, what touches what>, <receiver with distinguishing look> <receiver's passive reaction>. <one sentence naming who is the active role and who the passive role>. <N> clearly separate whole <people/animals> with correct realistic anatomy, [bodies not touching except <the single contact point>,] floating in pure white empty space, no ground, no shadow, no scenery, no text, nothing else in the picture.
> ```
> 
> Key ingredients that carried the intended meaning:
> - **Mechanical spatial phrasing**: who stands/moves where (behind/in front/above), what touches what (paws pressed on rear back, leaping directly over, standing behind the seated one).
> - **Explicit role sentence**: "X is the active <role>, Y is the passive <role>."
> - **Role props**: an object encoding the role (magnifying glass = examiner, camera held to the face = photographer, gold star + thumbs-up = praiser, rope held by the leader).
> - **Viewpoint** (e.g., side view) that makes the spatial relations obvious.
> 
> Known weaknesses observed: occasional transient HTTP 400 — retry the identical call a few times; small seat props (stool) may appear despite "no scenery"; a figure at the image edge may fade/crop.

### S2 lines 31-42 — fallback per-partes compositing
> ## Fallback: per-partes single-figure compositing
> 
> Use ONLY when Muse Spark attempts fail due to API error, invalid API key, or depleted funds. Otherwise always prefer Muse Spark. (For the fallback image services themselves, load [fallback-image-gateway.md](fallback-image-gateway.md).)
> 
> Direct multi-subject prompts were unusable on the fallback model: agency verbs ignored (stereotypical role assignment won regardless of wording), same-category animals fused into hybrids, scenery appeared despite positive "no scenery" phrasing, and negative prompts had no effect (guidance scale 0 — phrase every constraint positively).
> 
> Recipe:
> 1. Generate each figure SEPARATELY as a single-subject image: "watercolor clipart of <one figure in a pure pose>, floating in pure white empty space, no ground, no shadow, nothing else in the picture." Short prompts gave the lightest backgrounds; long multi-clause prompts added scenery. Describe PURE POSE only — mentioning the other party's purpose ("to help someone up") spawned a second person.
> 2. Whiten/crop each figure with Pillow. Aggressive flood-fill destroyed pale skin/clothes; targeted desaturated-gray removal + largest-connected-component island filter was safer.
> 3. COMPOSE the figures on a white canvas with a script. Roles/relations become deterministic layout: who is in front, who leans, who is enlarged/looming, who holds the prop (props may be drawn programmatically). For meaning-reversed pairs, build mirrored parallel composites so the only difference is the role assignment.
> 
> Pitfall wordings that derailed the fallback model: "sticker/die-cut/page" (rendered a physical card on a desk), "show jumping" (added rider + fence), teacher/school words (classrooms and crowds).

## 3. TreninkPorozumeni generation learnings (S5)

### S5 lines 3-31 — v2 SDXL-Turbo (abandoned pipeline; failures still informative)
> Model: SDXL-Turbo int8 (rupeshs/sdxl-turbo-openvino-int8), OpenVINO CPU, `http://10.67.0.12:7861/generate`.
> Params used: 512x512, steps 2-6, varied seeds. **Guidance scale is fixed at 0 → negative prompts have NO effect** — every constraint must be positively phrased.
> 
> ## Headline learning: direct two-subject prompts are unusable on this model
> Across all 11 items, ~250+ direct two-actor candidates produced essentially ZERO realism-screen survivors:
> - Verbs of agency (chases, pushes, combs, examines, photographs, leads, rescues, praises) are ignored; the model picks the stereotypical role assignment (mother combs child, doctor examines patient, male rescues female) regardless of wording, spatial phrasing, size cues, or subject order.
> - Two same-category animals fuse into hybrids (bear+lion, cow-spotted horses) in nearly every image.
> - Scenery (rooms, landscapes, streets) appears despite "no scenery"-style positive phrasing.
> 
> **The only reliable recipe (used for most accepted pairs): generate each figure SEPARATELY as a single-subject image, whiten/crop with Pillow, and COMPOSE the two figures on a 512x512 white canvas with a script.** Role reversal then becomes a deterministic layout operation (who is in front / who leans / who holds the prop), and blind tests pass.
> 
> ## What worked
> - (a) No background: single-subject prompts + "watercolor clipart ... floating in pure white empty space, no ground, no shadow, nothing else in the picture"; even then most raw outputs needed Pillow flood-fill/whitening post-processing to reach plain white. Short prompts gave the lightest backgrounds; long multi-clause prompts always added scenery.
> - (b) Non-mutant subjects: one subject per generation. When two animals must appear (before the composite pivot), "two separate animals, standing apart" helped little — separation via compositing was the real fix.
> - (c) Unambiguous who-does-what: spatial/postural composition in the composite (attacker enlarged and looming over small victim — skrabe; leader in front holding a drawn rope — vede; jumper mid-air centered over stander — preskakuje) plus concrete PROPS encoding the role (magnifying glass for the examiner — vysetruje; gold star given by the praiser — chvali; camera held to the face — fotografuje).
> - zachranuje repair specifics: phrase parts as PURE POSE ("one single princess leaning forward reaching out one hand, floating in pure white empty space, nothing else in the picture") — mentioning "to help someone up" spawns a second person (10/40 parts wasted); build A and B as mirrored parallel composites so the only difference is who rescues. Background cleanup: flood-fill tolerance >75 destroys pale skin/dress; targeted desaturated-gray removal + largest-connected-component island filter is safer.
> - Useful priors: nursery-rhyme phrasing ("horse jumping over crescent moon" → clean leap pose, moon cropped away), "little detective boy" for a child holding a magnifying glass.
> 
> ## What failed (concrete)
> - Negative prompts (no-op, guidance 0) and negative-style positives ("no scenery" alone).
> - "sticker / die-cut / page" wording → renders a physical card lying on a desk.
> - "show jumping" → adds rider + fence. "pointing" for policeman → draws a gun. "black eye mask" → medical mask. "hands tied with rope" → loosely held rope. Stethoscope-in-hand → luggage/bells/magnifiers. Scythe → brooms/axes/shovels ("grim reaper" → skeletons).
> - teacher/school/pupil words → classrooms and crowds. Flowers → gardens + stereotype "pupil gives teacher flowers" whichever direction was drawn.
> - Female-rescues-male in ANY direct phrasing (82 candidates, 9 rounds, 0 survivors) — model always makes the male the rescuer.
> - "hands behind back"/"arms crossed" passivity cues ignored; emotions mirror between figures.
> 
> ## Before/after prompt example
> - Before (failed): "children's book watercolor illustration of a bear pushing a lion from behind, both walking left, isolated on plain white background, no scenery" → fused bear-lion hybrids, scenery.
> - After (worked): two generations — "watercolor clipart of a brown bear standing on hind legs leaning forward with front paws extended, floating in pure white empty space, no ground, no shadow, nothing else in the picture" + same-style walking lion — then Pillow composite: pusher rotated -18 deg leaning behind the walker.

### S5 lines 55-74 — v5 Muse Spark direct deep prompt (current method)
> Model: Muse Spark `muse-image-1.0` via `image-generation` skill (`POST https://api.meta.ai/v1/images/generations`). All 22 app images regenerated with ONE deep single prompt per image — no part-splitting, no compositing. This completely replaces the SDXL-Turbo composite pipeline (v2) for this app.
> 
> ## Template (proven on the v4 tlaci pair, reused for all 22)
> ```
> Children's book watercolor illustration, side view: <actor with distinguishing look> <mechanical action description: who stands/moves where, what touches what>, <receiver with distinguishing look> <receiver's passive reaction>. <one sentence naming who is the active role and who the passive role>. Two clearly separate whole <people/animals> with correct realistic anatomy, [bodies not touching except <the single contact point>,] floating in pure white empty space, no ground, no shadow, no scenery, no text, nothing else in the picture.
> ```
> Key ingredients that carried the role direction: mechanical spatial phrasing (behind/in front, paws pressed on rear back, leaping directly over, standing behind the seated one), an explicit "X is the active <role>, Y is the passive <role>" sentence, and role props (magnifying glass = examiner, camera to the face = photographer, gold star + thumbs-up = praiser, rope held by the leader).
> 
> ## What worked
> - 22/22 images accepted on the FIRST generation — zero content retries. Muse Spark obeys agency verbs and role reversal that SDXL-Turbo never did (~700+ generations, compositing required, in v2).
> - „Princezna zachraňuje prince" (female rescuer) — impossible on SDXL-Turbo (0/82 direct candidates) — came out correct on the first direct attempt: princess above, leaning back, pulling the prince up by his joined hand; prince below reaching up.
> - Reversed stereotype pairs (patient examines doctor, pupil praises teacher, thief leads policeman, cow jumps over horse) all correct first try with the explicit active/passive sentence.
> - No fused animals, no scenery, no text; backgrounds pure white without any post-whitening.
> 
> ## What failed / weaknesses (realistic)
> - `kosa_a` HTTP 400 twice (transient), succeeded on the 3rd identical call — retry loop on HTTP errors is needed.
> - `zachranuje_b`: prince's lower body fades out at the bottom edge (torso up only) — acceptable but visibly cropped.
> - `vysetruje_*` and `cese_*` include a small stool despite "no scenery" (seat prop; background remains white).
> - `kosa_b`: goat trots behind the bicycle rather than beside it (still unambiguous).
> - `vede_a`: rope is slack; the "being led" reading is carried mostly by the thief's hung head and slumped posture.

### S5 lines 79-80 — retries
> ## Per-image retry list
> None (0 content retries across all 22 images). Only HTTP-level retries: kosa_a (2x HTTP 400 then success). Exact prompts: `AGENTS/Tasks/20260930_081102_TreninkPorozumeni/Temp/images_v5_direct/prompts.md`.

## 4. TreninkPorozumeni image content rules (S6)

### S6 line 6 — ImageLearnings archive convention
> - `ImageLearnings/<pictureFileBaseName>/` — per repaired picture: the ORIGINAL (pre-repair) image + its prompt `.txt`, `_user_comment.md` (verbatim user complaint), `_repair_result.md` (what prompt/composition change fixed it). This folder convention is MANDATORY for every future user-commented picture (User follow-up request 11).

### S6 lines 31-83 — image fault classes A-G and cross-cutting checklist
> ## Image learnings (per fault-class)
> 
> For every class: the user quote is in the matching `ImageLearnings/<name>/_user_comment.md`; the exact repair prompt in `_repair_result.md` and the installed `blind_test_data/images_txt/*.png.txt` (moved out of `assets/` so Metro and the resource-backend packer ignore them).
> 
> ### A. "kolem / past" = same level as the object, mid-pass (request 5; `kolem_target`, `kolem_gram`)
> Rejected: boy read as "already ran along" on one picture and "going towards" on the other — ambiguous pair; plus a leg rendered inside the tree.
> > The "kolem stromu" shall be so that the boy is on the same level as the tree and he is just passing the tree (he is not before passing, neither after passing).
> Fix/rules:
> - Target: figure exactly level with the object, whole figure IN FRONT of it, prompt states the negation explicitly: "neither approaching it nor already past it".
> - Distractor "toward": encode by DIRECTION + a clear DISTANCE gap + arms reaching toward the object — not by facing alone.
> - NEVER let a limb be occluded by another object ("leg partly hidden behind the trunk") — the model renders it as missing/embedded. Whole figure in front, or clear gap.
> - Verify relation pairs by blind FORCED-CHOICE between the two pictures (5/5 required), not by describing each alone.
> 
> ### B. "pod / under" a soft object ≠ inside it (request 6; `podpolstar_target`)
> Rejected: cube looked INSIDE the pillowcase, not under the pillow.
> Fix/rules:
> - Anchor the hidden object to the SURFACE BELOW ("cube sitting on the bed sheet") inside an explicit visible GAP ("open triangular gap under the lifted pillow corner").
> - Add the negation: "clearly under the pillow and not on top of it / not inside".
> - A "slight ambiguity" note from even a minority of blind describers predicts a real user complaint — treat it as FAIL, not a nitpick.
> 
> ### C. "tlačí / pushes" = from behind, with visible effort (request 9; `tlaci_a/_b/_lexa/_lexb`)
> Rejected: pusher upright with front paws ON TOP of the pushee's back — reads as standing on/holding.
> > The "tlačí" is more like push and that is usually not from top, but from behind and with somewhat visible effort.
> Fix/rules (the 5/5 prompt): pusher directly BEHIND, hind legs bent and firmly planted at ground level, whole body leaning forward at a diagonal "like someone pushing a heavy cart", front paws pressed FLAT against the pushee's REAR/hindquarters (never "on the back"), pushee moving forward calmly, "all paws at the same ground level" (prevents airborne poses — the round-1 "hind legs stretched far back" version looked airborne and failed 1/5 for `tlaci_a`/`tlaci_b`/`tlaci_lexb`; `tlaci_lexa` passed 5/5 already with the round-1 prompt and was kept).
> 
> ### D. "vede / leads": leader and led move in the SAME direction (request 10; `vede_a`)
> Rejected: thief faced/walked opposite to the policeman.
> Fix/rules: state the shared direction redundantly — "both people walking toward the left in the same direction", repeat it for the second figure, add "one behind the other in a single file line".
> 
> ### E. Role-reversal pairs differ by WHO ACTS — never by emotion (request 11; `tahne_target`, `tahne_gram`)
> Rejected: on both pictures the girl pulled; the pair differed only by anger vs. sadness.
> > Remove the anger or sadness and make one picture truly so that a girl pulls boy and on another so that boy pulls girl (make them clearly distinguishable).
> Fix/rules:
> - No anger, no crying: always "calm friendly faces, mouths closed, a light playful mood".
> - The composition that reads as pulling 5/5: puller IN FRONT striding away, leaning far forward, arms reaching BACK gripping the pullee's hands; pullee BEHIND leaning backward, heels dragging/braced. (Face-to-face mutual grip failed — read as tug-of-war.)
> - Make the two pictures mirrored/parallel so the ONLY difference is who is active.
> 
> ### F. Objects must be structurally complete (request 13; `lavicka_target`)
> Rejected: bench with no legs, levitating.
> Fix/rules: name the object's structural parts explicitly in the prompt ("four sturdy wooden legs clearly visible under the seat holding the bench up") and add a completeness sentence ("The bench is a complete piece of furniture: seat, backrest, and four legs.").
> 
> ### G. Ropes/cords/tools must be connected and intact (request 14; `svihadlo_gram`)
> Rejected (recurring defect): skipping rope leaving one handle and ending loose in mid-air.
> Fix/rules: add an explicit end-to-end continuity clause — "one single continuous unbroken smooth taut curve from the handle in the left hand down under the feet and up to the handle in the right hand, with no breaks, no gaps, no loose ends, no extra loops, no spirals, no tangles". "Swinging under his feet" alone is NOT sufficient (failed twice).
> 
> ### Cross-cutting image checklist (apply to every new image)
> 1. Spatial relation stated mechanically AND with an explicit negation of the wrong reading (A, B).
> 2. Anatomy: no limb occluded by objects; all figures/limbs complete; all feet/paws at the same ground level (A, C).
> 3. Objects: structural parts named; cords/ropes given a continuity clause (F, G).
> 4. Pairs: identical style/side, only the critical element differs; roles encoded by pose/position, never emotion (E).
> 5. Directionality of joint movement stated for both figures (D).
> 6. Acceptance: blind test per `_ImageGenerationLearnings.md` protocol; minority-ambiguity remarks = FAIL (B).
> 7. EVERY future image change/improvement request from the user (User follow-up requests 11 + 24) → MUST be (a) archived under `ImageLearnings/<pictureFileBaseName>/` — the ORIGINAL (pre-repair) png + its `.txt`, `_user_comment.md` (the user's comment/request verbatim), `_repair_result.md` (how it was repaired in the end) — AND (b) PROJECTED into this file as a new fault-class rule (or an extension of an existing one). Both steps are mandatory; archiving without updating this file is incomplete.

## 5. Blind-testing protocols (verbatim)

### S3 lines 3-17 — skill protocol (5 trials + verifier)
> Blind recognition test that a generated picture (or picture pair) truly shows what is intended. Use for deep verification — evaluators must recognize the content with no hints.
> 
> ## Protocol (per picture or pair)
> 
> - **5 trials**, each with a FRESH evaluator agent running the **opus** model (opus to save stronger-model budget).
> - Each evaluator receives ONLY the image(s) under neutral names (e.g., `obrazek1`/`obrazek2`) — no hints, no generation context, no prompts shown.
> - **Two-option case** (an alternative picture exists): mapping and order randomized per trial; evaluator gets the intended description/sentence and one minimal forced-choice question (e.g., "Which picture (1 or 2) shows this sentence? Answer with just the number.") — AND additionally produces the detailed description below for the chosen picture.
> - **Single-picture case** (no alternative to decide between — the usual future case): the evaluator describes the picture in detail, blind: what is on it, what format/style is used, whether there are any unrealities or illogical things.
> - **Independent verifier**: a separate verifier agent then compares the evaluator's description against the intended purpose — whether the picture is correct and correctly fulfills what shall be on it and what the impression shall be.
> - **All 5 trials must be correct.** Any miss → new prompt round (or new composite for the fallback method), then a fresh 5 trials.
> - Record the trials (per-trial mapping, question, answer/description, verifier verdict) to a trial log file next to the images.
> 
> ## Pre-screen
> 
> Before blind trials, screen candidates for realism defects (mutant/fused figures, text, non-white backgrounds, scenery) with evaluator agents and discard failures.

### S5 lines 33-34 — TreninkPorozumeni v2 protocol (10 trials, forced choice)
> ## Blind-test protocol
> Per pair: 10 consecutive trials, each a FRESH opus agent given ONLY two neutrally renamed copies (obrazek1/obrazek2, mapping randomized per trial) and one Czech sentence (A/B alternated ~5/5), question "Which picture (1 or 2) shows this sentence? Answer with just the number." All 10 must be correct; any miss → new prompt/composite round + fresh 10 trials. Realism pre-screen (mutants/text/backgrounds) and ranking done by opus evaluator agents.

### S6 lines 42, 49 — relation pairs and minority ambiguity
> - Verify relation pairs by blind FORCED-CHOICE between the two pictures (5/5 required), not by describing each alone.
>
> - A "slight ambiguity" note from even a minority of blind describers predicts a real user complaint — treat it as FAIL, not a nitpick.

## 6. How these apply to LetterTraining single-object word pictures

User decision (task Q&A 2026-10-01, `endgame:AGENTS/Tasks/20261001_090718_LetterTraining/_user_prompt.md`): "Full 5+1 per image (5 fresh opus blind evaluators + 1 independent verifier per image, per image-generation skill picture-blind-test.md)". **Superseded by user Q&A 2 (2026-10-01):** "Decrease the blind test to 3 opus subagents (from 5; for this task it is enough)." → LetterTraining uses **3 + 1** (3 fresh opus evaluators + 1 independent verifier; all 3 must pass).

### 6.1 Rules that apply directly
- **One picture per word**, generated with Muse Spark `muse-image-1.0` (S1), one deep single prompt per image (S2, S5 v5). Fallback ImageGateway only on API error / invalid key / depleted funds (S2 line 33), one image at a time (S4 line 24).
- **Single clearly identifiable object**: exactly one instance of the object, whole, centered, in its most typical/prototypical look, so it is named by the target word and not by a hypernym or neighbour word.
- **Style consistency**: "Children's book watercolor illustration" (S2 line 9) for all 500+ pictures; same prompt skeleton, same viewpoint convention per object category.
- **Primary invariant**: pure white background, only the object, prompt ends with "floating in pure white empty space, no ground, no shadow, no scenery, no text, nothing else in the picture." (S2 lines 10-11).
- **No text / letters in the image** (S2 "no text"; S3 pre-screen discards "text"). Essential here: a letter in the picture would give away the answer of the letter/syllable task.
- **Structurally complete objects** (S6 F): name structural parts + completeness sentence. **Cords/ropes continuity clause** (S6 G) where relevant.
- **No occluded/missing limbs, correct realistic anatomy** for animals/people (S6 A, checklist 2; S2 template).
- **Provenance `.txt`** next to every image (S1 lines 36-38).
- **WebP decode + PNG re-encode** with Pillow (S1 line 14, S5 line 77); final size 512x512 PNG as in TreninkPorozumeni (S5 line 77).
- **HTTP 400 retry** of the identical call (S2 line 29, S5 line 70); parallel generation allowed, report rate limits (S1 line 34).
- **ImageLearnings archive + projection** for every future user complaint about a picture (S6 checklist 7).
- ~~**Minority-ambiguity remarks = FAIL** (S6 B line 49, checklist 6).~~ Replaced by the per-level ambiguity rule of user Q&A 3 (see 6.2 step 5).
- **Pre-screen** for realism defects before blind trials (S3 line 17).

### 6.2 Per-image blind test (3 + 1, user Q&A 2) and regeneration loop
Per S3 single-picture case (S3 lines 7-8, 10-13) plus the task requirement that evaluators name the word:
1. Pre-screen (S3 line 17): discard candidates with mutant/fused figures, text/letters, non-white background, scenery, extra objects.
2. **3 trials (user Q&A 2; S3 line 7 says 5), each a FRESH evaluator agent on the opus model.** Each receives ONLY the image under a neutral name (e.g. `obrazek1.png`) — no word, no prompt, no generation context (S3 line 8).
3. Each evaluator (a) describes the picture in detail, blind: what is on it, format/style, any unrealities or illogical things (S3 line 10); and (b) names the object with one Czech word (task requirement).
4. **1 independent verifier agent** compares all 3 descriptions/answers against the intended word and purpose (S3 line 11).
5. **Pass criteria (concrete):**
   - 3 of 3 trials correct (S3 line 12 "All 5 trials must be correct." adapted to 3 by user Q&A 2);
   - verifier verdict "correct" — the picture correctly fulfils what shall be on it and the intended impression (S3 line 11);
   - no evaluator reports text, extra objects, background/scenery, unrealities or anatomy/structure defects (S2 invariant, S3 line 17, S6 F/G);
   - ~~no evaluator remarks any "slight ambiguity" — even a single minority remark = FAIL (S6 line 49).~~ **Superseded by user Q&A 3 (2026-10-01), per-level ambiguity rule:** "fail only if >=2 evaluators raise the same plausible alternative AND it changes the answer for that level (first letter L1; first/last syllable L2/L3), or a concrete defect is reported; otherwise record in alternativeNames." Non-fatal alternatives are recorded in `words.json` field `alternativeNames` of the word. Consequence (user Follow-up 2): an alternative with the same first letter (pero/propiska) is fine for Level 1 but excludes the word from Levels 2/3 if the syllables differ.
6. **Regeneration loop**: any miss → new prompt round, then a FRESH 3 trials with new evaluator agents (S3 line 12); repeat until pass. Record every trial (question, answer/description, verifier verdict) in a trial log next to the images (S3 line 13).

**Adaptation (proposal for user review) — what counts as a correct name:** the target word or an inflected form of it (e.g. "kočka"/"kočku"). A synonym or hypernym ("zvíře" for "kočka", "auto" for "autobus") is a MISS, because the child must arrive at the exact word whose first letter / first or last syllable is trained. Diminutives (e.g. "kočička") also count as a miss for Level 2/3 (different syllables), and — to keep one rule — for Level 1 too.

**Adaptation (proposal for user review) — evaluator question wording:** "Popiš podrobně, co je na obrázku, jaký je styl a zda je tam něco nereálného nebo nelogického. Potom napiš jedním českým slovem (podstatné jméno v 1. pádě), co obrázek zobrazuje."

**Adaptation (proposal for user review) — word replacement:** words that keep failing (abstract nouns, words always read as a hypernym) should be replaced by another top-5000 word starting with the same letter instead of being regenerated endlessly, keeping the "at least 3 words per letter" requirement. Suggested cap: 3 failed regeneration rounds → replace.

**Adaptation (proposal for user review) — single-object prompt template** (derived from the S2 template, roles removed):
```
Children's book watercolor illustration, <viewpoint>: one single <object> <typical distinguishing look>. The <object> is complete: <structural parts>. One clearly identifiable whole <object> with correct realistic <anatomy/structure>, floating in pure white empty space, no ground, no shadow, no scenery, no text, no letters, nothing else in the picture.
```

### 6.2.1 Adopted procedure and prompt learnings from the 20-word pilot (2026-10-01)
Source: task `endgame:AGENTS/Tasks/20261001_090718_LetterTraining/image_pipeline_pilot.md`. Adopted for the batch run:
- **Early stop (adopted):** a round stops after trial A if it gives a wrong word or a concrete defect; trials B/C are skipped and the image is regenerated with a fixed prompt. Accepted images always get the full 3/3 + verifier.
- **Batched verifiers (adopted):** one verifier agent may judge several images (about 5), but every image is judged by exactly one fresh verifier.
- **Condensed logs (adopted):** `blind_test_data/_blind_test_log/<id>.md` (moved out of `assets/`) holds condensed per-trial answers, per-round verdicts, verifier verdict and final status (not verbatim answers); exact prompts stay in the task folder.
- **No glyph/text words:** words whose picture is a written glyph, digit, letter or text (otaznik, abeceda, osmicka; check ctverec, znacka, dopis, cedule) are removed from the word list — no prompt can fix them.
- **Round cap:** 3 failed rounds → replace the word with another word of the same first letter. **Exception X/W (user Q&A 3):** "Allow 3 extra rounds and then take the picture which have had the best performance in tests (even despite it maybe did not fulfil the requirements fully)" — i.e. up to 6 rounds; if none passes, keep the best-performing candidate (fewest/least severe defects) and record why in its blind-test log.
Prompt learnings (add to the 6.2 template as relevant):
1. No glow / highlight circles / light effects (read as "idea/target"); add "no glow, no light effects" for body parts.
2. Body parts must fill the frame; a visible whole hand/face competes. Avoid words that children name by a hypernym (chodidlo, loket → noha, ruka).
3. Young animals: show a less baby-like version to avoid diminutives (kuře → "kuřátko").
4. Czech-specific items: give dimensions and negatives of foreign lookalikes (rohlík: "not a croissant, not a baguette").
5. Repeated parts: state counts mechanically ("exactly three legs visible"), graduation ("longest about twice the shortest"), and "each part one solid seamless piece".
6. Material cue when the lookalike differs by material ("WOODEN bars, visible wood grain, not metal").
7. Drop decorative context the model gets wrong (music staff with 6 lines).
8. Remove accessories that pull attention from the target part (headband on celo).

### 6.3 Source rules that do NOT apply (and why)
- **Two-option forced choice / picture pairs** (S3 line 9, S5 lines 33-34, S6 line 42, S6 checklist 4, S6 E): LetterTraining shows one picture per round with letter/syllable options, never two pictures to choose between → the S3 single-picture case applies.
- **Multi-subject role/agency rules** (S2 active/passive sentence, role props, mechanical spatial phrasing between subjects; S5 v2/v5 role learnings; S6 C tlačí, D vede, E role reversal): pictures show single objects, no actor/receiver relation.
- **Spatial-relation rules** (S6 A kolem, B pod; checklist 1, 5): no prepositional relations are depicted. If a word ever needs a context object, they apply again.
- **Per-partes compositing** (S2 lines 31-42, S5 v2): exists for multi-subject scenes on the fallback model; a single object is generated directly.
- **10-trial count** (S5 line 34): superseded by the user's explicit choice (now 3+1 per image, Q&A 2).
- **"Calm friendly faces" rule** (S6 E): written for role pairs; only relevant if a depicted animal/person has a face (then keep it neutral/friendly).

## 7. Contradictions between sources
1. **Trial count**: S5 line 34 requires 10 trials per pair; S3 line 7 and S6 line 42 require 5. Resolved for LetterTraining by user Q&A 2: 3 + 1 verifier.
2. **Single-picture evaluator task**: S3 line 10 asks only for a blind description judged by the verifier; the task asks evaluators to name the word in Czech. Not a conflict — both are done (6.2 step 3).
3. **Description vs forced choice**: S6 line 42 says relation pairs must be verified by forced choice "not by describing each alone", while S3 line 10 makes description the default single-picture method. Irrelevant here (no pairs).
4. **Image size**: request `1024x1024` (S1 line 13) vs observed 1600x1600 WebP output (S1 line 14) vs TreninkPorozumeni final 512x512 PNG (S5 line 77). A pipeline, not a conflict.
5. **Strictness on extra props**: S2 line 29 / S5 line 72 record stools accepted despite "no scenery", while S6 line 49 / checklist 6 make any minority remark a FAIL. For LetterTraining the stricter S6 rule is applied (an extra object competes with the target word).
