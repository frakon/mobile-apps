# Image Generation Learnings — TreninkPorozumeni (round 2, 2026-09-30)

Model: SDXL-Turbo int8 (rupeshs/sdxl-turbo-openvino-int8), OpenVINO CPU, `<image-gen-host>:7861/generate`.
Params used: 512x512, steps 2-6, varied seeds. **Guidance scale is fixed at 0 → negative prompts have NO effect** — every constraint must be positively phrased.

## Headline learning: direct two-subject prompts are unusable on this model
Across all 11 items, ~250+ direct two-actor candidates produced essentially ZERO realism-screen survivors:
- Verbs of agency (chases, pushes, combs, examines, photographs, leads, rescues, praises) are ignored; the model picks the stereotypical role assignment (mother combs child, doctor examines patient, male rescues female) regardless of wording, spatial phrasing, size cues, or subject order.
- Two same-category animals fuse into hybrids (bear+lion, cow-spotted horses) in nearly every image.
- Scenery (rooms, landscapes, streets) appears despite "no scenery"-style positive phrasing.

**The only reliable recipe (used for most accepted pairs): generate each figure SEPARATELY as a single-subject image, whiten/crop with Pillow, and COMPOSE the two figures on a 512x512 white canvas with a script.** Role reversal then becomes a deterministic layout operation (who is in front / who leans / who holds the prop), and blind tests pass.

## What worked
- (a) No background: single-subject prompts + "watercolor clipart ... floating in pure white empty space, no ground, no shadow, nothing else in the picture"; even then most raw outputs needed Pillow flood-fill/whitening post-processing to reach plain white. Short prompts gave the lightest backgrounds; long multi-clause prompts always added scenery.
- (b) Non-mutant subjects: one subject per generation. When two animals must appear (before the composite pivot), "two separate animals, standing apart" helped little — separation via compositing was the real fix.
- (c) Unambiguous who-does-what: spatial/postural composition in the composite (attacker enlarged and looming over small victim — skrabe; leader in front holding a drawn rope — vede; jumper mid-air centered over stander — preskakuje) plus concrete PROPS encoding the role (magnifying glass for the examiner — vysetruje; gold star given by the praiser — chvali; camera held to the face — fotografuje).
- zachranuje repair specifics: phrase parts as PURE POSE ("one single princess leaning forward reaching out one hand, floating in pure white empty space, nothing else in the picture") — mentioning "to help someone up" spawns a second person (10/40 parts wasted); build A and B as mirrored parallel composites so the only difference is who rescues. Background cleanup: flood-fill tolerance >75 destroys pale skin/dress; targeted desaturated-gray removal + largest-connected-component island filter is safer.
- Useful priors: nursery-rhyme phrasing ("horse jumping over crescent moon" → clean leap pose, moon cropped away), "little detective boy" for a child holding a magnifying glass.

## What failed (concrete)
- Negative prompts (no-op, guidance 0) and negative-style positives ("no scenery" alone).
- "sticker / die-cut / page" wording → renders a physical card lying on a desk.
- "show jumping" → adds rider + fence. "pointing" for policeman → draws a gun. "black eye mask" → medical mask. "hands tied with rope" → loosely held rope. Stethoscope-in-hand → luggage/bells/magnifiers. Scythe → brooms/axes/shovels ("grim reaper" → skeletons).
- teacher/school/pupil words → classrooms and crowds. Flowers → gardens + stereotype "pupil gives teacher flowers" whichever direction was drawn.
- Female-rescues-male in ANY direct phrasing (82 candidates, 9 rounds, 0 survivors) — model always makes the male the rescuer.
- "hands behind back"/"arms crossed" passivity cues ignored; emotions mirror between figures.

## Before/after prompt example
- Before (failed): "children's book watercolor illustration of a bear pushing a lion from behind, both walking left, isolated on plain white background, no scenery" → fused bear-lion hybrids, scenery.
- After (worked): two generations — "watercolor clipart of a brown bear standing on hind legs leaning forward with front paws extended, floating in pure white empty space, no ground, no shadow, nothing else in the picture" + same-style walking lion — then Pillow composite: pusher rotated -18 deg leaning behind the walker.

## Blind-test protocol
Per pair: 10 consecutive trials, each a FRESH opus agent given ONLY two neutrally renamed copies (obrazek1/obrazek2, mapping randomized per trial) and one Czech sentence (A/B alternated ~5/5), question "Which picture (1 or 2) shows this sentence? Answer with just the number." All 10 must be correct; any miss → new prompt/composite round + fresh 10 trials. Realism pre-screen (mutants/text/backgrounds) and ranking done by opus evaluator agents.

