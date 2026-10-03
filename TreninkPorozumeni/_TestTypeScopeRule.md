# Test-Type Scope Rule (BINDING)

Load this file BEFORE implementing a new test type (5.x) or reworking an existing one. Every coordinator and content worker must follow it.

## 1. User rule (verbatim, User request 25 — follow-up 5)
"Another strong instruction to remember and follow from now on (also in every future development; write to README.md): before every test type implementer starts: run explorers with permission to use web to find out exactly what the given test type is about and what everything belongs to it. We need to not only follow a strict test type example, but to test everything what grammatically or in other way belongs to the given test type. Example: The 5.4 section "Slovesný rod" uses for everything "trpný rod (pasivum)", but the test purpose is to check whether children understand correctly "trpný rod", since the "rod činný" is more frequent and it is supposed that they already understand it (because: more normally used "rod" is "rod činný (aktivum)"). But if all the test questions are in "trpný rod", the children will just learn during the training app to "switch against how it normally works" - that "switched against normal is the correct answer", and they will not fully grasp the difference nor to understand quickly if the two "rod"s are used in normal spoken language. Therefore it is highly advantages to dedicate a minority of test questions (e.g. 1/3 of test questions in the test type) also to other forms of the given grammar/problematic. In this case it would be to dedicate roughly 1/3 of questions also to "rod činný" and to questions to contain "rod činný". These shall be mixed among the "rod trpný" questions proportionally and randomly (definitelly it shall not be so that there are 20 consecutive questions with "rod trpný" and then 10 consecutive questions with "rod činný"). They shall be reasonably mixed. And in this case the mix can be also such that in one test set of 4 images when we have two variants pointing to different correct image result: one variant can be in "rod trpný" and another in "rod činný". In this case we can do the mixing also in this way."

**WHY:** if every item uses the type's marked form (for example passive), children learn the shortcut "the unusual reading is always correct". They never learn the real contrast, and they fail to understand both forms in normal speech.

## 2. Q&A (verbatim, user answers)
1. **Q:** Should already-finished types be reworked to follow the new rule? (5.4 is now 100% passive; 5.1 and 5.7 each use a single construction; 5.3 and 5.5 already mix through their swapped variant.)
   **A:** "Rework, text+audio only (Recommended)": keep the pictures; change one variant's sentence, why-texts and mp3s. Then re-verify and redeploy.
2. **Q:** What about the types in progress (5.6 tenses, 5.8 gender, 5.9 comparison)?
   **A:** "Apply now (Recommended)": run the web explorer now; adjust the remaining and unimaged items; fix already-accepted items through variant text changes where possible.
3. **Q:** How should the 'roughly 1/3' be counted?
   **A:** "Per played sentence. Over all 200 variant sentences of a type, the target is 32–34% minority form, and every group of 10 has at least 3 minority sentences in expectation (the variant is picked 50/50 at play time)."
4. **Q:** How should the minority be mixed in?
   **A:** "Prefer mixed-variant items (Recommended)": mostly items with v1 in the majority form and v2 in the minority form. The order is a seeded random shuffle, with at most 4 pure-majority items in a row.
5. **Q:** Must minority items still test the type's grammatical contrast?
   **A:** "Yes, same contrast (Recommended)."
6. **Q:** Who decides each type's list of 'other forms' (majority vs minority)?
   **A:** "Explorer + coordinator (Recommended)": the web explorer proposes it, and the type's L1 coordinator decides and logs it in `open_questions.md` without asking the user.
7. **Q:** What are the web explorer's limits and where does its output go?
   **A:** "Read-only Czech sources, saved in app (Recommended)": output goes to `Documentation/TypeScope/5.X_scope.md`.
8. **Q:** Does this rule override 'Follow doc per type' and per-type feasibility constraints (e.g. 5.9 comparatives only)?
   **A:** "Yes, where depictable (Recommended)": 'Constrain items' still drops unpicturable items.

