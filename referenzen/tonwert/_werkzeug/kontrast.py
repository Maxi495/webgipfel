#!/usr/bin/env python3
"""Kontrastwerte nach WCAG 2.2 fuer das Designsystem von Tonwert.

Aufruf:  python3 _werkzeug/kontrast.py
Grundlage ist DESIGNSYSTEM.md (Krepling), mit einer einzigen Abweichung:
Das Violett ist von #b154f9 auf #a73df8 abgedunkelt, weil sonst sowohl
violetter Text auf Weiss als auch weisser Text auf dem gefuellten Knopf
bei je 3,81:1 durchfallen. Siehe BRIEF.md, Teil 3.1.
"""
import colorsys

def _srgb(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def leuchtdichte(hexf):
    h = hexf.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return 0.2126 * _srgb(r) + 0.7152 * _srgb(g) + 0.0722 * _srgb(b)

def kontrast(vorne, hinten):
    a, b = leuchtdichte(vorne), leuchtdichte(hinten)
    return round((max(a, b) + 0.05) / (min(a, b) + 0.05), 2)

def anpassen(hexf, ziel, grund, richtung=-1):
    """Farbton behalten, Helligkeit schieben, bis das Ziel erreicht ist."""
    h = hexf.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    ht, l, s = colorsys.rgb_to_hls(r, g, b)
    for i in range(1, 500):
        l2 = min(1, max(0, l + richtung * i * 0.002))
        r2, g2, b2 = colorsys.hls_to_rgb(ht, l2, s)
        neu = "#%02x%02x%02x" % (round(r2*255), round(g2*255), round(b2*255))
        if kontrast(neu, grund) >= ziel:
            return neu, kontrast(neu, grund)
    return None, None

F = {
    "violett":     "#a73df8",   # korrigiert
    "violett-alt": "#b154f9",   # wie im System beschrieben, nur zum Vergleich
    "tinte":       "#000000",
    "papier":      "#ffffff",
    "nebel":       "#f1f1f1",
    "kohle":       "#171717",
    "stahl":       "#6c6b6b",
    "dunst":       "#b3b3b3",
    "rand":        "#949494",
}

PRUEFUNG = [
    ("Text auf Papier #ffffff",  "papier", ["tinte", "stahl", "violett"],        4.5),
    ("Text auf Nebel #f1f1f1",   "nebel",  ["tinte", "stahl"],                   4.5),
    ("Text auf Kohle #171717",   "kohle",  ["papier", "dunst"],                  4.5),
    ("Text auf violetter Flaeche","violett",["papier", "tinte"],                 4.5),
    ("Raender von Bedienelementen","papier",["rand", "violett", "tinte"],        3.0),
    ("Fokusring gegen Papier",   "papier", ["violett", "tinte"],                 3.0),
    ("Fokusring gegen Kohle",    "kohle",  ["papier", "violett"],                3.0),
]

if __name__ == "__main__":
    fehler = 0
    for titel, grund, namen, ziel in PRUEFUNG:
        print(f"\n{titel}   (Ziel {ziel}:1)")
        for n in namen:
            v = kontrast(F[n], F[grund])
            gut = v >= ziel
            fehler += 0 if gut else 1
            print(f"  {n:<10} {F[n]}  {v:>6}:1  {'ok' if gut else 'DURCHGEFALLEN'}")

    print("\n— Zum Vergleich: das Violett wie im System beschrieben")
    print(f"  #b154f9 als Text auf Weiss     {kontrast('#b154f9','#ffffff'):>6}:1  (Ziel 4,5)")
    print(f"  Weiss auf #b154f9              {kontrast('#ffffff','#b154f9'):>6}:1  (Ziel 4,5)")
    print(f"  -> deshalb die Abdunklung auf  #a73df8")

    print("\n— Dekorative Linie #b3b3b3 (keine Bedienelementgrenze)")
    print(f"  auf Papier  {kontrast('#b3b3b3','#ffffff'):>6}:1   zulaessig, weil rein optisch")

    print(f"\n{'Alle Pruefungen bestanden.' if not fehler else str(fehler) + ' DURCHGEFALLEN'}")