## Per-item outcomes
| Item | Rounds (blind) | Result | Notes |
|---|---|---|---|
| kosa | 1 | 10/10 | Backgrounds whitened by post-processing; scythe reads partly as sickle/hoe (goat vs scythe carried the discrimination) |
| honi | 2 | 10/10 | R1 9/10 (fleeing girl's back-reach read as chasing); A rebuilt as composite; A/B styles differ noticeably |
| tlaci | 1 | 10/10 | Both images composites; last realism screen still called the "pushing" action weak ("could read as walking together") |
| vysetruje | 1 | 10/10 | Magnifying-glass prop pivot after stethoscope failures; both composites |
| cese | 1 | 10/10 | Composites; B's comb reads as a red block |
| preskakuje | 2 | 10/10 | R1 9/10 (horse leaping off to the side); fixed by centering leap over cow; composites |
| fotografuje | 1 | 10/10 | Composites (side-by-side, camera aimed at poser) |
| skrabe | 2 | 10/10 | R1 9/10; fixed by enlarging the attacker looming over small victim |
| vede | 1 | 10/10 | Composites; rope drawn programmatically; only order differs between A and B |
| zachranuje | 1 (after full restart) | 10/10 | Direct approach failed totally (0/82 B candidates over 9 generation rounds — model NEVER draws a female rescuer); repaired by a dedicated worker via 40 single-figure parts + composite (parallel mirrored layouts, only WHO rescues differs); rescue is "reaching toward", hands ~100-150 px apart; minor composite artifacts (crop at edge, small ground patch) |
| chvali | 3 | 10/10 | Bouquet designs failed twice (stereotype reading); gold-star + thumbs-up prop won; A more bold-cartoon than watercolor |

Candidate volume: ~700+ generations total across workers (e.g. W1 136, W2 ~180, W3 ~175, W4 ~212, plus repair). Full per-candidate prompt records: `AGENTS/Tasks/20260930_081102_TreninkPorozumeni/Temp/images_v2/<id>/candidates.md`; trial logs in each item's `trials`/`trial_log` files.

# v5: direct deep-prompt method (Muse Spark), 2026-09-30

Model: Muse Spark `muse-image-1.0` via `image-generation` skill (`POST https://api.meta.ai/v1/images/generations`). All 22 app images regenerated with ONE deep single prompt per image — no part-splitting, no compositing. This completely replaces the SDXL-Turbo composite pipeline (v2) for this app.

## Template (proven on the v4 tlaci pair, reused for all 22)
```
Children's book watercolor illustration, side view: <actor with distinguishing look> <mechanical action description: who stands/moves where, what touches what>, <receiver with distinguishing look> <receiver's passive reaction>. <one sentence naming who is the active role and who the passive role>. Two clearly separate whole <people/animals> with correct realistic anatomy, [bodies not touching except <the single contact point>,] floating in pure white empty space, no ground, no shadow, no scenery, no text, nothing else in the picture.
```
Key ingredients that carried the role direction: mechanical spatial phrasing (behind/in front, paws pressed on rear back, leaping directly over, standing behind the seated one), an explicit "X is the active <role>, Y is the passive <role>" sentence, and role props (magnifying glass = examiner, camera to the face = photographer, gold star + thumbs-up = praiser, rope held by the leader).

## What worked
- 22/22 images accepted on the FIRST generation — zero content retries. Muse Spark obeys agency verbs and role reversal that SDXL-Turbo never did (~700+ generations, compositing required, in v2).
- „Princezna zachraňuje prince" (female rescuer) — impossible on SDXL-Turbo (0/82 direct candidates) — came out correct on the first direct attempt: princess above, leaning back, pulling the prince up by his joined hand; prince below reaching up.
- Reversed stereotype pairs (patient examines doctor, pupil praises teacher, thief leads policeman, cow jumps over horse) all correct first try with the explicit active/passive sentence.
- No fused animals, no scenery, no text; backgrounds pure white without any post-whitening.

## What failed / weaknesses (realistic)
- `kosa_a` HTTP 400 twice (transient), succeeded on the 3rd identical call — retry loop on HTTP errors is needed.
- `zachranuje_b`: prince's lower body fades out at the bottom edge (torso up only) — acceptable but visibly cropped.
- `vysetruje_*` and `cese_*` include a small stool despite "no scenery" (seat prop; background remains white).
- `kosa_b`: goat trots behind the bicycle rather than beside it (still unambiguous).
- `vede_a`: rope is slack; the "being led" reading is carried mostly by the thief's hung head and slumped posture.

## WebP finding
The API returns **1600x1600 WebP** in `data[0].b64_json` even though the request asks for `"size":"1024x1024"` and the response says PNG-ish fields — always decode with Pillow and re-encode: `Image.open(bytes).convert("RGB").resize((512,512), Image.LANCZOS).save(x, "PNG")`.

## Per-image retry list
None (0 content retries across all 22 images). Only HTTP-level retries: kosa_a (2x HTTP 400 then success). Exact prompts: `AGENTS/Tasks/20260930_081102_TreninkPorozumeni/Temp/images_v5_direct/prompts.md`.
