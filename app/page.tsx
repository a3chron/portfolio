import React from "react";
import BlogSection from "@/components/sections/blog-section";
import ContactSection from "@/components/sections/contact-section";
import GithubSection from "@/components/sections/github-section";
import InfoSection from "@/components/sections/info-section";
import ProjectsSection from "@/components/sections/projects-section";
import SnapScrollContainer from "@/components/snap-scroll-container";

export default function Home() {
  return (
    <div className="w-dvw h-dvh">
      <SnapScrollContainer>
        <InfoSection />
        <GithubSection />
        <BlogSection />
        <ProjectsSection />
        <ContactSection />
      </SnapScrollContainer>
    </div>
  );
}
