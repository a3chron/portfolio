"use client";

import { allArticles, allProjects } from "contentlayer/generated";
import { useRouter } from "next/navigation";
import React from "react";
import Navigation from "@/components/navigation";
import { cn, getSortedArticlesbyDate } from "@/util/utils";
import { type BodyLine, PAGES } from "./pages";
import { type Content, PixelRenderer } from "./renderer";

// ---- static data (contentlayer generated + hardcoded socials) ----
const ARTICLES = getSortedArticlesbyDate(
  allArticles.filter((a) => a.published),
).slice(0, 2);

const PROJECT_SLUGS = ["kaeru-kitchen", "stellar", "portfolio"];
const PROJECTS = PROJECT_SLUGS.map((s) =>
  allProjects.find((p) => p.slug === s),
).filter((p): p is NonNullable<typeof p> => Boolean(p));

const SOCIALS = [
  {
    label: "Email",
    href: "mailto:kurt.schambach@gmail.com",
    desc: "kurt.schambach@gmail.com",
  },
  {
    label: "Github",
    href: "https://github.com/a3chron",
    desc: "The interesting one",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kurt-schambach/",
    desc: "The not so interesting one",
  },
  {
    label: "Letterboxd",
    href: "https://letterboxd.com/a3chron/",
    desc: "For the movie people",
  },
  {
    label: "Chess.com",
    href: "https://www.chess.com/member/a3chron",
    desc: "For the chess people",
  },
];

type Stats = {
  repos: number;
  stars: number;
  followers: number;
  topLanguages: number;
};
const FALLBACK_STATS: Stats = {
  repos: 27,
  stars: 12,
  followers: 8,
  topLanguages: 7,
};

type LinkTarget = { href: string; external?: boolean };

// header logo + nav, drawn as cubes (desktop)
const NAV = [
  { text: "home", id: "nav-home", href: "/" },
  { text: "projects", id: "nav-projects", href: "/projects" },
  { text: "blog", id: "nav-blog", href: "/blog" },
];
const LOGO = { text: "a3chron", id: "nav-logo", href: "/" };

// Build the pixel-canvas content (5x7 lines) + link-id -> href map.
function buildCanvasContent(
  pageIndex: number,
  stats: Stats,
): { content: Content; links: Map<string, LinkTarget> } {
  const page = PAGES[pageIndex];
  const links = new Map<string, LinkTarget>();
  // header links are global
  links.set(LOGO.id, { href: LOGO.href });
  NAV.forEach((n) => links.set(n.id, { href: n.href }));

  const lines: Content["lines"] = [];

  page.body.forEach((bl, bi) => {
    const lineLinks = (bl.links ?? []).map((l, li) => {
      const id = `${page.key}-b-${bi}-${li}`;
      links.set(id, { href: l.href, external: l.external });
      return { id, phrase: l.phrase };
    });
    lines.push({ text: bl.text, scale: 1, links: lineLinks });
  });

  let statCard: Content["statCard"];
  if (page.key === "github") {
    statCard = { value: stats.stars, label: "stars" };
  } else if (page.key === "blog") {
    ARTICLES.forEach((a) => {
      const id = `art-${a.slug}`;
      links.set(id, { href: `/blog/${a.slug}` });
      lines.push({ text: a.title, scale: 1, links: [{ id, phrase: a.title }] });
    });
  } else if (page.key === "projects") {
    PROJECTS.forEach((p) => {
      const id = `proj-${p.slug}`;
      links.set(id, { href: `/projects/${p.slug}` });
      lines.push({ text: p.title, scale: 1, links: [{ id, phrase: p.title }] });
    });
  } else if (page.key === "contact") {
    SOCIALS.forEach((s) => {
      const id = `soc-${s.label}`;
      links.set(id, { href: s.href, external: true });
      lines.push({
        text: s.label,
        scale: 1,
        links: [{ id, phrase: s.label }],
      });
    });
  }

  return {
    content: {
      chrome: true,
      logo: { text: LOGO.text, id: LOGO.id },
      nav: NAV.map((n) => ({ text: n.text, id: n.id })),
      heading: { number: `#${pageIndex + 1}`, label: page.headline.toUpperCase() },
      statCard,
      lines,
    },
    links,
  };
}

const EMPTY_BUILT = {
  content: { chrome: false, lines: [] } as Content,
  links: new Map<string, LinkTarget>(),
};

function accentText(i: number) {
  return PAGES[i].accentClass.replace("bg-", "text-");
}

