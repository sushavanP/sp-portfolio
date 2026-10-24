import { about } from "@/content/site";
import Doodle from "./sketch/Doodle";
import Mark from "./sketch/Mark";
import Pull from "./sketch/Pull";

export default function About() {
  return (
    <section className="section about wrap grid" id="about" aria-labelledby="about-title">
      <Doodle shape="spark" className="doodle--about-spark" />
      <Pull as="p" className="label section__label">
        01 / About
      </Pull>
      <h2 id="about-title" className="section__title reveal-heading">
        Right in the middle of users, ops and{" "}
        <em>
          <Mark type="underline">scale</Mark>
        </em>
        .
      </h2>
      <div className="prose about__prose">
        {about.map((p) => (
          <Pull key={p.slice(0, 24)} as="p">
            {p}
          </Pull>
        ))}
      </div>
    </section>
  );
}
