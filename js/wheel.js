/* ==================================================================
   壽出世双六 — the wheel
   ------------------------------------------------------------------
   A cell offers only the moves listed in its roll table, and — because
   an unlisted die number is simply re-rolled — each of them is equally
   likely.  So the honest picture of a turn is not a six-sided die but
   a wheel divided into exactly those moves.

   The wheel is drawn with one sector per option and spun to a sector
   the caller has already chosen.  Sector i is laid out starting at the
   top and running clockwise, so landing it under the pointer means
   rotating by -(i·sector + sector/2); that also leaves the winning
   label perfectly upright when the wheel comes to rest.
   ================================================================== */
(function () {
'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';
const R = 96;                 // sector radius in viewBox units
const LABEL_R = 58;           // where labels sit
const TURNS = 4;              // whole turns before landing
const SPIN_MS = 3000;

const el = (name, attrs) => {
  const n = document.createElementNS(SVG_NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};

const pt = (ang, r) => {
  const a = ang * Math.PI / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
};

/* Sector from a0 to a1, degrees, 0° = east, clockwise. */
function sectorPath(a0, a1) {
  const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
  const large = (a1 - a0) > 180 ? 1 : 0;
  return `M 0 0 L ${x0.toFixed(2)} ${y0.toFixed(2)} ` +
         `A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

function create(host) {
  host.classList.add('wheel');
  host.innerHTML =
    '<div class="wheel-spin"><svg viewBox="-100 -100 200 200" role="img"></svg></div>' +
    '<div class="wheel-pointer"></div>' +
    '<div class="wheel-hub"></div>';

  const spinner = host.querySelector('.wheel-spin');
  const svg = host.querySelector('svg');
  let rotation = 0;
  let count = 0;

  /* options: [{ die, kanji, kind }]  kind: finish | retire | monk | normal */
  function render(options) {
    count = options.length;
    svg.textContent = '';
    host.classList.toggle('empty', count === 0);
    if (!count) return;

    const step = 360 / count;

    options.forEach((o, i) => {
      const a0 = -90 + i * step, a1 = a0 + step;
      const cls = 'sector ' + (o.kind === 'normal' ? (i % 2 ? 's-b' : 's-a') : 's-' + o.kind);

      if (count === 1) {
        svg.appendChild(el('circle', { r: R, class: cls }));
      } else {
        svg.appendChild(el('path', { d: sectorPath(a0, a1), class: cls }));
      }

      const mid = a0 + step / 2;
      const g = el('g', { transform: `rotate(${mid + 90}) translate(0 ${-LABEL_R})`, class: 'lbl' });

      const num = el('text', { class: 'lbl-die', y: count > 4 ? -4 : -6 });
      num.textContent = o.die;
      g.appendChild(num);

      const nm = el('text', { class: 'lbl-name', y: count > 4 ? 13 : 12 });
      nm.textContent = o.kanji;
      g.appendChild(nm);

      svg.appendChild(g);
    });
  }

  /* Spin so that option `index` finishes under the pointer. */
  function spin(index, ms) {
    if (!count) return Promise.resolve();
    const step = 360 / count;
    const target = -(index * step + step / 2);

    // advance to the next multiple of 360 past the current angle, then add whole turns
    let next = target;
    while (next < rotation + 360 * TURNS) next += 360;
    rotation = next;

    const dur = ms == null ? SPIN_MS : ms;
    spinner.style.transition = `transform ${dur}ms cubic-bezier(.12,.72,.11,1)`;
    spinner.style.transform = `rotate(${rotation}deg)`;
    host.classList.add('spinning');

    return new Promise(resolve => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        host.classList.remove('spinning');
        host.classList.add('landed');
        setTimeout(() => host.classList.remove('landed'), 900);
        resolve();
      };
      spinner.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, dur + 120);          // fallback if the event is missed
    });
  }

  /* Drop the accumulated angle without animating — used between turns. */
  function reset() {
    spinner.style.transition = 'none';
    rotation = 0;
    spinner.style.transform = 'rotate(0deg)';
    void spinner.offsetWidth;
  }

  return { render, spin, reset, host };
}

SUGOROKU.wheel = { create };

})();
