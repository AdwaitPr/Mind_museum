import { useMemo } from "react";
import { mulberry32 } from "@/lib/hooks";
import type { EvidenceKind } from "@/data/types";

/* ============================================================
   SPECIMEN — procedural evidence placeholders
   ------------------------------------------------------------
   Every image in this archive must answer "why is this here?".
   Where real evidence has not yet been filed, the archive
   shows a drawn placeholder with complete metadata rather than
   a decorative stock photograph. Each specimen is generated
   deterministically from its label, so a plate is stable
   across reloads — like a real catalogue entry.
   ============================================================ */

const INK = "#16150f";
const GRAPHITE = "#3c3a31";
const FAINT = "#9a9484";
const RULE = "#c2bba8";
const RED = "#b3261e";

interface Props {
  seed: string;
  kindOf: EvidenceKind;
  aspect?: number;
  label: string;
  caption?: string;
  /** archival note, shown in the margin */
  note?: string;
  /** alt text architecture: describes the real evidence that will replace this plate */
  alt?: string;
  className?: string;
}

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function Screen({ r, w, h }: { r: () => number; w: number; h: number }) {
  const bars = Array.from({ length: 11 }, () => 0.3 + r() * 0.7);
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill="none" stroke={RULE} />
      <rect x={0} y={0} width={w} height={h * 0.055} fill={INK} opacity={0.86} />
      {[0.03, 0.055, 0.08].map((p, i) => (
        <circle key={i} cx={w * p} cy={h * 0.0275} r={w * 0.004} fill="#faf8f2" opacity={0.6} />
      ))}
      <rect
        x={w * 0.06}
        y={h * 0.12}
        width={w * 0.42}
        height={h * 0.022}
        fill={INK}
        opacity={0.8}
      />
      {bars.slice(0, 6).map((b, i) => (
        <rect
          key={`t${i}`}
          x={w * 0.06}
          y={h * (0.2 + i * 0.038)}
          width={w * 0.3 * b}
          height={h * 0.009}
          fill={GRAPHITE}
          opacity={0.35}
        />
      ))}
      <rect
        x={w * 0.56}
        y={h * 0.12}
        width={w * 0.38}
        height={h * 0.44}
        fill="none"
        stroke={GRAPHITE}
        strokeWidth={1.2}
        opacity={0.6}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`g${i}`}
          x1={w * 0.56}
          y1={h * (0.18 + i * 0.075)}
          x2={w * 0.94}
          y2={h * (0.18 + i * 0.075)}
          stroke={GRAPHITE}
          strokeWidth={0.8}
          opacity={0.22 + r() * 0.2}
        />
      ))}
      <rect x={w * 0.06} y={h * 0.63} width={w * 0.5} height={h * 0.022} fill={INK} opacity={0.5} />
      {bars.slice(6).map((b, i) => (
        <rect
          key={`b${i}`}
          x={w * 0.06}
          y={h * (0.7 + i * 0.038)}
          width={w * 0.46 * b}
          height={h * 0.008}
          fill={GRAPHITE}
          opacity={0.3}
        />
      ))}
      <line
        x1={w * 0.985}
        y1={h * 0.1}
        x2={w * 0.985}
        y2={h * 0.1 + h * 0.3 * r()}
        stroke={RED}
        strokeWidth={2}
        opacity={0.7}
      />
    </g>
  );
}

function Scan({ r, w, h }: { r: () => number; w: number; h: number }) {
  const cols = 46;
  const rows = Math.max(10, Math.round((cols * h) / w));
  const dots: React.ReactNode[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = (x + 0.5) * (w / cols);
      const cy = (y + 0.5) * (h / rows);
      const d = Math.hypot(cx - w * 0.62, cy - h * 0.42) / (w * 0.6);
      const v = Math.max(0, 1 - d) * (0.55 + r() * 0.6);
      const rad = (w / cols) * 0.44 * v;
      if (rad < 0.4) continue;
      dots.push(<circle key={`${x}-${y}`} cx={cx} cy={cy} r={rad} fill={INK} opacity={0.55} />);
    }
  }
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill="#faf8f2" stroke={RULE} />
      <g>{dots}</g>
      <line x1={w * 0.62} y1={h * 0.42} x2={w * 0.62} y2={h} stroke={RED} strokeWidth={1} opacity={0.6} />
      <path
        d={`M ${w * 0.62} ${h * 0.42} L ${w * 0.86} ${h * 0.42}`}
        stroke={RED}
        strokeWidth={1}
        opacity={0.6}
      />
      <text
        x={w * 0.87}
        y={h * 0.415}
        fontSize={w * 0.028}
        fill={RED}
        fontFamily="var(--font-mono)"
        letterSpacing={1}
      >
        CENTRE
      </text>
    </g>
  );
}

