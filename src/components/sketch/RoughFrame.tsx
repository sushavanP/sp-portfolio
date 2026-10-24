"use client";

import { useRef } from "react";
import type { Options } from "roughjs/bin/core";
import { gen, roughDefaults, toSketch } from "@/lib/sketch";
import { useRough } from "./useRough";

/** A rough.js rectangle drawn around its parent element (§7.2). The parent must be positioned. */
export default function RoughFrame({ seed, inset = 3, options }: { seed: number; inset?: number; options?: Options }) {
  const ref = useRef<SVGSVGElement>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const state = useRough(
    hostRef,
    ({ w, h }) => toSketch(gen.rectangle(inset, inset, w - inset * 2, h - inset * 2, { ...roughDefaults, seed, ...options })),
    [seed],
  );

  return (
    <svg
      ref={(el) => {
        ref.current = el;
        hostRef.current = el?.parentElement ?? null;
      }}
      className="rough-frame"
      aria-hidden="true"
      focusable="false"
      viewBox={state ? `0 0 ${state.size.w} ${state.size.h}` : undefined}
    >
      {state?.paths.map((p, i) => (
        <path key={i} d={p.d} className={`rough-${p.kind}`} />
      ))}
    </svg>
  );
}
