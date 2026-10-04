# Audio texts (ElevenLabs, text-to-speech skill; mp3_44100_192 = 44.1 kHz / 192 kbps mono; raw, no cut / stretch / trim / fade)

Regenerated 2026-10-04 by `endgame2/AGENTS/Tasks/20261004_063630_RegenerateLetterAppsSoundsElevenLabs/scripts/` (`build_jobs.py`, `run_tts.py`, `install.py`, `gen_audio_texts.py`); request: `_LetterTraining_PROMPTS.md` / "ElevenLabs regeneration of all sounds (2026-10-04)". Replaces the Vlasta/edge-tts audio and all post-processing of earlier runs.

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

## Syllables (`syllables/`) - ONE unified form per syllable
Request (user decision after the listening trials, 2026-10-04): text `"<syllable>."` WITH a trailing period + next_text `"jako ve slově <carrier word>"`, NO previous_text (the earlier `"Slabika:"` previous_text is no longer used), `language_code` cs, raw (no trim / fade / post-processing); a flagged take (cut-off, near-silent, very short) was retaken up to 3 more times. The 16 vowel-less syllables (bl, br, chl, cvr, fr, gr, hr, mr, prs, prst, srd, tr, vlk, vr, zmrz, zr) (user decision 2026-10-04 after listening to 32 variants): plain letters (NO slash-IPA) with a trailing COMMA instead of a period (`"hr,"`), next_text `"jako ve slově <carrier word>"`, NO previous_text, otherwise identical (variant `_plain_comma_t2`; hr/br/tr/zr are that exact trial file). EXCEPTION (user decision 2026-10-04 after listening to the Misread trial): sy, lec, xy, pid, cvr, xo, uk, xi are generated from slash-IPA text (`"/<IPA>/."`, e.g. `"/sɪ/."`, `"/lɛts/."`; cvr no longer plain-letter comma), same next_text, no previous_text, raw; file = the trial file `<syl>_V2_ipa_t1.mp3` (take 1, byte copy; see `ListenSamples/Misread/`). No separate mid-word / word-end forms. Carrier = a dataset word containing the syllable (source `dataset-syllable` = it is a syllable of the word, `dataset-substring` = substring only) or a manually chosen common word (`manual`; many synthetic syllables are not Czech syllables at all, so the carrier only shares the letters). Real syllables: 598, synthetic: 231. Same data as `syllable_carrier_words.json` in the task folder.

EXCEPTION 2 (user decisions 2026-10-04 after listening to the IpaSlashContext and Q4Suspects trials, recipe Q4): ap, mat, uk, hvěz, naut, nec, min, qe, rov, tec, svíč, špend are generated with text `"<IPA letters>,"` (ap, mat, uk = the letters themselves; hvěz = ɦvjɛs, naut = naʊt, nec = nɛts, min = mɪn, qe = kvɛ, rov = rɔf, tec = tɛts, svíč = sviːtʃ, špend = ʃpɛnd; trailing comma, no slashes in the text), previous_text `"/"` and next_text `"/ jako ve slově <carrier>"` (the slashes are in previous_text and next_text), `language_code` cs, raw; file = the trial file `<syl>_Q4_t1.mp3` (take 1, byte copy; see `ListenSamples/IpaSlashContext/` for ap, mat, uk and `ListenSamples/Q4Suspects/` for the other nine). Overrides the slash-IPA text for uk and the plain period text for the others.

EXCEPTION 3 (provenance, user choice of takes): the 11 syllables pe, to, a, ho, ki, hi, ché, qu, nú, ďu, ut are NOT plain regenerations but byte copies of the user-approved trial files `ListenSamples/NoPrevious/<item>_N1_noprev_period_take2.mp3` (same plain recipe: text `"<syl>."` + next_text, no previous_text; the user chose these takes). Marked "[byte copy of trial file]" in the table.

