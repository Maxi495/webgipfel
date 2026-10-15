/* Kontorhaus – Seite „Kanzlei & Team“: Meilenstein-Zeitstrahl, Zahlen, Team-Karten, Karte, Beteiligungsbalken. */
(function () {
  var KH = window.KH = window.KH || {};
  KH.onBoot = KH.onBoot || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Zeitstrahl: Linie zeichnet sich beim Scrollen, Punkte ploppen ---------- */
  function initTimeline() {
    var tl = $('[data-tl]'); if (!tl) return;
    var items = $$('.tl__item', tl);
    if (!window.gsap || KH.reduce) return;
    tl.classList.add('is-anim');
    gsap.fromTo($('.tl__fill', tl), { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: $('.tl__line', tl), start: 'top 62%', end: 'bottom 62%', scrub: 0.4 }
    });
    items.forEach(function (it) {
      ScrollTrigger.create({
        trigger: $('.tl__dot', it), start: 'center 62%',
        onEnter: function () { it.classList.add('is-on'); },
        onLeaveBack: function () { it.classList.remove('is-on'); }
      });
    });
  }

  /* ---------- Zahlen zählen hoch ---------- */
  function initCounts() {
    if (!window.gsap || KH.reduce) return;
    $$('[data-count]').forEach(function (el, i) {
      var to = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '';
      el.textContent = KH.fmt(0) + suffix;
      var t = gsap.timeline({ paused: true });
      KH.countTo(t, el, to, { suffix: suffix, duration: 1.8, ease: 'power3.out' }, 0.15 + i * 0.1);
      KH.inView(el, 'top 88%', function () { t.play(); });
    });
  }

  /* ---------- Team: gestaffeltes Einblenden, Tippen klappt die Eigenheit auf ---------- */
  function initTeam() {
    var grid = $('[data-team]'); if (!grid) return;
    var cards = $$('.member', grid);
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        var open = !c.classList.contains('is-open');
        cards.forEach(function (o) { o.classList.remove('is-open'); });
        if (open) c.classList.add('is-open');
      });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
      c.addEventListener('blur', function () { c.classList.remove('is-open'); });
    });
    if (!window.gsap || KH.reduce) return;
    var all = $$(':scope > li', grid);
    gsap.set(all, { y: 50, opacity: 0 });
    ScrollTrigger.batch(all, {
      start: 'top 92%',
      onEnter: function (b) { gsap.to(b, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', overwrite: true }); },
      onLeaveBack: function (b) { gsap.to(b, { y: 50, opacity: 0, duration: 0.4, overwrite: true }); }
    });
  }

  /* ---------- Karte: Kundenpunkte, Umriss, Pins fallen ---------- */
  function initMap() {
    var map = $('[data-map]'); if (!map) return;
    var svg = $('svg', map), dotsG = $('[data-map-dots]', map), outline = $('[data-map-outline]', map);
    var NS = 'http://www.w3.org/2000/svg';
    // deterministische Zufallszahlen, damit die Karte immer gleich aussieht
    var seed = 7; var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    var gauss = function () { return (rnd() + rnd() + rnd() - 1.5) / 1.5; };
    var clusters = [[193, 212, 62, 58], [272, 262, 46, 20], [315, 285, 40, 12], [172, 188, 30, 8], [150, 290, 40, 7], [215, 160, 40, 6], [171, 95, 30, 4]];
    var inside = function (x, y) {
      try { var p = svg.createSVGPoint(); p.x = x; p.y = y; return outline.isPointInFill(p); } catch (e) { return true; }
    };
    var dots = [];
    clusters.forEach(function (c) {
      var n = 0, guard = 0;
      while (n < c[3] && guard++ < 400) {
        var x = c[0] + gauss() * c[2], y = c[1] + gauss() * c[2] * 0.8;
        if (!inside(x, y) || y > 330) continue;
        var d = document.createElementNS(NS, 'circle');
        d.setAttribute('cx', x.toFixed(1)); d.setAttribute('cy', y.toFixed(1)); d.setAttribute('r', (1.4 + rnd() * 0.9).toFixed(2));
        dotsG.appendChild(d); dots.push(d); n++;
      }
    });

    // Karte ↔ Standortkarten verbinden
    $$('[data-loc]').forEach(function (card) {
      var pin = $('[data-pin="' + card.getAttribute('data-loc') + '"]', map);
      var on = function () { pin && pin.classList.add('is-hot'); card.classList.add('is-hot'); };
      var off = function () { pin && pin.classList.remove('is-hot'); card.classList.remove('is-hot'); };
      card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
      card.addEventListener('focus', on); card.addEventListener('blur', off);
    });

    if (!window.gsap || KH.reduce) return;
    var L = outline.getTotalLength();
    gsap.set(outline, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set(dots, { opacity: 0 });
    var drops = $$('.pin__drop', map);
    gsap.set(drops, { y: -46, opacity: 0 });
    gsap.set($$('.map__labels text', map), { opacity: 0, y: 6 });
    var t = gsap.timeline({ paused: true });
    t.to(outline, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to(dots, { opacity: 0.22, duration: 0.4, stagger: { each: 0.012, from: 'random' } }, 0.5)
      .to(drops, { y: 0, opacity: 1, duration: 0.9, stagger: 0.25, ease: 'bounce.out' }, 1)
      .to($$('.map__labels text', map), { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.5);
    KH.inView(map, 'top 75%', function () { t.play(); });
  }

  /* ---------- Beteiligungsbalken ---------- */
  function initOwn() {
    var own = $('[data-own]'); if (!own || !window.gsap || KH.reduce) return;
    var bars = $$('.own__bar i', own);
    var t = gsap.timeline({ paused: true }).from(bars, { width: 0, minWidth: 0, duration: 1.2, stagger: 0.15, ease: 'power3.inOut' });
    KH.inView(own, 'top 85%', function () { t.play(); });
  }

  KH.onBoot.push(function () {
    initTimeline(); initCounts(); initTeam(); initMap(); initOwn();
  });
})();
