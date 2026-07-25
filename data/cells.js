/* ==================================================================
   壽出世双六 — CELL DATA
   ------------------------------------------------------------------
   This file is plain JSON with one assignment line at the top, so it
   can be edited exactly like a .json file while still letting
   index.html be opened directly from disk (a real .json would need a
   web server, because browsers block fetch() on file://).

   EDITING NOTES
   -------------
   kanji   the cell name as printed on the board.
   kana    the reading, in hiragana, used for furigana.
           Either a plain string  — "いきぬきちぎょう"  (ruby over the
           whole word), or an array of [kanji-chunk, reading] pairs —
           [["生抜","いきぬき"],["知行","ちぎょう"]] — for per-word ruby.
   romaji  romanisation, shown in English mode.
   name    the cell's name.  en = English, ja = modern Japanese gloss.
   verse   the verse from the packet.
   note    the explanatory note.
   rolls   die number -> destination cell.  "F" is the Finish square.
   ending  null, or "finish" / "retire" / "monk" for terminal cells.

   "jaDraft": true marks a Japanese text as a DRAFT translation made
   for this program — NOT a transcription of the print's own Japanese.
   The interface shows those with a 〈draft〉 marker.  When you replace
   one with your own text, delete its "jaDraft" line and the marker
   disappears.  An empty "ja" string simply falls back to English.

   English cell names, verses, summaries and roll tables are
   transcribed from the G30 History "Sugoroku Game Packet"
   (Nagoya University, Spring 2026).  Print: Utagawa Kuniteru,
   published by Eikyūdō.  Obvious typos in the packet were corrected:
   "Cel 26"->Cell 26, "Cel l6"->Cell 6, "Co to Cell 18"->Go to Cell 18.
   ================================================================== */

