/* Kontorhaus – Datenschutz: Inhaltsverzeichnis: aktiven Abschnitt markieren */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-toc] a'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function upd() {
    var y = window.innerHeight * 0.3, cur = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('is-active', i === cur); });
  }
  window.addEventListener('scroll', upd, { passive: true }); upd();
})();
