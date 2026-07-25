/* ==================================================================
   壽出世双六 — Kotobuki Shusse Sugoroku
   Game engine + board UI.  No dependencies, runs from file://
   ================================================================== */
(function () {
'use strict';

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const KEYS = Object.keys(CELLS);                       // '1'..'45','F'
const TERMINAL = k => !CELLS[k] || Object.keys(CELLS[k].rolls).length === 0;
const ENDINGS = {
  finish: { label: 'Finish',      cls: 'win',    verb: 'reached 長者 — the wealthy house. A winning life.' },
  retire: { label: 'Retirement',  cls: 'retire', verb: 'withdrew into 隠居, honorable retirement.' },
  monk:   { label: 'Mendicant',   cls: 'monk',   verb: 'ended as a 願人坊主, a begging monk. Game over.' }
};

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
    outs.forEach(t => {
      const a = abs.indexOf(t);
      if (a >= 0) M[i][n + a] += p;
      else M[i][ix[t]] -= p;
    });
    M[i][n + 3] = 1;
  });

  for (let c = 0; c < n; c++) {                        // Gauss-Jordan
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const t = M[c]; M[c] = M[piv]; M[piv] = t;
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
  KEYS.forEach(k => Object.values(CELLS[k].rolls).forEach(t => {
    if (!m[String(t)].includes(k)) m[String(t)].push(k);
  }));
  return m;
})();

/* ---------------------------------------------------------------
   2.  Small helpers
--------------------------------------------------------------- */
const img     = k => k === 'F' ? 'assets/finish.jpg' : 'assets/cell' + String(k).padStart(2, '0') + '.jpg';
const numOf   = k => k === 'F' ? 'Finish' : 'Cell ' + k;
const nameOf  = k => `<span class="jp">${CELLS[k].kanji}</span> ${CELLS[k].en}`;
const pct     = x => (x * 100).toFixed(0) + '%';
const esc     = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const d6      = () => 1 + Math.floor(Math.random() * 6);
const sleep   = ms => new Promise(r => setTimeout(r, ms));

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
  players: [],      // {name, ch, at, path:[{cell,die}], done:null|'finish'|'retire'|'monk'}
  turn: 0,
  round: 1,
  selected: null,
  busy: false,
  auto: false,
  showNums: true
};

/* ---------------------------------------------------------------
   4.  Setup screen
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
      <input type="text" data-i="${i}" placeholder="Player ${i + 1}" value="${esc(setupNames[i] || '')}">
      <span class="who">rolled <b>${c.die}</b> — <span class="jp">${c.kanji}</span> ${c.en}
        <br><span style="opacity:.7">starts in cell ${c.start}</span></span>
    </div>`).join('');
  $$('#player-rows input').forEach(inp => inp.oninput = () => setupNames[+inp.dataset.i] = inp.value);
  $('#assign-note').innerHTML =
    `Characters are drawn exactly as the packet says: roll a die, re-roll if that character is already taken. ` +
    `Roll again for a different draw, or just begin.`;
}

/* ---------------------------------------------------------------
   5.  Board
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
    s.title = `${numOf(k)} — ${CELLS[k].kanji} ${CELLS[k].en}`;
    s.onclick = () => selectCell(k);
    f.appendChild(s);
  });

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
  new Set(Object.values(CELLS[k].rolls).map(String)).forEach(t => {
    const el = $(`.cellspot[data-k="${t}"]`); if (el) el.classList.add('target');
  });
}

/* ---------------------------------------------------------------
   6.  Cell card
--------------------------------------------------------------- */
function selectCell(k) {
  G.selected = k;
  $$('.cellspot').forEach(s => s.classList.toggle('selected', s.dataset.k === String(k)));
  renderCellCard(k);
}

