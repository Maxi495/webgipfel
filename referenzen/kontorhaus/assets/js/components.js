/* Kontorhaus – Bausteine der Startseite, auf jeder Seite nutzbar (jede Funktion prüft, ob ihr Markup existiert).
   Bausteine: [data-hero] · [data-cards3] · [data-product] (Autoplay-Tabs) · [data-scene="0-5"] (einzelne App-Szene, Endlosschleife)
   · [data-story] · [data-kanzlei] · [data-ai-shot] · [data-mini="trust|report|berater"] · [data-door].
   Hero-Choreografie 1:1 nach steep.app (HomeHero): Bühne 1200 px, skaliert mit (Breite−160)/1200,
   gepinnt über 1,2 × Höhe, scrub 0.8 (Safari 0.6). Karten fliegen ins App-Fenster, die Frage wird
   getippt, das Fenster wechselt zur Antwort. Positionen und Zeitpunkte aus dem Original. */
(function () {
  var KH = window.KH;
  var U = 'assets/img/icons.svg#';
  var ic = function (id, st) { return '<svg' + (st ? ' style="' + st + '"' : '') + ' aria-hidden="true"><use href="' + U + id + '"/></svg>'; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  /* ================= HERO ================= */
  var hero = $('[data-hero]');
  var heroCtx = null, lastW = 0;

  /* Angedockte Kopien für Mobil + Fallback */
  function buildDock() {
    var dock = $('[data-dock]');
    if (!dock || dock.childElementCount) return;
    var place = function (sel, x, y, w) {
      var src = $('[data-f="' + sel + '"] > *');
      var c = src.cloneNode(true);
      c.style.position = 'absolute'; c.style.left = (x - 248) + 'px'; c.style.top = (y - 140) + 'px';
      if (w) c.style.width = w + 'px';
      dock.appendChild(c);
    };
    place('composer', 248, 140, 600);
    place('blue', 247, 280);
    place('peach', 860, 280);
    place('gray', 247, 526);
    var t = $('.composer__typed', dock); if (t) t.style.width = '0';
  }

  function buildMobileShot() {
    var box = $('[data-mobile-shot]');
    if (!box || box.childElementCount) return;
    var d = $('[data-hero-dash]').cloneNode(true);
    d.removeAttribute('data-hero-dash');
    $$('[data-hero-answer]', d).forEach(function (n) { n.remove(); });
    var dock = $('[data-dock]', d); dock.classList.remove('dock');
    var wrap = document.createElement('div'); wrap.className = 'hero-mobile__scale';
    wrap.appendChild(d); box.appendChild(wrap);
    var fit = function () { var s = box.clientWidth / 1200; wrap.style.transform = 'scale(' + s + ')'; box.style.height = (880 * s) + 'px'; };
    fit(); window.addEventListener('resize', fit);
  }

  function heroInit() {
    if (!hero || !window.gsap) return;
    var W = window.innerWidth, H = window.innerHeight;
    if (heroCtx) { heroCtx.revert(); heroCtx = null; }
    if (W < 1024) { hero.style.height = ''; return; }
    var s = W >= 1360 ? 1 : Math.max((W - 160) / 1200, 0.5);
    var yo = 200 * Math.max(0, Math.min(1, (H - 800) / 400));
    var es = 1480 * s;
    var stage = $('[data-hero-stage]');
    var p = $('[data-hero-copy]'), c = $('[data-hero-dash]'), E = $('[data-hero-banner]');
    var o = $('[data-f="peach"]'), n = $('[data-f="blue"]'), l = $('[data-f="gray"]');
    var m = $('[data-f="cursorL"]'), u = $('[data-f="composer"]'), f = $('[data-f="cursorR"]');
    var y = $('[data-hero-logos]'), g = $('[data-hero-bg]'), w = $('[data-hero-start]'), b = $('[data-hero-answer]');

    heroCtx = gsap.context(function () {
      gsap.set(hero, { height: es });
      gsap.set(stage, { xPercent: -50, y: 0, scale: s, transformOrigin: 'top center' });
      if (isSafari) gsap.defaults({ force3D: true });
      // Startzustände (aus dem Original)
      var P = { opacity: 1, y: -90 + yo }, O = { opacity: 0, scale: 0.5, y: -300, duration: 0.5 };
      var R = { autoAlpha: 1, y: 0 }, I = { autoAlpha: 0, y: -40, duration: 0.3 };
      var z = { scale: 0.8, y: 800, opacity: 0 }, M = { scale: 1, y: 200, opacity: 1 };
      var F = { y: 800 }, D = { y: 280 };
      var G = { x: 1100, y: -560 + yo }, L = { x: 860, y: M.y - 600 };
      var B = { x: -480, y: -750 + yo }, V = { x: 247, y: M.y - 600 };
      var Z = { x: -20, y: -280 + yo }, Hh = { x: 247, y: M.y - 354 };
      var q = { opacity: 1, x: 660, y: -190 + yo, width: 400 }, Wq = { x: 248, y: M.y - 740, width: 600 };
      var J = { x: Z.x - 50, y: Z.y + 70 }, Uu = { x: Hh.x - 30, y: Hh.y + 60 };
      var $q = { scale: 0.9, x: q.x + 120, y: q.y + 40 }, X = { x: Wq.x + 480, y: Wq.y + 60 };
      var K = { y: 0 }, Y = { y: -130 };
      var Q = { opacity: 0, top: 28, left: 300, y: 200 }, ee = { opacity: 1, y: 84 };

      gsap.set(c, z); gsap.set(o, G); gsap.set(n, B); gsap.set(l, Z); gsap.set(m, J); gsap.set(f, $q);
      gsap.set(u, q); gsap.set(p, P); gsap.set(y, F); gsap.set(g, K); gsap.set(b, Q);
      gsap.set(w, { opacity: 1 }); gsap.set('.composer__typed', { width: 0, y: 0 });
      gsap.set('[data-composer]', { backgroundColor: '#ffffff', height: 100 });
      gsap.set('.composer__icons, .composer__ph', { opacity: 1 });

      var v = gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: 'top top', pin: true, scrub: isSafari ? 0.6 : 0.8,
          end: function () { return '+=' + 1.2 * es; },
          anticipatePin: isSafari ? 0.5 : 0, invalidateOnRefresh: true, refreshPriority: 1
        }
      });
      v.fromTo(p, P, O, 0);
      v.fromTo(o, Object.assign({}, G, { '--shadow-opacity': 1 }), Object.assign({}, L, { '--shadow-opacity': 0 }), 0);
      v.fromTo(n, Object.assign({}, B, { '--shadow-opacity': 1 }), Object.assign({}, V, { '--shadow-opacity': 0 }), 0);
      v.fromTo(m, J, Uu, 0);
      v.fromTo(f, $q, X, 0);
      v.fromTo(l, Object.assign({}, Z, { '--shadow-opacity': 1 }), Object.assign({}, Hh, { '--shadow-opacity': 0 }), 0);
      v.fromTo(u, Object.assign({}, q, { '--shadow-opacity': 1 }), Object.assign({}, Wq, { '--shadow-opacity': 1 }), 0);
      v.fromTo(E, R, I, 0);
      v.fromTo('.composer__ph', { opacity: 1 }, { opacity: 0 }, 0);
      v.fromTo(c, z, M, 0);
      v.fromTo(y, F, D, 0);
      v.fromTo(g, K, Y, 0);
      v.to('.composer__typed', { width: 'auto', duration: 0.4, ease: 'none', y: -6 }, 0.2);
      v.to(u, { x: 594, width: 486, '--shadow-opacity': 0, duration: 0.5, y: '-=80' }, 0.7);
      v.to('[data-composer]', { backgroundColor: '#F3F3F5', height: 45, duration: 0.5 }, 0.7);
      v.to('.composer__icons', { opacity: 0, duration: 0.2 }, 0.6);
      v.to(f, { opacity: 0, duration: 0.3 }, 0.6);
      v.to(m, { opacity: 0, duration: 0.3 }, 0.6);
      v.to(o, { opacity: 0, duration: 0.3 }, 0.7);
      v.to(n, { opacity: 0, duration: 0.3 }, 0.7);
      v.to(l, { opacity: 0, duration: 0.3 }, 0.7);
      v.to(w, { opacity: 0, duration: 0.3 }, 0.6);
      v.to(b, ee, 0.7);
    }, hero);
    hero.classList.add('is-ready');
  }

  /* ================= INTRO-KARTEN ================= */
  function initCards() {
    var wrap = $('[data-cards3]');
    if (!wrap) return;
    var cards = $$('.icard', wrap);
    var anims = cards.map(function (card, i) {
      var svg = $('svg', card), list = [];
      if (!window.gsap || KH.reduce) return list;
      if (i === 0) {
        var pen = $('#ill-pen', svg), stack = $('#ill-stack', svg), pl = $('#ill-platform', svg);
        gsap.set(pen, { scale: 1, y: -6, x: -6, transformOrigin: 'center center' });
        list.push(gsap.to(pen, { x: -20, y: 14, scale: 1, rotation: -3, duration: 0.8, ease: 'power2.out', transformOrigin: 'center center', paused: true }));
        list.push(gsap.to(stack, { y: -10, x: -20, duration: 0.8, scale: 1, ease: 'power2.out', transformOrigin: 'center center', paused: true }));
        list.push(gsap.to(pl, { x: 8, y: 6, rotation: -1, duration: 0.8, ease: 'power2.out', paused: true }));
      } else if (i === 1) {
        list.push(gsap.to($('#ill-bubbleA', svg), { rotation: -8, x: -15, y: -4, duration: 0.8, ease: 'power2.out', transformOrigin: 'center center', paused: true }));
        list.push(gsap.to($('#ill-bubbleB', svg), { rotation: 6, x: 10, y: 10, duration: 0.8, ease: 'power2.out', transformOrigin: 'center center', paused: true }));
        list.push(gsap.to($('#ill-handset', svg), { rotation: 10, x: 6, duration: 0.8, ease: 'power2.out', transformOrigin: 'center center', paused: true }));
      } else {
        list.push(gsap.to($('#ill-r1', svg), { x: 10, y: -10, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
        list.push(gsap.to($('#ill-r2', svg), { y: -16, rotation: 6, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 0.3, transformOrigin: 'center center', paused: true }));
        list.push(gsap.to($('#ill-box', svg), { x: 4, y: -6, duration: 2, ease: 'sine.inOut', transformOrigin: 'center center', yoyo: true, repeat: -1, paused: true }));
        list.push(gsap.to($('#ill-box', svg), { rotation: 1, duration: 0.2, scale: 0.98, ease: 'none', yoyo: true, repeat: -1, transformOrigin: 'top center', paused: true }));
      }
      return list;
    });
    var setActive = function (a) {
      wrap.classList.toggle('shift-r', a < 1);
      wrap.classList.toggle('shift-l', a > 1);
      var mid = Math.floor(cards.length / 2);
      cards.forEach(function (card, i) {
        card.classList.remove('is-active', 'nudge-r', 'nudge-l', 'push-r', 'push-l');
        if (i === a) card.classList.add('is-active');
        else if (a !== mid) {
          var r = a < mid, off = Math.abs(i - a);
          if (off === 1) card.classList.add(r ? 'nudge-r' : 'nudge-l');
          else if (off > 1) card.classList.add(r ? 'push-l' : 'push-r');
        }
        anims[i].forEach(function (t) { i === a ? t.restart() : t.pause().progress(0); });
      });
    };
    cards.forEach(function (card, i) {
      card.addEventListener('mouseenter', function () { if (window.innerWidth >= 768) setActive(i); });
      card.addEventListener('focus', function () { setActive(i); });
    });
    // Mobil: aktiv ist die Karte in der Mitte des Scrollbereichs
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (window.innerWidth >= 768) return;
        es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.8) setActive(cards.indexOf(e.target)); });
      }, { root: wrap, threshold: [0.8] });
      cards.forEach(function (c) { io.observe(c); });
    }
    setActive(0);
  }

  /* ================= PRODUKT-SZENEN ================= */
  var SIDE = [['home', 'Überblick'], ['receipt', 'Belege'], ['invoice', 'Rechnungen'], ['piggy', 'Steuer-Rücklage'], ['spark', 'Frag deine Zahlen'], ['chat', 'Berater-Chat']];
  function side(a) {
    return '<aside class="sc-side"><div class="dash__lights"><i></i><i></i><i></i></div><div class="dash__ws"><span class="ws-logo">B</span>Schreinerei Brandl</div>' +
      SIDE.map(function (s, i) { return '<div class="side-item' + (i === a ? ' is-active' : '') + '">' + ic(s[0]) + s[1] + '</div>'; }).join('') +
      '<div class="side-label" style="font-size:.9cqw;padding:1.4cqw .7cqw .4cqw">Konten</div><div class="side-item"><i class="side-dot" style="background:#e85c4a;width:1.1cqw;height:1.1cqw"></i>Geschäftskonto</div><div class="side-item"><i class="side-dot" style="background:#2e5ea7;width:1.1cqw;height:1.1cqw"></i>Rücklagekonto</div></aside>';
  }
  var cursor = '<svg class="sc-cursor" viewBox="0 0 24 24"><use href="' + U + 'cursor-white"/></svg>';

  var SCENES = [
    { label: 'Überblick', duration: 12, description: 'Kontostand, Umsatz und was du dir auszahlen darfst – ruhig erzählt, jeden Morgen aktuell.',
      html: function () {
        return side(0) + '<div class="sc-main"><div class="sc-top"><span>Überblick</span><small>Do, 16. Oktober</small></div><h3 class="sc-h">Servus Andreas!</h3>' +
          '<div class="sc-grid" style="grid-template-columns:repeat(3,1fr)">' +
          '<div class="sc-card"><h6>Kontostand</h6><div class="sc-big tabular" data-c="k">0 €</div><div class="sc-muted" style="font-size:.95cqw">Geschäfts- &amp; Rücklagekonto</div></div>' +
          '<div class="sc-card"><h6>Umsatz Oktober</h6><div class="sc-big tabular" data-c="u">0 €</div><div style="display:flex;align-items:flex-end;gap:.4cqw;height:3.2cqw;margin-top:.8cqw" data-bars>' + [40, 55, 46, 62, 50, 72, 58, 68, 80, 64, 88, 70].map(function (h) { return '<i style="flex:1;height:' + h + '%;background:#3a66a8;border-radius:.2cqw .2cqw 0 0;transform-origin:bottom"></i>'; }).join('') + '</div></div>' +
          '<div class="sc-card" style="background:#fdf0e7;box-shadow:none;color:#5d2a1a"><h6>Steuer-Rücklage</h6><div class="sc-big tabular" data-c="r">0 €</div><div style="font-size:.95cqw">75 % vom Ziel</div></div></div>' +
          '<div class="sc-card" style="margin-top:1.2cqw"><div style="display:flex;justify-content:space-between;align-items:center"><h6>Wie viel darf ich mir auszahlen?</h6><span class="sc-pill sc-pill--ink" data-btn>Auszahlung planen</span></div>' +
          '<div style="display:flex;height:2.6cqw;border-radius:.6cqw;overflow:hidden;margin-top:1.4cqw;background:#f2f2f3" data-flow><i style="width:0;background:#17191c"></i><i style="width:0;background:#e8a589"></i><i style="width:0;background:#c9cbd1"></i></div>' +
          '<div style="display:flex;justify-content:space-between;font-size:.95cqw;margin-top:.8cqw" class="sc-muted"><span>■ Auszahlbar <b style="color:#17191c" class="tabular" data-c="a">0 €</b></span><span>■ Rücklage 11.400 €</span><span>■ Fixkosten Nov 22.160 €</span></div></div>' +
          '<div class="sc-grid" style="grid-template-columns:1.4fr 1fr;margin-top:1.2cqw"><div class="sc-card" data-rows><h6 style="margin-bottom:.4cqw">Letzte Buchungen</h6>' +
          [['Familie Reiter · Abschlag', '+6.000,00 €', '#24603b'], ['Holz Hauser GmbH', '−1.284,60 €', ''], ['Werkzeug &amp; Beschlag Kolbermoor', '−212,35 €', ''], ['Wirtshaus am Lindenspitz · Rechnung 112', '+1.420,00 €', '#24603b']].map(function (r) { return '<div class="sc-row"><span>' + r[0] + '</span><span class="tabular" style="color:' + (r[2] || '#17191c') + '">' + r[1] + '</span></div>'; }).join('') +
          '</div><div class="sc-card"><h6 style="margin-bottom:.4cqw">Fristen &amp; Termine</h6>' +
          [['Quartalsgespräch', 'Do, 23.10.'], ['USt-Voranmeldung', '10.11.'], ['Lohnsteuer Oktober', '10.11.'], ['Jahresabschluss 2025', 'erledigt ✓']].map(function (r) { return '<div class="sc-row"><span>' + r[0] + '</span><span class="sc-muted">' + r[1] + '</span></div>'; }).join('') +
          '</div></div>' +
          '</div>' + cursor + '<div class="sc-toast">' + ic('check', 'width:1.3cqw;height:1.3cqw') + 'Auszahlung 4.000 € für 1. November vorgemerkt</div>';
      },
      tl: function (el, tl) {
        KH.countTo(tl, $('[data-c="k"]', el), 38412, { suffix: ' €', duration: 1.6 }, 0.3);
        KH.countTo(tl, $('[data-c="u"]', el), 48320, { suffix: ' €', duration: 1.6 }, 0.5);
        KH.countTo(tl, $('[data-c="r"]', el), 11400, { suffix: ' €', duration: 1.6 }, 0.7);
        tl.from($$('[data-bars] i', el), { scaleY: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 0.5);
        var fl = $$('[data-flow] i', el);
        tl.to(fl[2], { width: '58%', duration: 0.9, ease: 'power3.out' }, 1.8);
        tl.to(fl[1], { width: '30%', duration: 0.9, ease: 'power3.out' }, 2.2);
        tl.to(fl[0], { width: '12%', duration: 0.9, ease: 'power3.out' }, 2.6);
        KH.countTo(tl, $('[data-c="a"]', el), 4850, { suffix: ' €', duration: 1 }, 2.6);
        tl.from($$('[data-rows] .sc-row', el), { opacity: 0, x: -14, duration: 0.5, stagger: 0.12, ease: 'power3.out' }, 1.2);
        var cur = $('.sc-cursor', el);
        tl.fromTo(cur, { left: '70%', top: '92%' }, { left: '88%', top: '37.5%', duration: 1.4, ease: 'power2.inOut' }, 4.2);
        tl.to($('[data-btn]', el), { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1 }, 5.7);
        tl.to($('.sc-toast', el), { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 6);
        tl.from($('.sc-toast', el), { y: 20, duration: 0.4, ease: 'power3.out' }, 6);
        tl.to(cur, { left: '64%', top: '84%', duration: 1.6, ease: 'power2.inOut' }, 7.4);
      } },
    { label: 'Belege', duration: 12, description: 'Foto mit dem Handy, fertig. Die App liest Betrag, Datum und Lieferant und ordnet den Beleg der Buchung zu.',
      html: function () {
        return side(1) + '<div class="sc-main"><div class="sc-top"><span>Belege</span><small>3 zu prüfen</small></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1.15fr;gap:2.4cqw">' +
          '<div><div class="sc-card" style="padding:.6cqw 1.4cqw" data-list>' +
            '<div class="sc-row" data-new style="opacity:0;margin:0 -1.4cqw;padding-inline:1.4cqw"><span>' + ic('receipt', 'width:1.2cqw;height:1.2cqw;display:inline;vertical-align:-.2cqw;margin-right:.6cqw') + 'Holz Hauser GmbH</span><b class="tabular" style="font-weight:480">1.284,60 €</b></div>' +
            '<div class="sc-row"><span>Werkzeug &amp; Beschlag Kolbermoor</span><span class="tabular">212,35 €</span></div><div class="sc-row"><span>Tankstelle Giesing</span><span class="tabular">96,40 €</span></div><div class="sc-row"><span>Baumarkt Moosach</span><span class="tabular">58,90 €</span></div><div class="sc-row"><span>Telefon &amp; Internet</span><span class="tabular">49,95 €</span></div></div>' +
          '<div style="display:flex;justify-content:center;margin-top:2cqw;position:relative;height:17cqw"><div class="sc-receipt" data-rc style="position:absolute;top:0"><div class="scan"></div><span data-stamp style="position:absolute;right:.8cqw;top:5cqw;transform:rotate(-12deg);border:2px solid #24603b;color:#24603b;border-radius:.4cqw;padding:.2cqw .7cqw;font-weight:700;font-size:1.1cqw;letter-spacing:.1em;opacity:0">GEBUCHT</span><b style="font-size:1cqw">HOLZ HAUSER GMBH</b><br>Am Sägewerk 3<br>85540 Haar<hr>07.10.2026 · Beleg 44812<hr>Eiche massiv 26 mm<br>4,2 m² × 241,00<hr>Netto&nbsp;&nbsp;&nbsp;&nbsp;1.079,50<br>MwSt 19 %&nbsp;205,10<br><b>Summe&nbsp;&nbsp;&nbsp;&nbsp;1.284,60</b></div></div></div>' +
          '<div class="sc-card"><h6 style="margin-bottom:.8cqw">Gelesen aus dem Foto</h6>' +
            '<div class="sc-field"><span>Lieferant</span><b data-t="Holz Hauser GmbH"></b></div><div class="sc-field"><span>Datum</span><b data-t="07.10.2026"></b></div><div class="sc-field"><span>Betrag</span><b data-t="1.284,60 €"></b></div><div class="sc-field"><span>Steuer</span><b data-t="19 % · 205,10 €"></b></div><div class="sc-field"><span>Kategorie</span><b data-t="Material · Holz"></b></div>' +
            '<div style="margin-top:1.6cqw;display:flex;gap:.8cqw;align-items:center"><span class="sc-pill sc-pill--ok" data-ok style="opacity:0">' + ic('check', 'width:1.1cqw;height:1.1cqw') + 'Zugeordnet: Geschäftskonto −1.284,60 €</span></div></div>' +
          '</div></div>';
      },
      tl: function (el, tl) {
        var rc = $('[data-rc]', el);
        tl.from(rc, { y: '-60%', rotation: -8, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.3);
        tl.fromTo($('.scan', rc), { top: '-20%' }, { top: '110%', duration: 1.4, ease: 'power1.inOut', repeat: 1 }, 1.2);
        $$('[data-t]', el).forEach(function (b, i) { KH.type(tl, b, b.getAttribute('data-t'), 0.55, 2.2 + i * 0.7); });
        tl.to($('[data-ok]', el), { opacity: 1, duration: 0.3 }, 6.1);
        tl.from($('[data-ok]', el), { scale: 0.8, duration: 0.5, ease: 'back.out(2)' }, 6.1);
        tl.fromTo($('[data-stamp]', el), { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 7);
        tl.to($('[data-new]', el), { opacity: 1, duration: 0.4 }, 7.6);
        tl.fromTo($('[data-new]', el), { backgroundColor: 'rgba(251,225,209,1)' }, { backgroundColor: 'rgba(251,225,209,0)', duration: 2 }, 7.6);
      } },
    { label: 'Rechnungen', duration: 13, description: 'Angebote und Rechnungen schreiben, inklusive E-Rechnung nach aktuellem Standard. Zahlungseingänge erkennt die App selbst.',
      html: function () {
        return side(2) + '<div class="sc-main"><div class="sc-top"><span>Rechnung 2026-118</span><span class="sc-pill sc-pill--ink" data-send>E-Rechnung senden ' + ic('arrow-right', 'width:1cqw;height:1cqw') + '</span></div>' +
          '<div class="sc-card" style="padding:2.2cqw 2.6cqw;max-width:46cqw"><div style="display:flex;justify-content:space-between"><div><div style="font-family:var(--serif);font-size:1.8cqw">Schreinerei Brandl</div><div class="sc-muted" style="font-size:.9cqw">Am Giesinger Anger 9 · 81543 München</div></div><div style="text-align:right;font-size:.95cqw" class="sc-muted">An: Familie Reiter<br>Am Sonnenrain 4, Kolbermoor</div></div>' +
          '<div style="margin-top:2cqw;font-size:.9cqw" class="sc-muted">Pos. · Leistung</div>' +
          '<div data-pos><div class="sc-row"><span>Einbauküche Eiche massiv, nach Maß</span><span class="tabular">14.800,00 €</span></div><div class="sc-row"><span>Arbeitsplatte Naturstein, 3,4 m</span><span class="tabular">2.950,00 €</span></div><div class="sc-row"><span>Montage vor Ort, 2 Tage · 2 Personen</span><span class="tabular">1.680,00 €</span></div></div>' +
          '<div style="margin-top:1.4cqw;display:grid;gap:.4cqw;font-size:1.05cqw;justify-items:end"><span class="sc-muted">Netto <b class="tabular" style="color:#17191c" data-c="n">0,00 €</b></span><span class="sc-muted">MwSt 19 % <b class="tabular" style="color:#17191c" data-c="m">0,00 €</b></span><span style="font-size:1.4cqw;font-weight:500">Gesamt <span class="tabular" data-c="g">0,00 €</span></span></div></div>' +
          '<div class="sc-card" style="position:absolute;right:3cqw;top:31cqw;width:22cqw" data-hist><h6>Verlauf</h6>' + [['02.09.', 'Angebot angenommen'], ['08.10.', 'Abschlag 6.000 € bezahlt'], ['heute', 'Schlussrechnung erstellt']].map(function (r) { return '<div class="sc-row"><span class="sc-muted">' + r[0] + '</span><span>' + r[1] + '</span></div>'; }).join('') + '</div>' +
          '<div class="sc-card" style="position:absolute;right:3cqw;top:9cqw;width:22cqw" data-side><h6>Format</h6><div class="sc-row"><span>XRechnung (E-Rechnung)</span>' + ic('check-circle', 'width:1.3cqw;height:1.3cqw;color:#24603b') + '</div><div class="sc-row"><span>Zahlungsziel</span><span>14 Tage</span></div><div class="sc-row"><span>Skonto</span><span>2 % / 7 Tage</span></div><div class="sc-row"><span>Abschlag erhalten</span><span class="tabular">−6.000,00 €</span></div></div>' +
          '</div>' + cursor + '<div class="sc-toast">' + ic('check', 'width:1.3cqw;height:1.3cqw') + 'Gesendet an familie.reiter@mail.example</div>';
      },
      tl: function (el, tl) {
        $$('[data-pos] .sc-row', el).forEach(function (r, i) { tl.from(r, { opacity: 0, y: 10, duration: 0.5, ease: 'power3.out' }, 0.4 + i * 0.9); });
        KH.countTo(tl, $('[data-c="n"]', el), 19430, { suffix: ' €', dec: 2, duration: 1.4 }, 3);
        KH.countTo(tl, $('[data-c="m"]', el), 3691.7, { suffix: ' €', dec: 2, duration: 1.4 }, 3.2);
        KH.countTo(tl, $('[data-c="g"]', el), 23121.7, { suffix: ' €', dec: 2, duration: 1.4 }, 3.4);
        tl.from($('[data-side]', el), { opacity: 0, x: 30, duration: 0.6, ease: 'power3.out' }, 4.6);
        tl.from($$('[data-hist] .sc-row', el), { opacity: 0, x: 20, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, 5);
        var cur = $('.sc-cursor', el);
        tl.fromTo(cur, { left: '60%', top: '90%' }, { left: '91%', top: '5.5%', duration: 1.6, ease: 'power2.inOut' }, 6);
        tl.to($('[data-send]', el), { scale: 0.92, duration: 0.12, yoyo: true, repeat: 1 }, 7.7);
        tl.to($('.sc-toast', el), { opacity: 1, duration: 0.4 }, 8);
        tl.from($('.sc-toast', el), { y: 20, duration: 0.4, ease: 'power3.out' }, 8);
      } },
    { label: 'Steuer-Rücklage', duration: 11, description: 'Zeigt dir jeden Monat, wie viel Geld für Umsatz- und Einkommensteuer zur Seite gehört – und schiebt es auf Wunsch rüber.',
      html: function () {
        return side(3) + '<div class="sc-main"><div class="sc-top"><span>Steuer-Rücklage</span><small>Ziel 2026: 15.200 €</small></div>' +
          '<div style="display:grid;grid-template-columns:22cqw 1fr;gap:2.4cqw;align-items:center">' +
          '<div style="position:relative;width:22cqw;height:22cqw"><svg viewBox="0 0 200 200" style="width:100%;height:100%"><circle cx="100" cy="100" r="80" fill="none" stroke="#fbe1d1" stroke-width="16"/><circle data-ring cx="100" cy="100" r="80" fill="none" stroke="#5d2a1a" stroke-width="16" stroke-linecap="round" stroke-dasharray="0 503" transform="rotate(-90 100 100)"/></svg><div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:#5d2a1a"><div><div style="font-size:3cqw;font-weight:500;letter-spacing:-.02em" class="tabular" data-pct>0 %</div><div style="font-size:1cqw">zurückgelegt</div></div></div></div>' +
          '<div><div class="sc-card" style="background:#fdf0e7;box-shadow:none;color:#5d2a1a"><h6>Diesen Monat zur Seite legen</h6><div class="sc-big tabular">2.140 €</div><div class="sc-row" style="border-color:#f3d3bf"><span>Umsatzsteuer Oktober</span><span class="tabular">1.380 €</span></div><div class="sc-row" style="border-color:#f3d3bf"><span>Einkommensteuer-Vorauszahlung</span><span class="tabular">760 €</span></div>' +
          '<div style="margin-top:1.2cqw"><span class="sc-pill sc-pill--ink" data-move>Auf Rücklagekonto umbuchen</span></div></div>' +
          '<div style="display:flex;align-items:flex-end;gap:.7cqw;height:7cqw;margin-top:2cqw" data-mbars>' + ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O'].map(function (mo, i) { var h = [40, 52, 46, 60, 55, 62, 70, 58, 66, 74][i]; return '<div style="flex:1;text-align:center"><i style="display:block;height:' + (h * 0.07) + 'cqw;background:' + (i === 9 ? '#5d2a1a' : '#ecd2c1') + ';border-radius:.25cqw;transform-origin:bottom"></i><small class="sc-muted" style="font-size:.8cqw">' + mo + '</small></div>'; }).join('') + '</div></div></div>' +
          '</div>' + cursor + '<div class="sc-toast">' + ic('check', 'width:1.3cqw;height:1.3cqw') + '2.140 € auf Rücklagekonto gebucht</div>';
      },
      tl: function (el, tl) {
        var ring = $('[data-ring]', el), pct = $('[data-pct]', el), o = { p: 0 };
        var upd = function () { ring.setAttribute('stroke-dasharray', (o.p * 5.03) + ' 503'); pct.textContent = Math.round(o.p) + ' %'; };
        tl.to(o, { p: 75, duration: 1.8, ease: 'power3.out', onUpdate: upd }, 0.4);
        tl.from($$('[data-mbars] i', el), { scaleY: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, 0.8);
        var cur = $('.sc-cursor', el);
        tl.fromTo(cur, { left: '80%', top: '95%' }, { left: '60%', top: '53%', duration: 1.5, ease: 'power2.inOut' }, 3.4);
        tl.to($('[data-move]', el), { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1 }, 5);
        tl.to(o, { p: 89, duration: 1.4, ease: 'power3.inOut', onUpdate: upd }, 5.3);
        tl.to($('.sc-toast', el), { opacity: 1, duration: 0.4 }, 5.6);
        tl.from($('.sc-toast', el), { y: 20, duration: 0.4, ease: 'power3.out' }, 5.6);
      } },
    { label: 'Frag deine Zahlen', duration: 11, description: 'Frag deine Buchhaltung wie einen Menschen, z. B. „Welche Kunden zahlen zu spät?“. Antworten mit Beleg zum Nachklicken.',
      html: function () {
        return side(4) + '<div class="sc-main" style="display:flex;flex-direction:column"><div class="sc-top"><span>Frag deine Zahlen</span><small>+ Neuer Chat</small></div>' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:1.4cqw;overflow:hidden" data-chat>' +
          '<div class="sc-bubble sc-bubble--me" data-q style="opacity:0">Welche Kunden zahlen zu spät?</div>' +
          '<div class="sc-typing" data-dots style="opacity:0"><i></i><i></i><i></i></div>' +
          '<div data-a style="opacity:0;font-size:1.1cqw;line-height:1.55"><span class="sc-muted" style="font-size:.95cqw">Denkt nach › 41 offene Posten geprüft</span><p style="margin:.8cqw 0 1cqw">Zwei Kunden sind über dem Zahlungsziel. Zusammen <b>4.380 €</b> – das ist knapp ein Drittel deiner offenen Rechnungen.</p>' +
          '<div class="sc-card" style="padding:.6cqw 1.4cqw"><div class="sc-row"><span>Hausverwaltung Grabmaier</span><span class="tabular">2.960 € · <b style="color:#b4492a;font-weight:480">23 Tage</b></span></div><div class="sc-row"><span>Wirtshaus am Lindenspitz, Haar</span><span class="tabular">1.420 € · <b style="color:#b4492a;font-weight:480">9 Tage</b></span></div></div>' +
          '<div style="margin-top:1cqw;display:flex;gap:.8cqw"><span class="sc-pill sc-pill--ink">Zahlungserinnerung senden</span><span class="sc-pill">Beleg ansehen</span></div></div></div>' +
          '<div class="sc-input"><span data-in class="sc-muted">Frag deine Zahlen …</span><span class="send">' + ic('arrow-up') + '</span></div></div>';
      },
      tl: function (el, tl) {
        var inp = $('[data-in]', el);
        tl.set(inp, { color: '#17191c' }, 0.4);
        KH.type(tl, inp, 'Welche Kunden zahlen zu spät?', 1.4, 0.4);
        tl.to($('.send', el), { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 }, 2);
        tl.set(inp, { textContent: 'Frag nach …', color: '#a3a6af' }, 2.3);
        tl.to($('[data-q]', el), { opacity: 1, duration: 0.3 }, 2.3);
        tl.from($('[data-q]', el), { y: 20, duration: 0.5, ease: 'power3.out' }, 2.3);
        tl.to($('[data-dots]', el), { opacity: 1, duration: 0.2 }, 2.8);
        tl.to($('[data-dots]', el), { opacity: 0, height: 0, padding: 0, duration: 0.2 }, 4.4);
        tl.to($('[data-a]', el), { opacity: 1, duration: 0.4 }, 4.5);
        tl.from($$('[data-a] > *', el), { y: 14, opacity: 0, duration: 0.6, stagger: 0.35, ease: 'power3.out' }, 4.5);
      } },
    { label: 'Berater-Chat', duration: 10, description: 'Direkter Draht zu deinem Steuerberater. Er kennt deinen Betrieb und antwortet innerhalb eines Werktags – meist viel schneller.',
      html: function () {
        return side(5) + '<div class="sc-main" style="display:flex;flex-direction:column"><div class="sc-top" style="justify-content:flex-start;gap:1cqw"><img src="assets/img/team-murat.webp" alt="" style="width:3cqw;height:3cqw;border-radius:50%;object-fit:cover"><span>Murat Kaya<br><small>Steuerberater · antwortet meist in 2 Std.</small></span></div>' +
          '<div style="flex:1;display:flex;flex-direction:column;gap:1.2cqw;justify-content:flex-end;padding-bottom:1.4cqw">' +
          '<div class="sc-bubble sc-bubble--me" data-m1>Servus Murat, kann ich den neuen Sprinter noch dieses Jahr abschreiben? Lieferung wär im November.</div>' +
          '<div class="sc-typing" data-dots style="opacity:0"><i></i><i></i><i></i></div>' +
          '<div class="sc-bubble sc-bubble--them" data-m2 style="opacity:0">Servus Andreas! Ja – wenn er bis 31.12. zugelassen ist, schreiben wir ab November ab. Ich hab dir zusätzlich einen Investitionsabzugsbetrag eingeplant, das spart dir dieses Jahr rund 3.900 € Steuern.</div>' +
          '<div class="sc-bubble sc-bubble--them" data-m3 style="opacity:0;display:flex;align-items:center;gap:.8cqw">' + ic('invoice', 'width:1.6cqw;height:1.6cqw') + '<span>Sprinter_Abschreibung_2026.pdf<br><small class="sc-muted">Rechnung kommt in die Belege</small></span></div>' +
          '<div class="sc-bubble sc-bubble--me" data-m4 style="opacity:0">Passt, danke dir! 🙌</div></div>' +
          '<div class="sc-input"><span class="sc-muted">Nachricht an Murat …</span><span class="send">' + ic('arrow-up') + '</span></div></div>';
      },
      tl: function (el, tl) {
        tl.from($('[data-m1]', el), { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, 0.4);
        tl.to($('[data-dots]', el), { opacity: 1, duration: 0.2 }, 1.4);
        tl.to($('[data-dots]', el), { opacity: 0, height: 0, padding: 0, duration: 0.2 }, 3.6);
        tl.to($('[data-m2]', el), { opacity: 1, duration: 0.3 }, 3.7);
        tl.from($('[data-m2]', el), { y: 20, duration: 0.5, ease: 'power3.out' }, 3.7);
        tl.to($('[data-m3]', el), { opacity: 1, duration: 0.3 }, 5.2);
        tl.from($('[data-m3]', el), { y: 20, duration: 0.5, ease: 'power3.out' }, 5.2);
        tl.to($('[data-m4]', el), { opacity: 1, duration: 0.3 }, 7);
        tl.from($('[data-m4]', el), { y: 20, duration: 0.5, ease: 'power3.out' }, 7);
      } }
  ];

  function initProduct() {
    var sec = $('[data-product]'); if (!sec) return;
    var win = $('[data-appwin]', sec);
    var current = null, visible = false;
    var tabs = KH.tabs({
      list: $('[data-vtabs]', sec), hList: $('[data-htabs]', sec), hDesc: $('[data-htabs-desc]', sec),
      items: SCENES, onSelect: function (i) { play(i); }
    });
    function play(i) {
      if (current) current.kill();
      win.innerHTML = '<div class="scene is-on">' + SCENES[i].html() + '</div>';
      var el = win.firstChild;
      if (!window.gsap || KH.reduce) return;
      var tl = gsap.timeline({ paused: true });
      SCENES[i].tl(el, tl);
      tl.to({}, { duration: Math.max(0.01, SCENES[i].duration - tl.duration()) });
      tl.eventCallback('onComplete', function () { if (i < SCENES.length - 1) tabs.select(i + 1); });
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      current = tl;
      if (visible) tl.play();
    }
    tabs.select(0);
    if (window.ScrollTrigger) ScrollTrigger.create({ trigger: sec, start: 'top 80%', end: 'bottom 20%', onEnter: function () { tabs.select(0); }, onEnterBack: function () { tabs.select(0); } });
    var io = new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      tabs.pause(!visible);
      if (current) visible ? current.play() : current.pause();
    }, { rootMargin: '-100px' });
    io.observe(win);
  }

  /* ================= KUNDENGESCHICHTEN ================= */
  var STORIES = [
    { logo: 'brandl', img: 'kunde-brandl', alt: 'Andreas Brandl hobelt in seiner Werkstatt in Giesing', quote: '„Früher war Steuer ein Schuhkarton. Heute ist es ein Blick aufs Handy.“', sub: 'Wie die Schreinerei Brandl seit 2020 mit Kontorhaus arbeitet', href: 'handwerk.html#brandl' },
    { logo: 'goldammer', img: 'kunde-goldammer', alt: 'Selin Aydın hinter der Theke im Café Goldammer', quote: '„Ich fotografier den Beleg – und der Rest passiert einfach.“', sub: 'Der 1.000. Kunde: Café Goldammer in Untergiesing', href: 'gastro.html#goldammer' },
    { logo: 'obermaier', img: 'kunde-obermaier', alt: 'Ein Monteur von Elektro Obermaier bei der Arbeit', quote: '„28 Leute, Lohn, Material – und trotzdem schlaf ich ruhig.“', sub: 'Elektro Obermaier aus Dachau im Paket Plus', href: 'handwerk.html#obermaier' },
    { logo: 'halbschatten', img: 'kunde-halbschatten', alt: 'Fotografin Hanna Lichtenegger in ihrem Studio', quote: '„Ich weiß jeden Monat, was ich zurücklegen muss. Mehr will ich gar nicht wissen.“', sub: 'Studio Halbschatten: freiberuflich ohne Steuerangst', href: 'preise.html#solo' }
  ];
  function initStory() {
    var sec = $('[data-story]'); if (!sec) return;
    var brands = $('[data-story-brands]', sec), bar = $('[data-story-bar]', sec);
    var quote = $('[data-story-quote]', sec), rev = $('[data-story-reveal]', sec);
    var imgBox = $('[data-story-img]', sec), link = $('[data-story-link]', sec), dots = $('[data-story-dots]', sec), mlogo = $('[data-story-mlogo]', sec);
    var active = 0, shown = 0, inview = false;
    brands.insertAdjacentHTML('beforeend', STORIES.map(function (s, i) { return '<button type="button" data-i="' + i + '" aria-label="' + s.sub + '">' + KH.logos[s.logo] + '</button>'; }).join(''));
    dots.innerHTML = STORIES.map(function (s, i) { return '<button type="button" data-i="' + i + '" aria-label="Geschichte ' + (i + 1) + '"></button>'; }).join('');
    var setLogo = function (i) { mlogo.innerHTML = KH.logos[STORIES[i].logo].replace('class="clogo"', 'class="story__mlogo"'); };
    setLogo(0);
    var img = $('img', imgBox);
    if (window.gsap && !KH.reduce) {
      gsap.set(img, { scale: 0.8 });
      KH.inView(imgBox, 'top bottom-=200', function () { gsap.to(img, { scale: 1, duration: 0.6, ease: 'expo.out' }); }, function () { gsap.to(img, { scale: 0.8, duration: 0.3, ease: 'expo.out' }); });
    }
    KH.inView(sec, KH.startFor(), function () { inview = true; KH.playReveal(rev); }, function () { inview = false; if (rev._kh) rev._kh.tl.reverse(); });
    function paint() {
      var w = 100 / STORIES.length;
      bar.style.width = w + '%'; bar.style.left = (active * w) + '%';
      $$('button', brands).forEach(function (b, j) { b.classList.toggle('is-active', j === active); });
      $$('button', dots).forEach(function (b, j) { b.classList.toggle('is-active', j === active); });
    }
    function select(i) {
      if (i === active) return;
      active = i; paint();
      var s = STORIES[i];
      link.href = s.href;
      // Bildwechsel (ImageReveal): altes schrumpft, neues wächst mit expo.out
      var old = img, nu = new Image();
      nu.src = 'assets/img/' + s.img + '.webp'; nu.alt = s.alt; nu.width = 960; nu.height = 960;
      imgBox.appendChild(nu); img = nu;
      if (window.gsap && !KH.reduce) {
        var d = 0.6;
        gsap.set(nu, { scale: 0.8, opacity: 0 });
        var tl = gsap.timeline({ onComplete: function () { old.remove(); } });
        tl.to(old, { scale: 0.8, opacity: 0, duration: 0.6 * d, ease: 'power2.in' }, 0);
        tl.to(nu, { scale: 1, opacity: 1, duration: d, ease: 'expo.out' }, 0.3 * d);
      } else old.remove();
      // Zitat: 300 ms ausblenden, tauschen, Reveal neu
      quote.classList.add('is-swapping');
      setTimeout(function () {
        shown = i;
        if (rev._kh) { rev._kh.tl.kill(); rev._kh.split.revert(); rev._kh = null; }
        $('[data-split]', rev).innerHTML = s.quote;
        $('.reveal-desc', rev).textContent = s.sub;
        setLogo(i);
        var tl2 = KH.buildReveal(rev);
        requestAnimationFrame(function () { quote.classList.remove('is-swapping'); if (tl2 && inview) tl2.play(); });
      }, 300);
    }
    [brands, dots].forEach(function (r) { r.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) select(+b.getAttribute('data-i')); }); });
    paint();
  }

  /* ================= KANZLEI-PANELS ================= */
  var dk = 'background:radial-gradient(120% 90% at 50% 120%, rgba(93,42,26,.75), rgba(46,30,60,.55) 45%, rgba(20,20,22,1) 80%), #141416;';
  var node = function (icon, t, st) { return '<div style="display:flex;align-items:center;gap:.8cqw;padding:.9cqw 1.2cqw;border-radius:.9cqw;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:1.15cqw;' + (st || '') + '">' + ic(icon, 'width:1.4cqw;height:1.4cqw;opacity:.8') + t + '</div>'; };
  var KPANELS = [
    { label: 'Fester Ansprechpartner', description: 'Ein Steuerberater mit Namen kümmert sich um deinen Betrieb – von der Buchung bis zum Bescheid.',
      html: '<div class="kpanel" style="' + dk + '"><svg viewBox="0 0 960 640" style="position:absolute;inset:0;width:100%;height:100%" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.2"><path class="flow" d="M250 175 C 320 175, 320 300, 380 300"/><path class="flow" d="M250 255 C 310 255, 320 310, 380 310"/><path class="flow" d="M250 335 C 310 335, 320 330, 380 330"/><path class="flow" d="M250 415 C 320 415, 320 340, 380 340"/><path class="flow" d="M590 300 C 650 300, 640 175, 710 175"/><path class="flow" d="M590 310 C 650 310, 650 255, 710 255"/><path class="flow" d="M590 330 C 650 330, 650 335, 710 335"/><path class="flow" d="M590 340 C 650 340, 640 415, 710 415"/></svg>' +
        [['bank', 'Geschäftskonto'], ['bank', 'Rücklagekonto'], ['camera', 'Belege-App'], ['euro', 'Kasse']].map(function (n, k) { return '<div style="position:absolute;left:6%;width:20%;top:' + ((175 + k * 80) / 6.4) + '%;transform:translateY(-50%)">' + node(n[0], n[1]) + '</div>'; }).join('') +
        '<div style="position:absolute;left:39.6%;top:50%;transform:translateY(-50%);width:21.9%;padding:1.6cqw;border-radius:1.4cqw;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);box-shadow:0 2cqw 4cqw rgba(0,0,0,.4)"><div style="display:flex;align-items:center;gap:.8cqw;font-size:1.2cqw">' + ic('logo', 'width:1.8cqw;height:1.8cqw;color:#fff') + 'Kontorhaus Kanzlei</div><div style="display:flex;align-items:center;gap:.8cqw;margin:1.4cqw 0;font-size:1.05cqw;color:rgba(255,255,255,.7)"><img src="assets/img/team-murat.webp" alt="" style="width:2.6cqw;height:2.6cqw;border-radius:50%;object-fit:cover">Murat Kaya<br>dein Berater</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5cqw;font-size:.85cqw;text-align:center">' + ['Buchen', 'Prüfen', 'Abschluss'].map(function (t) { return '<div style="padding:.8cqw .2cqw;border-radius:.6cqw;background:rgba(255,255,255,.06)">' + t + '</div>'; }).join('') + '</div></div>' +
        [['shield', 'Finanzamt'], ['chart', 'BWA monatlich'], ['book', 'Jahresabschluss'], ['users', 'Lohn']].map(function (n, k) { return '<div style="position:absolute;right:26%;width:20%;transform:translate(100%,-50%);top:' + ((175 + k * 80) / 6.4) + '%">' + node(n[0], n[1]) + '</div>'; }).join('') + '</div>' },
    { label: 'Laufende Buchhaltung', description: 'Wir buchen jeden Monat, du siehst es live in der App. Rückfragen kommen gesammelt, nicht als Zettelwirtschaft.',
      html: '<div class="kpanel" style="' + dk + 'padding:4cqw"><div style="border-radius:1.4cqw;background:rgba(20,20,22,.8);border:1px solid rgba(255,255,255,.08);padding:2cqw;height:100%"><div style="display:flex;justify-content:space-between;font-size:1.3cqw;margin-bottom:1.6cqw"><span>Buchungen Oktober</span><span style="color:rgba(255,255,255,.5)">212 von 214 erledigt</span></div>' +
        [['07.10.', 'Holz Hauser GmbH', 'Material', '−1.284,60', 'Gebucht'], ['08.10.', 'Familie Reiter · Abschlag', 'Erlöse 19 %', '+6.000,00', 'Gebucht'], ['09.10.', 'Werkzeug &amp; Beschlag Kolbermoor', 'Kleinmaterial', '−212,35', 'Gebucht'], ['10.10.', 'Finanzamt · USt Q3', 'Steuer', '−6.418,00', 'Gebucht'], ['12.10.', 'Tankstelle Giesing', 'Fahrzeug', '−96,40', 'Gebucht'], ['14.10.', 'Barverkauf Messe', 'Erlöse', '+380,00', 'Rückfrage']].map(function (r) { return '<div style="display:grid;grid-template-columns:7% 38% 22% 17% 16%;padding:1cqw 0;border-top:1px solid rgba(255,255,255,.07);font-size:1.1cqw;color:rgba(255,255,255,.8)"><span style="color:rgba(255,255,255,.45)">' + r[0] + '</span><span>' + r[1] + '</span><span style="color:rgba(255,255,255,.5)">' + r[2] + '</span><span class="tabular" style="text-align:right">' + r[3] + '</span><span style="text-align:right;color:' + (r[4] === 'Gebucht' ? '#8fd6a9' : '#f2b99a') + '">' + r[4] + '</span></div>'; }).join('') + '</div></div>' },
    { label: 'Jahresabschluss', description: 'Bilanz oder EÜR, Steuererklärungen und alle Fristen. Du unterschreibst digital, die Kuhglocke läutet.',
      html: '<div class="kpanel" style="' + dk + 'display:grid;place-items:center"><div style="width:52%;border-radius:1.4cqw;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);padding:2.4cqw"><div style="font-family:var(--serif);font-size:2.4cqw">Jahresabschluss 2025</div><div style="color:rgba(255,255,255,.5);font-size:1.1cqw;margin:.4cqw 0 1.8cqw">Schreinerei Brandl · Frist 31.07.2026</div><div style="height:.6cqw;border-radius:1cqw;background:rgba(255,255,255,.08);overflow:hidden"><i style="display:block;width:100%;height:100%;background:#fbe1d1"></i></div>' +
        ['Belege vollständig', 'Inventur & Anlagen', 'Bilanz erstellt', 'Steuererklärungen übermittelt', 'Freigabe durch Andreas'].map(function (t) { return '<div style="display:flex;gap:1cqw;align-items:center;padding:1cqw 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:1.2cqw">' + ic('check-circle', 'width:1.6cqw;height:1.6cqw;color:#8fd6a9') + t + '</div>'; }).join('') + '<div style="margin-top:1.4cqw;font-size:1.1cqw;color:#fbe1d1">🔔 Abgegeben am 18. Juni – sechs Wochen vor Frist</div></div></div>' },
    { label: 'Lohnbuchhaltung', description: 'Im Paket Plus machen wir deine Löhne: Abrechnung, Meldungen an Krankenkassen und Finanzamt, alles fristgerecht.',
      html: '<div class="kpanel" style="' + dk + 'padding:4cqw"><div style="display:grid;grid-template-columns:1fr 1fr;gap:1.6cqw;height:100%">' +
        '<div style="border-radius:1.4cqw;background:rgba(20,20,22,.8);border:1px solid rgba(255,255,255,.08);padding:2cqw"><div style="font-size:1.3cqw;margin-bottom:1.2cqw">Lohnlauf Oktober · Elektro Obermaier</div>' + [['Florian Obermaier', '4.820,00'], ['Kerstin Haas', '3.160,00'], ['Tobias Wenger', '2.940,00'], ['Azubi: Jonas Reindl', '1.020,00'], ['+ 24 weitere', '71.880,00']].map(function (r) { return '<div style="display:flex;justify-content:space-between;padding:1cqw 0;border-top:1px solid rgba(255,255,255,.07);font-size:1.1cqw;color:rgba(255,255,255,.8)"><span>' + r[0] + '</span><span class="tabular">' + r[1] + ' €</span></div>'; }).join('') + '</div>' +
        '<div style="display:grid;gap:1.6cqw;align-content:start">' + [['28', 'Mitarbeitende abgerechnet'], ['83.820 €', 'Brutto gesamt'], ['25.10.', 'SV-Meldung übermittelt']].map(function (r) { return '<div style="border-radius:1.4cqw;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);padding:2cqw"><div style="font-size:2.6cqw;letter-spacing:-.02em" class="tabular">' + r[0] + '</div><div style="font-size:1.1cqw;color:rgba(255,255,255,.55)">' + r[1] + '</div></div>'; }).join('') + '</div></div></div>' },
    { label: 'Quartalsgespräch', description: 'Einmal im Quartal setzt du dich mit deinem Berater zusammen – im Werksviertel, in Rosenheim oder per Video.',
      html: '<div class="kpanel" style="' + dk + 'display:grid;grid-template-columns:1.2fr 1fr;gap:2cqw;padding:4cqw"><div style="border-radius:1.4cqw;overflow:hidden;position:relative;background:#222"><img src="assets/img/team-murat.webp" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.9"><div style="position:absolute;left:1.4cqw;bottom:1.4cqw;padding:.6cqw 1cqw;border-radius:.8cqw;background:rgba(0,0,0,.55);font-size:1.1cqw">Murat Kaya · Kontorhaus</div><div style="position:absolute;right:1.4cqw;bottom:1.4cqw;width:24%;aspect-ratio:3/4;border-radius:.8cqw;overflow:hidden;border:2px solid rgba(255,255,255,.3)"><img src="assets/img/kunde-brandl.webp" alt="" style="width:100%;height:100%;object-fit:cover"></div></div>' +
        '<div style="display:grid;gap:1.4cqw;align-content:start"><div style="border-radius:1.4cqw;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);padding:2cqw"><div style="font-size:1cqw;color:rgba(255,255,255,.5)">Do, 23. Oktober · 9:30–10:15</div><div style="font-family:var(--serif);font-size:2cqw;margin:.6cqw 0">Quartalsgespräch Q3</div><div style="font-size:1.1cqw;color:rgba(255,255,255,.7)">Raum „Hauptbuch“, Werksviertel – oder Video</div></div>' +
        '<div style="border-radius:1.4cqw;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);padding:2cqw;font-size:1.15cqw;line-height:1.7;color:rgba(255,255,255,.8)"><div style="color:rgba(255,255,255,.5);font-size:1cqw;margin-bottom:.6cqw">Agenda</div>1. Marge Q3 & Holzpreise<br>2. Sprinter: Abschreibung & IAB<br>3. Rücklage für Q4<br>4. Ausblick 2027</div></div></div>' }
  ];
  function initKanzlei() {
    var sec = $('[data-kanzlei]'); if (!sec) return;
    var wrap = $('[data-kpanels]', sec);
    wrap.innerHTML = KPANELS.map(function (p, i) { return p.html.replace('class="kpanel"', 'class="kpanel" data-k="' + i + '"'); }).join('');
    var panels = $$('.kpanel', wrap), cur = 0;
    panels.forEach(function (p, i) { if (i) p.style.opacity = 0; p.style.visibility = i ? 'hidden' : 'visible'; });
    if (window.gsap && !KH.reduce) {
      gsap.set(wrap, { scale: 0.8 });
      KH.inView(wrap, 'top bottom-=200', function () { gsap.to(wrap, { scale: 1, duration: 0.6, ease: 'expo.out' }); }, function () { gsap.to(wrap, { scale: 0.8, duration: 0.3, ease: 'expo.out' }); });
      gsap.to($$('.flow', wrap), { strokeDashoffset: -40, duration: 2, ease: 'none', repeat: -1 });
      gsap.set($$('.flow', wrap), { strokeDasharray: '6 14', stroke: 'rgba(251,225,209,.55)' });
    }
    KH.tabs({
      list: $('[data-ktabs]', sec), hList: $('[data-ktabs-h]', sec), hDesc: $('[data-ktabs-desc]', sec),
      items: KPANELS, onSelect: function (i) {
        if (i === cur) return;
        var old = panels[cur], nu = panels[i]; cur = i;
        if (!window.gsap || KH.reduce) { old.style.visibility = 'hidden'; old.style.opacity = 0; nu.style.visibility = 'visible'; nu.style.opacity = 1; return; }
        var d = 0.6, tl = gsap.timeline();
        tl.to(old, { scale: 0.8, opacity: 0, duration: 0.6 * d, ease: 'power2.in', onComplete: function () { old.style.visibility = 'hidden'; } }, 0);
        tl.fromTo(nu, { scale: 0.8, opacity: 0, visibility: 'visible' }, { scale: 1, opacity: 1, duration: d, ease: 'expo.out' }, 0.3 * d);
      }
    }).select(0, true);
  }

  /* ================= KI-ANSICHT + MINI-KARTEN ================= */
  function initAi() {
    var shot = $('[data-ai-shot]');
    if (shot) shot.innerHTML =
      '<div style="position:absolute;inset:0;font-size:1.65cqw;padding:3.4cqw 4cqw">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;color:var(--slate);font-size:1.5cqw"><span style="display:flex;gap:1.4cqw;align-items:center">' + ic('chev-left', 'width:1.8cqw;height:1.8cqw') + '<b style="color:#17191c;font-weight:480">Umsatz vs. Vorjahr</b>' + ic('chev-down', 'width:1.4cqw;height:1.4cqw') + '</span><span>+ Neuer Chat</span></div>' +
      '<div style="display:flex;justify-content:flex-end;margin:3.4cqw 0 2.6cqw"><div style="background:#f3f3f5;border-radius:1.6cqw;padding:1.4cqw 2cqw;max-width:62%">Warum lag der Umsatz im September unter dem August?</div></div>' +
      '<div style="color:var(--slate);font-size:1.4cqw;margin-bottom:1.6cqw">Denkt nach › 4 Konten · 186 Buchungen</div>' +
      '<p style="margin:0 0 1.2cqw;line-height:1.55"><span class="chip">Umsatz</span> ging um <b>4.200 € (−8 %)</b> zurück. Das liegt fast komplett an einem Auftrag:</p>' +
      '<p style="margin:0 0 2.4cqw;line-height:1.55"><b>Küche Reiter verschoben</b> — die Schlussrechnung über 17.120 € geht erst im Oktober raus. Ohne diesen Effekt lägst du <b>6 % über</b> dem Vorjahr.</p>' +
      '<div style="border-radius:1.6cqw;box-shadow:0 0 0 1px #ececef;padding:2cqw 2.4cqw"><div style="display:flex;justify-content:space-between"><b style="font-weight:500">Umsatz-Entwicklung</b><span style="color:var(--slate);font-size:1.3cqw">letzte 30 Tage</span></div><div style="display:flex;gap:2cqw;font-size:1.25cqw;color:var(--slate);margin:1cqw 0 .6cqw"><span><i style="display:inline-block;width:1cqw;height:1cqw;border-radius:50%;background:#3a66a8;margin-right:.6cqw"></i>2026</span><span><i style="display:inline-block;width:1cqw;height:1cqw;border-radius:50%;background:#e8a589;margin-right:.6cqw"></i>2025</span></div>' +
      '<svg viewBox="0 0 700 220" style="width:100%"><g stroke="#f0f0f2"><path d="M0 30H700M0 90H700M0 150H700M0 210H700"/></g><path data-draw d="M0 170 L60 150 L120 160 L180 130 L240 138 L300 110 L360 120 L420 92 L480 100 L540 70 L600 80 L660 52 L700 58" fill="none" stroke="#3a66a8" stroke-width="3"/><path data-draw d="M0 180 L60 172 L120 168 L180 160 L240 150 L300 146 L360 136 L420 130 L480 120 L540 116 L600 108 L660 100 L700 96" fill="none" stroke="#e8a589" stroke-width="3"/><circle cx="660" cy="52" r="7" fill="#fff" stroke="#3a66a8" stroke-width="3"/></svg></div>' +
      '<div style="position:absolute;left:4cqw;right:4cqw;bottom:3cqw;border-radius:2cqw;box-shadow:0 0 0 1px #e6e6e9;padding:1.8cqw 2cqw"><span class="chip" style="font-size:1.25cqw">' + ic('calendar', 'width:1.3cqw;height:1.3cqw') + 'Diesen Monat</span><div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.2cqw"><span>Welche Aufträge kommen im November rein?</span><span class="send" style="width:3.6cqw;height:3.6cqw">' + ic('arrow-up', 'width:1.6cqw;height:1.6cqw') + '</span></div></div></div>';
    if (shot && window.gsap && !KH.reduce) {
      var paths = $$('[data-draw]', shot);
      paths.forEach(function (p) { var L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      KH.inView(shot, 'top 75%', function () { gsap.to(paths, { strokeDashoffset: 0, duration: 1.6, stagger: 0.2, ease: 'power2.inOut' }); });
    }
    var minis = {
      trust: '<div style="position:absolute;inset:7cqw 7cqw auto 7cqw;font-size:3.4cqw;border-radius:3cqw;background:#fff;box-shadow:var(--shadow-float);padding:5cqw"><b style="font-weight:500">Wichtige Kennzahlen</b><div style="margin-top:3cqw;display:grid;gap:2.4cqw">' + [['Umsatz', '48.320 €', '+6 %'], ['Rohertrag', '54 %', '±0'], ['Offene Posten', '18.240 €', '−12 %']].map(function (r) { return '<div style="display:flex;justify-content:space-between;align-items:center"><span class="chip" style="font-size:3cqw">' + r[0] + '</span><span class="tabular">' + r[1] + '</span><span style="color:#2d8a5b" class="tabular">' + r[2] + '</span></div>'; }).join('') + '</div></div>',
      report: '<div style="position:absolute;inset:7cqw -4cqw -4cqw 7cqw;border-radius:3cqw;background:#fff;box-shadow:var(--shadow-float);padding:5cqw;font-size:3.2cqw"><div style="color:#5d2a1a">' + ic('spark', 'width:5cqw;height:5cqw') + '</div><div style="font-family:var(--serif);font-size:6.4cqw;margin:2cqw 0 3cqw">Monatsbericht Oktober</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:3cqw"><div style="border-radius:2cqw;background:#f2f2f3;padding:3cqw"><small style="color:var(--slate)">Umsatz</small><div style="font-size:5cqw" class="tabular">48.320 €</div></div><div style="border-radius:2cqw;background:#f2f2f3;padding:3cqw"><small style="color:var(--slate)">Auszahlbar</small><div style="font-size:5cqw" class="tabular">4.850 €</div></div></div></div>',
      berater: '<div style="position:absolute;inset:0;display:grid;place-items:center"><div style="position:relative;width:76%;height:70%"><svg viewBox="0 0 300 200" style="position:absolute;inset:0;width:100%;height:100%" fill="none" stroke="#d6d7db" stroke-width="1.4"><path d="M50 50 C 50 120, 150 90, 150 150M150 50V150M250 50 C 250 120, 150 90, 150 150"/></svg>' +
        [['8%', '0', 'Belege', 'receipt'], ['41%', '0', 'Rücklage', 'piggy'], ['74%', '0', 'Chat', 'chat']].map(function (r) { return '<div style="position:absolute;left:' + r[0] + ';top:' + r[1] + ';text-align:center;font-size:3cqw;color:var(--slate)"><div style="width:12cqw;height:12cqw;border-radius:50%;background:#fff;box-shadow:var(--shadow-pop);display:grid;place-items:center;color:#17191c;margin:0 auto 1.4cqw">' + ic(r[3], 'width:5cqw;height:5cqw') + '</div>' + r[2] + '</div>'; }).join('') +
        '<div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);text-align:center;font-size:3cqw;color:var(--slate)"><img src="assets/img/team-johanna.webp" alt="" style="width:14cqw;height:14cqw;border-radius:50%;object-fit:cover;box-shadow:var(--shadow-pop);margin:0 auto 1.4cqw">Johanna, Rosenheim</div></div></div>'
    };
    $$('[data-mini]').forEach(function (b) { b.innerHTML = minis[b.getAttribute('data-mini')] || ''; });
  }

  /* ================= TÜR ================= */
  function initDoor() {
    var door = $('[data-door]'); if (!door || !window.gsap || KH.reduce) return;
    var leaf = $('[data-door-leaf]', door), light = $('[data-door-light]', door);
    var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
    tl.to(leaf, { rotationY: -64, duration: 1.8, ease: 'power2.inOut' }, 0.4)
      .to(light, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.9)
      .to(leaf, { rotationY: -58, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 2.2)
      .to(leaf, { rotationY: 0, duration: 1.6, ease: 'power2.inOut' }, 5.2)
      .to(light, { opacity: 0, duration: 1, ease: 'power2.in' }, 5.3);
    new IntersectionObserver(function (es) { es[0].isIntersecting ? tl.play() : tl.pause(); }).observe(door);
  }

  /* Einzelne Szene als Endlosschleife: <div class="appwin" data-scene="2"></div> */
  function initSceneEmbeds() {
    $$('[data-scene]').forEach(function (win) {
      var i = +win.getAttribute('data-scene'), sc = SCENES[i]; if (!sc) return;
      win.innerHTML = '<div class="scene is-on">' + sc.html() + '</div>';
      if (!window.gsap || KH.reduce) return;
      var el = win.firstChild, tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.5 });
      sc.tl(el, tl);
      tl.to({}, { duration: Math.max(0.01, sc.duration - tl.duration()) });
      new IntersectionObserver(function (es) { es[0].isIntersecting ? tl.play() : tl.pause(); }, { rootMargin: '-80px' }).observe(win);
    });
  }
  KH.SCENES = SCENES;

  /* ================= Start ================= */
  buildDock();
  buildMobileShot();
  initAi();
  KH.onBoot.push(function () {
    heroInit(); lastW = window.innerWidth;
    initCards(); initProduct(); initSceneEmbeds(); initStory(); initKanzlei(); initDoor();
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { if (Math.abs(window.innerWidth - lastW) > 2) { lastW = window.innerWidth; heroInit(); ScrollTrigger.refresh(); } }, 200);
    });
  });
})();
