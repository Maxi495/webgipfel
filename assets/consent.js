/* ============ Cookie-Einwilligung + Google Analytics 4 ============
   Rechtsrahmen: § 25 TDDDG (Endgeräte-Zugriff nur mit Einwilligung), Art. 6 Abs. 1 lit. a DSGVO,
   Orientierungshilfe der DSK für Telemedien, BGH „Planet49“.
   - Vor der Einwilligung wird Google Analytics NICHT geladen: kein Skript, kein Cookie, keine Anfrage an Google.
   - „Ablehnen“ ist auf der ersten Ebene gleichwertig zu „Akzeptieren“ (gleiche Größe, gleiche Farbe).
   - Nichts ist vorausgewählt; die Auswahl gilt 12 Monate, danach (oder bei neuer Version) wird erneut gefragt.
   - Widerruf jederzeit über „Cookie-Einstellungen“ im Footer; dabei werden die GA-Cookies gelöscht.
   - Gespeichert wird nur die Auswahl selbst (localStorage „wg-consent“) – technisch notwendig, § 25 Abs. 2 Nr. 2 TDDDG. */
(() => {
  const GA_ID = 'G-YQFL0BZYLS';                       // Mess-ID von Google Analytics 4 eintragen, z. B. 'G-ABC123XYZ'
  const VERSION = 1;                      // erhöhen, wenn sich Zwecke oder Anbieter ändern → alle werden neu gefragt
  const MAX_AGE = 365 * 864e5;            // 12 Monate
  const KEY = 'wg-consent';
  const EN = document.documentElement.lang === 'en';
  const base = location.pathname.startsWith('/en/') || EN ? '/en/' : '/';
  const T = EN ? {
    title: 'Privacy settings',
    text: 'With your consent we use Google Analytics to understand how our website is used and to improve it. This sets cookies and transfers data to Google, including to the USA. You can withdraw your consent at any time via “Cookie settings” at the bottom of every page.',
    more: 'Privacy policy', legal: 'Legal notice',
    accept: 'Accept all', reject: 'Reject all', settings: 'Settings', save: 'Save selection', back: 'Back',
    nec: 'Strictly necessary', necOn: 'Always active',
    necText: 'Stores your choice from this banner in your browser (localStorage “wg-consent”, 12 months). No data is sent to us or anyone else.',
    stat: 'Statistics – Google Analytics 4',
    statText: 'Provider: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Purpose: aggregated analysis of how the website is used (pages viewed, time on page, device type, rough location). Cookies: _ga, _ga_* – stored for up to 14 months. Transfer to the USA based on the EU-US Data Privacy Framework. Legal basis: your consent (Art. 6(1)(a) GDPR, § 25(1) TDDDG).',
    on: 'On', off: 'Off', saved: 'Your selection has been saved.'
  } : {
    title: 'Datenschutz-Einstellungen',
    text: 'Mit Ihrer Einwilligung nutzen wir Google Analytics, um zu verstehen, wie unsere Website genutzt wird, und sie zu verbessern. Dabei werden Cookies gesetzt und Daten an Google übertragen, auch in die USA. Ihre Einwilligung können Sie jederzeit über „Cookie-Einstellungen“ unten auf jeder Seite widerrufen.',
    more: 'Datenschutzerklärung', legal: 'Impressum',
    accept: 'Alle akzeptieren', reject: 'Alle ablehnen', settings: 'Einstellungen', save: 'Auswahl speichern', back: 'Zurück',
    nec: 'Notwendig', necOn: 'Immer aktiv',
    necText: 'Speichert Ihre Auswahl aus diesem Banner in Ihrem Browser (localStorage „wg-consent“, 12 Monate). Es werden dabei keine Daten an uns oder Dritte übertragen.',
    stat: 'Statistik – Google Analytics 4',
    statText: 'Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Zweck: zusammengefasste Auswertung, wie die Website genutzt wird (aufgerufene Seiten, Verweildauer, Gerätetyp, ungefährer Standort). Cookies: _ga, _ga_* – Speicherdauer bis zu 14 Monate. Übermittlung in die USA auf Grundlage des EU-US Data Privacy Framework. Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).',
    on: 'An', off: 'Aus', saved: 'Ihre Auswahl wurde gespeichert.'
  };

  const read = () => {
    try {
      const c = JSON.parse(localStorage.getItem(KEY));
      return c && c.v === VERSION && Date.now() - c.t < MAX_AGE ? c : null;
    } catch { return null; }
  };
  const write = stat => { try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, t: Date.now(), stat })); } catch {} };

  /* ---- Google Analytics erst nach Einwilligung laden ---- */
  let gaLoaded = false;
  const loadGA = () => {
    if (gaLoaded || !GA_ID) return; gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { cookie_expires: 60 * 60 * 24 * 425, allow_google_signals: false, allow_ad_personalization_signals: false });
    const s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  };
  const dropGA = () => {
    // GA-Cookies auf allen in Frage kommenden Domains löschen, danach neu laden, damit gtag nicht weiterläuft
    const host = location.hostname, doms = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(n => /^_ga/.test(n))
      .forEach(n => doms.forEach(d => { document.cookie = `${n}=; Max-Age=0; path=/${d ? '; domain=' + d : ''}`; }));
    if (gaLoaded) location.reload();
  };

  /* ---- Banner ---- */
  let box, statInput, shade, lastFocus;
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const build = () => {
    box = el('div', 'cc');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'cc-title'); box.setAttribute('aria-describedby', 'cc-text');
    box.innerHTML = `
      <div class="cc__main">
        <h2 class="cc__title" id="cc-title">${T.title}</h2>
        <p class="cc__text" id="cc-text">${T.text}</p>
        <p class="cc__links"><a href="${base}datenschutz">${T.more}</a><a href="${base}impressum">${T.legal}</a></p>
      </div>
      <div class="cc__details" id="cc-details" hidden>
        <div class="cc__opt">
          <div class="cc__opt-head"><span class="cc__opt-name">${T.nec}</span><span class="cc__always">${T.necOn}</span></div>
          <p class="cc__opt-text">${T.necText}</p>
        </div>
        <div class="cc__opt">
          <label class="cc__opt-head" for="cc-stat"><span class="cc__opt-name">${T.stat}</span>
            <span class="cc__switch"><input type="checkbox" id="cc-stat" role="switch"><span aria-hidden="true"></span></span></label>
          <p class="cc__opt-text">${T.statText}</p>
        </div>
      </div>
      <div class="cc__actions">
        <button type="button" class="cc__btn" data-cc="reject">${T.reject}</button>
        <button type="button" class="cc__btn" data-cc="accept">${T.accept}</button>
        <button type="button" class="cc__link" data-cc="settings" aria-expanded="false" aria-controls="cc-details">${T.settings}</button>
        <button type="button" class="cc__btn cc__btn--save" data-cc="save" hidden>${T.save}</button>
      </div>
      <p class="cc__status" role="status" aria-live="polite"></p>`;
    statInput = box.querySelector('#cc-stat');
    box.addEventListener('click', e => {
      const a = e.target.closest('[data-cc]'); if (!a) return;
      const act = a.dataset.cc;
      if (act === 'accept') decide(true);
      else if (act === 'reject') decide(false);
      else if (act === 'save') decide(statInput.checked);
      else if (act === 'settings') toggleDetails();
    });
    box.addEventListener('keydown', e => {
      if (e.key === 'Escape' && read()) { close(); return; }           // ohne getroffene Wahl schließt Escape nicht
      if (e.key !== 'Tab') return;                                    // Fokus bleibt im Fenster
      const f = [...box.querySelectorAll('a[href], button:not([hidden]), input')].filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // abgedunkelter Hintergrund: das Fenster steht mittig vor der Seite
    shade = el('div', 'cc-shade');
    shade.addEventListener('click', () => { if (read()) close(); });
    document.body.appendChild(shade);
    document.body.appendChild(box);
  };
  const toggleDetails = force => {
    const d = box.querySelector('.cc__details'), b = box.querySelector('[data-cc="settings"]'), s = box.querySelector('[data-cc="save"]');
    const open = force ?? d.hidden;
    d.hidden = !open; s.hidden = !open; b.setAttribute('aria-expanded', String(open)); b.textContent = open ? T.back : T.settings;
    box.classList.toggle('is-detailed', open);
  };
  const open = (detailed = false) => {
    if (!box) build();
    const c = read(); statInput.checked = !!(c && c.stat);
    toggleDetails(detailed);
    box.querySelector('.cc__status').textContent = '';
    lastFocus = document.activeElement;
    box.classList.add('is-open'); shade.classList.add('is-open');
    document.documentElement.classList.add('cc-lock');
    requestAnimationFrame(() => box.querySelector(detailed ? '#cc-stat' : '.cc__btn').focus({ preventScroll: true }));
  };
  const close = () => {
    if (!box) return;
    box.classList.remove('is-open'); shade.classList.remove('is-open');
    document.documentElement.classList.remove('cc-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  const decide = stat => {
    write(stat);
    if (stat) loadGA(); else dropGA();
    box.querySelector('.cc__status').textContent = T.saved;
    close();
  };

  // Footer-Link „Cookie-Einstellungen“ (auf jeder Seite) öffnet die Einstellungen erneut
  document.addEventListener('click', e => { if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); open(true); } });

  const c = read();
  if (c) { if (c.stat) loadGA(); }
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => open()); else open();
})();
