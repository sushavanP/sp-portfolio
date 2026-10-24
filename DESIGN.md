# DESIGN.md: Portfolio Design Language

> Read this file before writing any UI code. Every visual decision should trace back to something here.
> If a choice isn't covered, pick the option that best fits the **Mood** section and note it in your summary.

---

## 1. Mood & Direction

**One line:** an engineer's sketchbook. Precise, editorial typography laid over warm paper, with hand-drawn annotations in the margins, like notes scribbled on a well-designed technical document.

- Warm, confident, a little playful; never corporate, never "SaaS landing page"
- Contrast is the core idea: **crisp type + rough, hand-drawn marks**
- Motion is calm and deliberate: things *settle* into place, they don't bounce or spin
- One **signature moment** per page that people remember (see §8)

**References for feel (not to copy):** indie studio portfolios, editorial magazine layouts, Excalidraw sketches, annotated engineering notebooks.

---

## 2. Tech Stack for the Visual Layer

| Purpose | Library | Notes |
|---|---|---|
| Scroll animation | `gsap` + `ScrollTrigger` | Core of all scroll-driven motion |
| Text reveals | `gsap/SplitText` | Split headlines into lines/words for masked reveals |
| React integration | `@gsap/react` (`useGSAP`) | Auto-cleans animations on unmount; never use raw `useEffect` for GSAP |
| Smooth scrolling | `lenis` | Synced to GSAP's ticker (see §6.1) |
| Hand-drawn shapes | `roughjs` | Sketchy boxes, lines, circles, dividers |
| Hand-drawn highlights | `rough-notation` | Animated underlines, circles, brackets on key words |
| Organic strokes | `perfect-freehand` | Brush-like SVG paths (signature, doodles) |
| Grain & wobble | SVG filters (`feTurbulence`, `feDisplacementMap`) | No library needed |

```bash
npm i gsap @gsap/react lenis roughjs rough-notation perfect-freehand
```

Register GSAP plugins once, at app entry:

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
```

---

## 3. Color

All colors are CSS custom properties. **No raw hex values inside components.**

```css
:root {
  --paper:      #f4efe6;  /* page background, warm off-white */
  --paper-deep: #ebe4d6;  /* cards, alternate sections */
  --ink:        #1d1b18;  /* primary text, strokes */
  --ink-soft:   #4a4640;  /* body text */
  --muted:      #8a8378;  /* captions, metadata */
  --accent:     #d9481e;  /* burnt orange: links, highlights, one key mark per section */
  --accent-2:   #2f5d50;  /* deep green: secondary annotations, sparingly */
  --river:      #8fb3c4;  /* muted river blue: unused since §8.1 became the Kolkata watercolour */
  --line:       rgba(29, 27, 24, 0.15);
}
/* Light only. The dark palette was removed on 2026-10-25 at the owner's request:
   no theme toggle, and the site ignores a device's dark setting. */
```

Rules:
- Accent is a **spice**, not a sauce: one or two accent marks per viewport, max
- Hand-drawn elements use `--ink` or `--accent`; never gradients
- No pure `#000` or `#fff` anywhere

---

## 4. Typography

| Role | Font | Usage |
|---|---|---|
| Display | **Fraunces** (variable) | Hero, section titles. Use `opsz` 144 and `SOFT` 50–100 at large sizes |
| Body | **Bricolage Grotesque** (variable, `opsz` auto) | Paragraphs, UI, nav. Replaced Instrument Sans on 2026-10-25 at the owner's request (too plain) |
| Mono | **JetBrains Mono** | Tech stack tags, dates, code, small labels |
| Handwritten | **Caveat** | Margin annotations and arrows-with-notes only. Never body copy |

Scale (fluid, using `clamp`):

```css
--fs-hero:  clamp(3.5rem, 9vw, 8.5rem);   /* line-height 0.92, letter-spacing -0.03em */
--fs-h2:    clamp(2.25rem, 5vw, 4.5rem);  /* line-height 1.0 */
--fs-h3:    clamp(1.375rem, 2.2vw, 1.75rem);
--fs-body:  1.0625rem;                     /* 17px, line-height 1.65 */
--fs-small: 0.875rem;
--fs-label: 0.75rem;                       /* mono, uppercase, letter-spacing 0.08em */
```

- Body text max width: **65ch**
- Headlines can break the grid and run large; that's the editorial feel
- Use italics of Fraunces for one emphasized word in a headline, sometimes paired with a rough-notation underline

---

## 5. Layout & Spacing

- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192
- **Grid:** 12 columns, 24px gutter, max content width 1280px, side padding `clamp(16px, 5vw, 64px)`
- **Asymmetry over symmetry:** offset text blocks (e.g., columns 2–8), let images bleed to one edge
- **Sections breathe:** minimum `20vh` vertical padding between major sections
- **Margin column:** reserve space on wide screens for hand-written annotations beside content
- Mobile (≤ 768px): single column, annotations move inline below their target, hero type still big

