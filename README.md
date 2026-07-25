# 壽出世双六 — Kotobuki Shusse Sugoroku

A playable browser version of the Edo-period life-course board game
*Kotobuki Shusse Sugoroku* (“Longevity and Success sugoroku”), for the
G30 History course at Nagoya University.

**Concept & idea:** Tristan Grunow · **Implementation:** Henrik Bachmann

## What it is

An *e-sugoroku* print is not a race around a track. Its squares are social
positions, and each square lists only a few die numbers, each leading to a
particular other station in life. A merchant clerk's board of possibilities is
not a family head's.

Players take one of the six characters printed in the Start square and begin in
that character's own cell. On a turn you read your **current** cell: only
certain numbers lead anywhere, and each of them sends you somewhere different.
A life course ends at **長者** (Finish, a wealthy house), **Cell 5 隠居**
(honorable retirement), or **Cell 45 願人坊主** (the mendicant monk).

## Features

- The original Kuniteru print as the board, with all 45 cells clickable.
- Hot-seat play for 1–6 players, with characters drawn by die roll exactly as
  the packet specifies.
- **English and Japanese**, switched at any moment from the masthead — including
  mid-game, without losing the game in progress.
- **Furigana** over every Japanese name, so students who read hiragana can read
  every station on the board. Toggled beside the language switch.
- **A wheel instead of a die.** A cell offers only the moves in its roll table,
  and an unlisted die number is simply re-rolled — so every listed move is
  equally likely. The wheel is divided into exactly those moves, which is the
  same thing mathematically and a truer picture of the choice at hand. A switch
  in the turn card brings back a real d6 with re-rolls, for mirroring a table
  session.
- Every cell's kanji, reading, name, verse and roll table, with the matching
  woodblock detail from the print shown whole.
- A browsable catalogue of all forty-five cells.
- **Exact** outcome probabilities, not simulations: because the board is an
  absorbing Markov chain, the page solves it directly and shows, for every cell,
  the chance of finishing, retiring or ending with the begging bowl.

## Running it

No build step, no dependencies, no server needed. Open `index.html` in a
browser, or host the folder anywhere static (GitHub Pages works as-is).

```
index.html
css/style.css
data/cells.js       — the 45 cells + Finish: names, readings, verses, roll tables
data/characters.js  — the six characters of the Start square
data/board.js       — where each cell sits on the board image
data/ui.js          — every word of the interface, in both languages
js/boot.js          — namespace, loaded first
js/i18n.js          — language state, furigana, text resolution
js/wheel.js         — the wheel
js/game.js          — game engine, board UI and the Markov solver
assets/             — board image and 47 cell details
```

## Editing the content

Everything in `data/` is plain JSON with a single assignment line at the top
(`SUGOROKU.cells = { … }`). Edit it exactly as you would a `.json` file. The
wrapper is there for one reason: browsers block `fetch()` on `file://`, so a
real `.json` file would force everyone to run a web server just to open the
page. This way `index.html` still works by double-click.

### Adding your own translations

Cell names, verses and notes are objects with an English and a Japanese side:

```json
"verse": {
  "en": "The number one priority for the house is to persevere…",
  "ja": "家にとって何よりも大切なのは、生き抜いて千代までも栄えることである。",
  "jaDraft": true
}
```

`"jaDraft": true` marks a Japanese text as a **draft translation made for this
program** — not a transcription of the print's own Japanese. Those show in the
interface with a 〈draft〉/〈下訳〉 marker. When you replace one with your own
text, delete its `"jaDraft"` line and the marker disappears. An empty `"ja"`
string simply falls back to English, so the page never breaks half-translated.

Every Japanese verse and note currently in `data/cells.js` is such a draft.

### Furigana

Each cell carries a `kana` field, used for the ruby text. It takes either form:

```json
"kana": "りょうがえ"                              // ruby over the whole word
"kana": [["生抜", "いきぬき"], ["知行", "ちぎょう"]]   // per-word ruby
```

The second form is preferred where a compound splits cleanly, since it puts each
reading over the characters it belongs to. The chunks must concatenate to
exactly the `kanji` string.

### Interface wording

`data/ui.js` holds every interface string under an `en` and a `ja` key.
`{braces}` are placeholders filled in by the program — keep them, but reorder
them freely to suit the grammar. A missing or empty Japanese string falls back
to English.

## Sources

Cell names, verses, summaries and roll tables are transcribed from the G30
History *Sugoroku Game Packet* (Spring 2026). The board and every cell
illustration are details from the print by Utagawa Kuniteru（國輝画）, published
by Eikyūdō（榮久堂版）.

Three typographic slips in the packet were corrected: “Cel 26” → Cell 26,
“Cel l6” → Cell 6, “Co to Cell 18” → Go to Cell 18. Cell 45 has no verse in the
packet; its description here is editorial and marked as such in the About panel.
