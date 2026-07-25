/* ==================================================================
   壽出世双六 — Kotobuki Shusse Sugoroku
   Game engine + board UI.  No dependencies, runs from file://

   All content lives in data/*.js; all wording goes through
   SUGOROKU.i18n, so the whole page can switch language at any moment
   without losing the game in progress.
   ================================================================== */
(function () {
'use strict';

const CELLS      = SUGOROKU.cells;
const CHARACTERS = SUGOROKU.characters;
const COORDS     = SUGOROKU.coords;
const I          = SUGOROKU.i18n;
const { t, txt, jp, numOf, esc } = I;

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const KEYS = Object.keys(CELLS);                       // '1'..'45','F'
const TERMINAL = k => !CELLS[k] || Object.keys(CELLS[k].rolls).length === 0;

/* die number -> destination, sorted, as [[die, to], …] */
const optionsOf = k => Object.entries(CELLS[k].rolls).sort((a, b) => a[0] - b[0]);

/* which of the three endings a cell is, or 'normal' */
const kindOf = k => CELLS[k] && CELLS[k].ending ? CELLS[k].ending : 'normal';

/* ---------------------------------------------------------------
   1.  Exact analysis of the board (absorbing Markov chain)
   Every listed roll in a cell is equally likely, because an
   unlisted number is simply re-rolled until it hits.
--------------------------------------------------------------- */
const ANALYSIS = (function () {
  const trans = KEYS.filter(k => !TERMINAL(k));
  const abs = ['F', '5', '45'];                        // finish, retire, monk
  const ix = {}; trans.forEach((k, i) => ix[k] = i);
  const n = trans.length, w = n + 4;                   // [ I-Q | R(3) | 1 ]
  const M = Array.from({ length: n }, () => new Float64Array(w));

  trans.forEach((k, i) => {
    M[i][i] = 1;
    const outs = Object.values(CELLS[k].rolls).map(String);
    const p = 1 / outs.length;
    outs.forEach(to => {
      const a = abs.indexOf(to);
      if (a >= 0) M[i][n + a] += p;
      else M[i][ix[to]] -= p;
    });
    M[i][n + 3] = 1;
  });

  for (let c = 0; c < n; c++) {                        // Gauss-Jordan
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c]; M[c] = M[piv]; M[piv] = tmp;
    const d = M[c][c];
    for (let j = c; j < w; j++) M[c][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c || !M[r][c]) continue;
      const f = M[r][c];
      for (let j = c; j < w; j++) M[r][j] -= f * M[c][j];
    }
  }

  const out = {};
  trans.forEach((k, i) => out[k] = { finish: M[i][n], retire: M[i][n + 1], monk: M[i][n + 2], turns: M[i][n + 3] });
  out['F']  = { finish: 1, retire: 0, monk: 0, turns: 0 };
  out['5']  = { finish: 0, retire: 1, monk: 0, turns: 0 };
  out['45'] = { finish: 0, retire: 0, monk: 1, turns: 0 };
  return out;
})();

/* cells that lead into a given cell — a factual, useful cross-reference */
const INBOUND = (function () {
  const m = {}; KEYS.forEach(k => m[k] = []);
  KEYS.forEach(k => Object.values(CELLS[k].rolls).forEach(to => {
    if (!m[String(to)].includes(k)) m[String(to)].push(k);
  }));
  return m;
})();

/* ---------------------------------------------------------------
   2.  Small helpers
--------------------------------------------------------------- */
const img   = k => k === 'F' ? 'assets/finish.jpg' : 'assets/cell' + String(k).padStart(2, '0') + '.jpg';
const pct   = x => (x * 100).toFixed(0) + '%';
const d6    = () => 1 + Math.floor(Math.random() * 6);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick  = n => Math.floor(Math.random() * n);

const cellName = k => I.plain(CELLS[k].name);
const charName = c => I.plain(c.name);

/* How a cell or character is named in running text.
   In English the kanji needs a gloss beside it.  In Japanese the kanji
   IS the name — appending the modern gloss would only produce
   "女郎買 女郎買い", so the gloss is left to the cell card. */