| syllable | kind | text | carrier word | carrier source | file |
|---|---|---|---|---|---|
| a | real | a.  [byte copy of trial file a_N1_noprev_period_take2.mp3] | ananas | dataset-syllable | a.mp3 |
| ak | real | ak. | akrobat | dataset-syllable | ak.mp3 |
| an | real | an. | anděl | dataset-syllable | an.mp3 |
| as | real | as. | astronaut | dataset-syllable | as.mp3 |
| au | real | au. | auto | dataset-syllable | au.mp3 |
| ba | real | ba. | bagr | dataset-syllable | ba.mp3 |
| bat | real | bat. | akrobat | dataset-syllable | bat.mp3 |
| bař | real | bař. | zubař | dataset-syllable | barx.mp3 |
| be | real | be. | beran | dataset-syllable | be.mp3 |
| ben | real | ben. | buben | dataset-syllable | ben.mp3 |
| bi | real | bi. | obilí | dataset-syllable | bi.mp3 |
| bič | real | bič. | babička | dataset-syllable | bicx.mp3 |
| bl | real | bl, | jablko | dataset-syllable | bl.mp3 |
| blesk | real | blesk. | blesk | dataset-syllable | blesk.mp3 |
| bo | real | bo. | bota | dataset-syllable | bo.mp3 |
| bon | real | bon. | bonbon | dataset-syllable | bon.mp3 |
| bot | real | bot. | robot | dataset-syllable | bot.mp3 |
| bouk | real | bouk. | klobouk | dataset-syllable | bouk.mp3 |
| br | real | br, | bobr | dataset-syllable | br.mp3 |
| brad | real | brad. | zábradlí | dataset-syllable | brad.mp3 |
| bram | real | bram. | brambora | dataset-syllable | bram.mp3 |
| bran | real | bran. | branka | dataset-syllable | bran.mp3 |
| bro | real | bro. | brokolice | dataset-syllable | bro.mp3 |
| bros | real | bros. | broskev | dataset-syllable | bros.mp3 |
| brus | real | brus. | brusle | dataset-syllable | brus.mp3 |
| brá | real | brá. | brána | dataset-syllable | braa.mp3 |
| brý | real | brý. | brýle | dataset-syllable | bryy.mp3 |
| bu | real | bu. | buben | dataset-syllable | bu.mp3 |
| bun | real | bun. | bunda | dataset-syllable | bun.mp3 |
| bur | real | bur. | hamburger | dataset-syllable | bur.mp3 |
| bus | real | bus. | glóbus | dataset-syllable | bus.mp3 |
| buť | real | buť. | labuť | dataset-syllable | butx.mp3 |
| bál | real | bál. | obálka | dataset-syllable | baal.mp3 |
| bář | real | bář. | rybář | dataset-syllable | baarx.mp3 |
| bí | real | bí. | chlebíček | dataset-syllable | bii.mp3 |
| bík | real | bík. | hřebík | dataset-syllable | biik.mp3 |
| bíz | real | bíz. | rybíz | dataset-syllable | biiz.mp3 |
| býk | real | býk. | býk | dataset-syllable | byyk.mp3 |
| bě | real | bě. | hrábě | dataset-syllable | bex.mp3 |
| bři | real | bři. | břicho | dataset-syllable | brxi.mp3 |
| bří | real | bří. | bříza | dataset-syllable | brxii.mp3 |
| cad | real | cad. | zrcadlo | dataset-syllable | cad.mp3 |
| ce | real | ce. | ovce | dataset-syllable | ce.mp3 |
| ced | real | ced. | cedník | dataset-syllable | ced.mp3 |
| cer | real | cer. | lucerna | dataset-syllable | cer.mp3 |
| ces | real | ces. | cesta | dataset-syllable | ces.mp3 |
| cez | real | cez. | princezna | dataset-syllable | cez.mp3 |
| cha | real | cha. | chata | dataset-syllable | cha.mp3 |
| chař | real | chař. | kuchař | dataset-syllable | charx.mp3 |
| chi | real | chi. | orchidej | dataset-syllable | chi.mp3 |
| chl | real | chl, | šnorchl | dataset-syllable | chl.mp3 |
| chle | real | chle. | chlebíček | dataset-syllable | chle.mp3 |
| chleb | real | chleb. | chlebník | dataset-syllable | chleb.mp3 |
| chléb | real | chléb. | chléb | dataset-syllable | chleeb.mp3 |
| cho | real | cho. | ucho | dataset-syllable | cho.mp3 |
| chod | real | chod. | záchod | dataset-syllable | chod.mp3 |
| chras | real | chras. | chrastítko | dataset-syllable | chras.mp3 |
| chy | real | chy. | šachy | dataset-syllable | chy.mp3 |
| chát | real | chát. | sluchátka | dataset-syllable | chaat.mp3 |
| chňap | real | chňap. | chňapka | dataset-syllable | chnxap.mp3 |
| chřest | real | chřest. | chřest | dataset-syllable | chrxest.mp3 |
| chů | real | chů. | chůdy | dataset-syllable | chuo.mp3 |
| ci | real | ci. | cibule | dataset-syllable | ci.mp3 |
| cih | real | cih. | cihla | dataset-syllable | cih.mp3 |
| cir | real | cir. | cirkus | dataset-syllable | cir.mp3 |
| cis | real | cis. | cisterna | dataset-syllable | cis.mp3 |
| cit | real | cit. | citron | dataset-syllable | cit.mp3 |
| cop | real | cop. | cop | dataset-syllable | cop.mp3 |
| cu | real | cu. | cuketa | dataset-syllable | cu.mp3 |
| cuk | real | cuk. | cukřenka | dataset-syllable | cuk.mp3 |
| cvr | real | /tsvr̩/. | cvrček | dataset-syllable | cvr.mp3 |
| cyk | real | cyk. | cyklista | dataset-syllable | cyk.mp3 |
| cív | real | cív. | cívka | dataset-syllable | ciiv.mp3 |
| da | real | da. | bunda | dataset-syllable | da.mp3 |
| dač | real | dač. | autosedačka | dataset-syllable | dacx.mp3 |
| de | real | de. | deka | dataset-syllable | de.mp3 |
| dej | real | dej. | orchidej | dataset-syllable | dej.mp3 |
| del | real | del. | delfín | dataset-syllable | del.mp3 |
| den | real | den. | jízdenka | dataset-syllable | den.mp3 |
| dešt | real | dešt. | deštník | dataset-syllable | desxt.mp3 |
| di | real | di. | hodiny | dataset-syllable | di.mp3 |
| din | real | din. | hodinky | dataset-syllable | din.mp3 |
| dio | real | dio. | rádio | dataset-syllable | dio.mp3 |
| dič | real | dič. | řidič | dataset-syllable | dicx.mp3 |
| dlaž | real | dlaž. | dlaždice | dataset-syllable | dlazx.mp3 |
| do | real | do. | dopis | dataset-syllable | do.mp3 |
| dort | real | dort. | dort | dataset-syllable | dort.mp3 |
| dra | real | dra. | nádraží | dataset-syllable | dra.mp3 |
| drak | real | drak. | drak | dataset-syllable | drak.mp3 |
| du | real | du. | duha | dataset-syllable | du.mp3 |
| duch | real | duch. | duch | dataset-syllable | duch.mp3 |
| dud | real | dud. | dudlík | dataset-syllable | dud.mp3 |
| dve | real | dve. | dveře | dataset-syllable | dve.mp3 |
| dvič | real | dvič. | sendvič | dataset-syllable | dvicx.mp3 |
| dy | real | dy. | dudy | dataset-syllable | dy.mp3 |
| dá | real | dá. | dárek | dataset-syllable | daa.mp3 |
| dák | real | dák. | padák | dataset-syllable | daak.mp3 |
| dít | real | dít. | řidítka | dataset-syllable | diit.mp3 |
| dív | real | dív. | dívka | dataset-syllable | diiv.mp3 |
| dú | real | dú. | medúza | dataset-syllable | duu.mp3 |
| dý | real | dý. | dýně | dataset-syllable | dyy.mp3 |
| dým | real | dým. | dýmka | dataset-syllable | dyym.mp3 |
| dě | real | dě. | dělo | dataset-syllable | dex.mp3 |
| děj | real | děj. | čarodějnice | dataset-syllable | dexj.mp3 |
| děl | real | děl. | anděl | dataset-syllable | dexl.mp3 |
| dře | real | dře. | dřevo | dataset-syllable | drxe.mp3 |
| dům | real | dům. | dům | dataset-syllable | duom.mp3 |
| džbán | real | džbán. | džbán | dataset-syllable | dzxbaan.mp3 |
| džus | real | džus. | džus | dataset-syllable | dzxus.mp3 |
| es | real | es. | eskalátor | dataset-syllable | es.mp3 |
| fa | real | fa. | harfa | dataset-syllable | fa.mp3 |
| far | real | far. | farma | dataset-syllable | far.mp3 |
| fi | real | fi. | fixa | dataset-syllable | fi.mp3 |
| fial | real | fial. | fialka | dataset-syllable | fial.mp3 |
| flét | real | flét. | flétna | dataset-syllable | fleet.mp3 |
| fo | real | fo. | fotoaparát | dataset-syllable | fo.mp3 |
| fon | real | fon. | fontána | dataset-syllable | fon.mp3 |
| for | real | for. | semafor | dataset-syllable | for.mp3 |
| fr | real | fr, | kufr | dataset-syllable | fr.mp3 |
| fret | real | fret. | fretka | dataset-syllable | fret.mp3 |
| fén | real | fén. | fén | dataset-syllable | feen.mp3 |
| fík | real | fík. | fík | dataset-syllable | fiik.mp3 |
| fín | real | fín. | delfín | dataset-syllable | fiin.mp3 |
| ga | real | ga. | garáž | dataset-syllable | ga.mp3 |
| ge | real | ge. | gepard | dataset-syllable | ge.mp3 |
| ger | real | ger. | hamburger | dataset-syllable | ger.mp3 |
| gló | real | gló. | glóbus | dataset-syllable | gloo.mp3 |
| gon | real | gon. | vagon | dataset-syllable | gon.mp3 |
| gong | real | gong. | gong | dataset-syllable | gong.mp3 |
| gr | real | gr, | bagr | dataset-syllable | gr.mp3 |
| grep | real | grep. | grep | dataset-syllable | grep.mp3 |
| gril | real | gril. | gril | dataset-syllable | gril.mp3 |
| gu | real | gu. | guma | dataset-syllable | gu.mp3 |
| gurt | real | gurt. | jogurt | dataset-syllable | gurt.mp3 |
| ha | real | ha. | duha | dataset-syllable | ha.mp3 |
| had | real | had. | had | dataset-syllable | had.mp3 |
| ham | real | ham. | hamburger | dataset-syllable | ham.mp3 |
| har | real | har. | harfa | dataset-syllable | har.mp3 |
| hač | real | hač. | šlehačka | dataset-syllable | hacx.mp3 |
| hel | real | hel. | helma | dataset-syllable | hel.mp3 |
| hev | real | hev. | láhev | dataset-syllable | hev.mp3 |
| heň | real | heň. | oheň | dataset-syllable | henx.mp3 |
| hla | real | hla. | hlava | dataset-syllable | hla.mp3 |
| hled | real | hled. | dalekohled | dataset-syllable | hled.mp3 |
| hníz | real | hníz. | hnízdo | dataset-syllable | hniiz.mp3 |
| ho | real | ho.  [byte copy of trial file ho_N1_noprev_period_take2.mp3] | hora | dataset-syllable | ho.mp3 |
| hou | real | hou. | houba | dataset-syllable | hou.mp3 |
| hous | real | hous. | housle | dataset-syllable | hous.mp3 |
| hož | real | hož. | rohožka | dataset-syllable | hozx.mp3 |
| hr | real | hr, | hrnek | dataset-syllable | hr.mp3 |
| hra | real | hra. | zahrada | dataset-syllable | hra.mp3 |
| hrad | real | hrad. | hrad | dataset-syllable | hrad.mp3 |
| hroch | real | hroch. | hroch | dataset-syllable | hroch.mp3 |
| hroz | real | hroz. | hrozny | dataset-syllable | hroz.mp3 |
| hruš | real | hruš. | hruška | dataset-syllable | hrusx.mp3 |
| hrá | real | hrá. | hrábě | dataset-syllable | hraa.mp3 |
| hu | real | hu. | husa | dataset-syllable | hu.mp3 |
| hvěz | real | ɦvjɛs,  [Q4: previous_text /, next_text /...] | hvězda | dataset-syllable | hvexz.mp3 |
| hy | real | hy. | váhy | dataset-syllable | hy.mp3 |
| hár | real | hár. | pohár | dataset-syllable | haar.mp3 |
| hře | real | hře. | hřeben | dataset-syllable | hrxe.mp3 |
| hřiš | real | hřiš. | hřiště | dataset-syllable | hrxisx.mp3 |
| ig | real | ig. | iglú | dataset-syllable | ig.mp3 |
| in | real | in. | injekce | dataset-syllable | in.mp3 |
| ja | real | ja. | jazyk | dataset-syllable | ja.mp3 |
| je | real | je. | ježek | dataset-syllable | je.mp3 |
| jed | real | jed. | jednorožec | dataset-syllable | jed.mp3 |
| jeh | real | jeh. | jehla | dataset-syllable | jeh.mp3 |
| jek | real | jek. | obojek | dataset-syllable | jek.mp3 |
| jes | real | jes. | jeskyně | dataset-syllable | jes.mp3 |
| ješ | real | ješ. | ještěrka | dataset-syllable | jesx.mp3 |
| jo | real | jo. | jojo | dataset-syllable | jo.mp3 |
| ják | real | ják. | maják | dataset-syllable | jaak.mp3 |
| jíc | real | jíc. | zajíc | dataset-syllable | jiic.mp3 |
| jíz | real | jíz. | jízdenka | dataset-syllable | jiiz.mp3 |
| jíř | real | jíř. | vějíř | dataset-syllable | jiirx.mp3 |
| ka | real | ka. | deka | dataset-syllable | ka.mp3 |
| kach | real | kach. | kachna | dataset-syllable | kach.mp3 |
| kal | real | kal. | kalhoty | dataset-syllable | kal.mp3 |
| kan | real | kan. | tukan | dataset-syllable | kan.mp3 |
| ke | real | ke. | cuketa | dataset-syllable | ke.mp3 |
| kej | real | kej. | žokej | dataset-syllable | kej.mp3 |
| kev | real | kev. | mrkev | dataset-syllable | kev.mp3 |
| kla | real | kla. | klavír | dataset-syllable | kla.mp3 |
| klo | real | klo. | klobouk | dataset-syllable | klo.mp3 |
| klíč | real | klíč. | klíč | dataset-syllable | kliicx.mp3 |
| kni | real | kni. | kniha | dataset-syllable | kni.mp3 |
| ko | real | ko. | oko | dataset-syllable | ko.mp3 |
| kol | real | kol. | čtyřkolka | dataset-syllable | kol.mp3 |
| kos | real | kos. | kostel | dataset-syllable | kos.mp3 |
| koust | real | koust. | inkoust | dataset-syllable | koust.mp3 |
| koč | real | koč. | kočka | dataset-syllable | kocx.mp3 |
| koš | real | koš. | koš | dataset-syllable | kosx.mp3 |
| kra | real | kra. | krabice | dataset-syllable | kra.mp3 |
| krá | real | krá. | kráva | dataset-syllable | kraa.mp3 |
| král | real | král. | král | dataset-syllable | kraal.mp3 |
| ku | real | ku. | kuře | dataset-syllable | ku.mp3 |
| kur | real | kur. | okurka | dataset-syllable | kur.mp3 |
| kus | real | kus. | cirkus | dataset-syllable | kus.mp3 |
| kvič | real | kvič. | ředkvička | dataset-syllable | kvicx.mp3 |
| kvě | real | kvě. | květina | dataset-syllable | kvex.mp3 |
| ky | real | ky. | nůžky | dataset-syllable | ky.mp3 |
| ká | real | ká. | kámen | dataset-syllable | kaa.mp3 |
| křes | real | křes. | křeslo | dataset-syllable | krxes.mp3 |
| kůň | real | kůň. | kůň | dataset-syllable | kuonx.mp3 |
| la | real | la. | lano | dataset-syllable | la.mp3 |
| lam | real | lam. | lampa | dataset-syllable | lam.mp3 |
| lant | real | lant. | volant | dataset-syllable | lant.mp3 |
| le | real | le. | brýle | dataset-syllable | le.mp3 |
| lec | real | /lɛts/. | palec | dataset-syllable | lec.mp3 |
| led | real | led. | lednička | dataset-syllable | led.mp3 |
| lej | real | lej. | olej | dataset-syllable | lej.mp3 |
| lek | real | lek. | oblek | dataset-syllable | lek.mp3 |
| len | real | len. | jelen | dataset-syllable | len.mp3 |
| leon | real | leon. | chameleon | dataset-syllable | leon.mp3 |
| ler | real | ler. | celer | dataset-syllable | ler.mp3 |
| les | real | les. | les | dataset-syllable | les.mp3 |
| lev | real | lev. | lev | dataset-syllable | lev.mp3 |
| leň | real | leň. | tuleň | dataset-syllable | lenx.mp3 |
| li | real | li. | oliva | dataset-syllable | li.mp3 |
| lis | real | lis. | cyklista | dataset-syllable | lis.mp3 |
| list | real | list. | list | dataset-syllable | list.mp3 |
| lič | real | lič. | vidlička | dataset-syllable | licx.mp3 |
| liš | real | liš. | liška | dataset-syllable | lisx.mp3 |
| lo | real | lo. | dělo | dataset-syllable | lo.mp3 |
| lok | real | lok. | žralok | dataset-syllable | lok.mp3 |
| los | real | los. | los | dataset-syllable | los.mp3 |
| lot | real | lot. | pilot | dataset-syllable | lot.mp3 |
| lou | real | lou. | loupežník | dataset-syllable | lou.mp3 |
| loud | real | loud. | velbloud | dataset-syllable | loud.mp3 |
| loun | real | loun. | meloun | dataset-syllable | loun.mp3 |
| lout | real | lout. | loutka | dataset-syllable | lout.mp3 |
| lov | real | lov. | čelovka | dataset-syllable | lov.mp3 |
| loď | real | loď. | loď | dataset-syllable | lodx.mp3 |
| lu | real | lu. | lupa | dataset-syllable | lu.mp3 |
| lub | real | lub. | holub | dataset-syllable | lub.mp3 |
| lud | real | lud. | žalud | dataset-syllable | lud.mp3 |
| luk | real | luk. | luk | dataset-syllable | luk.mp3 |
| lus | real | lus. | lustr | dataset-syllable | lus.mp3 |
| ly | real | ly. | lyže | dataset-syllable | ly.mp3 |
| lá | real | lá. | láhev | dataset-syllable | laa.mp3 |
| lák | real | lák. | čmelák | dataset-syllable | laak.mp3 |
| lát | real | lát. | salát | dataset-syllable | laat.mp3 |
| láč | real | láč. | koláč | dataset-syllable | laacx.mp3 |
| láš | real | láš. | guláš | dataset-syllable | laasx.mp3 |
| lé | real | lé. | želé | dataset-syllable | lee.mp3 |
| lér | real | lér. | žonglér | dataset-syllable | leer.mp3 |
| lév | real | lév. | polévka | dataset-syllable | leev.mp3 |
| lí | real | lí. | uhlí | dataset-syllable | lii.mp3 |
| lík | real | lík. | balík | dataset-syllable | liik.mp3 |
| lís | real | lís. | čtyřlístek | dataset-syllable | liis.mp3 |
| líř | real | líř. | talíř | dataset-syllable | liirx.mp3 |
| lón | real | lón. | balón | dataset-syllable | loon.mp3 |
| lú | real | lú. | iglú | dataset-syllable | luu.mp3 |
| lží | real | lží. | lžíce | dataset-syllable | lzxii.mp3 |
| ma | real | ma. | guma | dataset-syllable | ma.mp3 |
| mag | real | mag. | magnet | dataset-syllable | mag.mp3 |
| mat | real | mat,  [Q4: previous_text /, next_text /...] | automat | dataset-syllable | mat.mp3 |
| maš | real | maš. | mašle | dataset-syllable | masx.mp3 |
| me | real | me. | meloun | dataset-syllable | me.mp3 |
| med | real | med. | med | dataset-syllable | med.mp3 |
| mek | real | mek. | zámek | dataset-syllable | mek.mp3 |
| men | real | men. | kámen | dataset-syllable | men.mp3 |
| meč | real | meč. | meč | dataset-syllable | mecx.mp3 |
| mi | real | mi. | miminko | dataset-syllable | mi.mp3 |
| mik | real | mik. | mikrofon | dataset-syllable | mik.mp3 |
| min | real | mɪn,  [Q4: previous_text /, next_text /...] | miminko | dataset-syllable | min.mp3 |
| mis | real | mis. | miska | dataset-syllable | mis.mp3 |
| mič | real | mič. | gumička | dataset-syllable | micx.mp3 |
| mlé | real | mlé. | mléko | dataset-syllable | mlee.mp3 |
| mlýn | real | mlýn. | mlýn | dataset-syllable | mlyyn.mp3 |
| mo | real | mo. | moře | dataset-syllable | mo.mp3 |
| moc | real | moc. | nemocnice | dataset-syllable | moc.mp3 |
| most | real | most. | most | dataset-syllable | most.mp3 |
| mou | real | mou. | moucha | dataset-syllable | mou.mp3 |
| moř | real | moř. | námořník | dataset-syllable | morx.mp3 |
| mr | real | mr, | mrkev | dataset-syllable | mr.mp3 |
| mra | real | mra. | mravenec | dataset-syllable | mra.mp3 |
| mrak | real | mrak. | mrak | dataset-syllable | mrak.mp3 |
| mrož | real | mrož. | mrož | dataset-syllable | mrozx.mp3 |
| muš | real | muš. | mušle | dataset-syllable | musx.mp3 |
| my | real | my. | umyvadlo | dataset-syllable | my.mp3 |
| myš | real | myš. | myš | dataset-syllable | mysx.mp3 |
| más | real | más. | máslo | dataset-syllable | maas.mp3 |
| mýd | real | mýd. | mýdlo | dataset-syllable | myyd.mp3 |
| mě | real | mě. | měsíc | dataset-syllable | mex.mp3 |
| měr | real | měr. | teploměr | dataset-syllable | mexr.mp3 |
| na | real | na. | vana | dataset-syllable | na.mp3 |
| nas | real | nas. | ananas | dataset-syllable | nas.mp3 |
| naut | real | naʊt,  [Q4: previous_text /, next_text /...] | astronaut | dataset-syllable | naut.mp3 |
| ne | real | ne. | netopýr | dataset-syllable | ne.mp3 |
| nec | real | nɛts,  [Q4: previous_text /, next_text /...] | hrnec | dataset-syllable | nec.mp3 |
| nek | real | nek. | hrnek | dataset-syllable | nek.mp3 |
| nen | real | nen. | panenka | dataset-syllable | nen.mp3 |
| net | real | net. | magnet | dataset-syllable | net.mp3 |
| neč | real | neč. | slunečnice | dataset-syllable | necx.mp3 |
| ni | real | ni. | sklenice | dataset-syllable | ni.mp3 |
| nich | real | nich. | ženich | dataset-syllable | nich.mp3 |
| nič | real | nič. | lednička | dataset-syllable | nicx.mp3 |
| no | real | no. | lano | dataset-syllable | no.mp3 |
| nol | real | nol. | hranolky | dataset-syllable | nol.mp3 |
| noč | real | noč. | nočník | dataset-syllable | nocx.mp3 |
| nož | real | nož. | ponožka | dataset-syllable | nozx.mp3 |
| nuk | real | nuk. | nanuk | dataset-syllable | nuk.mp3 |
| ny | real | ny. | hodiny | dataset-syllable | ny.mp3 |
| ná | real | ná. | náramek | dataset-syllable | naa.mp3 |
| nán | real | nán. | banán | dataset-syllable | naan.mp3 |
| nát | real | nát. | špenát | dataset-syllable | naat.mp3 |
| ník | real | ník. | cedník | dataset-syllable | niik.mp3 |
| ně | real | ně. | dýně | dataset-syllable | nex.mp3 |
| něn | real | něn. | žíněnka | dataset-syllable | nexn.mp3 |
| nůž | real | nůž. | nůž | dataset-syllable | nuozx.mp3 |
| o | real | o. | oko | dataset-syllable | o.mp3 |
| ob | real | ob. | obraz | dataset-syllable | ob.mp3 |
| oh | real | oh. | ohňostroj | dataset-syllable | oh.mp3 |
| ok | real | ok. | okno | dataset-syllable | ok.mp3 |
| or | real | or. | orchidej | dataset-syllable | or.mp3 |
| os | real | os. | ostrov | dataset-syllable | os.mp3 |
| ov | real | ov. | ovce | dataset-syllable | ov.mp3 |
| oz | real | oz. | ozdoba | dataset-syllable | oz.mp3 |
| pa | real | pa. | lupa | dataset-syllable | pa.mp3 |
| pan | real | pan. | župan | dataset-syllable | pan.mp3 |
| pard | real | pard. | gepard | dataset-syllable | pard.mp3 |
| pač | real | pač. | houpačka | dataset-syllable | pacx.mp3 |
| pe | real | pe.  [byte copy of trial file pe_N1_noprev_period_take2.mp3] | pero | dataset-syllable | pe.mp3 |
| pes | real | pes. | pes | dataset-syllable | pes.mp3 |
| pež | real | pež. | loupežník | dataset-syllable | pezx.mp3 |
| pi | real | pi. | pila | dataset-syllable | pi.mp3 |
| pid | real | /pɪd/. | lepidlo | dataset-syllable | pid.mp3 |
| pis | real | pis. | dopis | dataset-syllable | pis.mp3 |
| pla | real | pla. | planeta | dataset-syllable | pla.mp3 |
| plast | real | plast. | náplast | dataset-syllable | plast.mp3 |
| plot | real | plot. | plot | dataset-syllable | plot.mp3 |
| po | real | po. | pohár | dataset-syllable | po.mp3 |
| pol | real | pol. | polštář | dataset-syllable | pol.mp3 |
| pon | real | pon. | šampon | dataset-syllable | pon.mp3 |
| pos | real | pos. | postel | dataset-syllable | pos.mp3 |
| pou | real | pou. | papoušek | dataset-syllable | pou.mp3 |
| pouch | real | pouch. | rampouch | dataset-syllable | pouch.mp3 |
| poušť | real | poušť. | poušť | dataset-syllable | pousxtx.mp3 |
| pra | real | pra. | prase | dataset-syllable | pra.mp3 |
| prin | real | prin. | princezna | dataset-syllable | prin.mp3 |
| prs | real | prs, | prsten | dataset-syllable | prs.mp3 |
| prst | real | prst, | prst | dataset-syllable | prst.mp3 |
| pták | real | pták. | pták | dataset-syllable | ptaak.mp3 |
| py | real | py. | pyžamo | dataset-syllable | py.mp3 |
| pá | real | pá. | párek | dataset-syllable | paa.mp3 |
| pád | real | pád. | vodopád | dataset-syllable | paad.mp3 |
| pán | real | pán. | tulipán | dataset-syllable | paan.mp3 |
| pýr | real | pýr. | netopýr | dataset-syllable | pyyr.mp3 |
| ra | real | ra. | hora | dataset-syllable | ra.mp3 |
| raj | real | raj. | rajče | dataset-syllable | raj.mp3 |
| ram | real | ram. | rampouch | dataset-syllable | ram.mp3 |
| ran | real | ran. | beran | dataset-syllable | ran.mp3 |
| ranč | real | ranč. | pomeranč | dataset-syllable | rancx.mp3 |
| raon | real | raon. | faraon | dataset-syllable | raon.mp3 |
| raz | real | raz. | obraz | dataset-syllable | raz.mp3 |
| rač | real | rač. | naběračka | dataset-syllable | racx.mp3 |
| rec | real | rec. | koberec | dataset-syllable | rec.mp3 |
| rek | real | rek. | dárek | dataset-syllable | rek.mp3 |
| rel | real | rel. | orel | dataset-syllable | rel.mp3 |
| rie | real | rie. | baterie | dataset-syllable | rie.mp3 |
| rium | real | rium. | akvárium | dataset-syllable | rium.mp3 |
| ro | real | ro. | pero | dataset-syllable | ro.mp3 |
| roh | real | roh. | rohlík | dataset-syllable | roh.mp3 |
| ron | real | ron. | citron | dataset-syllable | ron.mp3 |
| rou | real | rou. | ubrousek | dataset-syllable | rou.mp3 |
| rov | real | rɔf,  [Q4: previous_text /, next_text /...] | žárovka | dataset-syllable | rov.mp3 |
| rtěn | real | rtěn. | rtěnka | dataset-syllable | rtexn.mp3 |
| ru | real | ru. | ruka | dataset-syllable | ru.mp3 |
| rus | real | rus. | ubrus | dataset-syllable | rus.mp3 |
| ruč | real | ruč. | obruč | dataset-syllable | rucx.mp3 |
| ruš | real | ruš. | beruška | dataset-syllable | rusx.mp3 |
| ry | real | ry. | ryba | dataset-syllable | ry.mp3 |
| rys | real | rys. | rys | dataset-syllable | rys.mp3 |
| rá | real | rá. | rádio | dataset-syllable | raa.mp3 |
| rát | real | rát. | pirát | dataset-syllable | raat.mp3 |
| ráž | real | ráž. | garáž | dataset-syllable | raazx.mp3 |
| rý | real | rý. | rýže | dataset-syllable | ryy.mp3 |
| rů | real | rů. | růže | dataset-syllable | ruo.mp3 |
| rův | real | rův. | borůvka | dataset-syllable | ruov.mp3 |
| sa | real | sa. | husa | dataset-syllable | sa.mp3 |
| sau | real | sau. | dinosaurus | dataset-syllable | sau.mp3 |
| scho | real | scho. | schody | dataset-syllable | scho.mp3 |
| se | real | se. | prase | dataset-syllable | se.mp3 |
| sek | real | sek. | pásek | dataset-syllable | sek.mp3 |
| sel | real | sel. | osel | dataset-syllable | sel.mp3 |
| sen | real | sen. | sendvič | dataset-syllable | sen.mp3 |
| sir | real | sir. | sirka | dataset-syllable | sir.mp3 |
| sič | real | sič. | hasič | dataset-syllable | sicx.mp3 |
| skle | real | skle. | sklenice | dataset-syllable | skle.mp3 |
| sklu | real | sklu. | skluzavka | dataset-syllable | sklu.mp3 |
| skříň | real | skříň. | skříň | dataset-syllable | skrxiinx.mp3 |
| sle | real | sle. | slepice | dataset-syllable | sle.mp3 |
| slon | real | slon. | slon | dataset-syllable | slon.mp3 |
| slu | real | slu. | sluchátka | dataset-syllable | slu.mp3 |
| slun | real | slun. | slunce | dataset-syllable | slun.mp3 |
| slán | real | slán. | slánka | dataset-syllable | slaan.mp3 |
| sně | real | sně. | sněhulák | dataset-syllable | snex.mp3 |
| so | real | so. | sova | dataset-syllable | so.mp3 |
| srd | real | srd, | srdce | dataset-syllable | srd.mp3 |
| stan | real | stan. | stan | dataset-syllable | stan.mp3 |
| sto | real | sto. | stonožka | dataset-syllable | sto.mp3 |
| stra | real | stra. | strašák | dataset-syllable | stra.mp3 |
| stroj | real | stroj. | ohňostroj | dataset-syllable | stroj.mp3 |
| strom | real | strom. | strom | dataset-syllable | strom.mp3 |
| stě | real | stě. | zástěra | dataset-syllable | stex.mp3 |
| stře | real | stře. | střecha | dataset-syllable | strxe.mp3 |
| stůl | real | stůl. | stůl | dataset-syllable | stuol.mp3 |
| su | real | su. | sušenka | dataset-syllable | su.mp3 |
| suk | real | suk. | sukně | dataset-syllable | suk.mp3 |
| sve | real | sve. | svetr | dataset-syllable | sve.mp3 |
| svíč | real | sviːtʃ,  [Q4: previous_text /, next_text /...] | svíčka | dataset-syllable | sviicx.mp3 |
| sy | real | /sɪ/. | vlasy | dataset-syllable | sy.mp3 |
| sá | real | sá. | sáně | dataset-syllable | saa.mp3 |
| síc | real | síc. | měsíc | dataset-syllable | siic.mp3 |
| sýr | real | sýr. | sýr | dataset-syllable | syyr.mp3 |
| ta | real | ta. | bota | dataset-syllable | ta.mp3 |
| tad | real | tad. | letadlo | dataset-syllable | tad.mp3 |
| tank | real | tank. | tank | dataset-syllable | tank.mp3 |
| tač | real | tač. | počítač | dataset-syllable | tacx.mp3 |
| taš | real | taš. | taška | dataset-syllable | tasx.mp3 |
| te | real | te. | telefon | dataset-syllable | te.mp3 |
| tec | real | tɛts,  [Q4: previous_text /, next_text /...] | štětec | dataset-syllable | tec.mp3 |
| tek | real | tek. | šátek | dataset-syllable | tek.mp3 |
| tel | real | tel. | datel | dataset-syllable | tel.mp3 |
| ten | real | ten. | prsten | dataset-syllable | ten.mp3 |
| tep | real | tep. | teploměr | dataset-syllable | tep.mp3 |
| ter | real | ter. | baterka | dataset-syllable | ter.mp3 |
| terč | real | terč. | terč | dataset-syllable | tercx.mp3 |
| tev | real | tev. | větev | dataset-syllable | tev.mp3 |
| ti | real | ti. | kytice | dataset-syllable | ti.mp3 |
| to | real | to.  [byte copy of trial file to_N1_noprev_period_take2.mp3] | auto | dataset-syllable | to.mp3 |
| toh | real | toh. | batoh | dataset-syllable | toh.mp3 |
| tor | real | tor. | motorka | dataset-syllable | tor.mp3 |
| tr | real | tr, | svetr | dataset-syllable | tr.mp3 |
| trak | real | trak. | traktor | dataset-syllable | trak.mp3 |
| tram | real | tram. | tramvaj | dataset-syllable | tram.mp3 |
| trič | real | trič. | tričko | dataset-syllable | tricx.mp3 |
| tro | real | tro. | astronaut | dataset-syllable | tro.mp3 |
| troj | real | troj. | trojkolka | dataset-syllable | troj.mp3 |
| trov | real | trov. | ostrov | dataset-syllable | trov.mp3 |
| trub | real | trub. | trubka | dataset-syllable | trub.mp3 |
| trum | real | trum. | trumpeta | dataset-syllable | trum.mp3 |
| trych | real | trych. | trychtýř | dataset-syllable | trych.mp3 |
| trá | real | trá. | tráva | dataset-syllable | traa.mp3 |
| tu | real | tu. | tuba | dataset-syllable | tu.mp3 |
| tuč | real | tuč. | tučňák | dataset-syllable | tucx.mp3 |
| tuž | real | tuž. | tužka | dataset-syllable | tuzx.mp3 |
| ty | real | ty. | šaty | dataset-syllable | ty.mp3 |
| tá | real | tá. | fontána | dataset-syllable | taa.mp3 |
| té | real | té. | anténa | dataset-syllable | tee.mp3 |
| tít | real | tít. | chrastítko | dataset-syllable | tiit.mp3 |
| tíř | real | tíř. | rytíř | dataset-syllable | tiirx.mp3 |
| týl | real | týl. | motýl | dataset-syllable | tyyl.mp3 |
| týř | real | týř. | trychtýř | dataset-syllable | tyyrx.mp3 |
| tě | real | tě. | kotě | dataset-syllable | tex.mp3 |
| těr | real | těr. | ještěrka | dataset-syllable | texr.mp3 |
| těz | real | těz. | řetěz | dataset-syllable | texz.mp3 |
| tře | real | tře. | třešeň | dataset-syllable | trxe.mp3 |
| u | real | u. | ucho | dataset-syllable | u.mp3 |
| ub | real | ub. | ubrus | dataset-syllable | ub.mp3 |
| uh | real | uh. | uhlí | dataset-syllable | uh.mp3 |
| va | real | va. | sova | dataset-syllable | va.mp3 |
| vad | real | vad. | umyvadlo | dataset-syllable | vad.mp3 |
| vaj | real | vaj. | tramvaj | dataset-syllable | vaj.mp3 |
| vaz | real | vaz. | obvaz | dataset-syllable | vaz.mp3 |
| vač | real | vač. | vysavač | dataset-syllable | vacx.mp3 |
| ve | real | ve. | veverka | dataset-syllable | ve.mp3 |
| vec | real | vec. | jezevec | dataset-syllable | vec.mp3 |
| vej | real | vej. | vejce | dataset-syllable | vej.mp3 |
| vel | real | vel. | velryba | dataset-syllable | vel.mp3 |
| velb | real | velb. | velbloud | dataset-syllable | velb.mp3 |
| ver | real | ver. | veverka | dataset-syllable | ver.mp3 |
| ves | real | ves. | veslo | dataset-syllable | ves.mp3 |
| vi | real | vi. | noviny | dataset-syllable | vi.mp3 |
| vid | real | vid. | vidlička | dataset-syllable | vid.mp3 |
| vič | real | vič. | lavička | dataset-syllable | vicx.mp3 |
| vla | real | vla. | vlasy | dataset-syllable | vla.mp3 |
| vlaj | real | vlaj. | vlajka | dataset-syllable | vlaj.mp3 |
| vlak | real | vlak. | vlak | dataset-syllable | vlak.mp3 |
| vlk | real | vlk, | vlk | dataset-syllable | vlk.mp3 |
| vo | real | vo. | vosa | dataset-syllable | vo.mp3 |
| vouk | real | vouk. | pavouk | dataset-syllable | vouk.mp3 |
| vr | real | vr, | vrtačka | dataset-syllable | vr.mp3 |
| vu | real | vu. | pavučina | dataset-syllable | vu.mp3 |
| vy | real | vy. | vysavač | dataset-syllable | vy.mp3 |
| vyd | real | vyd. | vydra | dataset-syllable | vyd.mp3 |
| vzdu | real | vzdu. | vzducholoď | dataset-syllable | vzdu.mp3 |
| vá | real | vá. | váza | dataset-syllable | vaa.mp3 |
| vák | real | vák. | zpěvák | dataset-syllable | vaak.mp3 |
| vát | real | vát. | ořezávátko | dataset-syllable | vaat.mp3 |
| váž | real | váž. | vážka | dataset-syllable | vaazx.mp3 |
| ví | real | ví. | víla | dataset-syllable | vii.mp3 |
| vír | real | vír. | klavír | dataset-syllable | viir.mp3 |
| vče | real | vče. | včela | dataset-syllable | vcxe.mp3 |
| vě | real | vě. | vějíř | dataset-syllable | vex.mp3 |
| věd | real | věd. | medvěd | dataset-syllable | vexd.mp3 |
| věs | real | věs. | závěs | dataset-syllable | vexs.mp3 |
| věž | real | věž. | věž | dataset-syllable | vexzx.mp3 |
| waf | real | waf. | wafle | dataset-syllable | waf.mp3 |
| xa | real | xa. | fixa | dataset-syllable | xa.mp3 |
| xy | real | /ksɪ/. | xylofon | dataset-syllable | xy.mp3 |
| xík | real | xík. | taxík | dataset-syllable | xiik.mp3 |
| za | real | za. | koza | dataset-syllable | za.mp3 |
| zav | real | zav. | skluzavka | dataset-syllable | zav.mp3 |
| ze | real | ze. | jezevec | dataset-syllable | ze.mp3 |
| zeb | real | zeb. | zebra | dataset-syllable | zeb.mp3 |
| zek | real | zek. | řízek | dataset-syllable | zek.mp3 |
| zel | real | zel. | uzel | dataset-syllable | zel.mp3 |
| zeď | real | zeď. | zeď | dataset-syllable | zedx.mp3 |
| zin | real | zin. | rozinky | dataset-syllable | zin.mp3 |
| zip | real | zip. | zip | dataset-syllable | zip.mp3 |
| zmrz | real | zmrz, | zmrzlina | dataset-syllable | zmrz.mp3 |
| zo | real | zo. | fazole | dataset-syllable | zo.mp3 |
| zpě | real | zpě. | zpěvák | dataset-syllable | zpex.mp3 |
| zr | real | zr, | zrcadlo | dataset-syllable | zr.mp3 |
| zu | real | zu. | zubař | dataset-syllable | zu.mp3 |
| zub | real | zub. | zub | dataset-syllable | zub.mp3 |
| zvo | real | zvo. | zvonek | dataset-syllable | zvo.mp3 |
| zvon | real | zvon. | zvon | dataset-syllable | zvon.mp3 |
| zyk | real | zyk. | jazyk | dataset-syllable | zyk.mp3 |
| zá | real | zá. | zámek | dataset-syllable | zaa.mp3 |
| zát | real | zát. | lízátko | dataset-syllable | zaat.mp3 |
| zén | real | zén. | bazén | dataset-syllable | zeen.mp3 |
| úl | real | úl. | úl | dataset-syllable | uul.mp3 |
| ča | real | ča. | čarodějnice | dataset-syllable | cxa.mp3 |
| čaj | real | čaj. | čaj | dataset-syllable | cxaj.mp3 |
| če | real | če. | rajče | dataset-syllable | cxe.mp3 |
| ček | real | ček. | cvrček | dataset-syllable | cxek.mp3 |
| čert | real | čert. | čert | dataset-syllable | cxert.mp3 |
| čes | real | čes. | česnek | dataset-syllable | cxes.mp3 |
| či | real | či. | pavučina | dataset-syllable | cxi.mp3 |
| čin | real | čin. | činka | dataset-syllable | cxin.mp3 |
| člun | real | člun. | člun | dataset-syllable | cxlun.mp3 |
| čme | real | čme. | čmelák | dataset-syllable | cxme.mp3 |
| čo | real | čo. | čokoláda | dataset-syllable | cxo.mp3 |
| čoč | real | čoč. | čočka | dataset-syllable | cxocx.mp3 |
| čtyř | real | čtyř. | čtyřkolka | dataset-syllable | cxtyrx.mp3 |
| čáp | real | čáp. | čáp | dataset-syllable | cxaap.mp3 |
| čár | real | čár. | kočár | dataset-syllable | cxaar.mp3 |
| čí | real | čí. | počítač | dataset-syllable | cxii.mp3 |
| číš | real | číš. | číšník | dataset-syllable | cxiisx.mp3 |
| ňo | real | ňo. | ohňostroj | dataset-syllable | nxo.mp3 |
| ňák | real | ňák. | tučňák | dataset-syllable | nxaak.mp3 |
| ře | real | ře. | kuře | dataset-syllable | rxe.mp3 |
| řech | real | řech. | ořech | dataset-syllable | rxech.mp3 |
| řed | real | řed. | ředkvička | dataset-syllable | rxed.mp3 |
| řen | real | řen. | cukřenka | dataset-syllable | rxen.mp3 |
| řez | real | řez. | řezník | dataset-syllable | rxez.mp3 |
| ři | real | ři. | řidič | dataset-syllable | rxi.mp3 |
| řáb | real | řáb. | jeřáb | dataset-syllable | rxaab.mp3 |
| ří | real | ří. | řízek | dataset-syllable | rxii.mp3 |
| řík | real | řík. | žebřík | dataset-syllable | rxiik.mp3 |
| ša | real | ša. | šaty | dataset-syllable | sxa.mp3 |
| šam | real | šam. | šampon | dataset-syllable | sxam.mp3 |
| šek | real | šek. | šašek | dataset-syllable | sxek.mp3 |
| šen | real | šen. | sušenka | dataset-syllable | sxen.mp3 |
| šeň | real | šeň. | třešeň | dataset-syllable | sxenx.mp3 |
| šip | real | šip. | šipky | dataset-syllable | sxip.mp3 |
| šit | real | šit. | sešit | dataset-syllable | sxit.mp3 |
| šiš | real | šiš. | šiška | dataset-syllable | sxisx.mp3 |
| ško | real | ško. | škola | dataset-syllable | sxko.mp3 |
| šle | real | šle. | šlehačka | dataset-syllable | sxle.mp3 |
| šnor | real | šnor. | šnorchl | dataset-syllable | sxnor.mp3 |
| špe | real | špe. | špenát | dataset-syllable | sxpe.mp3 |
| špend | real | ʃpɛnd,  [Q4: previous_text /, next_text /...] | špendlík | dataset-syllable | sxpend.mp3 |
| šrou | real | šrou. | šroubovák | dataset-syllable | sxrou.mp3 |
| šroub | real | šroub. | šroub | dataset-syllable | sxroub.mp3 |
| štář | real | štář. | polštář | dataset-syllable | sxtaarx.mp3 |
| štír | real | štír. | štír | dataset-syllable | sxtiir.mp3 |
| štít | real | štít. | štít | dataset-syllable | sxtiit.mp3 |
| ště | real | ště. | štětec | dataset-syllable | sxtex.mp3 |
| šun | real | šun. | šunka | dataset-syllable | sxun.mp3 |
| šup | real | šup. | šuplík | dataset-syllable | sxup.mp3 |
| švest | real | švest. | švestka | dataset-syllable | sxvest.mp3 |
| švi | real | švi. | švihadlo | dataset-syllable | sxvi.mp3 |
| šá | real | šá. | šála | dataset-syllable | sxaa.mp3 |
| šák | real | šák. | věšák | dataset-syllable | sxaak.mp3 |
| šík | real | šík. | košík | dataset-syllable | sxiik.mp3 |
| šíp | real | šíp. | šíp | dataset-syllable | sxiip.mp3 |
| ža | real | ža. | žalud | dataset-syllable | zxa.mp3 |
| žant | real | žant. | bažant | dataset-syllable | zxant.mp3 |
| že | real | že. | lyže | dataset-syllable | zxe.mp3 |
| žeb | real | žeb. | žebřík | dataset-syllable | zxeb.mp3 |
| žec | real | žec. | nosorožec | dataset-syllable | zxec.mp3 |
| žeh | real | žeh. | žehlička | dataset-syllable | zxeh.mp3 |
| žek | real | žek. | ježek | dataset-syllable | zxek.mp3 |
| žel | real | žel. | želva | dataset-syllable | zxel.mp3 |
| žez | real | žez. | žezlo | dataset-syllable | zxez.mp3 |
| ži | real | ži. | žirafa | dataset-syllable | zxi.mp3 |
| žid | real | žid. | židle | dataset-syllable | zxid.mp3 |
| žo | real | žo. | žokej | dataset-syllable | zxo.mp3 |
| žong | real | žong. | žonglér | dataset-syllable | zxong.mp3 |
| žra | real | žra. | žralok | dataset-syllable | zxra.mp3 |
| žu | real | žu. | župan | dataset-syllable | zxu.mp3 |
| žá | real | žá. | žába | dataset-syllable | zxaa.mp3 |
| ží | real | ží. | žížala | dataset-syllable | zxii.mp3 |
| al | synthetic | al. | balón | dataset-substring | al.mp3 |
| am | synthetic | am. | lampa | dataset-substring | am.mp3 |
| ap | synthetic | ap,  [Q4: previous_text /, next_text /...] | mapa | dataset-substring | ap.mp3 |
| at | synthetic | at. | šaty | dataset-substring | at.mp3 |
| bá | synthetic | bá. | džbán | dataset-substring | baa.mp3 |
| bé | synthetic | bé. | béžový | manual | bee.mp3 |
| bó | synthetic | bó. | bóje | manual | boo.mp3 |
| bú | synthetic | bú. | búda | manual | buu.mp3 |
| ca | synthetic | ca. | zrcadlo | dataset-substring | ca.mp3 |
| che | synthetic | che. | chemie | manual | che.mp3 |
| chu | synthetic | chu. | chuť | manual | chu.mp3 |
| chá | synthetic | chá. | sluchátka | dataset-substring | chaa.mp3 |
| ché | synthetic | ché.  [byte copy of trial file chee_N1_noprev_period_take2.mp3] | chléb | manual | chee.mp3 |
| chí | synthetic | chí. | chlívek | manual | chii.mp3 |
| chó | synthetic | chó. | chór | manual | choo.mp3 |
| chú | synthetic | chú. | chůze | manual | chuu.mp3 |
| co | synthetic | co. | cop | dataset-substring | co.mp3 |
| cá | synthetic | cá. | cákat | manual | caa.mp3 |
| cú | synthetic | cú. | cukr | manual | cuu.mp3 |
| dé | synthetic | dé. | déšť | manual | dee.mp3 |
| dí | synthetic | dí. | dívka | dataset-substring | dii.mp3 |
| dó | synthetic | dó. | dóza | manual | doo.mp3 |
| ek | synthetic | ek. | deka | dataset-substring | ek.mp3 |
| el | synthetic | el. | orel | dataset-substring | el.mp3 |
| em | synthetic | em. | semafor | dataset-substring | em.mp3 |
| en | synthetic | en. | buben | dataset-substring | en.mp3 |
| ep | synthetic | ep. | řepa | dataset-substring | ep.mp3 |
| et | synthetic | et. | řetěz | dataset-substring | et.mp3 |
| fe | synthetic | fe. | fena | manual | fe.mp3 |
| fu | synthetic | fu. | fuj | manual | fu.mp3 |
| fá | synthetic | fá. | fáze | manual | faa.mp3 |
| fé | synthetic | fé. | fén | dataset-substring | fee.mp3 |
| fí | synthetic | fí. | fík | dataset-substring | fii.mp3 |
| fó | synthetic | fó. | fólie | manual | foo.mp3 |
| fú | synthetic | fú. | fúze | manual | fuu.mp3 |
| gi | synthetic | gi. | gigant | manual | gi.mp3 |
| go | synthetic | go. | gong | dataset-substring | go.mp3 |
| gá | synthetic | gá. | gáza | manual | gaa.mp3 |
| gé | synthetic | gé. | génius | manual | gee.mp3 |
| gí | synthetic | gí. | gigant | manual | gii.mp3 |
| gó | synthetic | gó. | gól | manual | goo.mp3 |
| gú | synthetic | gú. | guma | manual | guu.mp3 |
| he | synthetic | he. | oheň | dataset-substring | he.mp3 |
| hi | synthetic | hi.  [byte copy of trial file hi_N1_noprev_period_take2.mp3] | orchidej | dataset-substring | hi.mp3 |
| há | synthetic | há. | pohár | dataset-substring | haa.mp3 |
| hé | synthetic | hé. | hélium | manual | hee.mp3 |
| hí | synthetic | hí. | híkat | manual | hii.mp3 |
| hó | synthetic | hó. | hóhér | manual | hoo.mp3 |
| hú | synthetic | hú. | húkat | manual | huu.mp3 |
| ik | synthetic | ik. | mikrofon | dataset-substring | ik.mp3 |
| il | synthetic | il. | gril | dataset-substring | il.mp3 |
| im | synthetic | im. | miminko | dataset-substring | im.mp3 |
| ip | synthetic | ip. | zip | dataset-substring | ip.mp3 |
| is | synthetic | is. | list | dataset-substring | is.mp3 |
| it | synthetic | it. | sešit | dataset-substring | it.mp3 |
| ju | synthetic | ju. | jubileum | manual | ju.mp3 |
| já | synthetic | já. | maják | dataset-substring | jaa.mp3 |
| jú | synthetic | jú. | júra | manual | juu.mp3 |
| ki | synthetic | ki.  [byte copy of trial file ki_N1_noprev_period_take2.mp3] | kino | manual | ki.mp3 |
| ké | synthetic | ké. | kéž | manual | kee.mp3 |
| kí | synthetic | kí. | kýchat | manual | kii.mp3 |
| kó | synthetic | kó. | kóla | manual | koo.mp3 |
| kú | synthetic | kú. | kúra | manual | kuu.mp3 |
| ló | synthetic | ló. | balón | dataset-substring | loo.mp3 |
| mu | synthetic | mu. | mušle | dataset-substring | mu.mp3 |
| má | synthetic | má. | máslo | dataset-substring | maa.mp3 |
| mé | synthetic | mé. | méně | manual | mee.mp3 |
| mí | synthetic | mí. | míč | manual | mii.mp3 |
| mó | synthetic | mó. | móda | manual | moo.mp3 |
| mú | synthetic | mú. | múza | manual | muu.mp3 |
| nu | synthetic | nu. | nanuk | dataset-substring | nu.mp3 |
| né | synthetic | né. | nést | manual | nee.mp3 |
| ní | synthetic | ní. | cedník | dataset-substring | nii.mp3 |
| nó | synthetic | nó. | nóta | manual | noo.mp3 |
| nú | synthetic | nú.  [byte copy of trial file nuu_N1_noprev_period_take2.mp3] | nůž | manual | nuu.mp3 |
| ol | synthetic | ol. | kolo | dataset-substring | ol.mp3 |
| om | synthetic | om. | strom | dataset-substring | om.mp3 |
| on | synthetic | on. | gong | dataset-substring | on.mp3 |
| op | synthetic | op. | cop | dataset-substring | op.mp3 |
| ot | synthetic | ot. | bota | dataset-substring | ot.mp3 |
| pu | synthetic | pu. | pudr | manual | pu.mp3 |
| pé | synthetic | pé. | péro | manual | pee.mp3 |
| pí | synthetic | pí. | pípat | manual | pii.mp3 |
| pó | synthetic | pó. | pól | manual | poo.mp3 |
| pú | synthetic | pú. | půda | manual | puu.mp3 |
| qa | synthetic | qa. | Qatar | manual | qa.mp3 |
| qe | synthetic | kvɛ,  [Q4: previous_text /, next_text /...] | Quebec | manual | qe.mp3 |
| qi | synthetic | qi. | quiz | manual | qi.mp3 |
| qo | synthetic | qo. | status quo | manual | qo.mp3 |
| qu | synthetic | qu.  [byte copy of trial file qu_N1_noprev_period_take2.mp3] | quad | manual | qu.mp3 |
| qá | synthetic | qá. | Qatar | manual | qaa.mp3 |
| qé | synthetic | qé. | Quebec | manual | qee.mp3 |
| qí | synthetic | qí. | quiz | manual | qii.mp3 |
| qó | synthetic | qó. | status quo | manual | qoo.mp3 |
| qú | synthetic | qú. | quad | manual | quu.mp3 |
| re | synthetic | re. | orel | dataset-substring | re.mp3 |
| ri | synthetic | ri. | gril | dataset-substring | ri.mp3 |
| ré | synthetic | ré. | réva | manual | ree.mp3 |
| rí | synthetic | rí. | rýže | manual | rii.mp3 |
| ró | synthetic | ró. | róba | manual | roo.mp3 |
| rú | synthetic | rú. | růže | manual | ruu.mp3 |
| si | synthetic | si. | hasič | dataset-substring | si.mp3 |
| sé | synthetic | sé. | sérum | manual | see.mp3 |
| sí | synthetic | sí. | měsíc | dataset-substring | sii.mp3 |
| só | synthetic | só. | sója | manual | soo.mp3 |
| sú | synthetic | sú. | sůl | manual | suu.mp3 |
| tí | synthetic | tí. | štít | dataset-substring | tii.mp3 |
| tó | synthetic | tó. | tón | manual | too.mp3 |
| tú | synthetic | tú. | túra | manual | tuu.mp3 |
| uk | synthetic | uk,  [Q4: previous_text /, next_text /...] | luk | dataset-substring | uk.mp3 |
| ul | synthetic | ul. | tuleň | dataset-substring | ul.mp3 |
| um | synthetic | um. | guma | dataset-substring | um.mp3 |
| un | synthetic | un. | člun | dataset-substring | un.mp3 |
| up | synthetic | up. | lupa | dataset-substring | up.mp3 |
| us | synthetic | us. | husa | dataset-substring | us.mp3 |
| ut | synthetic | ut.  [byte copy of trial file ut_N1_noprev_period_take2.mp3] | auto | dataset-substring | ut.mp3 |
| vé | synthetic | vé. | vést | manual | vee.mp3 |
| vó | synthetic | vó. | vólejbal | manual | voo.mp3 |
| vú | synthetic | vú. | vůz | manual | vuu.mp3 |
| wa | synthetic | wa. | wafle | dataset-substring | wa.mp3 |
| we | synthetic | we. | web | manual | we.mp3 |
| wi | synthetic | wi. | wifi | manual | wi.mp3 |
| wo | synthetic | wo. | workshop | manual | wo.mp3 |
| wu | synthetic | wu. | Wuhan | manual | wu.mp3 |
| wá | synthetic | wá. | Wagner | manual | waa.mp3 |
| wé | synthetic | wé. | Wembley | manual | wee.mp3 |
| wí | synthetic | wí. | wifi | manual | wii.mp3 |
| wó | synthetic | wó. | wok | manual | woo.mp3 |
| wú | synthetic | wú. | Wuhan | manual | wuu.mp3 |
| xe | synthetic | xe. | xerox | manual | xe.mp3 |
| xi | synthetic | /ksɪ/. | xylofon | manual | xi.mp3 |
| xo | synthetic | /ksɔ/. | xoxo | manual | xo.mp3 |
| xu | synthetic | xu. | Xu | manual | xu.mp3 |
| xá | synthetic | xá. | Xaver | manual | xaa.mp3 |
| xé | synthetic | xé. | xerox | manual | xee.mp3 |
| xí | synthetic | xí. | taxík | dataset-substring | xii.mp3 |
| xó | synthetic | xó. | xoxo | manual | xoo.mp3 |
| xú | synthetic | xú. | Xu | manual | xuu.mp3 |
| yk | synthetic | yk. | jazyk | dataset-substring | yk.mp3 |
| yl | synthetic | yl. | xylofon | dataset-substring | yl.mp3 |
| ym | synthetic | ym. | hymna | manual | ym.mp3 |
| yn | synthetic | yn. | jeskyně | dataset-substring | yn.mp3 |
| yp | synthetic | yp. | typ | manual | yp.mp3 |
| ys | synthetic | ys. | rys | dataset-substring | ys.mp3 |
| yt | synthetic | yt. | rytíř | dataset-substring | yt.mp3 |
| zi | synthetic | zi. | zip | dataset-substring | zi.mp3 |
| zé | synthetic | zé. | bazén | dataset-substring | zee.mp3 |
| zí | synthetic | zí. | zítra | manual | zii.mp3 |
| zó | synthetic | zó. | zóna | manual | zoo.mp3 |
| zú | synthetic | zú. | zúžit | manual | zuu.mp3 |
| ák | synthetic | ák. | pták | dataset-substring | aak.mp3 |
| ál | synthetic | ál. | král | dataset-substring | aal.mp3 |
| ám | synthetic | ám. | kámen | dataset-substring | aam.mp3 |
| án | synthetic | án. | sáně | dataset-substring | aan.mp3 |
| áp | synthetic | áp. | čáp | dataset-substring | aap.mp3 |
| ás | synthetic | ás. | máslo | dataset-substring | aas.mp3 |
| át | synthetic | át. | pirát | dataset-substring | aat.mp3 |
| ék | synthetic | ék. | mléko | dataset-substring | eek.mp3 |
| él | synthetic | él. | gél | manual | eel.mp3 |
| ém | synthetic | ém. | systém | manual | eem.mp3 |
| én | synthetic | én. | fén | dataset-substring | een.mp3 |
| ép | synthetic | ép. | épos | manual | eep.mp3 |
| és | synthetic | és. | Ésop | manual | ees.mp3 |
| ét | synthetic | ét. | flétna | dataset-substring | eet.mp3 |
| ík | synthetic | ík. | fík | dataset-substring | iik.mp3 |
| íl | synthetic | íl. | víla | dataset-substring | iil.mp3 |
| ím | synthetic | ím. | dím | manual | iim.mp3 |
| ín | synthetic | ín. | delfín | dataset-substring | iin.mp3 |
| íp | synthetic | íp. | šíp | dataset-substring | iip.mp3 |
| ís | synthetic | ís. | čtyřlístek | dataset-substring | iis.mp3 |
| ít | synthetic | ít. | štít | dataset-substring | iit.mp3 |
| ók | synthetic | ók. | dók | manual | ook.mp3 |
| ól | synthetic | ól. | pól | manual | ool.mp3 |
| óm | synthetic | óm. | gnóm | manual | oom.mp3 |
| ón | synthetic | ón. | balón | dataset-substring | oon.mp3 |
| óp | synthetic | óp. | ópera | manual | oop.mp3 |
| ós | synthetic | ós. | óda | manual | oos.mp3 |
| ót | synthetic | ót. | óda | manual | oot.mp3 |
| úk | synthetic | úk. | úkol | manual | uuk.mp3 |
| úm | synthetic | úm. | úmysl | manual | uum.mp3 |
| ún | synthetic | ún. | únor | manual | uun.mp3 |
| úp | synthetic | úp. | úpal | manual | uup.mp3 |
| ús | synthetic | ús. | ústa | manual | uus.mp3 |
| út | synthetic | út. | úterý | manual | uut.mp3 |
| ýk | synthetic | ýk. | býk | dataset-substring | yyk.mp3 |
| ýl | synthetic | ýl. | brýle | dataset-substring | yyl.mp3 |
| ým | synthetic | ým. | dýmka | dataset-substring | yym.mp3 |
| ýn | synthetic | ýn. | dýně | dataset-substring | yyn.mp3 |
| ýp | synthetic | ýp. | výprava | manual | yyp.mp3 |
| ýs | synthetic | ýs. | výsledek | manual | yys.mp3 |
| ýt | synthetic | ýt. | výtah | manual | yyt.mp3 |
| ču | synthetic | ču. | čuch | manual | cxu.mp3 |
| čá | synthetic | čá. | čáp | dataset-substring | cxaa.mp3 |
| čú | synthetic | čú. | čuch | manual | cxuu.mp3 |
| ďa | synthetic | ďa. | ďas | manual | dxa.mp3 |
| ďo | synthetic | ďo. | ďoura | manual | dxo.mp3 |
| ďu | synthetic | ďu.  [byte copy of trial file dxu_N1_noprev_period_take2.mp3] | ďoura | manual | dxu.mp3 |
| ďá | synthetic | ďá. | ďábel | manual | dxaa.mp3 |
| ďú | synthetic | ďú. | ďábel | manual | dxuu.mp3 |
| ěk | synthetic | ěk. | člověk | manual | exk.mp3 |
| ěl | synthetic | ěl. | dělo | dataset-substring | exl.mp3 |
| ěm | synthetic | ěm. | těm | manual | exm.mp3 |
| ěn | synthetic | ěn. | rtěnka | dataset-substring | exn.mp3 |
| ěp | synthetic | ěp. | pěna | manual | exp.mp3 |
| ěs | synthetic | ěs. | měsíc | dataset-substring | exs.mp3 |
| ět | synthetic | ět. | větev | dataset-substring | ext.mp3 |
| ňa | synthetic | ňa. | chňapka | dataset-substring | nxa.mp3 |
| ňu | synthetic | ňu. | kňučet | manual | nxu.mp3 |
| ňá | synthetic | ňá. | tučňák | dataset-substring | nxaa.mp3 |
| ňú | synthetic | ňú. | kňučet | manual | nxuu.mp3 |
| řa | synthetic | řa. | řasa | manual | rxa.mp3 |
| řo | synthetic | řo. | řopík | manual | rxo.mp3 |
| řu | synthetic | řu. | křup | manual | rxu.mp3 |
| řá | synthetic | řá. | jeřáb | dataset-substring | rxaa.mp3 |
| řú | synthetic | řú. | křup | manual | rxuu.mp3 |
| šo | synthetic | šo. | šotek | manual | sxo.mp3 |
| šu | synthetic | šu. | šunka | dataset-substring | sxu.mp3 |
| šú | synthetic | šú. | šupina | manual | sxuu.mp3 |
| ťa | synthetic | ťa. | ťapat | manual | txa.mp3 |
| ťo | synthetic | ťo. | ťok | manual | txo.mp3 |
| ťu | synthetic | ťu. | ťukat | manual | txu.mp3 |
| ťá | synthetic | ťá. | ťápnout | manual | txaa.mp3 |
| ťú | synthetic | ťú. | ťukat | manual | txuu.mp3 |
| ůk | synthetic | ůk. | vůkol | manual | uok.mp3 |
| ůl | synthetic | ůl. | stůl | dataset-substring | uol.mp3 |
| ům | synthetic | ům. | dům | dataset-substring | uom.mp3 |
| ůn | synthetic | ůn. | tůně | manual | uon.mp3 |
| ůp | synthetic | ůp. | půda | manual | uop.mp3 |
| ůs | synthetic | ůs. | půst | manual | uos.mp3 |
| ůt | synthetic | ůt. | půtka | manual | uot.mp3 |
| žú | synthetic | žú. | žula | manual | zxuu.mp3 |

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
