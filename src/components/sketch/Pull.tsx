// A "slot" for the scroll-tied pull-out reveal: the outer element clips, the
// inner one is what Motion.tsx slides up out of it. With JS off or reduced
// motion it's just a plain wrapper.
type Outer = "p" | "li" | "div" | "header";

export default function Pull({
  as: Tag = "div",
  className = "",
  innerClassName = "",
  children,
}: {
  as?: Outer;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  // A <p> can only hold phrasing content, so its inner wrapper is a span
  const Inner = Tag === "p" ? "span" : "div";
  return (
    <Tag className={`pull ${className}`}>
      <Inner className={`pull__in ${innerClassName}`}>{children}</Inner>
    </Tag>
  );
}