const labelOf   = k => I.lang === 'en' ? `${jp(CELLS[k])} ${esc(cellName(k))}` : jp(CELLS[k]);
const charLabel = c => I.lang === 'en' ? `${jp(c)} ${esc(charName(c))}` : jp(c);

const draftTag = () =>
  ` <span class="draft" title="${esc(t('card.draft.title'))}">〈${esc(t('card.draft'))}〉</span>`;

/* a { en, ja, jaDraft } field as a paragraph, marked if it is a draft */
function fieldHTML(field, cls) {
  const r = txt(field);
  if (!r || !r.text) return '';
  return `<p class="${cls}">${esc(r.text)}${r.draft ? draftTag() : ''}</p>`;
}

const ENDINGS = {
  finish: { cls: 'win'    },
  retire: { cls: 'retire' },
  monk:   { cls: 'monk'   }
};
const endLabel = e => t('end.' + e + '.label');
const endVerb  = e => t('end.' + e + '.verb');

const PIPS = {
  1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [1, 3], [3, 1], [3, 3]], 5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
  6: [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]]
};
function drawDie(el, v, hit) {
  el.innerHTML = PIPS[v].map(([r, c]) =>
    `<i class="${hit ? 'red' : ''}" style="grid-area:${r}/${c}"></i>`).join('');
}

/* ---------------------------------------------------------------
   3.  Game state
--------------------------------------------------------------- */
const G = {
  players: [],      // {name, ch, at, path:[…], done:null|'finish'|'retire'|'monk'}
  turn: 0,
  round: 1,
  selected: null,
  busy: false,
  auto: false,
  showNums: true,
  mode: 'wheel',    // 'wheel' | 'die'
  cardOpts: null,   // options the cell card was last drawn with
  msgFn: null,      // () => html, re-run when the language changes
  log: []           // [{fn, pi, big}] — same, so the record can be re-read
};

let wheel = null;

/* ---------------------------------------------------------------
   4.  Static interface text
--------------------------------------------------------------- */
function applyStatic() {
  $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });

  const sug = `<span class="jp">${I.ruby('双六', 'すごろく')}</span>`;
  const title = `<span class="jp">${I.ruby('壽出世双六', 'ことぶきしゅっせすごろく')}</span>`;
  const kuniteru = `<span class="jp">（${I.ruby('國輝画', 'くにてるが')}）</span>`;
  const eikyudo  = `<span class="jp">（${I.ruby('榮久堂版', 'えいきゅうどうばん')}）</span>`;

  $('#setup-lede').innerHTML = t('setup.lede', { sugoroku: sug });
  $('#print-credit').innerHTML = t('setup.printCredit', { title, eikyudo, kuniteru });
  $('#foot-note').innerHTML = t('foot.note', { title });
  $('#title-jp').innerHTML = I.ruby('壽出世双六', 'ことぶきしゅっせすごろく');

  $('#lang-btn').textContent = t('lang.switch');
  $('#lang-btn').title = t('lang.switch.title');
  $('#mode-hint').textContent = t('mode.hint.' + G.mode);
  $('#btn-roll').textContent = t(G.mode === 'wheel' ? 'btn.spin' : 'btn.roll');
}

/* ---------------------------------------------------------------
   5.  Setup screen
--------------------------------------------------------------- */
let setupCount = 3, setupChars = [], setupNames = [];

function buildCountRow() {
  $('#count-row').innerHTML = [1, 2, 3, 4, 5, 6]
    .map(n => `<button data-n="${n}" class="${n === setupCount ? 'on' : ''}">${n}</button>`).join('');
  $$('#count-row button').forEach(b => b.onclick = () => {
    setupCount = +b.dataset.n; rollCharacters(); buildCountRow();
  });
}

/* Rule: each player rolls for a character; a character already taken is
   re-rolled.  We simulate exactly that, so the assignment is honest. */
function rollCharacters() {
  const taken = new Set(); setupChars = [];
  for (let i = 0; i < setupCount; i++) {
    let r; do { r = d6(); } while (taken.has(r));
    taken.add(r); setupChars.push(CHARACTERS[r - 1]);
  }
  renderSetupPlayers();
}

