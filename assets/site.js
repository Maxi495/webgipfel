/* ---- Header: Glas ab Scroll, ausblenden runter / einblenden hoch ---- */
const header = document.getElementById('header');
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('is-glass', y > 40);
  header.classList.toggle('is-hidden', y > lastY && y > 300 && !document.body.classList.contains('menu-open'));
  lastY = y;
}, { passive: true });

/* ---- Mobiles Menü ---- */
const burger = document.getElementById('burger');
const toggleMenu = open => {
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
};
burger.addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
document.querySelectorAll('#mobile-menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* ---- Login-Fenster „Dein Projekt" ---- */
const login = document.getElementById('login');
const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');
document.querySelectorAll('[data-open-login]').forEach(b => b.addEventListener('click', () => {
  toggleMenu(false);
  loginMsg.textContent = '';
  login.showModal();
  document.getElementById('login-user').focus();
}));
document.querySelectorAll('[data-close-login]').forEach(b => b.addEventListener('click', () => login.close()));
login.addEventListener('click', e => { if (e.target === login) login.close(); });
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!loginForm.username.value.trim() || !loginForm.password.value) {
    loginMsg.textContent = 'Bitte Benutzername und Passwort eingeben.';
    return;
  }
  // Platzhalter: Die echte Anmeldung wird im nächsten Schritt angebunden.
  loginMsg.textContent = 'Der Kundenbereich wird gerade eingerichtet.';
  loginForm.password.value = '';
});

/* ---- FAQ (nach cuberto) ----
   <details> bleibt zugänglich; das Auf- und Zuklappen wird weich animiert:
   beim Öffnen erst open setzen, dann die Klasse; beim Schließen erst die Klasse
   entfernen und open nach der Animation zurücknehmen. */
document.querySelectorAll('.faq__item').forEach(d => {
  const summary = d.querySelector('summary');
  let timer;
  summary.addEventListener('click', e => {
    e.preventDefault();
    clearTimeout(timer);
    if (!d.classList.contains('is-open')) {
      d.open = true;
      void d.offsetHeight;                                  // Layout mit geschlossenem Zustand erzwingen
      d.classList.add('is-open');
    } else {
      d.classList.remove('is-open');
      timer = setTimeout(() => { d.open = false; }, 650);
    }
  });
});

/* Linien und Fragen erscheinen nacheinander, wenn das FAQ ins Bild kommt */
const faqList = document.querySelector('.faq__items');
if (faqList) {
  const parts = [...faqList.children];
  parts.forEach((el, i) => { el.style.transitionDelay = (i * 70) + 'ms'; });
  const fio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { parts.forEach(el => el.classList.add('in')); fio.disconnect(); }
  }), { threshold: .15 });
  fio.observe(faqList);
}

/* Saiten-Linien: biegen sich unter der Maus und federn elastisch zurück */
document.querySelectorAll('.faq__divider').forEach(div => {
  const svg = div.querySelector('svg'), path = svg.querySelector('path');
  let w = 1000, cx = 500, off = 0, vel = 0, target = 0, hovering = false, raf = 0;
  const draw = () => path.setAttribute('d', `M0,100 Q${cx.toFixed(1)},${(100 + off).toFixed(1)} ${w},100`);
  const resize = () => { w = svg.clientWidth || 1000; if (!hovering) cx = w / 2; draw(); };
  const spring = () => {
    vel += (target - off) * .14; vel *= .78; off += vel;
    draw();
    if (hovering || Math.abs(vel) > .05 || Math.abs(target - off) > .05) raf = requestAnimationFrame(spring);
    else { off = target; draw(); raf = 0; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(spring); };
  if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    div.addEventListener('pointermove', e => {
      const r = div.getBoundingClientRect();
      hovering = true; cx = e.clientX - r.left; target = (e.clientY - r.top) * 2.4; kick();
    });
    div.addEventListener('pointerleave', () => { hovering = false; target = 0; kick(); });
  }
  addEventListener('resize', resize);
  resize();
});

/* ---- Schreibmaschine per Scroll: Das Zitat steht fest (Scroll-Pin), und der
   Scrollfortschritt durch den Pin-Bereich bestimmt, wie viele Zeichen sichtbar
   sind. Bei 85 % ist es fertig, der Rest der Strecke hält es kurz stehen.
   Rückwärts scrollen nimmt die Zeichen wieder weg. ---- */
