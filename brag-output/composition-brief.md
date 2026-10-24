# Hyperframes Composition Brief: webgipfel

## Objective
Create a short launch-style brag video for webgipfel.com, the website of a two-person web agency from Munich (Webdesign, Landing Pages, SEO).

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 23 seconds

## Source Material
- Project root: the website repository (static HTML/CSS/JS, `index.html` + `assets/site.css`)
- Primary files read: `index.html`, `assets/site.css`, `DESIGN.md`, `PRODUCT.md`
- Product name: webgipfel (always lowercase)
- Tagline / strongest claim: „Gute Webseiten müssen nicht laut sein, um gesehen zu werden.“
- Key UI or visual moment to recreate: the hero (mountain photo + two-line headline with the second line in Alpine Blue + pill button with rising-fill hover) and the four project cards
- Copy that must appear verbatim:
  - Gute Webseiten müssen nicht laut sein, um gesehen zu werden.
  - Vom ersten Schritt / zum Gipfel.
  - Webdesign · Landing Pages · SEO · München
  - Projekt anfragen
  - Projekte — Kontorhaus, SCHLOTZ, Isarwave, Ladehof — Tags: Finanzen & Steuer, Gastronomie, Medizintechnik, E-Mobilität
  - Wie wir arbeiten. — Schritt 01 · Talstation / Erstgespräch & Analyse — Schritt 02 · Mittelstation / Konzept & Design — Schritt 03 · Bergstation / Entwicklung — Schritt 04 · Gipfel / Launch
  - Sie haben ein Projekt im Kopf?
  - Wir antworten innerhalb von 24 Stunden.
  - webgipfel. / webgipfel.com

