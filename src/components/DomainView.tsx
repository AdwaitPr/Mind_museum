import { useMemo, useState } from "react";
import { ARTIFACTS, artifactById } from "@/data/artifacts";
import { DOMAINS, domainById, type DomainId } from "@/data/types";
import { useArchive } from "@/state/archive";
import { Marker, StatusMark, TypeMark } from "./ui";
import Specimen from "./Specimen";
import { cn } from "@/utils/cn";

/* ============================================================
   THE ROOMS
   A room is a mode of thought, not a category of output.
   Principal accessions get a plate; the rest of the room is
   shelved as a ledger. Density varies on purpose.
   ============================================================ */

export default function DomainView({ id }: { id: DomainId }) {
  const domain = domainById(id);
  const { navigate, isVisited, traced } = useArchive();
  const [hover, setHover] = useState<string | null>(null);

  const items = useMemo(() => ARTIFACTS.filter((a) => a.domain === id), [id]);
  const principal = items.filter((a) => a.featured);
  const remainder = items.filter((a) => !a.featured);

  const byType = items.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {});

  const crossDomain = useMemo(() => {
    const counts = new Map<DomainId, number>();
    items.forEach((a) =>
      a.connections.forEach((c) => {
        const t = artifactById(c.id);
        if (t && t.domain !== id) counts.set(t.domain, (counts.get(t.domain) ?? 0) + 1);
      }),
    );
    return counts;
  }, [items, id]);

  return (
    <section className="pt-24 pb-28 lg:pt-32 lg:pb-32">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:grid lg:grid-cols-[92px_minmax(0,1fr)_300px] lg:gap-8 lg:px-6">
        {/* gutter — the thread runs through every artifact in the room */}
        <div className="relative hidden lg:block" aria-hidden="true">
          <div className="sticky top-24 flex flex-col gap-7 pt-2">
            {items.map((a) => (
              <Marker
                key={a.id}
                id={a.id}
                label={a.id}
                visited={isVisited(a.id) || undefined}
                broken={
                  a.connections.some(
                    (c) => !traced.includes([a.id, c.id].sort().join("→")),
                  ) || undefined
                }
                onClick={() => navigate({ view: "artifact", id: a.id })}
                title={`${a.id} — ${a.title}`}
              />
            ))}
            <span className="mono-xs pt-2 leading-relaxed text-faint/70">
              Thread · {items.length} nodes
            </span>
          </div>
        </div>

        {/* room body */}
        <div className="min-w-0">
          <header className="border-b border-ink pb-8">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="mono-xs text-thread">{domain.room}</span>
              <span className="mono-xs text-faint">{domain.purpose}</span>
              <span className="mono-xs ml-auto text-faint tabular-nums">
                {String(items.length).padStart(2, "0")} artifacts
              </span>
            </div>
            <h1 className="display mt-5 text-[clamp(2.4rem,7.5vw,5.6rem)] font-semibold uppercase text-ink">
              {domain.name}
            </h1>
            <p className="measure mt-6 border-l-2 border-thread pl-5 font-serif text-[1.15rem] italic leading-[1.55] text-graphite">
              {domain.epigraph}
            </p>
          </header>

          {/* principal accessions */}
          <div className="mt-12">
            <div className="flex items-baseline gap-3">
              <span className="mono-xs text-thread">A</span>
              <span className="mono-xs text-faint">Principal accessions</span>
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </div>
            <div className="mt-2 divide-y divide-rule/60">
              {principal.map((a, i) => (
                <article
                  key={a.id}
                  className="rise py-8 first:pt-6"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="mono-xs text-ink">{a.accession}</span>
                    <TypeMark type={a.type} />
                    <StatusMark status={a.status} />
                    <span className="mono-xs text-faint tabular-nums">{a.year}</span>
                    <span className="mono-xs ml-auto text-faint tabular-nums">
                      ↔ {String(a.connections.length).padStart(2, "0")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate({ view: "artifact", id: a.id })}
                    onMouseEnter={() => setHover(a.id)}
                    onMouseLeave={() => setHover((h) => (h === a.id ? null : h))}
                    className="group mt-3 grid w-full gap-6 text-left lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-10"
                  >
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block font-serif text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.08] transition-colors duration-300",
                          hover === a.id ? "text-thread" : "text-ink",
                        )}
                      >
                        {a.title}
                      </span>
                      <span className="measure mt-4 block font-serif text-[1.02rem] leading-[1.62] text-graphite">
                        {a.summary}
                      </span>
                      <span className="mono-xs mt-5 inline-flex items-center gap-2 text-smoke transition-colors group-hover:text-thread">
                        Open case file
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </span>
                    <span className="hidden lg:block">
                      <Specimen
                        seed={a.id + a.title}
                        kindOf={firstEvidenceKind(a.id) ?? "DOCUMENT"}
                        aspect={1.45}
                        label={`PLATE · ${a.id}`}
                        caption={a.short}
                        alt={a.alt}
                      />
                    </span>
                  </button>
                </article>
              ))}
              {!principal.length ? (
                <p className="mono-xs py-6 text-faint">
                  No principal accessions in this room — everything here is shelved.
                </p>
              ) : null}
            </div>
          </div>

          {/* the rest of the room */}
          <div className="mt-14">
            <div className="flex items-baseline gap-3">
              <span className="mono-xs text-thread">B</span>
              <span className="mono-xs text-faint">The rest of the room</span>
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </div>
            <ul className="mt-2">
              {remainder.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => navigate({ view: "artifact", id: a.id })}
                    onMouseEnter={() => setHover(a.id)}
                    onMouseLeave={() => setHover((h) => (h === a.id ? null : h))}
                    className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-rule/60 py-3.5 text-left transition-colors hover:bg-ivory/70 sm:gap-x-6"
                  >
                    <span className="mono-xs text-faint">{a.id}</span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate font-serif text-[1.08rem] leading-snug transition-colors",
                          hover === a.id ? "text-thread" : "text-ink",
                        )}
                      >
                        {a.title}
                      </span>
                      <span className="mono mt-1 block truncate text-[11px] text-smoke">
                        {a.short}
                      </span>
                    </span>
                    <span className="flex items-baseline gap-3 sm:gap-5">
                      <TypeMark type={a.type} className="hidden sm:inline" />
                      <span className="mono-xs text-faint tabular-nums">{a.year}</span>
                      <StatusMark status={a.status} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* marginalia */}
        <aside className="mt-14 border-t border-rule pt-7 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-24">
          <h2 className="mono-xs text-faint">Room apparatus</h2>
          <dl className="mt-4">
            {Object.entries(byType).map(([t, n]) => (
              <div
                key={t}
                className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-rule/60 py-2"
              >
                <dt className="mono-xs text-smoke">{t}</dt>
                <dd className="mono text-[11px] text-graphite tabular-nums">
                  {String(n).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mono-xs mt-8 text-faint">Threads leaving this room</h3>
          <ul className="mt-3 space-y-1.5">
            {DOMAINS.filter((d) => d.id !== id).map((d) => {
              const n = crossDomain.get(d.id) ?? 0;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => navigate({ view: "room", id: d.id })}
                    className="group flex w-full items-baseline justify-between gap-3 py-1 text-left"
                  >
                    <span className="mono-xs text-smoke transition-colors group-hover:text-thread">
                      <span className="mr-2 text-faint">{d.numeral}</span>
                      {d.name}
                    </span>
                    <span
                      className={cn(
                        "mono text-[11px] tabular-nums",
                        n ? "text-thread" : "text-faint",
                      )}
                    >
                      {n ? `↔ ${String(n).padStart(2, "0")}` : "—"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mono-xs mt-8 leading-relaxed text-faint">
            Rooms are modes of thought. The threads leaving a room are usually more interesting than
            what is inside it.
          </p>
        </aside>
      </div>
    </section>
  );
}

function firstEvidenceKind(id: string) {
  const a = artifactById(id);
  const ev = a?.blocks?.find((b) => b.kind === "evidence");
  return ev && ev.kind === "evidence" ? ev.kindOf : null;
}
