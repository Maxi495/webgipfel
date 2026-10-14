#!/usr/bin/env python3
"""
Tonwert — Seiten bauen.

Erzeugt alle elf Seiten aus einer Quelle, damit Kopfzeile, Fusszeile und die
Bewegungsklassen auf jeder Seite identisch sind.

    python3 _werkzeug/seiten-bauen.py

Zwei Auslieferungen, zwei Basis-Pfade. Beide ueber Umgebungsvariablen:
    python3 _werkzeug/seiten-bauen.py                      -> /Tonwert  (eigenes Repo)
    TONWERT_BASIS=/referenzen/tonwert TONWERT_ZIEL=... \
        python3 _werkzeug/seiten-bauen.py                  -> webgipfel
"""
from html import escape as e
import os
from pathlib import Path

# Basis-Pfad. Auf GitHub Pages liegt ein Projekt-Repo unter /<Repo-Name>/,
# nicht auf der Wurzel. HIER steht der Repo-Name — die einzige Zeile, die
# sich aendert, wenn das Repo anders heisst. Bei eigener Domain oder Vercel
# wieder auf "" setzen und neu bauen.
BASIS = os.environ.get("TONWERT_BASIS", "/Tonwert")
HIER  = Path(__file__).resolve().parent.parent
ZIEL  = Path(os.environ.get("TONWERT_ZIEL", HIER))

# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------
PRODUKT = [("/funktionen/", "Funktionen"), ("/berichte/", "Berichte")]
HAUPT   = [("/fuer-wen/", "Für wen"), ("/preise/", "Preise"),
           ("/wissen/", "Wissen"), ("/ueber-uns/", "Über uns")]

def u(pfad: str) -> str:
    return BASIS + pfad

# ---------------------------------------------------------------------------
# Bausteine
# ---------------------------------------------------------------------------
def bild(stamm, breiten, alt, klasse="", groessen="100vw", laden="lazy", rahmen=True):
    """Bild mit srcset. Der Rahmen schneidet, das Bild zieht von 0,8 auf 1."""
    srcset = ", ".join(f"{u('/bilder/')}{stamm}-{b}.webp {b}w" for b in breiten)
    img = (f'<img src="{u("/bilder/")}{stamm}-{breiten[-1]}.webp" srcset="{srcset}" '
           f'sizes="{groessen}" alt="{e(alt)}" loading="{laden}" decoding="async">')
    if not rahmen:
        return img
    return f'<div class="bildrahmen {klasse}">{img}</div>'

def objekt(form, paar, groesse="140px", verzug="0s", dauer="11s"):
    inner = ('<span class="k k1"></span><span class="k k2"></span><span class="k k3"></span>'
             if form == "wuerfel" else "")
    return (f'<div class="obj obj--{form} {paar} einzug einzug--marke" '
            f'style="--gr:{groesse};--verzug:{verzug};--dauer:{dauer}" aria-hidden="true">{inner}</div>')

def klappe(frage, antwort):
    pfeil = ('<svg class="klappe__pfeil" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
             '<path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="1.5" '
             'stroke-linecap="round" stroke-linejoin="round"/></svg>')
    return (f'<li class="klappe frage">'
            f'<button class="klappe__kopf" type="button">'
            f'<h3 class="t-subheading">{e(frage)}</h3>{pfeil}</button>'
            f'<div class="klappe__koerper"><div class="klappe__innen fliess">'
            f'<p class="gedaempft">{antwort}</p></div></div></li>')

def merkmal(titel, kurz, lang, i, zusatz="", vor=""):
    """Aufklappbare Karte.

    Gleiche Mechanik wie die Klappliste, damit es genau eine Stelle gibt, die
    Hoehen faehrt. Ein Kaestchen, das sich beim Klicken faerbt, muss auch etwas
    TUN — sonst ist es ein Bedienelement ohne Funktion, und das ist schlechter
    als gar keins.
    """
    kicker = f'<span class="t-caption gedaempft">{e(vor)}</span>' if vor else ""
    return (f'<li class="karte {zusatz} merkmal klappe einzug einzug--reihe s{i+1}">'
            f'<button class="klappe__kopf" type="button">'
            f'<span class="merkmal__text">{kicker}'
            f'<span class="t-subheading">{e(titel)}</span>'
            f'<span class="t-caption gedaempft">{e(kurz)}</span></span>'
            f'<span class="merkmal__zeichen" aria-hidden="true"></span></button>'
            f'<div class="klappe__koerper"><div class="klappe__innen">'
            f'<p class="t-caption gedaempft">{e(lang)}</p>'
            f'</div></div></li>')


def raster(inhalt, spalten=3):
    return (f'<ul class="gitter gitter--{spalten}" '
            f'style="list-style:none;margin:0;padding:0">{inhalt}</ul>')


def kopfzeile(aktiv="", dunkel=False):
    def verweis(pfad, text):
        hier = ' aria-current="page"' if pfad == aktiv else ""
        return f'<li><a class="kopf__verweis t-caption" href="{u(pfad)}"{hier}>{e(text)}</a></li>'

    def unterverweis(pfad, text):
        hier = ' aria-current="page"' if pfad == aktiv else ""
        return (f'<li><a class="auswahl__verweis t-caption" href="{u(pfad)}"{hier}>'
                f'{e(text)}</a></li>')

    unter = "".join(unterverweis(p, t) for p, t in PRODUKT)
    produkt_aktiv = any(p == aktiv for p, _ in PRODUKT)
    produkt_stil = ' style="opacity:.3"' if produkt_aktiv else ""

    dunkelklasse = " kopf--dunkel" if dunkel else ""
    return f'''<header class="kopf kopf--oben{dunkelklasse}">
  <div class="kopf__reihe">
    <a class="kopf__marke" href="{u("/")}">Tonwert</a>
    <nav aria-label="Hauptnavigation">
      <ul class="kopf__liste">
        <li class="auswahlfeld">
          <span class="kopf__verweis t-caption"{produkt_stil}>Produkt</span>
          <div class="auswahl"><ul class="auswahl__liste">{unter}</ul></div>
        </li>
        {"".join(verweis(p, t) for p, t in HAUPT)}
      </ul>
    </nav>
    <div class="kopf__rechts">
      <a class="knopf knopf--voll t-caption" href="{u("/kontakt/")}">Gespräch vereinbaren</a>
      <button class="brenner" type="button" aria-expanded="false" aria-label="Menü">
        <span class="brenner__strich"></span><span class="brenner__strich"></span><span class="brenner__strich"></span>
      </button>
    </div>
  </div>
</header>
<div class="blende" data-auf="nein">
  <nav aria-label="Menü">
    <ul class="blende__liste">
      {"".join(f'<li class="blende__punkt"><a class="t-subheading" href="{u(p)}">{e(t)}</a></li>' for p, t in PRODUKT + HAUPT)}
      <li class="blende__punkt"><a class="t-subheading" href="{u("/kontakt/")}">Kontakt</a></li>
    </ul>
  </nav>
</div>'''

def fusszeile():
    spalten = [
        ("Produkt", PRODUKT + [("/preise/", "Preise")]),
        ("Unternehmen", [("/ueber-uns/", "Über uns"), ("/wissen/", "Wissen"), ("/kontakt/", "Kontakt")]),
        ("Rechtliches", [("/impressum/", "Impressum"), ("/datenschutz/", "Datenschutz")]),
    ]
    sp = "".join(
        f'<div><p class="fuss__titel t-caption">{e(titel)}</p><ul class="fuss__liste">'
        + "".join(f'<li><a class="fuss__verweis t-caption" href="{u(p)}">{e(t)}</a></li>' for p, t in posten)
        + '</ul></div>'
        for titel, posten in spalten)

    return f'''<footer class="fuss">
  <div class="huelle">
    <div class="fuss__oben einzugsfeld">
      <div class="fuss__ruf stapeln">
        <h2 class="t-heading einzug einzug--titel">Eine Bilanz,<br>die Bestand hat.</h2>
        <p class="t-body gedaempft einzug spalte-schmal">Ein Gespräch von zwanzig Minuten
          genügt, um zu klären, ob Tonwert zu Ihrem Haus passt.</p>
        <div class="knopfreihe einzug">
          <a class="knopf knopf--hell t-caption" href="{u("/kontakt/")}">Gespräch vereinbaren</a>
          <a class="knopf knopf--rand t-caption" style="color:var(--papier);border-color:rgba(255,255,255,.4)" href="{u("/preise/")}">Preise ansehen</a>
        </div>
      </div>
      <div class="fuss__bildfeld scheinfeld einzug einzug--seitlich">
        <span class="schein" aria-hidden="true"></span>
        {bild("fuss", [600, 1200, 1800], "Regalreihen in einem Lager", groessen="(min-width:1000px) 44vw, 100vw")}
      </div>
    </div>
    <div class="fuss__spalten">{sp}</div>
    <div class="fuss__unten t-caption">
      <a class="fuss__marke kopf__marke" href="{u("/")}">Tonwert</a>
      <p>© 2026 Tonwert GmbH, München</p>
    </div>
  </div>
</footer>'''