function cellCardHTML(k, opts) {
  opts = opts || {};
  const c = CELLS[k], a = ANALYSIS[k];
  const rolls = Object.entries(c.rolls).sort((p, q) => p[0] - q[0]);

  let h = `<div class="imgwrap"><img src="${img(k)}" alt="${c.en}">
             <span class="num">${numOf(k)}</span></div>
           <div class="body">
             <div class="kanji">${c.kanji}</div>
             <div class="rom">${c.romaji}</div>
             <div class="en">${c.en}</div>`;

  if (c.verse) h += `<p class="verse">${esc(c.verse)}</p>`;
  if (c.note)  h += `<p class="note">${esc(c.note)}</p>`;

  if (TERMINAL(k)) {
    h += `<div class="term-flag">${
      k === 'F' ? 'This is the goal. Landing here ends your life course as a winner.'
                : 'Landing here ends your life course — there is no roll out of this cell.'}</div>`;
  } else {
    h += `<div class="rolltable"><h4>Rolls</h4><ul>` + rolls.map(([d, t]) =>
      `<li class="${opts.hi == d ? 'hi' : ''}"><span class="pip">${d}</span>
         <span class="to">go to <b>${numOf(t)}</b> — ${nameOf(String(t))}</span></li>`).join('') +
      `</ul><p class="dead">Any other number: nothing happens — roll again.</p></div>`;
  }

  if (a && !TERMINAL(k)) {
    h += `<div class="odds"><h4>From here, in the long run</h4>
      <div class="bar">
        <span class="b-fin"  style="width:${a.finish * 100}%"></span>
        <span class="b-ret"  style="width:${a.retire * 100}%"></span>
        <span class="b-monk" style="width:${a.monk * 100}%"></span>
      </div>
      <div class="legend">
        <span><i style="background:var(--gold)"></i>${pct(a.finish)} finish</span>
        <span><i style="background:var(--jade)"></i>${pct(a.retire)} retirement</span>
        <span><i style="background:var(--vermilion)"></i>${pct(a.monk)} mendicant</span>
      </div>
      <p class="exp">Expected further moves: ${a.turns.toFixed(1)}</p></div>`;
  }

  const inb = INBOUND[k];
  if (inb.length) {
    h += `<p class="note" style="margin-top:.8rem"><b style="color:var(--ink-dim)">Reached from:</b> ` +
      inb.sort((p, q) => (p === 'F' ? 99 : +p) - (q === 'F' ? 99 : +q))
         .map(s => `${numOf(s)} <span class="jp">${CELLS[s].kanji}</span>`).join(' · ') + `</p>`;
  } else {
    h += `<p class="note" style="margin-top:.8rem"><i>No cell on the board leads here — it can only be a starting square.</i></p>`;
  }

  return h + `</div>`;
}

function renderCellCard(k, opts) { $('#cellcard').innerHTML = cellCardHTML(k, opts); }

/* ---------------------------------------------------------------
   7.  Turn logic
--------------------------------------------------------------- */
function log(html, pi, big) {
  const p = pi != null ? G.players[pi] : null;
  const el = document.createElement('div');
  el.className = 'entry' + (big ? ' big' : '');
  el.innerHTML = `<span class="dot" style="background:${p ? p.ch.color : 'transparent'}"></span><span class="tx">${html}</span>`;
  const box = $('#logbox'); box.appendChild(el); box.scrollTop = box.scrollHeight;
}

function renderPlayers() {
  $('#plist').innerHTML = G.players.map((p, i) => {
    const end = p.done ? ENDINGS[p.done] : null;
    return `<div class="p ${i === G.turn && !p.done ? 'now' : ''} ${p.done ? 'out' : ''}">
      <span class="swatch" style="background:${p.ch.color}"></span>
      <span class="nm">${esc(p.name)}<br><span style="font-size:.8rem;color:var(--ink-dim)">
        <span class="jp">${p.ch.kanji}</span> ${p.ch.en}</span></span>
      <span class="loc">${end ? `<span class="badge ${end.cls}">${end.label}</span>`
        : `${numOf(p.at)}<br><span class="jp">${CELLS[p.at].kanji}</span>`}</span>
    </div>`;
  }).join('');
  $('#turn-count').textContent = 'round ' + G.round;
}

