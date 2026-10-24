"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { annotate } from "rough-notation";
import type { RoughAnnotationConfig } from "rough-notation/lib/model";

// Registered once, at app entry (DESIGN.md §2)
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Every scroll animation lives behind this query (§6.7). */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersMotion() {
  return typeof window !== "undefined" && window.matchMedia(MOTION_OK).matches;
}

/**
 * Builds the rough-notation highlight for a `.mark` span from its data
 * attributes. Colour is `currentColor`, set to --accent in CSS, because
 * rough-notation writes it as an SVG attribute where var() doesn't resolve.
 */
export function annotateMark(el: HTMLElement, animate: boolean) {
  const type = el.dataset.type as RoughAnnotationConfig["type"];
  const padding = el.dataset.padding ? (JSON.parse(el.dataset.padding) as RoughAnnotationConfig["padding"]) : undefined;
  return annotate(el, {
    type,
    color: "currentColor",
    strokeWidth: type === "circle" ? 2 : 2.5,
    padding: padding ?? (type === "circle" ? [4, 7] : 2),
    iterations: type === "circle" ? 1 : 2,
    animate,
    animationDuration: 800,
  });
}
