import { useEffect, useRef } from "react";
import {
  buildPoints,
  drawThread,
  emitThreadPulse,
  onThreadPulse,
  type Pt,
  type ThreadNode,
} from "@/lib/thread";
import { useReducedMotion } from "@/lib/hooks";
import { useArchive } from "@/state/archive";

/* ============================================================
   THREAD LAYER — desktop / tablet
   ------------------------------------------------------------
   DOM owns the content. Canvas owns the line. The contract
   between them is a single attribute:

     <element data-thread-node="O-03" data-visited data-broken>

   The thread therefore always describes the real document:
   it passes through the artifacts currently on the page, in
   reading order, and breaks wherever a connection is untraced.
   ============================================================ */

export default function ThreadLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { route, isVisited, traced, reveal } = useArchive();

  const stateRef = useRef({
    nodes: [] as ThreadNode[],
    dormantY: null as number | null,
    pointer: null as Pt | null,
    smooth: null as Pt | null,
    alpha: 0,
    pulses: [] as { p: number; born: number; life: number }[],
    dirty: true,
  });

  /* read anchors out of the document */
  const measure = () => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-thread-node]"));
    const scrollY = window.scrollY;
    stateRef.current.nodes = els
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.dataset.threadNode ?? "",
          x: r.left + r.width / 2,
          y: r.top + r.height / 2 + scrollY,
          visited: el.hasAttribute("data-visited"),
          broken: el.hasAttribute("data-broken"),
        } as ThreadNode;
      })
      .filter((n) => n.id)
      .sort((a, b) => a.y - b.y);

    const dormant = document.querySelector<HTMLElement>("[data-thread-dormant]");
    stateRef.current.dormantY = dormant
      ? dormant.getBoundingClientRect().top + dormant.getBoundingClientRect().height / 2 + scrollY
      : null;
    stateRef.current.dirty = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measure();
    };

    const onPointer = (e: PointerEvent) => {
      stateRef.current.pointer = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      stateRef.current.pointer = null;
    };
    const onScroll = () => {
      stateRef.current.dirty = true;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    const offPulse = onThreadPulse(() => {
      stateRef.current.pulses.push({ p: 0, born: performance.now(), life: 1500 });
    });

    /* layout settles (specimens, fonts) — re-measure a few times */
    const settle = [180, 600, 1400].map((ms) => window.setTimeout(measure, ms));
    const interval = window.setInterval(measure, 2500);

    const frame = (now: number) => {
      const s = stateRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // eased pointer for a tactile, non-twitchy response
      if (s.pointer) {
        if (!s.smooth) s.smooth = { ...s.pointer };
        s.smooth.x += (s.pointer.x - s.smooth.x) * 0.12;
        s.smooth.y += (s.pointer.y - s.smooth.y) * 0.12;
      } else if (s.smooth) {
        s.smooth.x += (0 - s.smooth.x) * 0.05;
        s.smooth.y += (0 - s.smooth.y) * 0.05;
      }

      s.alpha += ((reduced ? 1 : 0.95) - s.alpha) * 0.05;
      s.pulses = s.pulses.filter((p) => now - p.born < p.life);

      if (s.dirty || !reduced) {
        const scrollY = window.scrollY;
        const view = s.nodes.map((n) => ({ ...n, y: n.y - scrollY }));
        const pointer = s.smooth && !reduced ? s.smooth : null;
        const pts = buildPoints(
          view,
          w,
          h,
          now,
          pointer,
          reduced ? 0 : 1,
          s.dormantY !== null ? s.dormantY - scrollY : undefined,
        );
        ctx.clearRect(0, 0, w, h);
        drawThread(ctx, {
          pts,
          nodes: view,
          pulses: s.pulses,
          now,
          reduced,
          alpha: Math.min(1, s.alpha),
        });
        if (reduced) s.dirty = false;
      }
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisible = () => {
      if (!document.hidden) {
        measure();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
      settle.forEach((t) => window.clearTimeout(t));
      offPulse();
    };
  }, [reduced]);

  /* re-measure + pulse whenever the investigation moves on */
  useEffect(() => {
    measure();
    if (route.view !== "entry") emitThreadPulse();
    const t = window.setTimeout(measure, 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, traced.length, reveal]);

  /* keep visited flags live without re-creating the canvas loop */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-thread-node]");
    els.forEach((el) => {
      const id = el.dataset.threadNode;
      if (!id) return;
      if (isVisited(id)) el.setAttribute("data-visited", "");
      else el.removeAttribute("data-visited");
    });
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisited, stateRef.current.nodes.length]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
    />
  );
}