function renderSetupPlayers() {
  $('#player-rows').innerHTML = setupChars.map((c, i) => `
    <div class="player-row">
      <span class="swatch" style="background:${c.color}"></span>
      <input type="text" data-i="${i}" placeholder="${esc(t('setup.playerName', { n: i + 1 }))}"
             value="${esc(setupNames[i] || '')}">
      <span class="who">${t('setup.rolled', { die: c.die })} — ${charLabel(c)}
        <br><span style="opacity:.7">${t('setup.startsIn', { cell: numOf(c.start) })}</span></span>
    </div>`).join('');
  $$('#player-rows input').forEach(inp => inp.oninput = () => setupNames[+inp.dataset.i] = inp.value);
}

/* ---------------------------------------------------------------
   6.  Board
--------------------------------------------------------------- */
function buildBoard() {
  const f = $('#board-frame');
  $$('.cellspot, .pawn', f).forEach(e => e.remove());

  KEYS.forEach(k => {
    const [x, y] = COORDS[k];
    const s = document.createElement('button');
    s.className = 'cellspot' + (k === 'F' ? ' finish' : '') + (TERMINAL(k) && k !== 'F' ? ' term' : '');
    s.style.left = x + '%'; s.style.top = y + '%';
    s.dataset.k = k;
    s.textContent = k === 'F' ? '上' : k;
    s.onclick = () => selectCell(k);
    f.appendChild(s);
  });
  labelBoard();

  G.players.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'pawn'; el.id = 'pawn' + i;
    el.style.background = p.ch.color; el.style.color = p.ch.ink;
    el.textContent = i + 1;
    el.title = p.name;
    f.appendChild(el);
  });
  placePawns();
  applyNumberToggle();
}

/* tooltips depend on the language, so they are refreshed on their own */
function labelBoard() {
  $$('#board-frame .cellspot').forEach(s => {
    const k = s.dataset.k;
    s.title = `${numOf(k)} — ${CELLS[k].kanji} ${cellName(k)}`;
  });
}

function placePawns() {
  const byCell = {};
  G.players.forEach((p, i) => (byCell[p.at] = byCell[p.at] || []).push(i));
  Object.entries(byCell).forEach(([k, list]) => {
    const [x, y] = COORDS[k];
    list.forEach((pi, j) => {
      const el = $('#pawn' + pi); if (!el) return;
      const ang = list.length > 1 ? (j / list.length) * Math.PI * 2 - Math.PI / 2 : 0;
      const r = list.length > 1 ? 2.6 : 0;
      el.style.left = (x + Math.cos(ang) * r) + '%';
      el.style.top  = (y + Math.sin(ang) * r * 0.69) + '%';
      el.classList.toggle('active', pi === G.turn && !G.players[pi].done);
      el.classList.toggle('done', !!G.players[pi].done);
    });
  });
}

function applyNumberToggle() {
  $$('.cellspot').forEach(s => s.classList.toggle('hide-num', !G.showNums));
}

function highlightTargets(k) {
  $$('.cellspot').forEach(s => s.classList.remove('target'));
  if (!k) return;
  new Set(Object.values(CELLS[k].rolls).map(String)).forEach(to => {
    const el = $(`.cellspot[data-k="${to}"]`); if (el) el.classList.add('target');
  });
}

/* ---------------------------------------------------------------
   7.  Cell card
--------------------------------------------------------------- */
function selectCell(k) {
  G.selected = k;
  $$('.cellspot').forEach(s => s.classList.toggle('selected', s.dataset.k === String(k)));
  renderCellCard(k);
}

