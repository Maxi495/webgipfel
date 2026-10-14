# Isarwave – Konzept-Website

Fiktive Neurotech-Marke (Isarwave Neurotechnologies GmbH, Garching). Konzeptprojekt von Webgipfel, geplant als Referenz auf webgipfel.com.

## Aufbau

- `index.html` – Startseite
- `technologie.html` – Unterseite „Technologie & Forschung“
- `journal.html` – Journal-Übersicht mit Themenfilter
- `artikel.html?a=<slug>` – einzelner Journal-Beitrag
- `assets/css/site.css` – gemeinsames Stylesheet (Designsystem „Dala“)
- `assets/js/i18n.js` – Sprachumschaltung DE/EN mit englischem Wörterbuch (läuft als erstes Skript)
- `assets/js/stage.js` – Partikel-Bühne (Formen, Scroll-Übergänge, Maus- und Klick-Interaktion)
- `assets/js/site.js` – Intro, Navigation, Text-Animation, Scroll-Effekte, Kontakt-Popup
- `assets/js/team.js` – Team-Karussell und Unterstützer-Pyramiden (nur Startseite)
- `assets/js/journal-data.js` – alle Journal-Beiträge (DE/EN), Autor:innen, Kategorien
- `assets/js/journal.js` – baut Übersicht und Artikelseite aus den Daten
- `assets/img/` – alle Fotos lokal als WebP (Motive in 480/1200/2000 px, Teamfotos als Hochformat in 320/480/640 px)
- `assets/fonts/` – Inter, lokal gehostet (variable Schrift, latin)
- `isarwave-kontext.md` – Briefing mit Texten, Bildern und Tonalität

Lokal ansehen:

```bash
python3 -m http.server 4322
```

Dann http://localhost:4322 öffnen.

## Pflege

- **Texte ändern:** Deutsch direkt im HTML, Englisch in `assets/js/i18n.js` unter demselben Schlüssel (`data-i18n="…"`).
- **Neue Partikel-Form an einer Stelle:** Element mit `data-shape="brain|band|wave|neuron|field"` und optional `data-yaw`, `data-pitch`, `data-size`, `data-spin`, `data-opacity`.
- **Neuer Journal-Beitrag:** Objekt in `ARTICLES` in `assets/js/journal-data.js` ergänzen (Titel, Lead, Text je DE/EN, Unsplash-ID). `featured: true` zeigt ihn groß oben.
- **Neues Foto:** Unsplash-Motiv in den drei Breiten als WebP nach `assets/img/<id>-<breite>.webp` legen (z. B. `…?fit=crop&w=1200&q=72&fm=webp`) und mit `srcset` einbinden.
- **Partikel-Leistung:** Die Bühne passt sich selbst an (weniger Partikel auf schwachen Geräten, Qualitätsstufen bei Rucklern). In der Konsole zeigt `IW_STAGE.level` die aktuelle Stufe (0 = volle Qualität).
- **Kontakt-Popup öffnen:** beliebiges Element mit `data-contact="pilot|research|general"`.
- **Formular-Versand:** Ohne Endpoint zeigt das Formular nur die Bestätigung. Für echten Versand `data-form-endpoint="/api/…"` am `<body>` setzen; das Formular sendet dann JSON per POST.

## Grundlagen

- Design: Refero-Designsystem „Dala“ – https://styles.refero.design/style/e5f5f8cf-e68d-4ed1-bbf5-6b67569af648
- Animationen und Team-Bereich nach dem Vorbild der Dala-Website (https://dala.craftedbygc.com/)

## Offen vor einer Veröffentlichung

- [ ] Hinweis „Fiktives Konzeptprojekt“ und `noindex` ergänzen
- [ ] Kontaktformular an einen echten Endpoint anschließen (derzeit kein Versand)
- [x] Schrift (Inter) und Fotos lokal gehostet, keine Anfragen mehr an Google Fonts oder Unsplash
- [ ] `og:image` auf absolute URL umstellen, sobald die Domain feststeht
- [ ] Erfundene Inhalte prüfen: Teammitglieder, Unterstützer, Studien ISAR-01/02, technische Daten, 7 Journal-Beiträge inkl. Pressemitteilungen und Seed-Runde, E-Mail-Adressen, leere LinkedIn-Links
- [ ] Teamfotos und EEG-Fotos sind Stockfotos (Unsplash); die gezeigten Geräte sind nicht das Isarwave Band
- [ ] Impressum und Datenschutz (Platzhalter)
- [ ] Design-Herkunft (Refero/Dala) in der Referenz transparent nennen
