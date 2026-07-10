// Canvas engine for the pixel-cube landing.
// Owns the grid, the value -> colour model, the sprite atlases, text
// rasterization, the cube header + progress line, the section heading, the
// star stat card, the per-line calm zone, ripples, the ring/x cursor, link
// underlines + hover glow, and page transitions. Pure DOM/canvas — no React.

import { GLYPH_H, GLYPH_W, glyphFor, glyphPixel } from "./font";
import { fbm3D, valueNoise3D } from "./noise";

// ---- content the renderer draws (built in pixel-landing.tsx) ----
export type ContentLine = {
  text: string;
  scale: number;
  links: { id: string; phrase: string }[];
};
export type Content = {
  chrome: boolean;
  logo?: { text: string; id: string };
  nav?: { text: string; id: string }[];
  heading?: { number: string; label: string };
  statCard?: { value: number; label: string };
  lines: ContentLine[];
};

/** A clickable rectangle in CSS pixels, tied to a link id. */
export type HitRegion = { id: string; x: number; y: number; w: number; h: number };

type Region = { id: string; c0: number; r0: number; c1: number; r1: number };
type Rect = { c0: number; r0: number; c1: number; r1: number };
type RGB = [number, number, number];

const LEVELS = 48;
const VMAX = 13;

const MASK_CONTENT = 1;
const MASK_HEADER = 2;
const MASK_ACCENT = 3; // forced accent colour (corner marks)

const STAR = [
  "...#...",
  "..###..",
  "#######",
  ".#####.",
  "..###..",
  ".##.##.",
  "##...##",
];

const GREY_ANCHORS: { v: number; c: RGB }[] = [
  { v: 0, c: [15, 15, 24] },
  { v: 2, c: [22, 22, 34] },
  { v: 4, c: [33, 34, 48] },
  { v: 6, c: [48, 50, 66] },
];
const LIGHT_ANCHORS: { v: number; c: RGB }[] = [
  { v: 10.2, c: [186, 194, 222] },
  { v: 13, c: [255, 255, 255] },
];
// text ramp: grey -> white only, NO accent (clean transitions)
const TEXT_ANCHORS: { v: number; c: RGB }[] = [
  { v: 0, c: [15, 15, 24] },
  { v: 3, c: [40, 41, 58] },
  { v: 5, c: [69, 71, 90] },
  { v: 7, c: [108, 112, 134] },
  { v: 9, c: [147, 153, 178] },
  { v: 10.2, c: [186, 194, 222] },
  { v: 13, c: [255, 255, 255] },
];

// tuning
const FREQ = 0.05;
const DRIFT = 0.06;
const TIMESCALE = 0.12;
const CALM = 2.4;
const PAD = 8;
const MID_GREY = 5.0;
const HOVER_BOOST = 2.8;
const RING_R = 2; // small "o" cursor
const RING_THICK = 0.7;
const X_ARM = 2; // "x" cursor over links
const ACCENT_V = 9.2;
const HEADER_TEXT_V = 10.35;
const PROG_ACTIVE_V = 9.2;
const PROG_INACTIVE_V = 3.0;
const RIPPLE_SPEED = 15;
const RIPPLE_LIFE = 1.3;
const RIPPLE_A0 = 4.2;
const RIPPLE_WIDTH = 1.5;
const RIPPLE_RMAX = RIPPLE_SPEED * RIPPLE_LIFE;

function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}
function rampColor(anchors: { v: number; c: RGB }[], v: number): RGB {
  if (v <= anchors[0].v) return anchors[0].c;
  const last = anchors[anchors.length - 1];
  if (v >= last.v) return last.c;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (v >= a.v && v <= b.v) {
      const t = b.v === a.v ? 0 : (v - a.v) / (b.v - a.v);
      return lerpRgb(a.c, b.c, t);
    }
  }
  return last.c;
}

type Ripple = { cx: number; cy: number; t0: number };