function renderTurn(msg) {
  const p = G.players[G.turn];
  $('#turn-whose').innerHTML =
    `<span class="dot" style="background:${p.ch.color}"></span>${esc(p.name)}`;
  $('#turn-at').innerHTML =
    `<span class="jp">${p.ch.kanji}</span> ${p.ch.en} &nbsp;·&nbsp; now in ${numOf(p.at)}
     <span class="jp">${CELLS[p.at].kanji}</span>`;
  if (msg !== undefined) $('#turn-msg').innerHTML = msg;
  renderPlayers(); placePawns(); highlightTargets(p.at);
}

async function takeTurn(auto) {
  if (G.busy || (G.auto && !auto)) return;
  const p = G.players[G.turn];
  if (p.done) { nextPlayer(); return; }

  G.busy = true; $('#btn-roll').disabled = true; $('#btn-auto').disabled = true;

  const rolls = CELLS[p.at].rolls;
  let misses = [], v, hit = false;
  const die = $('#die');

  while (!hit) {
    v = d6();
    die.classList.remove('rolling'); void die.offsetWidth; die.classList.add('rolling');
    hit = rolls[v] !== undefined;
    drawDie(die, v, hit);
    if (!hit) {
      misses.push(v);
      $('#turn-msg').innerHTML =
        `<span class="miss">Rolled ${v} — no path from ${numOf(p.at)}. Roll again.</span>` +
        (misses.length > 1 ? `<br><span class="miss" style="font-size:.82rem">misses: ${misses.join(', ')}</span>` : '');
      await sleep(auto ? 240 : 420);
    }
  }

  const from = p.at, to = String(rolls[v]);
  renderCellCard(from, { hi: v });
  $('#turn-msg').innerHTML = `<span class="hit">Rolled <b>${v}</b> → ${numOf(to)}
     <span class="jp">${CELLS[to].kanji}</span> ${CELLS[to].en}</span>`;
  await sleep(auto ? 320 : 560);

  p.at = to;
  p.path.push({ cell: to, die: v, missed: misses.slice() });
  placePawns();
  await sleep(280);
  selectCell(to);

  log(`<b>${esc(p.name)}</b> rolled ${v}${misses.length ? ` <span style="opacity:.65">(after ${misses.join(', ')})</span>` : ''} —
       ${numOf(from)} → ${numOf(to)} <span class="jp">${CELLS[to].kanji}</span> ${CELLS[to].en}`, G.turn);

  if (TERMINAL(to)) {
    p.done = CELLS[to].ending;
    log(`<b>${esc(p.name)}</b> ${ENDINGS[p.done].verb}`, G.turn, true);
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
  const me = G.turn;
  while (!G.players[me].done && G.turn === me) {
    const ended = await takeTurn(true);
    if (ended) break;
    await sleep(180);
  }
  G.auto = false;
}

/* ---------------------------------------------------------------
   8.  Results
--------------------------------------------------------------- */
function showResults() {
  const order = { finish: 0, retire: 1, monk: 2 };
  const sorted = G.players.map((p, i) => ({ p, i })).sort((a, b) =>
    order[a.p.done] - order[b.p.done] || a.p.path.length - b.p.path.length);

  $('#res-list').innerHTML = sorted.map(({ p }) => {
    const end = ENDINGS[p.done];
    const a0 = ANALYSIS[String(p.ch.start)];
    const steps = [{ cell: String(p.ch.start), die: null }].concat(p.path);
    return `<div class="res-card">
      <div class="top">
        <span class="swatch" style="background:${p.ch.color}"></span>
        <span class="nm">${esc(p.name)}</span>
        <span class="role">born as <span class="jp">${p.ch.kanji}</span> ${p.ch.en}</span>
        <span class="spacer"></span>
        <span class="badge ${end.cls}">${end.label}</span>
      </div>
      <p style="margin:.6rem 0 0;color:var(--ink-dim);font-size:.92rem">
        ${esc(p.name)} ${end.verb} &nbsp;·&nbsp; ${p.path.length} moves.
        A ${p.ch.en.toLowerCase()} reaches the Finish square ${pct(a0.finish)} of the time.</p>
      <div class="path">${steps.map((s, i) => {
        const k = s.cell, last = i === steps.length - 1;
        const cls = last ? (p.done === 'finish' ? 'fin' : p.done === 'monk' ? 'bad' : '') : '';
        return (i ? `<span class="arrow">→</span>` : '') +
          `<button class="step ${cls}" data-k="${k}"><span class="n">${k === 'F' ? '上' : k}</span>
             <span class="jp">${CELLS[k].kanji}</span></button>`;
      }).join('')}</div>
    </div>`;
  }).join('');

  $$('#res-list .step').forEach(b => b.onclick = () => openCellModal(b.dataset.k));
  show('results');
}

/* ---------------------------------------------------------------
   9.  Modals
--------------------------------------------------------------- */
function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').classList.add('open'); }
function closeModal() { $('#modal').classList.remove('open'); }

function openCellModal(k) {
  openModal(`<h2>${numOf(k)}</h2>
    <div class="card cellcard full" style="margin-top:1rem">${cellCardHTML(k)}</div>
    <div style="margin-top:1rem"><button class="btn btn-sm" id="back-grid">← All cells</button></div>`);
  $('#back-grid').onclick = openCellsModal;
}

function openCellsModal() {
  openModal(`<h2>The forty-five cells</h2>
    <p>Every square of the print, with its verse and its roll table. Click to read.</p>
    <div class="cellgrid">${KEYS.map(k => `
      <button data-k="${k}"><img src="${img(k)}" alt="" loading="lazy">
        <span class="lbl"><span class="jp">${CELLS[k].kanji}</span>
          <small>${numOf(k)} · ${CELLS[k].en}</small></span></button>`).join('')}</div>`);
  $$('.cellgrid button').forEach(b => b.onclick = () => openCellModal(b.dataset.k));
}

function openOddsModal() {
  const rows = CHARACTERS.map(c => {
    const a = ANALYSIS[String(c.start)];
    return { c, a };
  }).sort((x, y) => y.a.finish - x.a.finish);

  openModal(`<h2>The fates of the six</h2>
    <p>Because an unlisted roll is simply re-rolled, every arrow out of a cell is equally likely — which makes the
    whole board an exactly solvable Markov chain. These are not simulations but the true probabilities, computed
    from the roll tables of the print itself. Where you are born decides a great deal.</p>

    <table class="tbl">
      <tr><th>Character</th><th>Starts</th><th>Finish</th><th>Retirement</th><th>Mendicant</th><th style="width:110px"></th><th>Moves</th></tr>
      ${rows.map(({ c, a }) => `<tr>
        <td><span style="display:inline-block;width:.7em;height:.7em;border-radius:50%;background:${c.color};margin-right:.5em"></span>
            <span class="jp">${c.kanji}</span> ${c.en}</td>
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

    <h3>What the numbers say</h3>
    <p>The <span class="jp">家督</span> Family Head — a son who has already inherited — reaches the Finish square about
    <b>${(ANALYSIS['18'].finish * 100).toFixed(0)}%</b> of the time. The <span class="jp">手代</span> Merchant Clerk, who must
    work his way up through service, manages about <b>${(ANALYSIS['29'].finish * 100).toFixed(0)}%</b>, and is the most likely
    of the six to end with the begging bowl. The print does not pretend that the six paths are equal.</p>

    <h3>The safest and the most dangerous squares</h3>
    ${(() => {
      const live = KEYS.filter(k => !TERMINAL(k));
      const byFin = live.slice().sort((a, b) => ANALYSIS[b].finish - ANALYSIS[a].finish);
      const byMonk = live.slice().sort((a, b) => ANALYSIS[b].monk - ANALYSIS[a].monk);
      const fmt = k => `<li><b>${numOf(k)}</b> <span class="jp">${CELLS[k].kanji}</span> ${CELLS[k].en} —
        ${pct(ANALYSIS[k].finish)} finish, ${pct(ANALYSIS[k].monk)} mendicant</li>`;
      return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div><p style="margin:0 0 .3rem;color:var(--ink)">Most likely to end in the wealthy house</p>
          <ul style="margin:0;padding-left:1.1rem;font-size:.9rem;color:var(--ink-dim)">${byFin.slice(0, 5).map(fmt).join('')}</ul></div>
        <div><p style="margin:0 0 .3rem;color:var(--ink)">Most likely to end with the begging bowl</p>
          <ul style="margin:0;padding-left:1.1rem;font-size:.9rem;color:var(--ink-dim)">${byMonk.slice(0, 5).map(fmt).join('')}</ul></div>
      </div>`;
    })()}`);
}

/* cells that no sequence of legal moves from any starting square can reach */
function unreachableCells() {
  const seen = new Set(), stack = CHARACTERS.map(c => String(c.start));
  while (stack.length) {
    const k = stack.pop();
    if (seen.has(k)) continue;
    seen.add(k);
    Object.values(CELLS[k].rolls).forEach(t => stack.push(String(t)));
  }
  return KEYS.filter(k => !seen.has(k));
}

function openAboutModal() {
  const unreachable = unreachableCells();
  openModal(`<h2>About this game</h2>
    <p><span class="jp">壽出世双六</span> <i>Kotobuki Shusse Sugoroku</i> — “Longevity and Success sugoroku” — is an
    Edo-period <i>e-sugoroku</i>: a printed board game in which the squares are not places but social positions.
    Players do not race along a track. Each square lists only a few die numbers, and each of those sends you to a
    particular other station in life. A clerk's board of possibilities is not a family head's.</p>

    <h3>How play works</h3>
    <p>Roll a die to receive one of the six characters printed in the Start square, and begin in that character's own
    cell. On your turn, roll and read your <em>current</em> cell: if the number is listed, move there; if it is not,
    nothing happens and you roll again. Play ends when you reach <b>長者</b> (Finish, a wealthy house),
    <b>Cell 5 隠居</b> (honorable retirement) or <b>Cell 45 願人坊主</b> (the mendicant monk).</p>

    <h3>Sources</h3>
    <p>All cell names, verses, summaries and roll tables are transcribed from the G30 History <i>Sugoroku Game Packet</i>
    (Spring 2026). The board and every cell illustration are details from the original print by
    Utagawa Kuniteru <span class="jp">（國輝画）</span>, published by Eikyūdō <span class="jp">（榮久堂版）</span>.
    Three obvious typographic slips in the packet were corrected: “Cel 26” → Cell 26, “Cel l6” → Cell 6,
    “Co to Cell 18” → Go to Cell 18.</p>

    <h3>Notes for the classroom</h3>
    <p>The probabilities shown throughout are exact, not simulated: since an unlisted roll is simply re-rolled, each
    arrow out of a cell is equally likely, and the board becomes an absorbing Markov chain that can be solved directly.
    Cell 45 has no verse in the packet; the description here is editorial and marked as such.</p>
    ${unreachable.length ? `<p>One question worth raising with students: no sequence of legal moves from any of the
      six starting squares can reach ${unreachable.map(k => `${numOf(k)} <span class="jp">${CELLS[k].kanji}</span>`).join(', ')}.
      In the packet's roll tables those cells form a small island of their own. That may be a feature of the print —
      stations reachable only from lives the six characters do not lead — or a gap in the transcription.</p>` : ''}

    <h3>Credits</h3>
    <p>Concept &amp; idea by <b style="color:var(--ink)">Tristan Grunow</b>. Implementation by
    <b style="color:var(--ink)">Henrik Bachmann</b>. G30 History, Nagoya University.</p>`);
}

/* ---------------------------------------------------------------
   10.  Screens & wiring
--------------------------------------------------------------- */
function show(name) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#screen-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startGame() {
  G.players = setupChars.map((c, i) => ({
    name: (setupNames[i] || '').trim() || 'Player ' + (i + 1),
    ch: c, at: String(c.start), path: [], done: null
  }));
  G.turn = 0; G.round = 1; G.busy = false;
  $('#logbox').innerHTML = '';
  show('game');
  buildBoard();
  G.players.forEach((p, i) => log(
    `<b>${esc(p.name)}</b> begins as <span class="jp">${p.ch.kanji}</span> ${p.ch.en} in ${numOf(p.at)}
     <span class="jp">${CELLS[p.at].kanji}</span>`, i));
  drawDie($('#die'), 6, false);
  selectCell(G.players[0].at);
  renderTurn('Roll to begin.');
}

function init() {
  buildCountRow(); rollCharacters();

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