## 3. Step 0: web scope explorer (mandatory before any content)
- **Mandate:** find out exactly what the type covers grammatically, plus everything else that belongs to it: all forms, sub-forms, related constructions, and their typical acquisition age. Mark which forms can be shown unambiguously in a picture.
- **Web permission:** granted by the user for this step only.
  - Sources: read-only Czech linguistic and speech-therapy (logopedie) sources, such as the ÚJČ Internetová jazyková příručka, Wikipedia (cs) and Czech logopedie articles.
  - Do not copy copyrighted test items.
  - Do not log in anywhere and do not download binaries.
- **Output:** `Documentation/TypeScope/5.X_scope.md`, using this template:
  - `## Type` (name, doc reference)
  - `## Forms inventory`: one line per form, with an example sentence and „depictable: yes/no/risky"
  - `## Majority (marked) form`
  - `## Minority form(s)`, with the reason
  - `## Contrast kept by minority items`: how the grammatical distractor still tests the type's contrast
  - `## Sources`: full URLs
- **Decision:** the coordinator decides the final list and logs it in `open_questions.md`.

## 4. Ratio rules
- **Counting unit:** played sentences. A type has 100 items × 2 variants = 200 variant sentences, and one variant is picked 50/50 per item at play time.
- **Expected minority share:**
  - Formula: E = Σ_items (number of minority variants in the item) / 2 / 100.
  - The target for E is **32–34%**. Example: 66 mixed-variant items (1 minority variant each) give 33%.
  - **User exception (2026-10-03, Q14, verbatim):** "Minority share 33-50% is permitted when enough diversity is could not be achieved otherwise." **Coordinator interpretation (not user text):** 32–34% stays the target; a higher share, up to 50%, is allowed only when enough diversity (A9 diversity rule, e.g. no verb/construction repeated too often) cannot be achieved otherwise. Every such case MUST be logged (endgame task `open_questions.md` + the `field5X.ts` header + the type's TypeScope doc) with the diversity reason. Current case: 5.5 = 37.5% (Q5: "Accept larger minority, vary verbs"). Source: `_TreninkPorozumeni_Fields123_PROMPTS.md` „User request 25 — follow-up 6".
- **Per-group floor:** every group of 10 (1–10 … 91–100) must have **at least 3 expected minority sentences**, i.e. Σ over the group's items (minority variants / 2) ≥ 3.

## 5. Mixing rules
- **Item kind:** prefer mixed-variant items (v1 majority, v2 minority). Whole-minority items, where both variants use the minority form, are allowed when they are needed.
- **Order:** a seeded random shuffle of the type's item order. Record the seed in the progress file and in a comment in `src/items/field5X.ts`.
- **Run length:** at most 4 pure-majority items in a row. Never block-wise (e.g. 20 passive, then 10 active).

## 6. Contrast invariant
Minority items still test the type's core contrast; the grammatical distractor must test the same contrast. Examples:
- **5.4, active minority:** the distractor is role reversal.
- **5.5, affirmative minority:** the distractor is the negated scene.

The swap rule (target ↔ first grammatical distractor) and the lex rule (lex pictures are wrong for BOTH sentences) are unchanged. When a variant changes form, rewrite its why-texts.

## 7. Precedence vs earlier decisions
- This rule overrides "Follow doc per type" and the per-type feasibility constraints (for example "5.9 comparatives only") wherever the minority form is clearly depictable.
- "Constrain items" still applies: unpicturable or ambiguous items are dropped.
- The diversity rule, the „2000 most frequent words" vocabulary limit, "Always reach 100" and "any ambiguity/meaning remark = FAIL" are unchanged.

## 8. Retroactive application
- **Finished types (5.1–5.5, 5.7):** rework through text and audio only, keeping the pictures. Change one variant's sentence, why-texts and mp3s so the ratio and mixing rules hold.
  - Run a Czech review.
  - Run blind / lex re-checks of the changed sentence against the existing pictures.
  - Re-shuffle where the run-length rule requires it.
  - Re-verify with verify-improve-rounds, then redeploy.
- **In-progress types (5.6, 5.8, 5.9):** apply now. Run the explorer, adjust the remaining and unimaged items, and fix already-accepted items through variant text changes where possible.
- **New types (5.10–5.15):** apply from the start.

## 9. Starting-hypothesis table (evaluator proposal; the explorer confirms or corrects it)
Start hypotheses only; the per-type `Documentation/TypeScope/5.X_scope.md` + the logged coordinator decision supersede the row. The „Final minority" column is filled only where the Phase C verification (2026-10-03) stated the implemented form.

| Type | Majority | Proposed minority | Final minority (implemented) |
|---|---|---|---|
| 5.1 | SVO with visible case | OVS order ("Medvěda tlačí lev") | — |
| 5.2 | spatial prepositions | other preposition pairs / case-governed forms (za+Acc motion vs za+Ins position, k/od, mezi, přes) | — |
| 5.3 | singular↔plural | plural shown by the verb only; irregular plurals (dítě/děti, člověk/lidé) | — |
| 5.4 | passive | active, with role reversal as distractor | — |
| 5.5 | negated | affirmative; lexical/pronoun negation (nikdo, nic, žádný) | — |
| 5.6 | future/past | present tense as target; perfective vs analytic future | — |
| 5.7 | subject relative „který" | object relatives („kterého honí"), co/kde relatives, temporal clauses | object relatives (kterého/kterou/kterému/kterým, preposition + který); co/kde relatives and temporal clauses not used |
| 5.8 | -la (feminine) | -l / -lo / plural -li/-ly | present tense + agreeing sám/sama (replaced -l/-lo/-li/-ly) |
| 5.9 | comparatives | superlatives with 3 objects, adverb degrees, negative comparison, „stejně … jako" | — |
| 5.10 | všechny | někteří / žádný / stejně | žádný/nikdo, jen jeden, oba/obě (někteří/stejně dropped) |
| 5.11 | jeho/její | svůj vs jeho; personal/demonstrative pronouns | svůj (personal/demonstrative pronouns excluded) |
| 5.12 | pouze/kromě | každý, žádný, někteří | kromě, každý–svůj / spolu (žádný/někteří excluded as 5.10 overlap) |
| 5.13 | dative recipient | role swap without dative; k/pro | dative-first order, k + Dat, possessive dative (role swap without dative rejected) |
| 5.14 | instrumental tool | comitative „s + Ins" | — |
| 5.15 | perfective past | imperfective past, mixed both ways | imperfective past, minority in v2 only (two-person PP design for pure-majority items) |

## 10. Verifier checklist (add to every verify-improve round of a type)
- [ ] `Documentation/TypeScope/5.X_scope.md` exists, cites its sources, and the coordinator's decision is logged.
- [ ] The expected minority share E is 32–34%, recomputed from `field5X.ts` — or ≤50% only with a logged diversity reason (§4 user exception, Q14).
- [ ] Every group of 10 has at least 3 expected minority sentences.
- [ ] No more than 4 pure-majority items in a row; the shuffle seed is recorded.
- [ ] Every minority item keeps the type's contrast; the swap and lex rules hold.
- [ ] The changed variants' why-texts and mp3s match the new sentences and passed Czech review.

## 11. Change log
- 2026-10-01: created from User request 25 follow-up 5 and its 8 Q&A answers.
- 2026-10-03: §4 user exception (Q14: minority up to 50% only when diversity cannot be achieved otherwise; every case logged), §10 checklist adjusted, §9 „Final minority" column added (PROMPTS „User request 25 — follow-up 6").
- 2026-10-03 (Phase C R4): §4 — the text after the verbatim Q14 quote labelled „Coordinator interpretation (not user text)".