export class PixelRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private atlas: HTMLCanvasElement;
  private actx: CanvasRenderingContext2D;
  private textAtlas: HTMLCanvasElement;
  private tactx: CanvasRenderingContext2D;

  cols = 0;
  rows = 0;
  cell = 9;
  private dpr = 1;
  private cellPx = 9;

  private mask!: Uint8Array;
  private dist!: Float32Array;
  private regions: Region[] = [];
  private textRects: Rect[] = [];
  private content: Content = { chrome: false, lines: [] };

  private marginCol = 2;
  private progRowStart = -1;
  private progRowEnd = -1;
  private headerBottom = 0;
  private progCur = 0;
  private progTarget = 0;

  private accent: RGB = [203, 166, 247];
  private accentBuilt = "";
  private textBuilt = "";
  private textFactor = 1;
  private transition: {
    start: number;
    dur: number;
    swapped: boolean;
    pending: Content;
    from: RGB;
    to: RGB;
  } | null = null;

  private ripples: Ripple[] = [];
  private mouseCol = -1;
  private mouseRow = -1;
  private hoverLinkId: string | null = null;
  private hoverGlow = new Set<number>();
  private reduced = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.atlas = document.createElement("canvas");
    this.textAtlas = document.createElement("canvas");
    const actx = this.atlas.getContext("2d");
    const tactx = this.textAtlas.getContext("2d");
    if (!actx || !tactx) throw new Error("2d context unavailable");
    this.actx = actx;
    this.tactx = tactx;
    this.resize();
  }

  setReducedMotion(v: boolean) {
    this.reduced = v;
  }
  setProgress(frac: number) {
    this.progTarget = clamp(frac, 0, 1);
  }

  resize() {
    const cssW = window.innerWidth || this.canvas.clientWidth;
    const cssH = window.innerHeight || this.canvas.clientHeight;
    this.cell = clamp(Math.round(cssW / 230), 7, 11);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cellPx = Math.max(1, Math.round(this.cell * this.dpr));
    this.cols = Math.max(1, Math.floor(cssW / this.cell));
    this.rows = Math.max(1, Math.floor(cssH / this.cell));

    this.canvas.width = this.cols * this.cellPx;
    this.canvas.height = this.rows * this.cellPx;
    this.canvas.style.width = `${this.cols * this.cell}px`;
    this.canvas.style.height = `${this.rows * this.cell}px`;

    this.mask = new Uint8Array(this.cols * this.rows);
    this.dist = new Float32Array(this.cols * this.rows);
    this.accentBuilt = "";
    this.textBuilt = "";
    this.layout(this.content);
  }

  setAccentHex(hex: string) {
    this.accent = hexToRgb(hex);
    this.accentBuilt = "";
  }
  setContent(content: Content) {
    this.content = content;
    this.layout(content);
  }
  startTransition(next: Content, nextAccentHex: string, now: number, dur = 620) {
    this.transition = {
      start: now,
      dur,
      swapped: false,
      pending: next,
      from: this.accent,
      to: hexToRgb(nextAccentHex),
    };
  }

  setMouseCss(x: number | null, y: number | null) {
    if (x === null || y === null) {
      this.mouseCol = -1;
      this.mouseRow = -1;
      this.setHover(null);
      return;
    }
    this.mouseCol = Math.floor(x / this.cell);
    this.mouseRow = Math.floor(y / this.cell);
    let id: string | null = null;
    for (const reg of this.regions) {
      if (
        this.mouseCol >= reg.c0 &&
        this.mouseCol < reg.c1 &&
        this.mouseRow >= reg.r0 &&
        this.mouseRow < reg.r1
      ) {
        id = reg.id;
        break;
      }
    }
    this.setHover(id);
  }
  private setHover(id: string | null) {
    if (id === this.hoverLinkId) return;
    this.hoverLinkId = id;
    this.hoverGlow.clear();
    if (!id) return;
    const cols = this.cols;
    for (const reg of this.regions) {
      if (reg.id !== id) continue;
      for (let r = reg.r0; r < reg.r1 + 2; r++) {
        for (let c = reg.c0; c < reg.c1; c++) {
          const idx = r * cols + c;
          if (this.mask[idx] > 0) this.hoverGlow.add(idx);
        }
      }
    }
  }
  isHoveringLink() {
    return this.hoverLinkId !== null;
  }
  addRippleCss(x: number, y: number, now: number) {
    if (this.reduced) return;
    this.ripples.push({ cx: x / this.cell, cy: y / this.cell, t0: now });
    if (this.ripples.length > 12) this.ripples.shift();
  }
  getHitRegions(): HitRegion[] {
    return this.regions.map((r) => ({
      id: r.id,
      x: r.c0 * this.cell,
      y: r.r0 * this.cell,
      w: (r.c1 - r.c0) * this.cell,
      h: (r.r1 - r.r0) * this.cell,
    }));
  }

  // ---- rasterization helpers ----
  private stamp(ch: string, colBase: number, top: number, scale: number, m: number) {
    const g = glyphFor(ch);
    const cols = this.cols;
    const rows = this.rows;
    for (let gr = 0; gr < GLYPH_H; gr++) {
      for (let gc = 0; gc < GLYPH_W; gc++) {
        if (!glyphPixel(g, gc, gr)) continue;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const cc = colBase + gc * scale + sx;
            const rr = top + gr * scale + sy;
            if (cc >= 0 && cc < cols && rr >= 0 && rr < rows)
              this.mask[rr * cols + cc] = m;
          }
        }
      }
    }
  }
  private stampStr(text: string, col0: number, top: number, scale: number, m: number) {
    const adv = GLYPH_W * scale + scale;
    for (let i = 0; i < text.length; i++)
      this.stamp(text[i], col0 + i * adv, top, scale, m);
    return Math.max(0, text.length * adv - scale);
  }
  private stampBitmap(rows: string[], col0: number, top: number, m: number) {
    const cols = this.cols;
    const gh = rows.length;
    for (let r = 0; r < gh; r++) {
      for (let c = 0; c < rows[r].length; c++) {
        if (rows[r][c] !== "#") continue;
        const cc = col0 + c;
        const rr = top + r;
        if (cc >= 0 && cc < cols && rr >= 0 && rr < this.rows)
          this.mask[rr * cols + cc] = m;
      }
    }
  }
  private accentPlus(cc: number, rr: number) {
    const pts = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const cols = this.cols;
    for (const [dx, dy] of pts) {
      const c = cc + dx;
      const r = rr + dy;
      if (c >= 0 && c < cols && r >= 0 && r < this.rows)
        this.mask[r * cols + c] = MASK_ACCENT;
    }
  }
  private underline(c0: number, c1: number, row: number, m: number) {
    const cols = this.cols;
    if (row < 0 || row >= this.rows) return;
    for (let c = c0; c < c1; c++)
      if (c >= 0 && c < cols) this.mask[row * cols + c] = m;
  }

  // ---- layout ----
  private layout(content: Content) {
    const cols = this.cols;
    const rows = this.rows;
    this.mask.fill(0);
    this.regions = [];
    this.textRects = [];
    this.progRowStart = -1;
    this.progRowEnd = -1;
    this.headerBottom = 0;
    this.hoverLinkId = null;
    this.hoverGlow.clear();
    if (cols === 0 || rows === 0) return;

    const marginCol = Math.max(2, Math.round(cols * 0.08));
    this.marginCol = marginCol;
    const maxCols = cols - marginCol * 2;
    let contentTop = 2;

    if (content.chrome) {
      const headRow = 2;
      if (content.logo) {
        const w = this.stampStr(content.logo.text, marginCol, headRow, 1, MASK_HEADER);
        this.regions.push({
          id: content.logo.id,
          c0: marginCol,
          r0: headRow,
          c1: marginCol + w,
          r1: headRow + GLYPH_H,
        });
      }
      if (content.nav && content.nav.length) {
        const adv = GLYPH_W + 1;
        const gap = 5;
        const widths = content.nav.map((n) => Math.max(0, n.text.length * adv - 1));
        const total = widths.reduce((a, b) => a + b, 0) + gap * (content.nav.length - 1);
        let c = cols - marginCol - total;
        content.nav.forEach((n, i) => {
          this.stampStr(n.text, c, headRow, 1, MASK_HEADER);
          this.regions.push({
            id: n.id,
            c0: c,
            r0: headRow,
            c1: c + widths[i],
            r1: headRow + GLYPH_H,
          });
          c += widths[i] + gap;
        });
      }
      const progTop = headRow + GLYPH_H + 2;
      this.progRowStart = progTop;
      this.progRowEnd = progTop + 1;
      this.headerBottom = progTop;
      contentTop = this.progRowEnd + 3;
    }

    // ---- wrap body lines ----
    type Visual = {
      text: string;
      start: number;
      scale: number;
      links: { id: string; ps: number; pe: number }[];
    };
    const visuals: Visual[] = [];
    for (const line of content.lines) {
      const s = line.scale;
      const adv = GLYPH_W * s + s;
      const maxChars = Math.max(1, Math.floor((maxCols + s) / adv));
      const linkRanges = line.links
        .map((l) => {
          const ps = line.text.toUpperCase().indexOf(l.phrase.toUpperCase());
          return ps < 0 ? null : { id: l.id, ps, pe: ps + l.phrase.length };
        })
        .filter((v): v is { id: string; ps: number; pe: number } => v !== null);
      const words = line.text.split(" ");
      let curStart = 0;
      let cur = "";
      const flush = () =>
        visuals.push({ text: cur, start: curStart, scale: s, links: linkRanges });
      let cursor = 0;
      for (let w = 0; w < words.length; w++) {
        const word = words[w];
        const candidate = cur === "" ? word : `${cur} ${word}`;
        if (candidate.length > maxChars && cur !== "") {
          flush();
          curStart = cursor;
          cur = word;
        } else {
          if (cur === "") curStart = cursor;
          cur = candidate;
        }
        cursor += word.length + 1;
      }
      flush();
    }

    // ---- measure block height ----
    const GAP = 5;
    const statH = content.statCard ? GLYPH_H * 2 + 2 + GLYPH_H : 0;
    let total = 0;
    const parts: number[] = [];
    if (content.heading) parts.push(GLYPH_H * 2);
    for (const v of visuals) parts.push(v.scale * GLYPH_H);
    if (content.statCard) parts.push(statH);
    total = parts.reduce((a, b) => a + b, 0) + GAP * Math.max(0, parts.length - 1);

    let row = contentTop + Math.max(0, Math.floor((rows - contentTop - 2 - total) / 2));

    // ---- heading: big #n + title to its right ----
    if (content.heading) {
      const numW = this.stampStr(content.heading.number, marginCol, row, 2, MASK_CONTENT);
      const labelCol = marginCol + numW + 4;
      const labelTop = row + GLYPH_H; // bottom-align the title with the number
      const labelW = this.stampStr(content.heading.label, labelCol, labelTop, 1, MASK_CONTENT);
      this.textRects.push({
        c0: marginCol - 1,
        r0: row - 1,
        c1: labelCol + labelW + 1,
        r1: row + GLYPH_H * 2 + 1,
      });
      row += GLYPH_H * 2 + GAP;
    }

    // ---- body ----
    for (const vis of visuals) {
      const s = vis.scale;
      const adv = GLYPH_W * s + s;
      const glyphW = GLYPH_W * s;
      const top = row;
      const lineW = Math.max(0, vis.text.length * adv - s);
      for (let i = 0; i < vis.text.length; i++)
        this.stamp(vis.text[i], marginCol + i * adv, top, s, MASK_CONTENT);
      this.textRects.push({
        c0: marginCol - 1,
        r0: top - 1,
        c1: marginCol + lineW + 1,
        r1: top + GLYPH_H * s + 1,
      });
      const endOffset = vis.start + vis.text.length;
      for (const lr of vis.links) {
        const a = Math.max(lr.ps, vis.start);
        const b = Math.min(lr.pe, endOffset);
        if (a >= b) continue;
        const c0 = marginCol + (a - vis.start) * adv;
        const c1 = marginCol + (b - vis.start - 1) * adv + glyphW;
        this.regions.push({ id: lr.id, c0, r0: top, c1, r1: top + GLYPH_H * s });
        this.underline(c0, c1, top + GLYPH_H * s + 1, MASK_CONTENT);
      }
      row += GLYPH_H * s + GAP;
    }

    // ---- star stat card ----
    if (content.statCard) {
      const cardLeft = marginCol;
      const iconTop = row + 3; // centre the 7-tall star in the 14-tall number row
      this.stampBitmap(STAR, cardLeft, iconTop, MASK_CONTENT);
      const numCol = cardLeft + 7 + 3;
      const numW = this.stampStr(String(content.statCard.value), numCol, row, 2, MASK_CONTENT);
      const labelTop = row + GLYPH_H * 2 + 2;
      const labelW = this.stampStr(content.statCard.label, cardLeft, labelTop, 1, MASK_CONTENT);
      const boxLeft = cardLeft;
      const boxRight = Math.max(numCol + numW, cardLeft + labelW);
      const boxTop = row;
      const boxBottom = labelTop + GLYPH_H;
      const p = 2;
      this.accentPlus(boxLeft - p, boxTop - p);
      this.accentPlus(boxRight + p, boxTop - p);
      this.accentPlus(boxLeft - p, boxBottom + p);
      this.accentPlus(boxRight + p, boxBottom + p);
      this.textRects.push({
        c0: boxLeft - p - 1,
        r0: boxTop - p - 1,
        c1: boxRight + p + 2,
        r1: boxBottom + p + 2,
      });
    }

    this.buildDistanceField();
  }

  private buildDistanceField() {
    const cols = this.cols;
    const rows = this.rows;
    const dist = this.dist;
    const rects = this.textRects;
    const cap = PAD + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let best = cap;
        for (let k = 0; k < rects.length; k++) {
          const t = rects[k];
          const dx = c < t.c0 ? t.c0 - c : c >= t.c1 ? c - (t.c1 - 1) : 0;
          const dy = r < t.r0 ? t.r0 - r : r >= t.r1 ? r - (t.r1 - 1) : 0;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < best) best = d;
        }
        dist[r * cols + c] = best;
      }
    }
  }

  // ---- atlases ----
  private ramp(v: number): RGB {
    const accent = this.accent;
    const darkAccent: RGB = [
      Math.round(accent[0] * 0.5),
      Math.round(accent[1] * 0.5),
      Math.round(accent[2] * 0.5),
    ];
    const anchors: { v: number; c: RGB }[] = [
      ...GREY_ANCHORS,
      { v: 6.3, c: darkAccent },
      { v: 8, c: accent },
      { v: 10, c: accent },
      ...LIGHT_ANCHORS,
    ];
    return rampColor(anchors, v);
  }
  private drawAtlas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    color: (v: number) => RGB,
  ) {
    const cp = this.cellPx;
    canvas.width = LEVELS * cp;
    canvas.height = cp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const size = cp * 0.9;
    const off = (cp - size) / 2;
    const radius = cp * 0.2;
    for (let l = 0; l < LEVELS; l++) {
      const [r, g, b] = color((l / (LEVELS - 1)) * VMAX);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      this.roundRect(ctx, l * cp + off, off, size, size, radius);
      ctx.fill();
    }
  }
  private ensureAtlases() {
    const key = `${this.accent.join(",")}:${this.cellPx}`;
    if (key !== this.accentBuilt) {
      this.accentBuilt = key;
      this.drawAtlas(this.atlas, this.actx, (v) => this.ramp(v));
    }
    const tk = `${this.cellPx}`;
    if (tk !== this.textBuilt) {
      this.textBuilt = tk;
      this.drawAtlas(this.textAtlas, this.tactx, (v) => rampColor(TEXT_ANCHORS, v));
    }
  }
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---- per-frame ----
  frame(now: number) {
    if (this.transition) {
      const tr = this.transition;
      const p = clamp((now - tr.start) / tr.dur, 0, 1);
      if (p >= 1) {
        this.textFactor = 1;
        this.accent = tr.to;
        this.accentBuilt = "";
        this.transition = null;
      } else {
        if (p < 0.5) {
          this.textFactor = 1 - p / 0.5;
        } else {
          if (!tr.swapped) {
            this.layout(tr.pending);
            this.content = tr.pending;
            tr.swapped = true;
          }
          this.textFactor = (p - 0.5) / 0.5;
        }
        this.accent = lerpRgb(tr.from, tr.to, p);
        this.accentBuilt = "";
      }
    }

    this.progCur += (this.progTarget - this.progCur) * 0.15;
    this.ensureAtlases();

    const ctx = this.ctx;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const cols = this.cols;
    const rows = this.rows;
    const cp = this.cellPx;
    const t = this.reduced ? 0 : now * 0.001;
    const tf = this.textFactor;
    const mask = this.mask;
    const dist = this.dist;
    const glow = this.hoverGlow;
    const mc = this.mouseCol;
    const mr = this.mouseRow;
    const cursorX = this.hoverLinkId !== null;
    const atlas = this.atlas;
    const textAtlas = this.textAtlas;
    const invW2 = 1 / (2 * RIPPLE_WIDTH * RIPPLE_WIDTH);
    const chrome = this.content.chrome;
    const barActiveCol = this.progCur * cols;

    const active: { cx: number; cy: number; R: number; amp: number }[] = [];
    if (!this.reduced) {
      const keep: Ripple[] = [];
      for (const rp of this.ripples) {
        const age = (now - rp.t0) / 1000;
        if (age < RIPPLE_LIFE) keep.push(rp);
        const R = age * RIPPLE_SPEED;
        const amp = RIPPLE_A0 * (1 - age / RIPPLE_LIFE);
        if (amp > 0.02 && R <= RIPPLE_RMAX)
          active.push({ cx: rp.cx, cy: rp.cy, R, amp });
      }
      this.ripples = keep;
    }

    for (let row = 0; row < rows; row++) {
      const inProg = chrome && row >= this.progRowStart && row < this.progRowEnd;
      const inHeader = chrome && row < this.headerBottom;
      for (let col = 0; col < cols; col++) {
        let v: number;
        let srcText = false;

        if (inProg) {
          v = col <= barActiveCol ? PROG_ACTIVE_V : PROG_INACTIVE_V;
        } else {
          const idx = row * cols + col;
          const mval = mask[idx];
          if (glow.has(idx)) {
            v = ACCENT_V + 0.6 * valueNoise3D(col * 0.6, row * 0.6, t); // link glow
          } else if (mval === MASK_ACCENT) {
            v = ACCENT_V;
          } else if (mval === MASK_CONTENT) {
            const n2 = valueNoise3D(col * 0.6, row * 0.6, t * 0.9);
            v = lerp(MID_GREY, 10.6 + 2.0 * n2, tf);
            srcText = true;
          } else if (mval === MASK_HEADER) {
            const n2 = valueNoise3D(col * 0.6, row * 0.6, t * 0.7);
            v = HEADER_TEXT_V + 0.35 * n2;
            srcText = true;
          } else if (inHeader) {
            const n = valueNoise3D(col * 0.12, row * 0.12, t * 0.5);
            v = 1.2 + 1.0 * n;
          } else {
            const n = fbm3D(col * FREQ + t * DRIFT, row * FREQ, t * TIMESCALE, 2);
            const bg = 1.5 + Math.pow(n, 1.3) * 8.5;
            const m = smoothstep(0, PAD, dist[idx]);
            v = CALM + (bg - CALM) * m;
          }

          for (let k = 0; k < active.length; k++) {
            const a = active[k];
            const dx = col - a.cx;
            const dy = row - a.cy;
            if (dx > a.R + 4 || dx < -a.R - 4 || dy > a.R + 4 || dy < -a.R - 4)
              continue;
            const dc = Math.sqrt(dx * dx + dy * dy);
            const diff = dc - a.R;
            v += a.amp * Math.exp(-(diff * diff) * invW2);
          }

          // cursor: small "o", or "x" over a link
          if (mc >= 0) {
            const dx = col - mc;
            const dy = row - mr;
            if (cursorX) {
              const ax = Math.abs(dx);
              if (ax >= 1 && ax <= X_ARM && ax === Math.abs(dy)) v += HOVER_BOOST;
            } else if (dx * dx + dy * dy <= (RING_R + 1) * (RING_R + 1)) {
              const d = Math.sqrt(dx * dx + dy * dy);
              if (Math.abs(d - RING_R) < RING_THICK) v += HOVER_BOOST;
            }
          }
        }

        let level = ((v / VMAX) * (LEVELS - 1) + 0.5) | 0;
        if (level < 0) level = 0;
        else if (level >= LEVELS) level = LEVELS - 1;

        ctx.drawImage(
          srcText ? textAtlas : atlas,
          level * cp,
          0,
          cp,
          cp,
          col * cp,
          row * cp,
          cp,
          cp,
        );
      }
    }
  }
}
