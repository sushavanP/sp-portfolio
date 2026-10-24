import { brush, type Pt } from "@/lib/sketch";

// Hand-drawn arrows for margin notes (§7.5), as brush strokes made at build time.
const arrows: Record<string, { box: string; strokes: Pt[][] }> = {
  left: {
    box: "0 0 84 44",
    strokes: [
      [[80, 10], [60, 4], [34, 10], [8, 30]],
      [[8, 30], [11, 16]],
      [[8, 30], [22, 31]],
    ],
  },
  right: {
    box: "0 0 84 44",
    strokes: [
      [[4, 10], [24, 4], [50, 10], [76, 30]],
      [[76, 30], [73, 16]],
      [[76, 30], [62, 31]],
    ],
  },
  down: {
    box: "0 0 40 72",
    strokes: [
      [[18, 2], [25, 22], [16, 44], [21, 66]],
      [[21, 66], [11, 56]],
      [[21, 66], [30, 56]],
    ],
  },
  downLeft: {
    box: "0 0 72 60",
    strokes: [
      [[66, 4], [58, 26], [36, 44], [8, 52]],
      [[8, 52], [17, 42]],
      [[8, 52], [20, 58]],
    ],
  },
};

export default function Note({
  children,
  arrow,
  tone = "accent",
  className = "",
}: {
  children: React.ReactNode;
  arrow: keyof typeof arrows;
  tone?: "accent" | "accent-2";
  className?: string;
}) {
  const a = arrows[arrow];
  return (
    <p className={`annotation annotation--${tone} annotation--${arrow} ${className}`}>
      <span className="annotation__text">{children}</span>
      <svg className="annotation__arrow" viewBox={a.box} aria-hidden="true" focusable="false">
        {a.strokes.map((pts, i) => (
          <path key={i} d={brush(pts, 2.6)} />
        ))}
      </svg>
    </p>
  );
}