function cellCardHTML(k, opts) {
  opts = opts || {};
  const c = CELLS[k], a = ANALYSIS[k];
  const nameRes = txt(c.name);

  let h = `<div class="imgwrap"><img src="${img(k)}" alt="${esc(cellName(k))}">
             <span class="num">${numOf(k)}</span></div>
           <div class="body">
             <div class="kanji">${jp(c)}</div>`;

  if (I.lang === 'en') h += `<div class="rom">${esc(c.romaji)}</div>`;
  h += `<div class="en">${esc(nameRes.text)}${nameRes.draft ? draftTag() : ''}</div>`;

  h += fieldHTML(c.verse, 'verse');
  h += fieldHTML(c.note, 'note');

  if (TERMINAL(k)) {
    h += `<div class="term-flag">${t(k === 'F' ? 'card.termFinish' : 'card.termOther')}</div>`;
  } else {
    const rolls = optionsOf(k);
    h += `<div class="rolltable"><h4>${t(G.mode === 'wheel' ? 'card.rollsWheel' : 'card.rolls')}</h4><ul>` +
      rolls.map(([d, to]) =>
        `<li class="${opts.hi == d ? 'hi' : ''} k-${kindOf(to)}"><span class="pip">${d}</span>
           <span class="to">${t('card.goto', { cell: numOf(to), name: labelOf(String(to)) })}</span></li>`).join('') +
      `</ul><p class="dead">${t('card.eachEqually', { n: rolls.length })}${
        G.mode === 'die' ? '<br>' + t('card.dead') : ''}</p></div>`;
  }

  if (a && !TERMINAL(k)) {
    h += `<div class="odds"><h4>${t('card.odds.h')}</h4>
      <div class="bar">
        <span class="b-fin"  style="width:${a.finish * 100}%"></span>
        <span class="b-ret"  style="width:${a.retire * 100}%"></span>
        <span class="b-monk" style="width:${a.monk * 100}%"></span>
      </div>
      <div class="legend">
        <span><i style="background:var(--gold)"></i>${t('card.odds.finish', { p: pct(a.finish) })}</span>
        <span><i style="background:var(--jade)"></i>${t('card.odds.retire', { p: pct(a.retire) })}</span>
        <span><i style="background:var(--vermilion)"></i>${t('card.odds.monk', { p: pct(a.monk) })}</span>
      </div>
      <p class="exp">${t('card.expected', { n: a.turns.toFixed(1) })}</p></div>`;
  }

  const inb = INBOUND[k];
  if (inb.length) {
    h += `<p class="note inbound"><b>${t('card.reachedFrom')}</b> ` +
      inb.slice().sort((p, q) => (p === 'F' ? 99 : +p) - (q === 'F' ? 99 : +q))
         .map(s => `${numOf(s)} ${jp(CELLS[s])}`).join(' · ') + `</p>`;
  } else {
    h += `<p class="note inbound"><i>${t('card.noInbound')}</i></p>`;
  }

  return h + `</div>`;
}

function renderCellCard(k, opts) {
  G.cardOpts = opts || null;
  $('#cellcard').innerHTML = cellCardHTML(k, opts);
}

/* ---------------------------------------------------------------
   8.  Turn logic
--------------------------------------------------------------- */
function pushLog(fn, pi, big) {
  G.log.push({ fn, pi, big });
  renderLog();
}

function renderLog() {
  const box = $('#logbox');
  box.innerHTML = G.log.map(({ fn, pi, big }) => {
    const p = pi != null ? G.players[pi] : null;
    return `<div class="entry${big ? ' big' : ''}">
      <span class="dot" style="background:${p ? p.ch.color : 'transparent'}"></span>
      <span class="tx">${fn()}</span></div>`;
  }).join('');
  box.scrollTop = box.scrollHeight;
}

function renderPlayers() {
  $('#plist').innerHTML = G.players.map((p, i) => {
    const end = p.done;
    return `<div class="p ${i === G.turn && !p.done ? 'now' : ''} ${p.done ? 'out' : ''}">
      <span class="swatch" style="background:${p.ch.color}"></span>
      <span class="nm">${esc(p.name)}<br><span class="role">${charLabel(p.ch)}</span></span>
      <span class="loc">${end ? `<span class="badge ${ENDINGS[end].cls}">${esc(endLabel(end))}</span>`
        : `${numOf(p.at)}<br>${jp(CELLS[p.at])}`}</span>
    </div>`;
  }).join('');
  $('#turn-count').textContent = t('game.round', { n: G.round });
}

