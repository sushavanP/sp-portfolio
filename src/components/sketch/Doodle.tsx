import { brush, type Pt } from "@/lib/sketch";

// Small monoline doodles (§7.6), drawn as brush strokes at build time.
const shapes: Record<string, Pt[][]> = {
  star: [
    [[20, 2], [24, 16], [38, 18], [26, 26], [31, 40], [20, 31], [9, 40], [13, 26], [2, 18], [16, 16], [20, 3]],
  ],
  squiggle: [
    [[2, 20], [10, 8], [18, 20], [26, 32], [34, 20], [42, 8], [50, 20], [58, 32], [66, 20], [74, 8], [80, 16]],
  ],
  cup: [
    [[8, 16], [10, 40], [14, 44], [30, 44], [34, 40], [36, 16], [8, 16]],
    [[36, 22], [44, 22], [46, 28], [42, 34], [35, 34]],
    [[16, 10], [14, 4], [17, 0]],
    [[25, 10], [23, 4], [26, 0]],
  ],
  spark: [
    [[20, 2], [20, 38]],
    [[2, 20], [38, 20]],
    [[8, 8], [32, 32]],
    [[32, 8], [8, 32]],
  ],
};

const boxes: Record<string, string> = { star: "0 0 40 42", squiggle: "0 0 82 40", cup: "0 0 48 46", spark: "0 0 40 40" };

export default function Doodle({ shape, className = "" }: { shape: keyof typeof shapes; className?: string }) {
  return (
    <svg className={`doodle ${className}`} viewBox={boxes[shape]} aria-hidden="true" focusable="false">
      {shapes[shape].map((pts, i) => (
        <path key={i} d={brush(pts, 2.2)} />
      ))}
    </svg>
  );
}
