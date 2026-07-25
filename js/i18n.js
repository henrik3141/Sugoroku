/* ==================================================================
   壽出世双六 — language, furigana and text resolution
   ------------------------------------------------------------------
   Everything the interface says goes through t().  Everything the
   cell data says goes through txt().  Both fall back to English when
   a Japanese string is missing, so the data files can be translated a
   little at a time without the page ever breaking.
   ================================================================== */
(function () {
'use strict';

const UI = SUGOROKU.ui;
const LANGS = ['en', 'ja'];

/* localStorage is unavailable on file:// in some browsers — remember
   the choice in memory instead of failing. */
const store = (function () {
  try {
    const k = '__sugoroku_probe';
    localStorage.setItem(k, '1'); localStorage.removeItem(k);
    return localStorage;
  } catch (e) {
    const mem = {};
    return { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); } };
  }
})();

let lang = LANGS.includes(store.getItem('sugoroku.lang')) ? store.getItem('sugoroku.lang') : 'en';
let furigana = store.getItem('sugoroku.furigana') !== '0';
const listeners = [];

const esc = s => String(s == null ? '' : s)
  .replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

/* Fill {placeholders}.  Values are inserted as-is, so callers escape
   anything that came from a player. */
function fill(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/* An interface string. */
function t(key, vars) {
  const s = (UI[lang] && UI[lang][key]) || UI.en[key];
  return fill(s == null ? key : s, vars);
}

/* A piece of cell data shaped { en, ja, jaDraft }.
   Returns { text, draft } — draft is true when we are showing a
   translation made for this program rather than source material. */
function txt(field) {
  if (field == null) return null;
  if (typeof field === 'string') return { text: field, draft: false };
  const ja = (field.ja || '').trim();
  if (lang === 'ja' && ja) return { text: ja, draft: !!field.jaDraft };
  return { text: field.en || ja || '', draft: false };
}

/* Plain-text version of the above, for title attributes and alt text. */
function plain(field) {
  const r = txt(field);
  return r ? r.text : '';
}

/* Kanji with furigana.  `kana` is either a reading for the whole word,
   or [[kanji-chunk, reading], …] for per-word ruby. */
function ruby(kanji, kana) {
  if (!furigana || !kana) return esc(kanji);
  if (Array.isArray(kana)) {
    return '<ruby>' + kana.map(pair =>
      `${esc(pair[0])}<rt>${esc(pair[1])}</rt>`).join('') + '</ruby>';
  }
  return `<ruby>${esc(kanji)}<rt>${esc(kana)}</rt></ruby>`;
}

/* The same, wrapped in the .jp span used everywhere for Japanese runs. */
function jp(entry) {
  if (!entry) return '';
  return `<span class="jp">${ruby(entry.kanji, entry.kana)}</span>`;
}

/* "Cell 12" / "第12番", and the Finish square. */
function numOf(k) {
  return String(k) === 'F' ? t('cell.finish') : t('cell.n', { n: k });
}

function setLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  lang = l;
  store.setItem('sugoroku.lang', l);
  announce();
}

function setFurigana(on) {
  on = !!on;
  if (on === furigana) return;
  furigana = on;
  store.setItem('sugoroku.furigana', on ? '1' : '0');
  announce();
}

function announce() {
  document.documentElement.lang = t('html.lang');
  document.documentElement.classList.toggle('lang-ja', lang === 'ja');
  document.documentElement.classList.toggle('furigana', furigana);
  document.title = t('doc.title');
  listeners.forEach(fn => fn(lang));
}

SUGOROKU.i18n = {
  get lang() { return lang; },
  get furigana() { return furigana; },
  t, txt, plain, ruby, jp, numOf, esc, fill,
  setLang, setFurigana,
  toggleLang: () => setLang(lang === 'en' ? 'ja' : 'en'),
  onChange: fn => listeners.push(fn),
  apply: announce
};

})();
