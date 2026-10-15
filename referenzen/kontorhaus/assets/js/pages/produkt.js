/* Produkt – klebende Modul-Navigation: aktives Modul markieren, beim Kleben Linie zeigen. */
(function () {
  var nav = document.querySelector('[data-modnav]');
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var row = nav.querySelector('.modnav__row');
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var current = -1;

  function setActive(i) {
    if (i === current) return;
    current = i;
    links.forEach(function (a, j) {
      a.classList.toggle('is-active', j === i);
      if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    var a = links[i];
    if (a && row.scrollWidth > row.clientWidth) row.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' });
  }

  function update() {
    var line = 64 + nav.offsetHeight + window.innerHeight * 0.25, idx = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) idx = i; });
    var last = secs[secs.length - 1];
    if (last && last.getBoundingClientRect().bottom < 64 + nav.offsetHeight) idx = -1;
    setActive(idx);
    nav.classList.toggle('is-stuck', nav.getBoundingClientRect().top <= 64.5);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);

  /* Sanft zum Modul scrollen, unter Navigation + Modulleiste */
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      var s = secs[i]; if (!s) return;
      e.preventDefault();
      var y = s.getBoundingClientRect().top + window.pageYOffset - 64 - nav.offsetHeight + 1;
      window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });
  update();
})();