---

## 6. Motion: GSAP Scroll Animations

### Principles
- **Eases:** `power3.out` for entrances, `expo.inOut` for transitions, `none` for scrubbed timelines
- **Durations:** 0.6s to 1.2s. Stagger: 0.06s to 0.1s
- **Distance:** elements travel 24–60px, never from off-screen
- **Nothing bounces, elastics, or rotates for fun.** Motion should feel like ink settling
- Animate only `transform` and `opacity` (plus SVG `stroke-dashoffset`), never layout properties

### 6.1 Lenis smooth scroll, synced with GSAP

```js
import Lenis from "lenis";
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 6.2 Masked line reveal (all section headlines)

```js
useGSAP(() => {
  const split = SplitText.create(".reveal-heading", { type: "lines", mask: "lines" });
  gsap.from(split.lines, {
    yPercent: 110,
    duration: 1,
    ease: "power3.out",
    stagger: 0.08,
    scrollTrigger: { trigger: ".reveal-heading", start: "top 80%" },
  });
}, { scope: containerRef });
```

### 6.3 Fade-up for content blocks

```js
gsap.utils.toArray(".fade-up").forEach((el) => {
  gsap.from(el, {
    y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 85%" },
  });
});
```

### 6.4 Pinned horizontal scroll (Projects section)

```js
const track = document.querySelector(".projects-track");
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".projects",
    pin: true,
    scrub: 1,
    end: () => "+=" + track.scrollWidth,
    invalidateOnRefresh: true,
  },
});
```

### 6.5 Scroll-drawn SVG line (Experience timeline)

A hand-drawn vertical line that draws itself as the user scrolls through work history.

```js
const path = document.querySelector(".timeline-path");
const len = path.getTotalLength();
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
gsap.to(path, {
  strokeDashoffset: 0,
  ease: "none",
  scrollTrigger: { trigger: ".experience", start: "top 60%", end: "bottom 60%", scrub: true },
});
```

### 6.6 Subtle parallax
- Background doodles move at `yPercent: -15` with `scrub: true`
- Never parallax text that needs to be read

### 6.7 Reduced motion (mandatory)

```js
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // all scroll animations go here
});
// with reduced motion: content is visible immediately, no Lenis, no pinning
```

---

## 7. Hand-Drawn & Sketched Layer

### 7.1 Paper grain background
Fixed, full-viewport SVG noise overlay at low opacity:

```html
<svg class="grain" aria-hidden="true">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)"/>
</svg>
```
```css
.grain { position: fixed; inset: 0; width: 100%; height: 100%;
         opacity: 0.06; pointer-events: none; z-index: 100; mix-blend-mode: multiply; }
```

### 7.2 Sketchy shapes with rough.js
Use for: project card frames, section dividers, skill-group boxes, buttons on hover.

```js
import rough from "roughjs";
const rc = rough.svg(svgEl);
svgEl.appendChild(rc.rectangle(4, 4, w - 8, h - 8, {
  roughness: 1.4, bowing: 1, stroke: "var(--ink)", strokeWidth: 1.5,
}));
```
- `roughness` 1.2–1.8. Higher looks messy, lower looks fake
- Use a fixed `seed` per element so shapes don't redraw differently on every render
- Redraw on resize (debounced)

### 7.3 Animated highlights with rough-notation
Use on 1–2 key words per section, triggered when scrolled into view.

```js
import { annotate } from "rough-notation";
const a = annotate(el, { type: "underline", color: "var(--accent)", strokeWidth: 2, animationDuration: 800 });
ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => a.show() });
```
Types to use: `underline`, `circle`, `highlight` (at 30% opacity), `bracket`. Avoid `crossed-off` and `strike-through` unless it's a deliberate joke.

### 7.4 Wobbly strokes
Make any SVG line look hand-inked:

```html
<filter id="wobble">
  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3"/>
