"use client";

import { useState } from "react";
import RoughFrame from "./RoughFrame";

/** Text button with a rough outline that re-sketches with a new seed on hover (§9). */
export default function SketchButton({
  href,
  seed,
  primary = false,
  children,
}: {
  href: string;
  seed: number;
  primary?: boolean;
  children: React.ReactNode;
}) {
  const [s, setS] = useState(seed);
  return (
    <a className={`btn${primary ? " btn--primary" : ""}`} href={href} onMouseEnter={() => setS((v) => v + 1)}>
      {children}
      <RoughFrame seed={s} inset={2} options={{ roughness: 1.6 }} />
    </a>
  );
}