/* Draw the wheel for whichever cell the current player stands in. */
function renderWheel() {
  if (!wheel) return;
  const p = G.players[G.turn];
  if (!p || p.done || TERMINAL(p.at)) { wheel.render([]); return; }
  wheel.reset();
  wheel.render(optionsOf(p.at).map(([die, to]) => ({
    die, kanji: CELLS[to].kanji, kind: kindOf(to)
  })));
}

function setMsg(fn) {
  G.msgFn = fn;
  $('#turn-msg').innerHTML = fn ? fn() : '';
}

function renderTurn(msgFn) {
  const p = G.players[G.turn];
  $('#turn-whose').innerHTML =
    `<span class="dot" style="background:${p.ch.color}"></span>${esc(p.name)}`;
  $('#turn-at').innerHTML =
    `${charLabel(p.ch)} &nbsp;·&nbsp; ${t('turn.nowIn', { cell: numOf(p.at) + ' ' + jp(CELLS[p.at]) })}`;
  if (msgFn !== undefined) setMsg(msgFn);
  renderPlayers(); placePawns(); highlightTargets(p.at); renderWheel();
}

async function takeTurn(auto) {
  if (G.busy || (G.auto && !auto)) return;
  const p = G.players[G.turn];
  if (p.done) { nextPlayer(); return; }

  G.busy = true; $('#btn-roll').disabled = true; $('#btn-auto').disabled = true;

  const from = p.at;
  const opts = optionsOf(from);
  let v, to, misses = [];

  if (G.mode === 'wheel') {
    const i = pick(opts.length);
    v = opts[i][0]; to = String(opts[i][1]);
    setMsg(() => `<span class="spinning">${t('turn.spinning')}</span>`);
    await wheel.spin(i, auto ? 1100 : 3000);
    setMsg(() => `<span class="hit">${t('turn.hit.wheel', {
      v, cell: `${numOf(to)} ${labelOf(to)}` })}</span>`);
  } else {
    const rolls = CELLS[from].rolls;
    const die = $('#die');
    let hit = false;
    while (!hit) {
      v = d6();
      die.classList.remove('rolling'); void die.offsetWidth; die.classList.add('rolling');
      hit = rolls[v] !== undefined;
      drawDie(die, v, hit);
      if (!hit) {
        misses.push(v);
        const missed = misses.slice(), last = v;
        setMsg(() => `<span class="miss">${t('turn.miss', { v: last, cell: numOf(from) })}</span>` +
          (missed.length > 1 ? `<br><span class="miss small">${t('turn.misses', { list: missed.join(', ') })}</span>` : ''));
        await sleep(auto ? 240 : 420);
      }
    }
    to = String(rolls[v]);
    setMsg(() => `<span class="hit">${t('turn.hit.die', {
      v, cell: `${numOf(to)} ${labelOf(to)}` })}</span>`);
  }

  renderCellCard(from, { hi: v });
  await sleep(auto ? 320 : 560);

  p.at = to;
  p.path.push({ cell: to, die: v, missed: misses.slice() });
  placePawns();
  await sleep(280);
  selectCell(to);

  const rec = { name: p.name, v, misses: misses.slice(), from, to, mode: G.mode };
  pushLog(() => t(rec.mode === 'wheel' ? 'log.move.wheel' : 'log.move.die', {
    name: esc(rec.name), v: rec.v,
    after: rec.misses.length ? t('log.after', { list: rec.misses.join(', ') }) : '',
    from: numOf(rec.from),
    to: `${numOf(rec.to)} ${labelOf(rec.to)}`
  }), G.turn);

  if (TERMINAL(to)) {
    p.done = CELLS[to].ending;
    const nm = p.name, en = p.done;
    pushLog(() => t('log.ended', { name: esc(nm), verb: endVerb(en) }), G.turn, true);
  }

  G.busy = false; $('#btn-roll').disabled = false; $('#btn-auto').disabled = false;
  renderTurn();

  if (p.done) {
    if (G.players.every(q => q.done)) { showResults(); return true; }
    nextPlayer();
    return true;
  }
  if (!auto) nextPlayer();
  return false;
}