def seite(titel, beschreibung, inhalt, aktiv="", dunkel=False):
    """Gemeinsames Gerüst. .js wird inline gesetzt, damit die Seite ohne
    JavaScript nicht unsichtbar bleibt — alle Einzuege haengen an .js."""
    return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{e(titel)}</title>
<meta name="description" content="{e(beschreibung)}">
<link rel="preload" href="{u("/fonts/inter.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{u("/stil.css")}">
<script>document.documentElement.className+=" js"</script>
</head>
<body>
<a class="sprungmarke t-caption" href="#inhalt">Zum Inhalt springen</a>
{kopfzeile(aktiv, dunkel)}
<main id="inhalt">
{inhalt}
</main>
{fusszeile()}
<script src="{u("/bewegung.js")}" defer></script>
</body>
</html>
'''

def schreibe(pfad: str, text: str) -> None:
    ziel = ZIEL / pfad
    ziel.parent.mkdir(parents=True, exist_ok=True)
    ziel.write_text(text, encoding="utf-8")
    print(f"  {pfad:<34} {len(text)/1024:>6.1f} kB")

# ===========================================================================
# INHALTE
# Fachlich gilt: CSRD, VSME, GHG Protocol und die Scope-Einteilung sind echte
# Regelwerke und werden nur so beschrieben, wie sie belegbar sind. Konkrete
# Schwellenwerte und Fristen stehen bewusst nirgends — die sind in Bewegung.
# ===========================================================================

MANNSCHAFT = [
    ("portrait-3", "Jonas Reinhardt",  "Gründung",          "Vorher zwölf Jahre in der Energiewirtschaft, zuletzt verantwortlich für Verbrauchsdatenerfassung in einem Stadtwerk."),
    ("portrait-2", "Mirjam Alsleben",  "Gründung",          "Wirtschaftsprüferin, hat vier Jahre Nachhaltigkeitsberichte geprüft und dabei gesehen, woran sie regelmässig scheitern."),
    ("portrait-1", "Deniz Korkmaz",    "Entwicklung",       "Baut die Schnittstellen zu Buchhaltung und Energieversorgern. Mag Zahlen, die sich gegenprüfen lassen."),
    ("portrait-5", "Annika Vogelsang", "Bilanzierung",      "Rechnet die Faktorendatenbank und prüft jede Position gegen die Quelle, aus der sie stammt."),
    ("portrait-6", "Tobias Henseler",  "Kundenbetreuung",   "Begleitet die erste Bilanz. Kennt den Punkt, an dem Unternehmen aufgeben wollen, und was dagegen hilft."),
    ("portrait-4", "Clara Mühlbauer",  "Produkt",           "Übersetzt die Anforderungen der Regelwerke in Bildschirme, die man ohne Schulung versteht."),
]

FRAGEN = [
    ("Wie lange dauert die erste Bilanz?",
     "Das hängt daran, wie gut Ihre Verbrauchsdaten greifbar sind. Liegen Strom- und Gasabrechnungen "
     "digital vor und ist der Fuhrpark erfasst, sind zwei bis drei Wochen realistisch. Der längste "
     "Teil ist nie die Rechnung, sondern das Zusammentragen."),
    ("Brauchen wir dafür eine Beratung?",
     "Nein. Tonwert ist so gebaut, dass eine Person aus der Buchhaltung oder dem Facility Management "
     "damit arbeiten kann. Wenn Sie an einer Stelle nicht weiterkommen, gehen wir sie mit Ihnen durch."),
    ("Was passiert, wenn Daten fehlen?",
     "Dann steht das in der Bilanz. Tonwert kennzeichnet jede Position, die geschätzt ist, und nennt "
     "die Grundlage der Schätzung. Eine Lücke, die als Lücke erkennbar ist, hält jede Prüfung besser "
     "aus als eine Zahl, die niemand belegen kann."),
    ("Können wir den Bericht selbst weiterverarbeiten?",
     "Ja. Jede Bilanz lässt sich als Tabelle und als PDF ausgeben, dazu die Rohdaten mit allen "
     "verwendeten Faktoren. Sie bleiben unabhängig von uns."),
    ("Wo liegen unsere Daten?",
     "In Rechenzentren in Deutschland. Verträge zur Auftragsverarbeitung nach Artikel 28 DSGVO "
     "schliessen wir vor der ersten Datenübergabe."),
]

def start():
    schritte = [
        ("Erfassen", "erfassen",
         "Zählerstände, Rechnungen, Tankbelege, Reisekosten. Tonwert liest aus, was maschinenlesbar "
         "ist, und fragt nach, wo etwas fehlt. Nichts wird stillschweigend geschätzt.",
         "Mann an einem Arbeitsplatz mit Unterlagen"),
        ("Berechnen", "buero-1",
         "Jede Position bekommt einen Faktor aus einer hinterlegten Datenbank. Sie sehen für jede "
         "Zahl, woher sie kommt — Quelle, Jahr und Einheit stehen daneben.",
         "Schreibtisch mit Unterlagen und Rechner"),
        ("Berichten", "regale",
         "Ein Bericht nach VSME, der Standardfragebogen Ihres Kunden, oder beides. Die Daten liegen "
         "einmal vor und bedienen danach jedes Format.",
         "Hohe Regalreihen in einem Lager"),
    ]
    karten = "".join(f'''      <article class="stapel__karte">
        <div class="stapel__inhalt stapeln">
          <p class="t-caption gedaempft">Schritt {i+1}</p>
          <h3 class="t-heading-sm">{e(titel)}</h3>
          <p class="t-body stapel__text spalte-schmal">{e(text)}</p>
        </div>
        {bild(stamm, [600, 1200, 1800], alt, klasse="stapel__bild", groessen="(min-width:1000px) 90vw, 100vw")}
      </article>''' for i, (titel, stamm, text, alt) in enumerate(schritte))

    reiter = [
        ("erfassen", "Erfassen", "kugel", "p-lavendel",
         "Strom, Gas, Fernwärme, Kraftstoff, Geschäftsreisen und Einkauf. Tonwert nimmt die Belege, "
         "die Sie ohnehin haben, und ordnet sie den richtigen Kategorien zu."),
        ("berechnen", "Berechnen", "wuerfel", "p-himmel",
         "Die Einteilung folgt dem GHG Protocol: Scope 1 für eigene Verbrennung, Scope 2 für "
         "eingekaufte Energie, Scope 3 für alles in der Lieferkette davor und danach."),
        ("berichten", "Berichten", "ring", "p-blau",
         "Aus derselben Datenlage entsteht ein VSME-Bericht, eine Antwort auf den Fragebogen Ihres "
         "Kunden oder eine Vorlage für Ihre Bank."),
    ]
    reiterkoepfe = "".join(
        f'<button class="reiter t-caption" type="button" role="tab" id="r-{s}" '
        f'aria-controls="f-{s}" aria-selected="{"true" if i == 0 else "false"}">{e(t)}</button>'
        for i, (s, t, _, _, _) in enumerate(reiter))
    reiterfelder = "".join(f'''<div class="reiterfeld gitter gitter--seite" id="f-{s}" role="tabpanel"
         aria-labelledby="r-{s}"{"" if i == 0 else " hidden"}>
      <div class="stapeln"><h3 class="t-heading-sm">{e(t)}</h3>
        <p class="t-body gedaempft spalte-schmal">{e(text)}</p></div>
      <div style="display:flex;justify-content:center">{objekt(form, paar, "180px")}</div>
    </div>''' for i, (s, t, form, paar, text) in enumerate(reiter))

    vorteile = [
        ("Jede Zahl hat eine Quelle",
         "Neben jeder Position steht, aus welchem Beleg und welchem Faktor sie entstanden ist.",
         "Öffnen Sie eine Position, und Sie sehen den Beleg, aus dem sie stammt, den verwendeten "
         "Emissionsfaktor mit Quelle und Jahr, und wer den Wert zuletzt geändert hat. Das ist der "
         "Unterschied zwischen einer Bilanz, die eine Prüfung übersteht, und einer Tabelle, die "
         "nach einem halben Jahr niemand mehr erklären kann."),
        ("Kein Tabellenblatt",
         "Die Bilanz liegt an einer Stelle, nicht in vierzehn Dateiversionen.",
         "Verbrauchsdaten, Faktoren und Ergebnis liegen in einem Stand. Niemand arbeitet "
         "versehentlich in einer alten Fassung weiter, und es gibt keine Datei, die per E-Mail "
         "herumgereicht wird. Wer etwas ändert, ändert es für alle — nachvollziehbar und umkehrbar."),
        ("Vergleich zum Vorjahr",
         "Ab der zweiten Bilanz sehen Sie, was sich verändert hat und woran es lag.",
         "Tonwert stellt die Jahre nebeneinander und weist die Abweichung je Kategorie aus. "
         "Wichtiger als die Veränderung ist ihre Erklärung: ob der Verbrauch tatsächlich gesunken "
         "ist oder nur der Emissionsfaktor sich geändert hat. In der Summe sieht beides gleich aus "
         "und bedeutet das Gegenteil."),
        ("Scope 3 schrittweise",
         "Die Lieferkette lässt sich nach und nach aufnehmen, statt alles auf einmal zu verlangen.",
         "Scope 3 umfasst fünfzehn Kategorien, und bei den meisten Unternehmen liegt dort der "
         "grösste Teil der Emissionen. Sie beginnen mit den Kategorien, die sich aus Ihrer "
         "Buchhaltung ergeben, und nehmen weitere auf, sobald Daten verfügbar sind. Die "
         "Bilanzgrenze wird dabei dokumentiert, damit spätere Jahre vergleichbar bleiben."),
        ("Antworten statt Berichte",
         "Fragebögen grosser Kunden lassen sich direkt aus der Bilanz beantworten.",
         "Grosse Kunden fragen mit eigenen Bögen ab, selten zweimal im selben Format. Aus einer "
         "vorhandenen Bilanz lassen sich diese Felder befüllen, statt die Recherche jedes Mal neu "
         "zu beginnen. Was sich nicht beantworten lässt, bleibt sichtbar offen — eine erkennbare "
         "Lücke ist belastbarer als eine geschätzte Zahl."),
        ("Export ohne Bindung",
         "Tabelle, PDF und Rohdaten. Sie können jederzeit ohne uns weiterarbeiten.",
         "Jede Bilanz lässt sich als Tabelle, als PDF und als Rohdatensatz mit allen verwendeten "
         "Faktoren ausgeben. Wenn Sie das Werkzeug wechseln, nehmen Sie Ihre Daten vollständig "
         "mit. Wir halten Sie über den Nutzen, nicht über das Format."),
    ]
    vorteilsliste = "".join(f'''<li class="karte karte--nebel merkmal klappe einzug einzug--reihe s{i+1}">
        <button class="klappe__kopf" type="button">
          <span class="merkmal__text">
            <span class="t-subheading">{e(t)}</span>
            <span class="t-caption gedaempft">{e(k)}</span>
          </span>
          <span class="merkmal__zeichen" aria-hidden="true"></span>
        </button>
        <div class="klappe__koerper"><div class="klappe__innen">
          <p class="t-caption gedaempft">{e(lang)}</p>
        </div></div></li>''' for i, (t, k, lang) in enumerate(vorteile))

    begriffe = ["Scope 1", "Scope 2", "Scope 3", "GHG Protocol", "VSME", "CSRD",
                "Product Carbon Footprint", "Emissionsfaktor", "Bilanzgrenze", "Basisjahr"]
    bandstuecke = "".join(f'<span class="band__stueck t-subheading">{e(b)}</span>' for b in begriffe)

    return f'''<section class="aufmacher">
  <div class="aufmacher__grund">
    {bild("aufmacher", [1200, 1800, 2400], "Industriehalle mit einem Deckenkran über den Arbeitsbereichen",
          klasse="aufmacher__bildrahmen", groessen="100vw", laden="eager", rahmen=False).replace("<img", '<img class="aufmacher__bild"')}
  </div>
  <div class="aufmacher__dunkel" aria-hidden="true"></div>
  <span class="aufmacher__schleier" aria-hidden="true"></span>
  <div class="huelle aufmacher__inhalt einzugsfeld">
    <div class="aufmacher__titel">
      <h1 class="aufmacher__h1 einzug einzug--titel">Ihre Kunden fragen<br>nach CO₂-Zahlen.<br>Jetzt haben Sie welche.</h1>
    </div>
    <div class="aufmacher__neben stapeln einzug">
      <p class="t-body">Tonwert sammelt Ihre Verbrauchsdaten, rechnet daraus eine Bilanz nach
        Scope 1 bis 3 und erzeugt den Bericht, den Ihre Kunden verlangen. Ohne Beraterhonorar
        und ohne Tabellenblatt.</p>
      <div class="knopfreihe">
        <a class="knopf knopf--hell t-caption" href="{u("/kontakt/")}">Gespräch vereinbaren</a>
        <a class="knopf knopf--rand t-caption" style="color:var(--papier);border-color:rgba(255,255,255,.5)" href="{u("/funktionen/")}">Funktionen ansehen</a>
      </div>
    </div>
  </div>
