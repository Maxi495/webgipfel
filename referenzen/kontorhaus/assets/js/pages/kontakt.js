/* Kontorhaus – Kontaktseite: Testformular, Terminbuchung, Karte, Öffnungszeiten.
   Konzeptprojekt: Es wird nichts gesendet oder gespeichert. */
(function () {
  var KH = window.KH || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hasGsap = !!window.gsap;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  var WDL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var MON = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  var MONL = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- Live-Status & Öffnungszeiten ---------- */
  var now = new Date(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
  var phoneOpen = day >= 1 && day <= 5 && mins >= 480 && mins < 1080;
  var dot = $('[data-live-dot]'), txt = $('[data-live-text]');
  if (dot && txt && !phoneOpen) {
    dot.classList.add('is-off');
    txt.textContent = 'Gerade ist Feierabend – schreib uns, Leon meldet sich am nächsten Werktag.';
  }
  var HOURS = {
    muc: { 1: [480, 1080], 2: [480, 1080], 3: [480, 1080], 4: [480, 1080], 5: [480, 960] },
    ros: { 2: [540, 1020], 3: [540, 1020], 4: [540, 1020], 5: [540, 780] }
  };
  $$('[data-hours]').forEach(function (card) {
    var h = HOURS[card.getAttribute('data-hours')];
    $$('tr[data-d]', card).forEach(function (tr) {
      if (tr.getAttribute('data-d').split(',').indexOf(String(day)) > -1) tr.classList.add('is-today');
    });
    var st = $('[data-status]', card), t = h[day];
    var open = t && mins >= t[0] && mins < t[1];
    if (st) st.innerHTML = '<i class="live__dot' + (open ? '' : ' is-off') + '"></i>' + (open ? 'Gerade geöffnet' : 'Gerade geschlossen');
  });

  /* ---------- Konfetti (klein, ruhig) ---------- */
  function confetti(box) {
    if (!box || !hasGsap || reduce) return;
    var cols = ['#17191c', '#d3e3fc', '#d8efdf', '#c9cbd1', '#f3d3bf'];
    box.innerHTML = '';
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('i');
      p.style.background = cols[i % cols.length];
      box.appendChild(p);
      var a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 180;
      gsap.fromTo(p, { x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 + Math.random() * 0.8 },
        { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7 + 120, rotate: Math.random() * 540 - 270, opacity: 0, duration: 1.4 + Math.random() * 0.6, ease: 'power3.out', delay: 0.45 });
    }
  }

  function scrollIntoViewIfNeeded(el) {
    var r = el.getBoundingClientRect();
    if (r.top < 80 || r.top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + r.top - 100, behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- 30-Tage-Test ---------- */
  var trial = $('[data-trial]'), form = $('[data-trial-form]');
  if (trial && form) {
    var checks = {
      name: function (v) { return v.trim().length >= 2; },
      betrieb: function (v) { return v.trim().length >= 2; },
      branche: function (v) { return !!v; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
    };
    var validate = function (el) {
      var ok = checks[el.name](el.value);
      el.closest('.field').classList.toggle('is-error', !ok);
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    };
    Object.keys(checks).forEach(function (n) {
      var el = form.elements[n];
      el.addEventListener('blur', function () { if (el.value) validate(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-error')) validate(el); });
      el.addEventListener('change', function () { if (el.closest('.field').classList.contains('is-error')) validate(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      Object.keys(checks).forEach(function (n) { var el = form.elements[n]; if (!validate(el) && !first) first = el; });
      if (first) { first.focus(); return; }
      var paket = (form.querySelector('input[name="paket"]:checked') || {}).value || 'Werkstatt';
      var vorname = form.elements.name.value.trim().split(/\s+/)[0];
      var betrieb = form.elements.betrieb.value.trim();
      $('[data-trial-text]').innerHTML = 'Servus ' + esc(vorname) + '! Der Testzugang für <b>' + esc(betrieb) + '</b> mit Kontor ' + esc(paket) + ' ist vorgemerkt. Leon ruft kurz an, verbindet dein Konto und zeigt dir die ersten zehn Minuten.';
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      setTimeout(function () {
        btn.disabled = false;
        trial.classList.add('is-done');
        confetti($('[data-confetti]'));
        scrollIntoViewIfNeeded(trial);
        $('[data-trial-success] h3').setAttribute('tabindex', '-1');
        $('[data-trial-success] h3').focus({ preventScroll: true });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }, 450);
    });
    $('[data-trial-reset]').addEventListener('click', function () {
      form.reset();
      $$('.field', form).forEach(function (f) { f.classList.remove('is-error'); });
      trial.classList.remove('is-done');
      form.elements.name.focus();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  /* ---------- Terminbuchung ---------- */
  var booker = $('[data-booker]');
  if (booker) {
    var LOC = {
      muc: { name: 'Murat Kaya', first: 'Murat', img: 'assets/img/team-murat.webp', role: 'Partner, Leitung Kanzlei · 15 Jahre Gastro & Handwerk', where: 'Loft im Werksviertel, Kühlhausgasse 4, 4. OG', place: 'Werksviertel München, Kühlhausgasse 4', times: ['8:30', '9:30', '10:30', '11:30', '13:30', '14:30', '15:30', '16:30'] },
      ros: { name: 'Johanna Reiter', first: 'Johanna', img: 'assets/img/team-johanna.webp', role: 'Steuerberaterin · Hofläden, Landwirte & Chiemgau', where: 'Salzstadelgasse 7, 83022 Rosenheim', place: 'Salzstadelgasse 7, Rosenheim', times: ['9:00', '10:00', '11:00', '13:30', '14:30', '15:30'] },
      vid: { name: 'Murat Kaya', first: 'Murat', img: 'assets/img/team-murat.webp', role: 'Partner, Leitung Kanzlei · per Video aus dem Werksviertel', where: 'Per Video – den Link schicken wir dir vorher', place: 'Per Video', times: ['8:00', '9:00', '10:00', '11:00', '12:30', '14:00', '15:00', '16:00', '17:00'] }
    };
    var state = { loc: 'muc', day: null, time: null };
    var daysBox = $('[data-days]'), slotsBox = $('[data-slots]'), sum = $('[data-sum]'), bookBtn = $('[data-book]');

    // nächste 10 Werktage ab morgen
    var days = [], d = new Date(); d.setHours(12, 0, 0, 0);
    while (days.length < 10) { d.setDate(d.getDate() + 1); if (d.getDay() > 0 && d.getDay() < 6) days.push(new Date(d)); }

    var hash = function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
    var available = function (date, loc) {
      var key = date.toDateString() + loc, wd = date.getDay();
      return LOC[loc].times.map(function (t, i) {
        var ok = (hash(key + t) % 100) > 42;
        if (loc === 'ros' && (wd === 1 || (wd === 5 && i > 2))) ok = false;
        if (loc === 'muc' && wd === 5 && i > 5) ok = false;
        return ok;
      });
    };
    var freeCount = function (date, loc) { return available(date, loc).filter(Boolean).length; };

    function renderDays() {
      daysBox.innerHTML = days.map(function (dt, i) {
        var n = freeCount(dt, state.loc), dots = '';
        for (var k = 0; k < Math.min(3, Math.ceil(n / 2)); k++) dots += '<i></i>';
        return '<button class="day" type="button" data-i="' + i + '" aria-pressed="' + (state.day === i) + '" aria-label="' + WDL[dt.getDay()] + ', ' + dt.getDate() + '. ' + MONL[dt.getMonth()] + ', ' + n + ' freie Termine"' + (n ? '' : ' disabled style="opacity:.4"') + '><small>' + WD[dt.getDay()] + '</small><b class="tabular">' + dt.getDate() + '</b><small>' + MON[dt.getMonth()] + '</small><span class="dots">' + dots + '</span></button>';
      }).join('');
    }
    function renderSlots(animate) {
      if (state.day === null) {
        slotsBox.innerHTML = '<p class="slots-empty">Wähl zuerst einen Tag – dann zeigen wir dir die freien Zeiten.</p>';
        return;
      }
      var av = available(days[state.day], state.loc);
      slotsBox.innerHTML = LOC[state.loc].times.map(function (t, i) {
        return '<button class="slot" type="button" data-t="' + t + '" aria-pressed="' + (state.time === t) + '"' + (av[i] ? '' : ' disabled aria-label="' + t + ' Uhr, belegt"') + '>' + t + '</button>';
      }).join('');
      if (animate && hasGsap && !reduce) gsap.from($$('.slot', slotsBox), { y: 10, opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power3.out' });
    }
    function renderSum() {
      var L = LOC[state.loc];
      if (state.day !== null && state.time) {
        var dt = days[state.day];
        sum.innerHTML = '<b>' + WDL[dt.getDay()] + ', ' + dt.getDate() + '. ' + MONL[dt.getMonth()] + ', ' + state.time + ' Uhr</b> · mit ' + L.first;
        bookBtn.disabled = false;
      } else {
        sum.textContent = state.day === null ? 'Such dir einen Tag und eine Uhrzeit aus.' : 'Jetzt noch eine Uhrzeit.';
        bookBtn.disabled = true;
      }
    }
    function setLoc(loc) {
      var prev = LOC[state.loc];
      state.loc = loc;
      var L = LOC[loc];
      $$('[data-loc]', booker).forEach(function (b, i) {
        var on = b.getAttribute('data-loc') === loc;
        b.setAttribute('aria-pressed', on);
        if (on) $('[data-seg-thumb]').style.transform = 'translateX(' + (i * 100) + '%)';
      });
      // Berater wechseln (Bild + Text)
      var imgBox = $('[data-adv-img]'), txtBox = $('[data-adv-txt]');
      var swapTxt = function () {
        $('[data-adv-name]').textContent = L.name;
        $('[data-adv-role]').textContent = L.role;
        $('[data-adv-where]').textContent = L.where;
      };
      if (prev.img !== L.img) {
        var old = $('img', imgBox), nu = new Image();
        nu.src = L.img; nu.alt = ''; nu.width = 64; nu.height = 64; nu.className = 'is-out';
        imgBox.insertBefore(nu, imgBox.querySelector('.online'));
        old.classList.add('is-out');
        requestAnimationFrame(function () { requestAnimationFrame(function () { nu.classList.remove('is-out'); }); });
        setTimeout(function () { old.remove(); }, 500);
        txtBox.classList.add('is-out');
        setTimeout(function () { swapTxt(); txtBox.classList.remove('is-out'); }, 220);
      } else swapTxt();
      // Uhrzeit prüfen
      if (state.day !== null && freeCount(days[state.day], loc) === 0) state.day = null;
      if (state.time && (state.day === null || LOC[loc].times.indexOf(state.time) < 0 || !available(days[state.day], loc)[LOC[loc].times.indexOf(state.time)])) state.time = null;
      renderDays(); renderSlots(true); renderSum();
    }

    booker.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-loc]'))) setLoc(b.getAttribute('data-loc'));
      else if ((b = e.target.closest('.day'))) {
        state.day = +b.getAttribute('data-i'); state.time = null;
        $$('.day', daysBox).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        renderSlots(true); renderSum();
      } else if ((b = e.target.closest('.slot'))) {
        state.time = b.getAttribute('data-t');
        $$('.slot', slotsBox).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        renderSum();
      } else if (e.target.closest('[data-book]')) {
        if (state.day === null || !state.time) return;
        var L = LOC[state.loc], dt = days[state.day];
        var dateStr = WDL[dt.getDay()] + ', ' + dt.getDate() + '. ' + MONL[dt.getMonth()];
        $('[data-conf-title]').textContent = 'Passt, ' + L.first + ' freut sich auf dich!';
        $('[data-conf-text]').textContent = state.loc === 'vid'
          ? 'Den Video-Link und eine kurze Checkliste bekommst du einen Tag vorher.'
          : 'Wir haben einen Kaffee und den Besprechungsraum für dich reserviert.';
        $('[data-ticket]').innerHTML =
          '<dt>Wann</dt><dd>' + dateStr + ', ' + state.time + ' Uhr</dd>' +
          '<dt>Wo</dt><dd>' + esc(L.place) + '</dd>' +
          '<dt>Mit</dt><dd>' + esc(L.name) + '</dd>' +
          '<dt>Dauer</dt><dd>30 Minuten, kostenlos</dd>';
        booker.classList.add('is-done');
        scrollIntoViewIfNeeded(booker);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      } else if (e.target.closest('[data-book-reset]')) {
        booker.classList.remove('is-done');
        state.time = null; renderSlots(); renderSum();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    });
    // Pfeiltasten im Standort-Umschalter
    $('[data-seg]').addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var keys = ['muc', 'ros', 'vid'], i = keys.indexOf(state.loc);
      i = (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
      setLoc(keys[i]);
      $('[data-loc="' + keys[i] + '"]').focus();
    });

    renderDays(); renderSlots(); renderSum();
  }

  /* ---------- Karte: Straßen zeichnen, Weg läuft, Pin hüpft ---------- */
  var map = $('[data-map]');
  if (map) {
    var paths = $$('.m-draw path', map), fades = $$('.m-fade', map);
    var routeMask = $('[data-route-mask]', map), pin = $('[data-pin]', map), label = $('[data-pin-label]', map), walk = $('[data-walk]', map);
    if (!hasGsap || reduce) {
      map.classList.add('is-live');
    } else {
      gsap.set(paths, { strokeDasharray: '1 1', strokeDashoffset: 1 });
      // Gestrichelte Gleisschwellen behalten ihr Muster: nur einblenden
      var ties = $$('.m-ties', map);
      gsap.set(ties, { strokeDasharray: '', strokeDashoffset: 0, opacity: 0 });
      gsap.set(routeMask, { strokeDasharray: '1 1', strokeDashoffset: 1 });
      gsap.set(fades, { opacity: 0 });
      gsap.set(pin, { y: -60, opacity: 0 });
      var groups = $$('.m-draw', map);
      var tl = gsap.timeline({ paused: true });
      groups.forEach(function (g, i) {
        var ps = $$('path:not(.m-ties)', g);
        tl.to(ps, { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: 'power2.inOut' }, i * 0.25);
      });
      tl.to(ties, { opacity: 1, duration: 0.6 }, 0.9);
      tl.to(fades.filter(function (f) { return f !== label && f !== walk; }), { opacity: 1, duration: 0.6, stagger: 0.1 }, 0.9);
      tl.to(routeMask, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }, 1.5);
      tl.to(walk, { opacity: 1, duration: 0.4 }, 2.2);
      tl.to(pin, { opacity: 1, duration: 0.2 }, 2.6);
      tl.to(pin, { y: 0, duration: 0.9, ease: 'bounce.out' }, 2.6);
      tl.to(label, { opacity: 1, duration: 0.4 }, 3.2);
      tl.add(function () { map.classList.add('is-live'); }, 3.3);
      // Weg läuft beim Scrollen weiter mit (sanfter Scrub, nachdem die Karte gezeichnet ist)
      KH.inView(map, 'top 75%', function () { tl.play(); });
      // Pin hüpft alle paar Sekunden kurz
      tl.add(function () {
        gsap.timeline({ repeat: -1, repeatDelay: 3.2 })
          .to(pin, { y: -10, duration: 0.28, ease: 'power2.out' })
          .to(pin, { y: 0, duration: 0.6, ease: 'bounce.out' });
      }, 4.2);
    }
  }
})();
