/* ------------------------------------------------------------------
   壽出世双六 — Kotobuki Shusse Sugoroku
   Cell data transcribed from the G30 History "Sugoroku Game Packet"
   (Nagoya University, Spring 2026). Print: Utagawa Kuniteru, publ. Eikyūdō.

   FINISH is written as the string "F".
   Cells 5, 45 and F are terminal (no rolls).
   Obvious typos in the packet were corrected: "Cel 26"->Cell 26,
   "Cel l6"->Cell 6, "Co to Cell 18"->Go to Cell 18.
------------------------------------------------------------------- */

const FINISH = 'F';

const CELLS = {
  1: {
    kanji: '生抜知行', romaji: 'Ikinuki Chigyō', en: 'A Perseverant Retainer',
    verse: 'The number one priority for the house is to persevere and prosper for a thousand generations.',
    rolls: { 1: FINISH, 3: 2, 6: 44 }
  },
  2: {
    kanji: '左團扇', romaji: 'Hidari Uchiwa', en: 'A Life of Ease',
    note: 'Literally “fanning yourself with your left hand” — an idiom for living without having to work.',
    verse: 'A face radiant with fortune as beautiful as the autumn moon, wishing for longevity and eternal prosperity.',
    rolls: { 1: 4, 2: FINISH, 3: 5 }
  },
  3: {
    kanji: '両替', romaji: 'Ryōgae', en: 'Money Exchanger',
    note: 'The ryōgae handled the exchange between gold, silver and copper currencies — the backbone of Edo finance.',
    rolls: { 1: 44, 6: 4 }
  },
  4: {
    kanji: '有徳', romaji: 'Utoku', en: 'A Person of Virtue and Wealth',
    verse: 'If one possesses virtue it is said there is abundance and successful business for both parties.',
    rolls: { 1: 2, 2: FINISH, 3: 6 }
  },
  5: {
    kanji: '隠居', romaji: 'Inkyo', en: 'Honorable Retirement',
    verse: 'Good Fortune [is] taking firm root in the autumn moon [becoming] full.',
    note: 'Marked 泊 (tomari, “lodging”) on the print — a resting place. Handing the headship to the next generation and withdrawing in honour ends your life course.',
    ending: 'retire', rolls: {}
  },
  6: {
    kanji: '富貴', romaji: 'Fūki', en: 'Wealth and Honor',
    verse: 'Accumulating even more wealth than flaunted on the ostentatious fans of yesterday.',
    rolls: { 4: FINISH, 5: 4, 6: 1 }
  },
  7: {
    kanji: '大問屋', romaji: "Ō-ton'ya", en: 'Large Wholesaler',
    verse: "Carrying and sending ten thousand [goods] of the large wholesaler's incoming ships, gathering wealth like persimmon is an auspicious sign.",
    rolls: { 2: 6, 5: 41 }
  },
  8: {
    kanji: '商賣繁昌', romaji: 'Shōbai Banjō', en: 'Prosperous Business',
    note: 'The illustration features a large treasure bag sitting atop a stone pedestal, symbolizing accumulated wealth. The verse likens the success of business to a mountain rising above the sea, tied to the auspicious beginnings of spring.',
    rolls: { 1: FINISH, 2: 13, 4: 25, 5: 9 }
  },
  9: {
    kanji: '家持', romaji: 'Iemochi', en: 'Householder / Homeowner',
    note: 'This verse celebrates the prosperity of a homeowner during a successful season, suggesting that wealth naturally accumulates at the door of a stable householder.',
    rolls: { 2: 12, 3: 10, 5: 1, 6: 22 }
  },
  10: {
    kanji: '出世', romaji: 'Shusse', en: 'Rising in the World',
    verse: "The person who has endured hardships has attained success. [The attainment] of one's desires is a joyous celebration.",
    note: 'Shusse — worldly success or promotion — gives the print half its title.',
    rolls: { 1: 2, 2: 1, 3: 6, 4: 4, 5: 9, 6: 26 }
  },
  11: {
    kanji: '金貸', romaji: 'Kanekashi', en: 'Money Lender',
    verse: 'I hear that the virtue of lending is great; as each step of the process is carried out, it turns into more money, which is truly joyful.',
    rolls: { 2: 6, 4: 43, 6: 4 }
  },
  12: {
    kanji: '札差', romaji: 'Fudasashi', en: 'Rice Broker',
    note: 'Fudasashi converted the rice stipends of bannermen into cash — and lent against them. The verse suggests that a single successful transaction can lead to an ascent in social status.',
    rolls: { 1: 4, 2: 6, 5: FINISH, 6: 41 }
  },
  13: {
    kanji: '銭屋', romaji: 'Zeniya', en: 'Money Shop',
    verse: "Like autumn leaves in a clear stream, when the value of the money rises and passes through the ‘mountain’ (attaining wealth), it is a great success when brought forth.",
    rolls: { 4: FINISH, 5: 7, 6: 40 }
  },
  14: {
    kanji: '見世開', romaji: 'Misebiraki', en: 'Opening a Shop',
    note: 'This cell celebrates the auspicious opening of a business — specifically a Southern Kimono Shop — likening the event to the fresh start of a spring morning.',
    rolls: { 1: 5, 3: 17, 6: 10 }
  },
  15: {
    kanji: '主人家督', romaji: 'Shujin Katoku', en: "Inheriting the Master's Headship",
    verse: "As a ceremonial fan is bestowed in celebration, the successor's rise to the headship of the family is a truly joyous occasion.",
    rolls: { 1: 5, 3: 9, 6: 2 }
  },
  16: {
    kanji: '潤澤', romaji: 'Juntaku', en: 'Affluence',
    verse: 'Achieving complete success (taking nine out of nine) is like watching a beautiful moon from the shore; when such fortunes pile up, the face is filled with layers of joy in this season of affluence.',
    rolls: { 1: 14, 3: 3, 6: 10 }
  },
  17: {
    kanji: '宿持', romaji: 'Yadomochi', en: 'Innkeeper',
    note: "This cell celebrates the life of an innkeeper, focusing on the hostess's hospitality. Whether it is day or night, her welcoming presence — a “face like the moon” — brings an auspicious and celebrated name to the establishment.",
    rolls: { 1: 12, 4: 15, 5: 14 }
  },
  18: {
    kanji: '家督', romaji: 'Katoku', en: 'Family Headship',
    note: 'The succession of a family business or headship. The verse describes the joyous occasion of a son succeeding his father, likening the smooth transition of power and the “face” of the family to the completeness of a full moon.',
    rolls: { 1: FINISH, 3: 8, 6: 21 }
  },
  19: {
    kanji: '醫行', romaji: 'Isha', en: 'Physician',
    note: 'The verse metaphorically describes health and rejuvenation, suggesting that under the care of a constant medical practice, one\'s body becomes as resilient as “scales” during the auspicious season of spring.',
    rolls: { 2: 9, 4: 21, 6: 20 }
  },
  20: {
    kanji: '儒者', romaji: 'Jusha', en: 'Confucian Scholar',
    note: 'The high social and moral status of a Confucian scholar. The verse suggests that a path built upon virtue and sincere study is a heavy and honorable way to “set out” in the world.',
    rolls: { 1: 30, 3: 19, 5: 10 }
  },
  21: {
    kanji: '宗匠', romaji: 'Sōshō', en: 'Master Teacher',
    verse: 'On a spring day, the wondrous art of the Master remains behind like a flower; it is a truly moving sight.',
    rolls: { 3: 16, 4: 33 }
  },
  22: {
    kanji: '部屋住', romaji: 'Heyazumi', en: 'Dependent / Room-dweller',
    verse: 'The dependent room-dweller is surely the young master of this world; donning his straw sandals in the spring, he sets out along the clear stream.',
    note: 'Typically an adult son still living at home with no headship of his own.',
    rolls: { 2: 4, 3: 23, 4: 17, 5: 26 }
  },
  23: {
    kanji: '學問', romaji: 'Gakumon', en: 'Study / Scholarship',
    verse: 'Even the eyes of the dice in this game of sugoroku seem to hurry toward study; in the spring, the knowledge I hear grows and flourishes, leading to success.',
    rolls: { 1: 20, 3: 19, 4: 30, 6: 18 }
  },
  24: {
    kanji: '一の富', romaji: 'Ichi no Tomi', en: 'Grand Lottery Winner',
    note: 'The immense luck of winning the top prize in a public temple lottery. The verse describes the sudden “storm” of excitement and the fluttering of tickets, likened to feathers, that culminates in drawing the winning slip.',
    rolls: { 1: 6, 3: 14 }
  },
  25: {
    kanji: '息子株', romaji: 'Musuko-kabu', en: "Heir's Status",
    note: 'The promising status of a recognized heir. The verse uses the metaphor of a plum tree — a symbol of early spring — to describe a son raised with great care, whose blossoming into a capable successor leads toward Family Headship.',
    rolls: { 1: 18, 4: 24, 5: 34, 6: 38 }
  },
  26: {
    kanji: '養子', romaji: 'Yōshi', en: 'Adopted Son',
    verse: 'Celebrated as he announces his new family name, the adopted son is full of joy, even as he shares the first ceremonial cup of spring sake.',
    rolls: { 1: 30, 5: 18, 6: 15 }
  },
  27: {
    kanji: '驕弁', romaji: 'Kyōben', en: 'Ostentation / Arrogance',
    verse: 'It is only because there are ordinary, passing days that displaying things so brilliantly and ostentatiously appears so strange (or delightfully out of place).',
    rolls: { 3: 33, 4: 40, 6: 45 }
  },
  28: {
    kanji: '執筆', romaji: 'Shippitsu', en: 'Taking up the Brush',
    verse: "Taking up the brush to rise in the world, one begins with the Thousand Character Classic (starting with the line ‘The sky is dark and the earth is yellow’) on New Year's Day.",
    rolls: { 1: 21, 2: 24, 5: 33 }
  },
  29: {
    kanji: '手代奉公', romaji: 'Tedai Hōkō', en: 'Merchant Clerk Service',
    verse: "A fortunate merchant house is one that is prosperous and complete; the essence of the way of business lies in diligently performing one's duties at the desk as instructed.",
    rolls: { 1: 15, 2: 17, 5: 44, 6: 30 }
  },
  30: {
    kanji: '女郎買', romaji: 'Jorō-kai', en: 'Patronizing the Pleasure Quarters',
    verse: "If one visits [the pleasure quarters] within the limits of one's social station and means, one can hear the beautiful tunes of the world from the first bud to the full flower.",
    rolls: { 1: 22, 4: 45, 6: 42 }
  },
  31: {
    kanji: '神佛信心', romaji: 'Kamihotoke Shinjin', en: 'Faith in Gods and Buddhas',
    note: 'The spiritual path of religious devotion. The verse suggests that a life of sincere faith leaves a lasting “trail” and leads to the “opening of gates” — both literal temple gates and spiritual or social breakthroughs.',
    rolls: { 3: 24, 5: 16 }
  },
  32: {
    kanji: '手習', romaji: 'Tenarai', en: 'Calligraphy Practice',
    verse: 'Just like the fresh young grass of early spring, approaching one\'s books and becoming accustomed to the brush is the beginning of a joyous and celebrated path.',
    rolls: { 2: 26, 4: 25, 5: 23 }
  },
  33: {
    kanji: '太鼓持', romaji: 'Taikomochi', en: 'Professional Jester',
    note: 'A taikomochi was a male entertainer in the pleasure quarters, skilled in conversation, music and comedy, who kept the atmosphere lively for patrons.',
    verse: 'Subject to thousands of shakes [as an entertainer], one thinks that surely there is a fated connection to the temples and shrines; moreover, even if it is just the silk one wears, one\'s path is decided.',
    rolls: { 1: 24, 3: 21, 4: 34 }
  },
  34: {
    kanji: '山師', romaji: 'Yamashi', en: 'Speculator / Swindler',
    note: 'In the Edo period a yamashi sought wealth through high-risk ventures such as mining speculation or opportunistic deals.',
    verse: 'Prosperity achieved without virtue is like a fruitless flower fluttering in the wind; one ultimately regrets the emptiness of such a life.',
    rolls: { 2: 9, 6: 44 }
  },
  35: {
    kanji: '講釋師', romaji: 'Kōshakushi', en: 'Professional Storyteller',
    verse: "One listens with great interest to the master's performance of war chronicles, delivered with such skillful eloquence.",
    rolls: { 5: 36, 6: 21 }
  },
  36: {
    kanji: '手習師匠', romaji: 'Tenarai Shishō', en: 'Calligraphy Teacher',
    verse: 'With head bowed down over the desk, the beautiful characters written to inquire after another\'s well-being are like a sky of peaceful ease; they are the very light of spring.',
    rolls: { 1: 16, 3: 21, 6: 35 }
  },
  37: {
    kanji: '年季勤', romaji: 'Nenki-zutome', en: 'Term Service',
    note: 'The period of obligatory service, often lasting several years, that an apprentice or labourer (nenkisha) must complete to gain experience or pay off a debt.',
    rolls: { 1: 15, 5: 32, 6: 44 }
  },
  38: {
    kanji: '藝者', romaji: 'Geisha', en: 'Geisha / Professional Entertainer',
    verse: "In the world of the arts, young and old alike gather one after another to admire the beauty — much like the colors of maples — in the spring of the geisha's tune.",
    rolls: { 1: 45, 3: FINISH, 4: 40 }
  },
  39: {
    kanji: '帰参', romaji: 'Kisan', en: 'Return to Service',
    note: 'Someone who has been away — perhaps after a prior failure or a temporary leave — being formally reinstated into a household or business.',
    verse: 'The time has come in the third month for returning to service; at the gate in early spring, one returns once more as if a newcomer.',
    rolls: { 1: 22, 2: 26, 3: 18, 4: 17 }
  },
  40: {
    kanji: '分散', romaji: 'Bunsan', en: 'Bankruptcy',
    verse: 'The once prosperous man is gone; in the grip of poverty, he wears a weary face. All his many possessions are sold off here and there, flickering away like a candle flame in the spring night.',
    rolls: { 6: 31 }
  },
  41: {
    kanji: '家質', romaji: 'Kashichi', en: 'House Pawned as Collateral',
    verse: 'In a world where a thousand gold pieces scatter away like petals, one struggles to pay the house rent; even so, among the blossoming plums, I hear word that good fortune will surely come.',
    rolls: { 1: 23, 3: 21, 4: 34 }
  },
  42: {
    kanji: '勘當', romaji: 'Kandō', en: 'Disinheritance',
    verse: "Having been disowned and now just emerging into the vast sea of the world, one finds themselves even reduced to sleeping on the ground inside a woman's house.",
    rolls: { 1: 39, 2: 28, 3: 33, 6: 45 }
  },
  43: {
    kanji: '遁世', romaji: 'Tonsei', en: 'Withdrawal from the World',
    verse: 'Whether one possesses power and influence or has grown weary of it, the self prays for a spiritual rising; rejoice, rejoice!',
    rolls: { 2: 34, 4: 21, 5: 35 }
  },
  44: {
    kanji: '駆落', romaji: 'Kakeochi', en: 'Absconding / Running Away',
    verse: 'Seeking the fruit of good fortune among the records of the world, one crosses over the difficult mountain pass; at last, the dawn of autumn arrives.',
    rolls: { 2: 31, 4: 45, 5: 31 }
  },
  45: {
    kanji: '願人坊主', romaji: 'Ganninbōzu', en: 'Mendicant Monk',
    note: 'The bottom-left corner of the print, and the bottom of Tokugawa society: an itinerant beggar-monk who performed austerities and prayers for coppers, his alms box painted with the name of Kōbō Daishi. The packet gives no verse for this cell — only “Game Over.”',
    ending: 'monk', rolls: {}
  },
  F: {
    kanji: '長者', romaji: 'Chōja', en: 'The Millionaire — Finish',
    note: 'The 上り (agari) square at the top of the print: the master of a wealthy house at his ease, with the treasure sack of a chōja beside him. Reaching it wins the game.',
    ending: 'finish', rolls: {}
  }
};