document.querySelectorAll('[data-typewriter]').forEach(el => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pin = el.closest('[data-pin]');
  el.setAttribute('aria-label', el.textContent.trim());
  const chars = [];
  const split = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      for (const c of n.textContent) {
        const span = document.createElement('span');
        span.className = 'ch';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = c;
        frag.appendChild(span);
        chars.push(span);
      }
      n.replaceWith(frag);
    } else if (n.nodeType === 1) split(n);
  });
  split(el);
  let shown = 0;
  const render = n => {
    if (n === shown) return;
    if (n > shown) for (let i = shown; i < n; i++) chars[i].classList.add('on');
    else for (let i = n; i < shown; i++) chars[i].classList.remove('on');
    if (shown > 0) chars[shown - 1].classList.remove('cur');
    if (n > 0) chars[n - 1].classList.add('cur');
    shown = n;
    const done = n === chars.length;
    el.classList.toggle('is-done', done);
    if (pin) pin.classList.toggle('is-done', done);
  };
  if (!pin) { render(chars.length); return; }
  const update = () => {
    const dist = pin.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-pin.getBoundingClientRect().top / (dist * .85), 0), 1);
    render(Math.round(p * chars.length));
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
});

/* ---- Reveal beim Scrollen ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
/* Text in Wörter zerlegen; Inline-Elemente (em, Zeilen-Spans) bleiben erhalten */
document.querySelectorAll('[data-split]').forEach(el => {
  el.style.setProperty('--d', (+el.dataset.splitDelay || 0) + 'ms');
  if (el.dataset.splitStep) el.style.setProperty('--s', el.dataset.splitStep + 'ms');
  let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 1) return walk(n);
    if (n.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
      const w = document.createElement('span'); w.className = 'w';
      const inner = document.createElement('span'); inner.className = 'w__i'; inner.textContent = part;
      inner.style.setProperty('--i', i++);
      w.appendChild(inner); frag.appendChild(w);
    });
    n.replaceWith(frag);
  });
  walk(el);
});
document.querySelectorAll('.reveal, .fade-up, [data-split]').forEach(el => io.observe(el));

/* ---- Cursor ---- */
const cur = document.getElementById('cursor');
if (matchMedia('(pointer: fine)').matches) {
  let x = innerWidth/2, y = innerHeight/2, cx = x, cy = y;
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  addEventListener('mousedown', () => cur.classList.add('-active'));
  addEventListener('mouseup', () => cur.classList.remove('-active'));
  (function loop(){ cx += (x-cx)*.18; cy += (y-cy)*.18; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(loop); })();
  const set = s => { cur.classList.remove('-pointer','-opaque','-hidden'); if (s) cur.classList.add('-'+s); };
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor], a, button, label');
    set(t ? (t.dataset.cursor || 'pointer') : null);
  });
}

