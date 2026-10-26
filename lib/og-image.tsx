import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { formatDate } from "./format-date";

// Generated Open Graph images for articles: Catppuccin Mocha with the site's
// IBM Plex Mono, in the style of public/a3chron.png (teal "3").

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const MOCHA = {
  base: "#1e1e2e",
  mantle: "#181825",
  crust: "#11111b",
  text: "#cdd6f4",
  subtext: "#a6adc8",
  overlay: "#6c7086",
  teal: "#94e2d5",
  sapphire: "#74c7ec",
};

const fontPath = (file: string) =>
  join(process.cwd(), "fonts/ibm_plex/IBM-Plex-Mono/fonts/complete/otf", file);

export async function renderArticleOgImage({
  title,
  description,
  topic,
  date,
}: {
  title: string;
  description: string;
  topic: string;
  date?: string;
}) {
  const [regular, bold] = await Promise.all([
    readFile(fontPath("IBMPlexMono-Regular.otf")),
    readFile(fontPath("IBMPlexMono-Bold.otf")),
  ]);

  // Long titles drop a size so they stay within three lines.
  const titleSize = title.length > 40 ? 64 : 80;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        backgroundColor: MOCHA.base,
        borderBottom: `12px solid ${MOCHA.sapphire}`,
        color: MOCHA.text,
        fontFamily: "IBM Plex Mono",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 48, fontWeight: 700 }}>
          <span>a</span>
          <span style={{ color: MOCHA.teal }}>3</span>
          <span>chron</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: MOCHA.sapphire,
            backgroundColor: MOCHA.crust,
            borderRadius: 12,
            padding: "6px 20px",
          }}
        >
          {`blog / ${topic}`}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 32, lineHeight: 1.4, color: MOCHA.subtext }}>
          {description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: MOCHA.overlay,
        }}
      >
        <span>{date ? formatDate(date) : ""}</span>
        <span>a3chron.dev</span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "IBM Plex Mono", data: regular, weight: 400, style: "normal" },
        { name: "IBM Plex Mono", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
