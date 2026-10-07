import { useEffect, useMemo, useState } from "react";
import { artifactById } from "@/data/artifacts";
import { domainById } from "@/data/types";
import { useArchive } from "@/state/archive";
import { revealPath } from "@/lib/thread";
import { useReducedMotion, useSound, useIsDesktop } from "@/lib/hooks";
import { cn } from "@/utils/cn";

/* ============================================================
   THE RED THREAD REVEAL
   The thread leaves the case file and travels to the artifact
   it is joined to. No fireworks: one line, one sentence, and
   the realisation that this is how the whole archive is built.
   ============================================================ */

export default function Reveal() {
  const { reveal, setReveal, navigate, traced, isVisited, threadUnlocked, beginReveal } =
    useArchive();
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const { sound } = useArchive();
  const play = useSound(sound);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!reveal) {
      setDrawn(false);
      return;
    }
    play("reveal");
    const t = window.setTimeout(() => setDrawn(true), reduced ? 0 : 520);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal]);

  useEffect(() => {
    if (!reveal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReveal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reveal, setReveal]);

  const geometry = useMemo(() => {
    const w = typeof window === "undefined" ? 1200 : window.innerWidth;
    const h = typeof window === "undefined" ? 800 : window.innerHeight;
    if (desktop) {
      const cardLeft = Math.max(w * 0.44, 520);
      const cardTop = h * 0.2;
      return {
        from: anchorPoint(reveal?.from ?? "", w, h),
        to: { x: cardLeft - 10, y: cardTop + 34 },
        card: { left: cardLeft, top: cardTop, width: Math.min(560, w - cardLeft - 40) },
        w,
        h,
      };
    }
    const cardLeft = 16;
    const cardTop = h * 0.3;
    return {
      from: anchorPoint(reveal?.from ?? "", w, h),
      to: { x: cardLeft + 12, y: cardTop + 30 },
      card: { left: cardLeft, top: cardTop, width: w - 32 },
      w,
      h,
    };
  }, [reveal, desktop]);

  if (!reveal) return null;

  const a = artifactById(reveal.from);
  const b = artifactById(reveal.to);
  if (!a || !b) return null;
  const edgeNote =
    a.connections.find((c) => c.id === b.id)?.note ??
    b.connections.find((c) => c.id === a.id)?.note ??
    "";

  return (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="false"
      aria-labelledby="reveal-title"
    >
      {/* scrim: paper, not black — this is still an archive */}
      <button
        type="button"
        aria-label="Close the connection"
        onClick={() => setReveal(null)}
        className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[1.5px]"
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <path
          d={revealPath(geometry.from, geometry.to, geometry.w)}
          fill="none"
          stroke="#b3261e"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn || reduced ? 0 : 1,
            transition: reduced ? "none" : "stroke-dashoffset 720ms cubic-bezier(0.22,0.8,0.2,1)",
          }}
        />
        <circle
          cx={geometry.from.x}
          cy={geometry.from.y}
          r="4.4"
          fill="#b3261e"
          className={reduced ? "" : "fade-in"}
        />
        <circle
          cx={geometry.to.x}
          cy={geometry.to.y}
          r="4.4"
          fill="#b3261e"
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 300ms ease" }}
        />
      </svg>

      <div
        className="absolute border border-thread bg-paper shadow-[0_18px_50px_-30px_rgba(22,21,15,0.6)]"
        style={{
          left: geometry.card.left,
          top: geometry.card.top,
          width: geometry.card.width,
          opacity: drawn ? 1 : 0,
          transform: drawn ? "none" : "translateY(10px)",
          transition: reduced ? "none" : "opacity 420ms ease 120ms, transform 420ms cubic-bezier(0.22,0.8,0.2,1) 120ms",
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-2.5">
          <span className="mono-xs text-thread">Connection traced</span>
          <span className="mono-xs text-faint tabular-nums">
            {String(traced.length).padStart(2, "0")} / archive graph
          </span>
        </div>

        <div className="px-5 py-5">
          <h2 id="reveal-title" className="mono text-[12px] tracking-[0.14em] text-ink">
            {a.id} <span className="text-thread">↔</span> {b.id}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
            <p className="min-w-0">
              <span className="block font-serif text-[1.05rem] leading-tight text-ink">{a.title}</span>
              <span className="mono-xs mt-1 block text-faint">
                Room {domainById(a.domain).numeral} · {a.type}
                {isVisited(a.id) ? " · consulted" : ""}
              </span>
            </p>
            <span aria-hidden="true" className="hidden font-mono text-thread sm:block">
              ⟷
            </span>
            <p className="min-w-0">
              <span className="block font-serif text-[1.05rem] leading-tight text-ink">{b.title}</span>
              <span className="mono-xs mt-1 block text-faint">
                Room {domainById(b.domain).numeral} · {b.type}
                {isVisited(b.id) ? " · consulted" : " · newly discovered"}
              </span>
            </p>
          </div>

          <p className="measure mt-5 border-l-2 border-thread pl-4 font-serif text-[1.04rem] leading-[1.6] text-graphite">
            {edgeNote}
          </p>

          {traced.length <= 2 ? (
            <p className="mono-xs mt-5 leading-relaxed text-smoke">
              Every artifact in this archive is joined like this. The index shows the whole graph.
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-rule pt-5">
            <button
              type="button"
              onClick={() => {
                setReveal(null);
                navigate({ view: "artifact", id: b.id });
              }}
              className="mono-xs border border-ink px-4 py-2.5 text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Open {b.id} →
            </button>
            <button
              type="button"
              onClick={() => {
                setReveal(null);
                navigate({ view: "index" });
              }}
              className="mono-xs px-2 py-2.5 text-smoke underline decoration-rule-2 underline-offset-4 transition-colors hover:text-thread"
            >
              See the map
            </button>
            <button
              type="button"
              onClick={() => setReveal(null)}
              className="mono-xs ml-auto px-2 py-2.5 text-faint transition-colors hover:text-ink"
            >
              Stay here
            </button>
          </div>
        </div>

        {threadUnlocked && a.connections.length > 1 ? (
          <button
            type="button"
            onClick={() => beginReveal(a.id)}
            className={cn(
              "mono-xs w-full border-t border-rule px-5 py-3 text-left text-faint transition-colors hover:text-thread",
            )}
          >
            ↻ Trace another connection from {a.id}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Where the thread leaves from: the artifact's knot in the
 *  document if it is on screen, otherwise the left margin. */
function anchorPoint(id: string, w: number, h: number) {
  if (typeof document !== "undefined") {
    const el = document.querySelector<HTMLElement>(`[data-thread-node="${id}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
  }
  return { x: Math.max(28, w * 0.06), y: h * 0.42 };
}
