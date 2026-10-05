# Audio texts (ElevenLabs, text-to-speech skill; mp3_44100_192 = 44.1 kHz / 192 kbps mono; raw, no cut / stretch / trim / fade)

Regenerated 2026-10-04 by `endgame2/AGENTS/Tasks/20261004_063630_RegenerateLetterAppsSoundsElevenLabs/scripts/` (`build_jobs.py`, `run_tts.py`, `install.py`, `gen_audio_texts.py`); request: `_LetterTraining_PROMPTS.md` / "ElevenLabs regeneration of all sounds (2026-10-04)". Replaces the Vlasta/edge-tts audio and all post-processing of earlier runs.
The "## Syllables" section is NOT from that generator any more: it is written by `endgame2/AGENTS/Tasks/20261004_130458_SyllableMethodTrial/scripts/regen_install.py` (2026-10-05 regeneration of all 829 syllables); a re-run of `gen_audio_texts.py` would overwrite it with stale data.

Common request fields: voice `CzKids_Bedtime_BestVoice` (`xiS6BE89wW6zbLVHQm2r`), model `eleven_v4`, `language_code` `cs`. File-name folding: á->aa, é->ee, í->ii, ó->oo, ú->uu, ů->uo, ý->yy, č->cx, ď->dx, ě->ex, ň->nx, ř->rx, š->sx, ť->tx, ž->zx (ch stays `ch`).

## Letters (`letters/`)
Name method: text `"<name>."` + previous_text `"Písmeno:"`. Short vowels are said in the long form. The `*_long.mp3` files are NOT generated separately (user decision 2026-10-04): each is a byte-identical copy of the letter-name file of its vowel (same sound, same creation; only the vowel it is used for differs: a_long = a.mp3, e_long = e.mp3, i_long = i_soft_long = i.mp3, o_long = o.mp3, u_long = u.mp3).

| letter | text | previous_text / next_text | file |
|---|---|---|---|
| a | á. | previous: Písmeno: | a.mp3 |
| á | dlouhé á. | previous: Písmeno: | aa.mp3 |
| b | bé. | previous: Písmeno: | b.mp3 |
| c | cé. | previous: Písmeno: | c.mp3 |
| č | čé. | previous: Písmeno: | cx.mp3 |
| d | dé. | previous: Písmeno: | d.mp3 |
| ď | ďé. | previous: Písmeno: | dx.mp3 |
| e | é. | previous: Písmeno: | e.mp3 |
| é | dlouhé é. | previous: Písmeno: | ee.mp3 |
| ě | ije. | previous: Písmeno: | ex.mp3 |
| f | ef. | previous: Písmeno: | f.mp3 |
| g | gé. | previous: Písmeno: | g.mp3 |
| h | há. | previous: Písmeno: | h.mp3 |
| ch | chá. | previous: Písmeno: | ch.mp3 |
| i | í. | previous: Písmeno: | i.mp3 |
| í | dlouhé í. | previous: Písmeno: | ii.mp3 |
| j | jé. | previous: Písmeno: | j.mp3 |
| k | ká. | previous: Písmeno: | k.mp3 |
| l | el. | previous: Písmeno: | l.mp3 |
| m | em. | previous: Písmeno: | m.mp3 |
| n | en. | previous: Písmeno: | n.mp3 |
| ň | eň. | previous: Písmeno: | nx.mp3 |
| o | ó. | previous: Písmeno: | o.mp3 |
| ó | dlouhé ó. | previous: Písmeno: | oo.mp3 |
| p | pé. | previous: Písmeno: | p.mp3 |
| q | kvé. | previous: Písmeno: | q.mp3 |
| r | er. | previous: Písmeno: | r.mp3 |
| ř | eř. | previous: Písmeno: | rx.mp3 |
| s | es. | previous: Písmeno: | s.mp3 |
| š | eš. | previous: Písmeno: | sx.mp3 |
| t | té. | previous: Písmeno: | t.mp3 |
| ť | ťé. | previous: Písmeno: | tx.mp3 |
| u | ú. | previous: Písmeno: | u.mp3 |
| ú | ú s čárkou. | previous: Písmeno: | uu.mp3 |
| ů | ů s kroužkem. | previous: Písmeno: | uo.mp3 |
| v | vé. | previous: Písmeno: | v.mp3 |
| w | dvojité vé. | previous: Písmeno: | w.mp3 |
| x | iks. | previous: Písmeno: | x.mp3 |
| y | ypsilon. | previous: Písmeno: | y.mp3 |
| ý | dlouhé ypsilon. | previous: Písmeno: | yy.mp3 |
| z | zet. | previous: Písmeno: | z.mp3 |
| ž | žet. | previous: Písmeno: | zx.mp3 |
| (vowel pronunciation) | byte copy of a.mp3 (no own request) | - | a_long.mp3 |
| (vowel pronunciation) | byte copy of e.mp3 (no own request) | - | e_long.mp3 |
| (vowel pronunciation) | byte copy of i.mp3 (no own request) | - | i_long.mp3 |
| (vowel pronunciation) | byte copy of i.mp3 (no own request) | - | i_soft_long.mp3 |
| (vowel pronunciation) | byte copy of o.mp3 (no own request) | - | o_long.mp3 |
| (vowel pronunciation) | byte copy of u.mp3 (no own request) | - | u_long.mp3 |

