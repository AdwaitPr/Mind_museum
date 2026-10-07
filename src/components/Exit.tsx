import { STATS } from "@/data/artifacts";
import { useArchive } from "@/state/archive";
import { DOMAINS } from "@/data/types";

/* ============================================================
   THE EXIT
   The end of an exhibition, not a contact form. The thread
   arrives here and does not resolve — deliberately.
   ============================================================ */

export default function Exit() {
  const { visitedCount, traced, roomsExplored, navigate, resetSession, threadUnlocked } =
    useArchive();

  return (
    <section className="relative pt-24 pb-32 lg:pt-32">
      {/* the thread arrives and stops */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-[6.5rem] hidden h-40 w-full lg:block"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 120 C 180 120, 240 40, 420 40 S 620 128, 780 76"
          fill="none"
          stroke="#b3261e"
          strokeWidth="1.2"
        />
        <circle cx="780" cy="76" r="4" fill="#b3261e" />
        {/* the break: the thread does not continue */}
        <path d="M792 76 L 846 76" stroke="#b3261e" strokeWidth="1.2" strokeDasharray="2 8" />
        <text
          x="860"
          y="80"
          fontSize="11"
          letterSpacing="2"
          fill="#b3261e"
          fontFamily="var(--font-mono)"
        >
          UNRESOLVED
        </text>
      </svg>

      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:grid lg:grid-cols-[92px_minmax(0,1fr)_320px] lg:gap-8 lg:px-6">
        <div aria-hidden="true" />

        <div className="min-w-0">
          <span className="mono-xs text-thread">The exit · last room</span>
          <h1 className="display mt-5 text-[clamp(2.3rem,7vw,5.6rem)] font-semibold uppercase text-ink">
            The archive is
            <br />
            still growing.
          </h1>

          <div className="mt-10 grid gap-10 border-t border-rule pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
            <div>
              <p className="measure font-serif text-[1.2rem] leading-[1.6] text-graphite">
                If something here made you curious, let's continue the investigation. I am
                especially interested in the things you noticed and could not classify.
              </p>

              <div className="mt-9 border border-ink">
                <div className="flex items-center justify-between border-b border-ink px-4 py-2">
                  <span className="mono-xs text-faint">Correspondence</span>
                  <span className="mono-xs text-faint">Replies within a few days</span>
                </div>
                <a
                  href="mailto:archive@example.com?subject=Re%3A%20something%20in%20the%20archive"
                  className="group block px-4 py-6 transition-colors hover:bg-ivory"
                >
                  <span className="mono block text-[clamp(0.95rem,2.2vw,1.2rem)] tracking-[0.04em] text-ink group-hover:text-thread">
                    archive@example.com
                  </span>
                  <span className="mono-xs mt-3 block leading-relaxed text-faint">
                    Subject line optional. Tell me what you were looking for and whether you found
                    it.
                  </span>
                </a>
              </div>

              <p className="mono-xs mt-6 leading-relaxed text-faint">
                Demonstration address — this is sample material. Replace with a real inbox in one
                line of content.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ view: "index" })}
                  className="mono-xs border border-rule px-4 py-3 text-smoke transition-colors hover:border-ink hover:text-ink"
                >
                  Back to the index
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ view: "room", id: "wunderkammer" })}
                  className="mono-xs border border-rule px-4 py-3 text-smoke transition-colors hover:border-ink hover:text-ink"
                >
                  The drawer of things that don't fit
                </button>
                <button
                  type="button"
                  onClick={resetSession}
                  className="mono-xs px-4 py-3 text-faint underline decoration-rule-2 underline-offset-4 transition-colors hover:text-thread"
                >
                  Clear my reading record
                </button>
              </div>
            </div>

            <aside>
              <h2 className="mono-xs text-faint">Kept by</h2>
              <p className="display mt-4 text-[clamp(1.6rem,4vw,2.6rem)] font-semibold text-ink">
                Adwait
              </p>
              <p className="measure mt-4 font-serif text-[1.02rem] leading-[1.6] text-graphite">
                I make small systems for thinking, and I keep the evidence. This museum is a working
                method, not a résumé: the case files are real, the rooms are how my head is actually
                arranged.
              </p>
              <p className="mono-xs mt-5 leading-relaxed text-faint">
                No clients, awards or metrics are claimed anywhere in this archive. Where evidence
                has not been filed, the archive says so.
              </p>

              <dl className="mt-9 border-t border-rule">
                {[
                  ["Rooms entered", `${roomsExplored} of ${STATS.domains}`],
                  ["Artifacts consulted", `${visitedCount} of ${STATS.artifacts}`],
                  ["Connections traced", `${traced.length} of ${STATS.connections}`],
                  [
                    "Thread",
                    threadUnlocked ? "Live — it can be pulled" : "Dormant — three rooms required",
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-rule/60 py-2.5"
                  >
                    <dt className="mono-xs text-smoke">{k}</dt>
                    <dd className="mono text-[11px] text-graphite">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mono-xs mt-8 leading-relaxed text-faint">
                {DOMAINS.map((d) => d.numeral).join(" · ")} — the thread leaves the page here.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
