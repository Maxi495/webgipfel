---
name: webgipfel
description: Webdesign, Landing Pages und SEO aus München – klare Sicht vom Gipfel.
colors:
  summit-white: "#ffffff"
  mist-50: "#f5f6f8"
  mist-100: "#eceef1"
  mist-200: "#dde1e6"
  slate-mist: "#5b6472"
  glacier-ice: "#e9f0f9"
  alpine-blue: "#1f5aa6"
  alpine-blue-deep: "#194c8f"
  night-ridge: "#0f3466"
  ink: "#0e1a2b"
  slate: "#3d4b5e"
  sandstone: "#f3ede3"
  sandstone-ochre: "#b0742c"
typography:
  display:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "min(16rem, 10vw)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "min(8rem, 5vw)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "3.2rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.8rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Tight, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.02em"
rounded:
  sm: "1.6rem"
  md: "2rem"
  panel: "8rem"
  pill: "99999px"
spacing:
  "1": "0.6rem"
  "2": "0.8rem"
  "3": "1.6rem"
  "4": "2rem"
  "5": "2.4rem"
  "6": "3rem"
  "7": "4rem"
  "8": "6rem"
  "9": "8rem"
  "10": "10rem"
  "11": "12rem"
  "12": "15rem"
  "13": "20rem"
components:
  button-primary:
    backgroundColor: "{colors.alpine-blue}"
    textColor: "{colors.summit-white}"
    rounded: "{rounded.pill}"
    padding: "0 3rem"
    height: "5.8rem"
  button-primary-hover:
    backgroundColor: "{colors.mist-100}"
    textColor: "{colors.alpine-blue}"
  button-secondary:
    backgroundColor: "{colors.mist-100}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 3rem"
    height: "5.8rem"
  button-inverse:
    backgroundColor: "{colors.summit-white}"
    textColor: "{colors.alpine-blue}"
    rounded: "{rounded.pill}"
    padding: "0 3rem"
    height: "5.8rem"
  tag:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.6rem"
    height: "3.6rem"
    typography: "{typography.label}"
  tile:
    backgroundColor: "{colors.mist-50}"
    rounded: "{rounded.md}"
    padding: "4rem"
  tile-accent:
    backgroundColor: "{colors.glacier-ice}"
    rounded: "{rounded.md}"
    padding: "4rem"
  project-card-preview:
    backgroundColor: "{colors.mist-100}"
    rounded: "{rounded.md}"
  panel-dark:
    backgroundColor: "{colors.night-ridge}"
    textColor: "{colors.summit-white}"
    rounded: "{rounded.panel}"
---

# Design System: webgipfel

## Overview

**Creative North Star: "Klare Sicht vom Gipfel"**

webgipfel looks the way a clear day in the Alps feels from Munich: a lot of air, one cool blue, and a sharp outline on the horizon. The canvas is white and pale mist-grey. A single Alpine Blue carries every action and every emphasis. Large, tightly set Inter Tight headlines provide the structure. Nothing shouts. Confidence comes from scale, space and precise detail, not from colour or decoration.

The mood is calm, clear and high-quality. Motion is a reward, not a decoration:
- Buttons fill softly from below.
- Labels roll upwards.
- Reference cards play their showreel only when they are hovered (desktop) or in view (touch).
- Long scroll sequences (quote pin, "Wie wir arbeiten" panels) give the page a slow, deliberate climb.

The reference projects are the visual climax. Each card is its own small world in the client's brand, set inside webgipfel's neutral frame. The mountain imagery bookends the site: a photo of the summit in the hero, and an illustrated Alpine panorama with the Frauenkirche in the footer.

The type scale is fluid. `rem` is tied to the viewport (`html` font-size is `min(2.667vw, 12px)` on phones, `max(.625vw, 8px)` from 768px and fixed at 10px from 1600px). So 1rem ≈ 10px on a large desktop, and every size in this file scales with the window.

