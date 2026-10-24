"use client";

import { useEffect, useRef } from "react";
import type { RoughAnnotationType } from "rough-notation/lib/model";
import { annotateMark, prefersMotion } from "@/lib/gsap";

/**
 * Hand-drawn highlight on a key word (§7.3). With motion allowed, Motion.tsx
 * draws it once its headline has revealed (SplitText rebuilds the heading's
 * DOM, so the highlight can't be attached any earlier). With reduced motion
 * it is drawn here, immediately and without animation.
 */
export default function Mark({
  type,
  padding,
  children,
}: {
  type: Extract<RoughAnnotationType, "underline" | "circle" | "bracket">;
  padding?: number | [number, number];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || prefersMotion()) return;
    const a = annotateMark(ref.current, false);
    a.show();
    return () => a.remove();
  }, []);

  return (
    <span ref={ref} className="mark" data-type={type} data-padding={padding ? JSON.stringify(padding) : undefined}>
      {children}
    </span>
  );
}