</section>

<section class="abschnitt abschnitt--gross einzugsfeld">
  <div class="huelle gitter gitter--seite">
    <h2 class="t-heading einzug einzug--titel">Es fängt mit einer<br>E-Mail an.</h2>
    <div class="fliess einzug einzug--ruhig">
      <p class="t-body">Ein grosser Kunde braucht für seine eigene Bilanz Ihre Emissionsdaten,
        Frist vier Wochen. Niemand im Haus weiss, wo man anfängt.</p>
      <p class="t-body gedaempft">Zwei Wochen später sitzt jemand aus der Buchhaltung über
        Stromrechnungen und sucht Umrechnungsfaktoren im Netz. Das ist der Punkt, an dem die
        meisten Unternehmen zum ersten Mal merken, dass eine CO₂-Bilanz keine Frage der
        Haltung ist, sondern eine Aufgabe.</p>
    </div>
  </div>
</section>

<section class="abschnitt--nebel">
  <div class="huelle" style="padding-top:var(--f96)">
    <div class="einzugsfeld"><h2 class="t-heading einzug einzug--titel">Drei Schritte.</h2></div>
  </div>
  <div class="stapel huelle">
    <div class="stapel__halter">
{karten}
    </div>
  </div>
</section>

<section class="abschnitt abschnitt--gross einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Was dabei passiert.</h2>
    <div>
      <div class="reiterleiste" role="tablist" aria-label="Die drei Schritte">{reiterkoepfe}</div>
      {reiterfelder}
    </div>
  </div>
</section>

<div class="band" data-tempo="34">
  <div class="band__reihe">{bandstuecke}</div>
</div>

<section class="abschnitt abschnitt--gross einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Woran Sie es merken.</h2>
    <ul class="gitter gitter--3" style="list-style:none;margin:0;padding:0">{vorteilsliste}</ul>
  </div>
</section>

<section class="abschnitt abschnitt--kohle einzugsfeld">
  <div class="huelle gitter gitter--seite">
    <h2 class="t-heading einzug einzug--titel">Wir rechnen<br>nicht schön.</h2>
    <div class="fliess einzug einzug--ruhig">
      <p class="t-body">Wenn Ihre Bilanz schlecht aussieht, sagt Tonwert das.</p>
      <p class="t-body gedaempft">Alles andere wäre die teuerste Art, sich selbst zu belügen —
        und es fällt spätestens dann auf, wenn jemand die Zahlen prüft.</p>
    </div>
  </div>
</section>

<section class="abschnitt abschnitt--gross einzugsfeld">
  <div class="huelle huelle--fragen stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Häufige Fragen.</h2>
    <ul class="fragen">
{"".join(klappe(f, a) for f, a in FRAGEN)}
    </ul>
  </div>
</section>'''

def kopfblock(ueber, titel, text, breit=True):
    """Seitenaufmacher der Unterseiten. Titel mit Vorlauf, Text ohne Kippung."""
    return f'''<section class="abschnitt abschnitt--gross einzugsfeld" style="padding-top:calc(var(--kopfhoehe) + var(--f96))">
  <div class="huelle stapeln">
    <p class="t-caption gedaempft einzug">{e(ueber)}</p>
    <h1 class="t-heading-lg einzug einzug--titel">{titel}</h1>
    <p class="t-subheading gedaempft einzug {"spalte-schmal" if not breit else ""}" style="max-width:52ch">{e(text)}</p>
  </div>