function Photograph({ r, w, h }: { r: () => number; w: number; h: number }) {
  const bands = 16;
  const paths: React.ReactNode[] = [];
  for (let i = 0; i < bands; i++) {
    const yBase = h * (0.1 + (i / bands) * 0.8);
    const amp = h * 0.035 * (1 - i / bands) + 2;
    let d = `M 0 ${yBase.toFixed(1)}`;
    for (let x = 0; x <= 8; x++) {
      const px = (x / 8) * w;
      const py = yBase + Math.sin(x * 1.1 + i * 0.6 + r()) * amp;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    paths.push(
      <path key={i} d={d} fill="none" stroke={GRAPHITE} strokeWidth={0.9} opacity={0.18 + (i / bands) * 0.4} />,
    );
  }
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill="#faf8f2" stroke={RULE} />
      {paths}
      <rect
        x={w * 0.04}
        y={h * 0.05}
        width={w * 0.92}
        height={h * 0.9}
        fill="none"
        stroke={INK}
        strokeWidth={0.8}
        opacity={0.35}
      />
      {/* registration corner marks — the sign of a print, not a picture */}
      {[
        [w * 0.04, h * 0.05, 1, 1],
        [w * 0.96, h * 0.05, -1, 1],
        [w * 0.04, h * 0.95, 1, -1],
        [w * 0.96, h * 0.95, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <path
          key={i}
          d={`M ${x} ${y} l ${12 * sx} 0 M ${x} ${y} l 0 ${12 * sy}`}
          stroke={INK}
          strokeWidth={1}
          fill="none"
          opacity={0.6}
        />
      ))}
      <line x1={0} y1={h * 0.66} x2={w} y2={h * 0.66} stroke={RED} strokeWidth={0.8} opacity={0.5} strokeDasharray="6 5" />
    </g>
  );
}

function Diagram({ r, w, h }: { r: () => number; w: number; h: number }) {
  const pad = { l: w * 0.1, r: w * 0.06, t: h * 0.14, b: h * 0.2 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const n = 7;
  const pts = Array.from({ length: n }, (_, i) => {
    const x = pad.l + (i / (n - 1)) * iw;
    const v = 0.15 + r() * 0.7;
    return { x, y: pad.t + ih * (1 - v) };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const threshold = pad.t + ih * 0.42;
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill="#faf8f2" stroke={RULE} />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + ih} stroke={INK} strokeWidth={1} opacity={0.5} />
      <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih} stroke={INK} strokeWidth={1} opacity={0.5} />
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={pad.l}
          y1={pad.t + (ih * i) / 4}
          x2={pad.l + iw}
          y2={pad.t + (ih * i) / 4}
          stroke={RULE}
          strokeWidth={0.7}
        />
      ))}
      <line x1={pad.l} y1={threshold} x2={pad.l + iw} y2={threshold} stroke={RED} strokeWidth={1.2} strokeDasharray="8 4" />
      <path d={line} fill="none" stroke={INK} strokeWidth={2} />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.4} fill="#faf8f2" stroke={INK} strokeWidth={1.4} />
      ))}
      <text
        x={pad.l + 6}
        y={threshold - 8}
        fontSize={w * 0.026}
        fill={RED}
        fontFamily="var(--font-mono)"
        letterSpacing={1.4}
      >
        THRESHOLD
      </text>
      <text
        x={pad.l}
        y={h - pad.b * 0.35}
        fontSize={w * 0.024}
        fill={FAINT}
        fontFamily="var(--font-mono)"
        letterSpacing={1.2}
      >
        0
      </text>
      <text
        x={pad.l + iw - w * 0.04}
        y={h - pad.b * 0.35}
        fontSize={w * 0.024}
        fill={FAINT}
        fontFamily="var(--font-mono)"
        letterSpacing={1.2}
        textAnchor="end"
      >
        TIME →
      </text>
    </g>
  );
}