## Creative Direction
- Tone preset: polished
- Creative direction: „Ruhiger Aufstieg“ – a quiet premium product film
- Interpretation: 5 scenes, long holds, slow crossfades, one object-becomes-the-world transition. Motion only where the site itself moves. Nothing floats or pulses.
- Angle: The video takes the site's own claim literally. It is the quietest launch video possible: white space, one blue, large tight type, a four-station climb from valley to summit. Every scene is real material from the site.
- Hook: The quote appears word by word from light grey to ink on white; „laut“ turns Alpine Blue. Holds, then blurs out.
- Outro / punchline: Night Ridge panel slides up, „Sie haben ein Projekt im Kopf?“, two founder avatars, the 24-hour promise, then the wordmark „webgipfel.“ with the blue dot and „webgipfel.com“. Music fades. Silence.
- Avoid:
  - Generic SaaS language (nothing beyond the site's own copy)
  - Abstract filler visuals, particles, gradients, waveforms
  - Unrelated visual redesign (no new accent colours, no shadows, no uppercase headlines, no second typeface)
  - Invented numbers, client quotes, ratings, prices (the site publishes none)

## Visual Identity
- Background: #ffffff; tile surfaces #f5f6f8 and #eceef1; light accent tile #e9f0f9
- Text: #0e1a2b; on dark panel #ffffff and rgba(255,255,255,.72); hairlines rgba(14,26,43,.1)
- Accent: #1f5aa6 (only interactive/emphasis colour); dark panel #0f3466
- Display font: Inter Tight 500 via `@font-face` from `assets/fonts/inter-tight-latin.woff2` (variable 100–900); tracking -0.03em at display size, -0.02em at headline size
- Body font: Inter Tight 400; labels uppercase 1.5 % of frame height with +0.02em tracking
- Visual references from the project: `assets/img/gipfel-2000.webp` (hero mountain), `assets/img/projekt-kontorhaus.jpg`, `assets/img/projekt-schlotz-seite-900.webp`, `assets/img/projekt-isarwave-960.webp`, `assets/img/projekt-ladehof.jpg` (project posters), `assets/img/maximilian-av.webp`, `assets/img/alexander-av.webp` (founder avatars). Pill buttons 5.8 % height-ish, 20px tile radius, 80px panel radius. Wordmark: "web" weight 400, "gipfel" weight 600, full stop in Alpine Blue.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook: Der Satz — 3.7s — quote word-by-word grey→ink, „laut“ blue, hold, blur out
2. Hero — 4.3s (3.7–8.0) — mountain photo sharpens on cue 3.70; eyebrow, „Vom ersten Schritt“ / „zum Gipfel.“ (blue); pill button; simulated hover with rising mist fill and rolling label
3. Projekte — 5.7s (8.0–13.7) — „Projekte“ title; four cards slide in on 8.96 / 10.01 / 11.06 / 12.12 with poster, title and industry tag; push into the Isarwave card until it fills the frame
4. Ablauf — 4.2s (13.7–17.9) — „Wie wir arbeiten.“; a blue line climbs in four steps; four station tiles appear on 13.70 / 14.76 / 15.81 / 16.86 and stay
5. Outro — 5.1s (17.9–23.0) — Night Ridge panel slides up on 17.91; „Sie haben ein Projekt im Kopf?“, avatars, 24-hour line; blur-swap to wordmark „webgipfel.“ + webgipfel.com; hold ≥ 2 s

## Audio
- Audio role: warm bed / sparse professional accents
- Audio arc: fades in under the quiet quote, opens with the photo, carries the card sequence on its beat, lands softly on the dark panel, fades under a single bell on the wordmark
- Music: `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` (CC BY 4.0, Sascha Ende, ende.app)
- Music treatment: start 0 s, volume ≈ 0.55, fade-in 0.6 s, fade-out over the last 2 s (21–23)
- Music cue guidance: bundled preset `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.music-cues.json` (114.84 BPM). Strong cues to lock: 3.70 (hero), 8.96 (first card), 17.91 (panel). Beat grid every other beat for readable sequential items: cards 8.96 · 10.01 · 11.06 · 12.12; stations 13.70 · 14.76 · 15.81 · 16.86.
- Audio-reactive treatment: subtle; per-frame data in `assets/music/audio-data.json` (extracted with the media-use helper). Bass may breathe the hero photo (≤ 2 % scale/brightness) and the glow behind the wordmark's blue dot. No waveforms, no text pulsing.
- Audio-coupled moments:
  - Hero button hover — one click
  - Cards — one soft card-slide per card, at the card's start
  - Stations — a very quiet drop per tile, two takes rotated, or none if the bed carries it
  - Panel — one soft impact
  - Wordmark — one bell hit ringing over the music fade
- SFX selection guidance: low high-frequency-risk files, motion-matched, sparse. Max 7 SFX. No whooshes on crossfades, no typing on the quote.
- SFX analysis guidance: `~/.claude/skills/brag/assets/sfx/sfx-analysis.md`; pre-copied picks in `assets/sfx/`: `casino/card-slide-1.ogg`, `interface/click_003.ogg`, `interface/drop_001.ogg`, `interface/drop_002.ogg`, `impact/impactSoft_medium_001.ogg`, `impact/impactBell_heavy_003.ogg`
- Exact SFX choice: Hyperframes chooses filenames, timestamps, density and volume based on the implemented animation.
- Audio files: already copied into `brag-output/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes skills — `hyperframes` (composition contract + `data-*` timing, `references/format.md`; motion in `references/motion.md`; look in `references/look.md`), `hyperframes-registry`, `media-use`, and `hyperframes-cli` (lint/check/render). /brag is its own workflow: skip the storyline step, `SPEC.md`, `usage`, `history`, `feedback` and REVIEW.md; `check` is brag's gate. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project (hero, cards, process, panel, wordmark).
- Keep all text readable in the final render (reading floors: 0.8 s for labels, 0.3 s/word for sentences, last line ≥ 2 s).
- Keep the video within 15-25 seconds (target 23 s).
- Include the planned music/SFX layer.
- Treat cue metadata as optional timing hints; readability and story come first. 1-3 strong cue locks, marked `// beat-locked`; sequential items on every other beat, marked `// beat-grid`.
- Use local assets only. Fonts via `@font-face` from `assets/fonts/`.
- Run `npx hyperframes check` before render — brag's single gate.
- Keep creation and rendering local. No publishing.