</section>'''

def funktionen():
    bloecke = [
        ("Verbrauchsdaten aufnehmen", "erfassen",
         ["Strom-, Gas- und Fernwärmeabrechnungen werden ausgelesen, statt abgetippt.",
          "Fuhrpark über Tankbelege oder Kilometerstände, je nachdem, was vorliegt.",
          "Geschäftsreisen aus der Reisekostenabrechnung.",
          "Einkauf über die Kreditorenbuchhaltung, soweit die Positionen sich zuordnen lassen."],
         "Mann an einem Arbeitsplatz mit Unterlagen", False),
        ("Nach Scope 1 bis 3 rechnen", "buero-1",
         ["Die Einteilung folgt dem GHG Protocol, dem verbreiteten Standard für Emissionsbilanzen.",
          "Scope 1 erfasst, was im Haus verbrannt wird — Heizung, eigene Fahrzeuge.",
          "Scope 2 die eingekaufte Energie, mit markt- und standortbezogener Rechnung.",
          "Scope 3 die Lieferkette davor und danach, in fünfzehn Kategorien."],
         "Schreibtisch mit Unterlagen und Rechner", True),
        ("Jede Zahl nachvollziehbar halten", "buero-2",
         ["Neben jeder Position steht der verwendete Emissionsfaktor mit Quelle, Jahr und Einheit.",
          "Geschätzte Werte sind als Schätzung gekennzeichnet, samt Grundlage.",
          "Änderungen bleiben nachvollziehbar: wer hat wann welchen Wert geändert.",
          "Die Bilanzgrenze wird einmal festgelegt und dokumentiert."],
         "Zwei Kollegen an einem Schreibtisch", False),
    ]
    teile = []
    for i, (titel, stamm, punkte, alt, umgekehrt) in enumerate(bloecke):
        liste = "".join(f'<li style="display:flex;gap:var(--s12)"><span class="preis__haken" aria-hidden="true"></span>'
                        f'<span class="t-body gedaempft">{e(p)}</span></li>' for p in punkte)
        text_teil = f'''<div class="stapeln einzug">
        <h2 class="t-heading-sm">{e(titel)}</h2>
        <ul class="stapeln stapeln--eng" style="list-style:none;margin:0;padding:0">{liste}</ul>
      </div>'''
        bild_teil = f'<div class="einzug">{bild(stamm, [600, 1200, 1800], alt, groessen="(min-width:1000px) 50vw, 100vw")}</div>'
        innen = (bild_teil + text_teil) if umgekehrt else (text_teil + bild_teil)
        gitterklasse = "gitter--seite-um" if umgekehrt else "gitter--seite"
        hintergrund = ' abschnitt--nebel' if i % 2 == 1 else ''
        teile.append(f'''<section class="abschnitt{hintergrund} einzugsfeld">
  <div class="huelle gitter {gitterklasse}">{innen}</div>
</section>''')

    grenzen = [
        ("Keine Produktbilanzen auf Bauteilebene",
         "Ein Product Carbon Footprint für ein einzelnes Bauteil ist damit nicht gemeint.",
         "Ein Product Carbon Footprint verfolgt ein einzelnes Erzeugnis über seinen ganzen "
         "Lebensweg, oft über mehrere Vorlieferanten hinweg. Das ist eine andere Rechnung als die "
         "Bilanz eines Unternehmens und verlangt Daten, die Ihre Buchhaltung nicht hergibt. Wenn "
         "ein Kunde danach fragt, sagen wir Ihnen das — und nennen jemanden, der es kann."),
        ("Keine Prüfung",
         "Wer eine Bilanz bestätigen soll, ist eine Wirtschaftsprüfung.",
         "Eine Bilanz erstellen und sie bestätigen sind zwei getrennte Rollen; wer beides macht, "
         "prüft sich selbst. Tonwert bereitet die Unterlagen so auf, dass eine Prüfung damit "
         "arbeiten kann — jede Position mit Quelle, jede Schätzung gekennzeichnet. Die Prüfung "
         "selbst liegt woanders, und das ist richtig so."),
        ("Keine Zertifikate",
         "Wir verkaufen keine Kompensation.",
         "Kompensation ist ein Geschäft mit eigenen Anreizen. Wer Bilanzen erstellt und zugleich "
         "Zertifikate verkauft, verdient an hohen Zahlen. Wir verkaufen keine. Was Sie mit dem "
         "Ergebnis anfangen — reduzieren, umstellen oder kompensieren — entscheiden Sie ohne uns."),
    ]
    grenzliste = "".join(merkmal(t, k, lang, i, zusatz="karte--rand merkmal--dunkel")
                         for i, (t, k, lang) in enumerate(grenzen))

    return kopfblock("Funktionen", "Was die Software<br>tatsächlich tut.",
        "Keine Übersicht mit Symbolen, sondern die Arbeitsschritte, die anfallen — und was Tonwert "
        "davon übernimmt.") + "".join(teile) + f'''
<section class="abschnitt abschnitt--kohle einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Und was nicht.</h2>
    {raster(grenzliste)}
  </div>
</section>'''

def berichte():
    standards = [
        ("VSME", "Freiwilliger Standard für nicht börsennotierte kleine und mittlere Unternehmen, "
                 "entwickelt von EFRAG. Gedacht genau für den Fall, dass ein Mittelständler Daten "
                 "liefern muss, ohne selbst berichtspflichtig zu sein."),
        ("GHG Protocol", "Der verbreitete Standard für die Berechnung selbst. Er legt fest, wie "
                         "Emissionen in Scope 1, 2 und 3 eingeteilt und wie Bilanzgrenzen gezogen werden."),
        ("CSRD", "Die EU-Richtlinie zur Nachhaltigkeitsberichterstattung. Sie betrifft grosse "
                 "Unternehmen unmittelbar — und mittelständische Zulieferer mittelbar, weil deren "
                 "Daten in die Berichte der Kunden eingehen."),
        ("Kundenfragebögen", "In der Praxis der häufigste Anlass. Grosse Unternehmen und Banken "
                             "fragen mit eigenen Bögen ab. Aus einer vorhandenen Bilanz lassen sich "
                             "diese Bögen beantworten, statt sie jedes Mal neu zu recherchieren."),
    ]
    standards_lang = {
        "VSME": "EFRAG hat den Standard für Unternehmen entwickelt, die selbst nicht "
                "berichtspflichtig sind, aber Daten liefern sollen. Er ist bewusst kürzer gehalten "
                "als die Standards für grosse Unternehmen und in zwei Stufen aufgebaut: ein "
                "Grundmodul und ein erweitertes Modul für Häuser, deren Kunden mehr verlangen.",
        "GHG Protocol": "Der Standard regelt nicht nur die Einteilung in Scope 1 bis 3, sondern "
                "auch, wie die Bilanzgrenze gezogen wird: nach Anteilen am Kapital oder nach "
                "tatsächlicher Kontrolle über den Betrieb. Die Entscheidung fällt einmal und gilt "
                "danach für alle Jahre — sonst lassen sich die Zahlen nicht vergleichen.",
        "CSRD": "Die Richtlinie verpflichtet grosse Unternehmen zur Berichterstattung über "
                "Nachhaltigkeit, geprüft ähnlich einem Jahresabschluss. Für Sie ist sie meist "
                "mittelbar wichtig: Ihr Kunde braucht Ihre Zahlen für seinen eigenen Bericht. Der "
                "Umfang der Pflichten ist politisch in Bewegung — deshalb stehen hier keine "
                "Fristen, die morgen anders lauten.",
        "Kundenfragebögen": "Jeder grosse Abnehmer hat sein eigenes Formular, und kaum zwei fragen "
                "dasselbe ab. Wer die Bilanz einmal sauber aufgebaut hat, beantwortet den nächsten "
                "Bogen in Stunden statt in Wochen. Was ein Bogen verlangt und Ihre Daten nicht "
                "hergeben, bleibt sichtbar offen statt geschätzt.",
    }
    karten = "".join(merkmal(t, x.split(". ")[0] + ".", standards_lang[t], i)
                     for i, (t, x) in enumerate(standards))

    scopes = [
        ("Scope 1", "Direkte Emissionen", "Was in Ihrem Haus und in Ihren Fahrzeugen verbrannt wird: Erdgas für die Heizung, Heizöl, Diesel und Benzin im eigenen Fuhrpark, Kältemittelverluste."),
        ("Scope 2", "Eingekaufte Energie", "Strom, Fernwärme und Fernkälte, die Sie beziehen. Wird zweifach gerechnet: standortbezogen mit dem Netzmix und marktbezogen nach Ihrem Liefervertrag."),
        ("Scope 3", "Lieferkette", "Alles davor und danach, in fünfzehn Kategorien: eingekaufte Waren und Dienstleistungen, Transporte, Geschäftsreisen, Arbeitswege, Abfall, Nutzung und Entsorgung Ihrer Produkte."),
    ]
    scopes_lang = [
        "Erfasst wird, was in Ihrem Besitz oder unter Ihrer Kontrolle verbrannt wird: Erdgas und "
        "Heizöl für die Gebäude, Diesel und Benzin im eigenen Fuhrpark, dazu Kältemittelverluste "
        "aus Klima- und Kälteanlagen. Die Kältemittel werden regelmässig vergessen und fallen bei "
        "einer Prüfung als Erstes auf.",
        "Hier zählt die Energie, die Sie einkaufen statt selbst zu erzeugen. Gerechnet wird "
        "zweifach: standortbezogen mit dem durchschnittlichen Netzmix und marktbezogen nach Ihrem "
        "tatsächlichen Liefervertrag. Ein Ökostromvertrag senkt nur den marktbezogenen Wert — "
        "beide Zahlen gehören in den Bericht.",
        "Fünfzehn Kategorien, von eingekauften Waren über Transporte und Geschäftsreisen bis zur "
        "Entsorgung Ihrer Produkte. Bei den meisten mittelständischen Unternehmen liegt hier der "
        "grösste Teil der Emissionen — und zugleich die schlechteste Datenlage. Deshalb wird "
        "Scope 3 schrittweise aufgebaut statt auf einmal verlangt.",
    ]
    scopeliste = "".join(merkmal(nam, x, scopes_lang[i], i, zusatz="karte--nebel", vor=k)
                         for i, (k, nam, x) in enumerate(scopes))

    return kopfblock("Berichte", "Welche Standards<br>bedient werden.",
        "Die Regelwerke sind echt, die Begriffe sind es auch. Hier steht, welches wofür gilt."
    ) + f'''
