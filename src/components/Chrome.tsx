import { useEffect, useMemo, useState } from "react";
import { STATS, artifactById } from "@/data/artifacts";
import { DOMAINS, domainById } from "@/data/types";
import { useArchive, artifactsInRoom, connectionsOf } from "@/state/archive";
import { Marker } from "./ui";
import { cn } from "@/utils/cn";
import { useSound } from "@/lib/hooks";

/* ============================================================
   CHROME — the persistent finding-aid furniture.
   Top: where you are, and the four ways through the archive.
   Bottom: what the archive currently knows about you.
   ============================================================ */

export default function Chrome() {
  const {
    route,
    navigate,
    visitedCount,
    roomsExplored,
    traced,
    sound,
    setSound,
    setSearch,
    threadUnlocked,
  } = useArchive();
  const play = useSound(sound);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const location = useMemo(() => {
    switch (route.view) {
      case "room":
        return `ROOM ${domainById(route.id).numeral} · ${domainById(route.id).name.toUpperCase()}`;
      case "artifact": {
        const a = artifactById(route.id);
        return a ? `CASE FILE ${a.id} · ${domainById(a.domain).name.toUpperCase()}` : "ARCHIVE";
      }
      case "index":
        return "THE INDEX · FINDING AID";
      case "exit":
        return "THE EXIT";
      default:
        return "ENTRANCE HALL";
    }
  }, [route]);

  return (
    <>
      {/* ---------------- top ---------------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled ? "bg-paper/92 backdrop-blur-[2px]" : "bg-transparent",
        )}
      >
        <div className="border-b border-rule/80">
          <div className="mx-auto flex h-12 max-w-[1680px] items-stretch gap-0 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => navigate({ view: "entry" })}
              className="group flex shrink-0 items-center gap-2.5 pr-4 sm:pr-6"
              aria-label="The Museum of My Mind — entrance hall"
            >
              <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" className="overflow-visible">
                <path
                  d="M0 5 C 6 5, 7 1, 13 1 S 20 9, 26 5"
                  fill="none"
                  stroke="#b3261e"
                  strokeWidth="1.2"
                />
                <circle cx="13" cy="1" r="1.8" fill="#b3261e" />
              </svg>
              <span className="mono text-[10px] uppercase tracking-[0.22em] text-ink">
                <span className="sm:hidden">Museum</span>
                <span className="hidden sm:inline">Museum&nbsp;of&nbsp;My&nbsp;Mind</span>
              </span>
            </button>

            <span className="mono-xs hidden items-center border-l border-rule pl-4 text-faint md:flex">
              {location}
            </span>

            <nav aria-label="Archive navigation" className="ml-auto flex items-center gap-0">
              <span className="mono-xs hidden items-center gap-4 pr-5 lg:flex">
                {DOMAINS.map((d) => {
                  const active = route.view === "room" && route.id === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => navigate({ view: "room", id: d.id })}
                      title={`${d.name} — ${d.purpose}`}
                      className={cn(
                        "transition-colors duration-200",
                        active ? "text-thread" : "text-smoke hover:text-ink",
                      )}
                    >
                      <span className="tabular-nums">{d.numeral}</span>
                    </button>
                  );
                })}
                <span aria-hidden="true" className="h-3 w-px bg-rule" />
              </span>

              <button
                type="button"
                onClick={() => navigate({ view: "index" })}
                className={cn(
                  "mono-xs border-l border-rule px-3 py-4 transition-colors duration-200 hover:text-thread sm:px-4",
                  route.view === "index" ? "text-thread" : "text-smoke",
                )}
              >
                Index
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearch(true);
                  play("open");
                }}
                className="mono-xs flex items-center gap-2 border-l border-rule px-3 py-4 text-smoke transition-colors duration-200 hover:text-thread sm:px-4"
              >
                Search
                <span className="hidden text-[9px] text-faint sm:inline">/</span>
              </button>

              <button
                type="button"
                onClick={() => setSound(!sound)}
                aria-pressed={sound}
                aria-label={`Sound ${sound ? "on" : "off"} — the museum is silent unless asked`}
                className={cn(
                  "mono-xs border-l border-rule px-3 py-4 transition-colors duration-200 sm:px-4",
                  sound ? "text-thread" : "text-faint hover:text-smoke",
                )}
                title="The museum is silent unless you ask it to speak"
              >
                <span aria-hidden="true" className="sm:hidden">
                  {sound ? "♪" : "◇"}
                </span>
                <span aria-hidden="true" className="hidden sm:inline">
                  Sound&nbsp;{sound ? "on" : "off"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate({ view: "exit" })}
                className={cn(
                  "mono-xs border-l border-rule px-3 py-4 transition-colors duration-200 hover:text-thread sm:px-4",
                  route.view === "exit" ? "text-thread" : "text-smoke",
                )}
              >
                Exit
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ---------------- bottom marginalia (desktop) ---------------- */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden border-t border-rule/70 bg-paper/85 backdrop-blur-[2px] lg:block">
        <div className="mx-auto flex h-9 max-w-[1680px] items-center justify-between px-6">
          <span className="mono-xs text-faint">
            Artifacts consulted{" "}
            <span className="text-graphite tabular-nums">
              {String(visitedCount).padStart(2, "0")}
            </span>
            <span className="text-faint">/{STATS.artifacts}</span>
          </span>
          <span className="mono-xs text-faint">
            Rooms entered{" "}
            <span className="text-graphite tabular-nums">{roomsExplored}</span>
            <span className="text-faint">/{STATS.domains}</span>
          </span>
          <span className="mono-xs text-faint">
            Connections traced{" "}
            <span className="text-graphite tabular-nums">{traced.length}</span>
            <span className="text-faint">/{STATS.connections}</span>
          </span>
          <span
            className={cn(
              "mono-xs transition-colors duration-700",
              threadUnlocked ? "text-thread" : "text-faint/70",
            )}
          >
            {threadUnlocked
              ? "Thread live — it can now be pulled"
              : "Thread dormant — enter a third room"}
          </span>
        </div>
      </div>

      {/* ---------------- vertical location label (very wide screens) ---------------- */}
      <span
        aria-hidden="true"
        className="vertical-rl mono-xs pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 whitespace-nowrap text-faint/70 min-[1700px]:block"
      >
        The Museum of My Mind · {location.toLowerCase()}
      </span>

      {/* ---------------- mobile thread rail ---------------- */}
      <MobileRail />
    </>
  );
}

/* ============================================================
   MOBILE RAIL — the thread, folded into a compact route
   indicator. Same line, different physical form.
   ============================================================ */

function MobileRail() {
  const { route, navigate, threadUnlocked, visitedCount, roomsExplored, reveal, beginReveal } =
    useArchive();
  const [hint, setHint] = useState(false);

  const items = useMemo(() => {
    if (route.view === "artifact") {
      const a = artifactById(route.id);
      if (!a) return [];
      const room = artifactsInRoom(a.domain);
      const others = connectionsOf(a.id)
        .map((e) => artifactById(e.a === a.id ? e.b : e.a))
        .filter(Boolean);
      const set = new Map<string, typeof room[number]>();
      [...room, ...(others as typeof room)].forEach((x) => x && set.set(x.id, x));
      return Array.from(set.values()).sort((x, y) => x.thread - y.thread);
    }
    if (route.view === "room") return artifactsInRoom(route.id);
    return [];
  }, [route]);

  useEffect(() => {
    if (!threadUnlocked || route.view !== "artifact") return;
    const t = window.setTimeout(() => setHint(true), 1200);
    return () => window.clearTimeout(t);
  }, [threadUnlocked, route]);

  if (route.view === "exit" || route.view === "entry" || route.view === "index") return null;

  const current = route.view === "artifact" ? route.id : undefined;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur-[3px] lg:hidden">
      <div className="flex items-center gap-3 px-4 pt-2.5">
        <span className="mono-xs shrink-0 text-faint">
          {route.view === "artifact" ? "Thread" : route.view === "room" ? "Room" : "Route"}
        </span>
        <div className="relative flex-1 overflow-x-auto">
          <div className="relative flex min-w-max items-center gap-5 pb-2.5">
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-[3px] h-px bg-rule-2"
            />
            {items.map((a) => (
              <Marker
                key={a.id}
                id={a.id}
                label={a.id}
                size="sm"
                visited={a.id === current || undefined}
                onClick={() => navigate({ view: "artifact", id: a.id })}
                className="relative z-10 bg-paper pr-1"
              />
            ))}
            {!items.length && (
              <span className="mono-xs relative z-10 bg-paper pb-2.5 text-faint">
                Entry · pull the thread from any case file
              </span>
            )}
          </div>
        </div>
      </div>

      {route.view === "artifact" ? (
        threadUnlocked ? (
          <div className="flex items-center justify-between gap-3 border-t border-rule px-4 py-2">
            <span className="mono-xs text-graphite">
              {hint && !reveal ? "A connection is waiting here" : "Trace this artifact"}
            </span>
            <button
              type="button"
              onClick={() => beginReveal(route.view === "artifact" ? route.id : "")}
              className="mono-xs border border-thread px-3 py-1.5 text-thread transition-colors hover:bg-thread hover:text-paper"
            >
              Pull the thread →
            </button>
          </div>
        ) : (
          <div className="border-t border-rule px-4 py-2">
            <span className="mono-xs text-faint">
              Rooms entered {roomsExplored}/3 · artifacts {visitedCount} — the thread wakes when you
              have looked in three rooms
            </span>
          </div>
        )
      ) : null}
    </div>
  );
}
