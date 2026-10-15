/* Kontorhaus – Seite „Karriere“: Stellen-Akkordeon und Roadmap-Linie. */
(function () {
  var KH = window.KH = window.KH || {};
  KH.onBoot = KH.onBoot || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var anim = function () { return window.gsap && !KH.reduce; };

  /* ---------- Akkordeon: weiche Höhenanimation, immer nur eine Stelle offen ---------- */
  function initJobs() {
    var wrap = $('[data-jobs]'); if (!wrap) return;
    wrap.classList.add('js-acc');
    var jobs = $$('.job', wrap);
    var setOpen = function (job, open, instant) {
      var btn = $('.job__btn', job), panel = $('.job__panel', job);
      job.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.inert = !open;
      if (!anim() || instant) { panel.style.height = open ? 'auto' : '0px'; return; }
      gsap.killTweensOf(panel);
      if (open) {
        gsap.fromTo(panel, { height: panel.offsetHeight }, { height: 'auto', duration: 0.6, ease: 'power3.inOut', onComplete: function () { ScrollTrigger.refresh(); } });
        gsap.fromTo($$('.job__intro, .job__cols > div, .job__cta', panel), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.15, ease: 'power3.out' });
      } else {
        gsap.to(panel, { height: 0, duration: 0.45, ease: 'power3.inOut', onComplete: function () { ScrollTrigger.refresh(); } });
      }
    };
    jobs.forEach(function (job) {
      setOpen(job, false, true);
      $('.job__btn', job).addEventListener('click', function () {
        var willOpen = !job.classList.contains('is-open');
        jobs.forEach(function (o) { if (o !== job && o.classList.contains('is-open')) setOpen(o, false); });
        setOpen(job, willOpen);
      });
    });
    // Direktlink (#job-…) oder Klick auf „Dafür brauchen wir“ öffnet die passende Stelle
    var openHash = function (hash, scroll) {
      var job = hash && hash.indexOf('#job-') === 0 ? document.getElementById(hash.slice(1)) : null;
      if (!job || !job.classList.contains('job')) return;
      jobs.forEach(function (o) { if (o !== job) setOpen(o, false, true); });
      setOpen(job, true, !scroll);
      if (scroll) job.scrollIntoView({ behavior: KH.reduce ? 'auto' : 'smooth', block: 'start' });
    };
    $$('a[href^="#job-"]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); history.replaceState(null, '', a.getAttribute('href')); openHash(a.getAttribute('href'), true); });
    });
    if (location.hash) openHash(location.hash, false);
    window.addEventListener("hashchange", function () { openHash(location.hash, true); });
  }

  /* ---------- Roadmap: Linie zieht sich durch, danach Punkte ---------- */
  function initRoad() {
    var road = $('[data-road]'); if (!road || !anim()) return;
    var line = $('.road__line i', road), dots = $$('.road__dot', road);
    var vertical = function () { return window.innerWidth < 1024; };
    gsap.set(line, vertical() ? { scaleY: 0, scaleX: 1 } : { scaleX: 0, scaleY: 1 });
    gsap.set(dots, { scale: 0 });
    var t = gsap.timeline({ paused: true });
    t.to(line, { scaleX: 1, scaleY: 1, duration: 1.6, ease: 'power2.inOut' }, 0.1)
      .to(dots, { scale: 1, duration: 0.5, stagger: 0.38, ease: 'back.out(3)' }, 0.15);
    KH.inView(road, KH.startFor(), function () { t.play(); }, function () { if (t.progress() > 0) t.reverse(); });
  }

  initJobs(); // sofort, damit die Stellen nicht kurz aufgeklappt aufblitzen
  KH.onBoot.push(initRoad);
})();