<section class="abschnitt einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading-sm einzug einzug--titel">Die Einteilung nach Scope</h2>
    {raster(scopeliste)}
    <p class="t-caption gedaempft einzug" style="max-width:60ch">Die Dreiteilung stammt aus dem
      GHG Protocol. Fast jede Anfrage, die bei Ihnen eintrifft, bezieht sich darauf — auch wenn
      im Anschreiben nur „CO₂-Fussabdruck" steht.</p>
  </div>
</section>

<section class="abschnitt abschnitt--nebel einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Formate und Regelwerke</h2>
    {raster(karten, 2)}
  </div>
</section>

<section class="abschnitt einzugsfeld">
  <div class="huelle gitter gitter--seite">
    <h2 class="t-heading einzug einzug--titel">Einmal erfassen,<br>mehrfach ausgeben.</h2>
    <div class="fliess einzug einzug--ruhig">
      <p class="t-body">Die Datenlage ist in allen Fällen dieselbe. Unterschiedlich ist nur, in
        welcher Form sie verlangt wird.</p>
      <p class="t-body gedaempft">Deshalb trennt Tonwert beides: Die Bilanz entsteht einmal. Was
        daraus erzeugt wird — ein VSME-Bericht, eine Antwort auf einen Fragebogen, eine Tabelle
        für Ihre Bank — ist danach eine Frage der Ausgabe, nicht der Arbeit.</p>
    </div>
  </div>
</section>'''

def fuer_wen():
    lagen = [
        ("Der grosse Kunde fragt", "Ein Abnehmer braucht Ihre Emissionsdaten für seine eigene "
         "Scope-3-Bilanz. Meist mit Frist und meist auf einem eigenen Formular. Das ist der "
         "häufigste Anlass — und der mit dem klarsten Termin."),
        ("Die Bank fragt", "Kreditinstitute erheben Nachhaltigkeitsdaten im Rahmen ihrer eigenen "
         "Berichtspflichten. Wer belastbare Zahlen vorlegt, diskutiert über die Zahlen und nicht "
         "über ihr Fehlen."),
        ("Eine Ausschreibung verlangt es", "Öffentliche und grosse private Auftraggeber nehmen "
         "CO₂-Angaben in die Vergabeunterlagen auf. Ohne Angabe fällt das Angebot formal durch."),
        ("Sie wollen es selbst wissen", "Seltener, aber der beste Ausgangspunkt. Wer ohne Frist "
         "anfängt, kann die Datenerfassung aufbauen, statt sie zu improvisieren."),
    ]
    lagen_lang = [
        "Typisch ist eine E-Mail aus dem Einkauf, Formular im Anhang, Frist vier bis sechs Wochen. "
        "Dahinter steht selten eine Gesinnungsprüfung, sondern die Scope-3-Bilanz Ihres Kunden, in "
        "die Ihre Zahlen eingehen. Wer liefert, bleibt Lieferant; wer nicht liefert, wird "
        "erklärungspflichtig.",
        "Kreditinstitute müssen die Nachhaltigkeit ihres Kreditportfolios bewerten und erheben "
        "dafür Daten bei ihren Kunden. Das fliesst in Risikoeinschätzungen ein. Belastbare Zahlen "
        "verschieben das Gespräch von der Frage, ob Sie etwas vorlegen können, zu der Frage, was "
        "darin steht.",
        "Öffentliche Auftraggeber und grosse private Einkäufer nehmen CO₂-Angaben als "
        "Eignungskriterium in die Unterlagen auf. Fehlt die Angabe, scheidet das Angebot formal "
        "aus, bevor jemand den Preis anschaut. Hier entscheidet nicht die Höhe der Zahl, sondern "
        "dass überhaupt eine da ist.",
        "Der seltenste und zugleich beste Ausgangspunkt. Ohne Frist lässt sich die Erfassung "
        "aufbauen statt improvisieren: Zähler nachrüsten, Belege sortieren, Zuständigkeiten "
        "klären. Wer so anfängt, hat beim ersten Kundenfragebogen nur noch eine Abfrage statt "
        "eines Projekts.",
    ]
    lagenliste = "".join(merkmal(t, x.split(". ")[0] + ".", lagen_lang[i], i)
                         for i, (t, x) in enumerate(lagen))

    passt = ["50 bis 500 Mitarbeitende", "Produktion, Handel, Logistik oder Handwerk",
             "ein grosser Kunde oder eine Bank fragt nach Zahlen",
             "niemand im Haus macht Nachhaltigkeit in Vollzeit"]
    passt_nicht = ["Konzerne mit eigener Nachhaltigkeitsabteilung",
                   "Unternehmen, die eine Produktbilanz auf Bauteilebene brauchen",
                   "wer eine geprüfte Bestätigung sucht statt einer Bilanz",
                   "wer Kompensationszertifikate kaufen will"]
    def liste(punkte, farbe):
        return "".join(f'<li style="display:flex;gap:var(--s12)">'
                       f'<span class="preis__haken" aria-hidden="true" style="background:{farbe}"></span>'
                       f'<span class="t-body gedaempft">{e(p)}</span></li>' for p in punkte)

    return kopfblock("Für wen", "Für Häuser, die<br>gefragt werden.",
        "Nicht die Nachhaltigkeitsabteilung eines Konzerns — die hat eigene Werkzeuge. Sondern "
        "Unternehmen, bei denen diese Aufgabe zusätzlich auf einem Schreibtisch landet."
    ) + f'''
<section class="abschnitt einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Vier typische Lagen</h2>
    {raster(lagenliste, 2)}
  </div>
</section>

<section class="abschnitt abschnitt--nebel einzugsfeld">
  <div class="huelle gitter gitter--2">
    <div class="karte einzug">
      <h2 class="t-heading-sm">Passt</h2>
      <ul class="stapeln stapeln--eng" style="list-style:none;margin:0;padding:0">{liste(passt, "var(--violett)")}</ul>
    </div>
    <div class="karte einzug">
      <h2 class="t-heading-sm">Passt nicht</h2>
      <ul class="stapeln stapeln--eng" style="list-style:none;margin:0;padding:0">{liste(passt_nicht, "var(--rand)")}</ul>
    </div>
  </div>
</section>

