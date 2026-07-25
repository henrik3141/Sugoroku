/* ==================================================================
   壽出世双六 — THE SIX CHARACTERS OF THE START SQUARE
   ------------------------------------------------------------------
   Plain JSON with one assignment line, like the other data files.
   Listed in die order: die 1 is the first entry.

   die     the number rolled to receive this character.
   kanji   name as printed in the Start square.
   kana    reading, for furigana (string, or [kanji, reading] pairs).
   romaji  romanisation.
   name    en = English name, ja = modern Japanese gloss.
   start   the cell this character begins in.
   color   pawn colour;  ink = text colour drawn on that pawn.
   ================================================================== */

SUGOROKU.characters =
[
  {
    "die": 1,
    "kanji": "養子",
    "kana": "ようし",
    "romaji": "Yōshi",
    "name": { "en": "Adopted Son", "ja": "養子", "jaDraft": true },
    "start": "26",
    "color": "#1f4e79",
    "ink": "#ffffff"
  },
  {
    "die": 2,
    "kanji": "年季者",
    "kana": [["年季", "ねんき"], ["者", "しゃ"]],
    "romaji": "Nenkisha",
    "name": { "en": "Apprentice", "ja": "年季奉公人", "jaDraft": true },
    "start": "37",
    "color": "#b03a2e",
    "ink": "#ffffff"
  },
  {
    "die": 3,
    "kanji": "手代",
    "kana": "てだい",
    "romaji": "Tedai",
    "name": { "en": "Merchant Clerk", "ja": "手代", "jaDraft": true },
    "start": "29",
    "color": "#4a7c3f",
    "ink": "#ffffff"
  },
  {
    "die": 4,
    "kanji": "部屋住",
    "kana": [["部屋", "へや"], ["住", "ずみ"]],
    "romaji": "Heyazumi",
    "name": { "en": "Room-dweller", "ja": "部屋住み", "jaDraft": true },
    "start": "22",
    "color": "#c98f1e",
    "ink": "#2a1e00"
  },
  {
    "die": 5,
    "kanji": "家督",
    "kana": "かとく",
    "romaji": "Katoku",
    "name": { "en": "Family Head", "ja": "家督", "jaDraft": true },
    "start": "18",
    "color": "#6b3f8f",
    "ink": "#ffffff"
  },
  {
    "die": 6,
    "kanji": "學問",
    "kana": "がくもん",
    "romaji": "Gakumon",
    "name": { "en": "Student", "ja": "学問", "jaDraft": true },
    "start": "23",
    "color": "#1f7a7a",
    "ink": "#ffffff"
  }
];
