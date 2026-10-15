/* Preise – Zahlweise-Schalter mit zählenden Preisen, Preisrechner, FAQ-Akkordeon. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var YEAR = 0.9;
  var period = 'm';

  var fmt = function (n, dec) { return n.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
  var round2 = function (n) { return Math.round(n * 100) / 100; };
  var decOf = function (n) { return Math.abs(n % 1) > 0.001 ? 2 : 0; };
  var money = function (n) { return fmt(n, decOf(n)) + ' €'; };

  /* ---------- Zahlweise ---------- */
  var bill = $('[data-bill]');
  var thumb = bill && $('.bill__thumb', bill);
  var opts = bill ? $$('button', bill) : [];

  function placeThumb() {
    var on = opts.filter(function (b) { return b.getAttribute('aria-checked') === 'true'; })[0];
    if (!on || !thumb) return;
    thumb.style.width = on.offsetWidth + 'px';
    thumb.style.transform = 'translateX(' + (on.offsetLeft - 4) + 'px)';
  }

  function setPrice(el, to) {
    var dec = decOf(to);
    if (!window.gsap || reduce) { el.textContent = fmt(to, dec); el._v = to; return; }
    var o = { v: el._v != null ? el._v : parseFloat(el.getAttribute('data-m')) };
    gsap.killTweensOf(el._o || {});
    el._o = o;
    gsap.to(o, { v: to, duration: 0.7, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v, dec); el._v = o.v; }, onComplete: function () { el._v = to; el.textContent = fmt(to, dec); } });
  }

  function notesFor(el, m) {
    if (period === 'm') return m === 390 ? 'inkl. Lohn für 10 Personen, jede weitere +12 €' : 'Monatlich zahlbar, monatlich kündbar';
    var y = round2(m * 12 * YEAR), save = round2(m * 12 - y);
    return (m === 390 ? 'ab ' : '') + money(y) + ' im Jahr – du sparst ' + money(save);
  }

  function setPeriod(p) {
    if (p === period) return;
    period = p;
    opts.forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-period') === p ? 'true' : 'false'); });
    placeThumb();
    $$('[data-price]').forEach(function (el) {
      var m = parseFloat(el.getAttribute('data-m'));
      setPrice(el, p === 'y' ? round2(m * YEAR) : m);
    });
    $$('[data-note]').forEach(function (el) {
      var m = parseFloat(el.getAttribute('data-m'));
      el.classList.add('is-swap');
      setTimeout(function () { el.textContent = notesFor(el, m); el.classList.remove('is-swap'); }, 200);
    });
    calc();
  }

  if (bill) {
    opts.forEach(function (b) { b.addEventListener('click', function () { setPeriod(b.getAttribute('data-period')); }); });
    bill.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var next = period === 'm' ? 'y' : 'm';
      setPeriod(next);
      opts.filter(function (b) { return b.getAttribute('data-period') === next; })[0].focus();
    });
    placeThumb();
    window.addEventListener('resize', placeThumb);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeThumb);
  }

  /* ---------- Preisrechner ---------- */
  var form = $('[data-calc]');
  var inMa = form && $('[data-in="ma"]', form), inBe = form && $('[data-in="be"]', form);
  var res = {};
  if (form) $$('[data-res]', form).forEach(function (el) { res[el.getAttribute('data-res')] = el; });
  var lastPlan = '';

  function suggest(ma, be) {
    if (ma > 50) return { id: 'plus', name: 'Kontor Plus, individuell', price: null,
      why: 'Über 50 Mitarbeitende rechnen wir gern ein eigenes Angebot – mit Lohn, Quartalsgespräch und allem, was dein Betrieb braucht.' };
    if (ma === 0 && be <= 100) return { id: 'solo', name: 'Kontor Solo', price: 39,
      why: 'Allein unterwegs und überschaubar viele Belege: App, Rechnungen und Rücklage reichen dir völlig. Die Steuererklärung kannst du zubuchen.' };
    if (ma <= 10 && be <= 500) return { id: 'werkstatt', name: 'Kontor Werkstatt', price: 149,
      why: ma === 0
        ? 'Bei so vielen Belegen lohnt es sich, wenn wir die Buchhaltung und den Abschluss übernehmen.'
        : 'Laufende Buchhaltung, Umsatzsteuer und Abschluss macht die Kanzlei. Lohn gibt’s hier ab Frühjahr 2027 – bis dahin bleibt dein Lohnbüro.' };
    var extra = Math.max(0, ma - 10) * 12;
    return { id: 'plus', name: 'Kontor Plus', price: 390 + extra,
      why: ma > 10
        ? '390 € mit Lohn für 10 Personen, dazu ' + (ma - 10) + ' × 12 € für alle weiteren. Inklusive Quartalsgespräch mit deinem Berater.'
        : 'Ab 500 Belegen im Monat brauchst du Plus – ohne Obergrenze, mit Lohn für bis zu 10 Personen und Quartalsgespräch.' };
  }

  function fill(input) {
    var p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty('--p', p + '%');
  }

  function calc() {
    if (!form) return;
    var ma = +inMa.value, be = +inBe.value;
    fill(inMa); fill(inBe);
    $('[data-out="ma"]', form).textContent = ma > 50 ? '50+' : ma;
    $('[data-out="be"]', form).textContent = be >= 1000 ? '1.000+' : fmt(be, 0);
    var s = suggest(ma, be);
    res.name.textContent = s.name;
    res.why.textContent = s.why;
    res.link.setAttribute('href', s.price === null ? 'kontakt.html' : '#' + s.id);
    res.link.firstChild.textContent = s.price === null ? 'Angebot anfragen ' : 'Zum Paket ';
    if (s.price === null) {
      res.price.textContent = 'Auf Anfrage';
      res.per.textContent = 'nach dem Erstgespräch';
      res.year.textContent = '';
    } else {
      var shown = period === 'y' ? round2(s.price * YEAR) : s.price;
      res.price.textContent = money(shown);
      res.per.textContent = 'im Monat zzgl. USt.';
      res.year.textContent = period === 'y'
        ? 'jährlich ' + money(round2(shown * 12)) + ', statt ' + money(s.price * 12)
        : 'bei Jahreszahlung ' + money(round2(s.price * YEAR)) + ' im Monat';
    }
    if (s.name !== lastPlan) {
      var box = res.name.closest('.calc__result');
      box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump');
      lastPlan = s.name;
    }
  }
  if (form) {
    [inMa, inBe].forEach(function (i) { i.addEventListener('input', calc); });
    calc();
  }

  /* ---------- FAQ ---------- */
  $$('[data-faq] .qa').forEach(function (qa) {
    var btn = $('.qa__q', qa);
    btn.addEventListener('click', function () {
      var open = !qa.classList.contains('is-open');
      qa.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  /* erste Frage offen, damit man das Muster sieht */
  var first = $('[data-faq] .qa');
  if (first) { first.classList.add('is-open'); $('.qa__q', first).setAttribute('aria-expanded', 'true'); }

  /* Höhe der FAQ ändert Seitenlänge → ScrollTrigger nachziehen */
  var faq = $('[data-faq]');
  if (faq && window.ScrollTrigger) faq.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'grid-template-rows') ScrollTrigger.refresh();
  });
})();
