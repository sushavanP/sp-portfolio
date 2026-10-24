import { closing, contact, site } from "@/content/site";
import Mark from "./sketch/Mark";
import Note from "./sketch/Note";
import Pull from "./sketch/Pull";
import Valley from "./Valley";

export default function Closing() {
  return (
    <footer className="closing" id="contact" aria-labelledby="contact-title">
      <div className="closing__text wrap">
        <Pull as="p" className="label">
          03 / Contact
        </Pull>
        <h2 id="contact-title" className="closing__line reveal-heading">
          {closing.lineBefore} <Mark type="circle">{closing.lineMark}</Mark>
          {closing.lineAfter}
        </h2>
        <Pull as="p" className="closing__invite">
          {closing.invite}
        </Pull>
        <div className="closing__contact">
          {/* Points at the email, the first link in the row */}
          <Note arrow="right" className="closing__annotation">
            {closing.annotation}
          </Note>
          <ul className="closing__links pull-row">
            <Pull as="li">
              <a className="link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </Pull>
            <Pull as="li">
              <a className="link" href={contact.phoneHref}>
                {contact.phoneDisplay}
              </a>
            </Pull>
            <Pull as="li">
              <a className="link" href={contact.github} rel="me noopener" target="_blank">
                GitHub
              </a>
            </Pull>
            <Pull as="li">
              <a className="link" href={contact.linkedin} rel="me noopener" target="_blank">
                LinkedIn
              </a>
            </Pull>
          </ul>
        </div>
        <Pull as="p" className="closing__signoff">
          {closing.signoff}
        </Pull>
        <Pull as="p" className="closing__copy">
          © 2026 {site.name}
        </Pull>
      </div>
      <Valley />
    </footer>
  );
}
