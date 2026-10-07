import { useMemo, useState } from "react";
import { ARTIFACTS, EDGES, STATS, artifactById } from "@/data/artifacts";
import { DOMAINS } from "@/data/types";
import { useArchive } from "@/state/archive";
import { Marker, StatusMark, TypeMark } from "./ui";
import { cn } from "@/utils/cn";

/* ============================================================
   THE INDEX — finding aid
   The reliable route through the archive: every artifact, its
   type, its status, its connections, and whether you have
   consulted it. Nothing conceptual is allowed to hide usability.
   ============================================================ */

export default function IndexView() {
  const { navigate, isVisited, traced, threadUnlocked } = useArchive();
  const [onlyUnseen, setOnlyUnseen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      DOMAINS.map((d) => ({
        domain: d,
        items: ARTIFACTS.filter(
          (a) => a.domain === d.id && (!onlyUnseen || !isVisited(a.id)),
        ),
      })),
    [onlyUnseen, isVisited],
  );

  const hovered = hover ? artifactById(hover) : null;

  return (
    <section className="pt-24 pb-28 lg:pt-32 lg:pb-32">
      {/* ---------------- heading ---------------- */}
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:grid lg:grid-cols-[92px_minmax(0,1fr)] lg:gap-8 lg:px-6">
        <div aria-hidden="true" />
        <header>
          <span className="mono-xs text-thread">Finding aid · revised continuously</span>
          <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6.5rem)] font-semibold uppercase text-ink">
            The Index
          </h1>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-rule py-4">
            <span className="mono-xs text-graphite tabular-nums">
              {String(STATS.domains).padStart(2, "0")} rooms
            </span>
            <span className="mono-xs text-graphite tabular-nums">
              {String(STATS.artifacts).padStart(2, "0")} artifacts
            </span>
            <span className="mono-xs text-graphite tabular-nums">
              {String(STATS.connections).padStart(2, "0")} connections
            </span>
            <span className="mono-xs text-graphite tabular-nums">
              {String(traced.length).padStart(2, "0")} traced
            </span>
            <div className="ml-auto flex items-center gap-4">
              <button
                type="button"
                onClick={() => setOnlyUnseen((v) => !v)}
                aria-pressed={onlyUnseen}
                className={cn(
                  "mono-xs border px-3 py-1.5 transition-colors",
                  onlyUnseen
                    ? "border-thread bg-thread text-paper"
                    : "border-rule text-smoke hover:border-ink hover:text-ink",
                )}
              >
                {onlyUnseen ? "Showing unconsulted" : "Show unconsulted only"}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ---------------- the map ---------------- */}
      <div className="mx-auto mt-12 max-w-[1680px] px-5 sm:px-8 lg:grid lg:grid-cols-[92px_minmax(0,1fr)] lg:gap-8 lg:px-6">
        <div aria-hidden="true" />
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="mono-xs text-ink">The map · every connection in the collection</h2>
            <p className="mono-xs text-faint">
              {threadUnlocked
                ? "Red = traced by you · dotted = recorded but untraced"
                : "Dotted lines are recorded relationships. Pull the thread to trace them."}
            </p>
          </div>
          <ThreadMap hover={hover} setHover={setHover} />
        </div>
      </div>

      {/* ---------------- the aid ---------------- */}
      <div className="mx-auto mt-16 max-w-[1680px] px-5 sm:px-8 lg:px-6">
        <div className="lg:pl-[calc(92px+2rem)]">
          {rows.map(({ domain, items }) => {
            const types = items.reduce<Record<string, number>>((acc, a) => {
              acc[a.type] = (acc[a.type] ?? 0) + 1;
              return acc;
            }, {});
            return (
              <section key={domain.id} className="mt-12 first:mt-0" aria-labelledby={`h-${domain.id}`}>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-ink pb-2">
                  <h3 id={`h-${domain.id}`} className="flex items-baseline gap-3">
                    <span className="mono-xs text-thread">{domain.numeral}</span>
                    <span className="font-serif text-[1.35rem] leading-none text-ink">
                      {domain.name}
                    </span>
                  </h3>
                  <span className="mono-xs text-faint">{domain.purpose}</span>
                  <span className="mono-xs ml-auto text-faint tabular-nums">
                    {Object.entries(types)
                      .map(([t, n]) => `${String(n).padStart(2, "0")} ${t.toLowerCase()}`)
                      .join(" · ")}
                  </span>
                </div>

                <ul className="mt-1">
                  {items.map((a) => {
                    const live = hovered?.id === a.id;
                    return (
                      <li key={a.id} className="relative">
                        <div className="pointer-events-none absolute -left-0 top-0 hidden h-full lg:block lg:-ml-[calc(92px+2rem)] lg:w-[calc(92px+2rem)]">
                          <div className="flex h-full items-center">
                            <Marker
                              id={a.id}
                              label=""
                              visited={isVisited(a.id) || undefined}
                              broken={
                                a.connections.some((c) => !traced.includes([a.id, c.id].sort().join("→"))) ||
                                undefined
                              }
                              onClick={() => navigate({ view: "artifact", id: a.id })}
                              className="pointer-events-auto justify-start"
                              title={`${a.id} — ${a.title}`}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate({ view: "artifact", id: a.id })}
                          onMouseEnter={() => setHover(a.id)}
                          onFocus={() => setHover(a.id)}
                          onMouseLeave={() => setHover((h) => (h === a.id ? null : h))}
                          className={cn(
                            "grid w-full grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-rule/60 py-3 text-left transition-colors duration-200 sm:grid-cols-[3.6rem_minmax(0,1fr)_auto] sm:gap-x-6",
                            live ? "bg-ivory" : "hover:bg-ivory/70",
                          )}
                        >
                          <span className="mono-xs text-faint">{a.id}</span>
                          <span className="min-w-0">
                            <span
                              className={cn(
                                "block truncate font-serif text-[1.06rem] leading-snug transition-colors",
                                live ? "text-thread" : "text-ink",
                                a.status === "ABANDONED" || a.status === "SEALED"
                                  ? "opacity-80"
                                  : "",
                              )}
                            >
                              {a.title}
                              {a.featured ? (
                                <span className="mono-xs ml-2 align-middle text-thread">★</span>
                              ) : null}
                            </span>
                            <span className="mono mt-1 block truncate text-[11px] text-smoke">
                              {a.short}
                            </span>
                          </span>
                          <span className="col-span-2 flex items-baseline gap-4 sm:col-span-1 sm:justify-end">
                            <TypeMark type={a.type} className="hidden sm:inline" />
                            <span className="mono-xs text-faint tabular-nums">{a.year}</span>
                            <StatusMark status={a.status} />
                            <span className="mono-xs hidden text-faint tabular-nums md:inline">
                              ↔{String(a.connections.length).padStart(2, "0")}
                            </span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                "h-1.5 w-1.5 shrink-0 rounded-full",
                                isVisited(a.id) ? "bg-thread" : "ring-1 ring-ink/40",
                              )}
                            />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {!items.length ? (
                    <li className="mono-xs border-b border-rule/60 py-4 text-faint">
                      Nothing unconsulted in this room.
                    </li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   THE MAP — the archive drawn as a graph.
   Position is derived from the artifact data (thread position ×
   domain band), never hand-placed, so the map is true whatever
   the collection becomes.
   ============================================================ */

function ThreadMap({
  hover,
  setHover,
}: {
  hover: string | null;
  setHover: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { navigate, isVisited, isTraced } = useArchive();
  const W = 1000;
  const BAND = 108;
  const H = DOMAINS.length * BAND + 34;

  const pos = useMemo(() => {
    const map = new Map<string, { x: number; y: number; a: (typeof ARTIFACTS)[number] }>();
    DOMAINS.forEach((d, i) => {
      const items = ARTIFACTS.filter((a) => a.domain === d.id);
      items.forEach((a, j) => {
        map.set(a.id, {
          x: 128 + (a.thread * 0.82 + (j / Math.max(1, items.length - 1)) * 0.18) * (W - 200),
          y: 44 + i * BAND + (j % 2 === 0 ? 0 : 16),
          a,
        });
      });
    });
    return map;
  }, []);

  const hovered = hover ? pos.get(hover) : null;
  const active = new Set<string>();
  if (hovered) {
    active.add(hovered.a.id);
    hovered.a.connections.forEach((c) => active.add(c.id));
  }

  return (
    <div className="mt-3 overflow-x-auto border border-rule bg-ivory/60 p-3 sm:p-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full min-w-[38rem]"
        role="img"
        aria-label="Map of the archive: five bands of artifacts, connected by lines indicating recorded relationships."
      >
        {DOMAINS.map((d, i) => {
          const y = 44 + i * BAND;
          return (
            <g key={d.id}>
              <line x1={40} y1={y - 26} x2={W - 24} y2={y - 26} stroke="#d3cdbc" strokeWidth={1} />
              <text
                x={40}
                y={y - 34}
                fontSize={13.5}
                letterSpacing={1.8}
                fill="#6f6b5e"
                fontFamily="var(--font-mono)"
              >
                {`ROOM ${d.numeral} · ${d.name.toUpperCase()}`}
              </text>
            </g>
          );
        })}

        {EDGES.map((e) => {
          const A = pos.get(e.a);
          const B = pos.get(e.b);
          if (!A || !B) return null;
          const tracedEdge = isTraced(e.a, e.b);
          const on = active.has(e.a) && active.has(e.b);
          const my = (A.y + B.y) / 2;
          const d = `M ${A.x} ${A.y} C ${A.x} ${my + 18}, ${B.x} ${my - 18}, ${B.x} ${B.y}`;
          return (
            <path
              key={`${e.a}-${e.b}`}
              d={d}
              fill="none"
              stroke={tracedEdge ? "#b3261e" : "#3c3a31"}
              strokeWidth={tracedEdge ? 1.3 : 0.7}
              strokeDasharray={tracedEdge ? undefined : "3 4"}
              opacity={tracedEdge ? 0.85 : on ? 0.5 : 0.2}
            />
          );
        })}

        {Array.from(pos.values()).map(({ a, x, y }) => {
          const visited = isVisited(a.id);
          const on = active.has(a.id);
          return (
            <g
              key={a.id}
              role="button"
              tabIndex={0}
              aria-label={`${a.id} — ${a.title}. ${a.type}. ${a.connections.length} connections.`}
              onClick={() => navigate({ view: "artifact", id: a.id })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate({ view: "artifact", id: a.id });
                }
              }}
              onMouseEnter={() => setHover(a.id)}
              onFocus={() => setHover(a.id)}
              onMouseLeave={() => setHover((h) => (h === a.id ? null : h))}
              onBlur={() => setHover((h) => (h === a.id ? null : h))}
              className="cursor-pointer"
            >
              <circle cx={x} cy={y} r={12} fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={on ? 5.4 : 4}
                fill={visited ? "#b3261e" : "#faf8f2"}
                stroke={on ? "#b3261e" : "#16150f"}
                strokeWidth={1.2}
              />
              <text
                x={x}
                y={y - 10}
                fontSize={9.5}
                textAnchor="middle"
                letterSpacing={1}
                fill={on ? "#b3261e" : "#9a9484"}
                fontFamily="var(--font-mono)"
              >
                {a.id}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex min-h-[3.25rem] items-start justify-between gap-6 border-t border-rule pt-3">
        {hovered ? (
          <p className="max-w-[62ch]">
            <span className="mono-xs text-thread">{hovered.a.id}</span>
            <span className="ml-2 font-serif text-[1.02rem] text-ink">{hovered.a.title}</span>
            <span className="mono mt-1 block text-[11px] leading-relaxed text-smoke">
              {hovered.a.short} · {hovered.a.connections.length} connections
            </span>
          </p>
        ) : (
          <p className="mono-xs text-faint">
            Hover, focus or tap a node. Cross-band lines are the relationships between rooms.
          </p>
        )}
        <span className="mono-xs hidden shrink-0 text-faint sm:block">
          {DOMAINS.map((d) => d.numeral).join(" · ")}
        </span>
      </div>
    </div>
  );
}

export { ThreadMap };
