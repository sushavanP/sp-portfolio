export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner wrap">
        <a className="nav__home" href="#top" aria-label="Sushavan Paul, back to top">
          SP
        </a>
        <nav aria-label="Primary">
          <ul className="nav__links">
            <li>
              <a className="link" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="link" href="#experience">
                Experience
              </a>
            </li>
            <li>
              <a className="link" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
