import type { Metadata } from "next";
import Navigation from "@/components/navigation";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full max-h-dvh overflow-y-auto bg-bg">
      <Navigation className="bg-teal" />
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    template: "%s | Project",
    default: "Projects",
  },
};
