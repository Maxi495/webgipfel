# Isarwave – Website-Kontext für das Dala-Designsystem

> **Verwendung:** Diesen gesamten Text zusammen mit dem Designsystem (DESIGN.md von Refero / „Dala“) als Kontext in einen Website-Builder oder ein KI-Tool geben. Alle Texte, Strukturen und Bilder sind direkt einsetzbar.
>
> **Hinweis für die Umsetzung:** Isarwave ist eine erfundene Marke. Damit die Seite glaubwürdig wirkt und trotzdem ehrlich bleibt, gilt Folgendes:
> - Es gibt keine erfundenen Studienergebnisse, Zulassungen, Kundenzitate oder Partnerlogos echter Institutionen.
> - Das Impressum enthält nur Platzhalter.
> - Die Teamfotos sind Unsplash-Stockfotos und müssen vor einer echten Veröffentlichung ersetzt werden.

---

## 1. Marke auf einen Blick

| | |
|---|---|
| **Name** | Isarwave |
| **Rechtsform (fiktiv)** | Isarwave Neurotechnologies GmbH |
| **Sitz** | Garching bei München (Forschungscampus-Umfeld) |
| **Gegründet** | 2024 |
| **Teamgröße** | 14 Personen: Neurowissenschaft, Signalverarbeitung, Hardware, Medizin |
| **Branche** | Neurotechnologie / Medtech, digitale EEG-Diagnostik |
| **Claim** | *Das Gehirn spricht. Wir hören zu.* |
| **Kurzbeschreibung** | Isarwave entwickelt ein tragbares EEG-Stirnband mit Trockenelektroden und eine KI-gestützte Auswertungssoftware. Damit können Hirnstrommessungen über mehrere Tage im Alltag aufgezeichnet und von Neurolog:innen schneller ausgewertet werden. |
| **Status** | Klinische Pilotphase. Noch kein zugelassenes Medizinprodukt. Das CE-Konformitätsverfahren nach MDR ist in Vorbereitung. |
| **Domain (fiktiv)** | isarwave.de |

### Das Problem, das Isarwave löst
- Ein klassisches Langzeit-EEG findet meist stationär oder mit Klebe-Elektroden und Kabeln statt. Das ist unbequem, teuer und auf wenige Tage begrenzt.
- Die Auswertung von 24 bis 72 Stunden Hirnstromdaten bindet Fachärzt:innen über viele Stunden.
- Seltene, aber wichtige Ereignisse im EEG werden dadurch oft spät oder gar nicht erfasst.

### Die Lösung
1. **Isarwave Band:** ein leichtes Stirn- und Kopfband mit 8 Trockenelektroden, ohne Gel und ohne Kabel. Patient:innen tragen es zu Hause, im Schlaf und im Alltag.
2. **Isarwave Cortex:** eine Auswertungsplattform für Kliniken und Praxen. Eine KI markiert auffällige Abschnitte und sortiert sie vor. Die Diagnose stellt immer die Ärztin oder der Arzt.
3. **Isarwave Companion App:** die Begleit-App für Patient:innen mit Tragezeit, Akkustand und Tagebuch für Symptome.

### Werte
- **Präzision vor Lautstärke:** Wir versprechen nur, was wir belegen können.
- **Der Mensch entscheidet:** Unsere KI unterstützt Ärzt:innen und ersetzt sie nicht.
- **Daten bleiben in Europa:** Verarbeitung auf Servern in Deutschland, DSGVO-konform, Pseudonymisierung ab Gerät.

---

## 2. Zielgruppen

| Zielgruppe | Was sie wissen will | Primäre Aktion |
|---|---|---|
| Neurolog:innen & Kliniken | Funktioniert das im Klinikalltag? Wie sind Datenqualität und Workflow? | „Pilotpartner werden“ |
| Forschungsgruppen | Rohdatenzugang, Exportformate (EDF+, BIDS) | „Forschungszugang anfragen“ |
| Investor:innen & Presse | Team, Vision, Status | „Kontakt aufnehmen“ |
| Talente | Mission, Kultur, offene Stellen | „Offene Stellen ansehen“ |

---

## 3. Tonalität & Sprache

