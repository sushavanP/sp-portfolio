// Every fact on the site lives here. Source: portfolio-brief.md, plus the
// owner's answers (contact details and Freight Tiger metrics).

export const site = {
  name: "Sushavan Paul",
  role: "Software Engineer II",
  location: "Bengaluru, Karnataka, India",
  headline: "Building Marketplace @ Freight Tiger | React, React Native, Java",
  description:
    "Sushavan Paul is a software engineer in Bengaluru building marketplace systems that scale cleanly, with React Native, React and Java.",
  // TODO: set once the domain is known, for absolute Open Graph URLs
  url: "",
};

export const contact = {
  email: "sushavan.here@gmail.com",
  phoneDisplay: "+91 81164 41362",
  phoneHref: "tel:+918116441362",
  github: "https://github.com/sushavanP",
  githubLabel: "github.com/sushavanP",
  linkedin: "https://www.linkedin.com/in/sushavan",
  linkedinLabel: "linkedin.com/in/sushavan",
};

export const hero = {
  // "engineer" gets the hand-drawn circle (DESIGN.md §8.1)
  taglineBefore: "Software",
  taglineMark: "engineer",
  taglineAfter: "building marketplace systems that scale cleanly.",
  stack: ["React Native", "React", "Java"],
  annotation: "if it breaks, it's probably on me",
};

export const about = [
  "I work in the Marketplace Team at Freight Tiger, which basically means I sit right in the middle of users, operations and scale.",
  "On the frontend side, I own the FO app experience built with React Native. If something breaks there, it's probably on me. I also work on our internal CRM tools for the marketplace team using React, making sure the ops side doesn't hate their lives.",
  "On the backend, I spend a lot of time in Java building APIs and systems that actually hold up under load. I care a lot about performance, reliability and not getting paged at odd hours.",
  "I like working on problems where product, engineering and scale collide. Especially the kind where fixing one thing breaks three others.",
  "Currently interested in building systems that scale cleanly and don't turn into a mess six months later.",
];

export type Role = { title: string; dates: string; start: string; end?: string };

export type Job = {
  company: string;
  roles: Role[];
  location?: string;
  team?: string;
  tenure?: string;
  points?: string[];
  metrics?: { value: string; label: string }[];
  note?: string;
  // Placeholder until the owner fills in details
  pending?: boolean;
};

export const experience: Job[] = [
  {
    company: "Freight Tiger",
    roles: [{ title: "Software Engineer II", dates: "Oct 2025 – Present", start: "2025-10" }],
    location: "Bengaluru",
    team: "Marketplace",
    points: [
      "Own the FO app experience, built with React Native.",
      "Build internal CRM tools for the marketplace and ops team using React.",
      "Build Java APIs and backend systems designed for performance and reliability under load.",
    ],
    metrics: [
      { value: "10k+", label: "users" },
      { value: "1k+", label: "loads a day" },
      { value: "p90 < 900ms", label: "latency" },
    ],
  },
  {
    company: "MeritTrac Services",
    roles: [
      { title: "Senior Software Engineer", dates: "Jun 2025 – Oct 2025", start: "2025-06", end: "2025-10" },
      { title: "Software Engineer", dates: "Aug 2023 – Jun 2025", start: "2023-08", end: "2025-06" },
    ],
    location: "Bengaluru",
    tenure: "2 yrs 3 mos",
    note: "Promoted from Software Engineer to Senior Software Engineer.",
    pending: true,
  },
  {
    company: "UNext Learning",
    roles: [{ title: "Software Development Engineer I", dates: "Jan 2022 – Aug 2023", start: "2022-01", end: "2023-08" }],
    pending: true,
  },
  {
    company: "Mindship",
    roles: [{ title: "Software Development Engineering Intern", dates: "May 2021 – Jul 2021", start: "2021-05", end: "2021-07" }],
    pending: true,
  },
];

// Margin note beside the Freight Tiger card
export const experienceNote = "10k+ users. no pressure.";

export const closing = {
  lineBefore: "Let's build something that",
  lineMark: "ships",
  lineAfter: ".",
  invite: "Open to roles, collaborations, or just talking marketplace and scale.",
  signoff: "Built in Bengaluru, with too much filter coffee.",
  annotation: "send me a message",
};
