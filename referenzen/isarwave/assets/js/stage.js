/* =====================================================================
   Partikel-Bühne
   Ein einziges Partikelsystem begleitet die ganze Seite. Jede Ankerfläche
   (data-shape) definiert eine Form, Drehung und Größe. Beim Scrollen
   wird zwischen zwei Ankern interpoliert: gleiche Form → drehen und
   wandern, andere Form → auflösen ins Feld und neu zusammensetzen.
   ===================================================================== */
(() => {
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = innerWidth < 760;
  // Schwächere Geräte (wenige Kerne oder wenig Speicher) starten mit weniger Partikeln
  const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const N = Math.round((small ? 2200 : 5600) * (weak ? 0.6 : 1));   // Handy: 2200 statt 2600 (flüssiger, optisch gleich)

  const COLORS = ['#f4f1ff', '#c9c2e6', '#ffb829', '#ffc95c', '#8052ff', '#a98bff', '#2bb594', '#d34bd8', '#4b7bff'];

  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- Formen (Einheitskoordinaten, y nach unten, -z = vorn) ---------- */

  function brain() {
    const P = new Float32Array(N * 3);
    const folds = (x, y, z) =>
      Math.sin(9.1 * x + 2.3 * Math.sin(6.3 * y)) +
      Math.sin(8.3 * z + 2.1 * Math.sin(5.7 * x)) +
      Math.sin(10.2 * y + 1.9 * Math.sin(7.1 * z));
    let i = 0;
    const nCereb = Math.floor(N * 0.8), nCbl = Math.floor(N * 0.13);
    while (i < nCereb) {
      // Zufallsrichtung auf der Kugel
      let dx = gauss(), dy = gauss(), dz = gauss();
      const l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
      let x = dx * 0.74, y = dy * 0.6, z = dz * 1.0;
      if (y > 0) y *= 0.72;                                  // flache Unterseite
      if (y > 0.05 && z < -0.1) y *= 0.85;                   // Stirnlappen
      if (y > 0.12 && z > 0.05 && z < 0.55) { y += 0.12 * Math.abs(dx); } // Schläfenlappen
      const fiss = Math.exp(-((dx / 0.1) ** 2));               // Mittelspalt zwischen den Hemisphären
      if (y < 0.15) { x *= 1 - 0.0; y *= 1 - 0.12 * fiss; }
      if (Math.abs(x) < 0.035 && y < 0.1) continue;
      const g = folds(x, y, z) / 3;                          // Windungen und Furchen
      const ridge = 1 - Math.abs(g);
      if (ridge < 0.42 && rnd() > 0.15) continue;
      const k = 1 + 0.055 * ridge;
      P[i * 3] = x * k; P[i * 3 + 1] = y * k - 0.08; P[i * 3 + 2] = z * k;
      i++;
    }
    while (i < nCereb + nCbl) {                               // Kleinhirn
      let dx = gauss(), dy = gauss(), dz = gauss();
      const l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
      const x = dx * 0.5, y = dy * 0.2 + 0.42, z = dz * 0.3 + 0.62;
      if (Math.abs(Math.sin(y * 70)) < 0.35 && rnd() > 0.3) continue;
      if (dy < -0.2) continue;
      P[i * 3] = x; P[i * 3 + 1] = y; P[i * 3 + 2] = z; i++;
    }
    while (i < N) {                                           // Hirnstamm
      const t = rnd(), a = rnd() * Math.PI * 2, r = 0.1 * (1 - t * 0.3);
      P[i * 3] = Math.cos(a) * r; P[i * 3 + 1] = 0.34 + t * 0.4; P[i * 3 + 2] = 0.3 + Math.sin(a) * r + t * 0.08; i++;
    }
    return P;
  }

  function band() {
    // Stirnband: ovaler Ring mit Bandhöhe, 8 Elektroden-Pads, Elektronik-Modul hinten
    const P = new Float32Array(N * 3);
    const RX = 0.95, RZ = 0.8;
    const nRing = Math.floor(N * 0.68), nPads = Math.floor(N * 0.2);
    let i = 0;
    for (; i < nRing; i++) {
      const a = rnd() * Math.PI * 2;
      const h = (rnd() - 0.5) * 0.26;
      const bulge = 1 + 0.06 * Math.cos(h * 12);
      const edge = rnd() < 0.35 ? Math.sign(h) * 0.13 : h; // Kanten dichter
      P[i * 3] = Math.cos(a) * RX * bulge; P[i * 3 + 1] = edge; P[i * 3 + 2] = Math.sin(a) * RZ * bulge;
    }
    for (let k = 0; i < nRing + nPads; i++, k++) {
      const pad = k % 8;
      const a = -Math.PI / 2 + (pad - 3.5) * 0.36;           // vorn verteilt
      let dx = gauss(), dy = gauss(), dz = gauss();
      const l = Math.hypot(dx, dy, dz) || 1;
      const r = 0.075;
      P[i * 3] = Math.cos(a) * (RX - 0.06) + dx / l * r;
      P[i * 3 + 1] = dy / l * r * 1.3;
      P[i * 3 + 2] = Math.sin(a) * (RZ - 0.06) + dz / l * r;
    }
    for (; i < N; i++) {                                      // Modul hinten
      P[i * 3] = (rnd() - 0.5) * 0.36; P[i * 3 + 1] = (rnd() - 0.5) * 0.22; P[i * 3 + 2] = RZ + 0.04 + rnd() * 0.1;
    }
    return P;
  }

  function wave() {
    // Raster; die Höhe wird pro Frame animiert (siehe waveY)
    const P = new Float32Array(N * 3);
    const g = Math.ceil(Math.sqrt(N));
    for (let i = 0; i < N; i++) {
      const gx = i % g, gz = Math.floor(i / g);
      P[i * 3] = (gx / (g - 1)) * 2 - 1 + (rnd() - 0.5) * 0.01;
      P[i * 3 + 1] = 0;
      P[i * 3 + 2] = (gz / (g - 1)) * 2 - 1;
    }
    return P;
  }
  const waveY = (x, z, t) => {
    const base = 0.1 * Math.sin(x * 4 - t * 1.2) + 0.06 * Math.sin(z * 5 + t * 0.9) + 0.04 * Math.sin((x + z) * 9 - t * 2);
    // Ein „auffälliges Ereignis“, das als Spitze durch das Feld wandert
    const ex = ((t * 0.18) % 2.6) - 1.3;
    const spike = -0.38 * Math.exp(-(((x - ex) / 0.09) ** 2) - ((z / 0.5) ** 2));
    return base + spike;
  };

  function neuron() {
    const P = new Float32Array(N * 3);
    const segs = [];
    function grow(x, y, z, dx, dy, dz, len, w, depth) {
      const steps = 10;
      let px = x, py = y, pz = z;
      for (let s = 0; s < steps; s++) {
        dx += (rnd() - 0.5) * 0.5; dy += (rnd() - 0.5) * 0.5; dz += (rnd() - 0.5) * 0.5;
        const l = Math.hypot(dx, dy, dz); dx /= l; dy /= l; dz /= l;
        const nx = px + dx * len / steps, ny = py + dy * len / steps, nz = pz + dz * len / steps;
        segs.push([px, py, pz, nx, ny, nz, w * (1 - s / steps * 0.5)]);
        px = nx; py = ny; pz = nz;
        if (depth > 0 && s === 5 && rnd() < 0.8) grow(px, py, pz, dx + gauss(), dy + gauss(), dz + gauss(), len * 0.55, w * 0.6, depth - 1);
      }
      if (depth > 0) {
        grow(px, py, pz, dx + gauss() * 0.8, dy + gauss() * 0.8, dz + gauss() * 0.8, len * 0.6, w * 0.6, depth - 1);
        grow(px, py, pz, dx + gauss() * 0.8, dy + gauss() * 0.8, dz + gauss() * 0.8, len * 0.5, w * 0.55, depth - 1);
      }
    }
    for (let b = 0; b < 6; b++) {
      const a = (b / 6) * Math.PI * 2 + rnd() * 0.4;
      grow(0, 0, 0, Math.cos(a), -0.6 + Math.sin(a) * 0.9, (rnd() - 0.5) * 0.8, 0.55, 0.06, 2);
    }
    grow(0, 0.1, 0, 0.15, 1, 0.1, 1.1, 0.045, 1);              // Axon
    const total = segs.reduce((s, g) => s + Math.hypot(g[3] - g[0], g[4] - g[1], g[5] - g[2]), 0);
    const nSoma = Math.floor(N * 0.22);
    let i = 0;
    for (; i < nSoma; i++) {
      let dx = gauss(), dy = gauss(), dz = gauss();
      const l = Math.hypot(dx, dy, dz) || 1, r = 0.17 * (0.85 + rnd() * 0.15);
      P[i * 3] = dx / l * r; P[i * 3 + 1] = dy / l * r * 1.1; P[i * 3 + 2] = dz / l * r;
    }
    for (; i < N; i++) {
      let pick = rnd() * total, g = segs[0];
      for (const s of segs) { const L = Math.hypot(s[3] - s[0], s[4] - s[1], s[5] - s[2]); if (pick < L) { g = s; break; } pick -= L; }
      const t = rnd();
      P[i * 3] = lerp(g[0], g[3], t) + gauss() * g[6];
      P[i * 3 + 1] = lerp(g[1], g[4], t) + gauss() * g[6];
      P[i * 3 + 2] = lerp(g[2], g[5], t) + gauss() * g[6];
    }
    // Zentrieren und normieren
    let mx = 0, my = 0, mz = 0, m = 0;
    for (let k = 0; k < N; k++) { mx += P[k * 3]; my += P[k * 3 + 1]; mz += P[k * 3 + 2]; }
    mx /= N; my /= N; mz /= N;
    for (let k = 0; k < N; k++) { P[k * 3] -= mx; P[k * 3 + 1] -= my; P[k * 3 + 2] -= mz; m = Math.max(m, Math.abs(P[k * 3]), Math.abs(P[k * 3 + 1])); }
    for (let k = 0; k < N * 3; k++) P[k] /= m;
    return P;
  }

  const SHAPES = { brain: brain(), band: band(), wave: wave(), neuron: neuron() };

  /* ---------- Partikel-Eigenschaften ---------- */
  const B = SHAPES.brain;
  const col = new Uint8Array(N), size = new Float32Array(N), rot = new Float32Array(N), spin = new Float32Array(N);
  const fx = new Float32Array(N), fy = new Float32Array(N), fz = new Float32Array(N), fdr = new Float32Array(N);
  const lag = new Float32Array(N), introDelay = new Float32Array(N), sx0 = new Float32Array(N), sy0 = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const x = B[i * 3], y = B[i * 3 + 1], z = B[i * 3 + 2];
    // Farbinseln wie in der Vorlage: Bernstein an den Rändern, Silber/Weiß innen, violette Flecken
    const n = Math.sin(3.1 * x + 1.2) + Math.sin(2.4 * y + 2.1 * z) + Math.sin(2.9 * z - 1.4 * x);
    const rim = Math.hypot(x / 0.74, y / 0.6, z);
    const r = rnd();
    let c;
    if (r < 0.025) c = 6; else if (r < 0.05) c = 7; else if (r < 0.075) c = 8;
    else if (n > 0.9 || (rim > 0.97 && rnd() < 0.45)) c = rnd() < 0.7 ? 2 : 3;
    else if (n < -1.0) c = rnd() < 0.6 ? 4 : 5;
    else c = rnd() < 0.6 ? 0 : 1;
    col[i] = c;
    size[i] = 0.7 + rnd() * 0.8;
    rot[i] = rnd() * Math.PI * 2;
    spin[i] = (rnd() - 0.5) * 0.8;
    fx[i] = rnd(); fy[i] = rnd(); fz[i] = rnd(); fdr[i] = 0.3 + rnd();
    lag[i] = (rnd() - 0.5) * 0.22 + (y + 0.6) * 0.08;      // untere Partikel lösen sich zuerst
    introDelay[i] = rnd() * 0.55 + (z + 1) * 0.12;
    sx0[i] = -0.15 + gauss() * 0.25; sy0[i] = 1.15 + Math.abs(gauss()) * 0.4;
  }

  /* ---------- Anker ---------- */
  let anchors = [], W = 0, H = 0, dpr = 1;
  function measure() {
    const sy = scrollY;
    anchors = [...document.querySelectorAll('[data-shape]')].map(el => {
      const r = el.getBoundingClientRect();
      const d = el.dataset;
      return {
        el, shape: d.shape,
        docY: r.top + sy + r.height / 2,
        x: r.left + r.width / 2, // horizontale Position ändert sich beim Scrollen nicht
        h: r.height,
        // Handy: Formen etwas kleiner, damit sie nicht über den Text ragen
        s: Math.min(r.width, r.height) * 0.5 * (+d.size || 1) * (small ? 0.8 : 1),
        yaw: +d.yaw || 0, pitch: +d.pitch || 0, spin: +d.spin || 0,
        opacity: d.opacity ? +d.opacity : 1,
      };
    }).sort((a, b) => a.docY - b.docY);
  }
  let dprCap = small ? 1.5 : 2;   // Handy startet auf Stufe 1 – die Automatik regelt bei Reserve wieder hoch
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, dprCap);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    measure();
  }

  /* ---------- Maus-Parallaxe ---------- */
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', e => { tmx = e.clientX / W - 0.5; tmy = e.clientY / H - 0.5; }, { passive: true });

  /* ---------- Interaktion wie im Original ----------
     Jeder Partikel hat einen Versatz mit Feder: Die Maus wirbelt Partikel in
     ihrer Nähe weg (stärker, je schneller sie sich bewegt), ein Klick auf das
     Objekt sprengt sie vom Klickpunkt auseinander. Danach federn sie zurück. */
  const ox = new Float32Array(N), oy = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
  const burstK = new Float32Array(N).map(() => 0.5 + rnd());
  let px0 = -9999, py0 = -9999, mSpeed = 0, mActive = false, lastMove = 0, burst = null;
  addEventListener('pointermove', e => {
    if (px0 > -9999) mSpeed = Math.min(60, mSpeed * 0.6 + Math.hypot(e.clientX - px0, e.clientY - py0) * 0.4);
    px0 = e.clientX; py0 = e.clientY; mActive = true; lastMove = performance.now();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { mActive = false; });
  document.querySelectorAll('.anchor[data-shape]').forEach(el => {
    el.addEventListener('click', e => { if (!reduce) burst = { x: e.clientX, y: e.clientY, r: Math.max(el.offsetWidth, el.offsetHeight) * 0.9 }; });
  });

  /* ---------- Projektion ---------- */
  const OX = new Float32Array(N), OY = new Float32Array(N), OZ = new Float32Array(N);
  const QX = new Float32Array(N), QY = new Float32Array(N), QZ = new Float32Array(N);

  function project(a, t, extraYaw, outX, outY, outZ) {
    if (a.shape === 'field') {
      for (let i = 0; i < N; i++) {
        const yy = ((fy[i] - t * 0.006 * fdr[i]) % 1 + 1) % 1;
        outX[i] = (fx[i] + Math.sin(t * 0.15 + i) * 0.01) * W;
        outY[i] = yy * H * 1.1 - H * 0.05;
        outZ[i] = fz[i] * 1.6 - 0.8;
      }
      return;
    }
    const P = SHAPES[a.shape];
    const cy = a.docY - scrollY;
    const yaw = a.yaw + extraYaw + (reduce ? 0 : t * a.spin) + Math.sin(t * 0.25) * (a.spin ? 0 : 0.12) + mx * 0.35;
    const pitch = a.pitch + my * 0.2;
    const cY = Math.cos(yaw), sY = Math.sin(yaw), cP = Math.cos(pitch), sP = Math.sin(pitch);
    const D = 3.4, sc = a.s, isWave = a.shape === 'wave', isBrain = a.shape === 'brain';
    for (let i = 0; i < N; i++) {
      let x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
      if (isWave) y = waveY(x, z, t);
      else if (isBrain && !reduce) {
        // EEG-Welle läuft von vorn nach hinten durch das Gehirn
        const w = Math.sin(z * 5 - t * 1.8) * 0.014;
        x *= 1 + w; y *= 1 + w; z *= 1 + w;
      }
      const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
      const y1 = y * cP - z1 * sP, z2 = y * sP + z1 * cP;
      const f = D / (D + z2);
      outX[i] = a.x + x1 * sc * f;
      outY[i] = cy + y1 * sc * f;
      outZ[i] = z2;
    }
  }

  /* ---------- Zeichnen ---------- */
  const NB = COLORS.length * 2;
  const buckets = Array.from({ length: NB }, () => []);
  let start = performance.now(), visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) requestAnimationFrame(frame); });

  /* Qualitätsregler: misst die Bildzeit und reduziert bei Rucklern zuerst die
     gezeichneten Partikel, dann die Auflösung. Läuft es wieder flüssig, wird
     schrittweise hochgeregelt. */
  let lastNow = 0, ema = 16, level = small ? 1 : 0, stride = 1, frames = 0, calm = 0;
  function quality(now) {
    const dt = now - lastNow; lastNow = now;
    if (dt <= 0 || dt > 100) return;          // Tab war im Hintergrund
    ema = ema * 0.95 + dt * 0.05;
    if (++frames < 90) return;                 // Anlaufphase abwarten
    if (ema > 22 && level < 3) {
      level++; frames = 60; calm = 0;
      stride = level >= 2 ? 2 : 1;
      if (level === 1 || level === 3) { dprCap = level === 3 ? 1 : 1.5; resize(); }
    } else if (ema < 14 && level > 0) {
      if (++calm > 240) {
        level--; calm = 0; frames = 60;
        stride = level >= 2 ? 2 : 1;
        dprCap = level === 0 ? 2 : level === 3 ? 1 : 1.5; resize();
      }
    } else calm = 0;
  }

  // Zum Nachprüfen in der Konsole: IW_STAGE.level (0 = volle Qualität)
  window.IW_STAGE = { N, get level() { return level; }, get frameMs() { return +ema.toFixed(1); } };

  function frame(now) {
    if (!reduce) quality(now);
    const t = reduce ? 0 : (now - start) / 1000;
    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
    if (!anchors.length) measure();

    // Aktuelles Anker-Paar anhand der Bildschirmmitte
    const vc = scrollY + H * 0.5;
    let ia = 0;
    while (ia < anchors.length - 1 && anchors[ia + 1].docY <= vc) ia++;
    const A = anchors[ia], Bn = anchors[Math.min(ia + 1, anchors.length - 1)];
    let e = A === Bn ? 0 : clamp((vc - A.docY) / (Bn.docY - A.docY), 0, 1);
    if (vc < A.docY) e = 0;
    const same = A.shape === Bn.shape;

    if (same && A !== Bn) {
      // Gleiche Form: nicht auflösen, sondern drehen, wachsen und mitwandern
      // Handy: Anker liegen untereinander mit Text dazwischen – die Form bleibt länger stehen und wechselt zügig,
      // statt langsam quer über den Text zu gleiten
      const m = small ? smooth(0.35, 0.65, e) : smooth(0, 1, e);
      project({
        shape: A.shape, docY: lerp(A.docY, Bn.docY, m), x: lerp(A.x, Bn.x, m), s: lerp(A.s, Bn.s, m),
        yaw: lerp(A.yaw, Bn.yaw, m), pitch: lerp(A.pitch, Bn.pitch, m), spin: lerp(A.spin, Bn.spin, m),
      }, t, 0, OX, OY, OZ);
    } else {
      project(A, t, 0, OX, OY, OZ);
      if (A !== Bn) project(Bn, t, 0, QX, QY, QZ);
    }

    let op = lerp(A.opacity, Bn.opacity, smooth(0.2, 0.8, e));
    if (!same && A.shape !== 'field' && Bn.shape !== 'field') op *= 1 - 0.4 * Math.sin(Math.PI * e);
    if (small && A !== Bn && A.shape !== 'field' && Bn.shape !== 'field') op *= 1 - 0.5 * Math.sin(Math.PI * e);   // Handy: im Wechsel blasser, Text bleibt lesbar
    const intro = reduce ? 1 : clamp((now - start) / 2600, 0, 1);

    for (const b of buckets) b.length = 0;
    if (now - lastMove > 120) mSpeed *= 0.9;
    const interactive = !reduce && mActive && px0 > -9999;
    const hoverR = 90 + Math.min(mSpeed * 3, 110);
    const sizeK = Math.max(0.8, Math.min(1.6, (A.shape === 'field' ? Bn.s || 300 : A.s) / 260));

    for (let i = 0; i < N; i++) {
      if (stride > 1 && i % stride) continue;
      let px = OX[i], py = OY[i], pz = OZ[i];
      if (A !== Bn) {
        const ei = clamp(e + lag[i], 0, 1);
        if (!same) {
          const toField = A.shape === 'field' || Bn.shape === 'field';
          const m = toField ? smooth(0.12, 0.88, ei) : smooth(0.42, 0.58, ei);
          px = lerp(px, QX[i], m); py = lerp(py, QY[i], m); pz = lerp(pz, QZ[i], m);
          // Auflösen: Partikel fliegen in das freie Feld und kommen wieder zurück
          const d = A.shape === 'field' || Bn.shape === 'field' ? 0 : Math.pow(Math.sin(Math.PI * smooth(0.08, 0.92, ei)), 1.4);
          if (d > 0) {
            const yy = ((fy[i] - t * 0.006 * fdr[i]) % 1 + 1) % 1;
            px = lerp(px, fx[i] * W, d);
            py = lerp(py, yy * H, d);
            pz = lerp(pz, fz[i] * 1.6 - 0.8, d);
          }
        }
      }
      // Intro: Partikel strömen von unten links herein
      if (intro < 1) {
        const k = clamp((intro * 1.7 - introDelay[i]) / 0.75, 0, 1);
        const q = 1 - Math.pow(1 - k, 3);
        const sx = sx0[i] * W, sy = sy0[i] * H;
        const cxp = lerp(sx, px, 0.5) + (1 - q) * 120, cyp = lerp(sy, py, 0.5) + 60;
        // Quadratische Kurve für einen weichen Schwung
        px = (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * cxp + q * q * px;
        py = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * cyp + q * q * py;
      }
      // Klick: Impuls vom Klickpunkt weg, nahe Partikel fliegen weiter
      if (burst) {
        const dx = px - burst.x, dy = py - burst.y, d = Math.hypot(dx, dy) || 1;
        if (d < burst.r) {
          const k = Math.pow(1 - d / burst.r, 0.8) * 20 * burstK[i];
          const a = Math.atan2(dy, dx) + (rot[i] - Math.PI) * 0.35;
          vx[i] += Math.cos(a) * k; vy[i] += Math.sin(a) * k - 4 * burstK[i];
        }
      }
      // Maus: Wirbel um den Zeiger
      if (interactive) {
        const dx = px + ox[i] - px0, dy = py + oy[i] - py0, d = Math.hypot(dx, dy);
        if (d < hoverR && d > 0.01) {
          const fall = (1 - d / hoverR) ** 2;
          const force = fall * (0.35 + mSpeed * 0.06);
          const nx = dx / d, ny = dy / d, sw = spin[i] > 0 ? 1 : -1;
          vx[i] += (nx * 0.8 - ny * 0.6 * sw) * force;
          vy[i] += (ny * 0.8 + nx * 0.6 * sw) * force;
        }
      }
      // Feder zurück in die Form
      vx[i] = (vx[i] - ox[i] * 0.045) * 0.88;
      vy[i] = (vy[i] - oy[i] * 0.045) * 0.88;
      ox[i] += vx[i]; oy[i] += vy[i];
      px += ox[i]; py += oy[i];

      if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue;
      const f = 3.4 / (3.4 + pz);
      const s = size[i] * f * 2.4 * sizeK * (1 + Math.min(1, Math.hypot(ox[i], oy[i]) / 120) * 0.6);
      const near = pz < 0 ? 0 : 1;
      buckets[col[i] * 2 + near].push(px, py, s, rot[i] + t * spin[i]);
    }

    burst = null;
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = 'lighter';
    for (let b = 0; b < NB; b++) {
      const arr = buckets[b];
      if (!arr.length) continue;
      ctx.strokeStyle = COLORS[b >> 1];
      ctx.globalAlpha = op * ((b & 1) ? 0.5 : 0.9);
      ctx.beginPath();
      for (let k = 0; k < arr.length; k += 4) {
        const x = arr[k], y = arr[k + 1], s = arr[k + 2], a = arr[k + 3];
        const c = Math.cos(a) * s, sn = Math.sin(a) * s;
        ctx.moveTo(x + c, y + sn);
        ctx.lineTo(x - c * 0.5 - sn * 0.866, y - sn * 0.5 + c * 0.866);
        ctx.lineTo(x - c * 0.5 + sn * 0.866, y - sn * 0.5 - c * 0.866);
        ctx.closePath();
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (visible && !reduce) requestAnimationFrame(frame);
  }

  resize();
  addEventListener('resize', () => { resize(); if (reduce) requestAnimationFrame(frame); });
  addEventListener('load', measure);
  if (reduce) addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
  new ResizeObserver(measure).observe(document.body);
  requestAnimationFrame(frame);
})();
