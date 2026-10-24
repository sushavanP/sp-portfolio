// The closing illustration (DESIGN.md §8.1): a watercolour of Kolkata at
// dusk, blended into the paper. The image sits in a canvas box with its own
// aspect ratio; the frame crops it, and the parallax moves the canvas.
const W = 1408;
const H = 768;

export default function Valley() {
  return (
    <div className="valley">
      <div className="valley__frame">
        <div className="valley__canvas">
          <picture>
            <source media="(max-width: 768px)" srcSet="/images/kolkata-800.jpg" />
            <img
              className="valley__img"
              src="/images/kolkata-1408.webp"
              width={W}
              height={H}
              loading="lazy"
              decoding="async"
              alt="Watercolour sketch of Kolkata at dusk: Howrah Bridge over the Hooghly, with Victoria Memorial in the foreground."
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
