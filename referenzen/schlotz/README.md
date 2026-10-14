# SCHLOTZ – Konzept-Website

Fiktive Slush-Marke aus München (SCHLOTZ Slush GmbH, Obergiesing). Konzeptprojekt von Webgipfel, geplant als Referenz auf webgipfel.com.

## Aufbau

- `index.html` – Onepager in 8 Abschnitten (Hero, Sorten, Geschichte, Standl/Karte, Team, Gastro, Jobs, Footer)
- `assets/css/site.css` – Designsystem „Slush“ (Refero) mit SCHLOTZ-Inhalten: Farben, Pills, 3D-Flip-Buttons, Skalierung nach Containerbreite
- `assets/js/site.js` – alle Animationen, portiert von slush.app (gleiche Eases, Dauern, Trigger)
- `assets/js/avatars.js` – gezeichnete Team-Avatare (keine Stockporträts)
- `assets/js/vendor/` – GSAP 3.13 (ScrollTrigger, CustomEase, SplitText, Draggable, Inertia) und Lenis 1.1.14, lokal
- `assets/img/` – Unsplash-Fotos lokal als WebP (800 × 800)
- `assets/fonts/` – Anton (Ersatz für „Lateral“) und Inter (Ersatz für „Aeonik Pro“), lokal
- `schlotz-kontext.md` – Markenbriefing

Lokal ansehen:

```bash
python3 -m http.server 4323
```

Dann http://localhost:4323 öffnen.

## Animationen (von slush.app übernommen)

| Effekt | Original-Funktion | Wo |
| --- | --- | --- |
| Laufband, dreht beim Hochscrollen die Richtung | `initMarqueeScrollDirection` | Pencil-Banner, CTA-Banner, Footer |
| Navigation klappt zum „+“ zusammen | `initDetectScrollingDirection`, `initMenu` | Navigation |
| 3D-Flip-Button mit Akzentfarbe | CSS `.button-main` | alle Buttons |
| Display-Schrift läuft schräg Buchstabe für Buchstabe ein | `initSlantedText` | alle großen Überschriften |
| Zeilen kippen aus der Tiefe | `initHeadingReveal` | Einleitungstexte |
| Karten drehen sich in 3D herein | `initCardReveals` | Sorten, Standl, Team, Gastro, Jobs |
| Stapel-Slider zum Ziehen | `initStackingSlider` | Zeitstrahl 2019–2026 |
| Parallax | `initGlobalParallax` | Strohhalm, Fotos, Sticker |
| Logo rollt wie ein Spielautomat ein, Sticker ploppen auf | `runHomeLoad`, `runPageLoad` | Hero |
| Foto fährt beim Scrollen ein | `initHomeVideoIntro` | Hero-Becher |
| Cursor-Label | `initCursor` | Zeitstrahl („Zieh mi“) |

Statt des blauen 3D-Bands läuft ein gestreifter blauer **Strohhalm** durch die Seite. Er wird beim Laden bzw. beim Scrollen eingezogen.

## Pflege

- **Öffnungsstatus der Standl** rechnet mit Münchner Uhrzeit: `data-season="4-9"` (Monate) und `data-hours="Wochentag:von-bis,…"` (0 = Sonntag). Der Laufband-Text zum Flaucher passt sich automatisch an.
- **Neuer Partner auf der Karte:** Pin (`.pin` mit `data-types="becher pouch gastro"`) im SVG und Eintrag in `.partner-list` mit gleichem Schlüssel (`data-pin` / `data-partner`).
- **Neues Foto:** `https://images.unsplash.com/<photo-id>?auto=format&fit=crop&w=800&h=800&q=72&fm=webp` nach `assets/img/` laden und Fotograf:in im Footer ergänzen.
- **Formulare** verschicken nichts (Konzeptseite).

## Grundlagen

- Design: Refero-Designsystem „Slush“ – https://styles.refero.design/style/8b6b547f-a357-4f1b-9842-4579c62dd42b
- Animationen: https://slush.app (Code analysiert und nachgebaut, keine Dateien übernommen)

## Offen vor einer Veröffentlichung

- [ ] Lizenz der Schriften: Lateral und Aeonik Pro sind ersetzt durch Anton und Inter (beide OFL)
- [ ] QR-Codes sind dekorativ und nicht scanbar
- [ ] Erfundene Inhalte prüfen (Team, Partner, Zitate, Zahlen), Hinweis „fiktiv“ steht im Footer, `noindex` ist gesetzt
- [ ] Design-Herkunft (Refero/Slush) in der Referenz transparent nennen
