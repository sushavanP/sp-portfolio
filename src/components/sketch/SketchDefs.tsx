// Paper grain (§7.1) and the shared wobble filter (§7.4). Rendered once.
export default function SketchDefs() {
  return (
    <>
      <svg className="sketch-defs" aria-hidden="true" focusable="false">
        <filter id="wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
        {/* "Multiply by --paper" (#f4efe6) for the closing watercolour: white becomes
            paper. A filter rather than mix-blend-mode, because the mask and scroll
            transforms around the image would isolate a blend from the page */}
        <filter id="paper-multiply" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.957 0 0 0 0  0 0.937 0 0 0  0 0 0.902 0 0  0 0 0 1 0" />
        </filter>
        <filter id="wobble-soft">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </svg>
      <svg className="grain" aria-hidden="true" focusable="false">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </>
  );
}