- **Sprache:** Deutsch als Hauptsprache, ein Umschalter für Englisch in der Navigation.
- **Ton:** ruhig, präzise, wissenschaftlich, aber nicht kühl. Kurze Sätze, keine Superlative, keine Heilsversprechen.
- **Verboten:** „revolutionär“, „heilt“, „100 % genau“, „ersetzt den Arzt“.
- **Typisch:** „Wir machen sichtbar …“, „über Tage statt Stunden“, „im Alltag statt im Labor“.

---

## 4. Sitemap & Navigation

**Navigation (oben, transparent, 14px uppercase):**
`TECHNOLOGIE` · `FORSCHUNG` · `TEAM` · `KARRIERE` · `JOURNAL` · rechts der violette Pill-Button **`PILOTPARTNER WERDEN`**

Seiten:
1. `/` Startseite (One-Pager, Hauptfokus)
2. `/technologie`
3. `/forschung`
4. `/team`
5. `/karriere`
6. `/journal`
7. `/kontakt`, `/impressum`, `/datenschutz`

---

## 5. Startseite: Inhalte Abschnitt für Abschnitt

Das Layout folgt dem Designsystem: schwarzer Hintergrund, Zickzack-Rhythmus aus Text und Visual, Abstände von 60 bis 120px zwischen den Sektionen, keine Karten und keine Rahmen.

