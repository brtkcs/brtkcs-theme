// Tag-térkép: tagek és cikkek erőalapú gráfként, sima SVG, külső könyvtár nélkül.
// Adat: a taxonomy.html által beágyazott #tag-graph-data JSON ({nodes, edges}).
(function () {
  const dataEl = document.getElementById('tag-graph-data');
  const wrap = document.getElementById('tag-map');
  const cloud = document.getElementById('tags-cloud');
  const sw = document.querySelector('.tags-view-switch');
  if (!dataEl || !wrap || !cloud || !sw) return;

  const NS = 'http://www.w3.org/2000/svg';
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

  function el(name, attrs) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }

  function build() {
    const data = JSON.parse(dataEl.textContent);

    // Determinisztikus kezdőállás (spirál), így minden betöltéskor ugyanaz a kép
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

    // ===== Szimuláció: taszítás, rugók az élek mentén, enyhe középre húzás =====
    let alpha = 1;
    function tick() {
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
      alpha *= 0.99;
    }
    for (let i = 0; i < 300; i++) tick();   // előre kiszámolt elrendezés, ugrálás nélkül

    // ===== Rajz =====
    const W = 1000, H = 700;
    svg.setAttribute('viewBox', `${-W / 2} ${-H / 2} ${W} ${H}`);
    const g = el('g');
    const lineLayer = el('g', { class: 'map-links' });
    const nodeLayer = el('g', { class: 'map-nodes' });
    g.append(lineLayer, nodeLayer);
    svg.appendChild(g);

    const lines = links.map(() => lineLayer.appendChild(el('line')));
    const groups = nodes.map(n => {
      const a = el('a', { href: n.url, class: `node node-${n.kind}${n.section ? ' sec-' + n.section : ''}` });
      a.appendChild(el('circle', { r: n.r }));
      const t = el('text', { x: n.r + 3, y: 4 });
      t.textContent = n.label;
      const title = el('title');
      title.textContent = n.label;
      a.append(t, title);
      nodeLayer.appendChild(a);
      return a;
    });

    function draw() {
      links.forEach((l, i) => {
        const a = nodes[l.s], b = nodes[l.t];
        lines[i].setAttribute('x1', a.x); lines[i].setAttribute('y1', a.y);
        lines[i].setAttribute('x2', b.x); lines[i].setAttribute('y2', b.y);
      });
      nodes.forEach((n, i) => groups[i].setAttribute('transform', `translate(${n.x},${n.y})`));
    }

    // ===== Nézet: eltolás és nagyítás =====
    const view = { x: 0, y: 0, k: 1 };
    function applyView() { g.setAttribute('transform', `translate(${view.x},${view.y}) scale(${view.k})`); }
    function fit() {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      nodes.forEach(n => { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y); });
      const k = Math.min(W / (x1 - x0 + 120), H / (y1 - y0 + 60), 2.5);
      view.k = k;
      view.x = -k * (x0 + x1) / 2;
      view.y = -k * (y0 + y1) / 2;
      applyView();
    }
    function zoomAt(px, py, factor) {
      const k = Math.max(0.2, Math.min(5, view.k * factor));
      view.x = px - (px - view.x) * (k / view.k);
      view.y = py - (py - view.y) * (k / view.k);
      view.k = k;
      applyView();
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
      tick(); draw();
      if (alpha > 0.005 || dragging !== null) requestAnimationFrame(loop);
      else running = false;
    }
    function wake() {
      alpha = Math.max(alpha, 0.3);
      if (!running) { running = true; requestAnimationFrame(loop); }
    }

    // ===== Egér/érintés: pont húzása, háttér eltolása, kattintás =====
    let pan = null, moved = 0;
    svg.addEventListener('pointerdown', e => {
      const a = e.target.closest('.node');
      moved = 0;
      svg.setPointerCapture(e.pointerId);
      if (a) {
        dragging = groups.indexOf(a);
        nodes[dragging].fixed = true;
        wake();
      } else {
        const p = toSvg(e);
        pan = { x: p.x - view.x, y: p.y - view.y };
      }
    });
    svg.addEventListener('pointermove', e => {
      if (dragging === null && !pan) return;
      moved += Math.abs(e.movementX) + Math.abs(e.movementY);
      const p = toSvg(e);
      if (dragging !== null) {
        const q = toGraph(p);
        nodes[dragging].x = q.x; nodes[dragging].y = q.y;
      } else {
        view.x = p.x - pan.x; view.y = p.y - pan.y;
        applyView();
      }
    });
    function release() {
      if (dragging !== null) nodes[dragging].fixed = false;
      dragging = null; pan = null;
    }
    // A pointer capture miatt a click a térképre megy, nem a pontra: a megnyitást
    // itt végezzük, ha a ponton lenyomva-elengedve nem volt húzás.
    svg.addEventListener('pointerup', () => {
      if (dragging !== null && moved <= 4) {
        const url = nodes[dragging].url;
        release();
        location.href = url;
        return;
      }
      release();
    });
    svg.addEventListener('pointercancel', release);
    // Egérrel/érintéssel a pointerup nyit; a natív link csak billentyűzetről (Enter) menjen,
    // különben egyes böngészőkben kétszer nyílna, vagy húzás után is megnyílna.
    svg.addEventListener('click', e => {
      if (e.detail !== 0 && e.target.closest('.node')) e.preventDefault();
    }, true);

    svg.addEventListener('wheel', e => {
      e.preventDefault();
      const p = toSvg(e);
      zoomAt(p.x, p.y, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    }, { passive: false });

    wrap.querySelector('.tag-map-controls').addEventListener('click', e => {
      const z = e.target.closest('button');
      if (!z) return;
      if (z.dataset.zoom === 'fit') fit();
      else zoomAt(0, 0, z.dataset.zoom === 'in' ? 1.3 : 1 / 1.3);
    });

    // ===== Kiemelés: a pont és a szomszédai, a többi elhalványul =====
    function focus(i) {
      svg.classList.add('has-focus');
      groups[i].classList.add('hl');
      neighbors[i].forEach(j => groups[j].classList.add('hl'));
      links.forEach((l, k) => lines[k].classList.toggle('hl', l.s === i || l.t === i));
    }
    function blur() {
      svg.classList.remove('has-focus');
      groups.forEach(gr => gr.classList.remove('hl'));
      lines.forEach(li => li.classList.remove('hl'));
    }
    groups.forEach((gr, i) => {
      gr.addEventListener('pointerenter', () => { if (dragging === null) focus(i); });
      gr.addEventListener('pointerleave', () => { if (dragging === null) blur(); });
      gr.addEventListener('focus', () => focus(i));
      gr.addEventListener('blur', blur);
    });

    draw();
    fit();
  }
})();
