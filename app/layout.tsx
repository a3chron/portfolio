import "@/style/global.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import GithubRepo from "@/components/github-repo";
import ToggleFavicon from "@/components/toggle-favicon";

// Variable font, so any weight works via font-weight; the default weight and
// the SOFT/WONK axes are set on body in global.css.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  // Italic for the hover effect on card titles (components/hover-italic).
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    template: "%s | a3chron",
    default: "a3chron",
  },
  description:
    "Hi, my name is Kurt Schambach. I'm a Software Engineer at Titanom Technologies, working on some of my own Projects in free time",
  keywords: [
    "Kurt",
    "Schambach",
    "Kurt Schambach",
    "Engineer",
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
  // No title/description here: Next fills og:/twitter: title and description
  // from each page's own when the openGraph object leaves them out. Setting
  // them pinned every page without an openGraph of its own (all project
  // pages) to the homepage's text, and the fixed url pointed them all at the
  // homepage.
  openGraph: {
    url: "./",
    emails: "kurt.schambach@gmail.com",
    siteName: "a3chron - Kurt Schambach - Portfolio",
    images: [
      {
        url: "https://a3chron.dev/a3chron.png",
        width: 1200,
        height: 600,
        alt: "a3chron logo",
      },
    ],
    locale: "en_US",
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
  // Every page declares itself canonical ("./" resolves against each route's
  // own path), so query-string variants Google crawls - ?_rsc=… prefetches,
  // ?utm_… links - fold into the clean URL instead of being reported as
  // "Duplicate without user-selected canonical".
  alternates: {
    canonical: "./",
  },
  verification: {
    google: "waG0eqk7cOJVSMbB42gHQIR-bDsRmy5ABoQWNFI8UKQ",
  },
  metadataBase: new URL("https://a3chron.dev/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fraunces.variable}>
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