**Key Characteristics:**
- White and mist-grey canvas; Alpine Blue is the only accent.
- Inter Tight only, weights 400/500/600, negative tracking on large sizes.
- Soft, precise shapes: pill buttons, 20px tiles, an 80px radius on large dark panels.
- Flat surfaces; depth comes from tonal steps and motion, not shadows.
- Expressive easing (expo out, elastic) with short durations; every effect has a reduced-motion fallback.
- Hover-only effects on desktop (`pointer: fine`); in-view triggers on touch.

## Colors

A cool, nearly monochrome Alpine palette: white air, mist greys, one decisive blue and a deep night-blue for inverted panels.

### Primary
- **Alpine Blue** (`alpine-blue`): the single accent. Used for primary buttons, links in body text, the dot in the wordmark, the second line of the hero headline, highlighted words in the intro quote, text selection and focus rings on light surfaces.
- **Alpine Blue Deep** (`alpine-blue-deep`): the pressed/darker step of Alpine Blue where a darker tone of the same hue is needed.

### Secondary
- **Night Ridge** (`night-ridge`): the inverted world. Used for the large dark panels (contact/FAQ panel, dark landing sections) and the login backdrop tint. On it, text is Summit White, and focus rings switch to white.
- **Glacier Ice** (`glacier-ice`): the light tint of Alpine Blue. Used for accent tiles, the login badge and the fill of inverse buttons.

### Tertiary
- **Sandstone** and **Sandstone Ochre** (`sandstone`, `sandstone-ochre`): a warm counterweight that appears only in the key-figure tiles ("stat--sand"), next to ice and grey tiles. Never used for actions.

### Neutral
- **Ink** (`ink`): all text on light surfaces. Hairlines are Ink at 10% (`rgba(14,26,43,.1)`); muted text is Ink at 60–70% opacity.
- **Slate** (`slate`): the accent of the grey key-figure tile.
- **Summit White** (`summit-white`): page background, text on dark panels and on Alpine Blue.
- **Mist 50 / 100 / 200** (`mist-50`, `mist-100`, `mist-200`): tile surfaces, secondary buttons, card placeholders and button fill layers, from lightest to darkest.
- **Slate Mist** (`slate-mist`, `--ds-grey-600`): the darkest grey for small secondary text, e.g. labels inside the process mock-ups and the process lead. Lighter greys are never used for readable text (they fail 4.5:1).

### Named Rules
**The One Blue Rule.** Alpine Blue is the only interactive colour on webgipfel's own surfaces. If something is blue, it can be clicked or it is the one emphasised word, never decoration.

**The Client World Rule.** Colours inside a reference card or reference project belong to that client (Ladehof green, Isarwave, Kontorhaus …). They stay inside the card's frame and never leak into webgipfel's own UI.

## Typography

