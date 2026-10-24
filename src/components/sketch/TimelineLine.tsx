"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { gen, roughDefaults, seeded, smoothPath, toSketch, type Pt, type SketchPath } from "@/lib/sketch";
import { useRough } from "./useRough";

const X = 12;

/**
 * The hand-drawn vertical line beside the Experience cards (§8.2). One
 * continuous path (`.timeline-path`) so Pass 4 can draw it with
 * stroke-dashoffset, plus a sketched node at each role. It draws itself as
 * you scroll (§6.5), so it owns its animation: the path only exists once
 * measured, and is redrawn on resize.
 */
export default function TimelineLine() {
  const hostRef = useRef<HTMLElement | null>(null);
  const state = useRough(
    hostRef,
    ({ h }) => {
      const host = hostRef.current!;
      const rand = seeded(7);
      const pts: Pt[] = [];
      for (let y = 0; y <= h; y += 36) pts.push([X + (rand() - 0.5) * 5, y]);
      pts.push([X, h]);
      const line: SketchPath = { d: smoothPath(pts), kind: "outline" };
      const nodes = Array.from(host.querySelectorAll<HTMLElement>(".job")).flatMap((job, i) =>
        toSketch(gen.circle(X, job.offsetTop + 40, 14, { ...roughDefaults, seed: 30 + i, fill: "solid", fillStyle: "solid" })).map(
          (p) => ({ ...p, job: i }),
        ),
      );
      return [line, ...nodes];
    },
    [],
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  useGSAP(
    () => {
      if (!state) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const svg = svgRef.current!;
        const path = svg.querySelector<SVGPathElement>(".timeline-path")!;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: svg.parentElement, start: "top 60%", end: "bottom 60%", scrub: true },
        });
        svg.parentElement!.querySelectorAll<HTMLElement>(".job").forEach((job, i) => {
          // Each node appears with its card, tied to scroll like the card
          gsap.from(svg.querySelectorAll(`[data-job="${i}"]`), {
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: job, start: "top 92%", end: "top 70%", scrub: 0.6 },
          });
        });
      });
      return () => mm.revert();
    },
    { dependencies: [state] },
  );

  return (
    <svg
      ref={(el) => {
        svgRef.current = el;
        hostRef.current = el?.parentElement ?? null;
      }}
      className="timeline-line"
      aria-hidden="true"
      focusable="false"
      viewBox={state ? `0 0 ${2 * X} ${state.size.h}` : undefined}
      style={state ? { height: state.size.h } : undefined}
    >
      {state?.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          data-job={"job" in p ? (p.job as number) : undefined}
          className={i === 0 ? "timeline-path" : `timeline-node rough-${p.kind}`}
        />
      ))}
    </svg>
  );
}
