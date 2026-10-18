/* Kontorhaus – gemeinsame Animationen (alle Seiten).
   Werte aus dem Code von steep.app übernommen:
   - Überschriften: SplitText words+lines (mask lines), Wörter yPercent 100 → 0, opacity 0 → 1,
     0.6 s, stagger 0.08, power3.out; Beschreibung y 40 → 0 (0.72 s, power3.out) ab stagger·Wörter·0.4;
     CTA y 15 → 0 (0.8 s, power2.out) bei "-=0.4". Start: "top bottom-=300" (klein: -=200), rückwärts beim Zurückscrollen.
   - Feature-Reihen: y 60 → 0, 0.7 s, stagger 0.15, power3.out. */
(function () {
  var KH = window.KH = window.KH || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!window.gsap;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, window.SplitText || {});
  // Handy: Ein- und Ausfahren der Adressleiste löst keine Neuberechnung aus (sonst springen festgehaltene Szenen)
  if (hasGsap) ScrollTrigger.config({ ignoreMobileResize: true });
  KH.reduce = reduce;
  KH.isSmall = function () { return window.innerWidth < 768; };

  /* In-View wie useInView() bei Steep: an beim ersten Fortschritt > 0, aus erst wieder ganz oben. */
  KH.inView = function (trigger, start, onIn, onOut) {
    if (!hasGsap || reduce) { onIn && onIn(); return null; }
    return ScrollTrigger.create({
      trigger: trigger, start: start || 'top 80%', end: 'bottom top',
      onEnter: function () { onIn && onIn(); },
      onLeaveBack: function () { onOut && onOut(); }
    });
  };
  KH.startFor = function () { return KH.isSmall() ? 'top bottom-=200' : 'top bottom-=300'; };

  /* ---------- Überschriften-Reveal ---------- */
  KH.buildReveal = function (root) {
    var h = root.querySelector('[data-split]');
    var d = root.querySelector('.reveal-desc');
    var c = root.querySelector('.reveal-cta');
    if (!hasGsap || reduce || !h || !window.SplitText) { root.classList.add('split-ready'); return null; }
    if (root._kh) { root._kh.tl.kill(); root._kh.split.revert(); }
    var stagger = 0.08, dur = 0.6;
    var split = SplitText.create(h, { type: 'words,lines', mask: 'lines' });
    if (split.masks) gsap.set(split.masks, { overflow: 'visible', marginBottom: '-0.15em' });
    gsap.set(split.words, { yPercent: 100, opacity: 0, textShadow: '0 0 1em transparent' });
    root.classList.add('split-ready');
    if (d) gsap.set(d, { y: 40, opacity: 0 });
    if (c) gsap.set(c, { y: 15, opacity: 0 });
    var tl = gsap.timeline({ paused: true });
    tl.to(split.words, { yPercent: 0, opacity: 1, duration: dur, stagger: stagger, ease: 'power3.out' });
    var at = stagger * split.words.length * 0.4;
    if (d) tl.to(d, { y: 0, opacity: 1, duration: 1.2 * dur, ease: 'power3.out' }, at);
    if (c) tl.to(c, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, d ? '-=0.4' : at);
    root._kh = { tl: tl, split: split };
    return tl;
  };
  KH.playReveal = function (root) { if (root._kh) root._kh.tl.play(); };

  function initReveals() {
    document.querySelectorAll('[data-reveal]').forEach(function (root) {
      var tl = KH.buildReveal(root);
      if (!tl) return;
      if (root.getAttribute('data-reveal') === 'load') {
        tl.play();
      } else if (!root.hasAttribute('data-reveal-manual')) {
        KH.inView(root, KH.startFor(), function () { tl.play(); }, function () { if (tl.progress() > 0) tl.reverse(); });
      }
    });
  }

  /* ---------- Gestaffelte Reihen ---------- */
  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(function (wrap) {
      var items = Array.prototype.slice.call(wrap.children);
      if (!hasGsap || reduce) return;
      gsap.set(items, { y: 60, opacity: 0 });
      var tl = gsap.timeline({ paused: true }).to(items, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' });
      KH.inView(wrap, KH.startFor(), function () { tl.play(); }, function () { if (tl.progress() > 0) tl.reverse(); });
    });
  }

  /* ---------- Einfaches Einblenden ---------- */
  function initFade() {
    document.querySelectorAll('.fade-up').forEach(function (el) {
      if (!hasGsap || reduce) { el.style.opacity = 1; el.style.transform = 'none'; return; }
      KH.inView(el, 'top bottom-=120', function () {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      });
    });
  }

  /* ---------- Bild skaliert beim Einblenden (ImageReveal, expo.out) ---------- */
  function initScaleIn() {
    document.querySelectorAll('[data-scale-in]').forEach(function (el) {
      var s = parseFloat(el.getAttribute('data-scale-in')) || 0.8;
      if (!hasGsap || reduce) return;
      gsap.set(el, { scale: s });
      KH.inView(el, 'top bottom-=200', function () { gsap.to(el, { scale: 1, duration: 0.6, ease: 'expo.out' }); },
        function () { gsap.to(el, { scale: s, duration: 0.3, ease: 'expo.out' }); });
    });
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    if (!hasGsap || reduce) return;
    document.querySelectorAll('[data-par]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-par')) || 30;
      gsap.fromTo(el, { y: -amt }, { y: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- Kundenlogo-Laufband (carousel-scroll, 50 s linear) ---------- */
  KH.logoOrder = ['brandl', 'goldammer', 'obermaier', 'halbschatten', 'stadler', 'gschwendtner', 'physio', 'yogaloft', 'brezenhuber', 'reischl', 'kasspatz'];
  function initLogos() {
    document.querySelectorAll('[data-logos]').forEach(function (box) {
      var label = box.getAttribute('data-logos-label') || 'Über 1.150 Betriebe in Bayern führen ihre Bücher mit uns';
      var list = KH.logoOrder.map(function (k) { return (KH.logos && KH.logos[k]) || ''; }).join('');
      box.innerHTML = '<div class="logos__label">' + label + '</div><div class="marquee" aria-hidden="false"><div class="marquee__track"><div class="marquee__list">' + list + '</div><div class="marquee__list" aria-hidden="true">' + list + '</div></div></div>';
    });
  }

  /* ---------- Vertikale Tabs (Steep „TabSections“) ---------- */
  /* opts: { list: el, hList: el, hDesc: el, items: [{label, description, duration}], onSelect(i), mode } */
  KH.tabs = function (opts) {
    var items = opts.items, active = 0, key = 0;
    var v = opts.list, h = opts.hList, hd = opts.hDesc;
    if (v) v.innerHTML = items.map(function (it, i) {
      return '<button class="vtab" type="button" data-i="' + i + '"><p>' + it.label + '</p><div class="more"><div><span>' + it.description + '</span></div></div><span class="track"><span class="fill"></span></span></button>';
    }).join('');
    if (h) h.querySelector('.htabs__row').innerHTML = items.map(function (it, i) {
      return '<button type="button" data-i="' + i + '">' + it.label + '</button>';
    }).join('');
    var api = {
      get index() { return active; },
      select: function (i, silent) {
        active = Math.max(0, Math.min(items.length - 1, i)); key++;
        if (v) v.querySelectorAll('.vtab').forEach(function (b, j) {
          b.classList.toggle('is-active', j === active);
          var f = b.querySelector('.fill');
          f.style.animation = 'none'; void f.offsetWidth;
          f.style.width = '0%';
          if (j === active && items[j].duration) { f.style.animation = 'progressFill ' + items[j].duration + 's linear forwards'; f.style.animationPlayState = api.paused ? 'paused' : 'running'; }
        });
        if (h) h.querySelectorAll('button').forEach(function (b, j) { b.classList.toggle('is-active', j === active); });
        if (h && h.offsetParent !== null) { var btn = h.querySelectorAll('button')[active]; if (btn) btn.parentNode.scrollTo({ left: btn.offsetLeft - 20, behavior: 'smooth' }); }
        if (hd) { hd.style.display = ''; hd.textContent = items[active].description; hd.style.animation = 'none'; void hd.offsetWidth; hd.style.animation = ''; }
        if (!silent && opts.onSelect) opts.onSelect(active, key);
      },
      paused: false,
      pause: function (p) {
        api.paused = p;
        if (!v) return;
        var f = v.querySelector('.vtab.is-active .fill');
        if (f) f.style.animationPlayState = p ? 'paused' : 'running';
      }
    };
    [v, h].forEach(function (root) {
      if (!root) return;
      root.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) api.select(+b.getAttribute('data-i')); });
    });
    return api;
  };

  /* ---------- Hilfen ---------- */
  KH.fmt = function (n, dec) { return n.toLocaleString('de-DE', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); };
  KH.countTo = function (tl, el, to, opts, at) {
    opts = opts || {};
    var o = { v: opts.from || 0 };
    tl.to(o, { v: to, duration: opts.duration || 1.2, ease: opts.ease || 'power2.out', onUpdate: function () { el.textContent = (opts.prefix || '') + KH.fmt(o.v, opts.dec) + (opts.suffix || ''); } }, at);
  };
  KH.type = function (tl, el, text, dur, at) {
    var o = { n: 0 };
    tl.to(o, { n: text.length, duration: dur || text.length * 0.045, ease: 'none', onUpdate: function () { el.textContent = text.slice(0, Math.round(o.n)); } }, at);
  };

  /* Neu laden: Der Browser sprang sonst an die alte Scrollstelle, bevor die gepinnten
     Szenen gebaut waren – die Szenen rechneten mit falschen Positionen und blieben hängen.
     Darum startet jede Seite beim Laden oben (außer bei Sprungmarke #...). */
  var touched = false;
  function boot() {
    window.scrollTo(0, 0);
    if (hasGsap && ScrollTrigger.clearScrollMemory) ScrollTrigger.clearScrollMemory('manual');
    initLogos();
    initReveals();
    initStagger();
    initFade();
    initScaleIn();
    initParallax();
    if (KH.onBoot) KH.onBoot.forEach(function (fn) { fn(); });
    if (hasGsap) ScrollTrigger.refresh();
    goToTarget();
  }
  /* Gemerkte Sprungmarke anfahren, sobald alle Positionen stimmen, und wieder in die Adresse schreiben */
  function goToTarget() {
    var id = window.KH_TARGET; if (!id) return;
    window.KH_TARGET = null;
    var el; try { el = document.querySelector(id); } catch (e) {}
    history.replaceState(null, '', location.pathname + location.search + id);
    if (!el) return;
    touched = true;
    var go = function () { setTimeout(function () { window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 72); }, 60); };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
  }
  KH.onBoot = KH.onBoot || [];

  /* Safari stellt die alte Scrollstelle teils erst nach dem Laden wieder her – also nach
     dem Aufbau der Szenen. Hat der Besucher selbst noch nicht gescrollt, geht es zurück
     nach oben und die Szenen werden neu vermessen. */
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, function () { touched = true; }, { passive: true, once: true });
  });
  function resetTop() {
    if (touched || window.scrollY === 0) return;
    window.scrollTo(0, 0);
    if (hasGsap) ScrollTrigger.refresh();
  }
  window.addEventListener('load', function () { resetTop(); setTimeout(resetTop, 120); setTimeout(resetTop, 400); });
  /* Zurück-Taste aus dem Zwischenspeicher: Positionen neu berechnen */
  window.addEventListener('pageshow', function (e) { if (e.persisted && hasGsap) ScrollTrigger.refresh(); });
  /* Start erst, wenn ALLE Skripte der Seite geladen sind (DOMContentLoaded) UND die Schriften stehen.
     Vorher hing es nur an den Schriften: Lagen die schon im Speicher (Neuladen), startete alles,
     bevor components.js seine Szenen anmelden konnte – die gepinnte App-Szene fehlte dann. */
  var booted = false;
  function start() {
    var go = function () { if (booted) return; booted = true; boot(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go, go); else go();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
