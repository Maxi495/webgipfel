/* ---------- Team-Karussell (Endlos, wie im Original) ---------- */
(() => {
  const slider = document.getElementById('slider');
  const track = document.getElementById('slides');
  const infos = [...document.querySelectorAll('#slide-info .info')];
  const M = infos.length, COPIES = 3;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICONS = {
    in: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v10.75H3V9.75Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.2h-4v-4.6c0-1.1-.02-2.52-1.53-2.52-1.54 0-1.77 1.2-1.77 2.44v4.68h-4V9.75Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5h18v13H3v-13Zm1.6 1.6v.3l7.4 5.1 7.4-5.1v-.3H4.6Zm14.8 2.24-7.4 5.1-7.4-5.1v7.56h14.8V9.34Z"/></svg>',
  };

  // Rolle und Name in Buchstaben zerlegen
  let ci = 0;
  const splitChars = (el, start) => {
    let i = start;
    const text = el.textContent; el.textContent = '';
    for (const ch of text) {
      const c = document.createElement('span');
      c.className = 'c'; c.textContent = ch; c.style.setProperty('--i', i++);
      el.appendChild(c);
    }
    return i;
  };
  infos.forEach(info => {
    const role = info.querySelector('.role');
    const roleText = role.textContent;
    role.textContent = '';
    const m = document.createElement('span'); m.className = 'mask'; m.textContent = roleText; role.appendChild(m);
    let i = splitChars(m, 0);
    info.querySelectorAll('.name .ln').forEach(ln => { i = splitChars(ln, i); });
    info.querySelectorAll('.socials a').forEach((a, k) => { a.innerHTML = ICONS[a.dataset.icon] || ''; a.style.setProperty('--k', k); a.tabIndex = -1; });
  });

  // Karten in drei Kopien für die Endlosschleife
  for (let c = 0; c < COPIES; c++) {
    infos.forEach((info, i) => {
      const li = document.createElement('li');
      li.className = 'card';
      li.dataset.member = i;
      const base = info.dataset.img.replace(/-t\d+\.webp$/, '');
      const sizes = [320, 480, 640].map(w => `${base}-t${w}.webp ${w}w`).join(', ');
      li.innerHTML = `<img src="${info.dataset.img}" srcset="${sizes}" sizes="(max-width: 900px) 64vw, 300px" alt="" decoding="async" draggable="false">`;
      li.addEventListener('click', () => goTo(c * M + i));
      track.appendChild(li);
    });
  }
  const cards = [...track.children];

  let index = M, cw = 260, gap = 72, ax = 0, busy = false;
  function layout() {
    const W = innerWidth;
    if (W > 900) {
      cw = Math.max(220, Math.min(W * 0.2, 300));
      gap = W * 0.05;
      const copy = document.querySelector('.team-copy').getBoundingClientRect();
      ax = Math.max(W * 0.42, copy.right + 48);
    } else {
      cw = Math.min(W * 0.64, 320);
      gap = W * 0.08;
      ax = (W - cw) / 2;
    }
    slider.style.setProperty('--cw', cw + 'px');
    slider.style.setProperty('--gap', gap + 'px');
    slider.style.setProperty('--ax', ax + 'px');
    place(false);
  }
  function place(animate) {
    track.classList.toggle('no-anim', !animate || reduce);
    track.style.transform = `translateX(${ax - index * (cw + gap)}px)`;
    if (!animate) { track.offsetHeight; track.classList.remove('no-anim'); }
  }
  function setActive() {
    const m = ((index % M) + M) % M;
    cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
    infos.forEach((info, i) => {
      const was = info.classList.contains('is-active');
      info.classList.toggle('is-active', i === m);
      info.setAttribute('aria-hidden', i === m ? 'false' : 'true');
      info.querySelectorAll('.socials a').forEach(a => a.tabIndex = i === m ? 0 : -1);
      if (was && i !== m) {
        info.classList.add('is-leaving');
        setTimeout(() => info.classList.remove('is-leaving'), 700);
      }
    });
  }
  function goTo(i) {
    if (i === index || busy) return;
    busy = true;
    index = i;
    setActive();
    place(true);
    setTimeout(() => {
      // Zurück in die mittlere Kopie springen, unsichtbar
      if (index < M || index >= 2 * M) {
        index = ((index % M) + M) % M + M;
        track.classList.add('no-anim');
        cards.forEach((c, k) => c.classList.toggle('is-active', k === index));
        place(false);
      }
      busy = false;
    }, reduce ? 20 : 900);
  }
  const next = () => goTo(index + 1), prev = () => goTo(index - 1);
  slider.querySelector('.next').addEventListener('click', next);
  slider.querySelector('.prev').addEventListener('click', prev);
  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });
  // Wischen
  let sx = null, sy = 0;
  track.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
  addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
  });

  layout();
  setActive();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 80); });
  if (document.fonts) document.fonts.ready.then(layout);
})();

/* ---------- Unterstützer: 3D-Pyramiden ---------- */
(() => {
  const items = [...document.querySelectorAll('.inv')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pyrs = items.map((inv, k) => {
    const c = inv.querySelector('canvas');
    inv.querySelector('.pyr-wrap').style.setProperty('--d', (k * 0.12) + 's');
    return { c, ctx: c.getContext('2d'), color: c.dataset.color, phase: k * 1.3, speed: +inv.dataset.speed || 1 };
  });
  // Tetraeder: Spitze oben, dreieckige Basis
  const V = [[0, -1, 0]];
  for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3; V.push([Math.cos(a) * 0.95, 0.5, Math.sin(a) * 0.95]); }
  const E = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]];
  const F = [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 2, 3]];

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    pyrs.forEach(p => { const r = p.c.getBoundingClientRect(); p.w = r.width; p.c.width = r.width * dpr; p.c.height = r.height * dpr; p.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); });
  }
  let visible = false;
  function draw(now) {
    const t = reduce ? 0 : now / 1000;
    const sc = scrollY * 0.002;
    for (const p of pyrs) {
      const { ctx, w } = p, h = w, s = w * 0.36;
      const yaw = t * 0.5 * Math.sign(p.speed || 1) + p.phase + sc * p.speed, pitch = 0.32 + Math.sin(t * 0.6 + p.phase) * 0.12;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const P = V.map(([x, y, z]) => {
        const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
        const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const f = 3 / (3 + z2);
        return [w / 2 + x1 * s * f, h / 2 + 4 + y1 * s * f, z2];
      });
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = p.color; ctx.globalAlpha = 0.07;
      for (const f of F) { ctx.beginPath(); ctx.moveTo(P[f[0]][0], P[f[0]][1]); ctx.lineTo(P[f[1]][0], P[f[1]][1]); ctx.lineTo(P[f[2]][0], P[f[2]][1]); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle = p.color; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
      for (const [a, b] of E) {
        ctx.globalAlpha = (P[a][2] + P[b][2]) > 0.4 ? 0.35 : 1;   // hintere Kanten schwächer
        ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (visible && !reduce) requestAnimationFrame(draw);
  }
  size(); addEventListener('resize', size);
  const sec = document.querySelector('.investors-sec');
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(draw); }).observe(sec);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  items.forEach(i => io.observe(i));
  requestAnimationFrame(draw);
})();