<section class="abschnitt einzugsfeld">
  <div class="huelle gitter gitter--seite">
    <div class="einzug">{bild("regale", [600, 1200, 1800], "Hohe Regalreihen in einem Lager", groessen="(min-width:1000px) 50vw, 100vw")}</div>
    <div class="stapeln einzug">
      <h2 class="t-heading-sm">Der Druck kommt selten vom Gesetz.</h2>
      <p class="t-body gedaempft">Er kommt von dem Kunden, der dreissig Prozent Ihres Umsatzes
        ausmacht und Zahlen für seine eigene Bilanz braucht. Das ist keine Frage der Haltung,
        sondern eine Lieferbedingung.</p>
    </div>
  </div>
</section>'''

def preise():
    stufen = [
        ("Einzelbilanz", "1.900", "einmalig",
         "Für das erste Jahr. Sie brauchen Zahlen, und Sie brauchen sie jetzt.",
         ["Bilanz für ein Geschäftsjahr", "Scope 1 und 2 vollständig",
          "Scope 3 in den Kategorien, die sich aus Ihrer Buchhaltung ergeben",
          "Ausgabe als VSME-Bericht und als Tabelle", "Begleitung der ersten Erfassung"], False),
        ("Jahresbericht", "320", "je Monat",
         "Laufend, mit Vergleich zum Vorjahr. Der übliche Fall ab der zweiten Bilanz.",
         ["Alles aus der Einzelbilanz", "Jährliche Fortschreibung",
          "Vergleich zum Vorjahr mit Begründung der Abweichungen",
          "Antworten auf Kundenfragebögen", "Zwei Benutzerkonten"], True),
        ("Lieferkette", "640", "je Monat",
         "Zusätzlich Scope 3 in der Tiefe, mit Anfragen an Ihre eigenen Lieferanten.",
         ["Alles aus dem Jahresbericht", "Scope 3 über alle einschlägigen Kategorien",
          "Lieferantenanfragen über ein eigenes Formular",
          "Primärdaten statt Durchschnittswerten, wo Lieferanten antworten",
          "Unbegrenzte Benutzerkonten"], False),
    ]
    karten = []
    for i, (name, wert, takt, satz, punkte, hervor) in enumerate(stufen):
        liste = "".join(f'<li><span class="preis__haken" aria-hidden="true"></span>'
                        f'<span class="t-caption gedaempft">{e(p)}</span></li>' for p in punkte)
        rand = ' style="border-color:var(--violett)"' if hervor else ''
        marke = '<p class="t-caption" style="color:var(--violett)">Meistgewählt</p>' if hervor else ''
        karten.append(f'''<article class="karte preis einzug einzug--reihe s{i+1}"{rand}>
      {marke}
      <h2 class="t-subheading">{e(name)}</h2>
      <div class="preis__wert"><span class="t-heading-sm">{e(wert)} €</span>
        <span class="t-caption gedaempft">{e(takt)}</span></div>
      <p class="t-caption gedaempft">{e(satz)}</p>
      <ul class="preis__liste">{liste}</ul>
      <div style="margin-top:auto;padding-top:var(--f16)">
        <a class="knopf {"knopf--voll" if hervor else "knopf--rand"} t-caption" href="{u("/kontakt/")}"
           style="width:100%">Gespräch vereinbaren</a>
      </div>
    </article>''')

    return kopfblock("Preise", "Drei Stufen.", 
        "Alle Preise netto, ohne Einrichtungsgebühr. Der Wechsel zwischen den Stufen ist zum "
        "Quartal möglich."
    ) + f'''
<section class="abschnitt einzugsfeld" style="padding-top:0">
  <div class="huelle gitter gitter--3" style="align-items:stretch">{"".join(karten)}</div>
</section>

<section class="abschnitt abschnitt--nebel einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Was nicht extra kostet.</h2>
    {raster("".join(merkmal(t, k, lang, i) for i, (t, k, lang) in enumerate([
      ("Einrichtung", "Anlegen Ihres Hauses, der Standorte und der Bilanzgrenze.",
       "Das machen wir gemeinsam mit Ihnen in einer Sitzung. Dazu gehört die Entscheidung, nach "
       "welchem Ansatz die Bilanzgrenze gezogen wird — nach Anteilen am Kapital oder nach "
       "tatsächlicher Kontrolle. Diese Festlegung gilt danach für alle Folgejahre, deshalb wird "
       "sie am Anfang getroffen und dokumentiert."),
      ("Faktorendatenbank", "Emissionsfaktoren samt jährlicher Aktualisierung.",
       "Jeder Faktor kommt mit Quelle und Bezugsjahr. Ändert sich ein Faktor, weist der "
       "Vorjahresvergleich getrennt aus, welcher Teil der Veränderung daher stammt und welcher aus "
       "Ihrem tatsächlichen Verbrauch. Ohne diese Trennung sieht ein gesunkener Faktor aus wie "
       "eine Einsparung."),
      ("Export", "Tabelle, PDF und Rohdaten, so oft Sie wollen.",
       "Keine Begrenzung der Anzahl und keine Zusatzkosten. Auch nach einer Kündigung bekommen Sie "
       "den vollständigen Datensatz mit allen verwendeten Faktoren. Ihre Zahlen gehören Ihnen — "
       "ein Anbieter, der Daten als Druckmittel behält, hat das falsche Geschäftsmodell."),
    ])))}
  </div>
</section>

<section class="abschnitt einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Fragen zum Preis.</h2>
    <ul class="fragen">
{klappe("Gibt es eine Mindestlaufzeit?", "Zwölf Monate beim Jahresbericht und bei der Lieferkette, weil eine Bilanz an ein Geschäftsjahr gebunden ist. Die Einzelbilanz hat keine Laufzeit.")}
{klappe("Was kostet die Begleitung darüber hinaus?", "Die erste Erfassung ist enthalten. Darüber hinausgehende Begleitung rechnen wir mit 140 € je Stunde ab, nach Absprache und vorher benannt.")}
{klappe("Rechnen Sie nach Mitarbeitenden ab?", "Nein. Die Stufe richtet sich nach dem Umfang der Bilanz, nicht nach der Zahl der Beschäftigten. Ein Haus mit vierzig Standorten ist aufwendiger als eines mit zweihundert Personen an einem Ort — danach sprechen wir.")}
    </ul>
  </div>
</section>'''

def wissen():
    begriffe = [
        ("Scope 1, 2 und 3", "Die Dreiteilung aus dem GHG Protocol. Scope 1 sind direkte Emissionen aus eigener Verbrennung, Scope 2 die eingekaufte Energie, Scope 3 alles in der Lieferkette davor und danach — in fünfzehn festgelegten Kategorien. Bei den meisten mittelständischen Unternehmen liegt der grösste Teil in Scope 3."),
        ("GHG Protocol", "Das Greenhouse Gas Protocol ist der verbreitete Standard dafür, wie Emissionen berechnet und eingeteilt werden. Es legt die Scope-Einteilung fest und regelt, wie Bilanzgrenzen gezogen werden. Fast jede Anfrage bezieht sich mittelbar darauf."),
        ("CSRD", "Die Corporate Sustainability Reporting Directive ist die EU-Richtlinie zur Nachhaltigkeitsberichterstattung. Sie verpflichtet grosse Unternehmen zur Berichterstattung. Mittelständische Zulieferer sind mittelbar betroffen, weil ihre Daten in die Berichte ihrer Kunden eingehen."),
        ("VSME", "Ein freiwilliger Berichtsstandard für nicht börsennotierte kleine und mittlere Unternehmen, entwickelt von EFRAG. Er ist bewusst knapper gehalten als die Standards für grosse Unternehmen und für genau den Fall gedacht, dass ein Mittelständler Daten liefern soll, ohne selbst berichtspflichtig zu sein."),
        ("Emissionsfaktor", "Der Wert, mit dem eine Verbrauchsmenge in CO₂-Äquivalente umgerechnet wird — etwa Kilogramm CO₂ je Kilowattstunde Strom. Faktoren unterscheiden sich nach Land, Jahr und Quelle. Deshalb gehört zu jeder Zahl die Angabe, welcher Faktor verwendet wurde."),
        ("CO₂-Äquivalent", "Die gemeinsame Einheit für alle Treibhausgase. Methan und Lachgas wirken stärker als Kohlendioxid; über einen Faktor werden sie in die Wirkung von CO₂ umgerechnet. Angaben in „t CO₂e\" meinen diese Summe."),
        ("Bilanzgrenze", "Die Festlegung, was zur Bilanz gehört: welche Standorte, welche Gesellschaften, welche Kategorien. Sie wird zu Beginn gezogen und dokumentiert, weil sich spätere Vergleiche sonst nicht halten lassen."),
        ("Basisjahr", "Das Jahr, gegen das spätere Bilanzen verglichen werden. Es sollte eine belastbare Datenlage haben — ein Jahr mit Betriebsunterbrechungen ist als Basis ungeeignet."),
        ("Product Carbon Footprint", "Die Emissionsbilanz eines einzelnen Produkts über seinen Lebensweg, nicht die eines Unternehmens. Wird verlangt, wenn ein Kunde nicht Ihr Haus, sondern ein bestimmtes Teil bewerten will."),
        ("Primärdaten", "Werte, die aus der tatsächlichen Messung oder Abrechnung stammen, im Unterschied zu Durchschnittswerten aus einer Datenbank. In Scope 3 sind Primärdaten von Lieferanten deutlich genauer — und deutlich schwerer zu bekommen."),
    ]
    return kopfblock("Wissen", "Die Begriffe,<br>einmal erklärt.",
        "Ohne Fachsprache, wo es ohne geht. Jeder Begriff so weit erklärt, wie man ihn braucht, "
        "um eine Anfrage zu verstehen."
    ) + f'''
