// Per-page content for the pixel-cube landing.
// Body text is proper-cased here (used verbatim in the accessible DOM mirror and
// mobile view); the canvas uppercases it for the 5x7 font.
// Dynamic content (GitHub stats, article / project / social lists) is appended
// at runtime in pixel-landing.tsx — this file holds only the static copy.

export type PageLink = {
  phrase: string; // substring of the line that becomes a clickable region
  href: string;
  external?: boolean;
};

export type BodyLine = {
  text: string;
  links?: PageLink[];
};

export type PageDef = {
  key: string;
  name: string; // dot-nav tooltip + a11y section heading
  accent: string; // hex, drives the canvas accent band
  accentClass: string; // nav background class (existing Catppuccin utility)
  selectClass: string; // nav text-selection class
  headline: string; // drawn at 2x scale
  body: BodyLine[];
};

export const PAGES: PageDef[] = [
  {
    key: "about",
    name: "About Me",
    accent: "#cba6f7",
    accentClass: "bg-mauve",
    selectClass: "selection:text-mauve",
    headline: "About Me",
    body: [
      {
        text: "Hi, I'm Kurt Schambach — Software Engineer at Titanom Solutions.",
        links: [
          {
            phrase: "Titanom Solutions",
            href: "https://www.titanom.com",
            external: true,
          },
        ],
      },
      {
        text: "I focus on Web Dev & LLMs, and study CS at TUM.",
        links: [{ phrase: "TUM", href: "https://www.tum.de", external: true }],
      },
      {
        text: "In free time I build Projects & write on my Blog.",
        links: [
          { phrase: "Projects", href: "/projects" },
          { phrase: "Blog", href: "/blog" },
        ],
      },
    ],
  },
  {
    key: "github",
    name: "GitHub",
    accent: "#89b4fa",
    accentClass: "bg-blue",
    selectClass: "selection:text-blue",
    headline: "GitHub",
    body: [
      { text: "Most of my projects are public — take a look." },
      {
        text: "Find me at github.com/a3chron",
        links: [
          {
            phrase: "github.com/a3chron",
            href: "https://github.com/a3chron",
            external: true,
          },
        ],
      },
    ],
  },
  {
    key: "blog",
    name: "Blog",
    accent: "#74c7ec",
    accentClass: "bg-sapphire",
    selectClass: "selection:text-sapphire",
    headline: "Blog",
    body: [
      { text: "Learnings on frameworks, languages & my setup." },
      {
        text: "Read more on my Blog:",
        links: [{ phrase: "Blog", href: "/blog" }],
      },
    ],
  },
  {
    key: "projects",
    name: "Projects",
    accent: "#94e2d5",
    accentClass: "bg-teal",
    selectClass: "selection:text-teal",
    headline: "Projects",
    body: [
      { text: "A few little projects worth a look:" },
      {
        text: "See all Projects",
        links: [{ phrase: "Projects", href: "/projects" }],
      },
    ],
  },
  {
    key: "contact",
    name: "Contact",
    accent: "#f9e2af",
    accentClass: "bg-yellow",
    selectClass: "selection:text-yellow",
    headline: "Get In Touch",
    body: [
      { text: "A question or want to work together? Reach out :)" },
    ],
  },
];
