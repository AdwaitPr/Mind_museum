/* ============================================================
   THE RED THREAD — geometry, sampling and canvas rendering.
   Pure functions + a tiny event bus. No React, no DOM layout
   writes: the layer component owns the canvas and the DOM
   contract (`[data-thread-node]`).
   ============================================================ */

export interface Pt {
  x: number;
  y: number;
}

export interface ThreadNode extends Pt {
  id: string;
  visited: boolean;
  /** the thread breaks here: at least one connection untraced */
  broken: boolean;
}

export const RED = "#b3261e";
export const INK = "#16150f";

/** Build the continuous thread from anchors, with a small
 *  horizontal meander so the line reads as hand-run, not plotted. */
export function buildPoints(
  nodes: ThreadNode[],
  w: number,
  h: number,
  time: number,
  pointer: Pt | null,
  intensity = 1,
  dormantY?: number,
): Pt[] {
  if (nodes.length === 0) {
    // Dormant: a single line crossing the whole field, resting in
    // whatever band of whitespace the document reserved for it.
    const out: Pt[] = [];
    const base = dormantY ?? h * 0.62;
    const n = 9;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      out.push({
        x: -40 + t * (w + 80),
        y: base + Math.sin(t * 5.2 + time * 0.22) * Math.min(46, h * 0.04),
      });
    }
    return out;
  }

  const out: Pt[] = [{ x: nodes[0].x + 26, y: -80 }];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    out.push({ x: n.x, y: n.y });
    const next = nodes[i + 1];
    if (!next) break;
    const gap = Math.abs(next.y - n.y);
    const steps = Math.max(2, Math.min(7, Math.round(gap / 90)));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const y = n.y + (next.y - n.y) * t;
      const meander =
        Math.sin(i * 1.7 + s * 1.1 + time * 0.16) * (12 + Math.min(gap, 320) * 0.05);
      const mid = (n.x + next.x) / 2;
      out.push({ x: mid + meander, y });
    }
  }
  const last = nodes[nodes.length - 1];
  out.push({ x: last.x + (last.id === "__end" ? 0 : -26), y: h + 80 });

  // Pointer: the thread yields toward a hand held near it.
  if (pointer && intensity > 0) {
    const R = 190;
    for (const p of out) {
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const d = Math.hypot(dx, dy);
      if (d < R && d > 0.001) {
        const f = Math.pow(1 - d / R, 2) * 30 * intensity;
        p.x += (dx / d) * f;
        p.y += (dy / d) * f * 0.5;
      }
    }
  }
  return out;
}

/** Smooth polyline through points (quadratic midpoints). */
export function strokeSmooth(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
  }
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  ctx.stroke();
}

/** Total length of a polyline — used to place travelling pulses. */
export function polyLength(pts: Pt[]) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return l;
}

export function pointAt(pts: Pt[], target: number): Pt {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (acc + seg >= target) {
      const t = seg === 0 ? 0 : (target - acc) / seg;
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t,
      };
    }
    acc += seg;
  }
  return pts[pts.length - 1];
}

export interface DrawOpts {
  pts: Pt[];
  nodes: ThreadNode[];
  pulses: { p: number; born: number; life: number }[];
  now: number;
  reduced: boolean;
  /** alpha of the whole thread, eased in on view change */
  alpha: number;
}

export function drawThread(ctx: CanvasRenderingContext2D, o: DrawOpts) {
  const { pts, nodes, pulses, now, reduced, alpha } = o;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // 1 — the thread itself
  ctx.globalAlpha = 0.82 * alpha;
  ctx.strokeStyle = RED;
  ctx.lineWidth = 1.15;
  strokeSmooth(ctx, pts);

  // 2 — breaks: an untraced connection ends the line and leaves a gap
  ctx.globalAlpha = 0.72 * alpha;
  for (const n of nodes) {
    if (!n.broken) continue;
    ctx.strokeStyle = RED;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(n.x + 7, n.y);
    ctx.lineTo(n.x + 30, n.y + (n.visited ? 6 : -6));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(n.x + 42, n.y + (n.visited ? 12 : -12), 1.7, 0, Math.PI * 2);
    ctx.fillStyle = RED;
    ctx.fill();
  }

  // 3 — knots
  for (const n of nodes) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.visited ? 4.2 : 3.2, 0, Math.PI * 2);
    if (n.visited) {
      ctx.fillStyle = RED;
      ctx.fill();
    } else {
      ctx.fillStyle = "#f2eee4";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
    if (!reduced) {
      const ring = 7 + ((now * 0.0012) % 1) * 9;
      ctx.globalAlpha = (1 - (ring - 7) / 9) * 0.32 * alpha;
      ctx.beginPath();
      ctx.arc(n.x, n.y, ring, 0, Math.PI * 2);
      ctx.strokeStyle = RED;
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }
  }

  // 4 — travelling pulses: a signal moving along the thread
  const total = polyLength(pts);
  for (const pulse of pulses) {
    const age = (now - pulse.born) / pulse.life;
    if (age < 0 || age > 1) continue;
    const head = pointAt(pts, total * (0.08 + age * 0.9));
    const tail = pointAt(pts, total * (0.08 + age * 0.9) - 46);
    ctx.globalAlpha = (1 - Math.abs(age - 0.5) * 1.1) * alpha;
    ctx.strokeStyle = RED;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(head.x, head.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(head.x, head.y, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = RED;
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- event bus: lets any component send a pulse down the thread ---------- */

type Listener = () => void;
const listeners = new Set<Listener>();

export function onThreadPulse(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emitThreadPulse() {
  listeners.forEach((l) => l());
}

/* ---------- SVG helpers for the connection reveal ---------- */

/** An elbow curve with a loop in it — used when the thread travels
 *  between two artifacts. Deliberately not a straight line. */
export function revealPath(
  from: Pt,
  to: Pt,
  w: number,
): string {
  const midX = from.x + (to.x - from.x) * 0.42;
  const loopX = Math.min(w * 0.5, from.x + 120);
  return [
    `M ${from.x} ${from.y}`,
    `C ${from.x + 60} ${from.y}, ${midX - 40} ${from.y - 10}, ${midX} ${from.y + (to.y - from.y) * 0.3}`,
    `C ${midX + 30} ${from.y + (to.y - from.y) * 0.45}, ${loopX - 40} ${from.y + (to.y - from.y) * 0.2}, ${loopX} ${from.y + (to.y - from.y) * 0.5}`,
    `C ${loopX + 40} ${from.y + (to.y - from.y) * 0.8}, ${to.x - 90} ${to.y - 20}, ${to.x} ${to.y}`,
  ].join(" ");
}
