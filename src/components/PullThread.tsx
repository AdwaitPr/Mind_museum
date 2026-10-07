import { useCallback, useEffect, useRef, useState } from "react";
import { useArchive } from "@/state/archive";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/utils/cn";

/* ============================================================
   PULL THE THREAD
   The one gesture the archive asks for. It is deliberately
   physical: the line resists, and the connection only reveals
   if you take it all the way. A button and a keyboard route
   exist alongside the drag, always.
   ============================================================ */

const TRACK = 152;

export function PullThread({ artifactId }: { artifactId: string }) {
  const { threadUnlocked, beginReveal, roomsExplored, reveal, setReveal, nextConnection } =
    useArchive();
  const reduced = useReducedMotion();
  const [travel, setTravel] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [armed, setArmed] = useState(false);
  const raf = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const fire = useCallback(() => {
    beginReveal(artifactId);
  }, [artifactId, beginReveal]);

  const pull = useCallback(() => {
    if (reduced) {
      fire();
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 520);
      setTravel(t);
      if (t < 1) raf.current = requestAnimationFrame(step);
      else {
        setTravel(0);
        fire();
      }
    };
    raf.current = requestAnimationFrame(step);
  }, [fire, reduced]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /* pointer drag */
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const scale = rect.width / 220; // viewBox is 220 wide
      const vx = (e.clientX - rect.left) / scale;
      setTravel(Math.max(0, Math.min(1, (vx - 34) / TRACK)));
    };
    const onUp = () => {
      setDragging(false);
      setTravel((t) => {
        if (t > 0.78) {
          fire();
          return 0;
        }
        return t;
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, fire]);

  const next = nextConnection(artifactId);
  const knobX = 34 + travel * TRACK;
  const live = Boolean(reveal);

  if (!threadUnlocked) {
    return (
      <div className="border border-dashed border-rule-2 p-4">
        <span className="mono-xs block text-faint">The thread is dormant</span>
        <p className="mt-2 font-serif text-[0.98rem] leading-[1.55] text-smoke">
          It wakes when you have consulted artifacts in three different rooms. You have entered{" "}
          {roomsExplored}.
        </p>
        <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn("h-1.5 w-1.5 rounded-full", i < roomsExplored ? "bg-thread" : "ring-1 ring-rule-2")}
            />
          ))}
          <span className="mono-xs ml-2 text-faint">{roomsExplored}/3 rooms</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border p-4 transition-colors duration-500",
        live ? "border-thread bg-ivory" : "border-ink/70",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="mono-xs text-thread">The red thread</span>
        <span className="mono-xs text-faint tabular-nums">{Math.round(travel * 100)}%</span>
      </div>

      <div
        ref={boxRef}
        className="relative mt-4 select-none"
        onPointerDown={(e) => {
          if (reduced) return;
          e.preventDefault();
          setDragging(true);
        }}
      >
        <svg
          width="100%"
          height="46"
          viewBox="0 0 220 46"
          className="touch-none"
          aria-hidden="true"
        >
          <path
            d={`M 34 23 C ${34 + travel * 60} 23, ${knobX - 40} ${23 - travel * 4}, ${knobX} 23`}
            fill="none"
            stroke="#b3261e"
            strokeWidth="1.6"
          />
          <circle cx="34" cy="23" r="4" fill="#b3261e" />
          <circle cx={knobX} cy={23} r="6.5" fill="#f2eee4" stroke="#b3261e" strokeWidth="1.6" />
          {travel > 0.2 ? (
            <circle cx={knobX} cy="23" r={10 + travel * 6} fill="none" stroke="#b3261e" opacity={0.3} strokeWidth="1" />
          ) : null}
        </svg>
      </div>

      <p className="mono-xs mt-1 leading-relaxed text-faint">
        Drag the knot to the right — or use the button. {next ? `Next: ${next.from} ↔ ${next.to}` : "Everything from here is already traced."}
      </p>

      <button
        type="button"
        onClick={pull}
        onMouseEnter={() => setArmed(true)}
        onMouseLeave={() => setArmed(false)}
        className="mono-xs mt-4 flex w-full items-center justify-between border border-thread px-3 py-2.5 text-thread transition-colors hover:bg-thread hover:text-paper"
      >
        <span>Trace the next connection</span>
        <span aria-hidden="true">→</span>
      </button>

      {live ? (
        <button
          type="button"
          onClick={() => setReveal(null)}
          className="mono-xs mt-2 w-full py-1 text-faint transition-colors hover:text-ink"
        >
          Close the connection
        </button>
      ) : (
        <span className="sr-only" aria-live="polite">
          {armed ? "Ready to trace the next connection." : ""}
        </span>
      )}
    </div>
  );
}
