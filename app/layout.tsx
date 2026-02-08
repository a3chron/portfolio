import "@/style/global.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import GithubRepo from "@/components/github-repo";
import ToggleFavicon from "@/components/toggle-favicon";

export const metadata: Metadata = {
  title: {
    template: "%s | a3chron",
    default: "a3chron",
  },
  description:
    "Hi, my name is Kurt Schambach. I'm a Software Developer at Titanom Technologies, working on some of my own Projects in free time",
  keywords: [
    "Kurt",
    "Schambach",
    "Kurt Schambach",
    "Developer",
    "Software",
    "Titanom Technologies",
    "Technologie",
    "Portfolio",
    "PlantOrg",
    "DevApps",
    "Reinforcement Learning",
    "RL",
    "Neuronal Network",
    "Neural Network",
    "NN",
  ],
  authors: [{ name: "Kurt Schambach" }],
  openGraph: {
    title: "a3chron",
    description:
      "Hi, my name is Kurt Schambach. I'm a Software Developer at Titanom Technologies, working on some of my own Projects in free time",
    url: "https://a3chron.vercel.app/",
    emails: "kurt.schambach@gmail.com",
    siteName: "a3chron - Kurt Schambach - Portfolio",
    images: [
      {
        url: "https://a3chron.vercel.app/a3chron.png",
        width: 1200,
        height: 600,
        alt: "a3chron logo",
      },
    ],
    locale: "de-DE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/a3-active.png",
  },
  verification: {
    google: "waG0eqk7cOJVSMbB42gHQIR-bDsRmy5ABoQWNFI8UKQ",
  },
  metadataBase: new URL("https://a3chron.vercel.app/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-bg ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <Analytics />
        <ToggleFavicon />
        <GithubRepo />
        <div className="w-dvw h-dvh bg-bg">{children}</div>
      </body>
    </html>
  );
}
