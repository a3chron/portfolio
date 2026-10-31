import React from "react";
import BlogSection from "@/components/sections/blog-section";
import ContactSection from "@/components/sections/contact-section";
import GithubSection from "@/components/sections/github-section";
import InfoSection from "@/components/sections/info-section";
import ProjectsSection from "@/components/sections/projects-section";
import SectionScroller from "@/components/section-scroller";

// Tells search engines who this site is about, and ties the name to the
// a3chron handle and the profiles elsewhere.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kurt Schambach",
  alternateName: "a3chron",
  url: "https://a3chron.dev",
  image: "https://a3chron.dev/a3chron.png",
  jobTitle: "Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Titanom Solutions",
    url: "https://www.titanom.com",
  },
  sameAs: [
    "https://github.com/a3chron",
    "https://www.linkedin.com/in/kurt-schambach/",
    "https://www.producthunt.com/@a3chron",
  ],
};

export default function Home() {
  return (
    <div className="w-dvw h-dvh">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data built from the constant above
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SectionScroller>
        <InfoSection />
        <GithubSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </SectionScroller>
    </div>
  );
}
