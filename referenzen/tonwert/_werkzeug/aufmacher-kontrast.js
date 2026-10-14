/* Kontrast von Text ueber dem Aufmacherfoto.
   Im Browser auf der Startseite in der Konsole ausfuehren.

   ZWEI FALLEN, beide hier schon eingetreten:

   1. Der Mittelwert taeuscht. Beim ersten Durchgang lag er bei 13:1, waehrend
      die schlechteste Stelle 3,88:1 hatte und damit durchfiel. Es zaehlt nur
      der schlechteste Punkt — dort landet irgendwann ein Auge.

   2. img.naturalWidth kann LUEGEN. Gemeldet wurden 1427x802 fuer eine Datei,
      die tatsaechlich 2400x1350 hat. Damit stimmt die Zuordnung
      Bildschirmpunkt -> Bildpunkt nicht, und es werden die falschen Stellen
      abgetastet — die Werte sehen plausibel aus und sind trotzdem falsch.
      Deshalb wird das Bild hier ueber createImageBitmap UNABHAENGIG dekodiert
      und gegen den DOM-Wert geprueft.

   STOPPS muss mit .aufmacher__dunkel in stil.css uebereinstimmen. */

const STOPPS = [[0,.32],[0.28,.18],[0.55,.48],[0.78,.66],[1,.80]];

(async () => {
  const imgEl = document.querySelector('.aufmacher__bild');

  /* FALLE 3: Das Aufmacherbild traegt transform: scale(1.1). getBoundingClientRect
     liefert dann den TRANSFORMIERTEN Kasten, waehrend object-fit:cover intern mit
     dem LAYOUTKASTEN rechnet. Wer beides mischt, tastet die falschen Bildstellen ab.
     Gemessen wurden dadurch 5,96:1, tatsaechlich waren es 3,78:1 — also die
     Differenz zwischen bestanden und durchgefallen. Deshalb: abschalten, messen,
     zuruecksetzen. */
  const tf_vorher = imgEl.style.transform;
  imgEl.style.transform = 'none';
  void imgEl.offsetHeight;

  const quelle = imgEl.currentSrc || imgEl.src;
  const bm = await createImageBitmap(await (await fetch(quelle)).blob());
  const nw = bm.width, nh = bm.height;
  if (nw !== imgEl.naturalWidth) {
    console.warn(`naturalWidth luegt: DOM ${imgEl.naturalWidth}x${imgEl.naturalHeight}, `
               + `echt ${nw}x${nh}. Gerechnet wird mit dem echten Wert.`);
  }

  const c = new OffscreenCanvas(nw, nh);
  const ctx = c.getContext('2d', {willReadFrequently:true});
  ctx.drawImage(bm, 0, 0);
  const px = ctx.getImageData(0, 0, nw, nh).data;

  const ir = imgEl.getBoundingClientRect();
  const sk = Math.max(ir.width/nw, ir.height/nh);          // object-fit: cover
  const offx = ir.left + (ir.width - nw*sk)/2;
  const offy = ir.top  + (ir.height - nh*sk)/2;
  const H = document.querySelector('.aufmacher').getBoundingClientRect();

  const deckung = (y) => {
    const t = (y - H.top) / H.height;
    if (t <= 0) return STOPPS[0][1];
    for (let i = 0; i < STOPPS.length-1; i++) {
      const [a,av] = STOPPS[i], [b,bv] = STOPPS[i+1];
      if (t >= a && t <= b) return av + (bv-av) * ((t-a)/(b-a));
    }
    return STOPPS.at(-1)[1];
  };
  const lum = v => { const s = v/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4) };

  const messe = (el, name, ziel) => {
    if (!el) return {name, fehlt: 'nicht gefunden'};
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return {name, fehlt: 'ohne Ausdehnung'};
    let schlimm = 99, n = 0, aus = 0;
    for (let a = 0; a < 48; a++) for (let b = 0; b < 28; b++) {
      const bx = r.left + r.width*(a+.5)/48, by = r.top + r.height*(b+.5)/28;
      const ix = Math.round((bx-offx)/sk), iy = Math.round((by-offy)/sk);
      if (ix<0||iy<0||ix>=nw||iy>=nh) { aus++; continue }
      const o = (iy*nw+ix)*4, al = deckung(by);
      const L = 0.2126*lum(px[o]*(1-al)) + 0.7152*lum(px[o+1]*(1-al)) + 0.0722*lum(px[o+2]*(1-al));
      const k = 1.05/(L+0.05);
      n++; if (k < schlimm) schlimm = k;
    }
    return {name, groesse: getComputedStyle(el).fontSize, punkte: n, ausserhalb: aus,
            schlechtester: +schlimm.toFixed(2), ziel, bestanden: n > 0 && schlimm >= ziel};
  };

  imgEl.style.transform = tf_vorher;
  console.table([
    messe(document.querySelector('.aufmacher h1'), 'Ueberschrift', 3.0),
    messe(document.querySelector('.aufmacher__neben p'), 'Vorspann', 4.5),
    ...[...document.querySelectorAll('.aufmacher .knopf')]
       .map((k,i) => messe(k, 'Knopf ' + (i+1), 3.0)),
  ]);
})();
