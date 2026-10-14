/* Isarwave – gemeinsame Seitenlogik: Intro, Navigation, Text-Animation,
   Scroll-Effekte und Kontakt-Popup. Läuft nach i18n.js. */
const T = (key, de) => (window.IW_T ? window.IW_T(key, de) : de);

/* ---------- Intro-Text ---------- */
const markLoaded = () => document.body.classList.add('loaded');
requestAnimationFrame(() => requestAnimationFrame(markLoaded));
setTimeout(markLoaded, 300); // Fallback, falls der Tab im Hintergrund lädt

/* ---------- Nav: Hintergrund beim Scrollen ---------- */
(() => {
  const nav = document.getElementById('nav');
  const on = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', on, { passive: true }); on();
})();

/* ---------- Scroll-Parallaxe (wie „scrub“ im Original) ---------- */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = [...document.querySelectorAll('[data-parallax]')];
  const invs = [...document.querySelectorAll('.inv[data-speed]')];
  const photos = [...document.querySelectorAll('.photo img')];
  const bars = [...document.querySelectorAll('[data-progress]')];
  let ticking = false;
  function update() {
    ticking = false;
    const H = innerHeight, W = innerWidth;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (H - r.top) / (H + r.height)));
      el.style.translate = `0 ${(+el.dataset.parallax) * W / 100 * (1 - p)}px`;
    });
    invs.forEach(el => {
      const r = el.getBoundingClientRect();
      const d = (r.top + r.height / 2 - H / 2) / H;
      el.style.translate = `0 ${-d * 60 * (+el.dataset.speed)}px`;
    });
    // Bild bewegt sich langsamer als sein Rahmen
    photos.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) return;
      const d = (r.top + r.height / 2 - H / 2) / H;
      img.style.translate = `0 ${d * -6}%`;
    });
    // Linie füllt sich beim Durchscrollen, Schritte leuchten nacheinander auf
    bars.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (H * 0.8 - r.top) / (H * 0.55)));
      el.style.setProperty('--p', p.toFixed(3));
      const items = el.children;
      [...items].forEach((li, i) => li.classList.toggle('on', p >= i / Math.max(1, items.length - 1) - 0.001 && p > 0.02));
    });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
})();

/* ---------- Mobile-Menü ---------- */
(() => {
  const nav = document.getElementById('nav');
  const btn = nav.querySelector('.menu-toggle');
  // Alles außerhalb der Navigation, das bei offenem Menü gesperrt wird
  const outside = () => [...document.body.children].filter(el => el !== nav && el.tagName !== 'SCRIPT' && !el.classList.contains('modal'));
  const set = (open) => {
    if (open === nav.classList.contains('open')) return;
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? T('a11y.menuClose', 'Menü schließen') : T('a11y.menuOpen', 'Menü öffnen'));
    document.body.style.overflow = open ? 'hidden' : '';
    outside().forEach(el => { el.inert = open; });
    if (open) { const first = nav.querySelector('.mobile-menu a'); if (first) first.focus(); }
    else btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  // Fokus im offenen Menü halten (Logo, Button, Menülinks)
  nav.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
    const f = [...nav.querySelectorAll('a[href], button')].filter(x => x.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Beim Wechsel auf Desktop-Breite Menü schließen
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) set(false); });
  nav.querySelectorAll('.mobile-menu a, .mobile-menu [data-contact]').forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) set(false); });
})();

/* ---------- Zeilenweise Text-Animation ----------
   Jedes Wort bekommt eine eigene Maske; alle Wörter einer Zeile teilen
   sich denselben Index. So gleitet Zeile für Zeile nach oben, und der
   Umbruch darf sich bei jeder Fensterbreite ändern. */
