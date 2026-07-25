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
that character's own cell. On a turn you roll and read your **current** cell: if
the number is listed you move there; if it is not, nothing happens and you roll
again. A life course ends at **長者** (Finish, a wealthy house), **Cell 5 隠居**
(honorable retirement), or **Cell 45 願人坊主** (the mendicant monk).

## Features

- The original Kuniteru print as the board, with all 45 cells clickable.
- Hot-seat play for 1–6 players, with characters drawn by die roll exactly as
  the packet specifies.
- Every cell's kanji, romanisation, English name, verse and roll table, with the
  matching woodblock detail from the print.
- A browsable catalogue of all forty-five cells.
- **Exact** outcome probabilities, not simulations: because an unlisted roll is
  simply re-rolled, every arrow out of a cell is equally likely, so the board is
  an absorbing Markov chain. The page solves it in the browser and shows, for
  every cell, the chance of finishing, retiring or ending with the begging bowl.

## Running it

No build step, no dependencies, no server needed. Open `index.html` in a
browser, or host the folder anywhere static (GitHub Pages works as-is).

```
index.html
css/style.css
js/data.js     — all cell texts, roll tables and board coordinates
js/game.js     — game engine, board UI and the Markov solver
assets/        — board image and 47 cell details
```

## Sources

Cell names, verses, summaries and roll tables are transcribed from the G30
History *Sugoroku Game Packet* (Spring 2026). The board and every cell
illustration are details from the print by Utagawa Kuniteru（國輝画）, published
by Eikyūdō（榮久堂版）.

Three typographic slips in the packet were corrected: “Cel 26” → Cell 26,
“Cel l6” → Cell 6, “Co to Cell 18” → Go to Cell 18. Cell 45 has no verse in the
packet; its description here is editorial and marked as such in the About panel.