### 5.1 Hero
- **Label (14px, #ffb829, uppercase):** NEUROTECHNOLOGIE AUS MÜNCHEN
- **Headline (113px, weight 400, -0.04em):** Das Gehirn spricht. Wir hören zu.
- **Body (18px, weight 200):** Isarwave macht Hirnstrommessungen alltagstauglich: ein kabelloses EEG-Band für zu Hause und eine KI, die Neurolog:innen hilft, in Tagen von Daten das Wesentliche zu finden.
- **CTA (violette Pill):** PILOTPARTNER WERDEN
- **Ghost-Link:** Wie es funktioniert →
- **Visual rechts:** die animierte Partikel-Konstellation aus Dreiecken in Gehirnform (prozedural, kein Foto). Die Partikel pulsieren leicht wellenförmig, als Anspielung auf EEG-Wellen.

### 5.2 Problem
- **Label:** DAS PROBLEM
- **Headline (78px):** 72 Stunden Hirnströme. Ein Bruchteil davon ist entscheidend.
- **Body:** Viele neurologische Auffälligkeiten zeigen sich nicht auf Abruf. Sie erscheinen nachts, unter Stress oder ganz selten. Klassische Messungen sind kurz, kabelgebunden und stationär. Die Auswertung langer Aufzeichnungen kostet Fachärzt:innen Stunden, die im Klinikalltag fehlen.
- **Visual links:** Bild „Signal“ (siehe Bildliste, B2)

### 5.3 Produkt: Isarwave Band
- **Label:** HARDWARE
- **Headline (78px):** Gemessen wird dort, wo das Leben stattfindet.
- **Body:** Acht Trockenelektroden, kein Gel, keine Kabel. Das Isarwave Band wiegt 68 Gramm und zeichnet bis zu 72 Stunden am Stück auf. Die Daten werden schon auf dem Gerät verschlüsselt.
- **Spezifikationen (als schlichte Textzeilen, Label 12px uppercase #9a9a9a, Wert 27px weiß):**
  - KANÄLE: 8
  - AUFZEICHNUNG: bis 72 h
  - GEWICHT: 68 g
  - ABTASTRATE: 500 Hz
- **Visual rechts:** Bild „Oszilloskop“ (B4)

### 5.4 Produkt: Isarwave Cortex
- **Label:** SOFTWARE
- **Headline (78px):** Die KI sortiert. Der Mensch entscheidet.
- **Body:** Isarwave Cortex durchsucht lange Aufzeichnungen nach auffälligen Mustern und legt sie Fachärzt:innen priorisiert vor, mit vollständigem Zugriff auf das Rohsignal. Jede Markierung ist nachvollziehbar. Es gibt keine Blackbox.
- **Drei kurze Merkmale (Headline 24px + Body 15px, nebeneinander, ohne Boxen):**
  - **Priorisierte Abschnitte:** Auffällige Zeitfenster stehen zuerst in der Liste statt irgendwo in Stunde 51.
  - **Nachvollziehbar:** Jede KI-Markierung zeigt, welche Kanäle und Merkmale sie ausgelöst haben.
  - **Offene Formate:** Export als EDF+ und BIDS für Forschung und Zweitbefundung.
- **Visual links:** Bild „Neuronen“ (B3)

### 5.5 Statement (zentriert, sehr groß)
- **Headline (113px), mittig, ein Wort in #ffb829:** Über Tage statt **Stunden.**

### 5.6 Forschung & Validierung
- **Label:** FORSCHUNG
- **Headline (78px):** Wissenschaft zuerst.
- **Body:** Wir entwickeln gemeinsam mit klinischen Partnern im Raum München. Unsere aktuelle Pilotphase prüft, wie gut das Isarwave Band mit herkömmlichen Klebe-Elektroden-EEGs übereinstimmt. Ergebnisse veröffentlichen wir begutachtet, nicht als Marketingfolie.
- **Status-Zeilen (12px uppercase, #8052ff, plus Text 18px):**
  - 2024: Gründung in Garching
  - 2025: Erster funktionsfähiger Prototyp mit 8 Kanälen
  - 2026: Klinische Pilotphase gestartet
  - Nächster Schritt: CE-Konformitätsverfahren nach MDR
- **Ghost-Link:** Forschungszugang anfragen →
- **Visual rechts:** Bild „Mikroskop“ (B5)

### 5.7 Team
- **Label:** TEAM
- **Headline (78px):** Neurowissenschaft trifft Ingenieurskunst.
- **Team-Karten im Carousel** (Porträt mit 24px Radius, Rolle 12px uppercase violett, Name 27px weiß):

| Name (fiktiv) | Rolle | Kurzbio | Bild |
|---|---|---|---|
| Dr. Lena Hofstätter | MITGRÜNDERIN & CEO | Promovierte Neurowissenschaftlerin, 8 Jahre Forschung zu Schlaf-EEG. | T1 |
| Jonas Brenner | MITGRÜNDER & CTO | Signalverarbeitung und Embedded Systems, vorher Automotive-Sensorik. | T2 |
| Dr. Amira Kaya | MEDICAL LEAD | Fachärztin für Neurologie mit Schwerpunkt Epileptologie. | T3 |
| Felix Auer | HEAD OF HARDWARE | Industriedesigner, baut Wearables, die man vergisst, dass man sie trägt. | T4 |

- **Carousel-Dots:** 8px, aktiv #8052ff

### 5.8 München
- **Label:** STANDORT
- **Headline (48px):** Entwickelt in Garching. Gedacht für ganz Europa.
- **Body:** Wir arbeiten dort, wo Ingenieurskunst, Medizin und Forschung in München zusammenkommen: zwischen Campus, Kliniken und Isar.
- **Visual:** Bild „München bei Nacht“ (B6), mit 24px Radius, abgedunkelt (Overlay `rgba(0,0,0,.45)`)

### 5.9 Karriere-Teaser
- **Headline (42px):** Wir suchen Menschen, die Signale lieben.
- **Body:** Offene Stellen in Signalverarbeitung, Machine Learning, Regulatory Affairs und Hardware.
- **Ghost-Link:** Alle 5 offenen Stellen →

### 5.10 Abschluss-CTA
- **Headline (78px):** Werden Sie Teil der Pilotphase.
- **Body:** Wir suchen neurologische Kliniken und Praxen, die mit uns testen, kritisieren und verbessern wollen.
- **CTA (violette Pill):** PILOTPARTNER WERDEN

### 5.11 Footer
- Logo plus „Isarwave“-Wortmarke
- Spalten: Produkt · Unternehmen · Rechtliches
- Kleingedruckt (12px, #9a9a9a): „Isarwave Band und Isarwave Cortex befinden sich in der Entwicklung und sind derzeit nicht als Medizinprodukte zugelassen.“
- © 2026 Isarwave Neurotechnologies GmbH (fiktiv)
- Impressum: **[PLATZHALTER: Anschrift, Geschäftsführung, Registergericht, HRB]**

---

## 6. Bilder: Ersatz für die Bildvorlagen des Designsystems

Alle Bilder stammen von Unsplash und sind **freie Bilder (kein Unsplash+)**. Laut Unsplash-Lizenz ist kommerzielle Nutzung erlaubt, eine Namensnennung ist freiwillig, aber nett. Die URLs sind direkt als `src` nutzbar; Breite und Qualität lassen sich über die Parameter `w=` und `q=` steuern.

> **Regel aus dem Designsystem:** Der Hero bleibt die prozedurale Partikel-Konstellation. Fotos kommen nur in den Folgesektionen und bei Team-Porträts vor. B1 dient als Fallback und als Social-Media-Vorschaubild.

| ID | Einsatz | Motiv | Direkt-URL | Fotograf:in / Seite |
|---|---|---|---|---|
| **B1** | Hero-Fallback, OG-Bild | Leuchtendes neuronales Netz in Gehirnform auf Schwarz | `https://images.unsplash.com/photo-1549925245-f20a1bac6454?auto=format&fit=crop&w=1600&q=80` | Alina Grubnyak – [unsplash.com/photos/tEVGmMaPFXk](https://unsplash.com/photos/neural-network-brain-visualization-tEVGmMaPFXk) |
| **B2** | 5.2 Problem („Signal“) | Dunkle Nervenzellen mit orangen Knoten und blauen Lichtimpulsen (passt zu Amber und Violett) | `https://images.unsplash.com/photo-1719650592946-55163c4994cb?auto=format&fit=crop&w=1600&q=80` | Bhautik Patel – [unsplash.com/photos/NVprB2Xt1bA](https://unsplash.com/photos/nerve-cells-with-glowing-nodes-NVprB2Xt1bA) |
| **B3** | 5.4 Cortex („Neuronen“) | Violett-blaues abstraktes Muster auf Schwarz | `https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?auto=format&fit=crop&w=1600&q=80` | Sandip Kalal – [unsplash.com/photos/tcf9V6PDNoA](https://unsplash.com/photos/a-purple-and-blue-abstract-pattern-on-a-black-background-tcf9V6PDNoA) |
| **B4** | 5.3 Band („Oszilloskop“) | Signalkurve auf einem Oszilloskop, dunkel | `https://images.unsplash.com/photo-1535127022272-dbe7ee35cf33?auto=format&fit=crop&w=1600&q=80` | Michael Schiffer – [unsplash.com/photos/13UugSL9q7A](https://unsplash.com/photos/scope-image-13UugSL9q7A) |
| **B5** | 5.6 Forschung („Mikroskop“) | Mikroskopaufnahme eines Motoneurons | `https://images.unsplash.com/photo-1716833322865-56bae681995c?auto=format&fit=crop&w=1600&q=80` | Bioscience Image Library by Fayette Reynolds – [unsplash.com/photos/WkDk5Dt3tk0](https://unsplash.com/photos/nervous-tissue-spinal-cord-motor-neuron-WkDk5Dt3tk0) |
| **B6** | 5.8 München | Luftbild einer Stadt bei Nacht (Suche „Munich night“) | `https://images.unsplash.com/photo-1577462281852-279bf4986f7b?auto=format&fit=crop&w=1600&q=80` | Daniel Seßler – [unsplash.com/photos/C6l894Q7wpI](https://unsplash.com/photos/aerial-photo-of-cityscape-during-nighttime-C6l894Q7wpI) |
| **B7** | Journal-Teaser / Reserve | Gehirn-Close-up auf schwarzem Hintergrund | `https://images.unsplash.com/photo-1711409645921-ef3db0501f96?auto=format&fit=crop&w=1600&q=80` | Shawn Day – [unsplash.com/photos/ii6BOPjAtVY](https://unsplash.com/photos/a-close-up-of-a-human-brain-on-a-black-background-ii6BOPjAtVY) |
| **B8** | Forschung / Reserve | Wissenschaftler am Mikroskop | `https://images.unsplash.com/photo-1631816285219-c6af3851e360?auto=format&fit=crop&w=1600&q=80` | CDC – [unsplash.com/photos/cyhgWD1i_fA](https://unsplash.com/photos/a-man-in-a-lab-coat-looking-through-a-microscope-cyhgWD1i_fA) |

### Team-Porträts (Schwarzweiß, dunkler Hintergrund, mit 24px Radius einsetzen)

| ID | Person (fiktiv) | Direkt-URL | Fotograf:in / Seite |
|---|---|---|---|
| **T1** | Dr. Lena Hofstätter | `https://images.unsplash.com/photo-1518611540400-6b85a0704342?auto=format&fit=crop&w=800&h=1000&q=80` | Richard Jaimes – [unsplash.com/photos/s97-KYat9sA](https://unsplash.com/photos/grayscale-photo-of-woman-s97-KYat9sA) |
| **T2** | Jonas Brenner | `https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&h=1000&q=80` | Christopher Campbell – [unsplash.com/photos/Xo4YvBp6IBM](https://unsplash.com/photos/grayscale-photography-of-man-wearing-shirt-Xo4YvBp6IBM) |
| **T3** | Dr. Amira Kaya | `https://images.unsplash.com/photo-1611952534382-324c609940da?auto=format&fit=crop&w=800&h=1000&q=80` | Anderson Rian – [unsplash.com/photos/7Fi8JF1ci8k](https://unsplash.com/photos/grayscale-photo-of-woman-smiling-7Fi8JF1ci8k) |
| **T4** | Felix Auer | `https://images.unsplash.com/photo-1594751684241-bcef815d5a57?auto=format&fit=crop&w=800&h=1000&q=80` | Lukas Kaufmann – [unsplash.com/photos/wNB3DFN3u9Q](https://unsplash.com/photos/man-in-black-crew-neck-t-shirt-wNB3DFN3u9Q) |

### Bildbehandlung
- Alle Fotos mit `object-fit: cover` und 24px Radius einsetzen, ohne Rahmen und ohne Schatten.
- Farbige Fotos (B2–B6) mit einem leichten schwarzen Verlauf zum Seitenrand hin auslaufen lassen, damit sie im „Void“ schweben.
- Team-Porträts in Graustufen lassen (`filter: grayscale(1)`). Die Farbe kommt nur über das violette Rollen-Label.
- Alt-Texte auf Deutsch, zum Beispiel: „Visualisierung eines neuronalen Netzes in Gehirnform auf schwarzem Hintergrund“.

---

## 7. Designsystem-Zuordnung (Kurzfassung)

| Token | Einsatz bei Isarwave |
|---|---|
| `#000000` Void | Gesamter Hintergrund |
| `#ffffff` Bone White | Headlines, Body |
| `#9a9a9a` / `#bdbdbd` | Navigation inaktiv, Spezifikations-Labels, Kleingedrucktes |
| `#8052ff` Electric Iris | Nur der Haupt-Button, Rollen-Labels, Carousel-Dots, Logo |
| `#ffb829` Saffron Spark | Sektions-Labels und das Akzentwort im Statement |
| `#15846e` Deep Verdant | Verlaufsende im Logo-Dreieck |
| PPNeueMontreal (Fallback Inter) | Headlines 400, Body 200, Navigation 600 uppercase |

**Logo-Idee:** ein spitzes Dreiecksfragment von Violett zu Teal, angelehnt an die Partikel. Daneben die Wortmarke „Isarwave“ in Weiß, 14px, weight 600. Optional läuft eine feine Wellenlinie durch das Dreieck.

---

## 8. Meta & SEO

- **Title:** Isarwave – EEG für den Alltag | Neurotechnologie aus München
- **Description:** Isarwave entwickelt ein kabelloses EEG-Band und eine KI-gestützte Auswertung für Langzeit-Hirnstrommessungen. In klinischer Pilotphase, entwickelt in Garching bei München.
- **OG-Bild:** B1

---

## 9. Prompt-Vorlage für den Website-Bau

> Baue eine einseitige, responsive Website (HTML/CSS/JS) für **Isarwave** exakt nach dem beigefügten Designsystem (Dala-Stil: reines Schwarz, PPNeueMontreal/Inter, 113px-Headlines mit weight 400 und -0.04em, Body 18px weight 200, eine einzige violette Pill als CTA, Labels in #ffb829, keine Karten, Rahmen oder Schatten). Nutze die Inhalte aus Abschnitt 5 wörtlich und die Bilder aus Abschnitt 6 an den angegebenen Stellen. Der Hero zeigt rechts eine animierte Canvas-Partikel-Konstellation aus Tausenden kleinen, farbigen, umrandeten Dreiecken, die zusammen eine Gehirnform bilden und langsam wellenförmig pulsieren. Die Sektionen wechseln im Zickzack zwischen Text und Visual. Mobil wird alles einspaltig mit 16px Rand, und die Headlines skalieren per `clamp()`.
