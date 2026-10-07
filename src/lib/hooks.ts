import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================
   Motion / environment hooks
   ============================================================ */

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/** Rises once, on demand — used for staggered editorial entry. */
export function useMounted(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return on;
}

/* ============================================================
   SOUND — architectural hook only.
   The museum is silent by default. Nothing here ever plays
   without an explicit, remembered, user action.
   ============================================================ */

type Cue = "trace" | "reveal" | "open";

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (cue: Cue) => {
      if (!enabled) return;
      try {
        if (!ctxRef.current) {
          const Ctor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          ctxRef.current = new Ctor();
        }
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        // Paper-quiet, single-voice cues. Deliberately unmusical.
        const freq = cue === "reveal" ? 196 : cue === "trace" ? 392 : 261.6;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.028, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } catch {
        /* audio unavailable — silence is the correct failure */
      }
    },
    [enabled],
  );

  useEffect(() => () => void ctxRef.current?.close(), []);
  return play;
}

/* ============================================================
   Small geometry / random helpers shared by renderers
   ============================================================ */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
