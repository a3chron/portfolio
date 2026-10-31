import type { Metadata } from "next";
import Navigation from "@/components/navigation";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full max-h-dvh overflow-y-auto bg-bg">
      <Navigation />
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    template: "%s | Project",
    default: "Projects",
  },
  description:
    "Projects by Kurt Schambach (a3chron): command-line tools like stellar and gith, Android apps, a Nix setup and machine learning experiments.",
};