SUGOROKU.cells =
{
  "1": {
    "kanji": "生抜知行",
    "kana": [["生抜", "いきぬき"], ["知行", "ちぎょう"]],
    "romaji": "Ikinuki Chigyō",
    "name": { "en": "A Perseverant Retainer", "ja": "生き抜く知行取り", "jaDraft": true },
    "verse": {
      "en": "The number one priority for the house is to persevere and prosper for a thousand generations.",
      "ja": "家にとって何よりも大切なのは、生き抜いて千代までも栄えることである。",
      "jaDraft": true
    },
    "rolls": { "1": "F", "3": "2", "6": "44" }
  },

  "2": {
    "kanji": "左團扇",
    "kana": [["左", "ひだり"], ["團扇", "うちわ"]],
    "romaji": "Hidari Uchiwa",
    "name": { "en": "A Life of Ease", "ja": "左うちわの暮らし", "jaDraft": true },
    "verse": {
      "en": "A face radiant with fortune as beautiful as the autumn moon, wishing for longevity and eternal prosperity.",
      "ja": "秋の月のように美しく、幸福に輝く顔。長寿と永遠の繁栄を願う。",
      "jaDraft": true
    },
    "note": {
      "en": "Literally “fanning yourself with your left hand” — an idiom for living without having to work.",
      "ja": "文字どおりには「左手でうちわをあおぐ」。働かずとも暮らしていける身分をいう慣用句。",
      "jaDraft": true
    },
    "rolls": { "1": "4", "2": "F", "3": "5" }
  },

  "3": {
    "kanji": "両替",
    "kana": "りょうがえ",
    "romaji": "Ryōgae",
    "name": { "en": "Money Exchanger", "ja": "両替商", "jaDraft": true },
    "note": {
      "en": "The ryōgae handled the exchange between gold, silver and copper currencies — the backbone of Edo finance.",
      "ja": "両替商は金・銀・銭のあいだの交換を担い、江戸の金融を支える屋台骨であった。",
      "jaDraft": true
    },
    "rolls": { "1": "44", "6": "4" }
  },

  "4": {
    "kanji": "有徳",
    "kana": "うとく",
    "romaji": "Utoku",
    "name": { "en": "A Person of Virtue and Wealth", "ja": "徳と富を備えた人", "jaDraft": true },
    "verse": {
      "en": "If one possesses virtue it is said there is abundance and successful business for both parties.",
      "ja": "徳を備えていれば、双方にとって豊かさがあり、商いも栄えるという。",
      "jaDraft": true
    },
    "rolls": { "1": "2", "2": "F", "3": "6" }
  },

  "5": {
    "kanji": "隠居",
    "kana": "いんきょ",
    "romaji": "Inkyo",
    "name": { "en": "Honorable Retirement", "ja": "隠居", "jaDraft": true },
    "verse": {
      "en": "Good Fortune [is] taking firm root in the autumn moon [becoming] full.",
      "ja": "秋の月が満ちてゆくなかで、幸運がしっかりと根を下ろしてゆく。",
      "jaDraft": true
    },
    "note": {
      "en": "Marked 泊 (tomari, “lodging”) on the print — a resting place. Handing the headship to the next generation and withdrawing in honour ends your life course.",
      "ja": "版画には「泊」（とまり）と記されている——休息の場である。家督を次の代に譲り、名誉のうちに退くことで、その一生の道は終わる。",
      "jaDraft": true
    },
    "ending": "retire",
    "rolls": {}
  },

  "6": {
    "kanji": "富貴",
    "kana": "ふうき",
    "romaji": "Fūki",
    "name": { "en": "Wealth and Honor", "ja": "富貴", "jaDraft": true },
    "verse": {
      "en": "Accumulating even more wealth than flaunted on the ostentatious fans of yesterday.",
      "ja": "昨日の派手な扇に誇示されたよりも、さらに多くの富を積み重ねてゆく。",
      "jaDraft": true
    },
    "rolls": { "4": "F", "5": "4", "6": "1" }
  },

  "7": {
    "kanji": "大問屋",
    "kana": [["大", "おお"], ["問屋", "とんや"]],
    "romaji": "Ō-ton'ya",
    "name": { "en": "Large Wholesaler", "ja": "大問屋", "jaDraft": true },
    "verse": {
      "en": "Carrying and sending ten thousand [goods] of the large wholesaler's incoming ships, gathering wealth like persimmon is an auspicious sign.",
      "ja": "大問屋の入船が万の品を運び送る。柿のように富が集まるのは、めでたい兆しである。",
      "jaDraft": true
    },
    "rolls": { "2": "6", "5": "41" }
  },

  "8": {
    "kanji": "商賣繁昌",
    "kana": [["商賣", "しょうばい"], ["繁昌", "はんじょう"]],
    "romaji": "Shōbai Banjō",
    "name": { "en": "Prosperous Business", "ja": "商売繁盛", "jaDraft": true },
    "note": {
      "en": "The illustration features a large treasure bag sitting atop a stone pedestal, symbolizing accumulated wealth. The verse likens the success of business to a mountain rising above the sea, tied to the auspicious beginnings of spring.",
      "ja": "挿絵では石の台座の上に大きな宝袋が置かれ、蓄えられた富を象徴している。歌は商いの成功を海上にそびえる山になぞらえ、春のめでたい始まりに結びつけている。",
      "jaDraft": true
    },
    "rolls": { "1": "F", "2": "13", "4": "25", "5": "9" }
  },

  "9": {
    "kanji": "家持",
    "kana": [["家", "いえ"], ["持", "もち"]],
    "romaji": "Iemochi",
    "name": { "en": "Householder / Homeowner", "ja": "家持ち", "jaDraft": true },
    "note": {
      "en": "This verse celebrates the prosperity of a homeowner during a successful season, suggesting that wealth naturally accumulates at the door of a stable householder.",
      "ja": "この歌は実り豊かな季節における家持ちの繁栄を祝い、安定した家の主の門口には富が自然と集まることを示している。",
      "jaDraft": true
    },
    "rolls": { "2": "12", "3": "10", "5": "1", "6": "22" }
  },

  "10": {
    "kanji": "出世",
    "kana": "しゅっせ",
    "romaji": "Shusse",
    "name": { "en": "Rising in the World", "ja": "出世", "jaDraft": true },
    "verse": {
      "en": "The person who has endured hardships has attained success. [The attainment] of one's desires is a joyous celebration.",
      "ja": "苦労を重ねてきた者が、ついに成功を手にした。願いが叶うことは喜ばしい祝いである。",
      "jaDraft": true
    },
    "note": {
      "en": "Shusse — worldly success or promotion — gives the print half its title.",
      "ja": "「出世」——世に出て身を立てること——は、この版画の題名の半分を成している。",
      "jaDraft": true
    },
    "rolls": { "1": "2", "2": "1", "3": "6", "4": "4", "5": "9", "6": "26" }
  },

  "11": {
    "kanji": "金貸",
    "kana": [["金", "かね"], ["貸", "かし"]],
    "romaji": "Kanekashi",
    "name": { "en": "Money Lender", "ja": "金貸し", "jaDraft": true },
    "verse": {
      "en": "I hear that the virtue of lending is great; as each step of the process is carried out, it turns into more money, which is truly joyful.",
      "ja": "貸すことの徳は大きいと聞く。手順を一つひとつ踏むごとに、それはさらなる金へと変わってゆく。まことに喜ばしい。",
      "jaDraft": true
    },
    "rolls": { "2": "6", "4": "43", "6": "4" }
  },

  "12": {
    "kanji": "札差",
    "kana": [["札", "ふだ"], ["差", "さし"]],
    "romaji": "Fudasashi",
    "name": { "en": "Rice Broker", "ja": "札差", "jaDraft": true },
    "note": {
      "en": "Fudasashi converted the rice stipends of bannermen into cash — and lent against them. The verse suggests that a single successful transaction can lead to an ascent in social status.",
      "ja": "札差は旗本の禄米を現金に換え、またそれを担保に金を貸した。歌は、一度の商いの成功が身分の上昇につながりうることを示唆している。",
      "jaDraft": true
    },
    "rolls": { "1": "4", "2": "6", "5": "F", "6": "41" }
  },

  "13": {
    "kanji": "銭屋",
    "kana": [["銭", "ぜに"], ["屋", "や"]],
    "romaji": "Zeniya",
    "name": { "en": "Money Shop", "ja": "銭屋", "jaDraft": true },
    "verse": {
      "en": "Like autumn leaves in a clear stream, when the value of the money rises and passes through the ‘mountain’ (attaining wealth), it is a great success when brought forth.",
      "ja": "清流に浮かぶ紅葉のように、銭の値が上がって「山」を越えるとき（富を得るとき）、それは持ち出されて大きな成功となる。",
      "jaDraft": true
    },
    "rolls": { "4": "F", "5": "7", "6": "40" }
  },

  "14": {
    "kanji": "見世開",
    "kana": [["見世", "みせ"], ["開", "びらき"]],
    "romaji": "Misebiraki",
    "name": { "en": "Opening a Shop", "ja": "見世開き", "jaDraft": true },
    "note": {
      "en": "This cell celebrates the auspicious opening of a business — specifically a Southern Kimono Shop — likening the event to the fresh start of a spring morning.",
      "ja": "この枡は商いの縁起よい開業——とりわけ南方の呉服店の開店——を祝い、それを春の朝の新たな門出になぞらえている。",
      "jaDraft": true
    },
    "rolls": { "1": "5", "3": "17", "6": "10" }
  },

  "15": {
    "kanji": "主人家督",
    "kana": [["主人", "しゅじん"], ["家督", "かとく"]],
    "romaji": "Shujin Katoku",
    "name": { "en": "Inheriting the Master's Headship", "ja": "主人の家督を継ぐ", "jaDraft": true },
    "verse": {
      "en": "As a ceremonial fan is bestowed in celebration, the successor's rise to the headship of the family is a truly joyous occasion.",
      "ja": "祝いの扇が授けられるように、跡取りが家督の座に上ることは、まことに喜ばしい出来事である。",
      "jaDraft": true
    },
    "rolls": { "1": "5", "3": "9", "6": "2" }
  },

  "16": {
    "kanji": "潤澤",
    "kana": "じゅんたく",
    "romaji": "Juntaku",
    "name": { "en": "Affluence", "ja": "潤沢", "jaDraft": true },
    "verse": {
      "en": "Achieving complete success (taking nine out of nine) is like watching a beautiful moon from the shore; when such fortunes pile up, the face is filled with layers of joy in this season of affluence.",
      "ja": "九つのうち九つを取るような完全な成功は、岸辺から美しい月を眺めるようなもの。その幸運が積み重なるとき、潤沢のこの季節に、顔は幾重もの喜びに満ちる。",
      "jaDraft": true
    },
    "rolls": { "1": "14", "3": "3", "6": "10" }
  },

  "17": {
    "kanji": "宿持",
    "kana": [["宿", "やど"], ["持", "もち"]],
    "romaji": "Yadomochi",
    "name": { "en": "Innkeeper", "ja": "宿持ち", "jaDraft": true },
    "note": {
      "en": "This cell celebrates the life of an innkeeper, focusing on the hostess's hospitality. Whether it is day or night, her welcoming presence — a “face like the moon” — brings an auspicious and celebrated name to the establishment.",
      "ja": "この枡は宿屋の暮らしを、とりわけ女将のもてなしに焦点を当てて祝っている。昼であれ夜であれ、客を迎える彼女の「月のような顔」が、その宿にめでたく名高い評判をもたらす。",
      "jaDraft": true
    },
    "rolls": { "1": "12", "4": "15", "5": "14" }
  },

  "18": {
    "kanji": "家督",
    "kana": "かとく",
    "romaji": "Katoku",
    "name": { "en": "Family Headship", "ja": "家督", "jaDraft": true },
    "note": {
      "en": "The succession of a family business or headship. The verse describes the joyous occasion of a son succeeding his father, likening the smooth transition of power and the “face” of the family to the completeness of a full moon.",
      "ja": "家業あるいは家督の継承。歌は子が父の跡を継ぐ喜ばしい場面を描き、権限の円滑な移行と家の「顔」を、満月の完全さになぞらえている。",
      "jaDraft": true
    },
    "rolls": { "1": "F", "3": "8", "6": "21" }
  },

  "19": {
    "kanji": "醫行",
    "kana": "いしゃ",
    "romaji": "Isha",
    "name": { "en": "Physician", "ja": "医者", "jaDraft": true },
    "note": {
      "en": "The verse metaphorically describes health and rejuvenation, suggesting that under the care of a constant medical practice, one's body becomes as resilient as “scales” during the auspicious season of spring.",
      "ja": "歌は健康と若返りを比喩的に語り、絶えざる医の営みのもとで、春のめでたい季節に身体が「鱗」のように強靭になることを示している。",
      "jaDraft": true
    },
    "rolls": { "2": "9", "4": "21", "6": "20" }
  },

  "20": {
    "kanji": "儒者",
    "kana": "じゅしゃ",
    "romaji": "Jusha",
    "name": { "en": "Confucian Scholar", "ja": "儒者", "jaDraft": true },
    "note": {
      "en": "The high social and moral status of a Confucian scholar. The verse suggests that a path built upon virtue and sincere study is a heavy and honorable way to “set out” in the world.",
      "ja": "儒者の高い社会的・道徳的地位。歌は、徳と誠実な学問の上に築かれた道こそ、世に「出立」するための重く名誉ある道であると説く。",
      "jaDraft": true
    },
    "rolls": { "1": "30", "3": "19", "5": "10" }
  },

  "21": {
    "kanji": "宗匠",
    "kana": "そうしょう",
    "romaji": "Sōshō",
    "name": { "en": "Master Teacher", "ja": "宗匠", "jaDraft": true },
    "verse": {
      "en": "On a spring day, the wondrous art of the Master remains behind like a flower; it is a truly moving sight.",
      "ja": "春の日に、宗匠の妙なる芸は花のように後に残る。まことに心を動かす眺めである。",
      "jaDraft": true
    },
    "rolls": { "3": "16", "4": "33" }
  },

  "22": {
    "kanji": "部屋住",
    "kana": [["部屋", "へや"], ["住", "ずみ"]],
    "romaji": "Heyazumi",
    "name": { "en": "Dependent / Room-dweller", "ja": "部屋住み", "jaDraft": true },
    "verse": {
      "en": "The dependent room-dweller is surely the young master of this world; donning his straw sandals in the spring, he sets out along the clear stream.",
      "ja": "部屋住みの身とはいえ、まさしくこの世の若旦那。春に草鞋を履いて、清らかな流れに沿って旅立ってゆく。",
      "jaDraft": true
    },
    "note": {
      "en": "Typically an adult son still living at home with no headship of his own.",
      "ja": "多くは、自分の家督を持たないまま実家に暮らしている成人した息子を指す。",
      "jaDraft": true
    },
    "rolls": { "2": "4", "3": "23", "4": "17", "5": "26" }
  },

  "23": {
    "kanji": "學問",
    "kana": "がくもん",
    "romaji": "Gakumon",
    "name": { "en": "Study / Scholarship", "ja": "学問", "jaDraft": true },
    "verse": {
      "en": "Even the eyes of the dice in this game of sugoroku seem to hurry toward study; in the spring, the knowledge I hear grows and flourishes, leading to success.",
      "ja": "この双六の賽の目までもが、学問へと急いでいるようだ。春には、聞き知る学識が伸び栄えて、出世へとつながってゆく。",
      "jaDraft": true
    },
    "rolls": { "1": "20", "3": "19", "4": "30", "6": "18" }
  },

  "24": {
    "kanji": "一の富",
    "kana": [["一", "いち"], ["の", "の"], ["富", "とみ"]],
    "romaji": "Ichi no Tomi",
    "name": { "en": "Grand Lottery Winner", "ja": "富くじの一等", "jaDraft": true },
    "note": {
      "en": "The immense luck of winning the top prize in a public temple lottery. The verse describes the sudden “storm” of excitement and the fluttering of tickets, likened to feathers, that culminates in drawing the winning slip.",
      "ja": "寺社の富くじで一等を引き当てるという計り知れない幸運。歌は、羽のように舞う札と、突然の「嵐」のような興奮を描き、当たり札を引く場面で締めくくられる。",
      "jaDraft": true
    },
    "rolls": { "1": "6", "3": "14" }
  },

  "25": {
    "kanji": "息子株",
    "kana": [["息子", "むすこ"], ["株", "かぶ"]],
    "romaji": "Musuko-kabu",
    "name": { "en": "Heir's Status", "ja": "跡取りの身分", "jaDraft": true },
    "note": {
      "en": "The promising status of a recognized heir. The verse uses the metaphor of a plum tree — a symbol of early spring — to describe a son raised with great care, whose blossoming into a capable successor leads toward Family Headship.",
      "ja": "認められた跡取りの前途有望な身分。歌は早春の象徴である梅の木の比喩を用い、大切に育てられた息子が立派な後継者として花開き、家督へと向かってゆく姿を描いている。",
      "jaDraft": true
    },
    "rolls": { "1": "18", "4": "24", "5": "34", "6": "38" }
  },

  "26": {
    "kanji": "養子",
    "kana": "ようし",
    "romaji": "Yōshi",
    "name": { "en": "Adopted Son", "ja": "養子", "jaDraft": true },
    "verse": {
      "en": "Celebrated as he announces his new family name, the adopted son is full of joy, even as he shares the first ceremonial cup of spring sake.",
      "ja": "新しい姓を名乗ることを祝われ、養子は喜びに満ちて、春の祝いの最初の盃を酌み交わす。",
      "jaDraft": true
    },
    "rolls": { "1": "30", "5": "18", "6": "15" }
  },

  "27": {
    "kanji": "驕弁",
    "kana": "きょうべん",
    "romaji": "Kyōben",
    "name": { "en": "Ostentation / Arrogance", "ja": "驕り・見栄", "jaDraft": true },
    "verse": {
      "en": "It is only because there are ordinary, passing days that displaying things so brilliantly and ostentatiously appears so strange (or delightfully out of place).",
      "ja": "ありふれた日々が過ぎてゆくからこそ、これほど華やかに見せびらかす姿が、かえって奇妙に（あるいは面白いほど場違いに）映るのだ。",
      "jaDraft": true
    },
    "rolls": { "3": "33", "4": "40", "6": "45" }
  },

  "28": {
    "kanji": "執筆",
    "kana": "しっぴつ",
    "romaji": "Shippitsu",
    "name": { "en": "Taking up the Brush", "ja": "筆を執る", "jaDraft": true },
    "verse": {
      "en": "Taking up the brush to rise in the world, one begins with the Thousand Character Classic (starting with the line ‘The sky is dark and the earth is yellow’) on New Year's Day.",
      "ja": "世に出るために筆を執り、元日に『千字文』——「天地玄黄」の句から始まる——を書き起こす。",
      "jaDraft": true
    },
    "rolls": { "1": "21", "2": "24", "5": "33" }
  },

  "29": {
    "kanji": "手代奉公",
    "kana": [["手代", "てだい"], ["奉公", "ほうこう"]],
    "romaji": "Tedai Hōkō",
    "name": { "en": "Merchant Clerk Service", "ja": "手代奉公", "jaDraft": true },
    "verse": {
      "en": "A fortunate merchant house is one that is prosperous and complete; the essence of the way of business lies in diligently performing one's duties at the desk as instructed.",
      "ja": "幸いなる商家とは、栄えて満ち足りた家のこと。商いの道の要は、言いつけどおりに帳場の務めを勤勉に果たすことにある。",
      "jaDraft": true
    },
    "rolls": { "1": "15", "2": "17", "5": "44", "6": "30" }
  },

  "30": {
    "kanji": "女郎買",
    "kana": [["女郎", "じょろう"], ["買", "かい"]],
    "romaji": "Jorō-kai",
    "name": { "en": "Patronizing the Pleasure Quarters", "ja": "女郎買い", "jaDraft": true },
    "verse": {
      "en": "If one visits [the pleasure quarters] within the limits of one's social station and means, one can hear the beautiful tunes of the world from the first bud to the full flower.",
      "ja": "身分と分限の内で通うならば、初めの蕾から満開の花まで、この世の美しい調べを聞くことができる。",
      "jaDraft": true
    },
    "rolls": { "1": "22", "4": "45", "6": "42" }
  },

  "31": {
    "kanji": "神佛信心",
    "kana": [["神佛", "かみほとけ"], ["信心", "しんじん"]],
    "romaji": "Kamihotoke Shinjin",
    "name": { "en": "Faith in Gods and Buddhas", "ja": "神仏信心", "jaDraft": true },
    "note": {
      "en": "The spiritual path of religious devotion. The verse suggests that a life of sincere faith leaves a lasting “trail” and leads to the “opening of gates” — both literal temple gates and spiritual or social breakthroughs.",
      "ja": "信仰による精神の道。歌は、誠実な信心の生涯が末長い「跡」を残し、「門の開き」——実際の寺社の門であり、また精神的・社会的な開けでもある——へと導くことを示している。",
      "jaDraft": true
    },
    "rolls": { "3": "24", "5": "16" }
  },

  "32": {
    "kanji": "手習",
    "kana": [["手", "て"], ["習", "ならい"]],
    "romaji": "Tenarai",
    "name": { "en": "Calligraphy Practice", "ja": "手習い", "jaDraft": true },
    "verse": {
      "en": "Just like the fresh young grass of early spring, approaching one's books and becoming accustomed to the brush is the beginning of a joyous and celebrated path.",
      "ja": "早春の瑞々しい若草のように、書物に向かい筆に慣れてゆくことは、喜ばしくめでたい道の始まりである。",
      "jaDraft": true
    },
    "rolls": { "2": "26", "4": "25", "5": "23" }
  },

  "33": {
    "kanji": "太鼓持",
    "kana": [["太鼓", "たいこ"], ["持", "もち"]],
    "romaji": "Taikomochi",
    "name": { "en": "Professional Jester", "ja": "太鼓持ち", "jaDraft": true },
    "verse": {
      "en": "Subject to thousands of shakes [as an entertainer], one thinks that surely there is a fated connection to the temples and shrines; moreover, even if it is just the silk one wears, one's path is decided.",
      "ja": "幾千の揺さぶりを受ける身であれば、寺社との縁もまた定めであろうと思う。まして身にまとう絹一枚にすぎずとも、進むべき道は決まっている。",
      "jaDraft": true
    },
    "note": {
      "en": "A taikomochi was a male entertainer in the pleasure quarters, skilled in conversation, music and comedy, who kept the atmosphere lively for patrons.",
      "ja": "太鼓持ちは遊里の男性芸人で、話芸・音曲・滑稽に長け、客のために座を賑やかに保つ役を務めた。",
      "jaDraft": true
    },
    "rolls": { "1": "24", "3": "21", "4": "34" }
  },

  "34": {
    "kanji": "山師",
    "kana": [["山", "やま"], ["師", "し"]],
    "romaji": "Yamashi",
    "name": { "en": "Speculator / Swindler", "ja": "山師", "jaDraft": true },
    "verse": {
      "en": "Prosperity achieved without virtue is like a fruitless flower fluttering in the wind; one ultimately regrets the emptiness of such a life.",
      "ja": "徳によらずに得た繁栄は、風に舞う徒花のようなもの。やがてその空しさを悔いることになる。",
      "jaDraft": true
    },
    "note": {
      "en": "In the Edo period a yamashi sought wealth through high-risk ventures such as mining speculation or opportunistic deals.",
      "ja": "江戸時代の山師は、鉱山への投機や機を狙った取引など、危険の大きい事業によって富を求めた者をいう。",
      "jaDraft": true
    },
    "rolls": { "2": "9", "6": "44" }
  },

  "35": {
    "kanji": "講釋師",
    "kana": [["講釋", "こうしゃく"], ["師", "し"]],
    "romaji": "Kōshakushi",
    "name": { "en": "Professional Storyteller", "ja": "講釈師", "jaDraft": true },
    "verse": {
      "en": "One listens with great interest to the master's performance of war chronicles, delivered with such skillful eloquence.",
      "ja": "巧みな弁舌で語られる師の軍記の一席に、深く興を覚えて聞き入る。",
      "jaDraft": true
    },
    "rolls": { "5": "36", "6": "21" }
  },

  "36": {
    "kanji": "手習師匠",
    "kana": [["手習", "てならい"], ["師匠", "ししょう"]],
    "romaji": "Tenarai Shishō",
    "name": { "en": "Calligraphy Teacher", "ja": "手習師匠", "jaDraft": true },
    "verse": {
      "en": "With head bowed down over the desk, the beautiful characters written to inquire after another's well-being are like a sky of peaceful ease; they are the very light of spring.",
      "ja": "机に頭を垂れて、人の安否を尋ねるために書かれた美しい文字は、のどかに晴れた空のよう。それこそが春の光である。",
      "jaDraft": true
    },
    "rolls": { "1": "16", "3": "21", "6": "35" }
  },

  "37": {
    "kanji": "年季勤",
    "kana": [["年季", "ねんき"], ["勤", "づとめ"]],
    "romaji": "Nenki-zutome",
    "name": { "en": "Term Service", "ja": "年季勤め", "jaDraft": true },
    "note": {
      "en": "The period of obligatory service, often lasting several years, that an apprentice or labourer (nenkisha) must complete to gain experience or pay off a debt.",
      "ja": "年季者（奉公人や年季奉公の労働者）が、修業を積むため、あるいは借財を返すために勤め上げねばならない、多くは数年に及ぶ義務の奉公期間。",
      "jaDraft": true
    },
    "rolls": { "1": "15", "5": "32", "6": "44" }
  },

  "38": {
    "kanji": "藝者",
    "kana": "げいしゃ",
    "romaji": "Geisha",
    "name": { "en": "Geisha / Professional Entertainer", "ja": "芸者", "jaDraft": true },
    "verse": {
      "en": "In the world of the arts, young and old alike gather one after another to admire the beauty — much like the colors of maples — in the spring of the geisha's tune.",
      "ja": "芸の世界では、老いも若きも次々と集まり、芸者の調べの春に、紅葉の色のようなその美しさを愛でる。",
      "jaDraft": true
    },
    "rolls": { "1": "45", "3": "F", "4": "40" }
  },

  "39": {
    "kanji": "帰参",
    "kana": "きさん",
    "romaji": "Kisan",
    "name": { "en": "Return to Service", "ja": "帰参", "jaDraft": true },
    "verse": {
      "en": "The time has come in the third month for returning to service; at the gate in early spring, one returns once more as if a newcomer.",
      "ja": "三月になって帰参の時が来た。早春の門口に、また新参の者のようにして戻ってくる。",
      "jaDraft": true
    },
    "note": {
      "en": "Someone who has been away — perhaps after a prior failure or a temporary leave — being formally reinstated into a household or business.",
      "ja": "しばらく離れていた者が——以前の失敗の後、あるいは一時の暇の後であることも多い——正式に家や店へ復帰すること。",
      "jaDraft": true
    },
    "rolls": { "1": "22", "2": "26", "3": "18", "4": "17" }
  },

  "40": {
    "kanji": "分散",
    "kana": "ぶんさん",
    "romaji": "Bunsan",
    "name": { "en": "Bankruptcy", "ja": "分散（破産）", "jaDraft": true },
    "verse": {
      "en": "The once prosperous man is gone; in the grip of poverty, he wears a weary face. All his many possessions are sold off here and there, flickering away like a candle flame in the spring night.",
      "ja": "かつて栄えた男はもういない。貧窮に捕らえられ、疲れ切った顔をしている。数多の持ち物はあちらこちらへ売り払われ、春の夜の灯のように揺らめいて消えてゆく。",
      "jaDraft": true
    },
    "rolls": { "6": "31" }
  },

  "41": {
    "kanji": "家質",
    "kana": "かしち",
    "romaji": "Kashichi",
    "name": { "en": "House Pawned as Collateral", "ja": "家を質に入れる", "jaDraft": true },
    "verse": {
      "en": "In a world where a thousand gold pieces scatter away like petals, one struggles to pay the house rent; even so, among the blossoming plums, I hear word that good fortune will surely come.",
      "ja": "千金が花びらのように散ってゆく世で、店賃を払うのにも苦しむ。それでも咲きそめる梅のなかに、幸運は必ず訪れるという便りを聞く。",
      "jaDraft": true
    },
    "rolls": { "1": "23", "3": "21", "4": "34" }
  },

  "42": {
    "kanji": "勘當",
    "kana": "かんどう",
    "romaji": "Kandō",
    "name": { "en": "Disinheritance", "ja": "勘当", "jaDraft": true },
    "verse": {
      "en": "Having been disowned and now just emerging into the vast sea of the world, one finds themselves even reduced to sleeping on the ground inside a woman's house.",
      "ja": "勘当されて、いま広い世間の海へ漕ぎ出したばかり。ついには女の家の土間に寝るまでに身を落とす。",
      "jaDraft": true
    },
    "rolls": { "1": "39", "2": "28", "3": "33", "6": "45" }
  },

  "43": {
    "kanji": "遁世",
    "kana": "とんせい",
    "romaji": "Tonsei",
    "name": { "en": "Withdrawal from the World", "ja": "遁世", "jaDraft": true },
    "verse": {
      "en": "Whether one possesses power and influence or has grown weary of it, the self prays for a spiritual rising; rejoice, rejoice!",
      "ja": "権勢を持つ者であれ、それに倦み疲れた者であれ、その心は霊的な高まりを祈る。喜べ、喜べ。",
      "jaDraft": true
    },
    "rolls": { "2": "34", "4": "21", "5": "35" }
  },

  "44": {
    "kanji": "駆落",
    "kana": [["駆", "かけ"], ["落", "おち"]],
    "romaji": "Kakeochi",
    "name": { "en": "Absconding / Running Away", "ja": "駆け落ち", "jaDraft": true },
    "verse": {
      "en": "Seeking the fruit of good fortune among the records of the world, one crosses over the difficult mountain pass; at last, the dawn of autumn arrives.",
      "ja": "世の記録のうちに幸運の実を求めて、難所の峠を越えてゆく。ついに秋の夜明けが訪れる。",
      "jaDraft": true
    },
    "rolls": { "2": "31", "4": "45", "5": "31" }
  },

  "45": {
    "kanji": "願人坊主",
    "kana": [["願人", "がんにん"], ["坊主", "ぼうず"]],
    "romaji": "Ganninbōzu",
    "name": { "en": "Mendicant Monk", "ja": "願人坊主", "jaDraft": true },
    "note": {
      "en": "The bottom-left corner of the print, and the bottom of Tokugawa society: an itinerant beggar-monk who performed austerities and prayers for coppers, his alms box painted with the name of Kōbō Daishi. The packet gives no verse for this cell — only “Game Over.”",
      "ja": "版画の左下隅、そして徳川社会の底辺——わずかな銭のために苦行と祈祷を行う流浪の乞食僧で、その頭陀袋には弘法大師の名が記されている。教材にはこの枡の歌はなく、ただ「Game Over」とのみ記されている。",
      "jaDraft": true
    },
    "ending": "monk",
    "rolls": {}
  },

  "F": {
    "kanji": "長者",
    "kana": "ちょうじゃ",
    "romaji": "Chōja",
    "name": { "en": "The Millionaire — Finish", "ja": "長者（上がり）", "jaDraft": true },
    "note": {
      "en": "The 上り (agari) square at the top of the print: the master of a wealthy house at his ease, with the treasure sack of a chōja beside him. Reaching it wins the game.",
      "ja": "版画の最上部にある「上り」（あがり）の枡。裕福な家の主が、長者の宝袋を傍らに置いてくつろぐ姿。ここに至れば勝ちとなる。",
      "jaDraft": true
    },
    "ending": "finish",
    "rolls": {}
  }
};
