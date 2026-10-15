/* Kontorhaus – Ratgeber: Suche + Filter (FLIP), Newsletter, Lesefortschritt, Inhaltsverzeichnis, Rücklage-Rechner.
   Jede Funktion prüft, ob ihr Markup existiert – die Datei läuft auf ratgeber.html und ratgeber-ruecklage.html. */
(function () {
  var KH = window.KH || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hasGsap = !!window.gsap;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anim = hasGsap && !reduce;
  var fmt = function (n) { return Math.round(n).toLocaleString('de-DE'); };

  /* Platzhalter-Links (Artikel/Reels, die es noch nicht gibt) springen nicht nach oben */
  $$('a[data-soon]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

  /* ================= Übersicht: Suche + Filter ================= */
  function initFilter() {
    var grid = $('[data-posts]'), pills = $('[data-pills]');
    if (!grid || !pills) return;
    var items = $$('[data-post]');
    var input = $('#rg-q'), form = $('[data-search]'), count = $('[data-count]'), empty = $('[data-empty]');
    var state = { cat: 'alle', q: '' }, busy = false, queued = false;
    var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss'); };

    items.forEach(function (el) {
      var pill = pills.querySelector('[data-cat="' + el.getAttribute('data-cat') + '"]');
      el._hay = norm([
        ($('[data-title]', el) || {}).textContent, ($('[data-teaser]', el) || {}).textContent,
        ($('[data-author]', el) || {}).textContent, pill ? pill.textContent : ''
      ].join(' '));
    });
    /* Anzahl je Kategorie an die Pillen schreiben */
    $$('.pill', pills).forEach(function (p) {
      var c = p.getAttribute('data-cat');
      var n = c === 'alle' ? items.length : items.filter(function (el) { return el.getAttribute('data-cat') === c; }).length;
      p.insertAdjacentHTML('beforeend', '<sup>' + n + '</sup>');
    });

    /* Erstes Einblenden des Rasters (einmalig, damit es sich nicht mit dem Filter beißt) */
    var posts = $$('.post', grid);
    if (anim) {
      gsap.set(posts, { opacity: 0, y: 60 });
      ScrollTrigger.batch(posts, {
        start: 'top bottom-=80', once: true,
        onEnter: function (b) { b = b.filter(function (el) { return !el._rev; }); b.forEach(function (el) { el._rev = true; }); gsap.to(b, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }); }
      });
    }

    function matches(el) {
      var catOk = state.cat === 'alle' || el.getAttribute('data-cat') === state.cat;
      if (!catOk) return false;
      if (!state.q) return true;
      return state.q.split(/\s+/).every(function (w) { return el._hay.indexOf(w) > -1; });
    }

    function updateMeta(n) {
      var label = n === 1 ? '1 Artikel' : n + ' Artikel';
      if (state.q) label += ' zu „' + input.value.trim() + '“';
      count.textContent = label;
      empty.classList.toggle('is-on', n === 0);
    }

    function apply() {
      if (busy) { queued = true; return; }
      var show = items.filter(matches);
      var leaving = items.filter(function (el) { return !el.classList.contains('is-hidden') && show.indexOf(el) < 0; });
      var entering = show.filter(function (el) { return el.classList.contains('is-hidden'); });
      var staying = show.filter(function (el) { return entering.indexOf(el) < 0; });
      updateMeta(show.length);
      if (!anim) {
        items.forEach(function (el) { el.classList.toggle('is-hidden', show.indexOf(el) < 0); });
        return;
      }
      /* Noch nicht eingeblendete Karten sofort zeigen */
      items.forEach(function (el) { if (el.classList.contains('post') && !el._rev) { el._rev = true; gsap.set(el, { opacity: 1, y: 0 }); } });
      busy = true;
      var first = new Map();
      staying.forEach(function (el) { first.set(el, el.getBoundingClientRect()); });

      var layout = function () {
        leaving.forEach(function (el) { el.classList.add('is-hidden'); gsap.set(el, { clearProps: 'opacity,scale,transform' }); });
        entering.forEach(function (el) { el.classList.remove('is-hidden'); });
        staying.forEach(function (el) {
          var a = first.get(el), b = el.getBoundingClientRect();
          var dx = a.left - b.left, dy = a.top - b.top;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' });
        });
        if (entering.length) gsap.fromTo(entering, { opacity: 0, scale: 0.94, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06, delay: 0.12, clearProps: 'transform' });
        ScrollTrigger.refresh();
        setTimeout(function () { busy = false; if (queued) { queued = false; apply(); } }, 200);
      };
      /* Layout per Timer statt onComplete – läuft auch, wenn rAF gedrosselt ist (Hintergrund-Tab) */
      if (leaving.length) { gsap.to(leaving, { opacity: 0, scale: 0.94, duration: 0.2, ease: 'power2.in', overwrite: true }); setTimeout(layout, 210); }
      else layout();
    }

    pills.addEventListener('click', function (e) {
      var b = e.target.closest('.pill'); if (!b) return;
      state.cat = b.getAttribute('data-cat');
      $$('.pill', pills).forEach(function (p) { var on = p === b; p.classList.toggle('is-active', on); p.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      apply();
    });
    var t;
    input.addEventListener('input', function () {
      form.classList.toggle('has-value', !!input.value);
      clearTimeout(t);
      t = setTimeout(function () { state.q = norm(input.value.trim()); apply(); }, 160);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var s = $('#artikel'); if (s) window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' }); }
      if (e.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); }
    });
    $('[data-clear]').addEventListener('click', function () { input.value = ''; input.dispatchEvent(new Event('input')); input.focus(); });
    $('[data-reset]').addEventListener('click', function () {
      input.value = ''; form.classList.remove('has-value'); state.q = '';
      pills.querySelector('[data-cat="alle"]').click();
    });
  }

  /* ================= Newsletter (nur Erfolgszustand, kein Versand) ================= */
  function initLetter() {
    var box = $('[data-letter]'), form = $('[data-letter-form]');
    if (!box || !form) return;
    var input = $('input', form), err = $('[data-letter-err]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { err.textContent = 'Da fehlt noch was – bitte prüf deine E-Mail-Adresse.'; input.focus(); return; }
      err.textContent = '';
      box.classList.add('is-done');
      if (anim) {
        var ok = $('.letter__ok', form);
        gsap.fromTo(ok, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo($('.tick', ok), { scale: 0.4 }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', delay: 0.1 });
      }
    });
    input.addEventListener('input', function () { err.textContent = ''; });
  }

  /* ================= Artikel: Lesefortschritt ================= */
  function initProgress() {
    var bar = $('[data-progress]'), art = $('[data-article]');
    if (!bar || !art) return;
    if (hasGsap && window.ScrollTrigger) {
      gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: art, start: 'top 70%', end: 'bottom bottom', scrub: reduce ? true : 0.3 } });
    }
  }

  /* ================= Artikel: Inhaltsverzeichnis ================= */
  function initToc() {
    var toc = $('[data-toc]'); if (!toc) return;
    var links = $$('a', toc), ind = $('[data-toc-ind]', toc);
    var heads = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var current = -1;
    var setActive = function (i) {
      if (i === current) return; current = i;
      links.forEach(function (a, j) { a.classList.toggle('is-active', j === i); if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      if (i < 0) { ind.style.height = '0px'; return; }
      var a = links[i], li = a.parentNode;
      ind.style.transform = 'translateY(' + li.offsetTop + 'px)';
      ind.style.height = li.offsetHeight + 'px';
    };
    var pick = function () {
      var line = window.innerHeight * 0.35, idx = -1;
      heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top < line) idx = i; });
      setActive(idx);
    };
    if (window.ScrollTrigger) {
      heads.forEach(function (h) { if (h) ScrollTrigger.create({ trigger: h, start: 'top 35%', onToggle: pick }); });
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(pick); }, { passive: true });
    pick();

    /* Weiches Springen für beide Verzeichnisse */
    $$('.toc a, .toc-m a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
        e.preventDefault();
        var d = a.closest('details'); if (d) d.open = false;
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 96, behavior: reduce ? 'auto' : 'smooth' });
        history.replaceState(null, '', '#' + t.id);
      });
    });

    var copy = $('[data-copy]', toc);
    if (copy) copy.addEventListener('click', function () {
      var label = $('span', copy), done = function () { label.textContent = 'Link kopiert'; setTimeout(function () { label.textContent = 'Link kopieren'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href.split('#')[0]).then(done, done); else done();
    });
  }

  /* ================= Artikel: Rücklage-Rechner (Faustformel) ================= */
  /* Einkommensteuer-Grundtarif 2026 (§ 32a EStG) */
  function est2026(zvE) {
    var x = Math.floor(Math.max(0, zvE)), y, z;
    if (x <= 12348) return 0;
    if (x <= 17799) { y = (x - 12348) / 10000; return (914.51 * y + 1400) * y; }
    if (x <= 69878) { z = (x - 17799) / 10000; return (173.10 * z + 2397) * z + 1034.87; }
    if (x <= 277825) return 0.42 * x - 11135.63;
    return 0.45 * x - 19470.38;
  }

  function initCalc() {
    var box = $('[data-calc]'); if (!box) return;
    var vals = { gewinn: 4000, umsatz: 10000, ust: true };
    var out = {}; $$('[data-out]', box).forEach(function (el) { out[el.getAttribute('data-out')] = el; });
    var bars = {}; $$('[data-bar]', box).forEach(function (el) { bars[el.getAttribute('data-bar')] = el; });
    var shown = { total: 0, ust: 0, est: 0, netto: 0, tip: 0 };
    var hint = $('[data-ust-hint]', box), seg = $('[data-seg]', box), thumb = $('.seg__thumb', seg);

    var paintRange = function (r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); };

    function compute() {
      var G = vals.gewinn, U = Math.max(vals.umsatz, 0);
      var kosten = Math.max(0, U - G);
      var ust = vals.ust ? Math.max(0, 0.19 * U - 0.19 * kosten * 0.5) : 0;
      var est = est2026(G * 12 * 0.85) / 12;
      var total = ust + est;
      return { ust: ust, est: est, total: total, netto: Math.max(0, G - est), tip: Math.ceil(total * 1.1 / 50) * 50, share: U > 0 ? total / U : 0, U: U };
    }

    function render(instant) {
      var r = compute();
      var to = { total: Math.round(r.total / 10) * 10, ust: Math.round(r.ust / 10) * 10, est: Math.round(r.est / 10) * 10, netto: Math.round(r.netto / 10) * 10, tip: r.tip };
      if (anim && !instant) {
        gsap.to(shown, { total: to.total, ust: to.ust, est: to.est, netto: to.netto, tip: to.tip, duration: 0.6, ease: 'power2.out', overwrite: true,
          onUpdate: function () { Object.keys(to).forEach(function (k) { out[k].textContent = fmt(shown[k]); }); } });
      } else {
        Object.keys(to).forEach(function (k) { shown[k] = to[k]; out[k].textContent = fmt(to[k]); });
      }
      out.share.textContent = r.U > 0 ? '≈ ' + fmt(r.share * 100) + ' % deines Umsatzes' : 'Trag deinen Umsatz ein';
      var base = Math.max(r.U, r.total, 1);
      bars.u.style.flexGrow = r.ust / base; bars.e.style.flexGrow = r.est / base; bars.r.style.flexGrow = Math.max(0, base - r.total) / base;
      bars.u.style.display = r.ust > 0 ? '' : 'none';

      var jahr = vals.umsatz * 12;
      if (vals.ust) hint.textContent = 'Du weist auf deinen Rechnungen Umsatzsteuer aus – meist 19 %.';
      else if (jahr > 100000) hint.innerHTML = '<strong style="color:#a3321a;font-weight:480">Achtung:</strong> Mit ' + fmt(jahr) + ' € Jahresumsatz liegst du über der 100.000-€-Grenze. Dann bist du umsatzsteuerpflichtig.';
      else if (jahr > 25000) hint.textContent = 'Hochgerechnet ' + fmt(jahr) + ' € im Jahr: Im nächsten Jahr bist du damit wohl kein Kleinunternehmer mehr (Grenze 25.000 € im Vorjahr).';
      else hint.textContent = 'Als Kleinunternehmer weist du keine Umsatzsteuer aus – dafür musst du auch nichts zurücklegen.';
    }

    function setVal(key, v, from) {
      var r = $('[data-range="' + key + '"]', box), n = $('[data-num="' + key + '"]', box);
      v = Math.max(0, Math.min(+r.max, Math.round(+v || 0)));
      vals[key] = v;
      if (from !== r) { r.value = v; }
      if (from !== n) { n.value = v; }
      paintRange(r);
      render();
    }
    ['gewinn', 'umsatz'].forEach(function (k) {
      var r = $('[data-range="' + k + '"]', box), n = $('[data-num="' + k + '"]', box);
      paintRange(r);
      r.addEventListener('input', function () { setVal(k, r.value, r); });
      n.addEventListener('input', function () { if (n.value !== '') setVal(k, n.value, n); });
      n.addEventListener('blur', function () { setVal(k, n.value); });
    });

    var placeThumb = function () {
      var on = $('[aria-pressed="true"]', seg);
      thumb.style.width = on.offsetWidth + 'px';
      thumb.style.transform = 'translateX(' + (on.offsetLeft - 4) + 'px)';
    };
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      vals.ust = b.getAttribute('data-ust') === '1';
      placeThumb(); render();
    });
    window.addEventListener('resize', placeThumb);
    placeThumb();
    render(true);
    /* Beim ersten Sichtbarwerden einmal hochzählen */
    if (anim) {
      Object.keys(shown).forEach(function (k) { shown[k] = 0; out[k].textContent = '0'; });
      ScrollTrigger.create({ trigger: box, start: 'top 75%', once: true, onEnter: function () { render(); } });
    }
  }

  function boot() {
    initFilter(); initLetter(); initProgress(); initToc(); initCalc();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  /* Nach site.js-Boot starten (Schriften geladen), damit Layout-Maße stimmen */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(boot, 0); });
  else window.addEventListener('load', boot);
})();
