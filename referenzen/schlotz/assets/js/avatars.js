/* Gezeichnete Sticker-Avatare für das Team.
   Keine Stockporträts: echte Menschen auf Unsplash wissen nicht, dass sie hier „arbeiten“. */
(function () {
  var PEOPLE = {
    lena:  { bg: '#ffd731', skin: '#f6d3b8', hair: 'bun',    hairColor: '#d99a3e', shirt: '#4da2ff' },
    tarik: { bg: '#fb4903', skin: '#c98d66', hair: 'short',  hairColor: '#1d1d1d', shirt: '#ffd731', beard: true },
    vroni: { bg: '#55db9c', skin: '#f3c7a6', hair: 'long',   hairColor: '#7a3b1e', shirt: '#ffffff', apron: true },
    jonas: { bg: '#ffd731', skin: '#f1c9a5', hair: 'cap',    hairColor: '#3a2a1a', capColor: '#fb4903', shirt: '#55db9c' },
    mira:  { bg: '#5c4ade', skin: '#8d5a3b', hair: 'curly',  hairColor: '#1b1b1b', shirt: '#e9ccff', glasses: true, earrings: true },
    felix: { bg: '#fb4903', skin: '#f2c4a0', hair: 'beanie', hairColor: '#c98b3c', capColor: '#55db9c', shirt: '#4da2ff' },
    aylin: { bg: '#e9ccff', skin: '#e2ad86', hair: 'long',   hairColor: '#2a1a12', shirt: '#fb4903', earrings: true }
  };

  var S = 'stroke="#000" stroke-width="4" stroke-linejoin="round"';

  function hairBack(p) {
    if (p.hair === 'long') return '<path d="M50 100 C 44 50, 156 50, 150 100 L 156 176 L 44 176 Z" fill="' + p.hairColor + '" ' + S + '/>';
    if (p.hair === 'curly') {
      var c = '';
      [[58, 92], [56, 120], [62, 146], [142, 92], [144, 120], [138, 146]].forEach(function (q) {
        c += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="17" fill="' + p.hairColor + '" ' + S + '/>';
      });
      return c;
    }
    if (p.hair === 'bun') return '<circle cx="100" cy="44" r="18" fill="' + p.hairColor + '" ' + S + '/>';
    return '';
  }

  function hairFront(p) {
    switch (p.hair) {
      case 'short':
        return '<path d="M60 96 C 54 58, 80 46, 102 48 C 130 50, 148 66, 140 98 C 134 82, 122 74, 104 76 C 88 78, 72 76, 60 96 Z" fill="' + p.hairColor + '" ' + S + '/>';
      case 'bun':
        return '<path d="M60 100 C 56 62, 82 52, 100 52 C 122 52, 146 66, 140 100 C 132 80, 114 70, 100 72 C 84 72, 66 82, 60 100 Z" fill="' + p.hairColor + '" ' + S + '/>';
      case 'long':
        return '<path d="M60 100 C 58 62, 84 50, 102 52 C 126 54, 144 70, 140 102 C 126 84, 108 70, 86 74 C 74 78, 66 86, 60 100 Z" fill="' + p.hairColor + '" ' + S + '/>';
      case 'curly':
        var c = '';
        [[66, 74], [82, 58], [100, 52], [118, 58], [134, 74], [74, 64], [126, 64]].forEach(function (q) {
          c += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="16" fill="' + p.hairColor + '" ' + S + '/>';
        });
        return c;
      case 'cap':
        return '<path d="M62 96 C 64 86, 70 82, 80 82 L 120 82 C 130 82, 136 86, 138 96" fill="' + p.hairColor + '" ' + S + '/>' +
          '<path d="M58 88 C 58 50, 142 50, 142 88 Z" fill="' + p.capColor + '" ' + S + '/>' +
          '<path d="M56 86 L 162 84 C 166 94, 152 98, 140 96 L 58 94 Z" fill="' + p.capColor + '" ' + S + '/>' +
          '<circle cx="100" cy="54" r="4" fill="#000"/>';
      case 'beanie':
        return '<path d="M62 98 C 66 90, 72 88, 80 88" fill="none" stroke="' + p.hairColor + '" stroke-width="8" stroke-linecap="round"/>' +
          '<path d="M58 90 C 54 48, 146 48, 142 90 Z" fill="' + p.capColor + '" ' + S + '/>' +
          '<rect x="54" y="80" width="92" height="16" rx="7" fill="' + p.capColor + '" ' + S + '/>' +
          '<path d="M70 82 v12 M84 82 v12 M98 82 v12 M112 82 v12 M126 82 v12" stroke="#000" stroke-width="2.5" opacity=".35"/>' +
          '<circle cx="100" cy="44" r="11" fill="#fff" ' + S + '/>';
    }
    return '';
  }

  function svg(p) {
    var out = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">';
    out += '<rect width="200" height="200" fill="' + p.bg + '"/>';
    out += '<circle cx="30" cy="40" r="6" fill="#fff" ' + S + '/><path d="M164 30 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#fff" ' + S + '/>';
    out += hairBack(p);
    out += '<path d="M28 204 C 32 162, 70 146, 100 146 C 130 146, 168 162, 172 204 Z" fill="' + p.shirt + '" ' + S + '/>';
    if (p.apron) out += '<path d="M74 204 L 78 160 L 122 160 L 126 204 Z" fill="#4da2ff" ' + S + '/>';
    out += '<path d="M86 128 L 86 152 C 92 160, 108 160, 114 152 L 114 128 Z" fill="' + p.skin + '" ' + S + '/>';
    out += '<circle cx="60" cy="106" r="9" fill="' + p.skin + '" ' + S + '/><circle cx="140" cy="106" r="9" fill="' + p.skin + '" ' + S + '/>';
    out += '<ellipse cx="100" cy="102" rx="40" ry="46" fill="' + p.skin + '" ' + S + '/>';
    if (p.beard) out += '<path d="M62 108 C 62 142, 84 150, 100 150 C 116 150, 138 142, 138 108 C 130 126, 116 130, 100 130 C 84 130, 70 126, 62 108 Z" fill="' + p.hairColor + '" ' + S + '/>';
    out += '<circle cx="76" cy="118" r="7" fill="#fb4903" opacity=".35"/><circle cx="124" cy="118" r="7" fill="#fb4903" opacity=".35"/>';
    out += '<ellipse cx="86" cy="104" rx="4.2" ry="5.6"/><ellipse cx="114" cy="104" rx="4.2" ry="5.6"/>';
    out += '<path d="M78 92 Q 86 88 93 91 M107 91 Q 114 88 122 92" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round"/>';
    out += '<path d="M88 122 Q 100 ' + (p.beard ? 132 : 134) + ' 112 122" fill="#fff" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>';
    if (p.glasses) out += '<g fill="#fff" fill-opacity=".25" stroke="#000" stroke-width="3.5"><circle cx="86" cy="104" r="12"/><circle cx="114" cy="104" r="12"/></g><path d="M98 104 h4" stroke="#000" stroke-width="3.5"/>';
    if (p.earrings) out += '<circle cx="58" cy="120" r="4.5" fill="#ffd731" stroke="#000" stroke-width="2.5"/><circle cx="142" cy="120" r="4.5" fill="#ffd731" stroke="#000" stroke-width="2.5"/>';
    out += hairFront(p);
    out += '</svg>';
    return out;
  }

  document.querySelectorAll('[data-avatar]').forEach(function (el) {
    var p = PEOPLE[el.getAttribute('data-avatar')];
    if (p) el.innerHTML = svg(p);
  });
})();