/* ---- Parallax: Elemente mit data-parallax="0.1" laufen beim Scrollen langsamer/schneller ---- */
const parallax = [...document.querySelectorAll('[data-parallax]')];
if (parallax.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const tick = () => {
    const vh = innerHeight;
    parallax.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const progress = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${progress * parseFloat(el.dataset.parallax) * -100}%, 0)` + (el.dataset.parallaxScale ? ` scale(${el.dataset.parallaxScale})` : '');
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---- Scroll-Sequenz für Leistungen und Kennzahlen ----
   Runter: Karte wird aktiv (.is-open), sobald ihre Oberkante über 65 % der
   Bildschirmhöhe steigt. Hoch: wieder inaktiv, sobald sie unter 45 % fällt –
   solange sie noch gut sichtbar ist. Je Richtung wird nur geöffnet bzw. nur
   geschlossen, deshalb flackert nichts. Beides läuft nacheinander im selben
   Takt (450 ms): öffnen von oben/links, schließen von unten/rechts. */
const scrollSequence = (items, onOpen) => {
  if (!items.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach(el => el.classList.add('is-open')); return; }
  const want = items.map(() => false);
  let busy = false, lastY = scrollY;
  const step = () => {
    if (busy) return;
    for (let i = items.length - 1; i >= 0; i--) {
      if (!want[i] && items[i].classList.contains('is-open')) {
        items[i].classList.remove('is-open');
        busy = true; setTimeout(() => { busy = false; step(); }, 450); return;
      }
    }
    for (let i = 0; i < items.length; i++) {
      if (want[i] && !items[i].classList.contains('is-open')) {
        items[i].classList.add('is-open');
        if (onOpen) onOpen(items[i]);
        busy = true; setTimeout(() => { busy = false; step(); }, 450); return;
      }
    }
  };
  const update = () => {
    const vh = innerHeight, y = scrollY, down = y >= lastY;
    lastY = y;
    items.forEach((el, i) => {
      const top = el.getBoundingClientRect().top;
      if (down && top < vh * .65) want[i] = true;
      if (!down && top > vh * .45) want[i] = false;
    });
    for (let i = 1; i < want.length; i++) if (!want[i - 1]) want[i] = false;
    step();
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
};

/* Zahlen zählen beim Aktivieren von 0 hoch; ein Projekt-Raster füllt sich mit */
const countUp = card => card.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count, t0 = performance.now(), dur = 1400;
  const cells = [...card.querySelectorAll('.stat__grid i')];
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4), v = Math.round(target * eased);
    el.textContent = v;
    cells.forEach((c, i) => c.classList.toggle('on', i < v));
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = '0';
  requestAnimationFrame(tick);
});

scrollSequence([...document.querySelectorAll('.svc__item')]);
/* ---- Kennzahlen: Scroll-Pin, Kacheln fliegen nacheinander ein ----
   Die Scrollstrecke durch den Pin wird in drei Abschnitte geteilt; im eigenen
   Abschnitt fliegt eine Kachel von unten (leicht gedreht) an ihren Platz. Ist sie
   gelandet, wird sie aktiv (Blau, Icon, Zahl zählt hoch). Bei 85 % sind alle drin,
   danach geht es weiter. Rückwärts fliegen sie wieder hinaus. */
const cardPin = document.querySelector('[data-pin-cards]');
if (cardPin) {
  const slots = [...cardPin.querySelectorAll('.stat-slot')];
  const cards = slots.map(s => s.querySelector('.stat'));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) cards.forEach(c => c.classList.add('is-open'));
  else {
    const update = () => {
      // Start schon, wenn der Bereich zu 10 % von unten im Bild ist – so gibt es
      // beim Übergang vom Zitat keinen leeren Bildschirm.
      const vh = innerHeight, lead = vh * .9, dist = cardPin.offsetHeight - vh;
      const p = Math.min(Math.max((lead - cardPin.getBoundingClientRect().top) / ((dist + lead) * .85), 0), 1);
      slots.forEach((slot, i) => {
        const t = Math.min(Math.max(p * slots.length - i, 0), 1);
        const e = 1 - Math.pow(1 - t, 3);
        // steigt aus der Tiefe: nach hinten gekippt, klein, Maske öffnet von unten nach oben
        slot.style.opacity = Math.min(t * 2.5, 1);
        slot.style.transform = `translate3d(0, ${(1 - e) * 42}vh, 0) rotateX(${(1 - e) * 38}deg) scale(${.86 + e * .14})`;
        slot.style.clipPath = `inset(${((1 - e) * 40).toFixed(1)}% 0 0 0 round 1.2rem)`;
        const card = cards[i];
        if (t >= 1 && !card.classList.contains('is-open')) { card.classList.add('is-open'); countUp(card); }
        if (t < 1 && card.classList.contains('is-open')) { card.classList.remove('is-open'); card.querySelectorAll('.stat__grid i').forEach(c => c.classList.remove('on')); }
      });
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }
}

/* ---- Ablauf: Seilbahn im Scroll-Pin ----
   Die Scrollstrecke ist in 4 Halte- und 3 Fahrtabschnitte geteilt:
   halten (Karte 1) – fahren – halten (Karte 2) – fahren – halten (3) – fahren – Gipfel (4).
   Die Gondel läuft auf dem Seil (gerade Abschnitte zwischen den Stationen),
   Karten poppen beim Halten auf und verschwinden beim Weiterfahren. */
const gp = document.querySelector('[data-gondola]');
if (gp) {
  const svg = gp.querySelector('.gp-svg'), stage = gp.querySelector('.gp__stage'), view = gp.querySelector('.gp__view');
  const gondola = svg.querySelector('#gp-gondola');
  const S = [[170, 752], [620, 592], [1040, 412], [1420, 202]];
  const segLen = S.slice(1).map((p, i) => Math.hypot(p[0] - S[i][0], p[1] - S[i][1]));
  const stops = [0]; segLen.forEach(l => stops.push(stops[stops.length - 1] + l));
  const cards = [...gp.querySelectorAll('.gp-card')], labels = [...svg.querySelectorAll('.gp-label')], rail = [...gp.querySelectorAll('.gp__rail li')];
  const D = .12, T = (1 - 4 * D) / 3;                      // Halten / Fahren (Anteil der Strecke)
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const pointAt = d => {                                    // Punkt auf dem Seil nach Strecke d
    let i = 0; while (i < segLen.length - 1 && d > stops[i + 1]) i++;
    const f = Math.min(Math.max((d - stops[i]) / segLen[i], 0), 1);
    return [S[i][0] + (S[i + 1][0] - S[i][0]) * f, S[i][1] + (S[i + 1][1] - S[i][1]) * f];
  };
  const toStage = (x, y) => {                               // SVG-Koordinate -> Pixel in der Bühne
    const w = stage.clientWidth, h = stage.clientHeight, k = Math.max(w / 1600, h / 900);
    return [(w - 1600 * k) / 2 + x * k, h - (900 - y) * k];
  };
  let current = -1;
  const update = () => {
    // Bühne: mindestens 16:9 breit, Kamera folgt der Gondel
    const vw = view.clientWidth, vh = view.clientHeight, sw = Math.max(vw, vh * 16 / 9);
    stage.style.width = sw + 'px';
    const dist = gp.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-gp.getBoundingClientRect().top / (dist * .92), 0), 1);
    // Abschnitt bestimmen: Halt k liegt bei [k·(D+T), k·(D+T)+D], danach Fahrt zu k+1
    let at = 3, d = stops[3], halting = true;
    for (let k = 0; k < 4; k++) {
      const he = k * (D + T) + D;
      if (p <= he) { at = k; d = stops[k]; halting = true; break; }
      if (k < 3 && p < he + T) { at = k; d = stops[k] + segLen[k] * ease((p - he) / T); halting = false; break; }
    }
    const [gx, gy] = pointAt(d);
    gondola.setAttribute('transform', `translate(${gx.toFixed(1)} ${gy.toFixed(1)})`);
    const [sx] = toStage(gx, gy);
    const pan = Math.min(Math.max(sx - vw * .45, 0), sw - vw);
    stage.style.transform = `translate3d(${-pan}px,0,0)`;
    gp.classList.toggle('is-moving', p > 0.01);
    // erreichte Stationen, aktuelle Karte
    // beim Fahren gilt die zuletzt verlassene Station als erreicht
    labels.forEach((l, i) => { l.classList.toggle('is-reached', i <= at); l.classList.toggle('is-current', halting && i === at); });
    rail.forEach((r, i) => r.classList.toggle('is-active', i === at));
    const show = halting ? at : -1;
    if (show !== current) { cards.forEach((c, i) => c.classList.toggle('is-on', i === show)); current = show; }
    if (show >= 0) {
      const c = cards[show];
      if (innerWidth < 768) {                                 // Handy: volle Breite unten im sichtbaren Ausschnitt
        c.style.width = (vw - 32) + 'px';
        c.style.left = (pan + 16) + 'px';
        c.style.top = (vh - c.offsetHeight - 20) + 'px';
      } else {                                                // Desktop: neben der Station
        c.style.width = '';
        const [cx, cy] = toStage(S[show][0], S[show][1]);
        const cw = c.offsetWidth, ch = c.offsetHeight;
        // rechts unterhalb der Station, über dem Berg; am Gipfel links unten, damit
        // die Karte weder Bergstation noch deren Beschriftung verdeckt
        const k = stage.clientHeight / 900;
        let left = cx + 36, top = cy + (show === 3 ? 260 : 56) * k;
        if (left + cw > pan + vw - 24) left = cx - cw - 36;
        left = Math.min(Math.max(left, pan + 24), pan + vw - cw - 24);
        top = Math.min(Math.max(top, 24), vh - ch - 24);
        c.style.left = left + 'px'; c.style.top = top + 'px';
      }
    }
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

/* ---- Stimmen: Wort-Highlight per Scroll (wie „Unsere Mission“ auf linksderisar.com) ----
   Der Text ist in Wörter zerlegt (13 % Deckkraft). Der Scrollfortschritt durch den
   Pin bestimmt, wie viele Wörter voll sichtbar sind; bei 80 % ist alles gelesen. */
const stmt = document.querySelector('[data-stmt]');
if (stmt) {
  const el = stmt.querySelector('[data-stmt-text]');
  const words = el.textContent.trim().split(/\s+/);
  const esc = w => w.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  el.innerHTML = words.map(w => `<span class="sw">${esc(w)} </span>`).join('');
  const spans = [...el.children];
  let lit = -1;
  const update = () => {
    const dist = stmt.offsetHeight - innerHeight;
    const p = Math.min(Math.max(-stmt.getBoundingClientRect().top / (dist * .8), 0), 1);
    const n = Math.round(p * spans.length);
    if (n === lit) return;
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
    lit = n;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

/* ---- Kontaktformular ----
   FORM_ENDPOINT: Adresse, an die das Formular gesendet wird (z. B. eine Vercel-
   Funktion, die eine E-Mail verschickt). Solange sie leer ist, wird NICHTS
   gesendet und es erscheint ein ehrlicher Hinweis – keine falsche Erfolgsmeldung.
   Vorschau der Erfolgs-Animation: Seite mit ?formdemo aufrufen. */
const FORM_ENDPOINT = '/api/kontakt';
const cf = document.querySelector('[data-contact-form]');
if (cf) {
  const msg = cf.querySelector('.cf__msg'), btn = cf.querySelector('.cf__submit');
  const consent = cf.querySelector('[name="datenschutz"]'), consentErr = cf.querySelector('.cf__err--consent');
  const fields = [...cf.querySelectorAll('.cf__field')];
  const valid = el => el.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) : el.value.trim() !== '';
  const check = f => { const el = f.querySelector('[required]'); if (!el) return true; const ok = valid(el); f.classList.toggle('is-invalid', !ok); return ok; };
  fields.forEach(f => f.querySelector('input, textarea').addEventListener('input', () => { if (f.classList.contains('is-invalid')) check(f); }));
  consent.addEventListener('change', () => consentErr.classList.toggle('is-shown', !consent.checked));
  const demo = new URLSearchParams(location.search).has('formdemo');
  cf.addEventListener('submit', async e => {
    e.preventDefault();
    msg.textContent = '';
    const ok = fields.map(check).every(Boolean) & consent.checked;
    consentErr.classList.toggle('is-shown', !consent.checked);
    if (!ok) { const first = cf.querySelector('.is-invalid input, .is-invalid textarea') || consent; first.focus(); return; }
    if (!FORM_ENDPOINT && !demo) {
      msg.textContent = 'Das Kontaktformular wird gerade freigeschaltet und sendet noch nicht. Bitte versuchen Sie es in Kürze erneut.';
      return;
    }
    btn.classList.add('is-busy');
    try {
      if (FORM_ENDPOINT) {
        const data = Object.fromEntries(new FormData(cf));
        data.thema = [...cf.querySelectorAll('[name="thema"]:checked')].map(c => c.value);
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
      }
      cf.classList.add('is-sent');
    } catch (err) {
      msg.textContent = 'Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal.';
    } finally { btn.classList.remove('is-busy'); }
  });
}

/* Kundenstimmen: Karten ploppen nacheinander auf, danach reagiert der Stapel auf Hover */
const trust = document.querySelector('[data-trust]');
if (trust) {
  trust.querySelectorAll('.tc').forEach((c, i) => c.style.setProperty('--i', i));
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return;
    trust.classList.add('is-in'); o.disconnect();
    setTimeout(() => trust.classList.add('is-done'), 1700);
  }), { threshold: .2 }).observe(trust);
}