/* Board coordinates as percentages of the board image, measured from the
   numbered board diagram in the packet. */
const COORDS = {
  1:[87.07,13.04],   2:[13.89,13.00],  3:[88.41,25.86],  4:[71.85,25.91],
  5:[49.55,26.00],   6:[25.86,25.82],  7:[10.96,25.82],  8:[88.47,35.50],
  9:[71.91,35.54],  10:[56.82,35.50], 11:[41.02,35.50], 12:[25.67,35.46],
  13:[10.96,35.54], 14:[88.54,45.14], 15:[71.98,45.18], 16:[25.86,45.09],
  17:[11.08,45.09], 18:[88.54,55.00], 19:[71.98,55.00], 20:[25.86,55.00],
  21:[11.02,54.95], 22:[88.41,64.63], 23:[71.98,64.59], 24:[56.75,64.59],
  25:[41.02,64.46], 26:[25.86,64.59], 27:[11.08,64.55], 28:[88.28,74.45],
  29:[72.04,74.40], 30:[56.82,74.36], 31:[41.15,74.32], 32:[25.61,74.36],
  33:[11.08,74.32], 34:[88.28,83.29], 35:[72.10,83.33], 36:[56.88,83.38],
  37:[41.15,83.38], 38:[24.84,83.29], 39:[11.21,83.33], 40:[88.22,92.57],
  41:[71.85,92.40], 42:[56.56,92.62], 43:[41.02,92.40], 44:[25.61,92.40],
  45:[11.08,92.35], F:[50.80,13.10]
};
const START_COORD = [50.80, 51.40];

/* The six characters of the Start square, in die order. */
const CHARACTERS = [
  { die: 1, kanji: '養子',   romaji: 'Yōshi',    en: 'Adopted Son',        start: 26, color: '#1f4e79', ink: '#fff' },
  { die: 2, kanji: '年季者', romaji: 'Nenkisha', en: 'Apprentice',         start: 37, color: '#b03a2e', ink: '#fff' },
  { die: 3, kanji: '手代',   romaji: 'Tedai',    en: 'Merchant Clerk',     start: 29, color: '#4a7c3f', ink: '#fff' },
  { die: 4, kanji: '部屋住', romaji: 'Heyazumi', en: 'Room-dweller',       start: 22, color: '#c98f1e', ink: '#2a1e00' },
  { die: 5, kanji: '家督',   romaji: 'Katoku',   en: 'Family Head',        start: 18, color: '#6b3f8f', ink: '#fff' },
  { die: 6, kanji: '學問',   romaji: 'Gakumon',  en: 'Student',            start: 23, color: '#1f7a7a', ink: '#fff' }
];