(() => {
  const SEL = '[data-split], .reveal h2, .reveal .display, .reveal .body, .reveal .label, .feature h3, .feature p';
  const els = [...new Set(document.querySelectorAll(SEL))];

  function wrapWords(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
          const outer = document.createElement('span'); outer.className = 'w';
          const inner = document.createElement('span'); inner.textContent = part;
          outer.appendChild(inner); frag.appendChild(outer);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && !child.classList.contains('w')) {
        wrapWords(child);
      }
    }
  }

  function indexLines(el) {
    let top = null, li = -1, left = 0;
    el.querySelectorAll('.w').forEach(w => {
      const t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 4) { li++; top = t; left = w.offsetLeft; }
      w.firstChild.style.setProperty('--li', li);
      // Jedes Wort dreht um den Zeilenanfang, damit sich die Zeile als Ganzes aufrichtet
      w.firstChild.style.setProperty('--ox', (left - w.offsetLeft) + 'px');
    });
  }

  els.forEach(el => {
    wrapWords(el);
    if (el.dataset.delay) el.style.setProperty('--base', el.dataset.delay + 's');
    if (el.dataset.step) el.style.setProperty('--step', el.dataset.step + 's');
    // Wie im Original: Überschriften gleiten gerade hoch, alles andere aus 7° Schräglage
    const flat = el.matches('h1, h2, .display, .team-title') && !el.hasAttribute('data-rot');
    el.style.setProperty('--rot', flat ? '0deg' : '7deg');
    // Elternteile nicht zusätzlich einblenden, sonst doppelt animiert
    const rev = el.closest('.reveal');
    if (rev) { let c = el; while (c.parentElement && c.parentElement !== rev) c = c.parentElement; c.classList.add('nofade'); }
    // Absätze nach der Überschrift etwas später starten
    if (!el.dataset.delay && el.matches('.body, p') && !el.matches('.label')) el.style.setProperty('--base', '.18s');
  });

  const reindex = () => els.forEach(indexLines);
  reindex();
  if (document.fonts) document.fonts.ready.then(reindex);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(reindex, 120); });

  const show = el => el.classList.add('split-in');
  if (!('IntersectionObserver' in window)) { els.forEach(show); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  // Hero erst nach dem Laden starten, damit es mit dem Partikel-Intro zusammenfällt
  const atTop = el => el.closest('.hero, .article-head');
  els.forEach(el => atTop(el) ? null : io.observe(el));
  const heroEls = els.filter(atTop);
  const startHero = () => heroEls.forEach(show);
  requestAnimationFrame(() => requestAnimationFrame(startHero));
  setTimeout(startHero, 300);
})();

/* ---------- Text-Einblendung beim Scrollen ---------- */
(() => {
  const els = document.querySelectorAll('.reveal, .photo');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  els.forEach(el => io.observe(el));
})();

/* ---------- Sanftes Scrollen für Ankerlinks ---------- */
document.querySelectorAll('a[href^="#"]:not([data-contact])').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  const el = id.length > 1 && document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  // Fokus mitnehmen (z. B. Sprunglink → Hauptinhalt), damit Tastatur-Nutzer dort weitermachen
  if (!el.hasAttribute('tabindex') && !el.matches('a, button, input, select, textarea')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}));

/* ---------- Kontakt-Popup ----------
   Alle Elemente mit data-contact="pilot|research|general" öffnen dasselbe
   Formular, jeweils mit passendem Titel, Text und vorausgewählter Rolle.
   Versand: Ist am Formular data-endpoint gesetzt, wird per POST (JSON)
   dorthin gesendet. Ohne Endpoint wird nur die Bestätigung gezeigt. */
