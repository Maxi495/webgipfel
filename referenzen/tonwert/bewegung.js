/* ============================================================================
   Tonwert — Bewegung
   Faehrt die Teile, die CSS nicht kann: Hoehenwechsel, Stapelkarten,
   Laufband, Kopfzeile, Aufmacher. Alle Dauern und Kurven kommen aus dem
   Stylesheet, damit es genau eine Quelle fuer die Werte gibt.
   Siehe DESIGN.md Abschnitt 5.
   ========================================================================== */
(() => {
  "use strict";

  const sparsam = matchMedia("(prefers-reduced-motion: reduce)");
  const amSchirm = () => matchMedia("(min-width:1000px)").matches;
  const tokenMs = (name) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000;
  };

  /* -- 1. Einziehen beim Scrollen -----------------------------------------
     Ein einziger Beobachter fuer alles. Schwelle 0 mit Vorlauf von 10% der
     Schirmhoehe: das Element beginnt kurz BEVOR es ganz im Bild ist, sonst
     wirkt der 1,8-s-Weg wie Nachladen. Einmal gezeigt, bleibt gezeigt. */
  const einzugAn = () => {
    const stuecke = document.querySelectorAll(".einzug, .bildrahmen, .scheinfeld");
    if (!stuecke.length) return;
    if (sparsam.matches) { stuecke.forEach(e => e.classList.add("da")); return; }

    const beobachter = new IntersectionObserver((eintraege) => {
      for (const e of eintraege) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("da");
        beobachter.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });

    stuecke.forEach(e => beobachter.observe(e));

    /* Zwei Netze darunter. Die gesamte Seitenschrift startet auf Opazitaet 0 —
       loest der Beobachter nicht aus, bleibt die Seite leer. Das darf nicht an
       einem einzigen Auslöser haengen.

       Netz 1: Was beim Laden ohnehin im Bild steht, wird sofort gezeigt,
       synchron gerechnet statt auf den ersten Rueckruf gewartet. Das ist auch
       ohne Stoerfall besser — der Aufmacher soll nicht erst nachtropfen.

       Netz 2: Hat nach 2,5 s gar nichts ausgeloest, war der Beobachter
       wirkungslos (gedrosselter Hintergrundtab, abgeschaltete Beobachter,
       eingefrorenes Fenster). Dann wird alles gezeigt. Lieber ohne Bewegung
       lesbar als mit Bewegung unsichtbar. */
    const zeigeSichtbare = () => {
      for (const e of stuecke) {
        if (e.classList.contains("da")) continue;
        const r = e.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) {
          e.classList.add("da");
          beobachter.unobserve(e);
        }
      }
    };
    requestAnimationFrame(zeigeSichtbare);

    setTimeout(() => {
      if ([...stuecke].some(e => e.classList.contains("da"))) return;
      stuecke.forEach(e => { e.classList.add("da"); beobachter.unobserve(e); });
    }, 2500);
  };

  /* -- 2. Klappliste ------------------------------------------------------
     Die Hoehe muss in Pixeln laufen, `auto` laesst sich nicht uebergehen.
     Nach dem Oeffnen wird auf `auto` zurueckgestellt, damit sich der Inhalt
     spaeter frei aendern darf (Umbruch bei Drehung des Geraets). */
  const klappenAn = () => {
    const dauer = tokenMs("--d-pfeil");

    document.querySelectorAll(".klappe").forEach((klappe) => {
      const kopf = klappe.querySelector(".klappe__kopf");
      const koerper = klappe.querySelector(".klappe__koerper");
      if (!kopf || !koerper) return;

      const id = koerper.id || ("klappe-" + Math.random().toString(36).slice(2, 8));
      koerper.id = id;
      kopf.setAttribute("aria-expanded", "false");
      kopf.setAttribute("aria-controls", id);

      const setze = (auf) => {
        klappe.dataset.auf = auf ? "ja" : "nein";
        kopf.setAttribute("aria-expanded", String(auf));

        if (sparsam.matches) { koerper.style.height = auf ? "auto" : "0px"; return; }

        if (auf) {
          koerper.style.height = koerper.scrollHeight + "px";
          setTimeout(() => {
            if (klappe.dataset.auf === "ja") koerper.style.height = "auto";
          }, dauer);
        } else {
          koerper.style.height = koerper.scrollHeight + "px";   // von auto auf px
          requestAnimationFrame(() => { koerper.style.height = "0px"; });
        }
      };

      setze(false);
      kopf.addEventListener("click", () => setze(klappe.dataset.auf !== "ja"));
    });
  };

  /* -- 3. Stapelkarten ---------------------------------------------------
     Am Schirm: 300vh Lauf, darin ein festgehaltener Bildschirm. Die Karten
     liegen uebereinander; jede hat ihren Abschnitt des Laufs, in dem sie von
     unten hereinfaehrt. Die darunterliegende weicht leicht zurueck, damit
     ein Stapel entsteht und keine Folie.
     Am Handy bleibt es eine einfache Liste — dort gibt es nichts zu fahren. */
  const stapelAn = () => {
    const staepel = [...document.querySelectorAll(".stapel")];
    if (!staepel.length) return;

    const zeichne = () => {
      const breit = amSchirm() && !sparsam.matches;

      for (const stapel of staepel) {
        const karten = [...stapel.querySelectorAll(".stapel__karte")];
        if (!karten.length) continue;

        if (!breit) { karten.forEach(k => { k.style.transform = ""; k.style.zIndex = ""; }); continue; }

        const kasten = stapel.getBoundingClientRect();
        const lauf = kasten.height - innerHeight;
        const p = lauf > 0 ? Math.min(1, Math.max(0, -kasten.top / lauf)) : 0;

        const n = karten.length;
        karten.forEach((karte, i) => {
          karte.style.zIndex = String(i);
          if (i === 0) { karte.style.transform = "translate3d(0,0,0)"; return; }

          // Abschnitt dieser Karte im Gesamtlauf
          const von = (i - 1) / (n - 1);
          const bis = i / (n - 1);
          const q = Math.min(1, Math.max(0, (p - von) / (bis - von)));

          karte.style.transform = `translate3d(0,${(1 - q) * 100}%,0)`;

          // die Karte darunter weicht zurueck, solange diese hereinfaehrt
          const drunter = karten[i - 1];
          const s = 1 - q * 0.04;
          drunter.style.transform = i - 1 === 0
            ? `translate3d(0,0,0) scale(${s})`
            : `${drunter.style.transform.split(" scale(")[0]} scale(${s})`;
        });
      }
    };

    zeichne();
    addEventListener("scroll", zeichne, { passive: true });
    addEventListener("resize", zeichne);
  };

  /* -- 4. Kopfzeile -------------------------------------------------------
     Weicht beim Abwaertsscrollen nach oben aus und kommt beim Aufwaerts-
     scrollen zurueck. `kopf--oben` steuert die Flaeche dahinter, die laut
     Messung mit 300 ms VERZUG einblendet. */
  const kopfAn = () => {
    const kopf = document.querySelector(".kopf");
    if (!kopf) return;
    let zuletzt = scrollY;

    // Solange der Aufmacher hinter der Kopfzeile steht, schreibt sie weiss.
    const aufmacher = document.querySelector(".aufmacher");
    const startetDunkel = kopf.classList.contains("kopf--dunkel");

    const pruefe = () => {
      const y = scrollY;
      kopf.classList.toggle("kopf--oben", y < 8);
      if (startetDunkel && aufmacher) {
        const hoehe = parseFloat(getComputedStyle(kopf).height);
        kopf.classList.toggle("kopf--dunkel",
          aufmacher.getBoundingClientRect().bottom > hoehe);
      }

      const blende = document.querySelector('.blende[data-auf="ja"]');
      if (!blende) {
        const runter = y > zuletzt && y > parseFloat(getComputedStyle(kopf).height) * 2;
        kopf.classList.toggle("kopf--weg", runter);
      }
      zuletzt = y;
    };

    pruefe();
    addEventListener("scroll", pruefe, { passive: true });
  };

  /* -- 5. Handymenue ------------------------------------------------------ */
  const menueAn = () => {
    const brenner = document.querySelector(".brenner");
    const blende = document.querySelector(".blende");
    if (!brenner || !blende) return;

    const setze = (auf) => {
      blende.dataset.auf = auf ? "ja" : "nein";
      brenner.setAttribute("aria-expanded", String(auf));
      document.documentElement.style.overflow = auf ? "hidden" : "";
      if (auf) document.querySelector(".kopf")?.classList.remove("kopf--weg");
    };

    setze(false);
    brenner.addEventListener("click", () => setze(blende.dataset.auf !== "ja"));
    blende.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setze(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape") setze(false); });
  };

  /* -- 6. Laufband -------------------------------------------------------
     Gleichmaessige Fahrt, zeitbasiert statt bildbasiert — sonst laeuft es auf
     einem 120-Hz-Schirm doppelt so schnell. Die Reihe wird verdoppelt, damit
     der Umbruch nicht sichtbar ist. */
  const bandAn = () => {
    const baender = [...document.querySelectorAll(".band")];
    if (!baender.length || sparsam.matches) return;

    for (const band of baender) {
      const reihe = band.querySelector(".band__reihe");
      if (!reihe) continue;
      reihe.append(...[...reihe.children].map(k => k.cloneNode(true)));

      const px = parseFloat(band.dataset.tempo || "40");   // Pixel je Sekunde
      const rueck = band.dataset.richtung === "rueck";
      let t0 = null;

      const fahre = (t) => {
        if (t0 === null) t0 = t;
        const halb = reihe.scrollWidth / 2;
        if (halb > 0) {
          const weg = (((t - t0) / 1000) * px) % halb;
          reihe.style.transform = `translate3d(${rueck ? weg - halb : -weg}px,0,0)`;
        }
        requestAnimationFrame(fahre);
      };
      requestAnimationFrame(fahre);
    }
  };

  /* -- 7. Umblenden hell/dunkel ------------------------------------------ */
  const themaAn = () => {
    const felder = [...document.querySelectorAll(".themafeld[data-thema]")];
    if (!felder.length) return;

    const beobachter = new IntersectionObserver((eintraege) => {
      for (const e of eintraege) {
        e.target.classList.toggle("dunkel", e.isIntersecting && e.target.dataset.thema === "dunkel");
      }
    }, { threshold: 0.5 });

    felder.forEach(f => beobachter.observe(f));
  };

  /* -- 8. Aufmacher ------------------------------------------------------
     Das Bild steht auf 1,1 und wird beim Scrollen auf 1 zurueckgefuehrt, der
     Schleier blendet dabei ein. Nur am Schirm — am Handy kostet es nur Strom. */
  const aufmacherAn = () => {
    const aufmacher = document.querySelector(".aufmacher");
    if (!aufmacher || sparsam.matches) return;
    const bild = aufmacher.querySelector(".aufmacher__bild");
    const schleier = aufmacher.querySelector(".aufmacher__schleier");

    const zeichne = () => {
      const h = aufmacher.offsetHeight || innerHeight;
      const p = Math.min(1, Math.max(0, scrollY / h));
      if (bild && amSchirm()) bild.style.transform = `scale(${1.1 - p * 0.1})`;
      else if (bild) bild.style.transform = "";
      if (schleier) schleier.style.opacity = String(p);
    };

    zeichne();
    addEventListener("scroll", zeichne, { passive: true });
    addEventListener("resize", zeichne);
  };

  /* -- 9. Reiterleiste ---------------------------------------------------
     Reiterwechsel ist ein Zustandswechsel, also 300 ms. Das neue Feld wird
     nicht neu eingezogen — sonst wartet man bei jedem Klick 1,8 Sekunden. */
  const reiterAn = () => {
    for (const leiste of document.querySelectorAll('[role="tablist"]')) {
      const reiter = [...leiste.querySelectorAll('[role="tab"]')];
      if (!reiter.length) continue;

      const zeige = (ziel) => {
        for (const r of reiter) {
          const an = r === ziel;
          r.setAttribute("aria-selected", String(an));
          r.tabIndex = an ? 0 : -1;
          const feld = document.getElementById(r.getAttribute("aria-controls"));
          if (!feld) continue;
          feld.hidden = !an;
          // schon gezeigte Felder bleiben gezeigt, nichts zieht erneut ein
          if (an) feld.querySelectorAll(".einzug, .bildrahmen").forEach(x => x.classList.add("da"));
        }
      };

      zeige(reiter.find(r => r.getAttribute("aria-selected") === "true") || reiter[0]);

      reiter.forEach((r, i) => {
        r.addEventListener("click", () => zeige(r));
        r.addEventListener("keydown", (ev) => {
          const schritt = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
          if (!schritt) return;
          ev.preventDefault();
          const naechster = reiter[(i + schritt + reiter.length) % reiter.length];
          zeige(naechster); naechster.focus();
        });
      });
    }
  };

  /* -- Posteingang -------------------------------------------------------
     Der Zaehler laeuft im Takt der eintreffenden Zeilen mit. Die Zeitpunkte
     sind dieselben gemessenen Staffelstufen, die auch die Zeilen benutzen:
     0 / 0,4 s / 0,7 s. Kein Hochzaehlen in Zwischenschritten — das System
     kennt keine Keyframe-Animationen, und ein rotierender Zaehler faellt
     darin sofort als Fremdkoerper auf. */
  const posteingangAn = () => {
    const STUFEN = [0, 400, 700];
    for (const kasten of document.querySelectorAll("[data-posteingang]")) {
      const zaehler = kasten.querySelector("[data-zaehler]");
      const zeilen = kasten.querySelectorAll(".posteingang__zeile");
      if (!zaehler || !zeilen.length) continue;
      zaehler.textContent = "0";

      if (sparsam.matches) { zaehler.textContent = String(zeilen.length); continue; }

      let gelaufen = false;
      const starte = () => {
        if (gelaufen) return;
        gelaufen = true;
        zeilen.forEach((_, i) => {
          setTimeout(() => { zaehler.textContent = String(i + 1); },
                     STUFEN[i] ?? (i * 300));
        });
      };

      const beobachter = new IntersectionObserver((eintraege) => {
        for (const e of eintraege) {
          if (!e.isIntersecting) continue;
          starte();
          beobachter.unobserve(e.target);
        }
      }, { threshold: 0.3 });
      beobachter.observe(kasten);

      // Gleiches Netz wie beim Einziehen: steht der Kasten beim Laden schon
      // im Bild, laeuft es sofort; loest nach 2,5 s gar nichts aus, wird die
      // Endzahl gesetzt, damit dort nie eine 0 stehen bleibt.
      requestAnimationFrame(() => {
        const r = kasten.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) starte();
      });
      setTimeout(() => {
        if (!gelaufen) zaehler.textContent = String(zeilen.length);
      }, 2500);
    }
  };

  const los = () => {
    einzugAn(); klappenAn(); stapelAn(); kopfAn(); posteingangAn();
    menueAn(); bandAn(); themaAn(); aufmacherAn(); reiterAn();
  };

  if (document.readyState === "loading") addEventListener("DOMContentLoaded", los);
  else los();
})();
