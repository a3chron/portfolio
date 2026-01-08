"use client";

import { cn } from "@/util/utils";
import React from "react";
import Navigation from "./navigation";

const classNameMap: Record<number, string> = {
  0: "bg-mauve",
  1: "bg-blue",
  2: "bg-sapphire",
  3: "bg-teal",
  4: "bg-yellow",
};

const selectTextMap: Record<number, string> = {
  0: "selection:text-mauve",
  1: "selection:text-blue",
  2: "selection:text-sapphire",
  3: "selection:text-teal",
  4: "selection:text-yellow",
};

const sectionNameMap: Record<number, string> = {
  0: "About Me",
  1: "GitHub",
  2: "Blog",
  3: "Projects",
  4: "Contact",
};

export default function SnapScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const sections = Array.isArray(children) ? children : [children];

  const handleWheel = (e: React.WheelEvent<HTMLDivElement> | undefined) => {
    if (isScrolling) return;
    if (window !== undefined && window.innerWidth <= 1024) return;
    if (e === undefined) return;

    setIsScrolling(true);

    if (e.deltaY > 0 && activeSection < sections.length - 1) {
      // Scroll down
      setActiveSection((prev) => prev + 1);
    } else if (e.deltaY < 0 && activeSection > 0) {
      // Scroll up
      setActiveSection((prev) => prev - 1);
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  React.useEffect(() => {
    document.getElementById(`section-${activeSection}`)?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeSection]);

  return (
    <div className="h-dvh w-dvw">
      <Navigation
        className={cn(
          "transition-colors duration-500 selection:bg-black",
          classNameMap[activeSection],
          selectTextMap[activeSection],
        )}
      />
      <div
        className="flex flex-col lg:snap-y h-fit lg:h-[calc(100dvh-96px)] w-dvw overflow-y-auto"
        onWheel={handleWheel}
      >
        <div className="hidden md:block absolute group top-1/2 -translate-y-1/2 left-6 h-fit w-fit p-2 rounded-full bg-bg space-y-2">
          {sections.map((_, index) => (
            <SectionTooltip
              key={index}
              section={index}
              activeSection={activeSection === index}
              setActiveSection={setActiveSection}
            />
          ))}
        </div>
        {sections.map((section, index) => (
          <div
            id={`section-${index}`}
            key={index}
            className="snap-top w-dvw h-fit"
          >
            {section}
          </div>
        ))}
      </div>
    </div>
  );
}

const SectionTooltip = ({
  section,
  activeSection,
  setActiveSection,
}: {
  section: number;
  activeSection: boolean;
  setActiveSection: (section: number) => void;
}) => {
  const stylesMap: Record<number, string> = {
    0: cn(
      "group-hover:border-mauve",
      activeSection
        ? "bg-mauve grayscale-0 border-mauve"
        : "bg-crust border-subtext",
    ),
    1: cn(
      "group-hover:border-blue",
      activeSection
        ? "bg-blue grayscale-0 border-blue"
        : "bg-crust border-subtext",
    ),
    2: cn(
      "group-hover:border-sapphire",
      activeSection
        ? "bg-sapphire grayscale-0 border-sapphire"
        : "bg-crust border-subtext",
    ),
    3: cn(
      "group-hover:border-teal",
      activeSection
        ? "bg-teal grayscale-0 border-teal"
        : "bg-crust border-subtext",
    ),
    4: cn(
      "group-hover:border-yellow",
      activeSection
        ? "bg-yellow grayscale-0 border-yellow"
        : "bg-crust border-subtext",
    ),
  };

  const styles = stylesMap[section % 5];

  return (
    <div
      onClick={() => setActiveSection(section)}
      className={cn(
        "group/section-ind w-5 h-8 relative rounded-full border-2 duration-500 cursor-pointer",
        styles,
      )}
    >
      <div className="absolute hidden group-hover/section-ind:flex items-center justify-center left-12 top-1/2 -translate-y-1/2 bg-bg text-text w-fit rounded-full drop-shadow-md">
        <div className="bg-bg w-4 h-4 rotate-45 -mx-1" />
        <span className="p-2 pl-0.5 z-10 w-fit min-w-max">
          {sectionNameMap[section]}
        </span>
      </div>
    </div>
  );
};
