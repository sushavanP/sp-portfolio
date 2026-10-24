import { experience, experienceNote } from "@/content/site";
import Doodle from "./sketch/Doodle";
import Mark from "./sketch/Mark";
import Note from "./sketch/Note";
import Pull from "./sketch/Pull";
import RoughFrame from "./sketch/RoughFrame";
import TimelineLine from "./sketch/TimelineLine";

export default function Experience() {
  return (
    <section className="section experience wrap grid" id="experience" aria-labelledby="experience-title">
      <Doodle shape="cup" className="doodle--exp-cup" />
      <Pull as="p" className="label section__label">
        02 / Experience
      </Pull>
      <h2 id="experience-title" className="section__title reveal-heading">
        Nearly five years of{" "}
        <em>
          <Mark type="underline">shipping</Mark>
        </em>
        .
      </h2>
      <div className="timeline">
        <TimelineLine />
        <ol className="timeline__list">
          {experience.map((job, i) => (
            <li key={job.company} className={`job${job.pending ? " job--pending" : ""}`}>
              <article>
                <RoughFrame seed={100 + i} />
                <Pull as="header" innerClassName="job__head">
                  <h3 className="job__company">{job.company}</h3>
                  {(job.location || job.team || job.tenure) && (
                    <p className="job__meta">
                      {[job.team && `${job.team} team`, job.location, job.tenure].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </Pull>
                <ul className="job__roles">
                  {job.roles.map((r) => (
                    <Pull key={r.title} as="li" innerClassName="job__role">
                      <span className="job__title">{r.title}</span>{" "}
                      <time className="job__dates" dateTime={r.start}>
                        {r.dates}
                      </time>
                    </Pull>
                  ))}
                </ul>
                {job.points && (
                  <ul className="job__points">
                    {job.points.map((p) => (
                      <Pull key={p} as="li" innerClassName="job__point">
                        {p}
                      </Pull>
                    ))}
                  </ul>
                )}
                {job.metrics && (
                  // A list rather than <dl>: the pull wrappers would nest divs deeper than <dl> allows.
                  // Value before label, so it reads "10k+ users".
                  <ul className="job__metrics pull-row" aria-label="In numbers">
                    {job.metrics.map((m) => (
                      <Pull key={m.label} as="li" innerClassName="job__metric">
                        <span className="job__metric-value">{m.value}</span>{" "}
                        <span className="job__metric-label">{m.label}</span>
                      </Pull>
                    ))}
                  </ul>
                )}
                {job.note && (
                  <Pull as="p" className="job__note">
                    {job.note}
                  </Pull>
                )}
                {/* TODO: replace with what was built, tech used and impact */}
                {job.pending && (
                  <Pull as="p" className="job__pending">
                    More on this soon.
                  </Pull>
                )}
              </article>
              {i === 0 && (
                <Note arrow="downLeft" tone="accent-2" className="job__annotation">
                  {experienceNote}
                </Note>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