function nextPlayer() {
  const n = G.players.length;
  let wrapped = false;
  for (let i = 1; i <= n; i++) {
    const j = (G.turn + i) % n;
    if (j <= G.turn) wrapped = true;
    if (!G.players[j].done) {
      if (wrapped) G.round++;
      G.turn = j; renderTurn(); return;
    }
  }
  showResults();
}

async function autoPlay() {
  if (G.auto || G.busy) return;
  G.auto = true;
  $('#btn-auto').disabled = true;
  const me = G.turn;
  while (!G.players[me].done && G.turn === me) {
    const ended = await takeTurn(true);
    if (ended) break;
    await sleep(180);
  }
  G.auto = false;
  $('#btn-auto').disabled = false;
}

/* ---------------------------------------------------------------
   9.  Results
--------------------------------------------------------------- */
function showResults() {
  const order = { finish: 0, retire: 1, monk: 2 };
  const sorted = G.players.map((p, i) => ({ p, i })).sort((a, b) =>
    order[a.p.done] - order[b.p.done] || a.p.path.length - b.p.path.length);

  $('#res-list').innerHTML = sorted.map(({ p }) => {
    const end = p.done;
    const a0 = ANALYSIS[String(p.ch.start)];
    const steps = [{ cell: String(p.ch.start) }].concat(p.path);
    return `<div class="res-card">
      <div class="top">
        <span class="swatch" style="background:${p.ch.color}"></span>
        <span class="nm">${esc(p.name)}</span>
        <span class="role">${t('results.bornAs', { ch: `${charLabel(p.ch)}` })}</span>
        <span class="spacer"></span>
        <span class="badge ${ENDINGS[end].cls}">${esc(endLabel(end))}</span>
      </div>
      <p class="res-sum">${t('results.summary', {
        name: esc(p.name), verb: endVerb(end), n: p.path.length,
        role: esc(charName(p.ch)), p: pct(a0.finish) })}</p>
      <div class="path">${steps.map((s, i) => {
        const k = s.cell, last = i === steps.length - 1;
        const cls = last ? (p.done === 'finish' ? 'fin' : p.done === 'monk' ? 'bad' : '') : '';
        return (i ? `<span class="arrow">→</span>` : '') +
          `<button class="step ${cls}" data-k="${k}"><span class="n">${k === 'F' ? '上' : k}</span>
             <span class="jp">${esc(CELLS[k].kanji)}</span></button>`;
      }).join('')}</div>
    </div>`;
  }).join('');

  $$('#res-list .step').forEach(b => b.onclick = () => openCellModal(b.dataset.k));
  show('results');
}

/* ---------------------------------------------------------------
   10.  Modals
--------------------------------------------------------------- */
let modalRender = null;                 // redrawn when the language changes

function openModal(fn) {
  modalRender = fn;
  $('#modal-body').innerHTML = fn();
  $('#modal').classList.add('open');
  if (modalWire) modalWire();
}
let modalWire = null;

function closeModal() { $('#modal').classList.remove('open'); modalRender = null; modalWire = null; }

function openCellModal(k) {
  modalWire = () => { const b = $('#back-grid'); if (b) b.onclick = openCellsModal; };
  openModal(() => `<h2>${numOf(k)}</h2>
    <div class="card cellcard full" style="margin-top:1rem">${cellCardHTML(k)}</div>
    <div style="margin-top:1rem"><button class="btn btn-sm" id="back-grid">${t('cells.back')}</button></div>`);
}

function openCellsModal() {
  modalWire = () => $$('.cellgrid button').forEach(b => b.onclick = () => openCellModal(b.dataset.k));
  openModal(() => `<h2>${t('cells.h')}</h2>
    <p>${t('cells.sub')}</p>
    <div class="cellgrid">${KEYS.map(k => `
      <button data-k="${k}"><img src="${img(k)}" alt="" loading="lazy">
        <span class="lbl">${jp(CELLS[k])}
          <small>${numOf(k)}${I.lang === 'en' ? ' · ' + esc(cellName(k)) : ''}</small></span></button>`).join('')}</div>`);
}

