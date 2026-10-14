/* Isarwave – Sprachumschaltung (DE/EN)
   Deutsch steht direkt im HTML. Für Englisch ersetzt dieses Skript vor allen
   Animationen den Inhalt aller Elemente mit data-i18n="schlüssel" sowie
   Attribute aus data-i18n-attr="attribut:schlüssel;…".
   Die Wahl wird gemerkt (localStorage) und kann per ?lang=en|de gesetzt werden. */
(() => {
  const EN = {
    /* Meta & Barrierefreiheit */
    'meta.title': 'Isarwave – EEG for everyday life | Neurotechnology from Munich',
    'meta.desc': 'Isarwave develops a wireless EEG headband and AI-assisted analysis for long-term brain monitoring. Currently in a clinical pilot phase, developed in Garching near Munich.',
    'a11y.home': 'Isarwave home',
    'a11y.skip': 'Skip to content',
    'a11y.mainnav': 'Main navigation',
    'a11y.lang': 'Language',
    'a11y.menuOpen': 'Open menu',
    'a11y.menuClose': 'Close menu',
    'a11y.statement': 'Statement',
    'a11y.team': 'Team members',
    'a11y.carousel': 'carousel',
    'a11y.prev': 'Previous team member',
    'a11y.next': 'Next team member',

    /* Navigation & CTAs */
    'nav.tech': 'Technology &amp; Research',
    'nav.team': 'Team',
    'nav.journal': 'Journal',
    'cta.pilot': 'Become a pilot partner',
    'cta.research': 'Request research access',

    /* Startseite */
    'hero.label': 'Neurotechnology from Munich',
    'hero.title': 'The brain speaks. We listen.',
    'hero.body': 'Isarwave makes brain monitoring fit for everyday life: a wireless EEG headband for use at home and an AI that helps neurologists find what matters in days of data.',
    'hero.how': 'How it works',
    'hero.scroll': 'Scroll',
    'problem.label': 'The problem',
    'problem.title': '72 hours of brain activity. A fraction of it is what counts.',
    'problem.body': 'Many neurological abnormalities do not appear on demand. They show up at night, under stress or only rarely. Conventional recordings are short, wired and confined to the clinic. Reviewing long recordings costs specialists hours they simply do not have.',
    'band.label': 'Hardware',
    'band.title': 'Measured where life actually happens.',
    'band.body': 'Eight dry electrodes, no gel, no cables. The Isarwave Band weighs 68 grams and records for up to 72 hours at a time. Data is encrypted on the device itself.',
    'band.s1': 'Channels',
    'band.s2': 'Recording',
    'band.s2v': 'up to 72 h',
    'band.s3': 'Weight',
    'band.s4': 'Sampling rate',
    'band.more': 'Full technical specifications',
    'cortex.label': 'Software',
    'cortex.title': 'The AI sorts. People decide.',
    'cortex.body': 'Isarwave Cortex searches long recordings for notable patterns and presents them to specialists in order of priority, with full access to the raw signal. Every marker can be traced. There is no black box.',
    'cortex.f1': 'Prioritised segments',
    'cortex.f1t': 'Notable time windows come first in the list instead of somewhere in hour 51.',
    'cortex.f2': 'Traceable',
    'cortex.f2t': 'Every AI marker shows which channels and features triggered it.',
    'cortex.f3': 'Open formats',
    'cortex.f3t': 'Export as EDF+ and BIDS for research and second opinions.',
    'statement.title': 'Days, not <em>hours.</em>',
    'statement.body': 'In everyday life, not in the lab. We make visible what otherwise gets lost in long recordings.',
    'research.label': 'Research',
    'research.title': 'Science first.',
    'research.body': 'We develop together with clinical partners in the Munich area. Our current pilot phase tests how closely the Isarwave Band agrees with conventional adhesive-electrode EEG. We publish our results through peer review, not on marketing slides.',
    'research.t1': 'Founded in Garching',
    'research.t2': 'First working prototype with 8 channels',
    'research.t3': 'Clinical pilot phase started',
    'research.t4y': 'Next step',
    'research.t4': 'CE conformity assessment under the MDR',
    'research.more': 'Technology &amp; research in detail',
    'team.label': 'Team',
    'team.title': 'Neuroscience meets engineering.',
    'team.jobs': 'We are looking for people who love signals.',
    'team.jobs1': 'We are 14 people from neuroscience, signal processing, hardware and medicine, and we are growing. Send your CV and a few honest sentences to <a href="mailto:karriere@isarwave.de">karriere@isarwave.de</a>.',
    'team.jobs2': 'You can find all 5 open positions <a href="#karriere">here</a>.',
    'team.r1': 'Co-founder &amp; CEO',
    'team.r2': 'Co-founder &amp; CTO',
    'team.b1': 'Neuroscientist with a PhD and 8 years of research on sleep EEG.',
    'team.b2': 'Signal processing and embedded systems, previously automotive sensing.',
    'team.b3': 'Consultant neurologist specialising in epileptology.',
    'team.b4': 'Industrial designer who builds wearables you forget you are wearing.',
    'team.b5': 'Computer scientist with a PhD, building explainable models for medical time series.',
    'team.b6': 'Ten years in medical device regulation, leading our CE process under the MDR.',
    'team.b7': 'Coordinates the pilot phase with our clinical partners in the Munich area.',
    'inv.title': 'Our backers',
    'inv.body': 'We are supported by founders from medical technology and by funds focused on health. They bring experience, and the patience that clinical development requires.',
    'inv.s1': 'Business angel, former head of neuromodulation',
    'inv.s2': 'Neurologist and business angel',
    'place.label': 'Location',
    'place.title': 'Developed in Garching. Designed for all of Europe.',
    'place.body': 'We work where engineering, medicine and research come together in Munich: between campus, hospitals and the Isar.',
    'place.alt': 'Aerial view of a city at night with illuminated streets',
    'final.title': 'Join the pilot phase.',
    'final.body': 'We are looking for neurology departments and practices that want to test, challenge and improve with us.',

    /* Footer */
    'foot.product': 'Product',
    'foot.research': 'Research access',
    'foot.company': 'Company',
    'foot.careers': 'Careers',
    'foot.contact': 'Contact',
    'foot.legal': 'Legal',
    'foot.imprint': 'Imprint',
    'foot.privacy': 'Privacy',
    'foot.disclaimer': 'Isarwave Band and Isarwave Cortex are under development and are not currently approved as medical devices.',
    'foot.fictional': '(fictional)',
    'foot.placeholder': '[PLACEHOLDER: address, management, register court, company number]',
    'foot.credits': 'Photos via <a href="https://unsplash.com" rel="noopener">Unsplash</a> (city view: Daniel Seßler).',

    /* Technologie & Forschung */
    't.meta.title': 'Technology &amp; Research – Isarwave',
    't.meta.desc': 'How the Isarwave Band records brain activity, how Isarwave Cortex analyses long-term EEG and how we validate both with hospitals in the Munich area.',
    't.hero.title': 'From signal to diagnosis.',
    't.hero.body': 'How the Isarwave Band measures, how Isarwave Cortex analyses, and how we test both together with neurology departments before we promise anything.',
    't.nav.1': 'Recording',
    't.nav.2': 'Signal path',
    't.nav.3': 'Analysis',
    't.nav.4': 'Data',
    't.nav.5': 'Studies',
    't.m.label': '01 — Recording',
    't.m.title': 'Eight channels. No gel. No cables.',
    't.m.p1': 'The electrodes of the Isarwave Band are flexible polymer pins with a silver/silver chloride coating. They reach through the hair to the scalp and work without gel. In the background, the band continuously measures contact impedance and reports when a channel loses contact.',
    't.m.p2': 'The eight channels sit at Fp1, Fp2, F7, F8, T7, T8, O1 and O2 according to the international 10-20 system. That is enough to follow frontal, temporal and occipital activity over several days without anyone having to reposition the electrodes.',
    't.s.ch': 'Channels',
    't.s.chv': '8, positioned according to the 10-20 system',
    't.s.el': 'Electrodes',
    't.s.elv': 'Dry, Ag/AgCl-coated polymer pins',
    't.s.fs': 'Sampling rate',
    't.s.res': 'Resolution',
    't.s.resv': '24 bit per channel',
    't.s.bw': 'Bandwidth',
    't.s.bwv': '0.5 to 100 Hz',
    't.s.dur': 'Recording',
    't.s.durv': 'up to 72 hours continuously',
    't.s.w': 'Weight',
    't.s.con': 'Connectivity',
    't.s.mem': 'Storage',
    't.s.memv': '32 GB internal, records offline too',
    't.s.enc': 'Encryption',
    't.s.encv': 'AES-256, on the band itself',
    't.m.alt': 'A clinician fits an EEG headband on a patient',
    't.m.cap': 'Fitting takes a few minutes and needs no scalp preparation.',
    't.p.label': '02 — Signal path',
    't.p.title': 'From the head to the diagnosis in four steps.',
    't.p.1': 'Record',
    't.p.1t': 'Eight dry electrodes capture brain activity at 500 Hz and 24 bit. Impedance measurement continuously checks contact.',
    't.p.2': 'Encrypt',
    't.p.2t': 'Data is encrypted and stored without names on the band itself, for up to 72 hours even without any connection.',
    't.p.3': 'Transfer',
    't.p.3t': 'The Companion App collects the data via Bluetooth and uploads it over Wi-Fi to servers in Germany.',
    't.p.4': 'Analyse',
    't.p.4t': 'Isarwave Cortex flags artefacts, searches for notable patterns and presents prioritised segments for clinical review.',
    't.p.alt': 'Close-up of a circuit board in the dark with green glowing traces',
    't.p.cap': 'Analogue front end, radio module and battery monitoring sit on a 38 × 22 millimetre circuit board.',
    't.a.label': 'In everyday life',
    't.a.title': 'Made for the night, for work and for the weekend.',
    't.a.body': 'A long-term EEG is only as good as people’s willingness to wear it. The band is shaped so you can sleep on your side, fits under a hat and vibrates briefly when a channel loses contact. In the Companion App, patients log events with a single tap, such as a déjà vu, a brief absence or a headache.',
    't.a.f1': 'Event diary with exact timestamps',
    't.a.f2': 'Battery level and contact quality always visible',
    't.a.f3': 'Reminder when the band needs charging',
    't.a.alt': 'A woman wearing an EEG headband sits in an armchair looking at a tablet',
    't.a.cap': 'Recording at home: measurement and diary run side by side.',
    't.c.label': '03 — Analysis',
    't.c.title': 'Pre-sorted, not pre-decided.',
    't.c.body': 'Isarwave Cortex works in three steps. First, it detects movement, muscle and eye artefacts and flags them instead of deleting them. Then a model looks for patterns that may be relevant for diagnosis, such as epileptiform discharges or notable slowing. Finally, Cortex ranks the segments by relevance. The clinician sees every marker together with the channels that triggered it and can confirm or reject it.',
    't.c.f1': 'Detect artefacts',
    't.c.f1t': 'Movement, chewing and blinks are flagged. The raw signal is preserved in full.',
    't.c.f2': 'Find patterns',
    't.c.f2t': 'The model scores every time window and shows which channels and frequency bands led to a marker.',
    't.c.f3': 'Prioritise',
    't.c.f3t': 'The most relevant segments come first. The diagnosis itself stays entirely with the clinician.',
    't.c.check': 'How we test the model',
    't.c.checkt': 'Every model version is tested on recordings that were not used in training and independently reviewed by two neurologists. Only when a version passes this review do we release it. In use, the model does not keep learning on its own; feedback only enters through a new, re-tested version.',
    't.statement': 'Every marker can be traced back to the <em>raw signal.</em>',
    't.d.label': '04 — Data',
    't.d.title': 'Pseudonymised from the very first sample.',
    't.d.body': 'Health data deserves more than a tick box in a privacy policy. That is why data minimisation is not a setting for us but part of the architecture.',
    't.d.alt': 'Aisle between server racks in a data centre',
    't.d.f1': 'No names',
    't.d.f1t': 'The band only knows a device ID. The link to the person stays exclusively with the treating institution.',
    't.d.f2': 'In Germany',
    't.d.f2t': 'Processing and storage take place in data centres in Germany. Data never leaves the EU.',
    't.d.f3': 'Traceable',
    't.d.f3t': 'Every access to a recording is logged and can be reviewed by the institution at any time.',
    't.d.f4': 'Built to standards',
    't.d.f4t': 'We align our quality management with ISO 13485 and our software development with IEC 62304.',
    't.st.label': '05 — Studies',
    't.st.title': 'We test ourselves before others do.',
    't.st.body': 'Isarwave is being developed in close collaboration with neurology departments in the Munich area. Before we claim anything, we measure it and publish the results through peer review.',
    't.st.alt': 'A study nurse prepares an EEG recording on a laptop',
    't.st.cap': 'Simultaneous recording: the band and clinical EEG record in parallel.',
    't.st.q': 'Question',
    't.st.d': 'Design',
    't.st.n': 'Participants',
    't.st.o': 'Sites',
    't.st.t': 'Timeline',
    't.st.r': 'Results',
    't.st1.title': 'Pilot study: agreement with clinical video EEG',
    't.st1.status': 'Recruiting',
    't.st1.q': 'How closely do Isarwave Band recordings agree with clinical video EEG using adhesive electrodes, and does Cortex identify the same notable segments as the reviewing neurologists?',
    't.st1.d': 'Prospective, simultaneous recording with both systems over 24 hours, blinded review',
    't.st1.n': 'Planned: 40 adults admitted for evaluation of suspected epilepsy',
    't.st1.o': 'Two neurology departments in the Munich area',
    't.st1.t': 'March 2026 to approximately February 2027',
    't.st1.r': 'Publication after completion and peer review',
    't.st2.title': 'Wear study: seven days in everyday life',
    't.st2.status': 'In preparation',
    't.st2.q': 'How long and how reliably is the band worn at home, and how well does signal quality hold up outside the clinic?',
    't.st2.d': 'Single-arm, seven days of home recording with an event diary in the Companion App',
    't.st2.n': 'Planned: 25 adults with known epilepsy',
    't.st2.t': 'Start planned for the first quarter of 2027',
    't.rd.label': 'Data for research',
    't.rd.title': 'Open formats, clear rules.',
    't.rd.body': 'Long-term EEG from everyday life is rare in research. We make it accessible, but only with patients’ consent and under a data use agreement.',
    't.rd.f1': 'Export as EDF+ and in BIDS format',
    't.rd.f2': 'Cortex and clinician annotations kept separate',
    't.rd.f3': 'Pseudonymised raw data, never shared with third parties',
    't.rd.f4': 'Requests are reviewed by our scientific advisory board',
    't.final.title': 'Test it with us.',
    't.final.body': 'For the pilot phase, we are looking for more neurology departments and practices that want to use the band in their patients’ everyday lives.',
    't.foot.credits': 'Photos via <a href="https://unsplash.com" rel="noopener">Unsplash</a>: Mindfield Biosystems, Vishnu Mohanan, İsmail Enes Ayhan.',

    /* Journal */
    'j.meta.title': 'Journal – Isarwave',
    'j.meta.desc': 'Notes from research and development at Isarwave: pilot study, dry electrodes, AI in EEG analysis and regulation.',
    'j.hero.title': 'Notes from research and development.',
    'j.hero.body': 'How we measure, what we learn and what we are working on right now. Written by the team in Garching, without the marketing slides.',
    'j.filter': 'Filter by topic',
    'j.posts': 'Articles',
    'j.all': 'All articles',
    'j.min': 'min read',
    'j.more': 'More from the journal',
    'j.back': 'Back to the journal',
    'j.notfound': 'This article no longer exists.',
    'j.press.title': 'For press and trade media.',
    'j.press.body': 'We are happy to provide interviews, images and background on the pilot study.',
    'j.press.cta': 'Press enquiry',
    'j.foot.credits': 'Photos via <a href="https://unsplash.com" rel="noopener">Unsplash</a>: Mindfield Biosystems, Sandip Kalal, ThisisEngineering, Daniel Seßler.',

    /* Kontakt-Popup */
    'form.label': 'Contact',
    'form.pilot.title': 'Become a pilot partner',
    'form.pilot.intro': 'We are looking for neurology departments and practices that want to use the Isarwave Band in the pilot phase and tell us honestly what is missing. You will hear from us within two working days.',
    'form.pilot.msg': 'For example: how many long-term EEGs do you run per month?',
    'form.pilot.thanks': 'Elif Demir from our clinical research team will get back to you within two working days.',
    'form.research.title': 'Request research access',
    'form.research.intro': 'For research groups, we provide pseudonymised raw data in EDF+ and BIDS under a data use agreement. Tell us briefly about your project.',
    'form.research.msg': 'Research question, data needed, planned timeline',
    'form.research.thanks': 'Dr. Sophie Lindner will get back to you within two working days to discuss next steps.',
    'form.general.title': 'Write to us.',
    'form.general.intro': 'Questions about Isarwave, press enquiries or an idea for working together: we read every message.',
    'form.general.msg': 'Your message',
    'form.general.thanks': 'We will get back to you within two working days.',
    'form.name': 'Name',
    'form.email': 'Work email',
    'form.org': 'Organisation',
    'form.org.ph': 'Hospital, practice or institute',
    'form.role': 'I am',
    'form.role.ph': 'Please choose',
    'form.role.clinic': 'Neurologist at a hospital',
    'form.role.practice': 'Neurologist in private practice',
    'form.role.research': 'Researcher',
    'form.role.press': 'Investor or press',
    'form.role.other': 'Other',
    'form.msg': 'Message',
    'form.optional': '(optional)',
    'form.consent': 'I agree that Isarwave may store my details to process this request. More in our <a href="#datenschutz">privacy policy</a>.',
    'form.note': 'Your details stay with us and are never passed on to third parties.',
    'form.send': 'Send request',
    'form.sending': 'Sending …',
    'form.retry': 'Send again',
    'form.close': 'Close',
    'form.thanks.title': 'Thank you. We have received your request.',
    'form.err.required': 'Please fill in this field.',
    'form.err.email': 'Please enter a valid email address.',
    'form.err.select': 'Please choose an option.',
    'form.err.send': 'Sorry, that did not work. Please try again or write to pilot@isarwave.de.',
  };

  const KEY = 'iw-lang';
  const store = v => { try { localStorage.setItem(KEY, v); } catch (e) { /* privater Modus */ } };
  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'de' || q === 'en') store(q);
  const lang = q === 'de' || q === 'en' ? q : (read() === 'en' ? 'en' : 'de');

  window.IW_LANG = lang;
  window.IW_T = (key, de) => (lang === 'en' && EN[key] != null ? EN[key] : de);
  document.documentElement.lang = lang;

  if (lang === 'en') {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = EN[el.dataset.i18n];
      if (v == null) return;
      if (el.tagName === 'TITLE') { const t = document.createElement('textarea'); t.innerHTML = v; el.textContent = t.value; }
      else el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (EN[key] != null) el.setAttribute(attr, EN[key].replace(/&amp;/g, '&'));
      });
    });
  }

  // Umschalter: Auswahl merken und Seite in der neuen Sprache neu laden
  document.querySelectorAll('[data-lang]').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.setAttribute('lang', btn.dataset.lang);
    btn.setAttribute('aria-label', btn.dataset.lang === 'en' ? 'English' : 'Deutsch');
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === lang) return;
      store(btn.dataset.lang);
      const url = new URL(location.href);
      url.searchParams.set('lang', btn.dataset.lang);
      location.href = url.toString();
    });
  });
})();
