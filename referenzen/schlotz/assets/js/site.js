/* SCHLOTZ – Animationen
   Portiert von slush.app (GSAP + ScrollTrigger + SplitText + Lenis): gleiche Eases,
   Dauern, Staffelungen und Trigger-Punkte. Funktionsnamen entsprechen dem Original. */
(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, Draggable, InertiaPlugin);

  // Original-Kurven von slush.app
  CustomEase.create('slush', '0.65, 0.05, 0, 1');
  CustomEase.create('slush-bounce', 'M0,0 L0.076,0.5737 L0.1187,0.8382 L0.1419,0.9463 L0.1654,1.0292 L0.1897,1.0886 L0.2153,1.1258 L0.2297,1.137 L0.2448,1.1424 L0.261,1.1423 L0.2786,1.1366 L0.3101,1.1165 L0.3862,1.0507 L0.4257,1.0219 L0.4699,0.9995 L0.5163,0.9872 L0.5877,0.9842 L0.8126,1.0011 L1,1');

  var BREAKPOINT = 768;
  var MM = gsap.matchMedia();
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;
  var menuState = false;

  /* ---------- Lenis ---------- */
  function initLenis() {
    if (reduceMotion || typeof Lenis === 'undefined') return;
    lenis = window.SCHLOTZ_LENIS = new Lenis({ lerp: 0.12 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(1000 * t); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4, easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); } });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var t = id.length > 1 && document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        scrollToTarget(t);
        if (menuState && window.innerWidth < 992) document.getElementById('menuButton').click();
      });
    });
  }

  /* ---------- Strohhalm (ersetzt das blaue 3D-Band) ---------- */
  var strawId = 0;
  function initStraws() {
    var NS = 'http://www.w3.org/2000/svg';
    document.querySelectorAll('.straw').forEach(function (svg) {
      var src = svg.querySelector('path');
      var d = src.getAttribute('d');
      var big = svg.classList.contains('hero-straw');
      var w = big ? 132 : 84;
      var id = 'straw' + (++strawId);
      src.remove();

      var defs = document.createElementNS(NS, 'defs');
      defs.innerHTML =
        '<filter id="' + id + 'g" x="-10%" y="-10%" width="120%" height="120%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.25  0 0 0 0 0.6  0 0 0 .32 -.06" result="g"/>' +
        '<feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/>' +
        '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>' +
        '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="-400" y="-400" width="2400" height="2000">' +
        '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="' + (w + 60) + '" stroke-linecap="round" class="s-mask"/></mask>';
      svg.appendChild(defs);

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('mask', 'url(#' + id + 'm)');
      g.setAttribute('filter', 'url(#' + id + 'g)');
      g.innerHTML =
        '<path class="s-shadow" d="' + d + '" stroke-width="' + w + '" transform="translate(7 12)"/>' +
        '<path class="s-body" d="' + d + '" stroke-width="' + (w - 10) + '"/>' +
        '<path class="s-stripe" d="' + d + '" stroke-width="' + (w - 10) + '" stroke-dasharray="' + (w * 0.32) + ' ' + (w * 0.62) + '" stroke-linecap="butt"/>' +
        '<path class="s-light" d="' + d + '" stroke-width="' + (w * 0.18) + '" transform="translate(-8 -' + (w * 0.2) + ')"/>';
      svg.appendChild(g);

      var mask = defs.querySelector('.s-mask');
      var len = mask.getTotalLength();
      gsap.set(mask, { strokeDasharray: len, strokeDashoffset: reduceMotion ? 0 : len });
      svg._mask = mask;
      svg._len = len;

      if (reduceMotion) return;
      if (svg.dataset.straw === 'scrub') {
        // Strohhalm folgt dem Scrollen: wird beim Scrollen eingezogen und wieder herausgezogen
        gsap.to(mask, {
          strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: svg.parentElement, start: 'top 85%', end: 'bottom 35%', scrub: 1 }
        });
        gsap.fromTo(svg, { yPercent: 12, rotate: -3 }, {
          yPercent: -12, rotate: 3, ease: 'none',
          scrollTrigger: { trigger: svg.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });
  }

  /* ---------- Marquee mit Scrollrichtung (initMarqueeScrollDirection) ---------- */
  function initMarqueeScrollDirection(scope) {
    scope.querySelectorAll('[data-marquee]').forEach(function (el) {
      var collection = el.querySelector('[data-marquee-collection]');
      var scroller = el.querySelector('[data-marquee-scroll]');
      if (!collection || !scroller) return;
      var ds = el.dataset;
      var speed = parseFloat(ds.marqueeSpeed);
      var dir = ds.marqueeDirection === 'right' ? 1 : -1;
      var dup = parseInt(ds.marqueeDuplicate || 0, 10);
      var scrollSpeed = parseFloat(ds.marqueeScrollSpeed);
      var mult = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
      var duration = speed * (collection.offsetWidth / window.innerWidth) * mult;
      if (reduceMotion) duration = 100;

      scroller.style.marginLeft = (-1 * scrollSpeed) + '%';
      scroller.style.width = (2 * scrollSpeed + 100) + '%';
      if (dup > 0) {
        var frag = document.createDocumentFragment();
        for (var i = 0; i < dup; i++) {
          var c = collection.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          c.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
          frag.appendChild(c);
        }
        scroller.appendChild(frag);
      }
      var all = el.querySelectorAll('[data-marquee-collection]');
      var tween = gsap.to(all, { xPercent: -100, repeat: -1, duration: duration, ease: 'linear' }).totalProgress(0.5);
      gsap.set(all, { xPercent: dir === 1 ? 100 : -100 });
      tween.timeScale(dir);
      tween.play();
      el.setAttribute('data-marquee-status', 'normal');

      ScrollTrigger.create({
        trigger: el, start: 'top bottom', end: 'bottom top',
        onUpdate: function (self) {
          var down = self.direction === 1;
          tween.timeScale(down ? -dir : dir);
          el.setAttribute('data-marquee-status', down ? 'normal' : 'inverted');
        }
      });
      var from = dir === -1 ? scrollSpeed : -scrollSpeed;
      gsap.timeline({ scrollTrigger: { trigger: el, start: '0% 100%', end: '100% 0%', scrub: 0 } })
        .fromTo(scroller, { x: from + 'vw' }, { x: -from + 'vw', ease: 'none' });
    });
  }

  /* ---------- Navigation: klappt beim Scrollen zum „+“ zusammen ---------- */
  function initDetectScrollingDirection() {
    var last = 0;
    var items = document.querySelectorAll('.nav-li');
    MM.add({ isDesktop: '(min-width: 992px)', isMobile: '(max-width: 991px)' }, function (ctx) {
      function onScroll() {
        var y = window.scrollY;
        if (Math.abs(y - last) < 10) return;
        var dir = y > last ? 'down' : 'up';
        var started = y > 50;
        last = y;
        document.body.setAttribute('data-scrolling-direction', dir);
        document.body.setAttribute('data-scrolling-started', started);
        if (!ctx.conditions.isDesktop) return;
        if (dir === 'down' && started) {
          gsap.to(items, { yPercent: -300, duration: 0.75, ease: 'slush-bounce', stagger: { each: 0.03, from: 'start' } });
          setExpanded(false);
        } else if (dir === 'up') {
          gsap.to(items, { yPercent: 0, duration: 0.75, ease: 'slush-bounce', stagger: { each: 0.03, from: 'end' } });
          setExpanded(true);
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      return function () { window.removeEventListener('scroll', onScroll); };
    });
  }

  function setExpanded(v) {
    var b = document.getElementById('menuButton');
    if (b) b.setAttribute('aria-expanded', String(v));
  }

  function initMenu() {
    var btn = document.getElementById('menuButton');
    if (!btn) return;
    var items = document.querySelectorAll('.nav-li');
    var right = document.getElementById('navRight');
    var h = btn.querySelector('.ln.h');

    MM.add('(min-width: 992px)', function () {
      function show() { gsap.to(items, { yPercent: 0, duration: 0.75, ease: 'slush-bounce', stagger: { each: 0.03, from: 'end' } }); setExpanded(true); }
      function hide() { if (window.scrollY < 50) return; gsap.to(items, { yPercent: -300, duration: 0.75, ease: 'slush-bounce', stagger: { each: 0.03, from: 'start' } }); setExpanded(false); }
      btn.addEventListener('mouseenter', show, { passive: true });
      btn.addEventListener('focus', show);
      btn.addEventListener('click', show);
      right.addEventListener('mouseleave', hide, { passive: true });
      return function () {
        btn.removeEventListener('mouseenter', show);
        btn.removeEventListener('focus', show);
        btn.removeEventListener('click', show);
        right.removeEventListener('mouseleave', hide);
      };
    });

    MM.add('(max-width: 991px)', function () {
      gsap.set(items, { xPercent: 300, yPercent: 0 });
      setExpanded(false);
      menuState = false;
      function toggle() {
        if (menuState) {
          gsap.to(items, { xPercent: 300, duration: 0.75, ease: 'slush-bounce', stagger: { each: 0.03, from: 'start' } });
          btn.style.transform = 'rotate(0deg)';
          h.style.transform = 'scaleX(1)';
          menuState = false;
        } else {
          gsap.to(items, { xPercent: 0, duration: 0.75, ease: 'slush-bounce', stagger: { each: 0.03, from: 'end' } });
          btn.style.transform = 'rotate(90deg)';
          h.style.transform = 'scaleX(0)';
          menuState = true;
        }
        setExpanded(menuState);
      }
      btn.addEventListener('click', toggle);
      return function () { btn.removeEventListener('click', toggle); btn.style.transform = ''; h.style.transform = ''; gsap.set(items, { clearProps: 'all' }); };
    });
  }

  /* ---------- Schräg einlaufende Display-Schrift (initSlantedText) ---------- */
  function initSlantedText(scope) {
    scope.querySelectorAll('[data-anim-slant]').forEach(function (el) {
      if (reduceMotion) return;
      var split = new SplitText(el, { type: 'words, chars', charsClass: 'char', tag: 'span' });
      el.setAttribute('aria-label', el.textContent);
      split.words.forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
      gsap.set(split.chars, { x: '-0.25em', autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: el, start: 'top 80%', once: true,
        onEnter: function () {
          gsap.to(split.chars, { ease: 'slush-bounce', x: '0em', duration: 0.65, autoAlpha: 1, stagger: { each: 0.015, from: 'end' } });
        }
      });
    });
  }

  /* ---------- Zeilen kippen aus der Tiefe (initHeadingReveal) ---------- */
  function initHeadingReveal(scope) {
    scope.querySelectorAll('[data-heading-reveal]').forEach(function (el) {
      if (reduceMotion) return;
      var split = new SplitText(el, { type: 'lines, words' });
      el.setAttribute('aria-label', el.textContent);
      gsap.set(el, { position: 'relative', perspective: 1000 });
      gsap.set(split.lines, { z: '5em', rotateY: -45, autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: el, start: 'top 80%', once: true,
        onEnter: function () {
          gsap.to(split.lines, { ease: 'slush-bounce', z: '0em', rotateY: 0, duration: 0.85, autoAlpha: 1, stagger: 0.15 });
        }
      });
    });
  }

  /* ---------- Karten drehen sich in 3D herein (initCardReveals) ---------- */
  function initCardReveals(scope) {
    scope.querySelectorAll('[data-card-reveal]').forEach(function (wrap) {
      var cards = wrap.querySelectorAll('[data-card]');
      if (!cards.length) return;
      if (!reduceMotion) gsap.set(cards, { x: '5em', z: '20em', rotateY: -30, autoAlpha: 0, scale: 0.75 });
      ScrollTrigger.create({
        trigger: wrap, start: 'top 80%', once: true,
        onEnter: function () {
          gsap.to(cards, { x: '0em', z: '0em', rotateY: 0, scale: 1, autoAlpha: 1, ease: 'slush-bounce', stagger: { amount: 0.2 }, duration: reduceMotion ? 0 : 0.85 });
        }
      });
    });
  }

  /* ---------- Parallax (initGlobalParallax) ---------- */
  function initGlobalParallax() {
    if (reduceMotion) return;
    MM.add({ isMobile: '(max-width:479px)', isDesktop: '(min-width:480px)' }, function () {
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        var start = el.dataset.parallaxStart != null ? parseFloat(el.dataset.parallaxStart) : 20;
        var end = el.dataset.parallaxEnd != null ? parseFloat(el.dataset.parallaxEnd) : -20;
        var s = 'clamp(' + (el.dataset.parallaxScrollStart || 'top bottom') + ')';
        var e = 'clamp(' + (el.dataset.parallaxScrollEnd || 'bottom top') + ')';
        gsap.fromTo(el, { yPercent: start }, { yPercent: end, ease: 'none', scrollTrigger: { trigger: el, start: s, end: e, scrub: true } });
      });
    });
  }

  /* ---------- Gerät/Foto fährt ein (initHomeVideoIntro) ---------- */
  function initHomeVideoIntro() {
    var row = document.querySelector('[data-device]');
    var media = row && row.querySelector('[data-device-media]');
    if (!media || reduceMotion) return;
    gsap.from(media, { scale: 0.75, autoAlpha: 0, yPercent: 40, duration: 1.2, ease: 'slush-bounce', scrollTrigger: { trigger: row, start: 'top center', once: true } });
    gsap.from(row.querySelectorAll('.fact'), { y: '3em', autoAlpha: 0, rotate: function (i) { return i % 2 ? 4 : -4; }, duration: 1, ease: 'slush-bounce', stagger: 0.1, scrollTrigger: { trigger: row, start: 'top 70%', once: true } });
  }

  /* ---------- Zeitstrahl als Stapel-Slider (initStackingSlider) ---------- */
  function initStackingSlider(scope, opts) {
    opts = opts || {};
    var minScale = opts.minScale != null ? opts.minScale : 0.6;
    var maxRotation = opts.maxRotation != null ? opts.maxRotation : -10;
    var wrap = scope.querySelector('[data-stacking]');
    if (!wrap) return;
    var slider = wrap.querySelector('[data-stacking-slider]');
    var slides = gsap.utils.toArray('[data-stacking-slide]', slider);
    var bar = wrap.querySelector('[data-stacking-progress]');
    var clamp = gsap.utils.clamp;
    var m = 0, u, p;

    function measure() {
      var cs = getComputedStyle(slides[0]);
      var mr = parseFloat(cs.marginRight) || 0;
      u = slides[0].offsetWidth + mr;
      p = Math.max(0, u * (slides.length - 1) - (wrap.offsetWidth - slides[0].offsetWidth) * 0.0);
    }
    function render() {
      gsap.set(slider, { x: -m });
      slides.forEach(function (s, r) {
        var o = r * u;
        var n = Math.max(0, m - o);
        var i = Math.min(n / u, 1);
        gsap.set(s, { x: n, scale: 1 - (1 - minScale) * i, rotation: maxRotation * i, transformOrigin: 'center center', zIndex: r });
      });
      if (bar) gsap.set(bar, { scaleX: 0.1 + 0.9 * (p ? m / p : 0) });
    }
    measure();
    wrap.style.touchAction = 'pan-y';
    wrap.style.userSelect = 'none';
    var drag = Draggable.create(slider, {
      type: 'x',
      bounds: { minX: -p, maxX: 0 },
      inertia: true,
      allowContextMenu: true,
      snap: function (x) { var t = clamp(0, p, -x); return -Math.round(t / u) * u; },
      onDrag: function () { m = clamp(0, p, -this.x); render(); },
      onThrowUpdate: function () { m = clamp(0, p, -this.x); render(); }
    })[0];
    render();

    // Tastatur: Pfeiltasten blättern
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Zeitstrahl 2019 bis 2026, mit Pfeiltasten blättern');
    wrap.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var target = clamp(0, p, Math.round(m / u) * u + (e.key === 'ArrowRight' ? u : -u));
      gsap.to({ v: m }, { v: target, duration: 0.75, ease: 'slush-bounce', onUpdate: function () { m = this.targets()[0].v; render(); drag.update(); } });
    });

    window.addEventListener('resize', debounce(function () {
      measure();
      drag.applyBounds({ minX: -p, maxX: 0 });
      m = clamp(0, p, m);
      render();
    }, 200));
  }

  /* ---------- Cursor-Label (initCursor / initCursorTargets) ---------- */
  function initCursor() {
    var c = document.querySelector('.cursor');
    if (!c || !window.matchMedia('(hover: hover)').matches) return;
    var txt = c.querySelector('p');
    gsap.set(c, { xPercent: 6, yPercent: 50 });
    var qx = gsap.quickTo(c, 'x', { ease: 'power3' });
    var qy = gsap.quickTo(c, 'y', { ease: 'power3' });
    window.addEventListener('mousemove', function (e) {
      var w = window.innerWidth, h = window.innerHeight;
      var xp = e.clientX > w - (c.offsetWidth + 16) ? -100 : 6;
      var yp = e.clientY > 0.9 * h ? -120 : 50;
      gsap.to(c, { xPercent: xp, yPercent: yp, duration: 0.9, ease: 'power3' });
      qx(e.clientX); qy(e.clientY);
    });
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { txt.textContent = el.getAttribute('data-cursor'); c.classList.add('is-on'); });
      el.addEventListener('mouseleave', function () { c.classList.remove('is-on'); });
    });
  }

  /* ---------- Seiten-Load (runHomeLoad / runPageLoad) ---------- */
  function runHomeLoad() {
    var letters = document.querySelectorAll('[data-logo-word] .logo-col');
    var subs = document.querySelectorAll('[data-hero-sub]');
    if (reduceMotion) { gsap.set(letters, { yPercent: -75 }); return; }
    gsap.set(letters, { yPercent: 25 });
    gsap.from(subs, { y: '2em', autoAlpha: 0, stagger: 0.3, ease: 'slush-bounce', delay: 1.5, duration: 1 });
    letters.forEach(function (col, i) {
      gsap.to(col, { yPercent: -75, duration: 1.6, ease: 'slush', delay: 0.15 + 0.05 * i });
    });
  }

  function runPageLoad() {
    var nav = document.getElementById('nav');
    gsap.fromTo(nav, { y: 0, yPercent: -160 }, { yPercent: 0, ease: 'slush', duration: 0.8, delay: reduceMotion ? 0 : 0.6 });
    runHomeLoad();
    if (reduceMotion) return;

    var stickers = document.querySelectorAll('[data-sticker]');
    gsap.from(stickers, { scale: 0.2, autoAlpha: 0, duration: 1, rotate: -90, ease: 'slush-bounce', stagger: { each: 0.1, from: 'random' }, delay: 0.9 });

    var hero = document.querySelector('.hero-straw');
    if (hero && hero._mask) gsap.to(hero._mask, { strokeDashoffset: 0, duration: 2.4, ease: 'slush', delay: 0.1 });

    // Sticker im Hero schweben leicht gegen die Scrollrichtung
    stickers.forEach(function (s, i) {
      gsap.to(s, { yPercent: -40 - i * 18, rotate: i % 2 ? 12 : -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- Karte mit Filter (Tab-System im Slush-Stil) ---------- */
  function initMap() {
    var card = document.querySelector('[data-map]');
    if (!card) return;
    var pins = card.querySelectorAll('.pin');
    var partners = document.querySelectorAll('[data-partner]');
    var tip = card.querySelector('[data-map-tip]');
    var buttons = card.querySelectorAll('[data-filter]');

    function apply(f) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === f)); });
      pins.forEach(function (pin, i) {
        var on = f === 'alle' || pin.dataset.types.split(' ').indexOf(f) > -1;
        gsap.to(pin.querySelector('.pin-body'), { scale: on ? 1 : 0.45, autoAlpha: on ? 1 : 0.25, duration: 0.75, ease: 'slush-bounce', delay: i * 0.02, transformOrigin: '50% 100%' });
        pin.style.pointerEvents = on ? '' : 'none';
      });
      partners.forEach(function (pt) {
        var on = f === 'alle' || pt.dataset.types.split(' ').indexOf(f) > -1;
        pt.classList.toggle('is-off', !on);
      });
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.filter); }); });

    function showTip(pin) {
      var r = pin.querySelector('.pin-body').getBoundingClientRect();
      var c = card.getBoundingClientRect();
      tip.textContent = pin.dataset.name;
      tip.style.left = (r.left + r.width / 2 - c.left) + 'px';
      tip.style.top = (r.top - c.top + r.height * 0.55) + 'px';
      tip.classList.add('is-on');
      pin.classList.add('is-active');
      var pt = document.querySelector('[data-partner="' + pin.dataset.pin + '"]');
      if (pt) pt.style.background = '#dceeff';
    }
    function hideTip(pin) {
      tip.classList.remove('is-on');
      pin.classList.remove('is-active');
      var pt = document.querySelector('[data-partner="' + pin.dataset.pin + '"]');
      if (pt) pt.style.background = '';
    }
    pins.forEach(function (pin) {
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('role', 'button');
      pin.setAttribute('aria-label', pin.dataset.name);
      pin.addEventListener('mouseenter', function () { showTip(pin); });
      pin.addEventListener('mouseleave', function () { hideTip(pin); });
      pin.addEventListener('focus', function () { showTip(pin); });
      pin.addEventListener('blur', function () { hideTip(pin); });
      pin.addEventListener('click', function () {
        var st = document.querySelector('[data-standl="' + pin.dataset.pin + '"]');
        if (st) scrollToTarget(st);
      });
    });
    partners.forEach(function (pt) {
      var pin = card.querySelector('[data-pin="' + pt.dataset.partner + '"]');
      if (!pin) return;
      pt.addEventListener('mouseenter', function () { showTip(pin); });
      pt.addEventListener('mouseleave', function () { hideTip(pin); });
    });

    if (!reduceMotion) {
      gsap.from(pins, {
        y: -40, autoAlpha: 0, duration: 0.85, ease: 'slush-bounce', stagger: { each: 0.06, from: 'random' },
        scrollTrigger: { trigger: card, start: 'top 70%', once: true }
      });
    }
  }

  /* ---------- Öffnungsstatus der Standl (Münchner Zeit) ---------- */
  function berlinNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', month: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[o.weekday], month: parseInt(o.month, 10), hour: parseInt(o.hour, 10) % 24 + parseInt(o.minute, 10) / 60 };
  }

  function initStatus() {
    var now = berlinNow();
    var flaucherOpenUntil = null;
    document.querySelectorAll('[data-standl]').forEach(function (el) {
      var season = el.dataset.season.split('-').map(Number);
      var inSeason = now.month >= season[0] && now.month <= season[1];
      var hours = {};
      el.dataset.hours.split(',').forEach(function (h) {
        var a = h.split(':'), t = a[1].split('-');
        hours[a[0]] = [Number(t[0]), Number(t[1])];
      });
      var today = hours[now.day];
      var st = el.querySelector('[data-status]');
      var label = st.querySelector('span');
      st.className = 'status';
      if (!inSeason) {
        st.classList.add('is-pause');
        label.textContent = 'Saisonpause bis April';
      } else if (today && now.hour >= today[0] && now.hour < today[1]) {
        st.classList.add('is-open');
        label.textContent = 'Jetzt offen bis ' + today[1] + ' Uhr';
        if (el.dataset.standl === 'flaucher') flaucherOpenUntil = today[1];
      } else if (today && now.hour < today[0]) {
        label.textContent = 'Heute ab ' + today[0] + ' Uhr';
      } else {
        label.textContent = 'Gerade zu';
      }
    });
    // Laufband-Text an die echte Uhrzeit anpassen
    var live = document.querySelectorAll('[data-live-standl]');
    var text = flaucherOpenUntil ? 'Standl Flaucher heute bis ' + flaucherOpenUntil + ' Uhr'
      : (now.month >= 4 && now.month <= 9 ? 'Standl Flaucher täglich 11 – 20 Uhr' : 'Standl in der Winterpause – das Manufaktur-Fenster hat offen');
    live.forEach(function (l) { l.textContent = text; });
  }

  /* ---------- QR-Muster (dekorativ) ---------- */
  function initQR() {
    var N = 25;
    var seed = 20190714;
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    var cells = '';
    function finder(x, y) {
      return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#000"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#000"/>';
    }
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var inF = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
        if (!inF && rnd() > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02"/>';
      }
    }
    var svg = '<svg viewBox="0 0 ' + N + ' ' + N + '" shape-rendering="crispEdges" aria-hidden="true">' + cells + finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) + '</svg>';
    document.querySelectorAll('[data-qr]').forEach(function (el) { el.innerHTML = svg; });
  }

  /* ---------- Dialoge, Newsletter ---------- */
  function initDialogs() {
    var form = document.getElementById('dlg-form');
    var info = document.getElementById('dlg-info');
    function open(d) {
      if (lenis) lenis.stop();
      d.showModal();
    }
    [form, info].forEach(function (d) {
      d.addEventListener('close', function () { if (lenis) lenis.start(); d.classList.remove('is-sent'); });
      d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    });

    document.querySelectorAll('[data-dialog]').forEach(function (b) {
      b.addEventListener('click', function () {
        var type = b.dataset.dialog;
        if (type === 'anfrage' || type === 'bewerbung') {
          form.querySelector('[data-form-title]').textContent = type === 'anfrage' ? 'Anfrage stellen' : 'Bewerben';
          var sel = form.querySelector('[data-form-topic]');
          sel.value = type === 'anfrage' ? 'Gastro-Konzentrat und Maschine' : b.dataset.job;
          open(form);
        } else {
          info.querySelectorAll('[data-info]').forEach(function (s) { s.hidden = s.dataset.info !== type; });
          open(info);
        }
      });
    });
    document.querySelectorAll('[data-cookie]').forEach(function (b) {
      b.addEventListener('click', function () {
        info.querySelectorAll('[data-info]').forEach(function (s) { s.hidden = s.dataset.info !== 'impressum'; });
        open(info);
      });
    });

    form.querySelector('form').addEventListener('submit', function (e) {
      var submitter = e.submitter;
      if (submitter && submitter.value === 'close') return;
      e.preventDefault();
      var f = e.target;
      if (!f.reportValidity()) return;
      form.classList.add('is-sent');
      f.reset();
    });

    var news = document.querySelector('[data-news]');
    if (news) {
      news.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var input = news.querySelector('input');
        if (!input.checkValidity() || !input.value) { input.reportValidity(); return; }
        news.classList.add('is-sent');
      });
    }
  }

  function debounce(fn, t) {
    var a;
    return function () { var args = arguments, ctx = this; clearTimeout(a); a = setTimeout(function () { fn.apply(ctx, args); }, t); };
  }

  /* ---------- Start ---------- */
  function initGeneral(scope) {
    initDetectScrollingDirection();
    initSlantedText(scope);
    initHeadingReveal(scope);
    initCardReveals(scope);
    initMarqueeScrollDirection(scope);
    initGlobalParallax();
    initCursor();
  }

  function boot() {
    initLenis();
    initStraws();
    initQR();
    initStatus();
    initMenu();
    initGeneral(document);
    initStackingSlider(document);
    initHomeVideoIntro();
    initMap();
    initDialogs();
    initAnchors();
    runPageLoad();
    ScrollTrigger.refresh();
  }

  // SplitText braucht die geladenen Schriften, sonst stimmen die Zeilen nicht
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(boot);
})();
