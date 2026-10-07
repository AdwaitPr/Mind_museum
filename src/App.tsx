import { useEffect, useRef } from "react";
import { ArchiveProvider, useArchive } from "@/state/archive";
import { domainById } from "@/data/types";
import { artifactById } from "@/data/artifacts";
import Chrome from "@/components/Chrome";
import ThreadLayer from "@/components/ThreadLayer";
import Entry from "@/components/Entry";
import IndexView from "@/components/IndexView";
import DomainView from "@/components/DomainView";
import CaseFile from "@/components/CaseFile";
import Exit from "@/components/Exit";
import Reveal from "@/components/Reveal";
import SearchOverlay from "@/components/SearchOverlay";

/* ============================================================
   THE MUSEUM OF MY MIND
   ENTRY → DISCOVERY → INDEX → ROOM → CASE FILE → INVESTIGATION
   → CONNECTION → REVEAL → CONTINUED EXPLORATION → EXIT
   ============================================================ */

const TITLES: Record<string, string> = {
  entry: "The Museum of My Mind — an archive of creative evidence",
  index: "The Index — The Museum of My Mind",
  exit: "The Exit — The Museum of My Mind",
};

function Museum() {
  const { route, setSearch, search } = useArchive();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  /* keyboard: / or ⌘K opens search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape" && search) setSearch(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearch, search]);

  /* document title + focus management per route */
  useEffect(() => {
    let title = TITLES[route.view];
    if (route.view === "room") {
      const d = domainById(route.id);
      title = `Room ${d.numeral} — ${d.name} · The Museum of My Mind`;
    } else if (route.view === "artifact") {
      const a = artifactById(route.id);
      if (a) title = `${a.id} — ${a.title} · The Museum of My Mind`;
    }
    document.title = title;

    if (first.current) {
      first.current = false;
      return;
    }
    const t = window.setTimeout(() => mainRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [route]);

  return (
    <div className="relative min-h-screen">
      <a
        href="#main"
        className="mono-xs sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-ink focus:bg-paper focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to the archive
      </a>

      <Chrome />
      <ThreadLayer />

      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="relative z-10 outline-none"
        aria-live="off"
      >
        {route.view === "entry" ? <Entry /> : null}
        {route.view === "index" ? <IndexView /> : null}
        {route.view === "room" ? <DomainView key={route.id} id={route.id} /> : null}
        {route.view === "artifact" ? <CaseFile key={route.id} id={route.id} /> : null}
        {route.view === "exit" ? <Exit /> : null}
      </main>

      <footer className="relative z-10 border-t border-rule">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-5 py-8 sm:px-8 lg:px-6">
          <span className="mono-xs text-faint">
            The Museum of My Mind · a finding aid for one person's thinking
          </span>
          <span className="mono-xs text-faint">
            Sample archive · evidence filed as it becomes available
          </span>
          <span className="mono-xs text-faint">
            Built as a single continuous system — no page is an island
          </span>
        </div>
      </footer>

      <Reveal />
      <SearchOverlay />
    </div>
  );
}

export default function App() {
  return (
    <ArchiveProvider>
      <Museum />
    </ArchiveProvider>
  );
}
