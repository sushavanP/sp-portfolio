"use client";

import Lenis from "lenis";
import { annotateMark, gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

// All page motion (DESIGN.md §6, §8). Rendered last, so every section is in
// the DOM. With reduced motion nothing here runs: content is visible
// immediately, no Lenis, no pinning (§6.7).
export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, (ctx) => {
      const marks: { remove: () => void }[] = [];
      const showMarks = (scope: Element) =>
        scope.querySelectorAll<HTMLElement>(".mark").forEach((el) => {
          const a = annotateMark(el, true);
          a.show();
          marks.push(a);
        });

      // ---------- Lenis, synced to GSAP's ticker (§6.1) ----------
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -64 } });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // ---------- Nav: hides on scroll down, shows on scroll up (§9) ----------
      const nav = document.querySelector<HTMLElement>(".nav")!;
      let navHidden = false;
      const setNav = (hide: boolean) => {
        if (hide === navHidden) return;
        navHidden = hide;
        gsap.to(nav, { yPercent: hide ? -100 : 0, duration: 0.6, ease: "power3.out", overwrite: true });
      };
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setNav(self.direction === 1 && self.scroll() > 160 && !nav.contains(document.activeElement)),
      });
      const onFocus = () => setNav(false);
      nav.addEventListener("focusin", onFocus);

      // ---------- Pull-out reveals: every piece slides up out of its slot, tied to scroll ----------
      // Small pieces travel their full height; tall ones are capped at 60px
      // (§6 "Distance") and fade in instead
      const MAX_TRAVEL = 60;
      const scrub = 0.6;
      const travel = (el: HTMLElement) => Math.min(el.offsetHeight * 1.05, MAX_TRAVEL);
      const fades = (el: HTMLElement) => (el.offsetHeight * 1.05 > MAX_TRAVEL ? 0 : 1);
      const pullVars = {
        y: (_: number, el: HTMLElement) => travel(el),
        opacity: (_: number, el: HTMLElement) => fades(el),
        ease: "none",
      };

      // Everything that splits text waits for fonts, so lines are measured once
      const setup = () => {
        // ---------- Hero: on load, since it's already in view (§8.1) ----------
        const hero = document.querySelector<HTMLElement>(".hero")!;
        const heroName = SplitText.create(".hero__name", { type: "lines", mask: "lines" });
        gsap.set(".hero > *", { visibility: "visible" });
        gsap
          .timeline({ delay: 0.1, defaults: { ease: "power3.out" } })
          .from(heroName.lines, { yPercent: 110, duration: 1, stagger: 0.1 })
          .from(".hero__kicker .pull__in", { yPercent: 105, duration: 0.8 }, "-=0.8")
          .from(".hero__tagline", { y: 32, opacity: 0, duration: 0.8 }, "-=0.55")
          .from(".hero .tags .pull__in", { yPercent: 105, duration: 0.7, stagger: 0.08 }, "-=0.5")
          .from(".hero__ctas > *", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.5")
          .add(() => {
            heroName.revert();
            showMarks(hero);
          }, "-=0.3")
          .from(".hero__annotation", { opacity: 0, y: 12, duration: 0.8 }, "+=0.3");

        // ---------- Section headlines: masked line reveal (§6.2), scrubbed ----------
        gsap.utils.toArray<HTMLElement>(".section .reveal-heading, .closing .reveal-heading").forEach((h) => {
          let own: ReturnType<typeof annotateMark>[] = [];
          let tween: gsap.core.Tween | undefined;
          SplitText.create(h, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (split) => {
              // On a re-split (resize), drop the old scroll tween and highlights first,
              // so a stale callback can't toggle the new ones
              tween?.scrollTrigger?.kill();
              tween?.kill();
              own.forEach((a) => a.remove());
              // A re-split clones old highlight SVGs along with the text; clear them too
              h.querySelectorAll(".rough-annotation").forEach((svg) => svg.remove());
              // SplitText leaves an empty clone of a wrapper at a line break; skip those
              own = Array.from(h.querySelectorAll<HTMLElement>(".mark"))
                .filter((el) => el.textContent?.trim())
                .map((el) => annotateMark(el, true));
              marks.push(...own);
              let drawn = false;
              const setDrawn = (on: boolean) => {
                if (on === drawn) return;
                drawn = on;
                // Unclip the line masks while a highlight is out, so a circle isn't cut off
                split.masks.forEach((m) => ((m as HTMLElement).style.overflow = on ? "visible" : "clip"));
                own.forEach((a) => (on ? a.show() : a.hide()));
              };
              tween = gsap.from(split.lines, {
                yPercent: 110,
                ease: "none",
                stagger: 0.15,
                scrollTrigger: {
                  trigger: h,
                  start: "top 92%",
                  end: "top 62%",
                  scrub,
                  onUpdate: (self) => setDrawn(self.progress > 0.98),
                },
              });
              return tween;
            },
          });
        });

        const handled = new Set<Element>();

        // ---------- Experience cards: the card rises, then its pieces come out one by one (§8.2) ----------
        gsap.utils.toArray<HTMLElement>(".job").forEach((job) => {
          const card = job.querySelector("article")!;
          const pieces = gsap.utils.toArray<HTMLElement>(card.querySelectorAll(".pull__in"));
          pieces.forEach((p) => handled.add(p));
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: job, start: "top 92%", end: "top 35%", scrub, invalidateOnRefresh: true },
            })
            .from(card, { y: MAX_TRAVEL, opacity: 0, duration: 1 })
            .from(pieces, { ...pullVars, duration: 0.8, stagger: 0.3 }, 0.6);
        });

        // ---------- Rows (contact links): left to right ----------
        gsap.utils.toArray<HTMLElement>(".section .pull-row, .closing .pull-row").forEach((row) => {
          const items = gsap.utils.toArray<HTMLElement>(row.querySelectorAll(".pull__in")).filter((i) => !handled.has(i));
          if (!items.length) return;
          items.forEach((i) => handled.add(i));
          gsap.from(items, {
            ...pullVars,
            stagger: 0.35,
            scrollTrigger: { trigger: row, start: "top 94%", end: "top 70%", scrub, invalidateOnRefresh: true },
          });
        });

        // ---------- Everything else: labels, paragraphs, sign-off, each on its own ----------
        gsap.utils
          .toArray<HTMLElement>(".section .pull__in, .closing .pull__in")
          .filter((el) => !handled.has(el))
          .forEach((el) => {
            gsap.from(el, {
              ...pullVars,
              scrollTrigger: { trigger: el.parentElement, start: "top 94%", end: "top 74%", scrub, invalidateOnRefresh: true },
            });
          });

        // Margin notes drift in with the scroll too
        gsap.utils.toArray<HTMLElement>(".job__annotation, .closing__annotation").forEach((n) => {
          gsap.from(n, { y: 24, opacity: 0, ease: "none", scrollTrigger: { trigger: n, start: "top 92%", end: "top 70%", scrub } });
        });

        // ---------- Doodles: gentle parallax (§6.6) ----------
        gsap.utils.toArray<SVGElement>(".doodle").forEach((d) => {
          gsap.to(d, { yPercent: -15, ease: "none", scrollTrigger: { trigger: d.parentElement, scrub: true } });
        });

        valley();
        ScrollTrigger.refresh();
      };
      let live = true;
      // ctx.add records the tweens so mm.revert() cleans them up
      document.fonts.ready.then(() => live && ctx.add(setup));

      return () => {
        live = false;
        marks.forEach((m) => m.remove());
        nav.removeEventListener("focusin", onFocus);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    });

    return () => mm.revert();
  });

  return null;
}

// ---------- Closing illustration (§8.1) ----------
function valley() {
  const frame = document.querySelector<HTMLElement>(".valley__frame");
  if (!frame) return;

  // The watercolour rises out of the paper as it scrolls in, then drifts a
  // little slower than the page (gentle parallax)
  gsap.from(frame, {
    y: 60,
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: ".valley", start: "top bottom", end: "top 55%", scrub: 0.6 },
  });
  gsap.fromTo(
    ".valley__canvas",
    { yPercent: -4 },
    { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".valley", start: "top bottom", end: "bottom bottom", scrub: true } },
  );
}
