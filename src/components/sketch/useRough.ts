"use client";

import { type RefObject, useEffect, useState } from "react";
import type { SketchPath } from "@/lib/sketch";

type Size = { w: number; h: number };

/**
 * Measures `hostRef` and re-runs `draw` on resize (debounced, §7.2).
 * Adds `is-sketched` to the host so CSS can drop its no-JS fallback border.
 */
export function useRough(
  hostRef: RefObject<HTMLElement | null>,
  draw: (size: Size) => SketchPath[],
  deps: unknown[],
) {
  const [state, setState] = useState<{ size: Size; paths: SketchPath[] } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const render = () => {
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      if (!w || !h) return;
      const size = { w, h };
      setState({ size, paths: draw(size) });
      host.classList.add("is-sketched");
    };
    render();
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(render, 120);
    });
    ro.observe(host);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