function Sketchbook({ r, w, h }: { r: () => number; w: number; h: number }) {
  const cols = 8;
  const rows = 4;
  const marks: React.ReactNode[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = (x + 0.5) * (w / cols);
      const cy = (y + 0.5) * (h / rows);
      const s = Math.min(w / cols, h / rows) * 0.32;
      const t = r();
      let d = "";
      if (t < 0.3) d = `M ${cx - s} ${cy + s * 0.4} Q ${cx} ${cy - s} ${cx + s} ${cy + s * 0.4}`;
      else if (t < 0.55) d = `M ${cx - s} ${cy - s * 0.6} L ${cx + s * 0.8} ${cy + s * 0.6}`;
      else if (t < 0.78)
        d = `M ${cx - s} ${cy - s * 0.5} L ${cx} ${cy + s * 0.6} L ${cx + s} ${cy - s * 0.5}`;
      else d = `M ${cx - s} ${cy} L ${cx + s} ${cy}`;
      marks.push(
        <path
          key={`${x}-${y}`}
          d={d}
          fill="none"
          stroke={t > 0.9 ? RED : GRAPHITE}
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.72}
        />,
      );
    }
  }
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill="#faf8f2" stroke={RULE} />
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={((i + 1) * w) / cols}
          y1={0}
          x2={((i + 1) * w) / cols}
          y2={h}
          stroke={RULE}
          strokeWidth={0.6}
        />
      ))}
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <line
          key={`hz${i}`}
          x1={0}
          y1={((i + 1) * h) / rows}
          x2={w}
          y2={((i + 1) * h) / rows}
          stroke={RULE}
          strokeWidth={0.6}
        />
      ))}
      {marks}
    </g>
  );
}

function Document({ r, w, h }: { r: () => number; w: number; h: number }) {
  const cells = [
    { x: 0.06, y: 0.1, w: 0.4, h: 0.34 },
    { x: 0.54, y: 0.1, w: 0.4, h: 0.34 },
    { x: 0.06, y: 0.52, w: 0.4, h: 0.34 },
    { x: 0.54, y: 0.52, w: 0.4, h: 0.34 },
  ];
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill="#faf8f2" stroke={RULE} />
      {cells.map((c, i) => (
        <g key={i}>
          <rect
            x={w * c.x}
            y={h * c.y}
            width={w * c.w}
            height={h * c.h}
            fill="none"
            stroke={GRAPHITE}
            strokeWidth={0.9}
            opacity={0.55}
          />
          <rect
            x={w * (c.x + 0.03)}
            y={h * (c.y + 0.04)}
            width={w * c.w * 0.55}
            height={h * 0.016}
            fill={INK}
            opacity={0.7}
          />
          {Array.from({ length: 5 }).map((_, j) => (
            <line
              key={j}
              x1={w * (c.x + 0.03)}
              y1={h * (c.y + 0.1 + j * 0.045)}
              x2={w * (c.x + 0.03 + c.w * 0.82 * (0.5 + r() * 0.5))}
              y2={h * (c.y + 0.1 + j * 0.045)}
              stroke={GRAPHITE}
              strokeWidth={0.7}
              opacity={0.28}
            />
          ))}
        </g>
      ))}
      <line x1={w * 0.5} y1={h * 0.06} x2={w * 0.5} y2={h * 0.94} stroke={RULE} strokeWidth={0.8} />
      <rect x={w * 0.485} y={h * 0.45} width={w * 0.03} height={h * 0.1} fill={RED} opacity={0.85} />
    </g>
  );
}

const VARIANTS: Record<EvidenceKind, (p: { r: () => number; w: number; h: number }) => React.ReactNode> = {
  SCREEN: Screen,
  SCAN: Scan,
  PHOTOGRAPH: Photograph,
  DIAGRAM: Diagram,
  SKETCHBOOK: Sketchbook,
  DOCUMENT: Document,
};

export default function Specimen({
  seed,
  kindOf,
  aspect = 1.5,
  label,
  caption,
  note,
  alt,
  className,
}: Props) {
  const { w, h, body } = useMemo(() => {
    const W = 1000;
    const H = Math.round(W / aspect);
    const r = mulberry32(hashString(seed + kindOf));
    const Variant = VARIANTS[kindOf] ?? Document;
    return { w: W, h: H, body: <Variant r={r} w={W} h={H} /> };
  }, [seed, kindOf, aspect]);

  return (
    <figure className={className}>
      <div className="relative border border-rule bg-ivory">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="block w-full"
          style={{ aspectRatio: `${aspect}` }}
          role="img"
          aria-label={
            alt
              ? `${label} — ${alt}. Plate held as a placeholder; metadata complete.`
              : `${label} — evidence plate (${kindOf.toLowerCase()} placeholder, metadata complete)`
          }
        >
          {body}
        </svg>
        <span className="mono-xs absolute left-0 top-0 -translate-y-1/2 bg-paper px-1 text-faint">
          {label}
        </span>
      </div>
      <figcaption className="mt-2 grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-4">
        {caption ? (
          <p className="mono text-[11px] leading-relaxed text-smoke">{caption}</p>
        ) : null}
        <span className="mono-xs whitespace-nowrap text-faint">
          {note ?? "EVIDENCE NOT YET FILED"}
        </span>
      </figcaption>
    </figure>
  );
}
