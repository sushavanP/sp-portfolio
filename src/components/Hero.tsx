import { hero, site } from "@/content/site";
import Doodle from "./sketch/Doodle";
import Mark from "./sketch/Mark";
import Note from "./sketch/Note";
import Pull from "./sketch/Pull";
import SketchButton from "./sketch/SketchButton";

export default function Hero() {
  const [first, last] = site.name.split(" ");
  return (
    <section className="hero wrap grid" id="top" aria-labelledby="hero-title">
      <Doodle shape="star" className="doodle--hero-star" />
      <Doodle shape="squiggle" className="doodle--hero-squiggle" />
      <Pull as="p" className="label hero__kicker">
        {site.role} · Freight Tiger · Bengaluru
      </Pull>
      <h1 id="hero-title" className="hero__name reveal-heading">
        <span className="hero__line">{first}</span>{" "}
        <span className="hero__line hero__line--indent">{last}</span>
      </h1>
      <div className="hero__body">
        <p className="hero__tagline">
          {hero.taglineBefore} <Mark type="circle">{hero.taglineMark}</Mark> {hero.taglineAfter}
        </p>
        <Note arrow="left" className="hero__annotation">
          {hero.annotation}
        </Note>
        <ul className="tags pull-row" aria-label="Main stack">
          {hero.stack.map((t) => (
            <Pull key={t} as="li" innerClassName="tag">
              {t}
            </Pull>
          ))}
        </ul>
        <div className="hero__ctas">
          <SketchButton href="#experience" seed={11} primary>
            View my experience
          </SketchButton>
          <SketchButton href="#contact" seed={23}>
            Get in touch
          </SketchButton>
        </div>
      </div>
    </section>
  );
}