Exception: the letter name ú (`uu.mp3`) was regenerated with text `"ú s čárkou."` + previous_text `"Písmeno:"` (ú revert at the user's request), instead of the plain `"ú."` form shown in its table row.


Not regenerated: `letters_en/` (English letter names; the skill covers Czech only).

## Syllables (`syllables/`) - ONE file per syllable, final rules of the `text-to-speech` skill (regenerated 2026-10-05)
Regenerated 2026-10-05 for ALL 829 syllables (user decision, `_LetterTraining_PROMPTS.md` / "## Syllable regeneration under the final text-to-speech rules (2026-10-05)"; the rules and the user's decisions: `endgame2/AGENTS/Tasks/20261004_130458_SyllableMethodTrial/user_prompt.md` (Prompt 15 Q7-Q12, 17-18, 20-22), `final/final_evaluation_and_rules.md`; scripts `scripts/regen_carriers.py`, `regen_run.py`, `regen_install.py` of that task; state `Temp/Regen/state.json`, report `Temp/Regen/report.json`). Replaces every earlier syllable recipe (plain period text, slash-IPA, EXCEPTION 1-7 of the 2026-10-04 run).

Request frame (every syllable): text `"<T>,"` (trailing comma), previous_text `"/"`, next_text `"/ jako ve slově <carrier>"`, model `eleven_v4`, `language_code` cs, voice `CzKids_Bedtime_BestVoice`, output `mp3_44100_192`, raw (no post-processing), one take per request.
Ways: **main** = `<T>` is the Czech respelling (q->kv, x->ks, w->v, final voiced consonant devoiced, ě->je after b/p/v/f and word-initially, ů->ú, y->i except after d/t/n; the only spelling exception sir->syr); **IPA** = `<T>` is the hybrid IPA (Czech letters kept for ch/ť/ď/ř/ž, y/ý after a hard d/t/n, syllabic r̩/l̩) - the primary way for d/t + i/í syllables (13), the fallback form otherwise; **vowel-less** (16: bl br chl cvr fr gr hr mr prs prst srd tr vlk vr zmrz zr) = both forms generated, voiced span of IPA <= 0.85 x voiced span of main -> the IPA file, else the main file.
Carrier = exactly one regularly pronounced Czech word containing the syllable sound (non-initial position preferred; no irregular loanwords); `forced` = no regular word contains the syllable with its vowel length, a regular word with the same consonants and a short vowel is used. dio: no regular Czech word contains the soft "ďio" - generic soft-d carrier `hodiny` (OPEN ITEM).
Check: every file = gross-defect check (size, format 44.1 kHz/192 kbps/mono, not quiet/short, total <= 1.3 s); classes q, x, w, ě, ch (not che/chi-type), final voiced, vowel-initial, default (incl. n/ň) = additionally the automatic transcript check (both local recognizers `comodoro/wav2vec2-xls-r-300m-cs-250` + `facebook/wav2vec2-xlsr-53-espeak-cv-ft` disagree with the target -> fail); ř, plain ď/ť/dě/tě, d/t/n + y, che/chi-type = gross-defect check only (user decision: accepted unheard); d/t + i/í = IPA form accepted per rule; vowel-less = voiced-span pick. Fallback ladder: gross defect -> one retake of the same request -> fails too -> IPA form (retake when the IPA text equals the sent text) -> check -> fails -> user; transcript fail -> IPA form -> check -> both fail -> user. The "cut-off end" measurement only warns (file kept). NO agent listened to any file.
Result: 813 syllables passed the rules; the 16 both-forms-failed syllables were rated by the user 2026-10-05 (Prompt 23, `ListenSamples/RegenBothFailed/syllables_regen_feedback.json`): 13 installed main-way files correct (5★, kept), bon -> the main retake, rie -> the IPA file (both user-rated 5★ and installed by `scripts/regenfix_install.py`), chó resolved (both forms 2★ and all 6 main-way retakes "chú"; the pure-IPA text `xoː,` carrier psychóza user-rated 5★ 2026-10-05, Prompt 24, `ListenSamples/RegenBothFailed/Cho/syllables_cho_feedback.json`, installed as a byte copy by the master); ni (main + IPA both 5★) switched to the main-way file per Prompt 17; 67 files carry the cut-off warning (marked `warn:cutoff`). regen_install.py must not be re-run (state.json finals of bon/rie/ni are superseded by the ratings).
Columns: `text` = the exact `text` field sent (the chosen take); `way` = main / IPA / vowel-less pick; `check` = check mode and result of the installed take; `fallback` = the ladder steps that fired (`-` = the first take passed).

| syllable | kind | text | carrier word (source) | way | check | fallback | file |
|---|---|---|---|---|---|---|---|
| a | real | `a,` [Q4: previous_text /, next_text / jako ve slově fotoaparát] | fotoaparát (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | a.mp3 |
| ak | real | `ak,` [Q4: previous_text /, next_text / jako ve slově drak] | drak (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ak.mp3 |
| an | real | `an,` [Q4: previous_text /, next_text / jako ve slově lano] | lano (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | an.mp3 |
| as | real | `as,` [Q4: previous_text /, next_text / jako ve slově hasič] | hasič (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | as.mp3 |
| au | real | `aʊ,` [Q4: previous_text /, next_text / jako ve slově astronaut] | astronaut (dataset-substring) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | au.mp3 |
| ba | real | `ba,` [Q4: previous_text /, next_text / jako ve slově ryba] | ryba (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ba.mp3 |
| bat | real | `bat,` [Q4: previous_text /, next_text / jako ve slově akrobat] | akrobat (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bat.mp3 |
| bař | real | `bař,` [Q4: previous_text /, next_text / jako ve slově zubař] | zubař (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | barx.mp3 |
| be | real | `be,` [Q4: previous_text /, next_text / jako ve slově koberec] | koberec (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | be.mp3 |
| ben | real | `ben,` [Q4: previous_text /, next_text / jako ve slově buben] | buben (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ben.mp3 |
| bi | real | `bi,` [Q4: previous_text /, next_text / jako ve slově obilí] | obilí (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bi.mp3 |
| bič | real | `bič,` [Q4: previous_text /, next_text / jako ve slově babička] | babička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bicx.mp3 |
| bl | real | `bl,` [Q4: previous_text /, next_text / jako ve slově jablko] | jablko (authored-final) | vowel-less pick -> main (ratio 1.186) | gross-defect check only: PASS | voiced-span pick: ratio 1.186 -> main | bl.mp3 |
| blesk | real | `blesk,` [Q4: previous_text /, next_text / jako ve slově záblesk] | záblesk (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | blesk.mp3 |
| bo | real | `bo,` [Q4: previous_text /, next_text / jako ve slově obojek] | obojek (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bo.mp3 |
| bon | real | `bon,` [Q4: previous_text /, next_text / jako ve slově bonbon] | bonbon (json:dataset-syllable) | main (Czech respelling), retake (take `bon__main__t2.mp3`) | transcript check (two local recognizers): FAIL both_recognizers_disagree (heard `born` / `b ʌ n`); user-rated 5★ 2026-10-05 (Prompt 23; the first take `bon__main__t1.mp3` 3★ "bo", n almost unhearable) | transcript check failed, IPA text equals the main text -> retake; both failed the check -> user chose the retake | bon.mp3 |
| bot | real | `bot,` [Q4: previous_text /, next_text / jako ve slově robot] | robot (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bot.mp3 |
| bouk | real | `bouk,` [Q4: previous_text /, next_text / jako ve slově klobouk] | klobouk (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bouk.mp3 |
| br | real | `br,` [Q4: previous_text /, next_text / jako ve slově bobr] | bobr (authored-final) | vowel-less pick -> main (ratio 1.026) | gross-defect check only: PASS | voiced-span pick: ratio 1.026 -> main | br.mp3 |
| brad | real | `brat,` [Q4: previous_text /, next_text / jako ve slově zábradlí] | zábradlí (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | brad.mp3 |
| bram | real | `bram,` [Q4: previous_text /, next_text / jako ve slově brambora] | brambora (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bram.mp3 |
| bran | real | `bran,` [Q4: previous_text /, next_text / jako ve slově branka] | branka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bran.mp3 |
| bro | real | `bro,` [Q4: previous_text /, next_text / jako ve slově brokolice] | brokolice (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bro.mp3 |
| bros | real | `bros,` [Q4: previous_text /, next_text / jako ve slově broskev] | broskev (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bros.mp3 |
| brus | real | `brus,` [Q4: previous_text /, next_text / jako ve slově ubrus] | ubrus (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | brus.mp3 |
| brá | real | `brá,` [Q4: previous_text /, next_text / jako ve slově brána] | brána (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | braa.mp3 |
| brý | real | `brí,` [Q4: previous_text /, next_text / jako ve slově brýle] | brýle (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | bryy.mp3 |
| bu | real | `bu,` [Q4: previous_text /, next_text / jako ve slově cibule] | cibule (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bu.mp3 |
| bun | real | `bun,` [Q4: previous_text /, next_text / jako ve slově bunda] | bunda (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | bun.mp3 |
| bur | real | `bur,` [Q4: previous_text /, next_text / jako ve slově hamburger] | hamburger (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bur.mp3 |
| bus | real | `bus,` [Q4: previous_text /, next_text / jako ve slově glóbus] | glóbus (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bus.mp3 |
| buť | real | `buť,` [Q4: previous_text /, next_text / jako ve slově labuť] | labuť (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | butx.mp3 |
| bál | real | `bál,` [Q4: previous_text /, next_text / jako ve slově obálka] | obálka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | baal.mp3 |
| bář | real | `bář,` [Q4: previous_text /, next_text / jako ve slově rybář] | rybář (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | baarx.mp3 |
| bí | real | `bí,` [Q4: previous_text /, next_text / jako ve slově chlebíček] | chlebíček (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bii.mp3 |
| bík | real | `bík,` [Q4: previous_text /, next_text / jako ve slově hřebík] | hřebík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | biik.mp3 |
| bíz | real | `bís,` [Q4: previous_text /, next_text / jako ve slově rybíz] | rybíz (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | biiz.mp3 |
| býk | real | `bík,` [Q4: previous_text /, next_text / jako ve slově hřebík] | hřebík (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | byyk.mp3 |
| bě | real | `bje,` [Q4: previous_text /, next_text / jako ve slově hrábě] | hrábě (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | bex.mp3 |
| bři | real | `bři,` [Q4: previous_text /, next_text / jako ve slově břicho] | břicho (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | brxi.mp3 |
| bří | real | `bří,` [Q4: previous_text /, next_text / jako ve slově žebřík] | žebřík (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | brxii.mp3 |
| cad | real | `tsat,` [Q4: previous_text /, next_text / jako ve slově zrcadlo] | zrcadlo (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS warn:cutoff | transcript check failed -> IPA form; ipa_after_transcript passed | cad.mp3 |
| ce | real | `ce,` [Q4: previous_text /, next_text / jako ve slově ovce] | ovce (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ce.mp3 |
| ced | real | `tsɛt,` [Q4: previous_text /, next_text / jako ve slově cedník] | cedník (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS warn:cutoff | transcript check failed -> IPA form; ipa_after_transcript passed | ced.mp3 |
| cer | real | `cer,` [Q4: previous_text /, next_text / jako ve slově lucerna] | lucerna (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | cer.mp3 |
| ces | real | `ces,` [Q4: previous_text /, next_text / jako ve slově cesta] | cesta (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ces.mp3 |
| cez | real | `ces,` [Q4: previous_text /, next_text / jako ve slově princezna] | princezna (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cez.mp3 |
| cha | real | `cha,` [Q4: previous_text /, next_text / jako ve slově moucha] | moucha (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cha.mp3 |
| chař | real | `chař,` [Q4: previous_text /, next_text / jako ve slově kuchař] | kuchař (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | charx.mp3 |
| chi | real | `chi,` [Q4: previous_text /, next_text / jako ve slově šachy] | šachy (authored-final) | main (Czech respelling) | gross-defect check only: PASS warn:cutoff | - | chi.mp3 |
| chl | real | `chl,` [Q4: previous_text /, next_text / jako ve slově šnorchl] | šnorchl (authored-final) | vowel-less pick -> main (ratio 1.067) | gross-defect check only: PASS | voiced-span pick: ratio 1.067 -> main | chl.mp3 |
| chle | real | `chle,` [Q4: previous_text /, next_text / jako ve slově chlebíček] | chlebíček (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | chle.mp3 |
| chleb | real | `chlep,` [Q4: previous_text /, next_text / jako ve slově chlebník] | chlebník (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chleb.mp3 |
| chléb | real | `chlép,` [Q4: previous_text /, next_text / jako ve slově chlebíček] | chlebíček (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chleeb.mp3 |
| cho | real | `cho,` [Q4: previous_text /, next_text / jako ve slově ucho] | ucho (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cho.mp3 |
| chod | real | `chot,` [Q4: previous_text /, next_text / jako ve slově záchod] | záchod (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chod.mp3 |
| chras | real | `chras,` [Q4: previous_text /, next_text / jako ve slově chrastítko] | chrastítko (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chras.mp3 |
| chy | real | `chi,` [Q4: previous_text /, next_text / jako ve slově šachy] | šachy (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | chy.mp3 |
| chát | real | `chát,` [Q4: previous_text /, next_text / jako ve slově sluchátka] | sluchátka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chaat.mp3 |
| chňap | real | `chňap,` [Q4: previous_text /, next_text / jako ve slově chňapka] | chňapka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chnxap.mp3 |
| chřest | real | `chřest,` [Q4: previous_text /, next_text / jako ve slově chřestýš] | chřestýš (authored-regen) | main (Czech respelling) | gross-defect check only: PASS | - | chrxest.mp3 |
| chů | real | `chú,` [Q4: previous_text /, next_text / jako ve slově chůdy] | chůdy (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chuo.mp3 |
| ci | real | `ci,` [Q4: previous_text /, next_text / jako ve slově policista] | policista (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | ci.mp3 |
| cih | real | `cich,` [Q4: previous_text /, next_text / jako ve slově cihla] | cihla (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | cih.mp3 |
| cir | real | `cir,` [Q4: previous_text /, next_text / jako ve slově cirkus] | cirkus (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cir.mp3 |
| cis | real | `cis,` [Q4: previous_text /, next_text / jako ve slově policista] | policista (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cis.mp3 |
| cit | real | `cit,` [Q4: previous_text /, next_text / jako ve slově pocit] | pocit (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | cit.mp3 |
| cop | real | `cop,` [Q4: previous_text /, next_text / jako ve slově copánek] | copánek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cop.mp3 |
| cu | real | `cu,` [Q4: previous_text /, next_text / jako ve slově cuketa] | cuketa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | cu.mp3 |
| cuk | real | `cuk,` [Q4: previous_text /, next_text / jako ve slově cukřenka] | cukřenka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cuk.mp3 |
| cvr | real | `tsvr̩,` [Q4: previous_text /, next_text / jako ve slově cvrček] | cvrček (authored-final) | vowel-less pick -> ipa (ratio 0.649) | gross-defect check only: PASS | voiced-span pick: ratio 0.649 -> ipa | cvr.mp3 |
| cyk | real | `cik,` [Q4: previous_text /, next_text / jako ve slově cyklista] | cyklista (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cyk.mp3 |
| cív | real | `cíf,` [Q4: previous_text /, next_text / jako ve slově cívka] | cívka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ciiv.mp3 |
| da | real | `da,` [Q4: previous_text /, next_text / jako ve slově bunda] | bunda (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | da.mp3 |
| dač | real | `dač,` [Q4: previous_text /, next_text / jako ve slově autosedačka] | autosedačka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | dacx.mp3 |
| de | real | `de,` [Q4: previous_text /, next_text / jako ve slově dědeček] | dědeček (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | de.mp3 |
| dej | real | `dej,` [Q4: previous_text /, next_text / jako ve slově prodej] | prodej (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dej.mp3 |
| del | real | `del,` [Q4: previous_text /, next_text / jako ve slově náhrdelník] | náhrdelník (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | del.mp3 |
| den | real | `den,` [Q4: previous_text /, next_text / jako ve slově jízdenka] | jízdenka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | den.mp3 |
| dešt | real | `dešt,` [Q4: previous_text /, next_text / jako ve slově deštník] | deštník (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | desxt.mp3 |
| di | real | `ďɪ,` [Q4: previous_text /, next_text / jako ve slově hodiny] | hodiny (authored-final) | IPA (hybrid IPA) | gross-defect check only: PASS | - | di.mp3 |
| din | real | `ďɪn,` [Q4: previous_text /, next_text / jako ve slově hodinky] | hodinky (authored-final) | IPA (hybrid IPA) | gross-defect check only: PASS | - | din.mp3 |
| dio | real | `ďɪo,` [Q4: previous_text /, next_text / jako ve slově hodiny] | hodiny (authored-regen-forced, forced) | IPA (hybrid IPA) | gross-defect check only: PASS; user-rated 5★ 2026-10-05 (Prompt 23) | - | dio.mp3 |
| dič | real | `ďɪtʃ,` [Q4: previous_text /, next_text / jako ve slově řidič] | řidič (authored-final) | IPA (hybrid IPA) | gross-defect check only: PASS | - | dicx.mp3 |
| dlaž | real | `dlaš,` [Q4: previous_text /, next_text / jako ve slově dlaždice] | dlaždice (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dlazx.mp3 |
| do | real | `do,` [Q4: previous_text /, next_text / jako ve slově hnízdo] | hnízdo (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | do.mp3 |
| dort | real | `dort,` [Q4: previous_text /, next_text / jako ve slově dorty] | dorty (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dort.mp3 |
| dra | real | `dra,` [Q4: previous_text /, next_text / jako ve slově nádraží] | nádraží (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dra.mp3 |
| drak | real | `drak,` [Q4: previous_text /, next_text / jako ve slově draka] | draka (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | drak.mp3 |
| du | real | `du,` [Q4: previous_text /, next_text / jako ve slově vzducholoď] | vzducholoď (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | du.mp3 |
| duch | real | `duch,` [Q4: previous_text /, next_text / jako ve slově vzducholoď] | vzducholoď (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | duch.mp3 |
| dud | real | `dut,` [Q4: previous_text /, next_text / jako ve slově dudlík] | dudlík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dud.mp3 |
| dve | real | `dve,` [Q4: previous_text /, next_text / jako ve slově dveře] | dveře (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dve.mp3 |
| dvič | real | `dvič,` [Q4: previous_text /, next_text / jako ve slově sendvič] | sendvič (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dvicx.mp3 |
| dy | real | `dy,` [Q4: previous_text /, next_text / jako ve slově dudy] | dudy (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | dy.mp3 |
| dá | real | `dá,` [Q4: previous_text /, next_text / jako ve slově padák] | padák (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | daa.mp3 |
| dák | real | `dák,` [Q4: previous_text /, next_text / jako ve slově padák] | padák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | daak.mp3 |
| dít | real | `ďiːt,` [Q4: previous_text /, next_text / jako ve slově řidítka] | řidítka (json:dataset-syllable) | IPA (hybrid IPA) | gross-defect check only: PASS | - | diit.mp3 |
| dív | real | `ďiːf,` [Q4: previous_text /, next_text / jako ve slově dívka] | dívka (json:dataset-syllable) | IPA (hybrid IPA) | gross-defect check only: PASS | - | diiv.mp3 |
| dú | real | `dú,` [Q4: previous_text /, next_text / jako ve slově medúza] | medúza (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | duu.mp3 |
| dý | real | `dý,` [Q4: previous_text /, next_text / jako ve slově mladý] | mladý (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | dyy.mp3 |
| dým | real | `dým,` [Q4: previous_text /, next_text / jako ve slově zadýmit] | zadýmit (authored-stage2a) | main (Czech respelling) | gross-defect check only: PASS | - | dyym.mp3 |
| dě | real | `dě,` [Q4: previous_text /, next_text / jako ve slově anděl] | anděl (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | dex.mp3 |
| děj | real | `děj,` [Q4: previous_text /, next_text / jako ve slově čarodějnice] | čarodějnice (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | dexj.mp3 |
| děl | real | `děl,` [Q4: previous_text /, next_text / jako ve slově anděl] | anděl (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | dexl.mp3 |
| dře | real | `dře,` [Q4: previous_text /, next_text / jako ve slově dřevo] | dřevo (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | drxe.mp3 |
| dům | real | `dúm,` [Q4: previous_text /, next_text / jako ve slově důmyslný] | důmyslný (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | duom.mp3 |
| džbán | real | `džbán,` [Q4: previous_text /, next_text / jako ve slově džbánek] | džbánek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | dzxbaan.mp3 |
| džus | real | `džus,` [Q4: previous_text /, next_text / jako ve slově džusík] | džusík (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dzxus.mp3 |
| es | real | `es,` [Q4: previous_text /, next_text / jako ve slově les] | les (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | es.mp3 |
| fa | real | `fa,` [Q4: previous_text /, next_text / jako ve slově harfa] | harfa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fa.mp3 |
| far | real | `far,` [Q4: previous_text /, next_text / jako ve slově farma] | farma (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | far.mp3 |
| fi | real | `fi,` [Q4: previous_text /, next_text / jako ve slově fixa] | fixa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | fi.mp3 |
| fial | real | `fial,` [Q4: previous_text /, next_text / jako ve slově fialka] | fialka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fial.mp3 |
| flét | real | `flét,` [Q4: previous_text /, next_text / jako ve slově flétna] | flétna (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | fleet.mp3 |
| fo | real | `fo,` [Q4: previous_text /, next_text / jako ve slově semafor] | semafor (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fo.mp3 |
| fon | real | `fon,` [Q4: previous_text /, next_text / jako ve slově telefon] | telefon (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fon.mp3 |
| for | real | `for,` [Q4: previous_text /, next_text / jako ve slově semafor] | semafor (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | for.mp3 |
| fr | real | `fr,` [Q4: previous_text /, next_text / jako ve slově kufr] | kufr (authored-final) | vowel-less pick -> main (ratio 1.216) | gross-defect check only: PASS | voiced-span pick: ratio 1.216 -> main | fr.mp3 |
| fret | real | `fret,` [Q4: previous_text /, next_text / jako ve slově fretka] | fretka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fret.mp3 |
| fén | real | `fén,` [Q4: previous_text /, next_text / jako ve slově fény] | fény (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | feen.mp3 |
| fík | real | `fík,` [Q4: previous_text /, next_text / jako ve slově fíky] | fíky (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fiik.mp3 |
| fín | real | `fín,` [Q4: previous_text /, next_text / jako ve slově delfín] | delfín (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fiin.mp3 |
| ga | real | `ga,` [Q4: previous_text /, next_text / jako ve slově garáž] | garáž (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ga.mp3 |
| ge | real | `ge,` [Q4: previous_text /, next_text / jako ve slově legenda] | legenda (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ge.mp3 |
| ger | real | `ger,` [Q4: previous_text /, next_text / jako ve slově gerbera] | gerbera (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ger.mp3 |
| gló | real | `gló,` [Q4: previous_text /, next_text / jako ve slově glóbus] | glóbus (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | gloo.mp3 |
| gon | real | `gon,` [Q4: previous_text /, next_text / jako ve slově vagon] | vagon (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | gon.mp3 |
| gong | real | `gonk,` [Q4: previous_text /, next_text / jako ve slově gongy] | gongy (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | gong.mp3 |
| gr | real | `gr,` [Q4: previous_text /, next_text / jako ve slově bagr] | bagr (authored-final) | vowel-less pick -> main (ratio 1.081) | gross-defect check only: PASS | voiced-span pick: ratio 1.081 -> main | gr.mp3 |
| grep | real | `grep,` [Q4: previous_text /, next_text / jako ve slově grepy] | grepy (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | grep.mp3 |
| gril | real | `gril,` [Q4: previous_text /, next_text / jako ve slově grilovat] | grilovat (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | gril.mp3 |
| gu | real | `ɡu,` [Q4: previous_text /, next_text / jako ve slově jogurt] | jogurt (dataset-substring) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | gu.mp3 |
| gurt | real | `gurt,` [Q4: previous_text /, next_text / jako ve slově jogurt] | jogurt (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | gurt.mp3 |
| ha | real | `ha,` [Q4: previous_text /, next_text / jako ve slově duha] | duha (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ha.mp3 |
| had | real | `hat,` [Q4: previous_text /, next_text / jako ve slově hady] | hady (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | had.mp3 |
| ham | real | `ham,` [Q4: previous_text /, next_text / jako ve slově hamaka] | hamaka (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ham.mp3 |
| har | real | `har,` [Q4: previous_text /, next_text / jako ve slově harfa] | harfa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | har.mp3 |
| hač | real | `hač,` [Q4: previous_text /, next_text / jako ve slově šlehačka] | šlehačka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hacx.mp3 |
| hel | real | `hel,` [Q4: previous_text /, next_text / jako ve slově helma] | helma (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hel.mp3 |
| hev | real | `hef,` [Q4: previous_text /, next_text / jako ve slově láhev] | láhev (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | hev.mp3 |
| heň | real | `heň,` [Q4: previous_text /, next_text / jako ve slově oheň] | oheň (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | henx.mp3 |
| hla | real | `hla,` [Q4: previous_text /, next_text / jako ve slově cihla] | cihla (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hla.mp3 |
| hled | real | `hlet,` [Q4: previous_text /, next_text / jako ve slově dalekohled] | dalekohled (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hled.mp3 |
| hníz | real | `hnís,` [Q4: previous_text /, next_text / jako ve slově hnízdo] | hnízdo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hniiz.mp3 |
| ho | real | `ho,` [Q4: previous_text /, next_text / jako ve slově jahoda] | jahoda (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ho.mp3 |
| hou | real | `ɦou̯,` [Q4: previous_text /, next_text / jako ve slově houba] | houba (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | hou.mp3 |
| hous | real | `hous,` [Q4: previous_text /, next_text / jako ve slově housle] | housle (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hous.mp3 |
| hož | real | `hoš,` [Q4: previous_text /, next_text / jako ve slově rohožka] | rohožka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hozx.mp3 |
| hr | real | `hr,` [Q4: previous_text /, next_text / jako ve slově náhrdelník] | náhrdelník (authored-final) | vowel-less pick -> main (ratio 0.956) | gross-defect check only: PASS | voiced-span pick: ratio 0.956 -> main | hr.mp3 |
| hra | real | `hra,` [Q4: previous_text /, next_text / jako ve slově zahrada] | zahrada (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | hra.mp3 |
| hrad | real | `hrat,` [Q4: previous_text /, next_text / jako ve slově zahrada] | zahrada (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hrad.mp3 |
| hroch | real | `hroch,` [Q4: previous_text /, next_text / jako ve slově hrocha] | hrocha (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hroch.mp3 |
| hroz | real | `hros,` [Q4: previous_text /, next_text / jako ve slově hrozny] | hrozny (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hroz.mp3 |
| hruš | real | `hruš,` [Q4: previous_text /, next_text / jako ve slově hruška] | hruška (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hrusx.mp3 |
| hrá | real | `hrá,` [Q4: previous_text /, next_text / jako ve slově hrábě] | hrábě (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hraa.mp3 |
| hu | real | `hu,` [Q4: previous_text /, next_text / jako ve slově sněhulák] | sněhulák (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hu.mp3 |
| hvěz | real | `hvjes,` [Q4: previous_text /, next_text / jako ve slově souhvězdí] | souhvězdí (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hvexz.mp3 |
| hy | real | `hi,` [Q4: previous_text /, next_text / jako ve slově váhy] | váhy (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hy.mp3 |
| hár | real | `ɦaːr,` [Q4: previous_text /, next_text / jako ve slově pohár] | pohár (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | haar.mp3 |
| hře | real | `hře,` [Q4: previous_text /, next_text / jako ve slově hřeben] | hřeben (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | hrxe.mp3 |
| hřiš | real | `hřiš,` [Q4: previous_text /, next_text / jako ve slově hřiště] | hřiště (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | hrxisx.mp3 |
| ig | real | `ik,` [Q4: previous_text /, next_text / jako ve slově jazyk] | jazyk (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | ig.mp3 |
| in | real | `in,` [Q4: previous_text /, next_text / jako ve slově činka] | činka (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | in.mp3 |
| ja | real | `ja,` [Q4: previous_text /, next_text / jako ve slově jazyk] | jazyk (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ja.mp3 |
| je | real | `je,` [Q4: previous_text /, next_text / jako ve slově obojek] | obojek (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | je.mp3 |
| jed | real | `jet,` [Q4: previous_text /, next_text / jako ve slově medvěd] | medvěd (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jed.mp3 |
| jeh | real | `jɛch,` [Q4: previous_text /, next_text / jako ve slově jehla] | jehla (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | jeh.mp3 |
| jek | real | `jek,` [Q4: previous_text /, next_text / jako ve slově obojek] | obojek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jek.mp3 |
| jes | real | `jes,` [Q4: previous_text /, next_text / jako ve slově závěs] | závěs (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jes.mp3 |
| ješ | real | `ješ,` [Q4: previous_text /, next_text / jako ve slově věž] | věž (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jesx.mp3 |
| jo | real | `jo,` [Q4: previous_text /, next_text / jako ve slově majonéza] | majonéza (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jo.mp3 |
| ják | real | `ják,` [Q4: previous_text /, next_text / jako ve slově maják] | maják (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jaak.mp3 |
| jíc | real | `jíc,` [Q4: previous_text /, next_text / jako ve slově zajíc] | zajíc (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jiic.mp3 |
| jíz | real | `jís,` [Q4: previous_text /, next_text / jako ve slově jízdenka] | jízdenka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jiiz.mp3 |
| jíř | real | `jíř,` [Q4: previous_text /, next_text / jako ve slově vějíř] | vějíř (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | jiirx.mp3 |
| ka | real | `ka,` [Q4: previous_text /, next_text / jako ve slově deka] | deka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ka.mp3 |
| kach | real | `kach,` [Q4: previous_text /, next_text / jako ve slově kachna] | kachna (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kach.mp3 |
| kal | real | `kal,` [Q4: previous_text /, next_text / jako ve slově eskalátor] | eskalátor (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kal.mp3 |
| kan | real | `kan,` [Q4: previous_text /, next_text / jako ve slově tukan] | tukan (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kan.mp3 |
| ke | real | `ke,` [Q4: previous_text /, next_text / jako ve slově cuketa] | cuketa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ke.mp3 |
| kej | real | `kej,` [Q4: previous_text /, next_text / jako ve slově žokej] | žokej (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kej.mp3 |
| kev | real | `kef,` [Q4: previous_text /, next_text / jako ve slově mrkev] | mrkev (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kev.mp3 |
| kla | real | `kla,` [Q4: previous_text /, next_text / jako ve slově sklad] | sklad (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kla.mp3 |
| klo | real | `klo,` [Q4: previous_text /, next_text / jako ve slově klobouk] | klobouk (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | klo.mp3 |
| klíč | real | `klíč,` [Q4: previous_text /, next_text / jako ve slově paklíč] | paklíč (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kliicx.mp3 |
| kni | real | `kni,` [Q4: previous_text /, next_text / jako ve slově kniha] | kniha (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kni.mp3 |
| ko | real | `ko,` [Q4: previous_text /, next_text / jako ve slově oko] | oko (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ko.mp3 |
| kol | real | `kol,` [Q4: previous_text /, next_text / jako ve slově čtyřkolka] | čtyřkolka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | kol.mp3 |
| kos | real | `kos,` [Q4: previous_text /, next_text / jako ve slově kostel] | kostel (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kos.mp3 |
| koust | real | `koust,` [Q4: previous_text /, next_text / jako ve slově inkoust] | inkoust (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | koust.mp3 |
| koč | real | `koč,` [Q4: previous_text /, next_text / jako ve slově kočka] | kočka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kocx.mp3 |
| koš | real | `koš,` [Q4: previous_text /, next_text / jako ve slově košík] | košík (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kosx.mp3 |
| kra | real | `kra,` [Q4: previous_text /, next_text / jako ve slově krabice] | krabice (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kra.mp3 |
| krá | real | `krá,` [Q4: previous_text /, next_text / jako ve slově kráva] | kráva (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kraa.mp3 |
| král | real | `král,` [Q4: previous_text /, next_text / jako ve slově královna] | královna (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kraal.mp3 |
| ku | real | `ku,` [Q4: previous_text /, next_text / jako ve slově cirkus] | cirkus (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ku.mp3 |
| kur | real | `kur,` [Q4: previous_text /, next_text / jako ve slově okurka] | okurka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kur.mp3 |
| kus | real | `kus,` [Q4: previous_text /, next_text / jako ve slově cirkus] | cirkus (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kus.mp3 |
| kvič | real | `kvič,` [Q4: previous_text /, next_text / jako ve slově ředkvička] | ředkvička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kvicx.mp3 |
| kvě | real | `kvje,` [Q4: previous_text /, next_text / jako ve slově rozkvět] | rozkvět (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kvex.mp3 |
| ky | real | `ki,` [Q4: previous_text /, next_text / jako ve slově nůžky] | nůžky (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ky.mp3 |
| ká | real | `ká,` [Q4: previous_text /, next_text / jako ve slově avokádo] | avokádo (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kaa.mp3 |
| křes | real | `křes,` [Q4: previous_text /, next_text / jako ve slově křeslo] | křeslo (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | krxes.mp3 |
| kůň | real | `kúň,` [Q4: previous_text /, next_text / jako ve slově kuňkat] | kuňkat (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kuonx.mp3 |
| la | real | `la,` [Q4: previous_text /, next_text / jako ve slově pila] | pila (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | la.mp3 |
| lam | real | `lam,` [Q4: previous_text /, next_text / jako ve slově lampa] | lampa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lam.mp3 |
| lant | real | `lant,` [Q4: previous_text /, next_text / jako ve slově volant] | volant (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lant.mp3 |
| le | real | `le,` [Q4: previous_text /, next_text / jako ve slově brýle] | brýle (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | le.mp3 |
| lec | real | `lec,` [Q4: previous_text /, next_text / jako ve slově palec] | palec (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lec.mp3 |
| led | real | `let,` [Q4: previous_text /, next_text / jako ve slově dalekohled] | dalekohled (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | led.mp3 |
| lej | real | `lej,` [Q4: previous_text /, next_text / jako ve slově olej] | olej (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | lej.mp3 |
| lek | real | `lek,` [Q4: previous_text /, next_text / jako ve slově oblek] | oblek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lek.mp3 |
| len | real | `len,` [Q4: previous_text /, next_text / jako ve slově jelen] | jelen (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | len.mp3 |
| leon | real | `leon,` [Q4: previous_text /, next_text / jako ve slově chameleon] | chameleon (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | leon.mp3 |
| ler | real | `ler,` [Q4: previous_text /, next_text / jako ve slově celer] | celer (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | ler.mp3 |
| les | real | `les,` [Q4: previous_text /, next_text / jako ve slově blesk] | blesk (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | les.mp3 |
| lev | real | `lef,` [Q4: previous_text /, next_text / jako ve slově televize] | televize (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lev.mp3 |
| leň | real | `leň,` [Q4: previous_text /, next_text / jako ve slově tuleň] | tuleň (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lenx.mp3 |
| li | real | `li,` [Q4: previous_text /, next_text / jako ve slově oliva] | oliva (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | li.mp3 |
| lis | real | `lis,` [Q4: previous_text /, next_text / jako ve slově cyklista] | cyklista (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lis.mp3 |
| list | real | `list,` [Q4: previous_text /, next_text / jako ve slově cyklista] | cyklista (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | list.mp3 |
| lič | real | `lič,` [Q4: previous_text /, next_text / jako ve slově vidlička] | vidlička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | licx.mp3 |
| liš | real | `liš,` [Q4: previous_text /, next_text / jako ve slově liška] | liška (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lisx.mp3 |
| lo | real | `lo,` [Q4: previous_text /, next_text / jako ve slově dělo] | dělo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lo.mp3 |
| lok | real | `lok,` [Q4: previous_text /, next_text / jako ve slově žralok] | žralok (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lok.mp3 |
| los | real | `los,` [Q4: previous_text /, next_text / jako ve slově kolos] | kolos (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | los.mp3 |
| lot | real | `lot,` [Q4: previous_text /, next_text / jako ve slově pilot] | pilot (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lot.mp3 |
| lou | real | `lou,` [Q4: previous_text /, next_text / jako ve slově meloun] | meloun (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lou.mp3 |
| loud | real | `lout,` [Q4: previous_text /, next_text / jako ve slově velbloud] | velbloud (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | loud.mp3 |
| loun | real | `loun,` [Q4: previous_text /, next_text / jako ve slově meloun] | meloun (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | loun.mp3 |
| lout | real | `lout,` [Q4: previous_text /, next_text / jako ve slově velbloud] | velbloud (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lout.mp3 |
| lov | real | `lof,` [Q4: previous_text /, next_text / jako ve slově čelovka] | čelovka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lov.mp3 |
| loď | real | `loť,` [Q4: previous_text /, next_text / jako ve slově vzducholoď] | vzducholoď (dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | lodx.mp3 |
| lu | real | `lu,` [Q4: previous_text /, next_text / jako ve slově člun] | člun (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lu.mp3 |
| lub | real | `lup,` [Q4: previous_text /, next_text / jako ve slově holub] | holub (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lub.mp3 |
| lud | real | `lut,` [Q4: previous_text /, next_text / jako ve slově žalud] | žalud (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lud.mp3 |
| luk | real | `luk,` [Q4: previous_text /, next_text / jako ve slově kluk] | kluk (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | luk.mp3 |
| lus | real | `lus,` [Q4: previous_text /, next_text / jako ve slově lustr] | lustr (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lus.mp3 |
| ly | real | `li,` [Q4: previous_text /, next_text / jako ve slově oliva] | oliva (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ly.mp3 |
| lá | real | `lá,` [Q4: previous_text /, next_text / jako ve slově čokoláda] | čokoláda (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | laa.mp3 |
| lák | real | `lák,` [Q4: previous_text /, next_text / jako ve slově čmelák] | čmelák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | laak.mp3 |
| lát | real | `lát,` [Q4: previous_text /, next_text / jako ve slově salát] | salát (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | laat.mp3 |
| láč | real | `láč,` [Q4: previous_text /, next_text / jako ve slově koláč] | koláč (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | laacx.mp3 |
| láš | real | `láš,` [Q4: previous_text /, next_text / jako ve slově guláš] | guláš (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | laasx.mp3 |
| lé | real | `lé,` [Q4: previous_text /, next_text / jako ve slově želé] | želé (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lee.mp3 |
| lér | real | `lér,` [Q4: previous_text /, next_text / jako ve slově žonglér] | žonglér (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | leer.mp3 |
| lév | real | `léf,` [Q4: previous_text /, next_text / jako ve slově polévka] | polévka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | leev.mp3 |
| lí | real | `lí,` [Q4: previous_text /, next_text / jako ve slově uhlí] | uhlí (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lii.mp3 |
| lík | real | `lík,` [Q4: previous_text /, next_text / jako ve slově balík] | balík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | liik.mp3 |
| lís | real | `lís,` [Q4: previous_text /, next_text / jako ve slově čtyřlístek] | čtyřlístek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | liis.mp3 |
| líř | real | `líř,` [Q4: previous_text /, next_text / jako ve slově talíř] | talíř (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | liirx.mp3 |
| lón | real | `lón,` [Q4: previous_text /, next_text / jako ve slově balón] | balón (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | loon.mp3 |
| lú | real | `lú,` [Q4: previous_text /, next_text / jako ve slově stolů] | stolů (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | luu.mp3 |
| lží | real | `lží,` [Q4: previous_text /, next_text / jako ve slově lžíce] | lžíce (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | lzxii.mp3 |
| ma | real | `ma,` [Q4: previous_text /, next_text / jako ve slově guma] | guma (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ma.mp3 |
| mag | real | `mak,` [Q4: previous_text /, next_text / jako ve slově magnet] | magnet (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mag.mp3 |
| mat | real | `mat,` [Q4: previous_text /, next_text / jako ve slově automat] | automat (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mat.mp3 |
| maš | real | `maš,` [Q4: previous_text /, next_text / jako ve slově mašle] | mašle (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | masx.mp3 |
| me | real | `me,` [Q4: previous_text /, next_text / jako ve slově pomeranč] | pomeranč (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | me.mp3 |
| med | real | `met,` [Q4: previous_text /, next_text / jako ve slově kometa] | kometa (authored-stage2a) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | med.mp3 |
| mek | real | `mek,` [Q4: previous_text /, next_text / jako ve slově zámek] | zámek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mek.mp3 |
| men | real | `men,` [Q4: previous_text /, next_text / jako ve slově kámen] | kámen (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | men.mp3 |
| meč | real | `meč,` [Q4: previous_text /, next_text / jako ve slově mečík] | mečík (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mecx.mp3 |
| mi | real | `mɪ,` [Q4: previous_text /, next_text / jako ve slově gumička] | gumička (dataset-substring) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | mi.mp3 |
| mik | real | `mik,` [Q4: previous_text /, next_text / jako ve slově komik] | komik (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mik.mp3 |
| min | real | `min,` [Q4: previous_text /, next_text / jako ve slově miminko] | miminko (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | min.mp3 |
| mis | real | `mis,` [Q4: previous_text /, next_text / jako ve slově miska] | miska (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mis.mp3 |
| mič | real | `mič,` [Q4: previous_text /, next_text / jako ve slově gumička] | gumička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | micx.mp3 |
| mlé | real | `mlé,` [Q4: previous_text /, next_text / jako ve slově mléko] | mléko (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mlee.mp3 |
| mlýn | real | `mlín,` [Q4: previous_text /, next_text / jako ve slově mlýnek] | mlýnek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mlyyn.mp3 |
| mo | real | `mo,` [Q4: previous_text /, next_text / jako ve slově pyžamo] | pyžamo (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mo.mp3 |
| moc | real | `moc,` [Q4: previous_text /, next_text / jako ve slově nemocnice] | nemocnice (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | moc.mp3 |
| most | real | `most,` [Q4: previous_text /, next_text / jako ve slově mostek] | mostek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | most.mp3 |
| mou | real | `mou,` [Q4: previous_text /, next_text / jako ve slově moucha] | moucha (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mou.mp3 |
| moř | real | `moř,` [Q4: previous_text /, next_text / jako ve slově námořník] | námořník (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | morx.mp3 |
| mr | real | `mr,` [Q4: previous_text /, next_text / jako ve slově zmrzlina] | zmrzlina (authored-final) | vowel-less pick -> main (ratio 1.054) | gross-defect check only: PASS | voiced-span pick: ratio 1.054 -> main | mr.mp3 |
| mra | real | `mra,` [Q4: previous_text /, next_text / jako ve slově zamračený] | zamračený (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mra.mp3 |
| mrak | real | `mrak,` [Q4: previous_text /, next_text / jako ve slově mrakodrap] | mrakodrap (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mrak.mp3 |
| mrož | real | `mroš,` [Q4: previous_text /, next_text / jako ve slově mroži] | mroži (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | mrozx.mp3 |
| muš | real | `muš,` [Q4: previous_text /, next_text / jako ve slově mušle] | mušle (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | musx.mp3 |
| my | real | `mi,` [Q4: previous_text /, next_text / jako ve slově umyvadlo] | umyvadlo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | my.mp3 |
| myš | real | `miš,` [Q4: previous_text /, next_text / jako ve slově domyšlený] | domyšlený (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mysx.mp3 |
| más | real | `más,` [Q4: previous_text /, next_text / jako ve slově máslo] | máslo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | maas.mp3 |
| mýd | real | `mít,` [Q4: previous_text /, next_text / jako ve slově mýdlo] | mýdlo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | myyd.mp3 |
| mě | real | `mě,` [Q4: previous_text /, next_text / jako ve slově teploměr] | teploměr (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | mex.mp3 |
| měr | real | `měr,` [Q4: previous_text /, next_text / jako ve slově teploměr] | teploměr (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mexr.mp3 |
| na | real | `na,` [Q4: previous_text /, next_text / jako ve slově vana] | vana (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | na.mp3 |
| nas | real | `nas,` [Q4: previous_text /, next_text / jako ve slově ananas] | ananas (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | nas.mp3 |
| naut | real | `naut,` [Q4: previous_text /, next_text / jako ve slově astronaut] | astronaut (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | naut.mp3 |
| ne | real | `ne,` [Q4: previous_text /, next_text / jako ve slově planeta] | planeta (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ne.mp3 |
| nec | real | `nec,` [Q4: previous_text /, next_text / jako ve slově hrnec] | hrnec (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nec.mp3 |
| nek | real | `nek,` [Q4: previous_text /, next_text / jako ve slově hrnek] | hrnek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nek.mp3 |
| nen | real | `nen,` [Q4: previous_text /, next_text / jako ve slově panenka] | panenka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nen.mp3 |
| net | real | `net,` [Q4: previous_text /, next_text / jako ve slově magnet] | magnet (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | net.mp3 |
| neč | real | `neč,` [Q4: previous_text /, next_text / jako ve slově slunečnice] | slunečnice (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | necx.mp3 |
| ni | real | `ni,` [Q4: previous_text /, next_text / jako ve slově sklenice] | sklenice (json:dataset-syllable) | main (Czech respelling) (take `ni__main__t1.mp3`) | transcript check (two local recognizers): FAIL both_recognizers_disagree (heard `ny` / `n i5`); user-rated 5★ 2026-10-05 (Prompt 23; the check-passing IPA take `ɲɪ,` was also 5★ - the main-way file installed per Prompt 17: n/ň syllables use the main way) | transcript check failed -> IPA form passed; user decision: main-way file installed instead | ni.mp3 |
| nich | real | `nich,` [Q4: previous_text /, next_text / jako ve slově ženich] | ženich (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nich.mp3 |
| nič | real | `nič,` [Q4: previous_text /, next_text / jako ve slově lednička] | lednička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nicx.mp3 |
| no | real | `no,` [Q4: previous_text /, next_text / jako ve slově lano] | lano (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | no.mp3 |
| nol | real | `nol,` [Q4: previous_text /, next_text / jako ve slově hranolky] | hranolky (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nol.mp3 |
| noč | real | `noč,` [Q4: previous_text /, next_text / jako ve slově vánočka] | vánočka (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nocx.mp3 |
| nož | real | `noš,` [Q4: previous_text /, next_text / jako ve slově ponožka] | ponožka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nozx.mp3 |
| nuk | real | `nuk,` [Q4: previous_text /, next_text / jako ve slově nanuk] | nanuk (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nuk.mp3 |
| ny | real | `ny,` [Q4: previous_text /, next_text / jako ve slově hodiny] | hodiny (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | ny.mp3 |
| ná | real | `ná,` [Q4: previous_text /, next_text / jako ve slově limonáda] | limonáda (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | naa.mp3 |
| nán | real | `nán,` [Q4: previous_text /, next_text / jako ve slově banán] | banán (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | naan.mp3 |
| nát | real | `nát,` [Q4: previous_text /, next_text / jako ve slově špenát] | špenát (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | naat.mp3 |
| ník | real | `ník,` [Q4: previous_text /, next_text / jako ve slově cedník] | cedník (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | niik.mp3 |
| ně | real | `ně,` [Q4: previous_text /, next_text / jako ve slově dýně] | dýně (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nex.mp3 |
| něn | real | `ɲɛn,` [Q4: previous_text /, next_text / jako ve slově žíněnka] | žíněnka (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | nexn.mp3 |
| nůž | real | `núš,` [Q4: previous_text /, next_text / jako ve slově nůžky] | nůžky (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nuozx.mp3 |
| o | real | `o,` [Q4: previous_text /, next_text / jako ve slově cop] | cop (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | o.mp3 |
| ob | real | `op,` [Q4: previous_text /, next_text / jako ve slově cop] | cop (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ob.mp3 |
| oh | real | `och,` [Q4: previous_text /, next_text / jako ve slově batoh] | batoh (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | oh.mp3 |
| ok | real | `ok,` [Q4: previous_text /, next_text / jako ve slově žokej] | žokej (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ok.mp3 |
| or | real | `or,` [Q4: previous_text /, next_text / jako ve slově dort] | dort (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | or.mp3 |
| os | real | `os,` [Q4: previous_text /, next_text / jako ve slově los] | los (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | os.mp3 |
| ov | real | `of,` [Q4: previous_text /, next_text / jako ve slově ostrov] | ostrov (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ov.mp3 |
| oz | real | `os,` [Q4: previous_text /, next_text / jako ve slově los] | los (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | oz.mp3 |
| pa | real | `pa,` [Q4: previous_text /, next_text / jako ve slově lupa] | lupa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pa.mp3 |
| pan | real | `pan,` [Q4: previous_text /, next_text / jako ve slově župan] | župan (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pan.mp3 |
| pard | real | `part,` [Q4: previous_text /, next_text / jako ve slově gepard] | gepard (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pard.mp3 |
| pač | real | `pač,` [Q4: previous_text /, next_text / jako ve slově houpačka] | houpačka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pacx.mp3 |
| pe | real | `pɛ,` [Q4: previous_text /, next_text / jako ve slově trumpeta] | trumpeta (authored-final) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS warn:cutoff | transcript check failed -> IPA form; ipa_after_transcript passed | pe.mp3 |
| pes | real | `pes,` [Q4: previous_text /, next_text / jako ve slově pesimista] | pesimista (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pes.mp3 |
| pež | real | `peš,` [Q4: previous_text /, next_text / jako ve slově loupežník] | loupežník (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pezx.mp3 |
| pi | real | `pi,` [Q4: previous_text /, next_text / jako ve slově opice] | opice (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pi.mp3 |
| pid | real | `pit,` [Q4: previous_text /, next_text / jako ve slově slepit] | slepit (authored-stage2a) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pid.mp3 |
| pis | real | `pis,` [Q4: previous_text /, next_text / jako ve slově dopis] | dopis (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pis.mp3 |
| pla | real | `pla,` [Q4: previous_text /, next_text / jako ve slově náplast] | náplast (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pla.mp3 |
| plast | real | `plast,` [Q4: previous_text /, next_text / jako ve slově náplast] | náplast (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | plast.mp3 |
| plot | real | `plot,` [Q4: previous_text /, next_text / jako ve slově plotem] | plotem (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | plot.mp3 |
| po | real | `po,` [Q4: previous_text /, next_text / jako ve slově trampolína] | trampolína (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | po.mp3 |
| pol | real | `pol,` [Q4: previous_text /, next_text / jako ve slově trampolína] | trampolína (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pol.mp3 |
| pon | real | `pon,` [Q4: previous_text /, next_text / jako ve slově šampon] | šampon (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pon.mp3 |
| pos | real | `pos,` [Q4: previous_text /, next_text / jako ve slově postel] | postel (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pos.mp3 |
| pou | real | `pou,` [Q4: previous_text /, next_text / jako ve slově papoušek] | papoušek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pou.mp3 |
| pouch | real | `pouch,` [Q4: previous_text /, next_text / jako ve slově rampouch] | rampouch (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pouch.mp3 |
| poušť | real | `poušť,` [Q4: previous_text /, next_text / jako ve slově pouště] | pouště (authored-regen) | main (Czech respelling) | gross-defect check only: PASS | - | pousxtx.mp3 |
| pra | real | `pra,` [Q4: previous_text /, next_text / jako ve slově prase] | prase (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pra.mp3 |
| prin | real | `prin,` [Q4: previous_text /, next_text / jako ve slově princezna] | princezna (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | prin.mp3 |
| prs | real | `prs,` [Q4: previous_text /, next_text / jako ve slově náprstek] | náprstek (authored-final) | vowel-less pick -> main (ratio 1.058) | gross-defect check only: PASS | voiced-span pick: ratio 1.058 -> main | prs.mp3 |
| prst | real | `prst,` [Q4: previous_text /, next_text / jako ve slově náprstek] | náprstek (authored-final) | vowel-less pick -> main (ratio 1.017) | gross-defect check only: PASS | voiced-span pick: ratio 1.017 -> main | prst.mp3 |
| pták | real | `pták,` [Q4: previous_text /, next_text / jako ve slově ptáka] | ptáka (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ptaak.mp3 |
| py | real | `pi,` [Q4: previous_text /, next_text / jako ve slově dopis] | dopis (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | py.mp3 |
| pá | real | `pá,` [Q4: previous_text /, next_text / jako ve slově tulipán] | tulipán (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | paa.mp3 |
| pád | real | `pát,` [Q4: previous_text /, next_text / jako ve slově vodopád] | vodopád (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | paad.mp3 |
| pán | real | `pán,` [Q4: previous_text /, next_text / jako ve slově tulipán] | tulipán (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | paan.mp3 |
| pýr | real | `pír,` [Q4: previous_text /, next_text / jako ve slově netopýr] | netopýr (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pyyr.mp3 |
| ra | real | `ra,` [Q4: previous_text /, next_text / jako ve slově hora] | hora (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ra.mp3 |
| raj | real | `raj,` [Q4: previous_text /, next_text / jako ve slově rajče] | rajče (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | raj.mp3 |
| ram | real | `ram,` [Q4: previous_text /, next_text / jako ve slově náramek] | náramek (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ram.mp3 |
| ran | real | `ran,` [Q4: previous_text /, next_text / jako ve slově beran] | beran (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ran.mp3 |
| ranč | real | `ranč,` [Q4: previous_text /, next_text / jako ve slově pomeranč] | pomeranč (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rancx.mp3 |
| raon | real | `raon,` [Q4: previous_text /, next_text / jako ve slově faraon] | faraon (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | raon.mp3 |
| raz | real | `ras,` [Q4: previous_text /, next_text / jako ve slově obraz] | obraz (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | raz.mp3 |
| rač | real | `rač,` [Q4: previous_text /, next_text / jako ve slově naběračka] | naběračka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | racx.mp3 |
| rec | real | `rec,` [Q4: previous_text /, next_text / jako ve slově koberec] | koberec (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rec.mp3 |
| rek | real | `rek,` [Q4: previous_text /, next_text / jako ve slově dárek] | dárek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rek.mp3 |
| rel | real | `rel,` [Q4: previous_text /, next_text / jako ve slově orel] | orel (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rel.mp3 |
| rie | real | `rɪɛ,` [Q4: previous_text /, next_text / jako ve slově baterie] | baterie (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback, take `rie__ipa__t1.mp3`) | transcript check (two local recognizers): FAIL both_recognizers_disagree (heard `mrije` / `m a r i a`); user-rated 5★ 2026-10-05 (Prompt 23; the main take `rie,` 3★ "more like řije") | transcript check failed -> IPA form; both failed the check -> user chose the IPA file | rie.mp3 |
| rium | real | `rium,` [Q4: previous_text /, next_text / jako ve slově akvárium] | akvárium (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rium.mp3 |
| ro | real | `ro,` [Q4: previous_text /, next_text / jako ve slově pero] | pero (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ro.mp3 |
| roh | real | `roch,` [Q4: previous_text /, next_text / jako ve slově tvaroh] | tvaroh (authored-stage2a) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | roh.mp3 |
| ron | real | `ron,` [Q4: previous_text /, next_text / jako ve slově citron] | citron (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ron.mp3 |
| rou | real | `rou,` [Q4: previous_text /, next_text / jako ve slově ubrousek] | ubrousek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rou.mp3 |
| rov | real | `rof,` [Q4: previous_text /, next_text / jako ve slově ostrov] | ostrov (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rov.mp3 |
| rtěn | real | `rtěn,` [Q4: previous_text /, next_text / jako ve slově rtěnka] | rtěnka (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS warn:cutoff | - | rtexn.mp3 |
| ru | real | `ru,` [Q4: previous_text /, next_text / jako ve slově koruna] | koruna (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ru.mp3 |
| rus | real | `rus,` [Q4: previous_text /, next_text / jako ve slově ubrus] | ubrus (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rus.mp3 |
| ruč | real | `ruč,` [Q4: previous_text /, next_text / jako ve slově obruč] | obruč (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rucx.mp3 |
| ruš | real | `ruš,` [Q4: previous_text /, next_text / jako ve slově beruška] | beruška (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rusx.mp3 |
| ry | real | `ri,` [Q4: previous_text /, next_text / jako ve slově velryba] | velryba (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ry.mp3 |
| rys | real | `rɪs,` [Q4: previous_text /, next_text / jako ve slově obrys] | obrys (authored-regen) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS warn:cutoff | transcript check failed -> IPA form; ipa_after_transcript passed | rys.mp3 |
| rá | real | `rá,` [Q4: previous_text /, next_text / jako ve slově král] | král (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | raa.mp3 |
| rát | real | `rát,` [Q4: previous_text /, next_text / jako ve slově pirát] | pirát (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | raat.mp3 |
| ráž | real | `ráš,` [Q4: previous_text /, next_text / jako ve slově garáž] | garáž (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | raazx.mp3 |
| rý | real | `rí,` [Q4: previous_text /, next_text / jako ve slově brýle] | brýle (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ryy.mp3 |
| rů | real | `rú,` [Q4: previous_text /, next_text / jako ve slově borůvka] | borůvka (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ruo.mp3 |
| rův | real | `rúf,` [Q4: previous_text /, next_text / jako ve slově borůvka] | borůvka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ruov.mp3 |
| sa | real | `sa,` [Q4: previous_text /, next_text / jako ve slově husa] | husa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sa.mp3 |
| sau | real | `sau,` [Q4: previous_text /, next_text / jako ve slově sauna] | sauna (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sau.mp3 |
| scho | real | `scho,` [Q4: previous_text /, next_text / jako ve slově schody] | schody (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | scho.mp3 |
| se | real | `se,` [Q4: previous_text /, next_text / jako ve slově prase] | prase (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | se.mp3 |
| sek | real | `sek,` [Q4: previous_text /, next_text / jako ve slově pásek] | pásek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | sek.mp3 |
| sel | real | `sel,` [Q4: previous_text /, next_text / jako ve slově osel] | osel (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sel.mp3 |
| sen | real | `sen,` [Q4: previous_text /, next_text / jako ve slově housenka] | housenka (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sen.mp3 |
| sir | real | `syr,` [Q4: previous_text /, next_text / jako ve slově sirka] | sirka (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sir.mp3 |
| sič | real | `sič,` [Q4: previous_text /, next_text / jako ve slově hasič] | hasič (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sicx.mp3 |
| skle | real | `skle,` [Q4: previous_text /, next_text / jako ve slově sklenice] | sklenice (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | skle.mp3 |
| sklu | real | `sklu,` [Q4: previous_text /, next_text / jako ve slově skluzavka] | skluzavka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sklu.mp3 |
| skříň | real | `skříň,` [Q4: previous_text /, next_text / jako ve slově skříňka] | skříňka (authored-ni) | main (Czech respelling) | gross-defect check only: PASS | - | skrxiinx.mp3 |
| sle | real | `sle,` [Q4: previous_text /, next_text / jako ve slově brusle] | brusle (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sle.mp3 |
| slon | real | `slon,` [Q4: previous_text /, next_text / jako ve slově slony] | slony (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | slon.mp3 |
| slu | real | `slu,` [Q4: previous_text /, next_text / jako ve slově sluchátka] | sluchátka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | slu.mp3 |
| slun | real | `slun,` [Q4: previous_text /, next_text / jako ve slově slunce] | slunce (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | slun.mp3 |
| slán | real | `slán,` [Q4: previous_text /, next_text / jako ve slově slánka] | slánka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | slaan.mp3 |
| sně | real | `sně,` [Q4: previous_text /, next_text / jako ve slově sněhulák] | sněhulák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | snex.mp3 |
| so | real | `so,` [Q4: previous_text /, next_text / jako ve slově nosorožec] | nosorožec (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | so.mp3 |
| srd | real | `srt,` [Q4: previous_text /, next_text / jako ve slově srdce] | srdce (authored-final) | vowel-less pick -> main (ratio 0.913) | gross-defect check only: PASS | voiced-span pick: ratio 0.913 -> main | srd.mp3 |
| stan | real | `stan,` [Q4: previous_text /, next_text / jako ve slově zastane] | zastane (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | stan.mp3 |
| sto | real | `sto,` [Q4: previous_text /, next_text / jako ve slově stonožka] | stonožka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | sto.mp3 |
| stra | real | `stra,` [Q4: previous_text /, next_text / jako ve slově strašák] | strašák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | stra.mp3 |
| stroj | real | `stroj,` [Q4: previous_text /, next_text / jako ve slově ohňostroj] | ohňostroj (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | stroj.mp3 |
| strom | real | `strom,` [Q4: previous_text /, next_text / jako ve slově stromek] | stromek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | strom.mp3 |
| stě | real | `stě,` [Q4: previous_text /, next_text / jako ve slově zástěra] | zástěra (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | stex.mp3 |
| stře | real | `stře,` [Q4: previous_text /, next_text / jako ve slově střecha] | střecha (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | strxe.mp3 |
| stůl | real | `stúl,` [Q4: previous_text /, next_text / jako ve slově stolek] | stolek (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | stuol.mp3 |
| su | real | `su,` [Q4: previous_text /, next_text / jako ve slově sušenka] | sušenka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | su.mp3 |
| suk | real | `suk,` [Q4: previous_text /, next_text / jako ve slově sukně] | sukně (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | suk.mp3 |
| sve | real | `sve,` [Q4: previous_text /, next_text / jako ve slově svetr] | svetr (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sve.mp3 |
| svíč | real | `svíč,` [Q4: previous_text /, next_text / jako ve slově svíčka] | svíčka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sviicx.mp3 |
| sy | real | `si,` [Q4: previous_text /, next_text / jako ve slově vlasy] | vlasy (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sy.mp3 |
| sá | real | `sá,` [Q4: previous_text /, next_text / jako ve slově sáně] | sáně (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | saa.mp3 |
| síc | real | `síc,` [Q4: previous_text /, next_text / jako ve slově měsíc] | měsíc (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | siic.mp3 |
| sýr | real | `sír,` [Q4: previous_text /, next_text / jako ve slově sýra] | sýra (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | syyr.mp3 |
| ta | real | `ta,` [Q4: previous_text /, next_text / jako ve slově bota] | bota (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ta.mp3 |
| tad | real | `tat,` [Q4: previous_text /, next_text / jako ve slově letadlo] | letadlo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | tad.mp3 |
| tank | real | `tank,` [Q4: previous_text /, next_text / jako ve slově tankovat] | tankovat (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | tank.mp3 |
| tač | real | `tač,` [Q4: previous_text /, next_text / jako ve slově počítač] | počítač (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tacx.mp3 |
| taš | real | `taš,` [Q4: previous_text /, next_text / jako ve slově taška] | taška (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tasx.mp3 |
| te | real | `te,` [Q4: previous_text /, next_text / jako ve slově baterie] | baterie (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | te.mp3 |
| tec | real | `tec,` [Q4: previous_text /, next_text / jako ve slově štětec] | štětec (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tec.mp3 |
| tek | real | `tek,` [Q4: previous_text /, next_text / jako ve slově šátek] | šátek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tek.mp3 |
| tel | real | `tel,` [Q4: previous_text /, next_text / jako ve slově datel] | datel (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tel.mp3 |
| ten | real | `ten,` [Q4: previous_text /, next_text / jako ve slově prsten] | prsten (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ten.mp3 |
| tep | real | `tep,` [Q4: previous_text /, next_text / jako ve slově teploměr] | teploměr (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tep.mp3 |
| ter | real | `ter,` [Q4: previous_text /, next_text / jako ve slově baterka] | baterka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ter.mp3 |
| terč | real | `terč,` [Q4: previous_text /, next_text / jako ve slově terčík] | terčík (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tercx.mp3 |
| tev | real | `tef,` [Q4: previous_text /, next_text / jako ve slově větev] | větev (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tev.mp3 |
| ti | real | `ťɪ,` [Q4: previous_text /, next_text / jako ve slově kytice] | kytice (json:dataset-syllable) | IPA (hybrid IPA) | gross-defect check only: PASS | - | ti.mp3 |
| to | real | `to,` [Q4: previous_text /, next_text / jako ve slově auto] | auto (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | to.mp3 |
| toh | real | `toch,` [Q4: previous_text /, next_text / jako ve slově batoh] | batoh (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | toh.mp3 |
| tor | real | `tor,` [Q4: previous_text /, next_text / jako ve slově motorka] | motorka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tor.mp3 |
| tr | real | `tr,` [Q4: previous_text /, next_text / jako ve slově svetr] | svetr (authored-final) | vowel-less pick -> main (ratio 1.115) | gross-defect check only: PASS | voiced-span pick: ratio 1.115 -> main | tr.mp3 |
| trak | real | `trak,` [Q4: previous_text /, next_text / jako ve slově traktor] | traktor (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | trak.mp3 |
| tram | real | `tram,` [Q4: previous_text /, next_text / jako ve slově tramvaj] | tramvaj (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | transcript check failed, IPA text equals the main text -> retake; retake_after_transcript passed | tram.mp3 |
| trič | real | `trič,` [Q4: previous_text /, next_text / jako ve slově tričko] | tričko (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tricx.mp3 |
| tro | real | `tro,` [Q4: previous_text /, next_text / jako ve slově astronaut] | astronaut (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tro.mp3 |
| troj | real | `troj,` [Q4: previous_text /, next_text / jako ve slově ohňostroj] | ohňostroj (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | troj.mp3 |
| trov | real | `trof,` [Q4: previous_text /, next_text / jako ve slově ostrov] | ostrov (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | trov.mp3 |
| trub | real | `trup,` [Q4: previous_text /, next_text / jako ve slově trubka] | trubka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | trub.mp3 |
| trum | real | `trum,` [Q4: previous_text /, next_text / jako ve slově trumpeta] | trumpeta (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | trum.mp3 |
| trych | real | `trich,` [Q4: previous_text /, next_text / jako ve slově trychtýř] | trychtýř (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | trych.mp3 |
| trá | real | `trá,` [Q4: previous_text /, next_text / jako ve slově tráva] | tráva (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | traa.mp3 |
| tu | real | `tu,` [Q4: previous_text /, next_text / jako ve slově tuba] | tuba (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | tu.mp3 |
| tuč | real | `tuč,` [Q4: previous_text /, next_text / jako ve slově tučňák] | tučňák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tucx.mp3 |
| tuž | real | `tuš,` [Q4: previous_text /, next_text / jako ve slově tužka] | tužka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tuzx.mp3 |
| ty | real | `ty,` [Q4: previous_text /, next_text / jako ve slově šaty] | šaty (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | ty.mp3 |
| tá | real | `tá,` [Q4: previous_text /, next_text / jako ve slově fontána] | fontána (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | taa.mp3 |
| té | real | `té,` [Q4: previous_text /, next_text / jako ve slově anténa] | anténa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tee.mp3 |
| tít | real | `ťiːt,` [Q4: previous_text /, next_text / jako ve slově chrastítko] | chrastítko (authored-final) | IPA (hybrid IPA) | gross-defect check only: PASS | - | tiit.mp3 |
| tíř | real | `ťiːř,` [Q4: previous_text /, next_text / jako ve slově rytíř] | rytíř (authored-final) | IPA (hybrid IPA) | gross-defect check only: PASS | - | tiirx.mp3 |
| týl | real | `týl,` [Q4: previous_text /, next_text / jako ve slově motýl] | motýl (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | tyyl.mp3 |
| týř | real | `týř,` [Q4: previous_text /, next_text / jako ve slově trychtýř] | trychtýř (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | tyyrx.mp3 |
| tě | real | `tě,` [Q4: previous_text /, next_text / jako ve slově kotě] | kotě (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | tex.mp3 |
| těr | real | `těr,` [Q4: previous_text /, next_text / jako ve slově ještěrka] | ještěrka (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | texr.mp3 |
| těz | real | `těs,` [Q4: previous_text /, next_text / jako ve slově řetěz] | řetěz (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | texz.mp3 |
| tře | real | `tře,` [Q4: previous_text /, next_text / jako ve slově střecha] | střecha (dataset-substring) | main (Czech respelling) | gross-defect check only: PASS | - | trxe.mp3 |
| u | real | `u,` [Q4: previous_text /, next_text / jako ve slově luk] | luk (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | u.mp3 |
| ub | real | `up,` [Q4: previous_text /, next_text / jako ve slově zub] | zub (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ub.mp3 |
| uh | real | `uch,` [Q4: previous_text /, next_text / jako ve slově duch] | duch (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uh.mp3 |
| va | real | `va,` [Q4: previous_text /, next_text / jako ve slově sova] | sova (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | va.mp3 |
| vad | real | `vat,` [Q4: previous_text /, next_text / jako ve slově umyvadlo] | umyvadlo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vad.mp3 |
| vaj | real | `vaj,` [Q4: previous_text /, next_text / jako ve slově tramvaj] | tramvaj (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vaj.mp3 |
| vaz | real | `vas,` [Q4: previous_text /, next_text / jako ve slově obvaz] | obvaz (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vaz.mp3 |
| vač | real | `vač,` [Q4: previous_text /, next_text / jako ve slově vysavač] | vysavač (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vacx.mp3 |
| ve | real | `ve,` [Q4: previous_text /, next_text / jako ve slově mravenec] | mravenec (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ve.mp3 |
| vec | real | `vec,` [Q4: previous_text /, next_text / jako ve slově jezevec] | jezevec (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vec.mp3 |
| vej | real | `vej,` [Q4: previous_text /, next_text / jako ve slově vejce] | vejce (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vej.mp3 |
| vel | real | `vel,` [Q4: previous_text /, next_text / jako ve slově velryba] | velryba (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vel.mp3 |
| velb | real | `velp,` [Q4: previous_text /, next_text / jako ve slově velbloud] | velbloud (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | velb.mp3 |
| ver | real | `ver,` [Q4: previous_text /, next_text / jako ve slově veverka] | veverka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ver.mp3 |
| ves | real | `ves,` [Q4: previous_text /, next_text / jako ve slově švestka] | švestka (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ves.mp3 |
| vi | real | `vi,` [Q4: previous_text /, next_text / jako ve slově noviny] | noviny (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vi.mp3 |
| vid | real | `vit,` [Q4: previous_text /, next_text / jako ve slově vidlička] | vidlička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vid.mp3 |
| vič | real | `vič,` [Q4: previous_text /, next_text / jako ve slově lavička] | lavička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vicx.mp3 |
| vla | real | `vla,` [Q4: previous_text /, next_text / jako ve slově vlasy] | vlasy (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vla.mp3 |
| vlaj | real | `vlaj,` [Q4: previous_text /, next_text / jako ve slově vlajka] | vlajka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vlaj.mp3 |
| vlak | real | `vlak,` [Q4: previous_text /, next_text / jako ve slově vlakem] | vlakem (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vlak.mp3 |
| vlk | real | `vlk,` [Q4: previous_text /, next_text / jako ve slově vlka] | vlka (authored-final) | vowel-less pick -> main (ratio 1.125) | gross-defect check only: PASS | voiced-span pick: ratio 1.125 -> main | vlk.mp3 |
| vo | real | `vo,` [Q4: previous_text /, next_text / jako ve slově dřevo] | dřevo (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vo.mp3 |
| vouk | real | `vou̯k,` [Q4: previous_text /, next_text / jako ve slově pavouk] | pavouk (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | vouk.mp3 |
| vr | real | `vr,` [Q4: previous_text /, next_text / jako ve slově cvrček] | cvrček (authored-final) | vowel-less pick -> main (ratio 1.324) | gross-defect check only: PASS | voiced-span pick: ratio 1.324 -> main | vr.mp3 |
| vu | real | `vu,` [Q4: previous_text /, next_text / jako ve slově pavučina] | pavučina (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vu.mp3 |
| vy | real | `vi,` [Q4: previous_text /, next_text / jako ve slově lavice] | lavice (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vy.mp3 |
| vyd | real | `vit,` [Q4: previous_text /, next_text / jako ve slově vydra] | vydra (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vyd.mp3 |
| vzdu | real | `vzdu,` [Q4: previous_text /, next_text / jako ve slově vzducholoď] | vzducholoď (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vzdu.mp3 |
| vá | real | `vá,` [Q4: previous_text /, next_text / jako ve slově akvárium] | akvárium (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vaa.mp3 |
| vák | real | `vák,` [Q4: previous_text /, next_text / jako ve slově zpěvák] | zpěvák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vaak.mp3 |
| vát | real | `vát,` [Q4: previous_text /, next_text / jako ve slově ořezávátko] | ořezávátko (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vaat.mp3 |
| váž | real | `váš,` [Q4: previous_text /, next_text / jako ve slově vážka] | vážka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vaazx.mp3 |
| ví | real | `ví,` [Q4: previous_text /, next_text / jako ve slově klavír] | klavír (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vii.mp3 |
| vír | real | `vír,` [Q4: previous_text /, next_text / jako ve slově klavír] | klavír (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | viir.mp3 |
| vče | real | `fče,` [Q4: previous_text /, next_text / jako ve slově včela] | včela (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vcxe.mp3 |
| vě | real | `vje,` [Q4: previous_text /, next_text / jako ve slově závěs] | závěs (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vex.mp3 |
| věd | real | `vjet,` [Q4: previous_text /, next_text / jako ve slově medvěd] | medvěd (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vexd.mp3 |
| věs | real | `vjes,` [Q4: previous_text /, next_text / jako ve slově závěs] | závěs (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vexs.mp3 |
| věž | real | `vješ,` [Q4: previous_text /, next_text / jako ve slově věže] | věže (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vexzx.mp3 |
| waf | real | `vaf,` [Q4: previous_text /, next_text / jako ve slově vafle] | vafle (authored-final) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed, IPA text equals the main text -> retake | waf.mp3 |
| xa | real | `ksa,` [Q4: previous_text /, next_text / jako ve slově fixa] | fixa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xa.mp3 |
| xy | real | `ksi,` [Q4: previous_text /, next_text / jako ve slově fixy] | fixy (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xy.mp3 |
| xík | real | `ksík,` [Q4: previous_text /, next_text / jako ve slově taxík] | taxík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xiik.mp3 |
| za | real | `za,` [Q4: previous_text /, next_text / jako ve slově koza] | koza (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | za.mp3 |
| zav | real | `zaf,` [Q4: previous_text /, next_text / jako ve slově skluzavka] | skluzavka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zav.mp3 |
| ze | real | `ze,` [Q4: previous_text /, next_text / jako ve slově jezevec] | jezevec (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ze.mp3 |
| zeb | real | `zep,` [Q4: previous_text /, next_text / jako ve slově zebra] | zebra (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | zeb.mp3 |
| zek | real | `zek,` [Q4: previous_text /, next_text / jako ve slově řízek] | řízek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zek.mp3 |
| zel | real | `zel,` [Q4: previous_text /, next_text / jako ve slově uzel] | uzel (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zel.mp3 |
| zeď | real | `zeť,` [Q4: previous_text /, next_text / jako ve slově zeť] | zeť (authored-regen) | main (Czech respelling) | gross-defect check only: PASS warn:cutoff | - | zedx.mp3 |
| zin | real | `zin,` [Q4: previous_text /, next_text / jako ve slově rozinky] | rozinky (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zin.mp3 |
| zip | real | `zip,` [Q4: previous_text /, next_text / jako ve slově zipy] | zipy (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zip.mp3 |
| zmrz | real | `zmrs,` [Q4: previous_text /, next_text / jako ve slově nezmrzne] | nezmrzne (authored-final) | vowel-less pick -> main (ratio 0.874) | gross-defect check only: PASS warn:cutoff | voiced-span pick: ratio 0.874 -> main | zmrz.mp3 |
| zo | real | `zo,` [Q4: previous_text /, next_text / jako ve slově fazole] | fazole (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zo.mp3 |
| zpě | real | `spje,` [Q4: previous_text /, next_text / jako ve slově zpěvák] | zpěvák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zpex.mp3 |
| zr | real | `zr,` [Q4: previous_text /, next_text / jako ve slově zrcadlo] | zrcadlo (authored-final) | vowel-less pick -> main (ratio 1.043) | gross-defect check only: PASS warn:cutoff | voiced-span pick: ratio 1.043 -> main | zr.mp3 |
| zu | real | `zu,` [Q4: previous_text /, next_text / jako ve slově zubař] | zubař (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zu.mp3 |
| zub | real | `zup,` [Q4: previous_text /, next_text / jako ve slově zubař] | zubař (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zub.mp3 |
| zvo | real | `zvo,` [Q4: previous_text /, next_text / jako ve slově zvonek] | zvonek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zvo.mp3 |
| zvon | real | `zvon,` [Q4: previous_text /, next_text / jako ve slově zvonek] | zvonek (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zvon.mp3 |
| zyk | real | `zik,` [Q4: previous_text /, next_text / jako ve slově jazyk] | jazyk (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zyk.mp3 |
| zá | real | `zá,` [Q4: previous_text /, next_text / jako ve slově ořezávátko] | ořezávátko (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zaa.mp3 |
| zát | real | `zát,` [Q4: previous_text /, next_text / jako ve slově lízátko] | lízátko (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zaat.mp3 |
| zén | real | `zén,` [Q4: previous_text /, next_text / jako ve slově bazén] | bazén (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zeen.mp3 |
| úl | real | `úl,` [Q4: previous_text /, next_text / jako ve slově stůl] | stůl (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | uul.mp3 |
| ča | real | `ča,` [Q4: previous_text /, next_text / jako ve slově čarodějnice] | čarodějnice (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxa.mp3 |
| čaj | real | `čaj,` [Q4: previous_text /, next_text / jako ve slově čajovna] | čajovna (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxaj.mp3 |
| če | real | `če,` [Q4: previous_text /, next_text / jako ve slově rajče] | rajče (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxe.mp3 |
| ček | real | `ček,` [Q4: previous_text /, next_text / jako ve slově cvrček] | cvrček (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxek.mp3 |
| čert | real | `čert,` [Q4: previous_text /, next_text / jako ve slově čerta] | čerta (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxert.mp3 |
| čes | real | `čes,` [Q4: previous_text /, next_text / jako ve slově učes] | učes (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxes.mp3 |
| či | real | `či,` [Q4: previous_text /, next_text / jako ve slově pavučina] | pavučina (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxi.mp3 |
| čin | real | `čin,` [Q4: previous_text /, next_text / jako ve slově pavučina] | pavučina (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxin.mp3 |
| člun | real | `člun,` [Q4: previous_text /, next_text / jako ve slově člunek] | člunek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxlun.mp3 |
| čme | real | `čme,` [Q4: previous_text /, next_text / jako ve slově čmelák] | čmelák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxme.mp3 |
| čo | real | `čo,` [Q4: previous_text /, next_text / jako ve slově čokoláda] | čokoláda (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxo.mp3 |
| čoč | real | `čoč,` [Q4: previous_text /, next_text / jako ve slově čočka] | čočka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxocx.mp3 |
| čtyř | real | `čtyř,` [Q4: previous_text /, next_text / jako ve slově čtyřkolka] | čtyřkolka (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | cxtyrx.mp3 |
| čáp | real | `čáp,` [Q4: previous_text /, next_text / jako ve slově čápek] | čápek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxaap.mp3 |
| čár | real | `čár,` [Q4: previous_text /, next_text / jako ve slově kočár] | kočár (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxaar.mp3 |
| čí | real | `čí,` [Q4: previous_text /, next_text / jako ve slově počítač] | počítač (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxii.mp3 |
| číš | real | `číš,` [Q4: previous_text /, next_text / jako ve slově číšník] | číšník (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxiisx.mp3 |
| ňo | real | `ɲo,` [Q4: previous_text /, next_text / jako ve slově ohňostroj] | ohňostroj (json:dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | nxo.mp3 |
| ňák | real | `ňák,` [Q4: previous_text /, next_text / jako ve slově tučňák] | tučňák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | nxaak.mp3 |
| ře | real | `ře,` [Q4: previous_text /, next_text / jako ve slově kuře] | kuře (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | rxe.mp3 |
| řech | real | `řech,` [Q4: previous_text /, next_text / jako ve slově ořech] | ořech (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS warn:cutoff | - | rxech.mp3 |
| řed | real | `řet,` [Q4: previous_text /, next_text / jako ve slově ředkvička] | ředkvička (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | rxed.mp3 |
| řen | real | `řen,` [Q4: previous_text /, next_text / jako ve slově cukřenka] | cukřenka (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | rxen.mp3 |
| řez | real | `řes,` [Q4: previous_text /, next_text / jako ve slově ořezávátko] | ořezávátko (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | rxez.mp3 |
| ři | real | `ři,` [Q4: previous_text /, next_text / jako ve slově břicho] | břicho (dataset-substring) | main (Czech respelling) | gross-defect check only: PASS | - | rxi.mp3 |
| řáb | real | `řáp,` [Q4: previous_text /, next_text / jako ve slově jeřáb] | jeřáb (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | rxaab.mp3 |
| ří | real | `ří,` [Q4: previous_text /, next_text / jako ve slově bříza] | bříza (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | rxii.mp3 |
| řík | real | `řík,` [Q4: previous_text /, next_text / jako ve slově žebřík] | žebřík (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS warn:cutoff | - | rxiik.mp3 |
| ša | real | `ša,` [Q4: previous_text /, next_text / jako ve slově šaty] | šaty (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | sxa.mp3 |
| šam | real | `šam,` [Q4: previous_text /, next_text / jako ve slově šampon] | šampon (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxam.mp3 |
| šek | real | `šek,` [Q4: previous_text /, next_text / jako ve slově šašek] | šašek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxek.mp3 |
| šen | real | `šen,` [Q4: previous_text /, next_text / jako ve slově sušenka] | sušenka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxen.mp3 |
| šeň | real | `šeň,` [Q4: previous_text /, next_text / jako ve slově třešeň] | třešeň (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | sxenx.mp3 |
| šip | real | `šip,` [Q4: previous_text /, next_text / jako ve slově šipky] | šipky (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxip.mp3 |
| šit | real | `šit,` [Q4: previous_text /, next_text / jako ve slově sešit] | sešit (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxit.mp3 |
| šiš | real | `šiš,` [Q4: previous_text /, next_text / jako ve slově šiška] | šiška (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxisx.mp3 |
| ško | real | `ško,` [Q4: previous_text /, next_text / jako ve slově škola] | škola (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | sxko.mp3 |
| šle | real | `šle,` [Q4: previous_text /, next_text / jako ve slově mašle] | mašle (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxle.mp3 |
| šnor | real | `šnor,` [Q4: previous_text /, next_text / jako ve slově šnorchl] | šnorchl (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxnor.mp3 |
| špe | real | `špe,` [Q4: previous_text /, next_text / jako ve slově špenát] | špenát (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxpe.mp3 |
| špend | real | `špent,` [Q4: previous_text /, next_text / jako ve slově špendlík] | špendlík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxpend.mp3 |
| šrou | real | `šrou,` [Q4: previous_text /, next_text / jako ve slově šroubovák] | šroubovák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxrou.mp3 |
| šroub | real | `šroup,` [Q4: previous_text /, next_text / jako ve slově šroubovák] | šroubovák (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxroub.mp3 |
| štář | real | `štář,` [Q4: previous_text /, next_text / jako ve slově polštář] | polštář (json:dataset-syllable) | main (Czech respelling) | gross-defect check only: PASS | - | sxtaarx.mp3 |
| štír | real | `ʃťiːr,` [Q4: previous_text /, next_text / jako ve slově štírek] | štírek (authored-regen) | IPA (hybrid IPA) | gross-defect check only: PASS | - | sxtiir.mp3 |
| štít | real | `ʃťiːt,` [Q4: previous_text /, next_text / jako ve slově štítek] | štítek (authored-regen) | IPA (hybrid IPA) | gross-defect check only: PASS | - | sxtiit.mp3 |
| ště | real | `ště,` [Q4: previous_text /, next_text / jako ve slově hřiště] | hřiště (dataset-substring) | main (Czech respelling) | gross-defect check only: PASS | - | sxtex.mp3 |
| šun | real | `šun,` [Q4: previous_text /, next_text / jako ve slově šunka] | šunka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxun.mp3 |
| šup | real | `šup,` [Q4: previous_text /, next_text / jako ve slově šuplík] | šuplík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxup.mp3 |
| švest | real | `švest,` [Q4: previous_text /, next_text / jako ve slově švestka] | švestka (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxvest.mp3 |
| švi | real | `švi,` [Q4: previous_text /, next_text / jako ve slově švihadlo] | švihadlo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxvi.mp3 |
| šá | real | `šá,` [Q4: previous_text /, next_text / jako ve slově věšák] | věšák (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxaa.mp3 |
| šák | real | `šák,` [Q4: previous_text /, next_text / jako ve slově věšák] | věšák (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxaak.mp3 |
| šík | real | `šík,` [Q4: previous_text /, next_text / jako ve slově košík] | košík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxiik.mp3 |
| šíp | real | `šíp,` [Q4: previous_text /, next_text / jako ve slově šípek] | šípek (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxiip.mp3 |
| ža | real | `ža,` [Q4: previous_text /, next_text / jako ve slově pyžamo] | pyžamo (dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxa.mp3 |
| žant | real | `žant,` [Q4: previous_text /, next_text / jako ve slově bažant] | bažant (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxant.mp3 |
| že | real | `že,` [Q4: previous_text /, next_text / jako ve slově lyže] | lyže (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxe.mp3 |
| žeb | real | `žep,` [Q4: previous_text /, next_text / jako ve slově žebřík] | žebřík (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxeb.mp3 |
| žec | real | `žec,` [Q4: previous_text /, next_text / jako ve slově nosorožec] | nosorožec (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxec.mp3 |
| žeh | real | `žech,` [Q4: previous_text /, next_text / jako ve slově žehlička] | žehlička (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree warn:cutoff user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | zxeh.mp3 |
| žek | real | `žek,` [Q4: previous_text /, next_text / jako ve slově ježek] | ježek (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxek.mp3 |
| žel | real | `žel,` [Q4: previous_text /, next_text / jako ve slově želva] | želva (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxel.mp3 |
| žez | real | `žes,` [Q4: previous_text /, next_text / jako ve slově žezlo] | žezlo (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxez.mp3 |
| ži | real | `ži,` [Q4: previous_text /, next_text / jako ve slově žirafa] | žirafa (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxi.mp3 |
| žid | real | `žit,` [Q4: previous_text /, next_text / jako ve slově židle] | židle (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxid.mp3 |
| žo | real | `žo,` [Q4: previous_text /, next_text / jako ve slově žokej] | žokej (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | zxo.mp3 |
| žong | real | `žonk,` [Q4: previous_text /, next_text / jako ve slově žonglér] | žonglér (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | zxong.mp3 |
| žra | real | `žra,` [Q4: previous_text /, next_text / jako ve slově žralok] | žralok (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxra.mp3 |
| žu | real | `žu,` [Q4: previous_text /, next_text / jako ve slově džus] | džus (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxu.mp3 |
| žá | real | `žá,` [Q4: previous_text /, next_text / jako ve slově žába] | žába (json:dataset-syllable) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxaa.mp3 |
| ží | real | `žiː,` [Q4: previous_text /, next_text / jako ve slově nádraží] | nádraží (dataset-syllable) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | zxii.mp3 |
| al | synthetic | `al,` [Q4: previous_text /, next_text / jako ve slově balón] | balón (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | al.mp3 |
| am | synthetic | `am,` [Q4: previous_text /, next_text / jako ve slově lampa] | lampa (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | am.mp3 |
| ap | synthetic | `ap,` [Q4: previous_text /, next_text / jako ve slově mapa] | mapa (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | ap.mp3 |
| at | synthetic | `at,` [Q4: previous_text /, next_text / jako ve slově šaty] | šaty (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | at.mp3 |
| bá | synthetic | `bá,` [Q4: previous_text /, next_text / jako ve slově džbán] | džbán (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | baa.mp3 |
| bé | synthetic | `bɛː,` [Q4: previous_text /, next_text / jako ve slově béžový] | béžový (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | bee.mp3 |
| bó | synthetic | `boː,` [Q4: previous_text /, next_text / jako ve slově bóje] | bóje (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | boo.mp3 |
| bú | synthetic | `bú,` [Q4: previous_text /, next_text / jako ve slově holubům] | holubům (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | buu.mp3 |
| ca | synthetic | `ca,` [Q4: previous_text /, next_text / jako ve slově zrcadlo] | zrcadlo (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ca.mp3 |
| che | synthetic | `che,` [Q4: previous_text /, next_text / jako ve slově plachetnice] | plachetnice (authored-final) | main (Czech respelling) | gross-defect check only: PASS | - | che.mp3 |
| chu | synthetic | `chu,` [Q4: previous_text /, next_text / jako ve slově chuť] | chuť (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | chu.mp3 |
| chá | synthetic | `chá,` [Q4: previous_text /, next_text / jako ve slově sluchátka] | sluchátka (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | chaa.mp3 |
| ché | synthetic | `ché,` [Q4: previous_text /, next_text / jako ve slově schéma] | schéma (authored-regen) | main (Czech respelling) | gross-defect check only: PASS | - | chee.mp3 |
| chí | synthetic | `chí,` [Q4: previous_text /, next_text / jako ve slově suchý] | suchý (authored-final) | main (Czech respelling) | gross-defect check only: PASS warn:cutoff | - | chii.mp3 |
| chó | synthetic | `xoː,` [Q4: previous_text /, next_text / jako ve slově psychóza] | psychóza (authored-regenfix, non-initial) | pure IPA (user-rated 5★, Prompt 24; main way and hybrid IPA gave ů/č) (take `choo__ipapure__psychoza__t2.mp3` of `Temp/RegenFix`) | transcript check (two local recognizers): PASS (heard `chó` / `x oː`); user-rated 5★ 2026-10-05 (Prompt 24: "The ch sounds a bit like from foreigner, but it is acceptable") | transcript check failed (main `chó,` + hybrid IPA `chó,`) -> both rated 2★ (Prompt 23) -> 6 main-way retakes (carriers chór, psychóza) all heard "chú" -> pure-IPA text `xoː,` (3 takes, all 5★), take 2 installed | choo.mp3 |
| chú | synthetic | `chú,` [Q4: previous_text /, next_text / jako ve slově hochů] | hochů (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | chuu.mp3 |
| co | synthetic | `co,` [Q4: previous_text /, next_text / jako ve slově cop] | cop (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | co.mp3 |
| cá | synthetic | `cá,` [Q4: previous_text /, next_text / jako ve slově cákat] | cákat (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | caa.mp3 |
| cú | synthetic | `tsuː,` [Q4: previous_text /, next_text / jako ve slově hrnců] | hrnců (authored-regen) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | cuu.mp3 |
| dé | synthetic | `dé,` [Q4: previous_text /, next_text / jako ve slově déšť] | déšť (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | dee.mp3 |
| dí | synthetic | `ďiː,` [Q4: previous_text /, next_text / jako ve slově řidítka] | řidítka (dataset-substring) | IPA (hybrid IPA) | gross-defect check only: PASS | - | dii.mp3 |
| dó | synthetic | `dó,` [Q4: previous_text /, next_text / jako ve slově dóza] | dóza (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | doo.mp3 |
| ek | synthetic | `ek,` [Q4: previous_text /, next_text / jako ve slově deka] | deka (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ek.mp3 |
| el | synthetic | `el,` [Q4: previous_text /, next_text / jako ve slově orel] | orel (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | el.mp3 |
| em | synthetic | `ɛm,` [Q4: previous_text /, next_text / jako ve slově semafor] | semafor (json:dataset-substring) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS warn:cutoff | transcript check failed -> IPA form; ipa_after_transcript passed | em.mp3 |
| en | synthetic | `en,` [Q4: previous_text /, next_text / jako ve slově buben] | buben (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | en.mp3 |
| ep | synthetic | `ɛp,` [Q4: previous_text /, next_text / jako ve slově řepa] | řepa (json:dataset-substring) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | ep.mp3 |
| et | synthetic | `et,` [Q4: previous_text /, next_text / jako ve slově svetr] | svetr (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | et.mp3 |
| fe | synthetic | `fe,` [Q4: previous_text /, next_text / jako ve slově fena] | fena (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fe.mp3 |
| fu | synthetic | `fu,` [Q4: previous_text /, next_text / jako ve slově fuj] | fuj (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | fu.mp3 |
| fá | synthetic | `faː,` [Q4: previous_text /, next_text / jako ve slově fáze] | fáze (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | faa.mp3 |
| fé | synthetic | `fé,` [Q4: previous_text /, next_text / jako ve slově fén] | fén (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | fee.mp3 |
| fí | synthetic | `fí,` [Q4: previous_text /, next_text / jako ve slově delfín] | delfín (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | fii.mp3 |
| fó | synthetic | `fó,` [Q4: previous_text /, next_text / jako ve slově fólie] | fólie (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | foo.mp3 |
| fú | synthetic | `fú,` [Q4: previous_text /, next_text / jako ve slově fúze] | fúze (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | fuu.mp3 |
| gi | synthetic | `gi,` [Q4: previous_text /, next_text / jako ve slově gigant] | gigant (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | gi.mp3 |
| go | synthetic | `go,` [Q4: previous_text /, next_text / jako ve slově vagon] | vagon (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | go.mp3 |
| gá | synthetic | `gá,` [Q4: previous_text /, next_text / jako ve slově gáza] | gáza (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | gaa.mp3 |
| gé | synthetic | `gé,` [Q4: previous_text /, next_text / jako ve slově génius] | génius (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | gee.mp3 |
| gí | synthetic | `gí,` [Q4: previous_text /, next_text / jako ve slově logika] | logika (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | gii.mp3 |
| gó | synthetic | `gó,` [Q4: previous_text /, next_text / jako ve slově gól] | gól (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | goo.mp3 |
| gú | synthetic | `gú,` [Q4: previous_text /, next_text / jako ve slově katalogů] | katalogů (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | guu.mp3 |
| he | synthetic | `ɦɛ,` [Q4: previous_text /, next_text / jako ve slově oheň] | oheň (json:dataset-substring) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | he.mp3 |
| hi | synthetic | `hi,` [Q4: previous_text /, next_text / jako ve slově váhy] | váhy (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hi.mp3 |
| há | synthetic | `ɦaː,` [Q4: previous_text /, next_text / jako ve slově pohár] | pohár (json:dataset-substring) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | haa.mp3 |
| hé | synthetic | `ɦɛː,` [Q4: previous_text /, next_text / jako ve slově hélium] | hélium (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | hee.mp3 |
| hí | synthetic | `hí,` [Q4: previous_text /, next_text / jako ve slově drahý] | drahý (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | hii.mp3 |
| hó | synthetic | `ɦoː,` [Q4: previous_text /, next_text / jako ve slově jahoda] | jahoda (authored-regen-forced, forced) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | hoo.mp3 |
| hú | synthetic | `ɦuː,` [Q4: previous_text /, next_text / jako ve slově rohů] | rohů (authored-regen) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | huu.mp3 |
| ik | synthetic | `ik,` [Q4: previous_text /, next_text / jako ve slově mikrofon] | mikrofon (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ik.mp3 |
| il | synthetic | `il,` [Q4: previous_text /, next_text / jako ve slově pilný] | pilný (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | il.mp3 |
| im | synthetic | `im,` [Q4: previous_text /, next_text / jako ve slově miminko] | miminko (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | im.mp3 |
| ip | synthetic | `ip,` [Q4: previous_text /, next_text / jako ve slově zip] | zip (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ip.mp3 |
| is | synthetic | `is,` [Q4: previous_text /, next_text / jako ve slově list] | list (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | is.mp3 |
| it | synthetic | `it,` [Q4: previous_text /, next_text / jako ve slově sešit] | sešit (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | it.mp3 |
| ju | synthetic | `ju,` [Q4: previous_text /, next_text / jako ve slově kajuta] | kajuta (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ju.mp3 |
| já | synthetic | `já,` [Q4: previous_text /, next_text / jako ve slově maják] | maják (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | jaa.mp3 |
| jú | synthetic | `jú,` [Q4: previous_text /, next_text / jako ve slově čajů] | čajů (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | juu.mp3 |
| ki | synthetic | `ki,` [Q4: previous_text /, next_text / jako ve slově nůžky] | nůžky (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ki.mp3 |
| ké | synthetic | `kɛː,` [Q4: previous_text /, next_text / jako ve slově kéž] | kéž (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | kee.mp3 |
| kí | synthetic | `kí,` [Q4: previous_text /, next_text / jako ve slově kýchat] | kýchat (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kii.mp3 |
| kó | synthetic | `kó,` [Q4: previous_text /, next_text / jako ve slově kód] | kód (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | koo.mp3 |
| kú | synthetic | `kú,` [Q4: previous_text /, next_text / jako ve slově kluků] | kluků (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | kuu.mp3 |
| ló | synthetic | `ló,` [Q4: previous_text /, next_text / jako ve slově balón] | balón (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | loo.mp3 |
| mu | synthetic | `mu,` [Q4: previous_text /, next_text / jako ve slově mušle] | mušle (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mu.mp3 |
| má | synthetic | `má,` [Q4: previous_text /, next_text / jako ve slově máslo] | máslo (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | maa.mp3 |
| mé | synthetic | `mé,` [Q4: previous_text /, next_text / jako ve slově jméno] | jméno (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | mee.mp3 |
| mí | synthetic | `mí,` [Q4: previous_text /, next_text / jako ve slově míč] | míč (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | mii.mp3 |
| mó | synthetic | `mó,` [Q4: previous_text /, next_text / jako ve slově móda] | móda (json:manual) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | moo.mp3 |
| mú | synthetic | `muː,` [Q4: previous_text /, next_text / jako ve slově domů] | domů (authored-regen) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | muu.mp3 |
| nu | synthetic | `nu,` [Q4: previous_text /, next_text / jako ve slově nanuk] | nanuk (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nu.mp3 |
| né | synthetic | `né,` [Q4: previous_text /, next_text / jako ve slově nést] | nést (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nee.mp3 |
| ní | synthetic | `ní,` [Q4: previous_text /, next_text / jako ve slově cedník] | cedník (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nii.mp3 |
| nó | synthetic | `nó,` [Q4: previous_text /, next_text / jako ve slově nóta] | nóta (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | noo.mp3 |
| nú | synthetic | `nú,` [Q4: previous_text /, next_text / jako ve slově nůž] | nůž (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nuu.mp3 |
| ol | synthetic | `ol,` [Q4: previous_text /, next_text / jako ve slově kolo] | kolo (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ol.mp3 |
| om | synthetic | `om,` [Q4: previous_text /, next_text / jako ve slově strom] | strom (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | transcript check failed, IPA text equals the main text -> retake; retake_after_transcript passed | om.mp3 |
| on | synthetic | `on,` [Q4: previous_text /, next_text / jako ve slově gong] | gong (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | on.mp3 |
| op | synthetic | `op,` [Q4: previous_text /, next_text / jako ve slově cop] | cop (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | op.mp3 |
| ot | synthetic | `ot,` [Q4: previous_text /, next_text / jako ve slově bota] | bota (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ot.mp3 |
| pu | synthetic | `pu,` [Q4: previous_text /, next_text / jako ve slově pudr] | pudr (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pu.mp3 |
| pé | synthetic | `pɛː,` [Q4: previous_text /, next_text / jako ve slově péro] | péro (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | pee.mp3 |
| pí | synthetic | `pí,` [Q4: previous_text /, next_text / jako ve slově netopýr] | netopýr (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | pii.mp3 |
| pó | synthetic | `pó,` [Q4: previous_text /, next_text / jako ve slově pól] | pól (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | poo.mp3 |
| pú | synthetic | `pú,` [Q4: previous_text /, next_text / jako ve slově půda] | půda (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | puu.mp3 |
| qa | synthetic | `kva,` [Q4: previous_text /, next_text / jako ve slově kvadrát] | kvadrát (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qa.mp3 |
| qe | synthetic | `kve,` [Q4: previous_text /, next_text / jako ve slově rozkvete] | rozkvete (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qe.mp3 |
| qi | synthetic | `kvi,` [Q4: previous_text /, next_text / jako ve slově ředkvička] | ředkvička (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qi.mp3 |
| qo | synthetic | `kvo,` [Q4: previous_text /, next_text / jako ve slově kvočna] | kvočna (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qo.mp3 |
| qu | synthetic | `kvu,` [Q4: previous_text /, next_text / jako ve slově kvůli] | kvůli (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qu.mp3 |
| qá | synthetic | `kvá,` [Q4: previous_text /, next_text / jako ve slově akvárium] | akvárium (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qaa.mp3 |
| qé | synthetic | `kvé,` [Q4: previous_text /, next_text / jako ve slově kvést] | kvést (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qee.mp3 |
| qí | synthetic | `kví,` [Q4: previous_text /, next_text / jako ve slově rozkvítá] | rozkvítá (authored-stage2a) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qii.mp3 |
| qó | synthetic | `kvó,` [Q4: previous_text /, next_text / jako ve slově kvóta] | kvóta (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | qoo.mp3 |
| qú | synthetic | `kvú,` [Q4: previous_text /, next_text / jako ve slově kvůli] | kvůli (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | quu.mp3 |
| re | synthetic | `re,` [Q4: previous_text /, next_text / jako ve slově orel] | orel (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | re.mp3 |
| ri | synthetic | `ri,` [Q4: previous_text /, next_text / jako ve slově gril] | gril (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ri.mp3 |
| ré | synthetic | `ré,` [Q4: previous_text /, next_text / jako ve slově réva] | réva (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ree.mp3 |
| rí | synthetic | `rí,` [Q4: previous_text /, next_text / jako ve slově brýle] | brýle (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | rii.mp3 |
| ró | synthetic | `ró,` [Q4: previous_text /, next_text / jako ve slově róba] | róba (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | roo.mp3 |
| rú | synthetic | `rú,` [Q4: previous_text /, next_text / jako ve slově borůvka] | borůvka (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ruu.mp3 |
| si | synthetic | `si,` [Q4: previous_text /, next_text / jako ve slově hasič] | hasič (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | si.mp3 |
| sé | synthetic | `sé,` [Q4: previous_text /, next_text / jako ve slově sérum] | sérum (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | see.mp3 |
| sí | synthetic | `sí,` [Q4: previous_text /, next_text / jako ve slově měsíc] | měsíc (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sii.mp3 |
| só | synthetic | `só,` [Q4: previous_text /, next_text / jako ve slově sója] | sója (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | soo.mp3 |
| sú | synthetic | `sú,` [Q4: previous_text /, next_text / jako ve slově sůl] | sůl (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | suu.mp3 |
| tí | synthetic | `ťiː,` [Q4: previous_text /, next_text / jako ve slově rytíř] | rytíř (authored-final) | IPA (hybrid IPA) | gross-defect check only: PASS | - | tii.mp3 |
| tó | synthetic | `tó,` [Q4: previous_text /, next_text / jako ve slově tón] | tón (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | too.mp3 |
| tú | synthetic | `tú,` [Q4: previous_text /, next_text / jako ve slově stůl] | stůl (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | tuu.mp3 |
| uk | synthetic | `uk,` [Q4: previous_text /, next_text / jako ve slově luk] | luk (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uk.mp3 |
| ul | synthetic | `ul,` [Q4: previous_text /, next_text / jako ve slově tuleň] | tuleň (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ul.mp3 |
| um | synthetic | `um,` [Q4: previous_text /, next_text / jako ve slově guma] | guma (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | um.mp3 |
| un | synthetic | `un,` [Q4: previous_text /, next_text / jako ve slově člun] | člun (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | un.mp3 |
| up | synthetic | `up,` [Q4: previous_text /, next_text / jako ve slově lupa] | lupa (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | up.mp3 |
| us | synthetic | `us,` [Q4: previous_text /, next_text / jako ve slově husa] | husa (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | us.mp3 |
| ut | synthetic | `ut,` [Q4: previous_text /, next_text / jako ve slově žalud] | žalud (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ut.mp3 |
| vé | synthetic | `vé,` [Q4: previous_text /, next_text / jako ve slově vést] | vést (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vee.mp3 |
| vó | synthetic | `vó,` [Q4: previous_text /, next_text / jako ve slově voda] | voda (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | voo.mp3 |
| vú | synthetic | `vú,` [Q4: previous_text /, next_text / jako ve slově vůz] | vůz (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | vuu.mp3 |
| wa | synthetic | `va,` [Q4: previous_text /, next_text / jako ve slově sova] | sova (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | wa.mp3 |
| we | synthetic | `ve,` [Q4: previous_text /, next_text / jako ve slově dveře] | dveře (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | we.mp3 |
| wi | synthetic | `vɪ,` [Q4: previous_text /, next_text / jako ve slově lavice] | lavice (dataset-phonetic) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | wi.mp3 |
| wo | synthetic | `vo,` [Q4: previous_text /, next_text / jako ve slově zvon] | zvon (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | wo.mp3 |
| wu | synthetic | `vu,` [Q4: previous_text /, next_text / jako ve slově pavučina] | pavučina (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | wu.mp3 |
| wá | synthetic | `vá,` [Q4: previous_text /, next_text / jako ve slově zpěvák] | zpěvák (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | waa.mp3 |
| wé | synthetic | `vé,` [Q4: previous_text /, next_text / jako ve slově nové] | nové (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | wee.mp3 |
| wí | synthetic | `ví,` [Q4: previous_text /, next_text / jako ve slově klavír] | klavír (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | wii.mp3 |
| wó | synthetic | `vó,` [Q4: previous_text /, next_text / jako ve slově voda] | voda (authored-final-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | woo.mp3 |
| wú | synthetic | `vú,` [Q4: previous_text /, next_text / jako ve slově dvůr] | dvůr (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | wuu.mp3 |
| xe | synthetic | `kse,` [Q4: previous_text /, next_text / jako ve slově boxer] | boxer (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | xe.mp3 |
| xi | synthetic | `ksi,` [Q4: previous_text /, next_text / jako ve slově fixy] | fixy (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xi.mp3 |
| xo | synthetic | `kso,` [Q4: previous_text /, next_text / jako ve slově boxovat] | boxovat (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xo.mp3 |
| xu | synthetic | `ksu,` [Q4: previous_text /, next_text / jako ve slově luxus] | luxus (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xu.mp3 |
| xá | synthetic | `ksá,` [Q4: previous_text /, next_text / jako ve slově fixátor] | fixátor (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xaa.mp3 |
| xé | synthetic | `ksé,` [Q4: previous_text /, next_text / jako ve slově mixér] | mixér (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xee.mp3 |
| xí | synthetic | `ksí,` [Q4: previous_text /, next_text / jako ve slově taxík] | taxík (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xii.mp3 |
| xó | synthetic | `ksó,` [Q4: previous_text /, next_text / jako ve slově saxofon] | saxofon (authored-final-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xoo.mp3 |
| xú | synthetic | `ksú,` [Q4: previous_text /, next_text / jako ve slově boxů] | boxů (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | xuu.mp3 |
| yk | synthetic | `ik,` [Q4: previous_text /, next_text / jako ve slově jazyk] | jazyk (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yk.mp3 |
| yl | synthetic | `il,` [Q4: previous_text /, next_text / jako ve slově kobyla] | kobyla (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | yl.mp3 |
| ym | synthetic | `ɪm,` [Q4: previous_text /, next_text / jako ve slově hymna] | hymna (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | ym.mp3 |
| yn | synthetic | `in,` [Q4: previous_text /, next_text / jako ve slově činka] | činka (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yn.mp3 |
| yp | synthetic | `ip,` [Q4: previous_text /, next_text / jako ve slově typ] | typ (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yp.mp3 |
| ys | synthetic | `is,` [Q4: previous_text /, next_text / jako ve slově rys] | rys (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ys.mp3 |
| yt | synthetic | `it,` [Q4: previous_text /, next_text / jako ve slově kytara] | kytara (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yt.mp3 |
| zi | synthetic | `zi,` [Q4: previous_text /, next_text / jako ve slově rozinky] | rozinky (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zi.mp3 |
| zé | synthetic | `zé,` [Q4: previous_text /, next_text / jako ve slově bazén] | bazén (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | zee.mp3 |
| zí | synthetic | `zí,` [Q4: previous_text /, next_text / jako ve slově zítra] | zítra (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zii.mp3 |
| zó | synthetic | `zó,` [Q4: previous_text /, next_text / jako ve slově zóna] | zóna (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zoo.mp3 |
| zú | synthetic | `zú,` [Q4: previous_text /, next_text / jako ve slově zúžit] | zúžit (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | zuu.mp3 |
| ák | synthetic | `ák,` [Q4: previous_text /, next_text / jako ve slově pták] | pták (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | aak.mp3 |
| ál | synthetic | `ál,` [Q4: previous_text /, next_text / jako ve slově král] | král (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | aal.mp3 |
| ám | synthetic | `ám,` [Q4: previous_text /, next_text / jako ve slově kámen] | kámen (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | aam.mp3 |
| án | synthetic | `án,` [Q4: previous_text /, next_text / jako ve slově banán] | banán (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | aan.mp3 |
| áp | synthetic | `áp,` [Q4: previous_text /, next_text / jako ve slově čáp] | čáp (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | aap.mp3 |
| ás | synthetic | `ás,` [Q4: previous_text /, next_text / jako ve slově máslo] | máslo (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | aas.mp3 |
| át | synthetic | `át,` [Q4: previous_text /, next_text / jako ve slově pirát] | pirát (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | aat.mp3 |
| ék | synthetic | `ék,` [Q4: previous_text /, next_text / jako ve slově mléko] | mléko (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | eek.mp3 |
| él | synthetic | `él,` [Q4: previous_text /, next_text / jako ve slově délka] | délka (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | eel.mp3 |
| ém | synthetic | `ém,` [Q4: previous_text /, next_text / jako ve slově systém] | systém (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | eem.mp3 |
| én | synthetic | `én,` [Q4: previous_text /, next_text / jako ve slově fén] | fén (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | een.mp3 |
| ép | synthetic | `ép,` [Q4: previous_text /, next_text / jako ve slově chléb] | chléb (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | eep.mp3 |
| és | synthetic | `és,` [Q4: previous_text /, next_text / jako ve slově les] | les (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ees.mp3 |
| ét | synthetic | `ét,` [Q4: previous_text /, next_text / jako ve slově flétna] | flétna (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | eet.mp3 |
| ík | synthetic | `ík,` [Q4: previous_text /, next_text / jako ve slově fík] | fík (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | iik.mp3 |
| íl | synthetic | `íl,` [Q4: previous_text /, next_text / jako ve slově víla] | víla (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | iil.mp3 |
| ím | synthetic | `ím,` [Q4: previous_text /, next_text / jako ve slově zvoním] | zvoním (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | iim.mp3 |
| ín | synthetic | `ín,` [Q4: previous_text /, next_text / jako ve slově delfín] | delfín (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | iin.mp3 |
| íp | synthetic | `íp,` [Q4: previous_text /, next_text / jako ve slově šíp] | šíp (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | iip.mp3 |
| ís | synthetic | `ís,` [Q4: previous_text /, next_text / jako ve slově čtyřlístek] | čtyřlístek (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | iis.mp3 |
| ít | synthetic | `ít,` [Q4: previous_text /, next_text / jako ve slově štít] | štít (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | iit.mp3 |
| ók | synthetic | `ók,` [Q4: previous_text /, next_text / jako ve slově oko] | oko (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ook.mp3 |
| ól | synthetic | `ól,` [Q4: previous_text /, next_text / jako ve slově pól] | pól (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ool.mp3 |
| óm | synthetic | `oːm,` [Q4: previous_text /, next_text / jako ve slově gnóm] | gnóm (json:manual) | main (Czech respelling) -> ipa form (fallback) | transcript check (two local recognizers): PASS | transcript check failed -> IPA form; ipa_after_transcript passed | oom.mp3 |
| ón | synthetic | `ón,` [Q4: previous_text /, next_text / jako ve slově balón] | balón (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | oon.mp3 |
| óp | synthetic | `óp,` [Q4: previous_text /, next_text / jako ve slově opice] | opice (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | oop.mp3 |
| ós | synthetic | `ós,` [Q4: previous_text /, next_text / jako ve slově kosa] | kosa (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | oos.mp3 |
| ót | synthetic | `ót,` [Q4: previous_text /, next_text / jako ve slově bota] | bota (authored-regen-forced, forced) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | oot.mp3 |
| úk | synthetic | `úk,` [Q4: previous_text /, next_text / jako ve slově úkol] | úkol (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uuk.mp3 |
| úm | synthetic | `úm,` [Q4: previous_text /, next_text / jako ve slově stromům] | stromům (authored) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uum.mp3 |
| ún | synthetic | `ún,` [Q4: previous_text /, next_text / jako ve slově únor] | únor (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uun.mp3 |
| úp | synthetic | `úp,` [Q4: previous_text /, next_text / jako ve slově úpal] | úpal (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uup.mp3 |
| ús | synthetic | `ús,` [Q4: previous_text /, next_text / jako ve slově ústa] | ústa (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uus.mp3 |
| út | synthetic | `út,` [Q4: previous_text /, next_text / jako ve slově úterý] | úterý (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uut.mp3 |
| ýk | synthetic | `ík,` [Q4: previous_text /, next_text / jako ve slově býk] | býk (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yyk.mp3 |
| ýl | synthetic | `íl,` [Q4: previous_text /, next_text / jako ve slově brýle] | brýle (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yyl.mp3 |
| ým | synthetic | `ím,` [Q4: previous_text /, next_text / jako ve slově dýmka] | dýmka (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yym.mp3 |
| ýn | synthetic | `ín,` [Q4: previous_text /, next_text / jako ve slově mlýn] | mlýn (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yyn.mp3 |
| ýp | synthetic | `íp,` [Q4: previous_text /, next_text / jako ve slově výprava] | výprava (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yyp.mp3 |
| ýs | synthetic | `ís,` [Q4: previous_text /, next_text / jako ve slově výsledek] | výsledek (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yys.mp3 |
| ýt | synthetic | `ít,` [Q4: previous_text /, next_text / jako ve slově výtah] | výtah (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | yyt.mp3 |
| ču | synthetic | `ču,` [Q4: previous_text /, next_text / jako ve slově čuch] | čuch (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxu.mp3 |
| čá | synthetic | `čá,` [Q4: previous_text /, next_text / jako ve slově kočár] | kočár (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxaa.mp3 |
| čú | synthetic | `čú,` [Q4: previous_text /, next_text / jako ve slově míčů] | míčů (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | cxuu.mp3 |
| ďa | synthetic | `ďa,` [Q4: previous_text /, next_text / jako ve slově ďas] | ďas (json:manual) | main (Czech respelling) | gross-defect check only: PASS | - | dxa.mp3 |
| ďo | synthetic | `ďo,` [Q4: previous_text /, next_text / jako ve slově ďobat] | ďobat (authored-regen) | main (Czech respelling) | gross-defect check only: PASS | - | dxo.mp3 |
| ďu | synthetic | `ďu,` [Q4: previous_text /, next_text / jako ve slově ďubka] | ďubka (authored-regen) | main (Czech respelling) | gross-defect check only: PASS | - | dxu.mp3 |
| ďá | synthetic | `ďá,` [Q4: previous_text /, next_text / jako ve slově ďábel] | ďábel (json:manual) | main (Czech respelling) | gross-defect check only: PASS | - | dxaa.mp3 |
| ďú | synthetic | `ďú,` [Q4: previous_text /, next_text / jako ve slově ďábel] | ďábel (authored-final-forced, forced) | main (Czech respelling) | gross-defect check only: PASS | - | dxuu.mp3 |
| ěk | synthetic | `jek,` [Q4: previous_text /, next_text / jako ve slově člověk] | člověk (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | exk.mp3 |
| ěl | synthetic | `jel,` [Q4: previous_text /, next_text / jako ve slově jelen] | jelen (dataset-phonetic) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | exl.mp3 |
| ěm | synthetic | `jem,` [Q4: previous_text /, next_text / jako ve slově objem] | objem (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | exm.mp3 |
| ěn | synthetic | `jen,` [Q4: previous_text /, next_text / jako ve slově pěna] | pěna (authored-stage2a) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | exn.mp3 |
| ěp | synthetic | `jep,` [Q4: previous_text /, next_text / jako ve slově jepice] | jepice (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | exp.mp3 |
| ěs | synthetic | `jes,` [Q4: previous_text /, next_text / jako ve slově závěs] | závěs (dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | exs.mp3 |
| ět | synthetic | `jet,` [Q4: previous_text /, next_text / jako ve slově větev] | větev (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | ext.mp3 |
| ňa | synthetic | `ňa,` [Q4: previous_text /, next_text / jako ve slově chňapka] | chňapka (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nxa.mp3 |
| ňu | synthetic | `ňu,` [Q4: previous_text /, next_text / jako ve slově kňučet] | kňučet (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nxu.mp3 |
| ňá | synthetic | `ňá,` [Q4: previous_text /, next_text / jako ve slově tučňák] | tučňák (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | nxaa.mp3 |
| ňú | synthetic | `ňú,` [Q4: previous_text /, next_text / jako ve slově koňům] | koňům (authored-ni) | main (Czech respelling) | transcript check (two local recognizers): FAIL both_recognizers_disagree user-rated 5★ 2026-10-05 (Prompt 23, `syllables_regen_feedback.json`), kept | transcript check failed -> IPA form | nxuu.mp3 |
| řa | synthetic | `řa,` [Q4: previous_text /, next_text / jako ve slově řasa] | řasa (json:manual) | main (Czech respelling) | gross-defect check only: PASS | - | rxa.mp3 |
| řo | synthetic | `řo,` [Q4: previous_text /, next_text / jako ve slově křoví] | křoví (authored-stage2a) | main (Czech respelling) | gross-defect check only: PASS | - | rxo.mp3 |
| řu | synthetic | `řu,` [Q4: previous_text /, next_text / jako ve slově křup] | křup (json:manual) | main (Czech respelling) | gross-defect check only: PASS | - | rxu.mp3 |
| řá | synthetic | `řá,` [Q4: previous_text /, next_text / jako ve slově jeřáb] | jeřáb (json:dataset-substring) | main (Czech respelling) | gross-defect check only: PASS | - | rxaa.mp3 |
| řú | synthetic | `řú,` [Q4: previous_text /, next_text / jako ve slově keřů] | keřů (authored-regen) | main (Czech respelling) | gross-defect check only: PASS | - | rxuu.mp3 |
| šo | synthetic | `šo,` [Q4: previous_text /, next_text / jako ve slově šotek] | šotek (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxo.mp3 |
| šu | synthetic | `šu,` [Q4: previous_text /, next_text / jako ve slově šunka] | šunka (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxu.mp3 |
| šú | synthetic | `šú,` [Q4: previous_text /, next_text / jako ve slově košů] | košů (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | sxuu.mp3 |
| ťa | synthetic | `ťa,` [Q4: previous_text /, next_text / jako ve slově ťapat] | ťapat (json:manual) | main (Czech respelling) | gross-defect check only: PASS | - | txa.mp3 |
| ťo | synthetic | `ťo,` [Q4: previous_text /, next_text / jako ve slově chuťovka] | chuťovka (authored-regen) | main (Czech respelling) | gross-defect check only: PASS | - | txo.mp3 |
| ťu | synthetic | `ťu,` [Q4: previous_text /, next_text / jako ve slově ťukat] | ťukat (json:manual) | main (Czech respelling) | gross-defect check only: PASS | - | txu.mp3 |
| ťá | synthetic | `ťá,` [Q4: previous_text /, next_text / jako ve slově ťápnout] | ťápnout (json:manual) | main (Czech respelling) | gross-defect check only: PASS | - | txaa.mp3 |
| ťú | synthetic | `ťú,` [Q4: previous_text /, next_text / jako ve slově ťukat] | ťukat (authored-final-forced, forced) | main (Czech respelling) | gross-defect check only: PASS | - | txuu.mp3 |
| ůk | synthetic | `úk,` [Q4: previous_text /, next_text / jako ve slově vůkol] | vůkol (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS warn:cutoff | - | uok.mp3 |
| ůl | synthetic | `úl,` [Q4: previous_text /, next_text / jako ve slově stůl] | stůl (json:dataset-substring) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uol.mp3 |
| ům | synthetic | `úm,` [Q4: previous_text /, next_text / jako ve slově dům] | dům (authored-final) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uom.mp3 |
| ůn | synthetic | `ún,` [Q4: previous_text /, next_text / jako ve slově trůn] | trůn (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uon.mp3 |
| ůp | synthetic | `úp,` [Q4: previous_text /, next_text / jako ve slově úpal] | úpal (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uop.mp3 |
| ůs | synthetic | `ús,` [Q4: previous_text /, next_text / jako ve slově půst] | půst (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uos.mp3 |
| ůt | synthetic | `út,` [Q4: previous_text /, next_text / jako ve slově půtka] | půtka (json:manual) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | uot.mp3 |
| žú | synthetic | `žú,` [Q4: previous_text /, next_text / jako ve slově nožů] | nožů (authored-regen) | main (Czech respelling) | transcript check (two local recognizers): PASS | - | zxuu.mp3 |

## Words (`words/`, `words_first/`, `words_last/`)
Text = the word only (`language_code` cs), no previous/next text. `words_first/<id>.mp3` and `words_last/<id>.mp3` are byte copies of `words/<id>.mp3` (Change request 15: complete unchanged word); only files that already existed there were refreshed.

| word | file |
|---|---|
| auto | auto.mp3 |
| autobus | autobus.mp3 |
| ananas | ananas.mp3 |
| anděl | andel.mp3 |
| avokádo | avokado.mp3 |
| akvárium | akvarium.mp3 |
| antilopa | antilopa.mp3 |
| astronaut | astronaut.mp3 |
| balón | balon.mp3 |
| banán | banan.mp3 |
| beruška | beruska.mp3 |
| bota | bota.mp3 |
| brambora | brambora.mp3 |
| brýle | bryle.mp3 |
| buben | buben.mp3 |
| bagr | bagr.mp3 |
| balík | balik.mp3 |
| baterka | baterka.mp3 |
| bažant | bazant.mp3 |
| beran | beran.mp3 |
| bobr | bobr.mp3 |
| borůvka | boruvka.mp3 |
| brokolice | brokolice.mp3 |
| bunda | bunda.mp3 |
| býk | byk.mp3 |
| batoh | batoh.mp3 |
| blesk | blesk.mp3 |
| bonbon | bonbon.mp3 |
| brána | brana.mp3 |
| bříza | briza.mp3 |
| brusle | brusle.mp3 |
| babička | babicka.mp3 |
| břicho | bricho.mp3 |
| citron | citron.mp3 |
| cibule | cibule.mp3 |
| cirkus | cirkus.mp3 |
| cesta | cesta.mp3 |
| cihla | cihla.mp3 |
| cuketa | cuketa.mp3 |
| cvrček | cvrcek.mp3 |
| cedník | cednik.mp3 |
| čáp | cap.mp3 |
| čokoláda | cokolada.mp3 |
| čelenka | celenka.mp3 |
| čmelák | cmelak.mp3 |
| čočka | cocka.mp3 |
| čert | cert.mp3 |
| člun | clun.mp3 |
| čaj | caj.mp3 |
| čtyřlístek | ctyrlistek.mp3 |
| čarodějnice | carodejnice.mp3 |
| chobotnice | chobotnice.mp3 |
| chléb | chleb.mp3 |
| chameleon | chameleon.mp3 |
| chřest | chrest.mp3 |
| chrastítko | chrastitko.mp3 |
| chobot | chobot.mp3 |
| chata | chata.mp3 |
| dům | dum.mp3 |
| dort | dort.mp3 |
| deštník | destnik.mp3 |
| dinosaurus | dinosaurus.mp3 |
| drak | drak.mp3 |
| dveře | dvere.mp3 |
| dýně | dyne.mp3 |
| delfín | delfin.mp3 |
| datel | datel.mp3 |
| dárek | darek.mp3 |
| deka | deka.mp3 |
| dalekohled | dalekohled.mp3 |
| dědeček | dedecek.mp3 |
| dudlík | dudlik.mp3 |
| džbán | dzban.mp3 |
| dřevo | drevo.mp3 |
| duha | duha.mp3 |
| dopis | dopis.mp3 |
| dělo | delo.mp3 |
| dívka | divka.mp3 |
| dýmka | dymka.mp3 |
| fazole | fazole.mp3 |
| fotoaparát | fotoaparat.mp3 |
| fén | fen.mp3 |
| fialka | fialka.mp3 |
| flétna | fletna.mp3 |
| fixa | fixa.mp3 |
| fontána | fontana.mp3 |
| fretka | fretka.mp3 |
| fík | fik.mp3 |
| farma | farma.mp3 |
| guma | guma.mp3 |
| garáž | garaz.mp3 |
| gepard | gepard.mp3 |
| glóbus | globus.mp3 |
| gong | gong.mp3 |
| gril | gril.mp3 |
| hrad | hrad.mp3 |
| hruška | hruska.mp3 |
| hodiny | hodiny.mp3 |
| houba | houba.mp3 |
| had | had.mp3 |
| hrnek | hrnek.mp3 |
| husa | husa.mp3 |
| hlava | hlava.mp3 |
| holub | holub.mp3 |
| hřeben | hreben.mp3 |
| hřebík | hrebik.mp3 |
| hroch | hroch.mp3 |
| housle | housle.mp3 |
| hvězda | hvezda.mp3 |
| hasič | hasic.mp3 |
| helma | helma.mp3 |
| hokejka | hokejka.mp3 |
| hrábě | hrabe.mp3 |
| hrozny | hrozny.mp3 |
| hrášek | hrasek.mp3 |
| hnízdo | hnizdo.mp3 |
| hrnec | hrnec.mp3 |
| harfa | harfa.mp3 |
| housenka | housenka.mp3 |
| hora | hora.mp3 |
| hamburger | hamburger.mp3 |
| iglú | iglu.mp3 |
| injekce | injekce.mp3 |
| inkoust | inkoust.mp3 |
| jahoda | jahoda.mp3 |
| ježek | jezek.mp3 |
| jelen | jelen.mp3 |
| jehla | jehla.mp3 |
| jeřáb | jerab.mp3 |
| jojo | jojo.mp3 |
| jednorožec | jednorozec.mp3 |
| jeskyně | jeskyne.mp3 |
| ještěrka | jesterka.mp3 |
| jogurt | jogurt.mp3 |
| jazyk | jazyk.mp3 |
| kočka | kocka.mp3 |
| koza | koza.mp3 |
| kůň | kun.mp3 |
| klíč | klic.mp3 |
| kolo | kolo.mp3 |
| kniha | kniha.mp3 |
| kráva | krava.mp3 |
| koláč | kolac.mp3 |
| košík | kosik.mp3 |
| kladivo | kladivo.mp3 |
| kytara | kytara.mp3 |
| kachna | kachna.mp3 |
| kostel | kostel.mp3 |
| kalhoty | kalhoty.mp3 |
| klobouk | klobouk.mp3 |
| koruna | koruna.mp3 |
| kámen | kamen.mp3 |
| klavír | klavir.mp3 |
| krabice | krabice.mp3 |
| kuře | kure.mp3 |
| květina | kvetina.mp3 |
| kočár | kocar.mp3 |
| koberec | koberec.mp3 |
| koš | kos.mp3 |
| křeslo | kreslo.mp3 |
| kufr | kufr.mp3 |
| kotě | kote.mp3 |
| král | kral.mp3 |
| královna | kralovna.mp3 |
| kuchař | kuchar.mp3 |
| lev | lev.mp3 |
| loď | lod.mp3 |
| lampa | lampa.mp3 |
| list | list.mp3 |
| lízátko | lizatko.mp3 |
| lžíce | lzice.mp3 |
| liška | liska.mp3 |
| letadlo | letadlo.mp3 |
| lavička | lavicka.mp3 |
| lednička | lednicka.mp3 |
| lyže | lyze.mp3 |
| labuť | labut.mp3 |
| láhev | lahev.mp3 |
| lano | lano.mp3 |
| lenochod | lenochod.mp3 |
| limonáda | limonada.mp3 |
| loutka | loutka.mp3 |
| lupa | lupa.mp3 |
| luk | luk.mp3 |
| lucerna | lucerna.mp3 |
| los | los.mp3 |
| les | les.mp3 |
| myš | mys.mp3 |
| mrkev | mrkev.mp3 |
| meloun | meloun.mp3 |
| motýl | motyl.mp3 |
| medvěd | medved.mp3 |
| mašle | masle.mp3 |
| mrak | mrak.mp3 |
| most | most.mp3 |
| mléko | mleko.mp3 |
| malina | malina.mp3 |
| měsíc | mesic.mp3 |
| mapa | mapa.mp3 |
| maják | majak.mp3 |
| mravenec | mravenec.mp3 |
| mušle | musle.mp3 |
| mýdlo | mydlo.mp3 |
| motorka | motorka.mp3 |
| meč | mec.mp3 |
| medúza | meduza.mp3 |
| mikrofon | mikrofon.mp3 |
| miska | miska.mp3 |
| mlýn | mlyn.mp3 |
| mrož | mroz.mp3 |
| magnet | magnet.mp3 |
| moucha | moucha.mp3 |
| máslo | maslo.mp3 |
| med | med.mp3 |
| miminko | miminko.mp3 |
| moře | more.mp3 |
| nůžky | nuzky.mp3 |
| noha | noha.mp3 |
| nůž | nuz.mp3 |
| nosorožec | nosorozec.mp3 |
| noviny | noviny.mp3 |
| náramek | naramek.mp3 |
| nanuk | nanuk.mp3 |
| nočník | nocnik.mp3 |
| netopýr | netopyr.mp3 |
| nemocnice | nemocnice.mp3 |
| okno | okno.mp3 |
| opice | opice.mp3 |
| oko | oko.mp3 |
| ovce | ovce.mp3 |
| orel | orel.mp3 |
| ořech | orech.mp3 |
| okurka | okurka.mp3 |
| oheň | ohen.mp3 |
| obraz | obraz.mp3 |
| obálka | obalka.mp3 |
| osel | osel.mp3 |
| oliva | oliva.mp3 |
| ostrov | ostrov.mp3 |
| obojek | obojek.mp3 |
| pes | pes.mp3 |
| pták | ptak.mp3 |
| ponožka | ponozka.mp3 |
| polštář | polstar.mp3 |
| prase | prase.mp3 |
| papoušek | papousek.mp3 |
| pavouk | pavouk.mp3 |
| pero | pero.mp3 |
| pomeranč | pomeranc.mp3 |
| postel | postel.mp3 |
| pila | pila.mp3 |
| párek | parek.mp3 |
| padák | padak.mp3 |
| panenka | panenka.mp3 |
| pavučina | pavucina.mp3 |
| pirát | pirat.mp3 |
| prsten | prsten.mp3 |
| plot | plot.mp3 |
| počítač | pocitac.mp3 |
| pohár | pohar.mp3 |
| pyžamo | pyzamo.mp3 |
| polévka | polevka.mp3 |
| policista | policista.mp3 |
| princezna | princezna.mp3 |
| palec | palec.mp3 |
| prst | prst.mp3 |
| ryba | ryba.mp3 |
| ruka | ruka.mp3 |
| raketa | raketa.mp3 |
| robot | robot.mp3 |
| rajče | rajce.mp3 |
| růže | ruze.mp3 |
| rohlík | rohlik.mp3 |
| rukavice | rukavice.mp3 |
| rádio | radio.mp3 |
| rybíz | rybiz.mp3 |
| rytíř | rytir.mp3 |
| rampouch | rampouch.mp3 |
| rys | rys.mp3 |
| ručník | rucnik.mp3 |
| rybář | rybar.mp3 |
| rtěnka | rtenka.mp3 |
| řepa | repa.mp3 |
| řetěz | retez.mp3 |
| ředkvička | redkvicka.mp3 |
| řeka | reka.mp3 |
| řízek | rizek.mp3 |
| řidič | ridic.mp3 |
| slon | slon.mp3 |
| sova | sova.mp3 |
| slunce | slunce.mp3 |
| strom | strom.mp3 |
| stůl | stul.mp3 |
| sýr | syr.mp3 |
| srdce | srdce.mp3 |
| sněhulák | snehulak.mp3 |
| sáně | sane.mp3 |
| sekera | sekera.mp3 |
| slepice | slepice.mp3 |
| sklenice | sklenice.mp3 |
| sluchátka | sluchatka.mp3 |
| stan | stan.mp3 |
| svíčka | svicka.mp3 |
| sukně | sukne.mp3 |
| svetr | svetr.mp3 |
| sendvič | sendvic.mp3 |
| skluzavka | skluzavka.mp3 |
| skříň | skrin.mp3 |
| stonožka | stonozka.mp3 |
| strašák | strasak.mp3 |
| sušenka | susenka.mp3 |
| semafor | semafor.mp3 |
| sirka | sirka.mp3 |
| slánka | slanka.mp3 |
| slunečnice | slunecnice.mp3 |
| salát | salat.mp3 |
| střecha | strecha.mp3 |
| schody | schody.mp3 |
| šála | sala.mp3 |
| šroubovák | sroubovak.mp3 |
| šachy | sachy.mp3 |
| šiška | siska.mp3 |
| švestka | svestka.mp3 |
| škola | skola.mp3 |
| šaty | saty.mp3 |
| štít | stit.mp3 |
| šíp | sip.mp3 |
| tygr | tygr.mp3 |
| traktor | traktor.mp3 |
| třešeň | tresen.mp3 |
| talíř | talir.mp3 |
| telefon | telefon.mp3 |
| televize | televize.mp3 |
| tulipán | tulipan.mp3 |
| tučňák | tucnak.mp3 |
| taška | taska.mp3 |
| trubka | trubka.mp3 |
| tužka | tuzka.mp3 |
| tramvaj | tramvaj.mp3 |
| trampolína | trampolina.mp3 |
| tričko | tricko.mp3 |
| trychtýř | trychtyr.mp3 |
| tukan | tukan.mp3 |
| tuleň | tulen.mp3 |
| teploměr | teplomer.mp3 |
| terč | terc.mp3 |
| tank | tank.mp3 |
| ucho | ucho.mp3 |
| ubrousek | ubrousek.mp3 |
| úl | ul.mp3 |
| uzel | uzel.mp3 |
| umyvadlo | umyvadlo.mp3 |
| ubrus | ubrus.mp3 |
| vlak | vlak.mp3 |
| váza | vaza.mp3 |
| velryba | velryba.mp3 |
| veverka | veverka.mp3 |
| vidlička | vidlicka.mp3 |
| vlajka | vlajka.mp3 |
| vlk | vlk.mp3 |
| vosa | vosa.mp3 |
| vana | vana.mp3 |
| vějíř | vejir.mp3 |
| velbloud | velbloud.mp3 |
| věšák | vesak.mp3 |
| vydra | vydra.mp3 |
| vysavač | vysavac.mp3 |
| váhy | vahy.mp3 |
| věž | vez.mp3 |
| volant | volant.mp3 |
| včela | vcela.mp3 |
| vrtačka | vrtacka.mp3 |
| větev | vetev.mp3 |
| vagon | vagon.mp3 |
| voják | vojak.mp3 |
| vejce | vejce.mp3 |
| vlasy | vlasy.mp3 |
| xylofon | xylofon.mp3 |
| zebra | zebra.mp3 |
| zámek | zamek.mp3 |
| zajíc | zajic.mp3 |
| zub | zub.mp3 |
| zvon | zvon.mp3 |
| zmrzlina | zmrzlina.mp3 |
| zrcadlo | zrcadlo.mp3 |
| zástěra | zastera.mp3 |
| zip | zip.mp3 |
| záchod | zachod.mp3 |
| zahrada | zahrada.mp3 |
| zvonek | zvonek.mp3 |
| žába | zaba.mp3 |
| žirafa | zirafa.mp3 |
| žralok | zralok.mp3 |
| žebřík | zebrik.mp3 |
| želva | zelva.mp3 |
| žehlička | zehlicka.mp3 |
| žalud | zalud.mp3 |
| žárovka | zarovka.mp3 |
| židle | zidle.mp3 |
| žížala | zizala.mp3 |
| žezlo | zezlo.mp3 |
| kytice | kytice.mp3 |
| zeď | zed.mp3 |
| hodinky | hodinky.mp3 |
| bazén | bazen.mp3 |
| hřiště | hriste.mp3 |
| houpačka | houpacka.mp3 |
| malíř | malir.mp3 |
| zpěvák | zpevak.mp3 |
| námořník | namornik.mp3 |
| pilot | pilot.mp3 |
| víla | vila.mp3 |
| duch | duch.mp3 |
| vážka | vazka.mp3 |
| štír | stir.mp3 |
| hranolky | hranolky.mp3 |
| chlebíček | chlebicek.mp3 |
| džus | dzus.mp3 |
| broskev | broskev.mp3 |
| špenát | spenat.mp3 |
| česnek | cesnek.mp3 |
| šunka | sunka.mp3 |
| vánočka | vanocka.mp3 |
| šátek | satek.mp3 |
| pásek | pasek.mp3 |
| veslo | veslo.mp3 |
| vzducholoď | vzducholod.mp3 |
| baterie | baterie.mp3 |
| lepidlo | lepidlo.mp3 |
| sešit | sesit.mp3 |
| tabule | tabule.mp3 |
| police | police.mp3 |
| branka | branka.mp3 |
| naběračka | naberacka.mp3 |
| váleček | valecek.mp3 |
| lustr | lustr.mp3 |
| anténa | antena.mp3 |
| vodopád | vodopad.mp3 |
| tráva | trava.mp3 |
| poušť | poust.mp3 |
| planeta | planeta.mp3 |
| automat | automat.mp3 |
| cop | cop.mp3 |
| celer | celer.mp3 |
| cyklista | cyklista.mp3 |
| cisterna | cisterna.mp3 |
| cívka | civka.mp3 |
| čtyřkolka | ctyrkolka.mp3 |
| čelovka | celovka.mp3 |
| chňapka | chnapka.mp3 |
| jezevec | jezevec.mp3 |
| náhrdelník | nahrdelnik.mp3 |
| náprstek | naprstek.mp3 |
| náplast | naplast.mp3 |
| nádraží | nadrazi.mp3 |
| oblek | oblek.mp3 |
| obruč | obruc.mp3 |
| ozdoba | ozdoba.mp3 |
| ohňostroj | ohnostroj.mp3 |
| řezník | reznik.mp3 |
| řidítka | riditka.mp3 |
| šašek | sasek.mp3 |
| šuplík | suplik.mp3 |
| šlehačka | slehacka.mp3 |
| šampon | sampon.mp3 |
| šroub | sroub.mp3 |
| švihadlo | svihadlo.mp3 |
| štětec | stetec.mp3 |
| zubař | zubar.mp3 |
| závěs | zaves.mp3 |
| zábradlí | zabradli.mp3 |
| žokej | zokej.mp3 |
| želé | zele.mp3 |
| ženich | zenich.mp3 |
| žonglér | zongler.mp3 |
| rozinky | rozinky.mp3 |
| rýže | ryze.mp3 |
| rohožka | rohozka.mp3 |
| grep | grep.mp3 |
| guláš | gulas.mp3 |
| gumička | gumicka.mp3 |
| wafle | wafle.mp3 |
| eskalátor | eskalator.mp3 |
| uhlí | uhli.mp3 |
| jablko | jablko.mp3 |
| župan | zupan.mp3 |
| žíněnka | zinenka.mp3 |
| chůdy | chudy.mp3 |
| orchidej | orchidej.mp3 |
| obilí | obili.mp3 |
| olej | olej.mp3 |
| šipky | sipky.mp3 |
| šnorchl | snorchl.mp3 |
| jízdenka | jizdenka.mp3 |
| chlebník | chlebnik.mp3 |
| činka | cinka.mp3 |
| faraon | faraon.mp3 |
| dudy | dudy.mp3 |
| taxík | taxik.mp3 |
| tuba | tuba.mp3 |
| loupežník | loupeznik.mp3 |
| akrobat | akrobat.mp3 |
| autosedačka | autosedacka.mp3 |
| cukřenka | cukrenka.mp3 |
| číšník | cisnik.mp3 |
| chodítko | choditko.mp3 |
| ořezávátko | orezavatko.mp3 |
| obvaz | obvaz.mp3 |
| špendlík | spendlik.mp3 |
| trojkolka | trojkolka.mp3 |
| trumpeta | trumpeta.mp3 |
| lavice | lavice.mp3 |
| dlaždice | dlazdice.mp3 |

## Unused (orphan) files - NOT regenerated, NOT deleted (still old Vlasta audio); their word/syllable is not in the dataset (words_first/words_last: also ids not in words.json)
- `letters/` (0): none
- `syllables/` (153): aa.mp3, ar.mp3, baak.mp3, bal.mp3, bil.mp3, blek.mp3, bloud.mp3, bov.mp3, bra.mp3, braz.mp3, brou.mp3, bru.mp3, brucx.mp3, brxiik.mp3, buch.mp3, cas.mp3, chla.mp3, chmel.mp3, chra.mp3, chraam.mp3, chro.mp3, chroust.mp3, chry.mp3, cvicx.mp3, cxiik.mp3, cxka.mp3, cxko.mp3, cxtve.mp3, cy.mp3, dec.mp3, deesxtx.mp3, deon.mp3, diaa.mp3, dlanx.mp3, dle.mp3, dli.mp3, dlii.mp3, dliik.mp3, dlo.mp3, dok.mp3, dr.mp3, dul.mp3, dxaak.mp3, e.mp3, elf.mp3, erb.mp3, fle.mp3, fot.mp3, fou.mp3, gaucx.mp3, gleer.mp3, gluu.mp3, gresxt.mp3, het.mp3, hli.mp3, hlii.mp3, hliik.mp3, hnii.mp3, hro.mp3, hru.mp3, hrxi.mp3, hvex.mp3, i.mp3, jab.mp3, jach.mp3, jez.mp3, jme.mp3, kacx.mp3, karx.mp3, ket.mp3, kli.mp3, kno.mp3, kor.mp3, kr.mp3, kro.mp3, krxe.mp3, kvaa.mp3, kvi.mp3, las.mp3, lep.mp3, lin.mp3, lko.mp3, lonx.mp3, maak.mp3, miicx.mp3, myy.mp3, nis.mp3, nos.mp3, pal.mp3, panz.mp3, pec.mp3, pek.mp3, piir.mp3, pliik.mp3, plo.mp3, pr.mp3, ryb.mp3, ryycx.mp3, send.mp3, ska.mp3, skev.mp3, sky.mp3, sliik.mp3, slo.mp3, smexv.mp3, smi.mp3, snek.mp3, sob.mp3, sta.mp3, stek.mp3, stel.mp3, sten.mp3, ster.mp3, stiit.mp3, str.mp3, stro.mp3, strov.mp3, stru.mp3, suv.mp3, svii.mp3, sxe.mp3, sxi.mp3, sxii.mp3, sxim.mp3, sxka.mp3, sxnek.mp3, sxpa.mp3, sxtexr.mp3, tan.mp3, taz.mp3, tlap.mp3, tlas.mp3, tov.mp3, tra.mp3, tri.mp3, tron.mp3, trou.mp3, tul.mp3, uu.mp3, zaas.mp3, zan.mp3, zda.mp3, zdo.mp3, zev.mp3, zli.mp3, zlo.mp3, zmr.mp3, zna.mp3, znacx.mp3, zny.mp3, zxaak.mp3, zxon.mp3, zxvyy.mp3
- `words/` (100): abeceda.mp3, akordeon.mp3, aktovka.mp3, alpaka.mp3, andulka.mp3, angrest.mp3, arasidy.mp3, archa.mp3, atlas.mp3, babovka.mp3, buchta.mp3, carodej.mp3, cedule.mp3, celo.mp3, cepice.mp3, chalupa.mp3, chlapec.mp3, chmel.mp3, chodidlo.mp3, chodule.mp3, chram.mp3, chrobak.mp3, chroust.mp3, chryzantema.mp3, cise.mp3, citera.mp3, ctverec.mp3, cukr.mp3, cumak.mp3, cvicky.mp3, cylindr.mp3, dest.mp3, dlan.mp3, doktor.mp3, elf.mp3, emu.mp3, erb.mp3, eso.mp3, fotbal.mp3, fousy.mp3, gauc.mp3, gondola.mp3, gorila.mp3, gumaky.mp3, jablon.mp3, jachta.mp3, jerabiny.mp3, jezdec.mp3, jezero.mp3, jezevcik.mp3, jmeli.mp3, kosile.mp3, loket.mp3, lokomotiva.mp3, lovec.mp3, mic.mp3, mince.mp3, mobil.mp3, nakladak.mp3, nalepka.mp3, nehet.mp3, nos.mp3, nota.mp3, nudle.mp3, ocas.mp3, orangutan.mp3, osmicka.mp3, ostruzina.mp3, otaznik.mp3, papir.mp3, radiator.mp3, rameno.mp3, rasy.mp3, rericha.mp3, rybnik.mp3, ryc.mp3, simpanz.mp3, sipek.mp3, snek.mp3, sob.mp3, spagety.mp3, tenisky.mp3, tlapka.mp3, trakar.mp3, trouba.mp3, trpaslik.mp3, ukulele.mp3, ulita.mp3, usmev.mp3, vrtulnik.mp3, zak.mp3, zaluzie.mp3, zapalka.mp3, zasuvka.mp3, zatka.mp3, zeli.mp3, znacka.mp3, zobak.mp3, zubr.mp3, zvykacka.mp3
- `words_first/` (24): akordeon.mp3, andulka.mp3, archa.mp3, atlas.mp3, carodej.mp3, chalupa.mp3, cukr.mp3, cylindr.mp3, fousy.mp3, gondola.mp3, gumaky.mp3, jablon.mp3, jachta.mp3, jezdec.mp3, jezevcik.mp3, lovec.mp3, nalepka.mp3, radiator.mp3, trakar.mp3, ukulele.mp3, zapalka.mp3, zatka.mp3, zobak.mp3, zvykacka.mp3
- `words_last/` (20): andulka.mp3, archa.mp3, atlas.mp3, carodej.mp3, fousy.mp3, gondola.mp3, gumaky.mp3, jablon.mp3, jachta.mp3, jezdec.mp3, jezevcik.mp3, lovec.mp3, nalepka.mp3, radiator.mp3, trakar.mp3, ukulele.mp3, zapalka.mp3, zatka.mp3, zobak.mp3, zvykacka.mp3
