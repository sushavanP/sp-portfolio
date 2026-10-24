// Pure drawing helpers. No DOM, so they run at build time in server
// components as well as in the browser.
import rough from "roughjs";
import type { Drawable, Options } from "roughjs/bin/core";
import { getStroke } from "perfect-freehand";

export type Pt = [number, number];

const generator = rough.generator();
export const gen = generator;

/** Trims path numbers to one decimal so the inline SVG stays small. */
export function roundD(d: string) {
  return d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10));
}

// "outline" is the ink stroke, "hatch" the hachure/zigzag lines, "solid" a flat fill
export type SketchPath = { d: string; kind: "outline" | "hatch" | "solid" };

/** Turns a rough.js drawable into plain path strings; colours come from CSS classes,
    because SVG presentation attributes can't read CSS variables. */
export function toSketch(drawable: Drawable): SketchPath[] {
  return drawable.sets.map((set) => ({
    d: generator.opsToPath(set, 1),
    kind: set.type === "path" ? "outline" : set.type === "fillSketch" ? "hatch" : "solid",
  }));
}

/** Smooth Catmull-Rom curve through points, as an SVG path. */
export function smoothPath(points: Pt[], closed = false) {
  const pts = closed ? [points[points.length - 1], ...points, points[0], points[1]] : [points[0], ...points, points[points.length - 1]];
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return roundD(closed ? d + " Z" : d);
}

/** Brush-like filled outline for a freehand stroke (perfect-freehand). */
export function brush(points: Pt[], size = 3) {
  const outline = getStroke(points, { size, thinning: 0.55, smoothing: 0.6, streamline: 0.4, simulatePressure: true });
  if (!outline.length) return "";
  const d = outline.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...outline[0], "Q"] as (string | number)[],
  );
  return roundD(d.join(" ") + " Z");
}

/** Small seeded PRNG so hand-made wobble is the same on every render. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const roughDefaults: Options = { roughness: 1.4, bowing: 1, strokeWidth: 1.5 };
