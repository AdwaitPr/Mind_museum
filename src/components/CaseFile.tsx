import { useMemo, useState } from "react";
import { ARTIFACTS, artifactById } from "@/data/artifacts";
import { domainById } from "@/data/types";
import { useArchive } from "@/state/archive";
import { Marker, MetaRow, Rich, StatusMark, TypeMark } from "./ui";
import Specimen from "./Specimen";
import { PullThread } from "./PullThread";
import { cn } from "@/utils/cn";
import type { Artifact, Block } from "@/data/types";

/* ============================================================
   THE CASE FILE
   Not a project page. A folder of evidence, and the folder is
   not the same shape twice: a project is extensive, a sketch is
   three lines, a failure is mostly about what went wrong.
   ============================================================ */

export default function CaseFile({ id }: { id: string }) {
  const art = artifactById(id);
  const { navigate, isVisited, isTraced, threadUnlocked, beginReveal, traced, roomsExplored } =
    useArchive();
  const [openTrace, setOpenTrace] = useState<string | null>(null);

  const room = art ? domainById(art.domain) : null;
  const siblings = useMemo(
    () => (art ? ARTIFACTS.filter((a) => a.domain === art.domain) : []),
    [art],
  );
  const index = art ? siblings.findIndex((a) => a.id === art.id) : -1;
  const next = index >= 0 ? siblings[(index + 1) % siblings.length] : undefined;

  if (!art || !room) return null;

  const connected = art.connections
    .map((c) => ({ c, target: artifactById(c.id) }))
    .filter((x) => x.target);

  return (
    <article className="pt-24 pb-28 lg:pt-28 lg:pb-32">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:grid lg:grid-cols-[92px_minmax(0,1fr)_320px] lg:gap-8 lg:px-6">
        {/* gutter: this artifact, and everything it is joined to */}
        <div className="relative hidden lg:block" aria-hidden="true">
          <div className="sticky top-24 flex flex-col gap-7 pt-2">
            <Marker id={art.id} label={art.id} visited title={`Current case file — ${art.title}`} />
            <span className="mono-xs leading-none text-faint/60">│</span>
            {connected.map(({ target }) => (
              <Marker
                key={target!.id}
                id={target!.id}
                label={target!.id}
                visited={isVisited(target!.id) || undefined}
                broken={!isTraced(art.id, target!.id) || undefined}
                onClick={() => navigate({ view: "artifact", id: target!.id })}
                title={`${target!.id} — ${target!.title}`}
              />
            ))}
            <span className="mono-xs pt-1 leading-relaxed text-faint/70">
              {connected.length} threads from this node
            </span>
          </div>
        </div>

        {/* body */}
        <div className="min-w-0">
          <header>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
              <span className="mono-xs text-thread">Case file {art.id}</span>
              <TypeMark type={art.type} />
              <StatusMark status={art.status} />
              <span className="mono-xs text-faint tabular-nums">{art.year}</span>
              <button
                type="button"
                onClick={() => navigate({ view: "room", id: art.domain })}
                className="mono-xs text-smoke underline decoration-rule-2 underline-offset-4 transition-colors hover:text-thread"
              >
                Room {room.numeral} · {room.name}
              </button>
            </div>

            <h1 className="display mt-5 text-[clamp(2.1rem,6.4vw,4.6rem)] font-semibold text-ink">
              {art.title}
            </h1>

            <p className="measure mt-7 font-serif text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.55] text-graphite">
              {art.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-rule py-3">
              <span className="mono-xs text-faint">{art.accession}</span>
              <span className="mono-xs text-faint">Consulted {isVisited(art.id) ? "yes" : "now"}</span>
              <span className="mono-xs text-faint tabular-nums">
                Thread position {String(Math.round(art.thread * 100)).padStart(3, "0")}
              </span>
              <span className="mono-xs text-faint tabular-nums">
                Connections {String(connected.length).padStart(2, "0")} · traced{" "}
                {String(connected.filter((x) => isTraced(art.id, x.target!.id)).length).padStart(2, "0")}
              </span>
            </div>
          </header>

          {/* ---- the evidence ---- */}
          <div className="mt-12 space-y-12 sm:space-y-14">
            {art.blocks?.map((b, i) => (
              <BlockView
                key={i}
                block={b}
                art={art}
                n={i + 1}
                dropCap={i === (art.blocks ?? []).findIndex((x) => x.kind === "text")}
              />
            ))}
            {!art.blocks?.length ? (
              <p className="mono-xs text-faint">
                No evidence filed with this record yet. The catalogue entry is complete.
              </p>
            ) : null}
          </div>

          {/* ---- connections ---- */}
          <section className="mt-16 border-t-2 border-ink pt-6" aria-labelledby="connections">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 id="connections" className="mono-xs text-ink">
                Connections
              </h2>
              <span className="mono-xs text-faint">
                {connected.length} recorded ·{" "}
                {threadUnlocked
                  ? "pull the thread to trace any of them"
                  : `thread dormant · ${roomsExplored}/3 rooms entered`}
              </span>
            </div>

            <ul className="mt-4">
              {connected.map(({ c, target }) => {
                const tracedEdge = isTraced(art.id, target!.id);
                return (
                  <li
                    key={target!.id}
                    className={cn(
                      "border-b border-rule/60 py-5",
                      tracedEdge && "bg-ivory/60",
                    )}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      <span className="mono-xs text-thread" aria-hidden="true">
                        {art.id} ↔ {target!.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate({ view: "artifact", id: target!.id })}
                        className="font-serif text-[1.12rem] leading-snug text-ink underline decoration-rule-2 underline-offset-4 transition-colors hover:text-thread"
                      >
                        {target!.title}
                      </button>
                      <span className="mono-xs text-faint">
                        Room {domainById(target!.domain).numeral} · {target!.type}
                      </span>
                    </div>

                    {tracedEdge ? (
                      <p className="measure mt-3 border-l-2 border-thread pl-4 font-serif text-[1.02rem] leading-[1.6] text-graphite">
                        {c.note}
                      </p>
                    ) : (
                      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <p className="min-w-0 flex-1">
                          <span className="mono-xs block text-faint">
                            Relationship recorded, not yet traced
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-2 block h-2.5 w-full max-w-[46ch] bg-gradient-to-r from-rule via-rule-2 to-rule"
                            style={{ filter: "blur(1px)" }}
                          />
                          <span className="sr-only">
                            The reason for this connection is hidden until the thread is pulled.
                          </span>
                        </p>
                        {threadUnlocked ? (
                          <button
                            type="button"
                            onClick={() => {
                              setOpenTrace(target!.id);
                              beginReveal(art.id, target!.id);
                            }}
                            className="mono-xs shrink-0 border border-thread px-3 py-2 text-thread transition-colors hover:bg-thread hover:text-paper"
                          >
                            Pull the thread
                          </button>
                        ) : (
                          <span className="mono-xs shrink-0 text-faint">
                            Locked — visit a third room
                          </span>
                        )}
                      </div>
                    )}
                    {openTrace === target!.id && !tracedEdge ? (
                      <span className="mono-xs mt-2 block text-thread">Tracing…</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {!connected.length ? (
              <p className="mono-xs py-4 text-faint">
                This artifact stands alone. It happens — not everything in an archive is connected,
                and pretending otherwise would be tidier than true.
              </p>
            ) : null}
          </section>

          {/* ---- continue ---- */}
          <nav
            aria-label="Continue through the room"
            className="mt-12 flex flex-wrap items-stretch justify-between gap-4 border-t border-rule pt-6"
          >
            <button
              type="button"
              onClick={() => navigate({ view: "room", id: art.domain })}
              className="mono-xs flex-1 border border-rule px-4 py-4 text-left text-smoke transition-colors hover:border-ink hover:text-ink"
            >
              ← Room {room.numeral} · {room.name}
            </button>
            {next ? (
              <button
                type="button"
                onClick={() => navigate({ view: "artifact", id: next.id })}
                className="mono-xs flex-1 border border-rule px-4 py-4 text-right text-smoke transition-colors hover:border-ink hover:text-ink"
              >
                Next in this room · {next.id} {next.title} →
              </button>
            ) : null}
          </nav>
        </div>

        {/* marginalia */}
        <aside className="mt-14 lg:mt-0 lg:pl-7">
          <div className="lg:sticky lg:top-24">
            <h2 className="mono-xs text-faint">Catalogue data</h2>
            <dl className="mt-3">
              <MetaRow label="Accession" value={art.accession} />
              <MetaRow label="Type" value={art.type} />
              <MetaRow label="Status" value={art.status} />
              <MetaRow label="Year" value={art.year} />
              <MetaRow label="Room" value={`${room.numeral} — ${room.name}`} />
              {art.meta?.map((m) => <MetaRow key={m.label} label={m.label} value={m.value} />)}
              <MetaRow
                label="Evidence"
                value={`${art.blocks?.filter((b) => b.kind === "evidence").length ?? 0} plates`}
              />
            </dl>

            <div className="mt-8 border-t border-rule pt-6">
              <PullThread artifactId={art.id} />
            </div>

            <p className="mono-xs mt-8 leading-relaxed text-faint">
              {traced.length} connections traced so far. The thread is derived from the archive
              itself — nothing on this page is drawn by hand.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

/* ============================================================
   BLOCK RENDERER — each evidence type gets its own treatment.
   ============================================================ */

function BlockView({
  block,
  art,
  n,
  dropCap,
}: {
  block: Block;
  art: Artifact;
  n: number;
  dropCap?: boolean;
}) {
  switch (block.kind) {
    case "text":
      return (
        <div
          className={cn(
            "prose-archive measure",
            dropCap ? "drop-cap" : undefined,
            "lg:ml-[7%]",
          )}
        >
          <p>
            <Rich text={block.text} />
          </p>
        </div>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-thread pl-5 sm:pl-8 lg:ml-[7%] lg:w-[86%]">
          <p className="font-serif text-[clamp(1.3rem,2.6vw,2.05rem)] italic leading-[1.28] text-ink">
            “{block.text}”
          </p>
          {block.source ? (
            <footer className="mono-xs mt-3 text-faint">— {block.source}</footer>
          ) : null}
        </blockquote>
      );

    case "note":
      return (
        <aside className="border border-rule bg-ivory/70 p-5 lg:ml-[52%] lg:w-[48%]">
          <h3 className="mono-xs text-thread">{block.label}</h3>
          <p className="mt-3 font-serif text-[1.01rem] leading-[1.6] text-graphite">{block.text}</p>
        </aside>
      );

    case "evidence": {
      const count = Math.max(1, Math.min(4, block.series ?? 1));
      return (
        <section>
          <div className="flex items-baseline gap-3">
            <span className="mono-xs text-faint">{block.label}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </div>
          <div
            className={cn(
              "mt-4 grid gap-5",
              count > 1 ? "sm:grid-cols-2" : "grid-cols-1",
            )}
          >
            {Array.from({ length: count }).map((_, i) => (
              <Specimen
                key={i}
                seed={`${art.id}-${n}-${i}`}
                kindOf={block.kindOf}
                aspect={block.aspect ?? 1.5}
                label={`FIG. ${String(n).padStart(2, "0")}${count > 1 ? String.fromCharCode(97 + i) : ""}`}
                caption={i === 0 ? block.caption : undefined}
                alt={art.alt}
              />
            ))}
          </div>
        </section>
      );
    }

    case "list":
      return (
        <div className="lg:ml-[7%] lg:w-[78%]">
          <h3 className="mono-xs text-faint">{block.label}</h3>
          <ul className="mt-4 divide-y divide-rule/70 border-y border-rule">
            {block.items.map((it, i) => (
              <li key={i} className="grid grid-cols-[2.2rem_1fr] items-baseline gap-3 py-3">
                <span className="mono-xs text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-[1.02rem] leading-[1.55] text-graphite">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "decisions":
      return (
        <div className="lg:ml-[7%] lg:w-[86%]">
          <h3 className="mono-xs text-faint">{block.label ?? "Decisions"}</h3>
          <dl className="mt-4 space-y-0">
            {block.items.map((d, i) => (
              <div
                key={i}
                className="grid gap-2 border-t border-rule py-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-8"
              >
                <dt className="font-serif text-[1.08rem] leading-snug text-ink">{d.chose}</dt>
                <dd className="font-serif text-[1.01rem] leading-[1.6] text-graphite">
                  <span className="mono-xs mr-2 align-middle text-faint">because</span>
                  {d.because}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "timeline":
      return (
        <div className="lg:ml-[7%] lg:w-[78%]">
          <h3 className="mono-xs text-faint">{block.label ?? "Chronology"}</h3>
          <ol className="mt-4 border-l border-rule pl-5">
            {block.items.map((t, i) => (
              <li key={i} className="relative pb-5 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(1.25rem+3px)] top-1.5 h-1.5 w-1.5 rounded-full bg-thread"
                />
                <span className="mono-xs block text-faint">{t.when}</span>
                <span className="mt-1 block font-serif text-[1.02rem] leading-[1.55] text-graphite">
                  {t.what}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "failure":
      return (
        <div className="border-2 border-thread/70 lg:ml-[7%] lg:w-[86%]">
          <h3 className="mono-xs flex items-baseline gap-2 bg-thread px-4 py-2 text-paper">
            <span aria-hidden="true">✕</span>
            {block.label ?? "What went wrong"}
          </h3>
          <div className="grid divide-y divide-rule sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <span className="mono-xs text-thread">What went wrong</span>
              <p className="mt-3 font-serif text-[1.03rem] leading-[1.6] text-graphite">
                {block.wrong}
              </p>
            </div>
            <div className="p-5">
              <span className="mono-xs text-faint">What was kept</span>
              <p className="mt-3 font-serif text-[1.03rem] leading-[1.6] text-graphite">
                {block.kept}
              </p>
            </div>
          </div>
        </div>
      );

    case "code":
      return (
        <div className="lg:ml-[7%] lg:w-[86%]">
          {block.label ? <h3 className="mono-xs text-faint">{block.label}</h3> : null}
          <pre className="mt-3 overflow-x-auto border border-rule bg-ink/95 p-5 text-[12.5px] leading-[1.7] text-paper/90">
            <code className="mono">{block.text}</code>
          </pre>
        </div>
      );

    case "questions":
      return (
        <div className="border-y border-rule py-6 lg:ml-[7%] lg:w-[86%]">
          <span className="mono-xs text-faint">Unanswered</span>
          <ul className="mt-4 space-y-4">
            {block.items.map((q, i) => (
              <li key={i} className="grid grid-cols-[1.6rem_1fr] items-baseline gap-3">
                <span className="font-serif text-[1.4rem] leading-none text-thread">?</span>
                <span className="font-serif text-[1.2rem] italic leading-[1.45] text-ink">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}