function openOddsModal() {
  modalWire = null;
  openModal(() => {
    const rows = CHARACTERS.map(c => ({ c, a: ANALYSIS[String(c.start)] }))
      .sort((x, y) => y.a.finish - x.a.finish);
    const katoku = CHARACTERS.find(c => c.romaji === 'Katoku');
    const tedai  = CHARACTERS.find(c => c.romaji === 'Tedai');

    const live = KEYS.filter(k => !TERMINAL(k));
    const byFin  = live.slice().sort((a, b) => ANALYSIS[b].finish - ANALYSIS[a].finish);
    const byMonk = live.slice().sort((a, b) => ANALYSIS[b].monk - ANALYSIS[a].monk);
    const fmt = k => `<li><b>${numOf(k)}</b> ${labelOf(k)} —
      ${t('odds.row', { p1: pct(ANALYSIS[k].finish), p2: pct(ANALYSIS[k].monk) })}</li>`;

    return `<h2>${t('odds.h')}</h2>
    <p>${t('odds.intro')}</p>

    <table class="tbl">
      <tr><th>${t('odds.th.character')}</th><th>${t('odds.th.starts')}</th><th>${t('odds.th.finish')}</th>
          <th>${t('odds.th.retire')}</th><th>${t('odds.th.monk')}</th>
          <th style="width:110px"></th><th>${t('odds.th.moves')}</th></tr>
      ${rows.map(({ c, a }) => `<tr>
        <td><span class="chip" style="background:${c.color}"></span>${charLabel(c)}</td>
        <td>${c.start}</td>
        <td style="color:var(--gold)">${(a.finish * 100).toFixed(1)}%</td>
        <td>${(a.retire * 100).toFixed(1)}%</td>
        <td style="color:var(--vermilion)">${(a.monk * 100).toFixed(1)}%</td>
        <td><span class="minibar">
          <span style="background:var(--gold);width:${a.finish * 100}%"></span>
          <span style="background:var(--jade);width:${a.retire * 100}%"></span>
          <span style="background:var(--vermilion);width:${a.monk * 100}%"></span></span></td>
        <td>${a.turns.toFixed(1)}</td></tr>`).join('')}
    </table>

    <h3>${t('odds.what.h')}</h3>
    <p>${t('odds.what.p', {
      katoku: jp(katoku), tedai: jp(tedai),
      a: pct(ANALYSIS[String(katoku.start)].finish),
      b: pct(ANALYSIS[String(tedai.start)].finish) })}</p>

    <h3>${t('odds.safest.h')}</h3>
    <div class="two-col">
      <div><p class="col-h">${t('odds.safest.finish')}</p><ul class="tight">${byFin.slice(0, 5).map(fmt).join('')}</ul></div>
      <div><p class="col-h">${t('odds.safest.monk')}</p><ul class="tight">${byMonk.slice(0, 5).map(fmt).join('')}</ul></div>
    </div>`;
  });
}

/* cells that no sequence of legal moves from any starting square can reach */
function unreachableCells() {
  const seen = new Set(), stack = CHARACTERS.map(c => String(c.start));
  while (stack.length) {
    const k = stack.pop();
    if (seen.has(k)) continue;
    seen.add(k);
    Object.values(CELLS[k].rolls).forEach(to => stack.push(String(to)));
  }
  return KEYS.filter(k => !seen.has(k));
}

function openAboutModal() {
  modalWire = null;
  openModal(() => {
    const unreachable = unreachableCells();
    const title = `<span class="jp">${I.ruby('壽出世双六', 'ことぶきしゅっせすごろく')}</span>`;
    const kuniteru = `<span class="jp">（${I.ruby('國輝画', 'くにてるが')}）</span>`;
    const eikyudo  = `<span class="jp">（${I.ruby('榮久堂版', 'えいきゅうどうばん')}）</span>`;

    return `<h2>${t('about.h')}</h2>
    <p>${t('about.p1', { title })}</p>
    <h3>${t('about.play.h')}</h3><p>${t('about.play.p')}</p>
    <h3>${t('about.wheel.h')}</h3><p>${t('about.wheel.p')}</p>
    <h3>${t('about.lang.h')}</h3><p>${t('about.lang.p')}</p>
    <h3>${t('about.sources.h')}</h3><p>${t('about.sources.p', { kuniteru, eikyudo })}</p>
    <h3>${t('about.class.h')}</h3><p>${t('about.class.p')}</p>
    ${unreachable.length ? `<p>${t('about.unreachable', {
      list: unreachable.map(k => `${numOf(k)} ${jp(CELLS[k])}`).join('、') })}</p>` : ''}
    <h3>${t('about.credits.h')}</h3><p>${t('about.credits.p')}</p>`;
  });
}

