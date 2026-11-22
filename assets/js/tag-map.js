// Tag-térkép: tagek és cikkek erőalapú gráfként, sima SVG, külső könyvtár nélkül.
// Adat: a tag-graph.html partial által kiírt JSON ({nodes, edges}), a data-src címről.
// Két felület használja: a /tags/ oldal nagy térképe és a cikkek alján a mini-map.
// Az elrendezés determinisztikus, így a kettő ugyanazt a képet mutatja.
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }

  // Egy oldalon egyszer töltődik le, utána a böngésző gyorsítótárából jön
  const graphs = {};
  function loadGraph(url) {
    return graphs[url] || (graphs[url] = fetch(url).then(r => r.json()));
  }

  // Hosszú cím szavanként több sorba tördelve, a pont magasságára függőlegesen középre igazítva
  function wrapLabel(t, label, max) {
    const rows = [];
    label.split(/\s+/).forEach(w => {
      const last = rows[rows.length - 1];
      if (last !== undefined && (last + ' ' + w).length <= max) rows[rows.length - 1] = last + ' ' + w;
      else rows.push(w);
    });
    if (rows.length === 1) { t.textContent = label; return; }
    rows.forEach((r, i) => {
      const s = el('tspan', { x: t.getAttribute('x'), dy: i === 0 ? `${-(rows.length - 1) * 0.6}em` : '1.2em' });
      s.textContent = r;
      t.appendChild(s);
    });
  }
  function makeLabel(n) {
    const t = el('text', { x: n.r + 3, y: 4 });
    wrapLabel(t, n.label, n.kind === 'post' ? 24 : Infinity);
    return t;
  }
  const nodeClass = n => `node node-${n.kind}${n.section ? ' sec-' + n.section : ''}`;

  // Determinisztikus kezdőállás (spirál), így minden betöltéskor ugyanaz a kép
  function initGraph(data) {
    const nodes = data.nodes.map((n, i) => {
      const a = i * 2.4, r = 14 * Math.sqrt(i + 1);
      return Object.assign({ x: r * Math.cos(a), y: r * Math.sin(a), vx: 0, vy: 0, fixed: false }, n);
    });
    const index = new Map(nodes.map((n, i) => [n.id, i]));
    const links = data.edges
      .map(e => ({ s: index.get(e.s), t: index.get(e.t) }))
      .filter(l => l.s !== undefined && l.t !== undefined);
    const neighbors = nodes.map(() => new Set());
    links.forEach(l => { neighbors[l.s].add(l.t); neighbors[l.t].add(l.s); });
    nodes.forEach(n => { n.r = n.kind === 'tag' ? 4 + 2 * Math.sqrt(n.count || 1) : 5; });
    return { nodes, links, neighbors, index };
  }

  // Ütközési doboz a pont körül: a kör, és ha a felirat látszik (tag), a felirat is.
  // A cikkek címe csak kiemeléskor jelenik meg, ezért ott csak a kör számít.
  // texts[i]: a csomópont felirata, a térkép stílusával megjelenítve (különben a mérés más lenne)
  function measure(nodes, texts) {
    const PAD = 2;
    nodes.forEach((n, i) => {
      let x0 = -n.r, x1 = n.r, y0 = -n.r, y1 = n.r;
      const bb = texts[i].getBBox();
      n.lbl = bb.width ? { x0: bb.x, x1: bb.x + bb.width, y0: bb.y, y1: bb.y + bb.height } : null;
      if (bb.width) {
        x0 = Math.min(x0, bb.x); x1 = Math.max(x1, bb.x + bb.width);
        y0 = Math.min(y0, bb.y); y1 = Math.max(y1, bb.y + bb.height);
      }
      n.box = { x0: x0 - PAD, x1: x1 + PAD, y0: y0 - PAD, y1: y1 + PAD };
    });
  }

  // ===== Szimuláció: taszítás, rugók az élek mentén, enyhe középre húzás, ütközés =====
  // alphaTarget: húzás közben a szimuláció nem hűl ki, a szomszédok végig követnek
  function makeSim(nodes, links) {
    const sim = { alpha: 1, alphaTarget: 0 };
    // Átfedő dobozok szétnyomása a kisebb átfedés irányában; a rögzített (húzott) pont nem mozdul
    function collide(strength) {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const ox = Math.min(a.x + a.box.x1, b.x + b.box.x1) - Math.max(a.x + a.box.x0, b.x + b.box.x0);
          if (ox <= 0) continue;
          const oy = Math.min(a.y + a.box.y1, b.y + b.box.y1) - Math.max(a.y + a.box.y0, b.y + b.box.y0);
          if (oy <= 0) continue;
          const wa = a.fixed ? 0 : b.fixed ? 1 : 0.5, wb = 1 - wa;
          if (ox < oy) {
            const s = (a.x + (a.box.x0 + a.box.x1) / 2 < b.x + (b.box.x0 + b.box.x1) / 2 ? -1 : 1) * ox * strength;
            a.x += s * wa; b.x -= s * wb;
          } else {
            const s = (a.y < b.y ? -1 : 1) * oy * strength;
            a.y += s * wa; b.y -= s * wb;
          }
        }
      }
    }
    sim.tick = function () {
      const alpha = sim.alpha;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy || 0.01, d = Math.sqrt(d2);
          const f = (4000 / d2) * alpha;
          dx /= d; dy /= d;
          a.vx += dx * f; a.vy += dy * f;
          b.vx -= dx * f; b.vy -= dy * f;
        }
      }
      links.forEach(l => {
        const a = nodes[l.s], b = nodes[l.t];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - 70) * 0.05 * alpha;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      });
      nodes.forEach(n => {
        n.vx -= n.x * 0.006 * alpha;
        n.vy -= n.y * 0.006 * alpha;
        if (n.fixed) { n.vx = n.vy = 0; return; }
        n.vx = Math.max(-20, Math.min(20, n.vx * 0.6));
        n.vy = Math.max(-20, Math.min(20, n.vy * 0.6));
        n.x += n.vx; n.y += n.vy;
      });
      collide(0.5);
      sim.alpha += (sim.alphaTarget - sim.alpha) * 0.01;   // célérték 0 mellett azonos az alpha *= 0.99-cel
    };
    // Előre kiszámolt elrendezés, ugrálás nélkül; a végén csak az átfedések feloldása
    sim.run = function () {
      for (let i = 0; i < 300; i++) sim.tick();
      for (let i = 0; i < 50; i++) collide(1);
    };
    return sim;
  }

  initTagsPage();
  initMiniMaps();

  // ===== Nagy térkép a /tags/ oldalon =====
  function initTagsPage() {
  const wrap = document.getElementById('tag-map');
  const cloud = document.getElementById('tags-cloud');
  const sw = document.querySelector('.tags-view-switch');
  if (!wrap || !cloud || !sw || !wrap.dataset.src) return;

  const svg = wrap.querySelector('svg');
  let built = false;

  // ===== Felhő / Térkép váltó (a #map az URL-ben megosztható) =====
  sw.hidden = false;
  function show(view) {
    const isMap = view === 'map';
    wrap.hidden = !isMap;
    cloud.hidden = isMap;
    sw.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    history.replaceState(null, '', isMap ? '#map' : location.pathname);
    if (isMap && !built) { built = true; build(); }
  }
  sw.addEventListener('click', e => {
    const b = e.target.closest('.view-btn');
    if (!b) return;
    e.preventDefault();
    show(b.dataset.view);
  });
  if (location.hash === '#map') show('map');

  async function build() {
    // A betűtípusnak betöltve kell lennie, különben a feliratok mérete, így az elrendezés is más lenne
    const [data] = await Promise.all([loadGraph(wrap.dataset.src), document.fonts.ready]);
    const { nodes, links, neighbors, index } = initGraph(data);

    // ===== Csomópontok (a szimuláció előtt, hogy a feliratok mérhetők legyenek) =====
    // A viewBox a doboz valódi pixelméretét követi, így álló (mobil) dobozban
    // sem zsugorodik keskeny csíkká a gráf. A közepe a 0,0 pont marad.
    let W = 1000, H = 700;
    function sizeViewBox() {
      const r = svg.getBoundingClientRect();
      if (r.width && r.height) { W = r.width; H = r.height; }
      svg.setAttribute('viewBox', `${-W / 2} ${-H / 2} ${W} ${H}`);
    }
    sizeViewBox();
    window.addEventListener('resize', sizeViewBox);
    const g = el('g');
    const lineLayer = el('g', { class: 'map-links' });
    const nodeLayer = el('g', { class: 'map-nodes' });
    // A feliratok külön, legfelső rétegben: pont nem takarhat bele egy feliratba
    const labelLayer = el('g', { class: 'map-labels' });
    g.append(lineLayer, nodeLayer, labelLayer);
    svg.appendChild(g);

    const lines = links.map(() => lineLayer.appendChild(el('line')));
    // A felirat-csoport ugyanazokat az osztályokat kapja, mint a pont, így a CSS mindkettőre hat
    const labels = [];
    const groups = nodes.map(n => {
      const cls = nodeClass(n);
      const a = el('a', { href: n.url, class: cls });
      a.appendChild(el('circle', { r: n.r }));
      const title = el('title');
      title.textContent = n.label;
      a.appendChild(title);
      nodeLayer.appendChild(a);
      const lg = el('g', { class: cls });
      lg.appendChild(makeLabel(n));
      labelLayer.appendChild(lg);
      labels.push(lg);
      return a;
    });
    function mark(i, name, on) {
      groups[i].classList.toggle(name, on);
      labels[i].classList.toggle(name, on);
    }

    measure(nodes, labels.map(lg => lg.firstChild));
    const sim = makeSim(nodes, links);
    sim.run();

    // ===== Rajz =====
    // A kiemelt felirat a doboz jobb szélénél a pont bal oldalára kerül, hogy ne vágódjon le
    function placeLabel(i) {
      const t = labels[i].querySelector('text');
      const x = nodes[i].r + 3;
      const set = (anchor, xv) => {
        t.setAttribute('text-anchor', anchor);
        t.setAttribute('x', xv);
        t.querySelectorAll('tspan').forEach(s => s.setAttribute('x', xv));
      };
      set('start', x);
      if (t.getBoundingClientRect().right > svg.getBoundingClientRect().right - 4) set('end', -x);
    }

    // Kicsinyített nézetben a pontok és feliratok nem mennek egy olvasható méret alá
    // (telefonon a teljes gráf csak így fér ki használhatóan); a vonalak rendesen skálázódnak.
    const MIN_K = 0.75;
    let nodeScale = 1;
    function drawNodes() {
      nodes.forEach((n, i) => {
        const tr = `translate(${n.x},${n.y}) scale(${nodeScale})`;
        groups[i].setAttribute('transform', tr);
        labels[i].setAttribute('transform', tr);
      });
      cullLabels();
    }
    // Ha a feliratok a pontokhoz képest nagyobbak (kicsinyítve, főleg mobilon), összeérhetnek:
    // a több cikket viselő tag felirata marad, az ütköző kisebbé elrejtődik. Nagyításkor visszajönnek.
    const labelOrder = nodes.map((n, i) => i).filter(i => nodes[i].kind === 'tag' && nodes[i].lbl)
      .sort((a, b) => (nodes[b].count || 0) - (nodes[a].count || 0));
    function cullLabels() {
      const s = nodeScale;
      // Akadály csak a már kirakott felirat; a pontok alatta vannak, a kontúr elválasztja őket
      // 3 egységnyi térköz kell két felirat közé, hogy ne fussanak össze egy sorrá
      const over = (r, o) => Math.min(r.x1, o.x1) - Math.max(r.x0, o.x0) > -3 && Math.min(r.y1, o.y1) - Math.max(r.y0, o.y0) > -1;
      const shown = [];
      labelOrder.forEach(i => {
        const n = nodes[i], b = n.lbl;
        const r = { x0: n.x + b.x0 * s, x1: n.x + b.x1 * s, y0: n.y + b.y0 * s, y1: n.y + b.y1 * s };
        const hit = shown.some(o => over(r, o));
        mark(i, 'lbl-off', hit);
        if (!hit) shown.push(r);
      });
    }
    function draw() {
      links.forEach((l, i) => {
        const a = nodes[l.s], b = nodes[l.t];
        lines[i].setAttribute('x1', a.x); lines[i].setAttribute('y1', a.y);
        lines[i].setAttribute('x2', b.x); lines[i].setAttribute('y2', b.y);
      });
      drawNodes();
    }

    // ===== Nézet: eltolás és nagyítás =====
    // A nagyítás célértéket állít, a nézet képkockánként finoman közelít hozzá.
    const view = { x: 0, y: 0, k: 1 };
    const goal = { x: 0, y: 0, k: 1 };
    let viewAnim = false;
    function applyView() {
      g.setAttribute('transform', `translate(${view.x},${view.y}) scale(${view.k})`);
      const s = Math.max(1, MIN_K / view.k);
      if (s !== nodeScale) { nodeScale = s; drawNodes(); }
    }
    function setView(v, animate) {
      Object.assign(goal, v);
      if (!animate) { Object.assign(view, goal); applyView(); return; }
      if (!viewAnim) { viewAnim = true; requestAnimationFrame(stepView); }
    }
    function stepView() {
      const s = 0.25;
      view.x += (goal.x - view.x) * s;
      view.y += (goal.y - view.y) * s;
      view.k += (goal.k - view.k) * s;
      const done = Math.abs(goal.k - view.k) < 1e-4 * goal.k && Math.abs(goal.x - view.x) < 0.05 && Math.abs(goal.y - view.y) < 0.05;
      if (done) Object.assign(view, goal);
      applyView();
      if (done) viewAnim = false; else requestAnimationFrame(stepView);
    }
    function fit(animate) {
      // A bal alsó súgó sávját kihagyja, hogy ne takarjon pontot
      const hint = [...wrap.querySelectorAll('.tag-map-hint')].find(h => h.offsetHeight);
      const hb = hint ? hint.offsetHeight + 8 : 0;
      // A feliratokkal együtt mért kiterjedés, hogy a szélső felirat se vágódjon le.
      // A felirat kicsinyítve nem megy a MIN_K méret alá, ezért a nagyítás pár lépésben áll be.
      let k = 1, x0, y0, x1, y1;
      for (let it = 0; it < 4; it++) {
        const s = Math.max(1, MIN_K / k);
        x0 = y0 = Infinity; x1 = y1 = -Infinity;
        nodes.forEach(n => {
          x0 = Math.min(x0, n.x + n.box.x0 * s); y0 = Math.min(y0, n.y + n.box.y0 * s);
          x1 = Math.max(x1, n.x + n.box.x1 * s); y1 = Math.max(y1, n.y + n.box.y1 * s);
        });
        k = Math.min(W / (x1 - x0 + 40), (H - hb) / (y1 - y0 + 40), 2.5);
      }
      setView({ k, x: -k * (x0 + x1) / 2, y: -k * (y0 + y1) / 2 - hb / 2 }, animate);
    }
    // A célnézetből számol, így gyors egymás utáni görgetések is pontosan összeadódnak
    function zoomAt(px, py, factor) {
      const k = Math.max(0.2, Math.min(5, goal.k * factor));
      setView({ k, x: px - (px - goal.x) * (k / goal.k), y: py - (py - goal.y) * (k / goal.k) }, true);
    }
    // Képernyő-koordináta → viewBox-koordináta
    function toSvg(e) {
      const p = svg.createSVGPoint();
      p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }
    // viewBox-koordináta → gráf-koordináta
    function toGraph(p) { return { x: (p.x - view.x) / view.k, y: (p.y - view.y) / view.k }; }

    // ===== Animáció húzáskor =====
    let running = false, dragging = null;
    function loop() {
      sim.tick(); draw();
      if (sim.alpha > 0.005 || dragging !== null) requestAnimationFrame(loop);
      else running = false;
    }
    function wake() {
      sim.alphaTarget = 0.3;
      sim.alpha = Math.max(sim.alpha, 0.3);
      if (!running) { running = true; requestAnimationFrame(loop); }
    }

    // ===== Egér/érintés: pont húzása, háttér eltolása, kétujjas nagyítás, koppintás =====
    const pts = new Map();          // aktív mutatók (ujjak/egér): pointerId → viewBox-pont
    let pan = null, pinch = null, moved = 0, down = null, dragStarted = false;
    function startPan(p) {
      Object.assign(view, goal);   // futó nagyítás-animáció közben se ugorjon
      pan = { x: p.x - view.x, y: p.y - view.y };
    }
    function pinchState() {
      const [a, b] = [...pts.values()];
      return { m: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, d: Math.hypot(a.x - b.x, a.y - b.y) || 1 };
    }
    svg.addEventListener('pointerdown', e => {
      const p = toSvg(e);
      if (e.isPrimary) { pts.clear(); pinch = null; }   // elveszett felengedés ne ragadjon be
      pts.set(e.pointerId, p);
      svg.setPointerCapture(e.pointerId);
      if (pts.size === 2) {
        // Második ujj: a pont-húzás vagy eltolás helyett kétujjas nagyítás és mozgatás
        if (dragging !== null) { nodes[dragging].fixed = false; dragging = null; sim.alphaTarget = 0; }
        pan = null;
        moved = Infinity;          // ebből már nem lesz koppintás
        Object.assign(view, goal);
        const s = pinchState();
        pinch = { d: s.d, k: view.k, gm: toGraph(s.m) };
        return;
      }
      if (pts.size > 2) return;
      const a = e.target.closest('.node');
      moved = 0;
      down = { x: e.clientX, y: e.clientY };
      if (a) {
        // A szimuláció csak valódi húzásnál indul: sima kattintásra a gráf nem mozdul,
        // így a második kattintás is ugyanott találja a pontot
        dragging = groups.indexOf(a);
        nodes[dragging].fixed = true;
        dragStarted = false;
      } else {
        startPan(p);
      }
    });
    svg.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      const p = toSvg(e);
      pts.set(e.pointerId, p);
      if (pinch) {
        // A két ujj közti gráfpont az ujjak közepén marad, a távolság aránya nagyít
        const s = pinchState();
        const k = Math.max(0.2, Math.min(5, pinch.k * s.d / pinch.d));
        setView({ k, x: s.m.x - pinch.gm.x * k, y: s.m.y - pinch.gm.y * k }, false);
        return;
      }
      if (dragging === null && !pan) return;
      // Képernyőn mért elmozdulás a lenyomás helyétől (érintésnél a movementX nem mindenhol megbízható)
      moved = Math.max(moved, Math.hypot(e.clientX - down.x, e.clientY - down.y));
      if (dragging !== null) {
        if (!dragStarted) {
          if (moved <= (e.pointerType === 'mouse' ? 4 : 10)) return;
          dragStarted = true;
          wake();
        }
        const q = toGraph(p);
        nodes[dragging].x = q.x; nodes[dragging].y = q.y;
      } else {
        setView({ x: p.x - pan.x, y: p.y - pan.y, k: goal.k }, false);
      }
    });
    function release() {
      if (dragging !== null) nodes[dragging].fixed = false;
      dragging = null; pan = null;
      sim.alphaTarget = 0;   // elengedés után a gráf fokozatosan megnyugszik
    }
    // A pointer capture miatt a click a térképre megy, nem a pontra: a megnyitást
    // itt végezzük, ha a ponton lenyomva-elengedve nem volt húzás.
    // Érintésnél az első koppintás csak kiemel (nincs hover), a második nyit.
    svg.addEventListener('pointerup', e => {
      if (!pts.delete(e.pointerId)) return;
      if (pinch) {
        if (pts.size < 2) {
          pinch = null;
          // Ha egy ujj fent maradt, onnan sima eltolás folytatódik, ugrás nélkül
          if (pts.size === 1) startPan([...pts.values()][0]);
        }
        return;
      }
      const tap = moved <= (e.pointerType === 'mouse' ? 4 : 10);
      if (dragging !== null && tap) {
        const i = dragging, url = nodes[i].url;
        release();
        if (armed !== i) { armed = i; focus(i); return; }   // első kattintás/koppintás: kijelölés
        location.href = url;
        return;
      }
      if (pan && tap) { armed = null; blur(); }   // üres helyre kattintás: kijelölés off
      release();
    });
    svg.addEventListener('pointercancel', e => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      release();
    });
    // Egérrel/érintéssel a pointerup nyit; a natív link csak billentyűzetről (Enter) menjen,
    // különben egyes böngészőkben kétszer nyílna, vagy húzás után is megnyílna.
    svg.addEventListener('click', e => {
      if (e.detail !== 0 && e.target.closest('.node')) e.preventDefault();
    }, true);

    svg.addEventListener('wheel', e => {
      e.preventDefault();
      const p = toSvg(e);
      // Arányos nagyítás: touchpadon apró lépések, egérgörgőn egy kattanás ~18%
      const dy = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 800 : 1);
      zoomAt(p.x, p.y, Math.exp(-Math.max(-100, Math.min(100, dy)) * 0.002));
    }, { passive: false });

    wrap.querySelector('.tag-map-controls').addEventListener('click', e => {
      const z = e.target.closest('button');
      if (!z) return;
      if (z.dataset.zoom === 'fit') fit(true);
      else zoomAt(0, 0, z.dataset.zoom === 'in' ? 1.3 : 1 / 1.3);
    });

    // ===== Kiemelés: a pont és a szomszédai, a többi elhalványul =====
    // armed: az egyszer már kattintott/koppintott pont; a második kattintás ezt nyitja meg
    let focused = null, armed = null;
    function focus(i) {
      blur();
      focused = i;
      svg.classList.add('has-focus');
      mark(i, 'hl', true);
      neighbors[i].forEach(j => mark(j, 'hl', true));
      placeLabel(i);
      neighbors[i].forEach(placeLabel);
      links.forEach((l, k) => lines[k].classList.toggle('hl', l.s === i || l.t === i));
    }
    function blur() {
      focused = null;
      svg.classList.remove('has-focus');
      nodes.forEach((n, i) => mark(i, 'hl', false));
      lines.forEach(li => li.classList.remove('hl'));
    }
    // Hover csak egérrel; érintésnél a koppintás kezeli a kiemelést.
    // Egérrel elhagyva a pontot a kijelölt pont kiemelése tér vissza.
    groups.forEach((gr, i) => {
      gr.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && dragging === null) focus(i); });
      gr.addEventListener('pointerleave', e => {
        if (e.pointerType !== 'mouse' || dragging !== null) return;
        if (armed !== null) focus(armed); else blur();
      });
      gr.addEventListener('focus', () => focus(i));
      // Ha a fókusz máshová kerül (pl. gombra), a kijelölés is megszűnik: újra két kattintás kell
      gr.addEventListener('blur', () => { armed = null; blur(); });
    });

    draw();
    fit();

    // /tags/?focus=<cikk útvonala>#map: a mini-mapről érkezve a cikk középen áll, kiemelve;
    // egy további kattintás megnyitja
    const f = new URLSearchParams(location.search).get('focus');
    const fi = f ? index.get('p:' + f) : undefined;
    if (fi !== undefined) {
      const n = nodes[fi], k = Math.max(goal.k, 1.2);
      setView({ k, x: -k * n.x, y: -k * n.y }, false);
      armed = fi;
      focus(fi);
    }
  }
  }

  // ===== Mini-map a cikkek alján =====
  // A teljes térkép kicsiben, halványan; csak a cikk és a tagjei emelkednek ki, névvel.
  // Nem interaktív: az egész doboz egy link a nagy térképre. Csak a képernyő közelében épül fel.
  function initMiniMaps() {
    const boxes = document.querySelectorAll('.mini-map[data-src]');
    if (!boxes.length) return;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        buildMini(e.target);
      });
    }, { rootMargin: '300px' }) : null;
    boxes.forEach(box => {
      box.hidden = false;
      if (io) io.observe(box); else buildMini(box);
    });
  }

  async function buildMini(box) {
    const svg = box.querySelector('svg');
    const [data] = await Promise.all([loadGraph(box.dataset.src), document.fonts.ready]);
    const { nodes, links, neighbors, index } = initGraph(data);
    const me = index.get(box.dataset.node);
    if (me === undefined) { box.hidden = true; return; }

    // Mérés ugyanazzal a stílussal, mint a nagy térképen, hogy az elrendezés is ugyanaz legyen
    const probe = el('g');
    svg.appendChild(probe);
    const texts = nodes.map(n => {
      const lg = el('g', { class: nodeClass(n) });
      const t = makeLabel(n);
      lg.appendChild(t);
      probe.appendChild(lg);
      return t;
    });
    measure(nodes, texts);
    probe.remove();
    makeSim(nodes, links).run();

    const r = svg.getBoundingClientRect();
    const W = r.width || 600, H = r.height || 220;
    svg.setAttribute('viewBox', `${-W / 2} ${-H / 2} ${W} ${H}`);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    nodes.forEach(n => { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y); });
    const k = Math.min(W / (x1 - x0 + 40), H / (y1 - y0 + 40));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const P = n => ({ x: (n.x - cx) * k, y: (n.y - cy) * k });

    // Kiemelve: a cikk és a tagjei; a többi pont és vonal halvány háttér
    const hl = new Set([me, ...neighbors[me]]);
    const lineLayer = el('g', { class: 'map-links' });
    const nodeLayer = el('g', { class: 'map-nodes' });
    const labelLayer = el('g', { class: 'map-labels' });
    links.forEach(l => {
      const a = P(nodes[l.s]), b = P(nodes[l.t]);
      const on = l.s === me || l.t === me;
      lineLayer.appendChild(el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: on ? 'hl' : '' }));
    });
    // A pontok a térképpel együtt kicsinyednek (legalább 1,5 px sugárral), a feliratok olvasható méretűek maradnak
    const dotR = (n, i) => i === me ? 4.5 : Math.max(1.5, n.r * k * (hl.has(i) ? 1.6 : 1));
    const items = [];
    nodes.forEach((n, i) => {
      const p = P(n), on = hl.has(i);
      const cls = nodeClass(n) + (on ? ' hl' : '');
      const dot = el('g', { class: cls, transform: `translate(${p.x},${p.y})` });
      dot.appendChild(el('circle', { r: dotR(n, i) }));
      (on ? labelLayer : nodeLayer).appendChild(dot);
      if (!on) return;
      const lg = el('g', { class: cls, transform: `translate(${p.x},${p.y})` });
      const t = el('text', { x: 0, y: 0 });
      wrapLabel(t, n.label, n.kind === 'post' ? 24 : Infinity);
      lg.appendChild(t);
      items.push({ i, p, t, off: dotR(n, i) + 3 });
    });
    svg.classList.add('has-focus');
    svg.append(lineLayer, nodeLayer, labelLayer);

    // A kicsinyített térképen a kiemelt feliratok összeérnének: mindegyik az első szabad helyre
    // kerül (jobbra, balra, fölé, alá). Előbb a cikk, aztán a tagek méret szerint; ami sehol
    // nem fér el, az rejtve marad (a nagy térképen ott van).
    items.sort((a, b) => (a.i === me ? -1 : b.i === me ? 1 : (nodes[b.i].count || 0) - (nodes[a.i].count || 0)));
    const placed = [];
    const over = (r, o) => Math.min(r.x1, o.x1) - Math.max(r.x0, o.x0) > -3 && Math.min(r.y1, o.y1) - Math.max(r.y0, o.y0) > -1;
    items.forEach(it => {
      labelLayer.appendChild(it.t.parentNode);
      const set = (anchor, x, y) => {
        it.t.setAttribute('text-anchor', anchor);
        it.t.setAttribute('x', x); it.t.setAttribute('y', y);
        it.t.querySelectorAll('tspan').forEach(s => s.setAttribute('x', x));
      };
      const spots = [['start', it.off, 4], ['end', -it.off, 4], ['middle', 0, -it.off - 3], ['middle', 0, it.off + 11]];
      for (const [anchor, x, y] of spots) {
        set(anchor, x, y);
        const b = it.t.getBBox();
        const r = { x0: it.p.x + b.x, x1: it.p.x + b.x + b.width, y0: it.p.y + b.y, y1: it.p.y + b.y + b.height };
        const inside = r.x0 > -W / 2 + 4 && r.x1 < W / 2 - 4 && r.y0 > -H / 2 + 2 && r.y1 < H / 2 - 2;
        if (inside && !placed.some(o => over(r, o))) { placed.push(r); return; }
      }
      if (it.i === me) { set('start', it.off, 4); return; }
      it.t.parentNode.remove();
    });
  }
})();