**Display Font:** Inter Tight (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Inter Tight (same family)

**Character:** one tight grotesk carries everything. Hierarchy comes from size and tracking, not from changing font or adding many weights. The font is self-hosted (`assets/fonts/inter-tight-latin.woff2`, variable 100–900, `font-display: swap`) and preloaded.

### Hierarchy
- **Display** (500, 6rem mobile → min(16rem, 10vw), line-height 0.95, -0.03em): the hero headline only. The second line is set in Alpine Blue.
- **Headline** (500, 4.5rem mobile → min(8rem, 5vw), line-height 1, -0.02em): section titles such as "Projekte", centred and large on the homepage.
- **Intro quote** (400, 3.2rem → 5.6rem, line-height 1.05, -0.02em): the large "Über uns" statement; emphasised words in Alpine Blue.
- **Title** (400–500, 3.2–4.2rem, line-height 1.1): service titles, card titles, login title.
- **Lead** (400–500, 2.4rem, line-height 1.2–1.35): hero intro and lead paragraphs.
- **Body** (400, 1.8–2rem, line-height 1.4–1.5): running text, maximum about 56–80rem wide.
- **Label** (400–600, 1.5rem, uppercase): eyebrows, tags, form labels, tile captions, numbered section markers ("01 — Über uns").

### Named Rules
**The Tight Top Rule.** The bigger the type, the tighter the tracking (-0.01em at title size up to -0.03em/-0.05em at display and key-figure size). Body text keeps neutral or slightly wide tracking.

**The Label Whisper Rule.** Uppercase is reserved for small labels (1.5rem). Headlines are never set in uppercase.

## Layout

- **Container:** max 160rem, centred. Side gutters are 2rem on mobile and 4rem from 768px.
- **Grid:** 12 columns from 768px with a 1.6rem gap. Below 768px everything stacks into a single column.
- **Section rhythm:** 8rem vertical padding on mobile and 10rem from 768px. Section heads sit 6–8rem above their content.
- **Breakpoints:** 768px (tablet/desktop switch, the main breakpoint) and 1024px (full navigation replaces the burger). 1600px fixes the root size.
- **Composition:** generous white space and large type. Long sticky scroll sequences (`.pin`, 220–280vh) pace key moments. "Wie wir arbeiten" scrolls horizontally on desktop and on mobile.
- The header is fixed. It turns to frosted white glass after scrolling and hides on scroll down.

## Elevation & Depth

The system is flat. Depth comes from tonal layering:
- white page
- mist tile
- Glacier Ice accent tile
- Night Ridge panel

Motion (rising tiles, perspective tilt, clip-path reveals) adds a sense of depth during scroll. Shadows are almost absent from webgipfel's own UI.

### Shadow Vocabulary
- **Stack lift** (`box-shadow: 0 -1.2rem 3rem -1.6rem rgba(14,26,43,.25)`): only on mobile, where key-figure tiles stack on top of each other.
- **Hero text halo** (`text-shadow: 0 0 1.2rem rgba(255,255,255,.95), 0 0 3rem rgba(255,255,255,.8), 0 0 6rem rgba(255,255,255,.6)`): keeps the hero intro readable on the mountain photo.
- **Frosted glass** (`backdrop-filter: blur(12px) saturate(300%)` over white at 95%): the scrolled header. Softer blur (8px) is used for glass buttons and the login backdrop.

### Named Rules
**The Flat Summit Rule.** Surfaces are flat at rest. Separate layers by tone, not by shadow; a shadow is only allowed where elements physically overlap.

## Shapes

Soft and precise:
- **Pills** (`rounded.pill`): all buttons, tags and chips.
- **Circles** (50%): round icon buttons, the burger, the close buttons and the login badge.
- **Gently rounded rectangles** (`rounded.md`, 2rem): tiles, service rows, project-card previews and the login dialog. Key-figure tiles use a slightly tighter 1.2rem.
- **Large radii** (`rounded.panel`, 8rem): the dark panels and the bottom of the hero (3rem on mobile). They make the page feel like stacked sheets.
- **Lines:** 1px, in currentColor or Ink at 10–18%. Used for the FAQ dividers, link underlines and form-field underlines.

## Components

### Buttons
Soft pills with a liquid fill: precise, never loud.
- **Shape:** pill (`rounded.pill`), height 5.8rem, horizontal padding 3rem, 2rem/500 text.
- **Primary:** Alpine Blue with white text.
- **Hover (pointer: fine only):**
  - A mist layer rises from the bottom with a curved top edge that flattens (0.5s, `cubic-bezier(.4,0,0,1)`).
  - The text turns Alpine Blue and the label rolls up to a duplicate of itself (0.8s expo out).
  - The button stretches very slightly (`scaleX(1.02)`) with an elastic ease.
- **Variants:**
  - Inverse: white with blue text, used on blue or dark surfaces.
  - Secondary: mist with Ink text.
  - Glass: 70% white with an 8px blur, used on the hero photo.
  - Outline: 1px blue inset ring that fills blue on hover.
  - XS: 3.8rem, uppercase label.
- **Focus:** a 2px outline in Alpine Blue, 4px offset (white on dark panels).

### Text Links
- **Underline link:** a 1px line that retracts to the right on hover (1s, `cubic-bezier(.19,1,.22,1)`).
- **Roll link:** the label rolls up to a copy of itself on hover. Used in the navigation.

### Chips / Tags
- **Style:** pill, 3.6rem high, 1px currentColor border, uppercase 1.5rem label.
- **Secondary:** a mist fill with no border.

### Cards / Containers
- **Tiles:** `rounded.md`, mist-50 (or Glacier Ice, mist-100, or Alpine Blue for an emphasised tile), padding 3rem → 4rem, flat.
- **Key-figure tiles:** come in ice, grey and sand variants. Each has its own soft accent, animated bars and a 50-cell grid, and rises into place during the scroll pin.
- **Service rows:** mist rows that expand like an accordion on hover. A coloured glow and illustration fade in from the right.
- **Dark panel:** Night Ridge with an 8rem top radius and white text. Holds the FAQ, contact and closing sections.

### Inputs / Fields
- **Style:** no box, only a 1px bottom line. The label is small and uppercase above the field; the input text is lead size (2.4rem).
- **Focus:** the bottom line switches to full white on dark panels and to Alpine Blue on light dialogs.
- **Error:** a short German message in "Sie" form directly below the field.

### Navigation
- **Desktop (≥1024px):** wordmark left, roll links, a client login with a lock icon in Alpine Blue, and a primary "Projekt anfragen" pill.
- **Header:** transparent at the top. After scrolling it turns into frosted white glass and hides on scroll down.
- **Mobile and tablet (<1024px):** the XS "Projekt anfragen" pill stays visible next to the burger (shortened to "Anfragen" below 600px), so the next step is always one tap away. A round mist burger opens a full-screen white menu that reveals top-down (clip-path). Its links are 4.2rem tall.
- **Wordmark:** "web" in 400 weight, "gipfel" in 600, and a full stop in Alpine Blue, all lowercase.

### Project Card (signature)
The showcase of the site. Each card has:
- a portrait preview (365/420, `rounded.md`) containing a miniature showreel built in the client's own brand (device mock-ups, video, CSS 3D scenes);
- title and subtitle below.
Order on the homepage: Kontorhaus, SCHLOTZ, Isarwave, Ladehof (MAT Elektrotechnik archived in `archiv/referenz-mat.html`). Tags name the client's industry and the deliverable, never "Konzeptprojekt"; the subtitle reads "Sector · what the site does" in plain owner language. The reel plays on hover on desktop. On touch it plays while at least 60% of the card is visible and stops the moment it leaves. Media is lazy-loaded, and posters are WebP.

### Enquiry Tile
The cell after the last project in the grid: an Alpine Blue tile (`rounded.md`, same 365/420 ratio as a card preview on desktop) with the two founders' round avatars at the top, a large question headline, one line on what happens next ("innerhalb von 24 Stunden") and an inverse pill button. On mobile it follows the last project as a mid-page call to action.

### Closing Panel
Centred on Night Ridge: headline (second line in muted white), the two founders' avatars overlapping with their names and the 24-hour reply promise, then the inverse "Projekt anfragen" pill next to the plain email link. No phone number.

### Alpine Panorama Footer (signature)
An illustrated, detailed mountain range with a 3D Frauenkirche. The sky fades smoothly into the page with no hard edge. It closes every page and repeats the hero's summit image as a drawing.

## Do's and Don'ts

### Do:
- **Do** keep Alpine Blue (#1f5aa6) as the only accent on webgipfel's own UI, and use it for actions and single emphasised words.
- **Do** set every text in Inter Tight, with negative tracking on headlines (-0.02em to -0.03em).
- **Do** use pill buttons (5.8rem high) with the rising-fill and rolling-label hover, and only under `pointer: fine`.
- **Do** separate layers with tone (white → mist → Glacier Ice → Night Ridge) instead of shadows.
- **Do** give every scroll or hover animation a `prefers-reduced-motion` fallback and keep touch targets at least 44px.
- **Do** let reference cards speak in the client's own brand inside their rounded 2rem frame.

### Don't:
- **Don't** add new accent colours, gradients or decorative colour to webgipfel's own surfaces.
- **Don't** add drop shadows to cards, tiles or buttons at rest.
- **Don't** set headlines in uppercase or add a second typeface.
- **Don't** play card animations or videos automatically on desktop; they start on hover only.
- **Don't** use hard edges where the system uses soft ones: no square buttons, no sharp-cornered tiles.
