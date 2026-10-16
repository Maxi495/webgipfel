/* Kontorhaus – gemeinsame Hülle: Navigation, Mobilmenü, Footer und Kundenlogos.
   Jede Seite setzt <body data-page="…"> und Platzhalter <div data-nav></div> / <div data-footer></div>.
   Logos: <span data-logo="brandl"></span>. */
(function () {
  var I = 'assets/img/icons.svg#';
  var ico = function (id, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true"><use href="' + I + id + '"/></svg>'; };
  window.KH = window.KH || {};
  KH.ico = ico;

  var page = document.body.getAttribute('data-page') || '';
  var cur = function (p) { return page === p ? ' aria-current="page"' : ''; };

  var logo = '<a class="logo" href="./" aria-label="Kontorhaus Startseite">' + ico('logo') + '<span>Kontorhaus</span></a>';

  var nav =
    '<header class="nav"><div class="container nav__in">' + logo +
    '<nav class="nav__links" aria-label="Hauptnavigation">' +
      '<div class="nav__drop"><button type="button" aria-haspopup="true">Produkt' + ico('chev-down') + '</button>' +
        '<div class="nav__panel">' +
          '<a href="produkt.html#ueberblick"><span class="ico">' + ico('home') + '</span><b>Überblick</b><span>Kontostand, Umsatz, was du dir auszahlen darfst</span></a>' +
          '<a href="produkt.html#belege"><span class="ico">' + ico('receipt') + '</span><b>Belege</b><span>Foto machen, fertig. Den Rest liest die App.</span></a>' +
          '<a href="produkt.html#rechnungen"><span class="ico">' + ico('invoice') + '</span><b>Rechnungen</b><span>Angebote und E-Rechnungen in zwei Minuten</span></a>' +
          '<a href="produkt.html#ruecklage"><span class="ico">' + ico('piggy') + '</span><b>Steuer-Rücklage</b><span>Jeden Monat wissen, was zur Seite gehört</span></a>' +
          '<a href="produkt.html#frag"><span class="ico">' + ico('spark') + '</span><b>Frag deine Zahlen</b><span>Fragen stellen wie einem Menschen</span></a>' +
          '<a href="produkt.html#berater"><span class="ico">' + ico('chat') + '</span><b>Berater-Chat</b><span>Antwort innerhalb eines Werktags</span></a>' +
        '</div></div>' +
      '<a href="handwerk.html"' + cur('handwerk') + '>Für Handwerk</a>' +
      '<a href="gastro.html"' + cur('gastro') + '>Für Gastro</a>' +
      '<a href="preise.html"' + cur('preise') + '>Preise</a>' +
      '<a href="kanzlei.html"' + cur('kanzlei') + '>Kanzlei &amp; Team</a>' +
      '<div class="nav__drop"><button type="button" aria-haspopup="true">Ressourcen' + ico('chev-down') + '</button>' +
        '<div class="nav__panel">' +
          '<a href="ratgeber.html"><span class="ico">' + ico('book') + '</span><b>Ratgeber</b><span>Steuer verständlich, ohne Fachchinesisch</span></a>' +
          '<a href="./#kunden"><span class="ico">' + ico('users') + '</span><b>Kundengeschichten</b><span>Wie Betriebe mit Kontorhaus arbeiten</span></a>' +
          '<a href="karriere.html"><span class="ico">' + ico('briefcase') + '</span><b>Karriere</b><span>5 offene Stellen in München, Rosenheim und Augsburg</span></a>' +
          '<a href="kontakt.html"><span class="ico">' + ico('phone') + '</span><b>Kontakt</b><span>Ruf an oder buch ein Erstgespräch</span></a>' +
        '</div></div>' +
    '</nav>' +
    '<div class="nav__right"><a class="btn btn--tertiary hide-m" href="login.html">Login</a><a class="btn btn--primary btn--sm hide-m" href="kontakt.html#testen">Kostenlos testen</a>' +
      '<button class="nav__burger" type="button" aria-label="Menü öffnen" aria-expanded="false"><i></i></button></div>' +
    '</div></header>' +
    '<div class="mobile-menu" aria-hidden="true">' +
      '<a href="produkt.html">Produkt</a><a href="handwerk.html">Für Handwerk</a><a href="gastro.html">Für Gastro</a><a href="preise.html">Preise</a>' +
      '<a href="kanzlei.html">Kanzlei &amp; Team</a><a href="ratgeber.html">Ratgeber</a><a href="karriere.html">Karriere</a><a href="kontakt.html">Kontakt</a>' +
      '<div class="btn-row"><a class="btn btn--primary" href="kontakt.html#testen">Kostenlos testen</a><a class="btn btn--ghost" href="login.html">Login</a></div>' +
    '</div>';

  var col = function (title, links) {
    return '<div><h4>' + title + '</h4><ul>' + links.map(function (l) { return '<li><a href="' + l[1] + '">' + l[0] + '</a></li>'; }).join('') + '</ul></div>';
  };
  var footer =
    '<footer class="footer"><div class="container">' +
    '<div class="footer__grid"><div class="footer__mark"><a href="./" aria-label="Kontorhaus">' + ico('logo') + '</a></div>' +
      col('Produkt', [['Überblick', 'produkt.html#ueberblick'], ['Belege', 'produkt.html#belege'], ['Rechnungen', 'produkt.html#rechnungen'], ['Steuer-Rücklage', 'produkt.html#ruecklage'], ['Frag deine Zahlen', 'produkt.html#frag'], ['Preise', 'preise.html'], ['Login', 'login.html']]) +
      col('Für wen', [['Handwerk', 'handwerk.html'], ['Gastronomie &amp; Food', 'gastro.html'], ['Kreative Freiberufler', 'preise.html#solo'], ['Gesundheit &amp; Sport', 'preise.html'], ['Hofläden &amp; Landwirtschaft', 'kanzlei.html#rosenheim']]) +
      col('Unternehmen', [['Kanzlei &amp; Team', 'kanzlei.html'], ['Kundengeschichten', './#kunden'], ['Ratgeber', 'ratgeber.html'], ['Karriere', 'karriere.html'], ['Impressum', 'impressum.html'], ['Datenschutz', 'datenschutz.html']]) +
      col('Kontakt', [['hallo@kontorhaus-app.de', 'mailto:hallo@kontorhaus-app.de'], ['089 99998 300', 'tel:+498999998300'], ['Erstgespräch buchen', 'kontakt.html'], ['Kühlhausgasse 4, 81671 München', 'kontakt.html#anfahrt'], ['Standort Rosenheim', 'kontakt.html#rosenheim']]) +
    '</div>' +
    '<div class="footer__bottom"><div class="footer__social"><a href="#" aria-label="LinkedIn">' + ico('linkedin') + '</a><a href="#" aria-label="Instagram">' + ico('instagram') + '</a><a href="#" aria-label="YouTube">' + ico('youtube') + '</a></div>' +
      '<div>© 2026 Kontorhaus GmbH</div><div>München · Rosenheim</div><div>Kontorhaus Steuerberatungs&shy;gesellschaft mbH</div><div><a href="datenschutz.html">Cookie-Einstellungen</a></div></div>' +
    '<p class="footer__note">Konzeptprojekt von <a href="../../">Webgipfel Medienagentur</a>. Kontorhaus ist eine fiktive Marke – alle Personen, Firmen, Adressen, Zahlen und Zitate sind erfunden; Ähnlichkeiten mit realen Unternehmen sind zufällig. Telefonnummern stammen aus dem Nummernbereich der Bundesnetzagentur für Film und Medien, Mail-Adressen sind nicht erreichbar. Die Fotos zeigen Models von Unsplash, nicht die genannten Personen (Bailey Alexander, Vitaly Gariev, Jimmy Nilsson Masth, Kinga Howard, PodMatch, Samuel Raita, lucas Favre, Christina @ wocintechchat.com, Laura Chouette, Daniel Cosmo, Joseph Gonzalez, M. Brauer, Danny Ocean, Phạm Duy Quang, Lawrence Chismorie, Sven Mieke, Manoa Angelo, karl muscat, Toolmash Expo, Khyati Trehan, Michael Walter). Design-Grundlage: Refero-Stil „Steep“.</p>' +
    '</div></footer>';

  var navSlot = document.querySelector('[data-nav]');
  if (navSlot) navSlot.outerHTML = nav;
  var footSlot = document.querySelector('[data-footer]');
  if (footSlot) footSlot.outerHTML = footer;

  /* Konzeptprojekt: Mail- und Telefon-Links öffnen nichts, sondern zeigen einen Hinweis */
  var toast;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"], a[href^="tel:"]');
    if (!a) return;
    e.preventDefault();
    if (!toast) {
      toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.style.cssText = 'position:fixed;left:50%;bottom:24px;z-index:200;transform:translate(-50%,12px);max-width:calc(100% - 32px);background:#17191c;color:#fff;padding:12px 18px;border-radius:14px;font-size:14px;line-height:1.4;box-shadow:0 8px 40px rgba(0,0,0,.18);opacity:0;transition:opacity .25s,transform .25s;pointer-events:none';
      document.body.appendChild(toast);
    }
    toast.textContent = 'Konzeptprojekt: Kontorhaus ist fiktiv – diese ' + (a.href.indexOf('tel:') === 0 ? 'Nummer' : 'Adresse') + ' ist nicht erreichbar.';
    requestAnimationFrame(function () { toast.style.opacity = 1; toast.style.transform = 'translate(-50%,0)'; });
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.style.opacity = 0; toast.style.transform = 'translate(-50%,12px)'; }, 3200);
  });

  var burger = document.querySelector('.nav__burger');
  if (burger) burger.addEventListener('click', function () {
    var open = document.documentElement.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.querySelector('.mobile-menu').setAttribute('aria-hidden', open ? 'false' : 'true');
  });

  /* Kundenlogos (fiktiv), als Inline-SVG mit den Seitenschriften */
  var S = 'font-family="Kontor Serif, Georgia, serif"', N = 'font-family="Kontor Sans, Inter, sans-serif"';
  KH.logos = {
    brandl: '<svg class="clogo" viewBox="0 0 150 40" role="img" aria-label="Schreinerei Brandl"><path d="M4 30h22l-3-4-2.6 4-2.6-4-2.6 4-2.6-4-2.6 4L7 26z" fill="currentColor"/><rect x="4" y="10" width="22" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="16" ' + N + ' font-size="8" letter-spacing="2.2" fill="currentColor">SCHREINEREI</text><text x="33" y="34" ' + S + ' font-size="21" letter-spacing="2" fill="currentColor">BRANDL</text></svg>',
    goldammer: '<svg class="clogo" viewBox="0 0 196 40" role="img" aria-label="Café Goldammer"><path d="M6 32c4-1 7-4 8.5-9L20 9l3 2-4 2.5c1 5-1.5 10.5-6 14M14.5 23 9 33M15.5 22l3 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><text x="32" y="27" ' + S + ' font-style="italic" font-size="22" fill="currentColor">Café Goldammer</text></svg>',
    obermaier: '<svg class="clogo" viewBox="0 0 170 40" role="img" aria-label="Elektro Obermaier"><path d="M15 4 5 22h8l-2 14 11-19h-8z" fill="currentColor"/><text x="30" y="26" ' + N + ' font-weight="800" font-size="19" letter-spacing="-.4" fill="currentColor">OBERMAIER</text><text x="31" y="36" ' + N + ' font-size="6.6" letter-spacing="3" fill="currentColor">ELEKTROTECHNIK</text></svg>',
    halbschatten: '<svg class="clogo" viewBox="0 0 160 40" role="img" aria-label="Studio Halbschatten"><circle cx="16" cy="20" r="11" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 9l4 9M27 20l-9 4M16 31l-4-9M5 20l9-4" stroke="currentColor" stroke-width="1.6"/><text x="35" y="26" ' + N + ' font-weight="300" font-size="20" letter-spacing="-.3" fill="currentColor">halbschatten</text></svg>',
    stadler: '<svg class="clogo" viewBox="0 0 150 40" role="img" aria-label="Hofladen Stadler"><path d="M5 28c4-10 18-10 22 0z" fill="currentColor"/><path d="M16 6v6M8 9l3 4.5M24 9l-3 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><text x="34" y="22" ' + S + ' font-size="19" fill="currentColor">Stadler Hof</text><text x="35" y="33" ' + N + ' font-size="6.5" letter-spacing="2.4" fill="currentColor">HOFLADEN · CHIEMGAU</text></svg>',
    gschwendtner: '<svg class="clogo" viewBox="0 0 215 40" role="img" aria-label="Malerbetrieb Gschwendtner"><path d="M3 27c10-6 22-7 34-3" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" opacity=".9"/><text x="44" y="27" ' + N + ' font-weight="600" font-size="15" letter-spacing="2.6" fill="currentColor">GSCHWENDTNER</text></svg>',
    physio: '<svg class="clogo" viewBox="0 0 150 40" role="img" aria-label="Physio am Gärtnerplatz"><text x="2" y="27" ' + N + ' font-weight="600" font-size="21" letter-spacing="-.8" fill="currentColor">physio</text><circle cx="74" cy="21" r="3" fill="currentColor"/><text x="81" y="27" ' + N + ' font-weight="300" font-size="21" letter-spacing="-.8" fill="currentColor">gp</text></svg>',
    yogaloft: '<svg class="clogo" viewBox="0 0 150 40" role="img" aria-label="Yogaloft Haidhausen"><path d="M6 29a10 10 0 0 1 20 0" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="12" r="3.5" fill="currentColor"/><text x="33" y="27" ' + S + ' font-size="21" letter-spacing="-.3" fill="currentColor">yogaloft</text></svg>',
    brezenhuber: '<svg class="clogo" viewBox="0 0 236 40" role="img" aria-label="Bäckerei Brezenhuber"><path d="M16 30c-7 0-11-5-9-10s9-6 9 1 5 9 9 5-1-10-6-8-8 8-11 12M16 30c3 0 6-1 7-3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><text x="35" y="25" ' + S + ' font-style="italic" font-size="21" fill="currentColor">Brezenhuber</text><text x="160" y="25" ' + N + ' font-size="8" letter-spacing="1.6" fill="currentColor">BACKSTUBE</text></svg>',
    reischl: '<svg class="clogo" viewBox="0 0 200 40" role="img" aria-label="Reischl Architekten"><rect x="4" y="8" width="20" height="24" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 20h20M14 8v24" stroke="currentColor" stroke-width="1.6"/><text x="33" y="25" ' + N + ' font-weight="300" font-size="13" letter-spacing="4.5" fill="currentColor">REISCHL ARCHITEKTEN</text></svg>',
    kasspatz: '<svg class="clogo" viewBox="0 0 150 40" role="img" aria-label="Foodtruck Kasspatz"><rect x="3" y="9" width="26" height="17" rx="4" fill="currentColor"/><circle cx="10" cy="29" r="3" fill="currentColor"/><circle cx="23" cy="29" r="3" fill="currentColor"/><text x="36" y="27" ' + N + ' font-weight="900" font-size="19" letter-spacing="-.6" fill="currentColor">KASSPATZ</text></svg>'
  };
  document.querySelectorAll('[data-logo]').forEach(function (el) {
    var svg = KH.logos[el.getAttribute('data-logo')];
    if (svg) el.outerHTML = svg;
  });
})();