export default function PixelLanding() {
  const router = useRouter();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rendererRef = React.useRef<PixelRenderer | null>(null);
  const linkMapRef = React.useRef<Map<string, LinkTarget>>(new Map());
  const prevPageRef = React.useRef<number | null>(null);
  const firstRef = React.useRef(true);
  const reducedRef = React.useRef(false);
  const isMobileRef = React.useRef(false);
  const lockRef = React.useRef(false);
  const accumRef = React.useRef(0);

  const [activePage, setActivePage] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [stats, setStats] = React.useState<Stats>(FALLBACK_STATS);

  React.useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // GitHub stats
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.stats) setStats(d.stats);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // create renderer + rAF loop
  React.useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const r = new PixelRenderer(cv);
    rendererRef.current = r;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = rm.matches;
    r.setReducedMotion(rm.matches);
    const onRM = () => {
      reducedRef.current = rm.matches;
      r.setReducedMotion(rm.matches);
    };
    rm.addEventListener("change", onRM);

    const onResize = () => r.resize();
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = (now: number) => {
      r.frame(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      rm.removeEventListener("change", onRM);
    };
  }, []);

  // viewport size class
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // push content/accent to the renderer on page / data / layout change
  React.useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    const built = isMobile ? EMPTY_BUILT : buildCanvasContent(activePage, stats);
    linkMapRef.current = built.links;
    const accent = PAGES[activePage].accent;
    r.setProgress(activePage / (PAGES.length - 1));

    if (firstRef.current || reducedRef.current) {
      r.setContent(built.content);
      r.setAccentHex(accent);
      firstRef.current = false;
    } else if (prevPageRef.current !== activePage) {
      r.startTransition(built.content, accent, performance.now());
    } else {
      r.setContent(built.content);
    }
    prevPageRef.current = activePage;
  }, [activePage, isMobile, stats]);

  // desktop interaction: wheel paging, keyboard, hover +, click ripple / links
  React.useEffect(() => {
    if (isMobile) return;
    const cv = canvasRef.current;
    const r = rendererRef.current;
    if (!cv || !r) return;

    const unlock = () => {
      lockRef.current = false;
      accumRef.current = 0;
    };
    const lock = () => {
      lockRef.current = true;
      window.setTimeout(unlock, 720);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockRef.current) return;
      accumRef.current += e.deltaY;
      if (accumRef.current > 55) {
        lock();
        setActivePage((p) => Math.min(p + 1, PAGES.length - 1));
      } else if (accumRef.current < -55) {
        lock();
        setActivePage((p) => Math.max(p - 1, 0));
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "A" || t.tagName === "BUTTON")) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        setActivePage((p) => Math.min(p + 1, PAGES.length - 1));
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        setActivePage((p) => Math.max(p - 1, 0));
      }
    };

    const pos = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const hitAt = (x: number, y: number) =>
      r
        .getHitRegions()
        .find(
          (reg) =>
            x >= reg.x && x <= reg.x + reg.w && y >= reg.y && y <= reg.y + reg.h,
        );

    cv.style.cursor = "none"; // hide the OS cursor; our ring is the cursor
    const onMove = (e: MouseEvent) => {
      const { x, y } = pos(e);
      r.setMouseCss(x, y);
    };
    const onLeave = () => r.setMouseCss(null, null);
    const onClick = (e: MouseEvent) => {
      const { x, y } = pos(e);
      const hit = hitAt(x, y);
      if (hit) {
        const target = linkMapRef.current.get(hit.id);
        if (target) {
          if (target.external)
            window.open(target.href, "_blank", "noopener,noreferrer");
          else router.push(target.href);
          return;
        }
      }
      r.addRippleCss(x, y, performance.now());
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mouseleave", onLeave);
    cv.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      cv.removeEventListener("mousemove", onMove);
      cv.removeEventListener("mouseleave", onLeave);
      cv.removeEventListener("click", onClick);
    };
  }, [isMobile, router]);

  // mobile: follow the section in view to drive the ambient accent
  React.useEffect(() => {
    if (!isMobile) return;
    const secs = Array.from(
      document.querySelectorAll<HTMLElement>("[data-page-index]"),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            const i = Number(en.target.getAttribute("data-page-index"));
            setActivePage(i);
          }
        }
      },
      { threshold: 0.5 },
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isMobile]);

  return (
    <div className="w-dvw min-h-dvh">
      {/* animated cube grid */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn("block", isMobile && "pointer-events-none opacity-70")}
        />
      </div>
      {isMobile && (
        <div className="fixed inset-0 z-[5] bg-black/50 pointer-events-none" />
      )}

      {/* top nav: drawn as cubes on desktop, so the real one is sr-only there;
          visible + accent-coloured on mobile */}
      <div className={cn("fixed inset-x-0 top-0 z-20", !isMobile && "sr-only")}>
        <Navigation
          className={cn(
            "text-crust transition-colors duration-500 selection:bg-black",
            isMobile && PAGES[activePage].accentClass,
            isMobile && PAGES[activePage].selectClass,
          )}
        />
      </div>

      {/* accessible / mobile content: single semantic source of truth */}
      <div
        aria-live="polite"
        className="sr-only"
      >{`${PAGES[activePage].name} section`}</div>

      <main
        className={cn(
          isMobile ? "relative z-10" : "sr-only",
        )}
      >
        {PAGES.map((page, i) => (
          <section
            key={page.key}
            data-page-index={i}
            aria-label={page.name}
            className={cn(
              isMobile &&
                "flex min-h-dvh flex-col justify-center gap-5 px-6 pb-16 pt-28",
            )}
          >
            <h2
              className={cn(
                isMobile && `text-4xl font-bold ${accentText(i)}`,
              )}
            >
              {page.headline}
            </h2>
            {page.body.map((bl, bi) => (
              <p
                key={bi}
                className={cn(isMobile && "text-lg text-text/90 font-plex")}
              >
                {renderLineNodes(bl)}
              </p>
            ))}
            <DynamicContent page={page.key} i={i} stats={stats} mobile={isMobile} />
          </section>
        ))}
      </main>
    </div>
  );
}

