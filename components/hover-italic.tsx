"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/util/utils";

// Text that turns italic while its closest `group` ancestor (the card) is
// hovered.
//
// Fraunces' italic is a separate design (slanted 16°, pivoting on the
// baseline), not a variable axis, so the letter shapes can't be blended.
// Instead the glyphs swap at once and only the slant is animated: on hover
// the italic starts skewed back by 16° (so it still stands upright) and
// relaxes into its lean; on leave the upright starts leaning and straightens.
// The skew pivots on the baseline, so the letters' feet stay put and only the
// tops move. The italic is also smaller - lower x-height, narrower letters -
// so it's set a little larger (ITALIC_SCALE, line height pinned so nothing
// below moves) and gets just enough extra letter-spacing to keep the text's
// length. Nothing animates before the first hover, so there's no motion on
// page load.

// The italic's x-height is 940 units against the upright's 964 (and it reads
// lighter on top of that), so it's scaled up to match.
const ITALIC_SCALE = 1.03;

export const HoverItalic = ({ children }: { children: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"idle" | "in" | "out">("idle");
  const [italicStyle, setItalicStyle] = useState<CSSProperties>();

  useEffect(() => {
    const group = ref.current?.closest(".group");
    if (!group) return;
    const enter = () => setState("in");
    const leave = () => setState("out");
    group.addEventListener("mouseenter", enter);
    group.addEventListener("mouseleave", leave);
    return () => {
      group.removeEventListener("mouseenter", enter);
      group.removeEventListener("mouseleave", leave);
    };
  }, []);

  // Measure upright vs (scaled) italic width once; the difference is spread
  // over the characters as letter-spacing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const style = getComputedStyle(el);
    const size = Number.parseFloat(style.fontSize);
    const font = (italic: boolean) =>
      `${italic ? "italic " : ""}${style.fontWeight} ${
        italic ? size * ITALIC_SCALE : size
      }px ${style.fontFamily}`;
    const width = (italic: boolean) => {
      const probe = document.createElement("span");
      probe.textContent = children;
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
      probe.style.font = font(italic);
      probe.style.fontVariationSettings = style.fontVariationSettings;
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      return w;
    };
    const measure = () => {
      if (cancelled) return;
      const extra = (width(false) - width(true)) / children.length;
      setItalicStyle({
        fontSize: `${ITALIC_SCALE}em`,
        lineHeight: style.lineHeight,
        letterSpacing: `${extra}px`,
      });
    };
    // The italic face only loads once something uses it: ask for it, measure
    // either way (load() can reject on a single failed subset), and measure
    // again whenever fonts finish loading.
    document.fonts
      .load(font(true), children)
      .catch(() => undefined)
      .then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      cancelled = true;
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [children]);

  return (
    <span
      ref={ref}
      style={state === "in" ? italicStyle : undefined}
      className={cn(
        // Pivot on the (last line's) baseline: descent + half-leading ≈ 0.3em.
        // align-top: the scaled italic sits a hair lower in its line box,
        // which would otherwise grow the line (and the card) by a pixel.
        "inline-block align-top origin-[0_calc(100%-0.3em)] motion-reduce:animate-none",
        // The italic glyphs sit a hair left of the upright ones; nudge them
        // so the bottom-left stays put (translate stacks with the skew).
        state === "in"
          ? "italic translate-x-[0.05em] animate-lean-in"
          : undefined,
        state === "out" ? "animate-lean-out" : undefined,
      )}
    >
      {children}
    </span>
  );
};