(() => {
  const TOPICS = {
    pilot: {
      title: T('form.pilot.title', 'Pilotpartner werden'),
      intro: T('form.pilot.intro', 'Wir suchen neurologische Kliniken und Praxen, die das Isarwave Band in der Pilotphase einsetzen und uns ehrlich sagen, was fehlt. Sie hören innerhalb von zwei Werktagen von uns.'),
      role: 'clinic',
      msg: T('form.pilot.msg', 'Zum Beispiel: Wie viele Langzeit-EEGs führen Sie im Monat durch?'),
      thanks: T('form.pilot.thanks', 'Elif Demir aus unserem Clinical-Research-Team meldet sich innerhalb von zwei Werktagen bei Ihnen.'),
    },
    research: {
      title: T('form.research.title', 'Forschungszugang anfragen'),
      intro: T('form.research.intro', 'Für Forschungsgruppen stellen wir pseudonymisierte Rohdaten in EDF+ und BIDS bereit, auf Grundlage einer Datennutzungsvereinbarung. Erzählen Sie uns kurz von Ihrem Vorhaben.'),
      role: 'research',
      msg: T('form.research.msg', 'Fragestellung, benötigte Daten, geplanter Zeitraum'),
      thanks: T('form.research.thanks', 'Dr. Sophie Lindner meldet sich innerhalb von zwei Werktagen, um die nächsten Schritte zu besprechen.'),
    },
    general: {
      title: T('form.general.title', 'Schreiben Sie uns.'),
      intro: T('form.general.intro', 'Fragen zu Isarwave, Presseanfragen oder eine Idee für eine Zusammenarbeit: Wir lesen jede Nachricht.'),
      role: '',
      msg: T('form.general.msg', 'Ihre Nachricht'),
      thanks: T('form.general.thanks', 'Wir melden uns innerhalb von zwei Werktagen bei Ihnen.'),
    },
  };
  const ROLES = [
    ['clinic', T('form.role.clinic', 'Neurolog:in in einer Klinik')],
    ['practice', T('form.role.practice', 'Neurolog:in in einer Praxis')],
    ['research', T('form.role.research', 'Forschung')],
    ['press', T('form.role.press', 'Investor:in oder Presse')],
    ['other', T('form.role.other', 'Sonstiges')],
  ];
  const i = n => `style="--i:${n}"`;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');
  modal.innerHTML = `
    <button class="modal-close" type="button" aria-label="${T('form.close', 'Schließen')}">
      <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 2l14 14M16 2 2 16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
    </button>
    <div class="modal-panel">
      <div class="form-wrap">
        <p class="label m-item" ${i(0)}>${T('form.label', 'Kontakt')}</p>
        <h2 class="modal-title m-item" id="modal-title" ${i(1)}></h2>
        <p class="modal-intro m-item" ${i(2)}></p>
        <form class="form" novalidate>
          <div class="field m-item" ${i(3)}>
            <label for="f-name">${T('form.name', 'Name')}</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required>
            <span class="err">${T('form.err.required', 'Bitte ausfüllen.')}</span>
          </div>
          <div class="field m-item" ${i(4)}>
            <label for="f-mail">${T('form.email', 'E-Mail (dienstlich)')}</label>
            <input id="f-mail" name="email" type="email" autocomplete="email" required>
            <span class="err">${T('form.err.email', 'Bitte eine gültige E-Mail-Adresse angeben.')}</span>
          </div>
          <div class="field m-item" ${i(5)}>
            <label for="f-org">${T('form.org', 'Einrichtung')}</label>
            <input id="f-org" name="organisation" type="text" autocomplete="organization" placeholder="${T('form.org.ph', 'Klinik, Praxis oder Institut')}" required>
            <span class="err">${T('form.err.required', 'Bitte ausfüllen.')}</span>
          </div>
          <div class="field m-item" ${i(6)}>
            <label for="f-role">${T('form.role', 'Ich bin')}</label>
            <select id="f-role" name="role" required>
              <option value="" disabled>${T('form.role.ph', 'Bitte wählen')}</option>
              ${ROLES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}
            </select>
            <span class="err">${T('form.err.select', 'Bitte auswählen.')}</span>
          </div>
          <div class="field full m-item" ${i(7)}>
            <label for="f-msg">${T('form.msg', 'Nachricht')} <span style="text-transform:none;letter-spacing:0;font-weight:400">${T('form.optional', '(optional)')}</span></label>
            <textarea id="f-msg" name="message" rows="3"></textarea>
          </div>
          <label class="consent m-item" ${i(8)}>
            <input type="checkbox" name="consent" required>
            <span>${T('form.consent', 'Ich bin einverstanden, dass Isarwave meine Angaben zur Bearbeitung der Anfrage speichert. Mehr dazu in der <a href="#datenschutz">Datenschutzerklärung</a>.')}</span>
          </label>
          <input type="hidden" name="topic">
          <div class="form-foot m-item" ${i(9)}>
            <p class="form-note">${T('form.note', 'Ihre Angaben bleiben bei uns und werden nicht an Dritte weitergegeben.')}</p>
            <button class="btn" type="submit">${T('form.send', 'Anfrage senden')}</button>
          </div>
        </form>
      </div>
      <div class="success" aria-live="polite">
        <div class="ok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <h2 class="modal-title">${T('form.thanks.title', 'Danke. Ihre Anfrage ist bei uns.')}</h2>
        <p class="modal-intro success-text"></p>
        <button class="btn" type="button" data-close>${T('form.close', 'Schließen')}</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const form = modal.querySelector('form');
  // Fehlertexte per aria-describedby an ihr Feld hängen, damit Screenreader sie vorlesen
  form.querySelectorAll('.field').forEach(f => {
    const c = f.querySelector('input, select, textarea'), err = f.querySelector('.err');
    if (c && err) { err.id = c.id + '-err'; c.setAttribute('aria-describedby', err.id); }
  });
  const submit = form.querySelector('[type=submit]');
  let lastFocus = null, topic = TOPICS.pilot;

  function open(key, trigger) {
    topic = TOPICS[key] || TOPICS.general;
    lastFocus = trigger || document.activeElement;
    modal.classList.remove('sent');
    modal.querySelector('#modal-title').textContent = topic.title;
    modal.querySelector('.modal-intro').textContent = topic.intro;
    modal.querySelector('.success-text').textContent = topic.thanks;
    form.reset();
    form.querySelectorAll('.invalid').forEach(f => f.classList.remove('invalid'));
    form.elements.role.value = topic.role;
    form.elements.topic.value = key;
    form.elements.message.placeholder = topic.msg;
    submit.disabled = false; submit.textContent = T('form.send', 'Anfrage senden');
    document.documentElement.classList.add('modal-lock');
    modal.scrollTop = 0;
    modal.classList.add('open');
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), 350);
  }
  function close() {
    modal.classList.remove('open');
    document.documentElement.classList.remove('modal-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-contact]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    open(el.dataset.contact, el);
  }));
  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.querySelector('[data-close]').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  modal.querySelector('.consent a').addEventListener('click', close);
  addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    // Fokus im Popup halten
    if (e.key === 'Tab') {
      const f = [...modal.querySelectorAll('button, input, select, textarea, a[href]')].filter(x => x.offsetParent !== null && !x.disabled);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const validate = () => {
    let ok = true;
    form.querySelectorAll('.field').forEach(f => {
      const c = f.querySelector('input, select, textarea');
      const bad = c.required && (!c.value.trim() || (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value.trim())));
      f.classList.toggle('invalid', bad);
      c.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && ok) { c.focus(); ok = false; }
    });
    const consent = form.querySelector('.consent');
    const noConsent = !form.elements.consent.checked;
    consent.classList.toggle('invalid', noConsent);
    form.elements.consent.setAttribute('aria-invalid', noConsent ? 'true' : 'false');
    if (noConsent && ok) { form.elements.consent.focus(); ok = false; }
    return ok;
  };
  const clear = e => { const f = e.target.closest('.field, .consent'); if (f) { f.classList.remove('invalid'); e.target.removeAttribute('aria-invalid'); } };
  form.addEventListener('input', clear);
  form.addEventListener('change', clear);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;
    submit.disabled = true; submit.textContent = T('form.sending', 'Wird gesendet …');
    const data = Object.fromEntries(new FormData(form));
    data.consent = true; data.lang = document.documentElement.lang; data.page = location.pathname;
    try {
      const endpoint = form.dataset.endpoint || document.body.dataset.formEndpoint;
      if (endpoint) {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
      } else {
        await new Promise(r => setTimeout(r, 900));
      }
      modal.classList.add('sent');
      modal.scrollTop = 0;
      modal.querySelector('[data-close]').focus({ preventScroll: true });
    } catch (err) {
      submit.disabled = false;
      submit.textContent = T('form.retry', 'Erneut senden');
      alert(T('form.err.send', 'Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie an pilot@isarwave.de.'));
    }
  });
})();
