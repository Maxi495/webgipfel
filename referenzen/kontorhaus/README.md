# Kontorhaus – Konzept-Website

Fiktive Münchner Mischung aus Finanz-App und Steuerkanzlei (Kontorhaus GmbH, Werksviertel). Konzeptprojekt von Webgipfel, Referenz auf webgipfel.com. Inhalte aus dem Firmenprofil (PDF) plus passend erfundene Details, gesammelt in `kontorhaus-kontext.md`.

## Aufbau

- `index.html` – Startseite, Aufbau 1:1 wie steep.app: gepinnte Hero-Szene → drei Hover-Karten → Produkt-Tabs mit Autoplay → Kundengeschichte → dunkle Kanzlei-Sektion → „Frag deine Zahlen“ → Tür-CTA → Footer
- Unterseiten (Website-Struktur aus dem Profil): `produkt`, `handwerk`, `gastro`, `preise`, `kanzlei`, `karriere`, `ratgeber`, `ratgeber-ruecklage`, `kontakt`, `login`, `impressum`, `datenschutz`
- `assets/css/site.css` – Designsystem „Steep“ (Refero) mit Kontorhaus-Inhalten; Seiten-CSS in `assets/css/pages/`
- `assets/js/chrome.js` – Navigation, Mobilmenü, Footer und die Kundenlogos (Inline-SVG) für alle Seiten
- `assets/js/site.js` – gemeinsame Animationen (Überschriften-Reveal, Staffelungen, Tabs, Laufband, Parallax)
- `assets/js/components.js` – Bausteine der Startseite, auf jeder Seite nutzbar (Hero, Karten, sechs App-Szenen, Kundengeschichte, Kanzlei-Panels, KI-Ansicht, Tür)
- `assets/js/vendor/` – GSAP 3.13 mit ScrollTrigger und SplitText, lokal
- `assets/fonts/` – Source Serif 4 (Ersatz für „Signifier“) und Inter (Ersatz für „Söhne“), lokal
- `assets/img/` – Unsplash-Fotos lokal als WebP, `icons.svg` als Sprite, `favicon.svg`

Lokal ansehen:

```bash
python3 -m http.server 4331 -d referenzen/kontorhaus
```

Dann http://localhost:4331 öffnen.

## Animationen (von steep.app übernommen, Werte aus dem Originalcode)

| Effekt | Original | Wo |
| --- | --- | --- |
| Karten fliegen beim Scrollen ins App-Fenster, Frage wird getippt, Fenster wechselt zur Antwort | `HomeHero`: Bühne 1200 px, skaliert mit (Breite − 160)/1200, Pin über 1,2 × Höhe, scrub 0.8 (Safari 0.6), alle Start-/Endpositionen identisch | Startseite, Hero |
| Überschriften Wort für Wort aus der Zeile | `SplitText` words+lines (mask lines), yPercent 100 → 0, 0.6 s, stagger 0.08, power3.out; Text y 40, CTA y 15 | alle Überschriften |
| Drei Karten: aktive wächst (scale 1.1), Nachbarn rücken 2 %/6 %, Illustration bewegt sich | `ProductIntroSection` inkl. GSAP-Werte der Illustrationen | „Software und Kanzlei“ |
| Tabs mit Fortschrittsbalken, die nächste Szene startet automatisch | `TabSections` + `progressFill` | Produkt-Tabs (6 Szenen als Stop-Motion statt Rive) |
| Bildwechsel: altes schrumpft (power2.in), neues wächst (expo.out), Zitat blendet 300 ms | `ImageReveal`, `CustomerStorySection` | Kundengeschichte, Kanzlei-Panels |
| Laufband der Kundenlogos | `carousel-scroll` 50 s linear | Hero, Unterseiten |
| Reihen gleiten gestaffelt ein | y 60, 0.7 s, stagger 0.15 | Feature-Reihen |
| Tür öffnet sich in Schleife | `door.mp4` | Abschluss |

## Pflege

- **Szenen ändern:** `SCENES` in `components.js` (HTML + GSAP-Timeline je Szene, Dauer = Fortschrittsbalken). Einzelne Szene auf einer Seite: `<div class="appwin" data-scene="0–5"></div>`.
- **Neues Kundenlogo:** in `KH.logos` (chrome.js) eintragen und in `KH.logoOrder` (site.js) aufnehmen.
- **Neues Foto:** `https://images.unsplash.com/<photo-id>?auto=format&fit=crop&fm=webp&q=72&w=…&h=…` nach `assets/img/` laden und die fotografierende Person in der Footer-Zeile (chrome.js) ergänzen.
- **Formulare** verschicken nichts (Konzeptseite).

## Grundlagen

- Design: Refero-Stil „Steep“ – https://styles.refero.design/style/75fdb89f-ca64-41b3-af36-7a78bd09448e
- Bewegung und Aufbau: https://steep.app (Code analysiert und nachgebaut, keine Dateien übernommen)

## Offen vor einer Veröffentlichung

- [ ] Schriften: Signifier und Söhne sind durch Source Serif 4 und Inter (beide OFL) ersetzt
- [ ] Erfundene Inhalte prüfen (Team, Kunden, Zitate, Zahlen); Hinweis „fiktiv“ steht im Footer, `noindex` ist gesetzt
- [ ] Porträts sind Unsplash-Fotos echter Menschen mit erfundenen Namen – für eine echte Veröffentlichung eigene Fotos verwenden
- [ ] Design-Herkunft (Refero/Steep) in der Referenz transparent nennen