<section class="abschnitt einzugsfeld" style="padding-top:0">
  <div class="huelle">
    <ul class="fragen">
{"".join(klappe(t, e(x)) for t, x in begriffe)}
    </ul>
  </div>
</section>

<section class="abschnitt abschnitt--kohle einzugsfeld">
  <div class="huelle gitter gitter--seite">
    <h2 class="t-heading einzug einzug--titel">Fehlt ein Begriff?</h2>
    <div class="fliess einzug einzug--ruhig">
      <p class="t-body">Wenn in einer Anfrage ein Wort steht, das hier nicht erklärt ist,
        schreiben Sie uns. Wir nehmen es auf.</p>
      <div class="knopfreihe"><a class="knopf knopf--hell t-caption" href="{u("/kontakt/")}">Begriff vorschlagen</a></div>
    </div>
  </div>
</section>'''

def ueber_uns():
    leute = "".join(f'''<article class="person einzug einzug--reihe s{i+1}">
      <div class="bildrahmen person__bild">{bild(stamm, [400, 800], f"Porträt von {name}", groessen="(min-width:1000px) 23vw, 45vw", rahmen=False)}</div>
      <div class="stapeln stapeln--eng">
        <h3 class="t-subheading">{e(name)}</h3>
        <p class="t-caption" style="color:var(--violett)">{e(rolle)}</p>
        <p class="t-caption gedaempft">{e(satz)}</p>
      </div>
    </article>''' for i, (stamm, name, rolle, satz) in enumerate(MANNSCHAFT))

    return kopfblock("Über uns", "Wir kommen aus<br>der Prüfung.",
        "Tonwert ist 2024 in München entstanden, aus der Beobachtung, dass dieselben Fehler in "
        "fast jeder ersten Bilanz auftauchen."
    ) + f'''
<section class="abschnitt einzugsfeld" style="padding-top:0">
  <div class="huelle gitter gitter--seite">
    <div class="einzug">{bild("buero-2", [600, 1200, 1800], "Zwei Kollegen an einem Schreibtisch", groessen="(min-width:1000px) 50vw, 100vw")}</div>
    <div class="fliess einzug einzug--ruhig">
      <p class="t-body">Mirjam Alsleben hat vier Jahre lang Nachhaltigkeitsberichte geprüft.
        Jonas Reinhardt hat auf der anderen Seite gestanden und Verbrauchsdaten geliefert.</p>
      <p class="t-body gedaempft">Beide haben dasselbe gesehen: Die Bilanzen scheitern nicht an
        der Rechnung. Sie scheitern daran, dass niemand mehr sagen kann, woher eine Zahl kam.
        Sechs Monate später ist die Tabelle in vierter Version unterwegs, drei Leute haben
        Faktoren überschrieben, und die Prüfung beginnt von vorn.</p>
      <p class="t-body gedaempft">Tonwert ist um diese eine Anforderung herum gebaut: Jede Zahl
        behält ihre Herkunft. Alles andere folgt daraus.</p>
    </div>
  </div>
</section>

<section class="abschnitt abschnitt--nebel einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Die Mannschaft</h2>
    <div class="gitter gitter--4">{leute}</div>
  </div>
</section>

<section class="abschnitt einzugsfeld">
  <div class="huelle stapeln stapeln--weit">
    <h2 class="t-heading einzug einzug--titel">Woran wir uns halten.</h2>
    {raster("".join(merkmal(t, k, lang, i, zusatz="karte--nebel") for i, (t, k, lang) in enumerate([
      ("Keine Zahl ohne Quelle", "Wenn wir nicht sagen können, woher ein Wert kommt, kommt er nicht in die Bilanz.",
       "Das ist keine Haltung, sondern eine Bauentscheidung: Tonwert nimmt eine Position erst an, "
       "wenn Beleg, Faktor und Einheit zugeordnet sind. Was fehlt, bleibt als Lücke sichtbar "
       "stehen. Das ist unbequemer als eine runde Zahl und hält dafür einer Prüfung stand."),
      ("Keine Beratung nebenher", "Wir verkaufen Software, keine Beratungstage.",
       "Wo eine Frage echte Beratung verlangt — Reduktionspfade, Zielsetzung, Verhandlungen mit "
       "Abnehmern — sagen wir das und nennen Ihnen jemanden. Ein Softwareanbieter, der nebenbei "
       "Strategie verkauft, hat ein Interesse daran, dass es kompliziert bleibt."),
      ("Keine schönen Zahlen", "Eine Bilanz, die besser aussieht als die Lage, nützt niemandem.",
       "Es gibt viele Stellen, an denen sich eine Bilanz freundlicher rechnen lässt: eine enge "
       "Bilanzgrenze, ein günstig gewähltes Basisjahr, ein weggelassener Scope-3-Posten. Tonwert "
       "weist solche Entscheidungen aus, statt sie zu verstecken. Wer die Zahl schönt, merkt es "
       "spätestens, wenn ein Kunde nachfragt."),
    ])))}
  </div>
</section>'''

def kontakt():
    return kopfblock("Kontakt", "Zwanzig Minuten<br>genügen.",
        "Im Gespräch klären wir, welche Daten bei Ihnen vorliegen und ob Tonwert dafür das "
        "richtige Werkzeug ist. Wenn nicht, sagen wir das auch."
    ) + f'''
<section class="abschnitt einzugsfeld" style="padding-top:0">
  <div class="huelle gitter gitter--seite">
    <form class="stapeln einzug" method="post" action="#" novalidate>
      <div class="gitter gitter--2" style="gap:var(--f16)">
        <p class="feld"><label class="t-caption" for="name">Name</label>
          <input id="name" name="name" type="text" autocomplete="name" required></p>
        <p class="feld"><label class="t-caption" for="haus">Unternehmen</label>
          <input id="haus" name="haus" type="text" autocomplete="organization" required></p>
      </div>
      <p class="feld"><label class="t-caption" for="post">E-Mail</label>
        <input id="post" name="post" type="email" autocomplete="email" required></p>
      <p class="feld"><label class="t-caption" for="anlass">Worum geht es?</label>
        <select id="anlass" name="anlass">
          <option>Ein Kunde fragt nach Zahlen</option>
          <option>Eine Bank oder Versicherung fragt</option>
          <option>Eine Ausschreibung verlangt Angaben</option>
          <option>Wir wollen anfangen, ohne Frist</option>
          <option>Etwas anderes</option>
        </select></p>
      <p class="feld"><label class="t-caption" for="text">Nachricht</label>
        <textarea id="text" name="text" rows="6"></textarea>
        <span class="feld__hinweis t-caption">Wenn Sie wissen, welche Daten vorliegen, hilft uns das für das Gespräch.</span></p>
      <div class="knopfreihe"><button class="knopf knopf--voll t-caption" type="submit">Absenden</button></div>
      <p class="t-caption gedaempft">Wir verwenden Ihre Angaben ausschliesslich für die Antwort.
        Näheres in der <a href="{u("/datenschutz/")}">Datenschutzerklärung</a>.</p>
    </form>
    <div class="stapeln stapeln--weit einzug">
      <div class="karte karte--nebel">
        <h2 class="t-subheading">Direkt</h2>
        <p class="t-body"><a class="fuss__verweis" href="mailto:kontakt@tonwert.de" style="color:var(--violett)">kontakt@tonwert.de</a></p>
        <p class="t-body">+49 89 215 430 70</p>
        <p class="t-caption gedaempft">Montag bis Freitag, 9 bis 17 Uhr</p>
      </div>
      <div class="karte karte--nebel">
        <h2 class="t-subheading">Anschrift</h2>
        <p class="t-body">Tonwert GmbH<br>Thalkirchner Straße 84<br>81371 München</p>
      </div>
    </div>
  </div>
