/* Kontorhaus – „Für Handwerk“: Rücklage-Rechner (grobe Schätzung).
   Annahmen: 19 % USt, Vorsteuer nur auf Material; vom Rohertrag bleiben ~45 % Gewinn,
   darauf ~30 % Einkommen- und Gewerbesteuer. Werte auf 10 € gerundet. */
(function () {
  var box = document.querySelector('[data-calc]');
  if (!box) return;
  var KH = window.KH || {};
  var fmt = KH.fmt || function (n) { return Math.round(n).toLocaleString('de-DE'); };
  var USt = 0.19, GEWINN = 0.45, ESt = 0.30;

  var inU = box.querySelector('[data-in="u"]'), inM = box.querySelector('[data-in="m"]');
  var outU = box.querySelector('[data-out="u"]'), outM = box.querySelector('[data-out="m"]');
  var res = {
    total: box.querySelector('[data-res="total"]'), ust: box.querySelector('[data-res="ust"]'),
    est: box.querySelector('[data-res="est"]'), year: box.querySelector('[data-res="year"]')
  };
  var barU = box.querySelector('[data-bar="ust"]'), barE = box.querySelector('[data-bar="est"]');
  var presets = Array.prototype.slice.call(box.querySelectorAll('[data-preset]'));
  var shown = { total: 0, ust: 0, est: 0, year: 0 };
  var tween = null, io = null;

  function r10(n) { return Math.round(n / 10) * 10; }
  function fill(input) {
    var p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty('--p', p + '%');
  }
  function paint(v) {
    res.total.textContent = fmt(v.total) + ' €';
    res.ust.textContent = fmt(v.ust) + ' €';
    res.est.textContent = fmt(v.est) + ' €';
    res.year.textContent = fmt(v.year) + ' €';
  }
  function calc(animate) {
    var u = +inU.value, m = +inM.value / 100;
    var roh = u * (1 - m);
    var ust = r10(USt * roh);
    var est = r10(roh * GEWINN * ESt);
    var target = { ust: ust, est: est, total: ust + est, year: (ust + est) * 12 };
    outU.textContent = fmt(u) + ' €';
    outM.textContent = Math.round(m * 100) + ' %';
    fill(inU); fill(inM);
    var sum = target.total || 1;
    barU.style.width = (target.ust / sum * 100) + '%';
    barE.style.width = (target.est / sum * 100) + '%';
    if (animate && io) { io.disconnect(); io = null; }
    if (tween) tween.kill();
    if (animate && window.gsap && !KH.reduce) {
      tween = gsap.to(shown, {
        total: target.total, ust: target.ust, est: target.est, year: target.year,
        duration: 0.6, ease: 'power2.out',
        onUpdate: function () { paint({ total: r10(shown.total), ust: r10(shown.ust), est: r10(shown.est), year: r10(shown.year) }); }
      });
    } else {
      shown = target; paint(target);
    }
  }
  function clearPreset() { presets.forEach(function (b) { b.classList.remove('is-active'); }); }

  inU.addEventListener('input', function () { clearPreset(); calc(true); });
  inM.addEventListener('input', function () { clearPreset(); calc(true); });
  presets.forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-preset').split(',');
      inU.value = v[0]; inM.value = v[1];
      clearPreset(); b.classList.add('is-active');
      calc(true);
    });
  });

  calc(false);
  /* Beim ersten Sichtkontakt einmal von 0 hochzählen */
  if (window.gsap && !KH.reduce && 'IntersectionObserver' in window) {
    var target = { total: shown.total, ust: shown.ust, est: shown.est, year: shown.year };
    shown = { total: 0, ust: 0, est: 0, year: 0 }; paint(shown);
    io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting || !io) return;
      io.disconnect(); io = null;
      tween = gsap.to(shown, {
        total: target.total, ust: target.ust, est: target.est, year: target.year, duration: 1.4, ease: 'power3.out', delay: 0.2,
        onUpdate: function () { paint({ total: r10(shown.total), ust: r10(shown.ust), est: r10(shown.est), year: r10(shown.year) }); }
      });
    }, { threshold: 0.4 });
    io.observe(res.total);
  }
})();
