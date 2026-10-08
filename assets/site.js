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

/* ---- Schreibmaschine: Statement tippt los, sobald es ins Bild scrollt ---- */
document.querySelectorAll('[data-typewriter]').forEach(el => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  const type = i => {
    if (i > 0) chars[i - 1].classList.remove('cur');
    if (i >= chars.length) { chars[i - 1].classList.add('cur'); el.classList.add('is-done'); return; }
    chars[i].classList.add('on', 'cur');
    const c = chars[i].textContent;
    const delay = /[.,–]/.test(c) ? 180 : c === ' ' ? 30 : 16 + Math.random() * 20;
    setTimeout(() => type(i + 1), delay);
  };
  const tio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { tio.disconnect(); setTimeout(() => type(0), 250); }
  }), { threshold: .5 });
  tio.observe(el);
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

/* ---- Leistungen: Karten klappen beim Scrollen nacheinander auf und bleiben offen ----
   Jede Karte öffnet erst, wenn sie gut im Bild ist, und immer erst nach der
   vorherigen (mind. 450 ms Abstand) – so sieht man jede einzeln aufgehen,
   auch beim schnellen Scrollen oder Sprung per Menü. */
const svcItems = [...document.querySelectorAll('.svc__item')];
if (svcItems.length) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) svcItems.forEach(el => el.classList.add('is-open'));
  else {
    const ready = new Set();
    let next = 0, busy = false;
    const openNext = () => {
      if (busy || next >= svcItems.length || !ready.has(svcItems[next])) return;
      busy = true;
      svcItems[next++].classList.add('is-open');
      setTimeout(() => { busy = false; openNext(); }, 450);
    };
    const svcIO = new IntersectionObserver(es => es.forEach(e => {
      // im Bild – oder schon nach oben weggescrollt: dann ebenfalls (nacheinander) öffnen
      if (e.isIntersecting || e.boundingClientRect.top < 0) { ready.add(e.target); svcIO.unobserve(e.target); openNext(); }
    }), { rootMargin: '0px 0px -30% 0px', threshold: .6 });
    svcItems.forEach(el => svcIO.observe(el));
  }
}