/* ---------------------------------------------------------------
   11.  Screens & wiring
--------------------------------------------------------------- */
function show(name) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#screen-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setMode(mode) {
  if (mode === G.mode) return;
  G.mode = mode;
  $$('#mode-row button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  $('#turn-card').classList.toggle('die-mode', mode === 'die');
  $('#mode-hint').textContent = t('mode.hint.' + mode);
  $('#btn-roll').textContent = t(mode === 'wheel' ? 'btn.spin' : 'btn.roll');
  if (G.players.length) { renderWheel(); if (G.selected) renderCellCard(G.selected, G.cardOpts); }
}

function startGame() {
  G.players = setupChars.map((c, i) => ({
    name: (setupNames[i] || '').trim() || t('setup.playerName', { n: i + 1 }),
    ch: c, at: String(c.start), path: [], done: null
  }));
  G.turn = 0; G.round = 1; G.busy = false; G.log = [];
  show('game');
  buildBoard();
  G.players.forEach((p, i) => {
    const rec = { name: p.name, ch: p.ch, at: p.at };
    pushLog(() => t('log.begins', {
      name: esc(rec.name),
      ch: `${charLabel(rec.ch)}`,
      cell: `${numOf(rec.at)} ${jp(CELLS[rec.at])}`
    }), i);
  });
  drawDie($('#die'), 6, false);
  selectCell(G.players[0].at);
  renderTurn(() => t('turn.begin.' + G.mode));
}

/* Everything that has to be redrawn when the language or furigana
   setting changes.  A game in progress is untouched. */
function relocalize() {
  applyStatic();
  renderSetupPlayers();
  if (G.players.length) {
    labelBoard();
    renderTurn(G.msgFn === null ? undefined : G.msgFn);
    renderLog();
    if (G.selected) renderCellCard(G.selected, G.cardOpts);
  }
  if ($('#screen-results').classList.contains('active')) showResults();
  if (modalRender) { $('#modal-body').innerHTML = modalRender(); if (modalWire) modalWire(); }
}

function init() {
  wheel = SUGOROKU.wheel.create($('#wheel'));

  I.apply();
  applyStatic();
  buildCountRow(); rollCharacters();
  I.onChange(relocalize);

  $('#lang-btn').onclick   = () => { I.toggleLang(); };
  $('#tgl-furi').checked   = I.furigana;
  $('#tgl-furi').onchange  = e => I.setFurigana(e.target.checked);

  $$('#mode-row button').forEach(b => b.onclick = () => setMode(b.dataset.mode));
  $('#mode-row button[data-mode="wheel"]').classList.add('on');

  $('#btn-reroll').onclick = rollCharacters;
  $('#btn-start').onclick  = startGame;
  $('#btn-roll').onclick   = () => takeTurn(false);
  $('#btn-auto').onclick   = autoPlay;
  $('#btn-quit').onclick   = () => { G.players.forEach(p => { if (!p.done) p.done = 'retire'; }); showResults(); };
  $('#btn-again').onclick  = () => { setupNames = G.players.map(p => p.name); rollCharacters(); show('setup'); };
  $('#btn-odds2').onclick  = openOddsModal;

  $('#nav-cells').onclick = openCellsModal;
  $('#nav-odds').onclick  = openOddsModal;
  $('#nav-about').onclick = openAboutModal;
  $('#modal-close').onclick = closeModal;
  $('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if (e.key === ' ' && $('#screen-game').classList.contains('active') && !$('#modal').classList.contains('open')) {
      e.preventDefault(); takeTurn(false);
    }
  });

  $('#tgl-num').onchange = e => { G.showNums = e.target.checked; applyNumberToggle(); };
}

document.addEventListener('DOMContentLoaded', init);
})();
