# Final report — exhaustive list of trainable Czech comprehension/grammar topics (pre-school)

Date: 2026-10-02. User prompts and Q&A: `_AllTopics_PROMPTS.md`.

## 1. Deliverables

| File | Content |
|---|---|
| `topics_short_cz.md` | 233 topics, pure Czech, 1 sentence + 1 example each |
| `topics_short_en.md` | 233 topics, English descriptions, Czech examples |
| `topics_detailed_cz.md` | 233 topics, pure Czech, detailed description, ≥3 examples, difficulty reason, phonemic pair table |
| `topics_detailed_en.md` | same in English (examples Czech) |

- All 4 files have the identical topic set, order, IDs (T001–T233) and scores (script-checked, 0 mismatches).
- Coverage vs existing Documentation (doc1–doc3, TypeScope): ✅ COVERED 34, 🟡 PARTIAL 43, 🆕 NEW 156.
- Each topic carries: age band (3–4 / 4–5 / 5–6 / 6–7), level (pre-school / first-grade entry), frequency, importance, difficulty, score, coverage mark; L2-specific (interference) topics flagged 🌐.
- Quick index of the user's three named areas: phonemic hearing 47 topics, on/ona/ono 7, se/si/nothing 11.
- Out of scope by design: writing/spelling (i/y etc.) and articulation/production training.

## 2. Process

1. **R1 — four parallel source groups**
   - Documentation inventory (no web): 37 topics.
   - Courses of Czech for foreigners: 54 → 62 after a deepening pass (2 → 12 searches, 11 pages read).
   - Logopedie / phonemic hearing: 75 topics; a second pass filled missing descriptions.
   - Czech MŠ/ZŠ curricula: 41 → 51 after a deepening pass (7 pages read).
2. **R2 — merge**: deduplicated and split to TypeScope granularity (one contrast = one topic) → 168 topics + a GAPS list.
3. **R3 — three gap sweeps** (phonemic pairs + age norms; grammar gaps; pragmatics/lexicon/L2 interference): +63 records, 11 age-band corrections.
4. **R4 — final merge and write**: 224 topics into the 4 files.
5. **Three verify–repair rounds**, each with 2 independent fresh verifiers (different models), then a repair agent:

| Round | Verifier A | Verifier B | Repair outcome |
|---|---|---|---|
| 1 | 4 H / 7 M / 12 L | 4 H / 11 M / 12 L | 50 fixed, 6 rejected with reasons, 9 new topics → 233 |
| 2 | 0 H / 7 M / 12 L | 1 H / 4 M / 10 L | 29 fixed, 3 not done/rejected |
| 3 | 0 H / 3 M / 9 L | 0 H / 3 M / 9 L | 20 fixed, 1 rejected; the remaining items were wording/marker level |

Main issues fixed along the way: English markers in the CZ files, wrong or ambiguous examples (e.g. „Děti … Oni“ → „Ony“, „točil kolem“, non-word „kože“), false minimal pairs (pairs also differing in vowel length), missing topics (učit × učit se, půjčit × půjčit si, dát × dostat, clitics mi/mě/ti/tě, …), inconsistent coverage marks, leaked internal IDs, Russian-instead-of-Ukrainian interference traits.

No further verification round was run after repair round 3.

## 3. Ranking method

- Score = (frequency + importance) / difficulty, each rated 1–5 (half-steps allowed for difficulty). Sorted descending; ties broken by importance, then by earlier age band.
- **All three inputs are agent expert estimates**, not measured data.
- History:
  - R4 first derived difficulty mechanically from the age band. Verifiers showed this distorted the ranking, so it was dropped in repair round 1, and difficulty was rated per topic.
  - Repair round 2 made **9 targeted rating changes**, for topics verifiers flagged as misranked (e.g. „že jo?“ and „Je mi pět“ lowered, se/si meaning-changing topics raised). It was not a fresh re-rating of all topics.
  - Repair round 3 changed 2 scores by general rules.
- The difficulty reason for every topic is printed in both detailed files, so the ranking can be audited.
- Consequence of the formula: easy, early-mastered topics (v/na/pod, imperative, kdo/co/kde) rank highest; harder contrasts rank lower even when important.

## 4. Where the user's named topics are

| Area | Topic | ID | Score |
|---|---|---|---|
| on/ona/ono | on × ona by the person's sex | T004 | 5.00 |
| | object pronouns mi/mě, ti/tě | T022 | 3.60 |
| | ho/ji/mu/jí | T037 | 3.33 |
| | on/ona/ono by grammatical gender | T095 | 2.57 |
| | pronoun forms after prepositions (k němu, s ní) | T113 | 2.33 |
| | reference tracking in a story | T139 | 2.25 |
| | oni/ony | T166 | 2.00 |
| se/si/nothing | točil × točil se | T036 | 3.33 |
| | se/sebe × ho/ji | T053 | 3.00 |
| | dative si | T055 | 3.00 |
| | učit × učit se, půjčit × půjčit si | T084 | 2.67 |
| | se × si changes meaning (objednal si × objednal se) | T094 | 2.57 |
| | inherently reflexive verbs (bát se) | T120 | 2.33 |
| phonemic hearing | S × Š | T063 | 2.86 |
| | S × Z (kosa × koza) | T069 | 2.86 |
| | V × B | T109 | 2.33 |
| | Ř × Ž | T129 | 2.29 |
| | Ř × R | T130 | 2.29 |
| | Š × Ž | T149 | 2.00 |
| | F × V | T150 | 2.00 |
| | Z × Ž | T153 | 2.00 |

The complete lists are in the quick index at the top of each file.

## 5. Limitations

- **Snippet-level sources:** many web sources were seen only as search snippets. Several topics rest on the agents' general grammar knowledge (cited as such).
- **Unreadable key sources:** the RVP PV PDF, the A1/A2 exam syllabus PDFs and the TROG-2 CZ item tables could not be read.
- **Age bands:** sourced age norms exist only for phonemic discrimination (Škodová et al.; Bednářová & Šmardová). Grammar age bands are estimates (anchors: HSET split <5 / ≥5, Lechta "grammar errors should disappear after age 4").
- **Agent-compiled pairs:** about 11 minimal pairs (e.g. zebra × žebra, couvá × zouvá, šila × žila) were compiled by agents, not taken from sources. Verifiers confirmed they are real words differing in one sound. For some contrasts (e.g. ř/ž, k/g, c/z) no true minimal pair exists; near-pairs or syllables are used and marked.
- **L2 interference topics are weakly sourced:**
  - Ukrainian: a hypothesis, marked as such.
  - Vietnamese: weakly sourced.
  - Slovak: no source.
- **Unchecked Czech difficulty reasons:** the 233 Czech difficulty reasons written in repair round 3 were checked only by script (length, wording, no English), not by an independent reader.
- **Partial coverage check:** the coverage check did not read every Documentation subsection (some TypeScope pilot/diversity sub-sections and parts of doc1 were skipped). A few marks may be off.
- **Out of scope:** articulation/production training.

## 6. Working files

Everything is in `C:\GIT\endgame\AGENTS\Tasks\20261002_110009_CzechTrainingTopics\`:
- `_plan_description.md`: plan, verbatim prompts, status.
- `Temp\rounds\`: R1 source files, R2_master.md, R3 gap files, R4_final_master.md (old→new ID mapping).
- `Temp\repair3\topics_final.json`: the current single dataset the 4 files are generated from.
- `verifications\`: all verifier reports (subagent_1/2, round2_*, round3_*) and the repair changelogs (repair_round1–3.md).
- `scripts\`: generation and consistency-check scripts (repair3_gen.py, repair3_check.py).
