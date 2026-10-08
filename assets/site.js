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

/* ---- Accordion ---- */
document.querySelectorAll('.acc__head').forEach(b => b.addEventListener('click', () => {
  const open = b.parentElement.classList.toggle('is-open');
  b.setAttribute('aria-expanded', open);
}));

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

/* Zahlen zählen beim Aktivieren von 0 hoch */
const countUp = card => card.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count, t0 = performance.now(), dur = 1400;
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * eased);
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
      const dist = cardPin.offsetHeight - innerHeight;
      const p = Math.min(Math.max(-cardPin.getBoundingClientRect().top / (dist * .85), 0), 1);
      slots.forEach((slot, i) => {
        const t = Math.min(Math.max(p * slots.length - i, 0), 1);
        const e = 1 - Math.pow(1 - t, 3);
        slot.style.opacity = Math.min(t * 3, 1);
        slot.style.transform = `translate3d(0, ${(1 - e) * 70}vh, 0) rotate(${(1 - e) * (i % 2 ? -6 : 6)}deg) scale(${.9 + e * .1})`;
        const card = cards[i];
        if (t >= 1 && !card.classList.contains('is-open')) { card.classList.add('is-open'); countUp(card); }
        if (t < 1 && card.classList.contains('is-open')) card.classList.remove('is-open');
      });
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }
}
