import type React from "react";

// One landing-page section: a narrow, centred column with a small
// "— title —" label centred on top. The label is an h2 except where the
// section's own h1 follows it (About Me), which passes as="p".
export const Section = ({
  title,
  as: Label = "h2",
  children,
}: {
  title: string;
  as?: "h2" | "p";
  children: React.ReactNode;
}) => {
  return (
    <section className="w-dvw bg-bg text-text flex justify-center">
      <div className="w-full max-w-4xl px-6 py-24 md:px-12 md:py-40">
        {/* The section index scrolls to this (see section-scroller). */}
        <div data-section-content>
          <Label className="w-fit mx-auto rounded-full bg-header px-4 pt-0.5 pb-[3px] text-sm lowercase text-label mb-8 md:mb-12">
            — {title} —
          </Label>
          {children}
        </div>
      </div>
    </section>
  );
};
