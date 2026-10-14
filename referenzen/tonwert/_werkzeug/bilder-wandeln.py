#!/usr/bin/env python3
"""
Tonwert — Bilder wandeln.

Alle Fotos werden SCHWARZWEISS. Begruendung in DESIGN.md Abschnitt 9:
Das Designsystem kennt genau eine chromatische Stimme (das Violett). Farbfotos
brachten jede Menge weitere Farben mit und wuerden dagegen arbeiten. Dazu kommt:
Die Portraits stammen von sechs verschiedenen Fotografen. In Farbe lesen sie
sich nie als ein Team.

Damit sie es doch tun, bekommt jedes Bild dieselbe Tonwertkorrektur:
Schwarz- und Weisspunkt werden auf denselben Stand gezogen (autocontrast mit
1% Beschnitt). Das ist der eigentliche Grund, warum der Satz zusammenhaelt —
nicht das Entfernen der Farbe allein.

Aufruf:  python3 _werkzeug/bilder-wandeln.py
"""
from PIL import Image, ImageOps
from pathlib import Path

HIER   = Path(__file__).resolve().parent.parent
ROH    = HIER / "bilder" / "roh"
ZIEL   = HIER / "bilder"

# Datei -> Zielbreiten
PLAN = {
    "aufmacher": [1200, 1800, 2400],
    "erfassen":  [600, 1200, 1800],
    "regale":    [600, 1200, 1800],
    "fuss":      [600, 1200, 1800],
    "buero-1":   [600, 1200, 1800],
    "buero-2":   [600, 1200, 1800],
    **{f"portrait-{i}": [400, 800] for i in range(1, 7)},
}

def wandle(pfad: Path, breiten: list[int]) -> list[tuple[str, int, int, int]]:
    bild = Image.open(pfad)
    bild = ImageOps.exif_transpose(bild)
    grau = ImageOps.grayscale(bild)                 # nach L, mit korrekten Gewichten
    grau = ImageOps.autocontrast(grau, cutoff=1)    # gleicher Schwarz-/Weisspunkt
    aus = []
    for b in breiten:
        if b > grau.width:
            continue
        h = round(grau.height * b / grau.width)
        kopie = grau.resize((b, h), Image.LANCZOS)
        name = f"{pfad.stem}-{b}.webp"
        ziel = ZIEL / name
        kopie.save(ziel, "WEBP", quality=82, method=6)
        aus.append((name, b, h, ziel.stat().st_size))
    return aus

def main() -> None:
    gesamt_vorher = gesamt_nachher = 0
    for stamm, breiten in PLAN.items():
        quelle = ROH / f"{stamm}.jpg"
        if not quelle.exists():
            print(f"  FEHLT: {quelle.name}")
            continue
        gesamt_vorher += quelle.stat().st_size
        for name, b, h, groesse in wandle(quelle, breiten):
            gesamt_nachher += groesse
            print(f"  {name:<24} {b:>5}x{h:<5} {groesse/1024:>7.1f} kB")
    print(f"\n  roh     {gesamt_vorher/1024/1024:>6.2f} MB")
    print(f"  gewandelt {gesamt_nachher/1024/1024:>4.2f} MB  (alle Groessen zusammen)")

if __name__ == "__main__":
    main()
