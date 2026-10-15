/* Kontorhaus – „Für Gastro“
   1) App-Szenen (Belege, Rücklage) auf das Café Goldammer umbeschriften. Läuft vor KH.onBoot,
      also bevor components.js die Szenen einsetzt; ändert nur das HTML dieser Seite.
   2) Wareneinsatz-Check mit Tacho (Richtwerte, keine Steuerberatung). */
(function () {
  var KH = window.KH || {};

  /* ---------- 1) Szenen fürs Café ---------- */
  if (KH.SCENES) {
    var common = [
      ['<span class="ws-logo">B</span>Schreinerei Brandl', '<span class="ws-logo">K</span>Café Goldammer']
    ];
    var swaps = {
      1: common.concat([
        ['HOLZ HAUSER GMBH', 'ISARBOHNE RÖSTEREI'],
        ['Holz Hauser GmbH', 'Isarbohne Rösterei'],
        ['Am Sägewerk 3<br>85540 Haar', 'Am Kartoffelspeicher 2<br>81541 München'],
        ['Eiche massiv 26 mm<br>4,2 m² × 241,00', 'Siebträger-Service<br>Mühle, Dichtungen'],
        ['Material · Holz', 'Instandhaltung · Küche'],
        ['Werkzeug &amp; Beschlag Kolbermoor', 'Milchhof Gruber'],
        ['Tankstelle Giesing', 'Bäckerei Brezenhuber'],
        ['Baumarkt Moosach', 'Großmarkt München'],
        ['Telekom', 'Getränke Weinzierl']
      ]),
      3: common
    };
    Object.keys(swaps).forEach(function (i) {
      var sc = KH.SCENES[i]; if (!sc) return;
      var orig = sc.html;
      sc.html = function () {
        var h = orig();
        swaps[i].forEach(function (p) { h = h.split(p[0]).join(p[1]); });
        return h;
      };
    });
  }

  /* ---------- 2) Wareneinsatz-Check ---------- */
  var box = document.querySelector('[data-wcheck]');
  if (!box) return;
  var TYPES = {
    cafe: { lo: 24, hi: 30, name: 'ein Café' },
    baeckerei: { lo: 22, hi: 30, name: 'eine Bäckerei' },
    restaurant: { lo: 27, hi: 34, name: 'ein Wirtshaus' },
    truck: { lo: 26, hi: 34, name: 'einen Foodtruck' }
  };
  var MAX = 60, CX = 120, CY = 120, R = 100;
  var inU = box.querySelector('[data-wc="u"]'), inE = box.querySelector('[data-wc="e"]');
  var outPct = box.querySelector('[data-wc-pct]'), outVerdict = box.querySelector('[data-wc-verdict]'), outRange = box.querySelector('[data-wc-range]');
  var zone = box.querySelector('[data-zone]'), needle = box.querySelector('[data-needle]'), ticks = box.querySelector('.gauge__ticks');
  var anim = !!window.gsap && !KH.reduce;
  var shown = { p: 0 }, tween = null, started = false;

  function pt(p, r) {
    var a = Math.PI - (Math.min(Math.max(p, 0), MAX) / MAX) * Math.PI;
    return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
  }
  function f1(n) { return Math.round(n * 10) / 10; }
  /* Skala */
  var svgNS = 'http://www.w3.org/2000/svg', tk = '';
  for (var t = 0; t <= MAX; t += 10) {
    var a = pt(t, 84), b = pt(t, 90);
    tk += '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>';
    if (t % 30 === 0) { var l = pt(t, 70); tk += '<text x="' + f1(l[0]) + '" y="' + f1(l[1] + 3) + '" text-anchor="' + (t === 0 ? 'start' : t === MAX ? 'end' : 'middle') + '">' + t + ' %</text>'; }
  }
  ticks.innerHTML = tk;
  void svgNS;

  function parse(v) { var n = parseInt(String(v).replace(/[^\d]/g, ''), 10); return isNaN(n) ? 0 : n; }
  function fmtNum(n) { return n ? n.toLocaleString('de-DE') : ''; }
  function type() { var c = box.querySelector('input[name="wc-type"]:checked'); return TYPES[c ? c.value : 'cafe']; }
  function drawNeedle(p) {
    var rot = (Math.min(Math.max(p, 0), MAX) / MAX) * 180 - 90;
    needle.setAttribute('transform', 'rotate(' + f1(rot) + ' ' + CX + ' ' + CY + ')');
    outPct.textContent = Math.round(p) + ' %';
  }
  function verdict(p, ty, u) {
    if (!u) return 'Trag deinen Umsatz ein, dann rechnen wir.';
    if (p < ty.lo - 8) return 'Auffällig niedrig. Fehlen vielleicht ein paar Einkaufsbelege?';
    if (p < ty.lo) return 'Schlank kalkuliert – stark. Schau nur, dass die Qualität mithält.';
    if (p <= ty.hi) return 'Passt. Du liegst im üblichen Rahmen für ' + ty.name + '.';
    if (p <= ty.hi + 5) return 'Etwas drüber. Ein Blick auf Einkaufspreise oder Portionen lohnt sich.';
    return 'Da bleibt zu wenig hängen. Lass uns zusammen draufschauen – Murat hat ein paar Ideen.';
  }
  function update(animate) {
    var u = parse(inU.value), e = parse(inE.value), ty = type();
    var p = u ? (e / u) * 100 : 0;
    var a = pt(ty.lo, R), b = pt(ty.hi, R);
    zone.setAttribute('d', 'M' + f1(a[0]) + ' ' + f1(a[1]) + ' A' + R + ' ' + R + ' 0 0 1 ' + f1(b[0]) + ' ' + f1(b[1]));
    outRange.textContent = 'Üblich für ' + ty.name + ': ' + ty.lo + '–' + ty.hi + ' %';
    outVerdict.textContent = verdict(p, ty, u);
    if (tween) tween.kill();
    if (animate && anim) {
      tween = gsap.to(shown, { p: p, duration: 0.9, ease: 'elastic.out(1, 0.75)', onUpdate: function () { drawNeedle(shown.p); } });
    } else { shown.p = p; drawNeedle(p); }
  }

  [inU, inE].forEach(function (inp) {
    inp.addEventListener('input', function () { started = true; update(true); });
    inp.addEventListener('blur', function () { inp.value = fmtNum(parse(inp.value)); });
    inp.addEventListener('focus', function () { inp.select(); });
  });
  box.querySelectorAll('input[name="wc-type"]').forEach(function (r) { r.addEventListener('change', function () { started = true; update(true); }); });

  if (anim && 'IntersectionObserver' in window) {
    update(false); shown.p = 0; drawNeedle(0);
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      if (!started) { tween = gsap.to(shown, { p: parse(inE.value) / (parse(inU.value) || 1) * 100, duration: 1.6, delay: 0.2, ease: 'elastic.out(1, 0.6)', onUpdate: function () { drawNeedle(shown.p); } }); }
    }, { threshold: 0.4 });
    io.observe(box.querySelector('.gauge'));
  } else {
    update(false);
  }
})();