</filter>
```

### 7.5 Margin annotations
- Caveat font, `--accent` or `--accent-2`, rotated −2° to −4°
- Paired with a hand-drawn arrow (perfect-freehand or a rough.js curve) pointing at the content
- Examples: next to the FO app project, "shipped to thousands of drivers ↓"; next to the stack list, "my daily drivers"
- Max one annotation per section

### 7.6 Doodles
Small sketched icons (stars, squiggles, arrows, a coffee cup) scattered sparsely in section backgrounds, parallaxed gently. Monoline, `--ink` at 20–30% opacity.

---

## 8. Signature Moments

1. **Hero:** name in huge Fraunces, revealed line by line on load. A hand-drawn circle (rough-notation) loops around one word ("engineer" or "mobile"), and a Caveat annotation with an arrow says something human
2. **Experience:** a scroll-drawn sketchy timeline (§6.5). Each role's card fades up as the line reaches it, with dates in mono
3. **Projects:** pinned horizontal scroll (§6.4) through project cards framed in rough.js boxes that draw themselves in as they enter

4. **Closing section: Kolkata watercolour ending** (see §8.1)

Everything else stays quiet so these stand out.

### 8.1 Closing Section: Kolkata Watercolour Ending

> Changed 2026-10-25 at the owner's request: the hand-drawn "River Valley" SVG scene was replaced with a watercolour of Kolkata, and later the paper boat was removed. This deliberately overrides the earlier ink-and-flat-colour spec for this one section.

**Reference (inspiration only, never copy):** https://www.akoder.xyz. Its page ends on a rich illustrated strip below a centered italic quote and a small mono sign-off.

**Principles**
- **Quiet page, loud finale.** The whole site is restrained, so one rich illustration at the very end feels like a reward for scrolling
- **Blends into the paper, never a pasted photo.** No visible rectangle edge, no white border
- **Bleeds upward.** The image overlaps the text area by ~40px (`margin-top: -40px`, text on a higher `z-index`)

**The image:** a watercolour-and-ink sketch of Kolkata at dusk: Howrah Bridge over the Hooghly, Victoria Memorial in the foreground (`public/images/kolkata-1408.webp`, plus `kolkata-800.jpg` for ≤768px). It is content, so it carries real alt text.

**Blending**
- **Into the paper:** the image is multiplied by `--paper` with an SVG `feColorMatrix` filter (`#paper-multiply`), so its white paper becomes ours. Not `mix-blend-mode`: the mask and scroll transforms around the image isolate it from the page, which would stop a blend from reaching the background
- **Top edge:** a mask fades the sky into the page (transparent → opaque over the top ~22%)
- Grain overlay (§7.1) stays visible over everything

**Motion**
- **Rises out of the paper:** the image comes up 60px and fades in as it scrolls into view (scrubbed)
- **Gentle parallax:** the image drifts from `yPercent: -4` to `0` across the section (scrubbed)
- **Reduced motion:** the image renders in place, without the reveal or parallax


**Content above the image (centered, the one centered block on the site)**
- Closing line in large Fraunces italic, personal rather than a famous quote, e.g. "Let's build something that ships." One word gets a rough-notation `circle` in `--accent`
- Contact links (email, GitHub, LinkedIn) as text links per §9, in a single row
- A small mono sign-off in `--muted`, e.g. "Built in Bengaluru, with too much filter coffee."
- One Caveat annotation, "send me a message", beside the email link with an arrow pointing at it (above the links on mobile)

**Build notes**
- The image sits in a "canvas" box with its own aspect ratio (1408×768); the frame crops it and the parallax moves the canvas
- Desktop: full width up to 1600px at the image's aspect ratio. Mobile: a 340px-tall crop starting at x≈120, so the river's left bank and the whole bridge stay in view
- Lazy-loaded; the phone version is the 800px JPEG

---

## 9. Components

- **Buttons:** text + rough.js outline that redraws with a new seed on hover (a subtle "re-sketch"). Solid `--ink` fill for primary
- **Links:** `--ink` text, `--accent` underline that grows from left on hover (`transform: scaleX`)
- **Tags (tech stack):** mono, uppercase, `--label` size, 1px `--line` border, rounded 999px
- **Cards:** `--paper-deep` background, rough.js frame, no drop shadows
- **Nav:** minimal, fixed top; hides on scroll down, shows on scroll up (ScrollTrigger `onUpdate` direction)
- **Cursor:** default system cursor. No custom cursor gimmicks

---

## 10. Never Do This

- ❌ Inter, Roboto, Arial, Poppins, or system-ui as a display font
- ❌ Purple/blue gradients, glassmorphism, neon glows
- ❌ Drop shadows on cards; heavy border-radius everywhere
- ❌ Emoji as icons
- ❌ Generic "3 feature cards in a row" sections
- ❌ Centered-everything layouts
- ❌ Bounce, elastic, spin, or typewriter effects
- ❌ Animating `width`, `height`, `top`, `left`, or `margin`
- ❌ Scroll-jacking that fights the user, or pinned sections longer than ~3 viewports
- ❌ Hand-drawn style on body text or UI that needs to be read quickly

---

## 11. Performance & Accessibility

- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95
- Self-host or `font-display: swap` all fonts; preload the display font
- All decorative SVGs get `aria-hidden="true"`
- Text contrast meets WCAG AA (light theme only)
- Content must be fully readable with JavaScript disabled; animations only *enhance*
- Call `ScrollTrigger.refresh()` after fonts and images load
- Kill all ScrollTriggers on route change (`useGSAP` handles this when scoped)

---

## 12. Workflow for Claude

1. Before coding, state in 3 sentences the direction you're committing to, plus how the signature moments will work
2. Build in passes: **structure & content → typography & spacing → hand-drawn layer → motion**. Don't do everything in one pass
3. After each pass, screenshot at **1440px** and **390px**, compare against this file, and fix the top three issues
4. Test with `prefers-reduced-motion: reduce` enabled
5. Summarize any decision you made that this file didn't cover
