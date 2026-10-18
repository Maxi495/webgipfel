# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: small businesses in and around Munich without their own web team – trades (Handwerk), practices, service providers, gastronomy. The decision maker is usually the owner, evaluating on a phone or laptop between other work. Their job: get a website or landing page that looks professional and brings in enquiries, without having to manage the technical side themselves.

## Product Purpose
webgipfel is a two-person web agency from Munich (founded 2024). It designs and programs websites and landing pages and does SEO. The site webgipfel.com exists to win new projects. Success means two things, equally weighted: the visitor is convinced by the reference projects, and then sends an enquiry (contact form or email) for a first conversation (Erstgespräch).

## Positioning
- Focus instead of a full-service catalogue: only three services – Webdesign, Landing Pages, SEO.
- Direct line: clients always talk to the two founders who actually design and program the site. No project managers in between.
- Own code, no website builders or off-the-shelf templates; AI and professional workflows used where they save time, never at the cost of quality.
- Name and image: from Munich you see the Alps on clear days – "Vom ersten Schritt zum Gipfel"; every project is a climb taken together with the client.

## Operating Context
- Process communicated on the site in four steps: Erstgespräch & Analyse → Konzept & Design → Entwicklung → Launch (SEO variant ends with Überprüfung). Support continues after launch.
- Enquiry via contact form (kontakt.html) or email; no phone number on the site (owner decision). Promised reply time: within 24 hours. A client login exists for checking project status.
- Reference projects are full, separately built websites under /referenzen/ that visitors open and explore.

## Capabilities and Constraints
- Static HTML/CSS/JS, shared `assets/site.css` and `assets/site.js`, GSAP in reference projects. Deployed via git push to GitHub (main) → Vercel (cleanUrls) at www.webgipfel.com. Two people push to the repo.
- Language: German only. Visitors are always addressed with "Sie".
- Performance is part of the promise ("Schnell geladen"): pages must stay fast, especially on mobile.
- Desktop: card animations play on hover only. Touch: they play while the card is in view and stop as soon as it leaves.
- Open decisions: legal form and VAT ID for the Impressum, own domain email instead of webgipfel51@gmail.com, new team photos.

## Brand Commitments
- Name always lowercase: "webgipfel".
- Voice: calm, clear, confident, never loud – "Gute Webseiten müssen nicht laut sein, um gesehen zu werden." Formal "Sie".
- Mountain/summit metaphor and Munich–Alps connection (hero mountain image, panorama footer with Frauenkirche).
- Founders: Maximilian Pfeiffer and Alexander Djukic (confirmed spelling), Seitzstraße 23, 80538 München.

## Evidence on Hand
- Reference projects (real client work, per the owner): MAT Elektrotechnik (Handwerk), Kontorhaus, SCHLOTZ, Isarwave, Ladehof on the homepage, tagged by industry; Tonwert archived in `archiv/`.
  - The homepage no longer calls them "Konzeptprojekt"/"fiktiv" (owner decision 18.10.2026). Some reference pages themselves still carry a "fiktive Marke" label (isarwave, schlotz, kontorhaus impressum) – change only on the owner's explicit request.
- Testimonials: none yet. The "Unsere Kunden vertrauen uns" section is archived in `archiv/kundenstimmen.html` until real, approved quotes exist (then it goes after the projects). Never invent quotes, names, logos or ratings; only real, approved client statements may fill it.
- No published pricing, client counts, rankings or performance figures – do not fabricate any.
- Team photos and founder details on about.html; images in "Bilder Webgipfel/".

## Product Principles
1. Show, don't claim: the reference projects are the strongest argument; let them lead and keep them flawless on every device.
2. Every page leads to one next step: the Erstgespräch.
3. Fast and clean is part of the product – the site itself proves the craft it sells.
4. Plain, honest German for non-technical owners; no jargon, no inflated promises.
5. Personal over corporate: two real people, directly reachable.

## Accessibility & Inclusion
No product-specific standard agreed yet. Baseline in use: skip link, 44px touch targets, reduced-motion fallbacks for animations.
