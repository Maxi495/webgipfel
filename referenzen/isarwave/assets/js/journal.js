/* Isarwave Journal – baut Übersicht (journal.html) und Artikel (artikel.html?a=slug)
   aus journal-data.js. Läuft nach i18n.js und vor site.js, damit die
   Text-Animationen die fertigen Inhalte vorfinden. */
(() => {
  const J = window.IW_JOURNAL;
  if (!J) return;
  const { ARTICLES, AUTHORS, CATS, img, srcset, face, pick, fmtDate } = J;
  const T = (key, de) => (window.IW_T ? window.IW_T(key, de) : de);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const url = a => `artikel.html?a=${encodeURIComponent(a.slug)}`;
  const minutes = a => `${a.minutes} ${T('j.min', 'Min. Lesezeit')}`;

  const meta = a => `
    <span class="j-cat">${esc(pick(CATS[a.cat]))}</span>
    <span class="j-dot" aria-hidden="true"></span>
    <time datetime="${a.date}">${fmtDate(a.date)}</time>`;

  const teaser = (a, big) => `
    <article class="j-item${big ? ' j-featured' : ''}" data-cat="${a.cat}">
      <a href="${url(a)}" class="j-link">
        <figure class="photo${big ? ' fade-r' : ''}">
          <div class="frame"><img src="${img(a.image, big ? 1600 : 900)}" srcset="${srcset(a.image)}" sizes="${big ? '(max-width: 900px) 100vw, 55vw' : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 400px'}" alt="${esc(pick(a.alt))}" loading="lazy"></div>
        </figure>
        <div class="j-text">
          <p class="j-meta">${meta(a)}</p>
          <h${big ? 2 : 3} class="j-title"${big ? ' data-split' : ''}>${esc(pick(a.title))}</h${big ? 2 : 3}>
          <p class="j-lead">${esc(pick(a.lead))}</p>
          <p class="j-by">${esc(AUTHORS[a.author].name)} · ${minutes(a)}</p>
        </div>
      </a>
    </article>`;

  /* ---------- Übersicht ---------- */
  const list = document.getElementById('journal-list');
  if (list) {
    const featured = sorted.find(a => a.featured) || sorted[0];
    const rest = sorted.filter(a => a !== featured);
    document.getElementById('journal-featured').innerHTML = teaser(featured, true);
    document.querySelector('#journal-featured .j-item').classList.add('j-in');
    list.innerHTML = rest.map(a => teaser(a)).join('');

    // Filter nach Kategorie
    const used = [...new Set(sorted.map(a => a.cat))];
    const bar = document.getElementById('journal-filter');
    bar.innerHTML = [`<button type="button" data-f="all" aria-pressed="true">${T('j.all', 'Alle Beiträge')}</button>`]
      .concat(used.map(c => `<button type="button" data-f="${c}" aria-pressed="false">${esc(pick(CATS[c]))}</button>`)).join('');
    const feat = document.getElementById('journal-featured');
    bar.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const f = b.dataset.f;
      bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      const show = el => f === 'all' || el.dataset.cat === f;
      feat.hidden = !show(feat.firstElementChild);
      list.querySelectorAll('.j-item').forEach(el => {
        const on = show(el);
        el.hidden = !on;
        if (on) { el.classList.remove('j-in'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('j-in'))); }
      });
    });
    list.querySelectorAll('.j-item').forEach(el => el.classList.add('j-in'));
  }

  /* ---------- Artikel ---------- */
  const art = document.getElementById('article');
  if (art) {
    const slug = new URLSearchParams(location.search).get('a');
    const a = sorted.find(x => x.slug === slug);
    if (!a) {
      art.innerHTML = `
        <div class="wrap article-head">
          <p class="label">Journal</p>
          <h1 class="h-lg" data-split>${T('j.notfound', 'Diesen Beitrag gibt es nicht mehr.')}</h1>
          <p style="margin-top:32px"><a class="ghost" href="journal.html">${T('j.back', 'Zurück zum Journal')} <span class="arr">→</span></a></p>
        </div>`;
      return;
    }
    const au = AUTHORS[a.author];
    document.title = `${pick(a.title)} – Isarwave Journal`;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', pick(a.lead));

    // Jeder Block auf oberster Ebene wird einzeln eingeblendet
    const tmp = document.createElement('div');
    tmp.innerHTML = pick(a.body).trim();
    const blocks = [...tmp.children].map(el => `<div class="reveal">${el.outerHTML}</div>`).join('');

    const others = sorted.filter(x => x !== a).slice(0, 3);
    art.innerHTML = `
      <div class="read-progress" aria-hidden="true"><span></span></div>
      <header class="wrap article-head">
        <a class="back" href="journal.html"><span class="arr">←</span> Journal</a>
        <p class="j-meta intro-in" style="--d:.45s">${meta(a)}</p>
        <h1 class="article-title" data-split data-delay=".55">${esc(pick(a.title))}</h1>
        <p class="article-lead" data-split data-delay=".9" data-step=".05">${esc(pick(a.lead))}</p>
        <div class="byline intro-in" style="--d:1.25s">
          <img src="${face(au.img)}" alt="" width="48" height="48">
          <div><p class="by-name">${esc(au.name)}</p><p class="by-role">${esc(pick(au.role))} · ${minutes(a)}</p></div>
        </div>
      </header>
      <div class="wrap">
        <figure class="photo wide article-photo">
          <div class="frame"><img src="${img(a.image, 2000)}" srcset="${srcset(a.image)}" sizes="(max-width: 1280px) 100vw, 1280px" alt="${esc(pick(a.alt))}" fetchpriority="high"></div>
        </figure>
      </div>
      <div class="wrap"><div class="prose">${blocks}</div></div>
      <section class="wrap more" aria-labelledby="more-title">
        <h2 class="h-md" id="more-title" data-split>${T('j.more', 'Mehr aus dem Journal')}</h2>
        <div class="j-grid">${others.map(x => teaser(x)).join('')}</div>
      </section>`;
    art.querySelectorAll('.j-item').forEach(el => el.classList.add('j-in'));

    // Lesefortschritt
    const bar = art.querySelector('.read-progress span');
    const prose = art.querySelector('.prose');
    const upd = () => {
      const r = prose.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / r.height));
      bar.style.transform = `scaleX(${p})`;
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
})();
