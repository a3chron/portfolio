"use client";

import React from "react";
import { cn } from "@/util/utils";
import Navigation from "./navigation";

const sectionNames = ["About Me", "GitHub", "Projects", "Blog", "Contact"];

// Space kept above a section's content when the index scrolls to it.
const SECTION_MARGIN = 64;

const sectionContents = (scroller: HTMLElement) =>
  Array.from(scroller.querySelectorAll("[data-section-content]"));

// scrollTop that puts section `index`'s content SECTION_MARGIN below the top.
const sectionStart = (scroller: HTMLElement, index: number) => {
  if (index === 0) return 0;
  const content = sectionContents(scroller)[index];
  if (!content) return scroller.scrollTop;
  return (
    scroller.scrollTop +
    content.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top -
    SECTION_MARGIN
  );
};

export default function SectionScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = React.useState(0);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const sections = Array.isArray(children) ? children : [children];

  // The active section is the last one whose top has passed the upper third
  // of the viewport; at the very bottom it's always the last one, since the
  // short Contact section may never reach that line.
  const updateActiveSection = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const atBottom =
      scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
    if (atBottom) {
      setActiveSection(sections.length - 1);
      return;
    }
    const line =
      scroller.getBoundingClientRect().top + scroller.clientHeight / 3;
    let active = 0;
    sections.forEach((_, index) => {
      const el = document.getElementById(`section-${index}`);
      if (el && el.getBoundingClientRect().top <= line) active = index;
    });
    setActiveSection(active);
  };

  const scrollToSection = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      top: sectionStart(scroller, index),
      behavior: "smooth",
    });
  };

  return (
    <div className="h-dvh w-dvw">
      <Navigation className="bg-header" />
      <div
        ref={scrollerRef}
        onScroll={updateActiveSection}
        className="h-[calc(100dvh-96px)] w-dvw overflow-y-auto"
      >
        {/* Section index: one evenly spaced line per section with its name
            beside it; the current one a soft taupe, the others cream. */}
        <nav
          aria-label="Sections"
          className="hidden lg:flex flex-col fixed z-10 top-1/2 -translate-y-1/2 left-8"
        >
          {sections.map((_, index) => {
            const active = activeSection === index;
            return (
              <button
                type="button"
                key={index}
                onClick={() => scrollToSection(index)}
                aria-current={active ? "true" : undefined}
                // Padding instead of a gap between rows: the rows touch, so moving
                // the cursor up or down never leaves the index.
                className="group/index flex items-center gap-3 py-1.5 cursor-pointer text-left"
              >
                <span
                  className={cn(
                    "h-0.5 rounded-full duration-300",
                    active
                      ? "w-10 bg-soft"
                      : "w-6 bg-faint-line group-hover/index:bg-soft",
                  )}
                />
                <span
                  className={cn(
                    "text-xs duration-300",
                    active
                      ? "text-soft-text"
                      : "text-faint group-hover/index:text-soft",
                  )}
                >
                  {sectionNames[index]}
                </span>
              </button>
            );
          })}
        </nav>
        {sections.map((section, index) => (
          <div id={`section-${index}`} key={index} className="w-dvw">
            {section}
          </div>
        ))}
      </div>
    </div>
  );
}
