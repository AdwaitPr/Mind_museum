import { useEffect, useMemo, useRef, useState } from "react";
import { ARTIFACTS, artifactById } from "@/data/artifacts";
import { domainById } from "@/data/types";
import { useArchive } from "@/state/archive";
import { StatusMark, TypeMark } from "./ui";
import { cn } from "@/utils/cn";
import type { Block } from "@/data/types";

/* ============================================================
   SEARCH — for visitors who know what they are looking for.
   Results keep the archive metaphor: accession, room, type,
   and the artifact the result is joined to.
   ============================================================ */

interface Hit {
  id: string;
  score: number;
  field: string;
  snippet: string;
}

export default function SearchOverlay() {
  const { search, setSearch, navigate, isVisited } = useArchive();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search) {
      setQ("");
      setCursor(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(t);
    }
  }, [search]);

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const out: Hit[] = [];
    for (const a of ARTIFACTS) {
      const room = domainById(a.domain);
      const fields: [string, string][] = [
        ["title", a.title],
        ["summary", a.summary],
        ["note", a.short],
        ["type", `${a.type} ${a.status} ${a.year} ${a.id}`],
        ["room", `${room.name} ${room.purpose}`],
        ["body", (a.blocks ?? []).map(blockText).join(" ")],
        [
          "connections",
          a.connections.map((c) => `${c.id} ${artifactById(c.id)?.title ?? ""} ${c.note}`).join(" "),
        ],
      ];
      let best: Hit | null = null;
      fields.forEach(([name, value], fi) => {
        const idx = value.toLowerCase().indexOf(term);
        if (idx === -1) return;
        const weight = (10 - fi) * (name === "title" ? 3 : 1);
        const start = Math.max(0, idx - 46);
        const snippet =
          start > 0 ? "…" + value.slice(start, idx + term.length + 78).trim() : value.slice(0, 130);
        if (!best || weight > best.score) best = { id: a.id, score: weight, field: name, snippet };
      });
      if (best) out.push(best);
    }
    return out.sort((x, y) => y.score - x.score);
  }, [q]);

  useEffect(() => {
    if (cursor >= hits.length) setCursor(0);
  }, [hits.length, cursor]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!search) return null;

  const open = (id: string) => {
    setSearch(false);
    navigate({ view: "artifact", id });
  };

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search the archive">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setSearch(false)}
        className="absolute inset-0 cursor-default bg-ink/30 backdrop-blur-[2px]"
      />
      <div className="relative mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-3xl border border-ink bg-paper shadow-[0_24px_70px_-40px_rgba(22,21,15,0.7)]">
        <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <span className="mono-xs text-thread">Search</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(hits.length - 1, c + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(0, c - 1));
              } else if (e.key === "Enter" && hits[cursor]) {
                open(hits[cursor].id);
              } else if (e.key === "Escape") {
                setSearch(false);
              }
            }}
            placeholder="title, description, room, type, connection…"
            aria-label="Search the archive"
            className="mono min-w-0 flex-1 bg-transparent text-[13px] tracking-[0.04em] text-ink placeholder:text-faint focus:outline-none"
          />
          <span className="mono-xs shrink-0 text-faint">esc</span>
        </div>

        <div ref={listRef} className="max-h-[62vh] overflow-y-auto">
          {!q.trim() ? (
            <div className="px-4 py-5">
              <p className="mono-xs text-faint">Three ways through the archive</p>
              <ul className="mt-3 space-y-2">
                {[
                  ["Search", "Matches titles, descriptions, evidence, and connection notes."],
                  ["The index", "Every artifact, in order, with type and status."],
                  ["The thread", "Follow a relationship instead of a category."],
                ].map(([k, v]) => (
                  <li key={k} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3">
                    <span className="mono-xs text-ink">{k}</span>
                    <span className="font-serif text-[0.98rem] leading-snug text-smoke">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="mono-xs mt-6 text-faint">
                Try: notation · failure · grid · Warburg · threshold · tape
              </p>
            </div>
          ) : hits.length ? (
            <ul className="divide-y divide-rule/70">
              {hits.map((h, i) => {
                const a = artifactById(h.id)!;
                const room = domainById(a.domain);
                const joined = a.connections[0] ? artifactById(a.connections[0].id) : null;
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      data-idx={i}
                      onClick={() => open(h.id)}
                      onMouseEnter={() => setCursor(i)}
                      className={cn(
                        "grid w-full grid-cols-[3.4rem_minmax(0,1fr)] gap-x-4 px-4 py-3.5 text-left transition-colors",
                        i === cursor ? "bg-ivory" : "hover:bg-ivory/60",
                      )}
                    >
                      <span className="mono-xs pt-1 text-faint">{a.id}</span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span
                            className={cn(
                              "font-serif text-[1.06rem] leading-snug",
                              i === cursor ? "text-thread" : "text-ink",
                            )}
                          >
                            {a.title}
                          </span>
                          <TypeMark type={a.type} />
                          <StatusMark status={a.status} />
                        </span>
                        <span className="mono mt-1 block text-[11px] leading-relaxed text-smoke">
                          <span className="text-faint">
                            Room {room.numeral} · matched in {h.field}
                          </span>
                          <br />
                          {h.snippet}
                        </span>
                        {joined ? (
                          <span className="mono-xs mt-2 block text-faint">
                            <span className="text-thread">↔</span> joined to {joined.id} —{" "}
                            {joined.title}
                            {isVisited(a.id) ? " · consulted" : ""}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-8">
              <p className="font-serif text-[1.05rem] text-ink">
                Nothing in the archive under “{q.trim()}”.
              </p>
              <p className="mono-xs mt-2 leading-relaxed text-faint">
                That is a real answer, not a failure of the catalogue. Unrecorded things are still
                unrecorded.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch(false);
                  navigate({ view: "index" });
                }}
                className="mono-xs mt-5 border border-rule px-3 py-2 text-smoke transition-colors hover:border-ink hover:text-ink"
              >
                Consult the index instead →
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-rule px-4 py-2">
          <span className="mono-xs text-faint">
            {q.trim() ? `${hits.length} result${hits.length === 1 ? "" : "s"}` : "Ready"}
          </span>
          <span aria-live="polite" className="sr-only">
            {q.trim() ? `${hits.length} results` : "Search ready"}
          </span>
          <span className="mono-xs text-faint">↑↓ to move · ↵ to open</span>
        </div>
      </div>
    </div>
  );
}

function blockText(b: Block): string {
  switch (b.kind) {
    case "text":
    case "quote":
      return b.text;
    case "note":
      return `${b.label} ${b.text}`;
    case "evidence":
      return `${b.label} ${b.caption}`;
    case "list":
    case "questions":
      return b.items.join(" ");
    case "decisions":
      return b.items.map((d) => `${d.chose} ${d.because}`).join(" ");
    case "timeline":
      return b.items.map((t) => `${t.when} ${t.what}`).join(" ");
    case "failure":
      return `${b.wrong} ${b.kept}`;
    case "code":
      return b.text;
    default:
      return "";
  }
}