</section>'''

def impressum():
    return kopfblock("Impressum", "Impressum", "Angaben nach § 5 DDG."
    ) + f'''
<section class="abschnitt einzugsfeld" style="padding-top:0">
  <div class="huelle rechtstext einzug einzug--ruhig">
    <h2 class="t-heading-sm">Anbieter</h2>
    <dl class="t-body">
      <dt>Firma</dt><dd>Tonwert GmbH</dd>
      <dt>Anschrift</dt><dd>Thalkirchner Straße 84, 81371 München</dd>
      <dt>Vertretung</dt><dd>Mirjam Alsleben, Jonas Reinhardt (Geschäftsführung)</dd>
      <dt>Register</dt><dd>Amtsgericht München, HRB 284512</dd>
      <dt>Umsatzsteuer-ID</dt><dd>DE367412905</dd>
    </dl>
    <h2 class="t-heading-sm">Kontakt</h2>
    <dl class="t-body">
      <dt>E-Mail</dt><dd>kontakt@tonwert.de</dd>
      <dt>Telefon</dt><dd>+49 89 215 430 70</dd>
    </dl>
    <h2 class="t-heading-sm">Verantwortlich für den Inhalt</h2>
    <p class="t-body">Mirjam Alsleben, Anschrift wie oben.</p>
    <h2 class="t-heading-sm">Streitbeilegung</h2>
    <p class="t-body gedaempft">Wir sind nicht verpflichtet und nicht bereit, an einem
      Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    <h2 class="t-heading-sm">Bildnachweis</h2>
    <p class="t-body gedaempft">Fotografien über Unsplash, verwendet nach der Unsplash-Lizenz.</p>
  </div>
</section>'''

def datenschutz():
    abschnitte = [
        ("Verantwortlicher", "Tonwert GmbH, Thalkirchner Straße 84, 81371 München, "
         "kontakt@tonwert.de, +49 89 215 430 70."),
        ("Aufruf dieser Seite", "Beim Aufruf werden die technisch notwendigen Daten verarbeitet, "
         "die Ihr Browser übermittelt: gekürzte IP-Adresse, Zeitpunkt, aufgerufene Adresse, "
         "übertragene Datenmenge und Browserkennung. Rechtsgrundlage ist Artikel 6 Absatz 1 "
         "Buchstabe f DSGVO, unser berechtigtes Interesse am sicheren Betrieb. Die Protokolle "
         "werden nach sieben Tagen gelöscht."),
        ("Keine Einwilligung nötig", "Diese Seite setzt keine Cookies, bindet keine Dienste "
         "Dritter ein, lädt keine Schriften von fremden Servern und erhebt keine Statistik. "
         "Deshalb gibt es hier auch kein Einwilligungsbanner."),
        ("Kontaktformular", "Die Angaben aus dem Formular verwenden wir ausschliesslich zur "
         "Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO, "
         "soweit es um die Anbahnung eines Vertrages geht, sonst Buchstabe f. Wir löschen die "
         "Angaben, wenn die Anfrage abgeschlossen ist und keine Aufbewahrungspflicht entgegensteht."),
        ("Ihre Kundendaten", "Daten, die Sie als Kundin oder Kunde in Tonwert erfassen, "
         "verarbeiten wir als Auftragsverarbeiter nach Artikel 28 DSGVO. Den entsprechenden "
         "Vertrag schliessen wir vor der ersten Datenübergabe. Die Verarbeitung findet in "
         "Rechenzentren in Deutschland statt."),
        ("Ihre Rechte", "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung "
         "der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dafür an die "
         "oben genannte Adresse. Ausserdem können Sie sich bei einer Aufsichtsbehörde beschweren; "
         "für uns ist das das Bayerische Landesamt für Datenschutzaufsicht."),
    ]
    teile = "".join(f'<h2 class="t-heading-sm">{e(t)}</h2><p class="t-body gedaempft">{e(x)}</p>'
                    for t, x in abschnitte)
    return kopfblock("Datenschutz", "Datenschutz",
        "Was beim Besuch dieser Seite passiert und was mit Ihren Angaben geschieht."
    ) + f'''
<section class="abschnitt einzugsfeld" style="padding-top:0">
  <div class="huelle rechtstext einzug einzug--ruhig">{teile}
    <p class="t-caption gedaempft">Stand: Oktober 2026</p>
  </div>
</section>'''

def fehlerseite():
    return f'''<section class="abschnitt abschnitt--gross einzugsfeld" style="padding-top:calc(var(--kopfhoehe) + var(--f96))">
  <div class="huelle stapeln">
    <p class="t-caption gedaempft einzug">Fehler 404</p>
    <h1 class="t-heading-lg einzug einzug--titel">Diese Seite<br>gibt es nicht.</h1>
    <p class="t-subheading gedaempft einzug" style="max-width:48ch">Womöglich hat sich die Adresse
      geändert. Von der Startseite aus finden Sie alles.</p>
    <div class="knopfreihe einzug">
      <a class="knopf knopf--voll t-caption" href="{u("/")}">Zur Startseite</a>
      <a class="knopf knopf--rand t-caption" href="{u("/kontakt/")}">Kontakt</a>
    </div>
  </div>
</section>'''

# ---------------------------------------------------------------------------
SEITEN = [
    ("index.html",             "Tonwert — CO₂-Bilanz und Nachhaltigkeitsberichte für den Mittelstand",
     "Verbrauchsdaten erfassen, Emissionen nach Scope 1 bis 3 berechnen, den Bericht erzeugen, den Ihre Kunden verlangen.", start, "/"),
    ("funktionen/index.html",  "Funktionen — Tonwert",
     "Welche Arbeitsschritte Tonwert übernimmt: Verbrauchsdaten aufnehmen, nach Scope 1 bis 3 rechnen, jede Zahl nachvollziehbar halten.", funktionen, "/funktionen/"),
    ("berichte/index.html",    "Berichte — Tonwert",
     "VSME, GHG Protocol, CSRD und Kundenfragebögen: welcher Standard wofür gilt.", berichte, "/berichte/"),
    ("fuer-wen/index.html",    "Für wen — Tonwert",
     "Für mittelständische Unternehmen, die von Kunden, Banken oder Ausschreibungen nach CO₂-Daten gefragt werden.", fuer_wen, "/fuer-wen/"),
    ("preise/index.html",      "Preise — Tonwert",
     "Drei Stufen: Einzelbilanz, Jahresbericht, Lieferkette.", preise, "/preise/"),
    ("wissen/index.html",      "Wissen — Tonwert",
     "Scope 1 bis 3, GHG Protocol, CSRD, VSME, Emissionsfaktor und weitere Begriffe erklärt.", wissen, "/wissen/"),
    ("ueber-uns/index.html",   "Über uns — Tonwert",
     "Tonwert kommt aus der Prüfung von Nachhaltigkeitsberichten. Die Mannschaft und woran wir uns halten.", ueber_uns, "/ueber-uns/"),
    ("kontakt/index.html",     "Kontakt — Tonwert",
     "Zwanzig Minuten genügen, um zu klären, ob Tonwert zu Ihrem Haus passt.", kontakt, "/kontakt/"),
    ("impressum/index.html",   "Impressum — Tonwert", "Angaben nach § 5 DDG.", impressum, "/impressum/"),
    ("datenschutz/index.html", "Datenschutz — Tonwert",
     "Was beim Besuch dieser Seite passiert und was mit Ihren Angaben geschieht.", datenschutz, "/datenschutz/"),
    ("404.html",               "Seite nicht gefunden — Tonwert", "Diese Seite gibt es nicht.", fehlerseite, ""),
]

def main() -> None:
    print("Tonwert — Seiten bauen\n")
    for pfad, titel, beschreibung, bauer, aktiv in SEITEN:
        schreibe(pfad, seite(titel, beschreibung, bauer(), aktiv, pfad == "index.html"))
    (ZIEL / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")
    print("  robots.txt")
    print(f"\n  {len(SEITEN)} Seiten gebaut.")

if __name__ == "__main__":
    main()
