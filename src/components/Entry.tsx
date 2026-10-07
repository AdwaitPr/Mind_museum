import { DOMAINS } from "@/data/types";
import { STATS } from "@/data/artifacts";
import { useArchive, artifactsInRoom } from "@/state/archive";
import { useSound } from "@/lib/hooks";

/* ============================================================
   THE ENTRANCE HALL
   No name. No job title. One statement, one invitation, and
   the five rooms the collection is divided into.
   ============================================================ */

export default function Entry() {
  const { navigate, sound, threadUnlocked } = useArchive();
  const play = useSound(sound);

  return (
    <section className="relative min-h-[100svh] pb-16 pt-24 lg:pb-24 lg:pt-32">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[92px_minmax(0,1fr)_248px] lg:gap-8 lg:px-6">
        {/* ---- left gutter: reserved for the thread ---- */}
        <div className="relative hidden lg:block" aria-hidden="true" />

        {/* ---- statement ---- */}
        <div className="min-w-0">
          <div className="rise flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="mono-xs text-thread">Accession 2016—2025</span>
            <span className="mono-xs text-faint">Access open</span>
            <span className="mono-xs text-faint">Five rooms · {STATS.artifacts} case files</span>
            <span className="mono-xs text-faint">{STATS.connections} recorded connections</span>
          </div>

          <h1
            className="mt-7 display text-[clamp(2.7rem,10.5vw,8.6rem)] font-semibold uppercase text-ink"
            style={{ animationDelay: "60ms" }}
          >
            <span className="rise block" style={{ animationDelay: "80ms" }}>
              This is where
            </span>
            <span className="rise block" style={{ animationDelay: "180ms" }}>
              I keep my
            </span>
            <span
              className="rise block font-serif italic font-normal normal-case"
              style={{ animationDelay: "280ms" }}
            >
              thinking.
            </span>
          </h1>

          {/* the band the dormant thread rests in */}
          <div data-thread-dormant className="h-[9vh] lg:h-[10vh]" aria-hidden="true" />

          <div className="mt-10 grid gap-8 border-t border-rule pt-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12">
            <p
              className="rise measure-tight font-serif text-[1.075rem] leading-[1.65] text-graphite"
              style={{ animationDelay: "380ms" }}
            >
              You are standing in an archive, not a gallery. There are no hero projects here — only
              evidence: the things made, the things noticed, the things tested, the things that
              failed, and the things that do not fit. Each one is a case file. Each one is joined to
              another by a thread you will not fully see at first.
            </p>

            <div
              className="rise flex flex-col items-start gap-3 sm:items-end"
              style={{ animationDelay: "440ms" }}
            >
              <button
                type="button"
                onClick={() => {
                  play("open");
                  navigate({ view: "index" });
                }}
                className="group relative inline-flex items-baseline gap-4 border border-ink px-6 py-3.5 text-left transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                <span className="mono text-[11px] uppercase tracking-[0.2em]">Enter the archive</span>
                <span
                  aria-hidden="true"
                  className="font-mono text-[13px] leading-none transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate({ view: "room", id: "workshop" })}
                className="mono-xs text-smoke underline decoration-rule-2 underline-offset-4 transition-colors hover:text-thread"
              >
                or go straight to the things that were made
              </button>
            </div>
          </div>

          {/* mobile: the dormant thread, drawn in the document */}
          <svg
            className="mt-12 h-24 w-full lg:hidden"
            viewBox="0 0 400 96"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M-10 66 C 60 66, 80 22, 150 22 S 230 78, 300 44 S 380 30, 410 58"
              fill="none"
              stroke="#b3261e"
              strokeWidth="1.2"
            />
            <circle cx="150" cy="22" r="3.4" fill="#b3261e" />
            <circle cx="300" cy="44" r="3.4" fill="none" stroke="#b3261e" strokeWidth="1.2" />
          </svg>
        </div>

        {/* ---- right rail: the rooms ---- */}
        <aside
          className="rise border-t border-rule pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"
          style={{ animationDelay: "520ms" }}
          aria-label="The five rooms of the collection"
        >
          <h2 className="mono-xs text-faint">The collection</h2>
          <ul className="mt-5 space-y-0">
            {DOMAINS.map((d) => (
              <li key={d.id} className="border-b border-rule/70 last:border-0">
                <button
                  type="button"
                  onClick={() => navigate({ view: "room", id: d.id })}
                  className="group grid w-full grid-cols-[22px_1fr] items-baseline gap-x-3 py-3 text-left"
                >
                  <span className="mono-xs text-thread">{d.numeral}</span>
                  <span className="min-w-0">
                    <span className="block font-serif text-[1.05rem] leading-tight text-ink transition-colors group-hover:text-thread">
                      {d.name}
                    </span>
                    <span className="mono-xs mt-1 block text-faint">{d.purpose}</span>
                    <span className="mono-xs mt-1 block text-faint/70 tabular-nums">
                      {String(artifactsInRoom(d.id).length).padStart(2, "0")} artifacts
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 mono-xs leading-relaxed text-faint">
            {threadUnlocked
              ? "The thread is live. It can be pulled from any case file."
              : "A mind is not revealed by what it has made, but by the traces of thought that surround the making."}
          </p>
        </aside>
      </div>

      {/* ---- how to read this archive ---- */}
      <div className="mx-auto mt-14 max-w-[1680px] px-5 sm:px-8 lg:mt-20 lg:pl-[calc(1.5rem+92px)] lg:pr-6">
        <div className="fade-in grid gap-x-8 gap-y-4 border-t border-rule pt-5 sm:grid-cols-3" style={{ animationDelay: "620ms" }}>
          {[
            {
              k: "Mode I — the thread",
              v: "Follow relationships. Non-linear. The room you end up in is rarely the room you started from.",
            },
            {
              k: "Mode II — the index",
              v: "A finding aid. Every artifact, its type, its status, whether you have consulted it.",
            },
            {
              k: "Mode III — search",
              v: "For visitors who arrived knowing what they are looking for. Press / anywhere.",
            },
          ].map((m) => (
            <div key={m.k}>
              <h3 className="mono-xs text-ink">{m.k}</h3>
              <p className="mt-2 font-serif text-[0.95rem] leading-relaxed text-smoke">{m.v}</p>
            </div>
          ))}
        </div>
        <p className="mono-xs mt-6 text-faint/80">
          {sound ? "Sound is on" : "The museum is silent"} · Demonstration archive — sample material,
          no invented clients or credentials
        </p>
      </div>
    </section>
  );
}