// inline links inside a body line for the DOM mirror
function renderLineNodes(line: BodyLine): React.ReactNode[] {
  const links = line.links ?? [];
  const marks = links
    .map((l) => ({ ...l, idx: line.text.indexOf(l.phrase) }))
    .filter((m) => m.idx >= 0)
    .sort((a, b) => a.idx - b.idx);
  const nodes: React.ReactNode[] = [];
  let pos = 0;
  marks.forEach((m, k) => {
    if (m.idx > pos) nodes.push(line.text.slice(pos, m.idx));
    nodes.push(
      <a
        key={k}
        href={m.href}
        target={m.external ? "_blank" : undefined}
        rel={m.external ? "noopener noreferrer" : undefined}
        className="underline decoration-2"
      >
        {m.phrase}
      </a>,
    );
    pos = m.idx + m.phrase.length;
  });
  if (pos < line.text.length) nodes.push(line.text.slice(pos));
  return nodes;
}

function DynamicContent({
  page,
  i,
  stats,
  mobile,
}: {
  page: string;
  i: number;
  stats: Stats;
  mobile: boolean;
}) {
  if (page === "github") {
    const items = [
      ["Repositories", stats.repos],
      ["Stars", stats.stars],
      ["Languages", stats.topLanguages],
      ["Followers", stats.followers],
    ] as const;
    return (
      <ul className={cn(mobile && "flex flex-wrap gap-4")}>
        {items.map(([label, value]) => (
          <li key={label} className={cn(mobile && "font-plex")}>
            <span className={cn(mobile && `text-2xl font-bold ${accentText(i)}`)}>
              {value}
            </span>{" "}
            <span className={cn(mobile && "text-text/80")}>{label}</span>
          </li>
        ))}
        <li>
          <a
            href="https://github.com/a3chron"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            github.com/a3chron
          </a>
        </li>
      </ul>
    );
  }
  if (page === "blog") {
    return (
      <ul className={cn(mobile && "flex flex-col gap-3")}>
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <a
              href={`/blog/${a.slug}`}
              className={cn("underline", mobile && `font-bold ${accentText(i)}`)}
            >
              {a.title}
            </a>
          </li>
        ))}
      </ul>
    );
  }
  if (page === "projects") {
    return (
      <ul className={cn(mobile && "flex flex-col gap-3")}>
        {PROJECTS.map((p) => (
          <li key={p.slug}>
            <a
              href={`/projects/${p.slug}`}
              className={cn("underline", mobile && `font-bold ${accentText(i)}`)}
            >
              {p.title}
            </a>
            {mobile && p.description && (
              <span className="block text-sm text-text/70">
                {p.description}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (page === "contact") {
    return (
      <ul className={cn(mobile && "flex flex-col gap-3")}>
        {SOCIALS.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("underline", mobile && `font-bold ${accentText(i)}`)}
            >
              {s.label}
            </a>
            {mobile && (
              <span className="block text-sm text-text/70">{s.desc}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  return null;
}
