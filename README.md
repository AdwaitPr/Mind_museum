# The Museum of My Mind

> **A Finding Aid for One Person’s Thinking · An Interactive Archival Portfolio Experience**  
> *Built as a single continuous system — no page is an island.*

---

## 1. Overview & Concept

**The Museum of My Mind** is an interactive, archival portfolio experience designed to replace conventional outcome-driven portfolio websites with an evidentiary, rule-based museum architecture.

Instead of presenting polished hero mockups detached from context, this platform treats creative, engineering, and research output as **physical specimens and investigative case files**. Every entry catalogues not merely what was made, but the governing rules, structural constraints, deliberate trade-offs, instructive failures, and causal relationships between ideas.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                   THE CONTINUOUS ARCHIVAL JOURNEY                      │
 ├────────────────────────────────────────────────────────────────────────┤
 │                                                                        │
 │  ENTRY ──► DISCOVERY ──► INDEX ──► ROOM ──► CASE FILE ──► REVEAL       │
 │                                                   │          ▲         │
 │                                                   ▼          │         │
 │                                    INVESTIGATION & CONNECTIONS         │
 │                                                   │                    │
 │                                                   ▼                    │
 │                                                  EXIT                  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Five Archival Rooms (Taxonomy)

The museum is partitioned into five distinct rooms, each governing a different modality of inquiry:

| Room | Title | Prefix | Guiding Epigraph | Focus |
| :--- | :--- | :---: | :--- | :--- |
| **ROOM I** | **The Workshop** | `W` | *"A finished object is the smallest part of the work. Everything around it is the argument."* | **Things made** — Production systems, published editions, tangible artifacts. |
| **ROOM II** | **The Observatory** | `O` | *"Most of what I design begins as something I saw and could not stop looking at."* | **Things noticed** — Field notes, photographic evidence, discovered patterns. |
| **ROOM III** | **The Laboratory** | `L` | *"I keep the failures at eye level. They are more instructive than the shelf above them."* | **Things tested** — Stress tests, abandoned prototypes, generative experiments. |
| **ROOM IV** | **The Library** | `B` | *"Influence is not a mood board. It is the specific sentences that rearranged me."* | **Things that informed the thinking** — Foundational texts, axioms, reference materials. |
| **ROOM V** | **The Wunderkammer** | `Q` | *"The drawer of things I cannot classify yet. Historically, this drawer predicts the next five years."* | **Things that do not fit** — Anomalies, open questions, emergent curiosities. |

---

## 3. Key Architectural Features

### 🧵 The Red Thread (Topological Connectivity)
Artifacts are never presented in isolation. Every case file exposes its intellectual lineage and lateral relationships (`primary`, `secondary`, `faint` connections). A global SVG thread layer renders the interconnected geometry between thoughts as visitors explore the collection.

### 📁 Evidentiary Case Files
Each artifact contains structured data blocks that mirror forensic archival documentation:
- **Decision Records:** Pairwise `chose` vs. `because` rationales documenting deliberate trade-offs.
- **Instructive Failures:** Explicitly cataloguing what went `wrong` alongside what was `kept`.
- **Primary Evidence:** Sequential plates, diagrams, documents, screens, and photographic specimens.
- **Marginal Metadata:** Accession stamps (e.g., `W-01 / 05`), status flags (`CATALOGUED`, `IN PROGRESS`, `ABANDONED`, `UNRESOLVED`, `CIRCULATING`, `SEALED`), and timeline milestones.

### ⌨️ Universal Finding Aid (`/` or `⌘K`)
An integrated command palette allows instantaneous searching across titles, accession numbers, tags, summaries, and rooms with keyboard-first ergonomics.

### 🧭 Permanent Addressability & Privacy
- **Hash-routed navigation:** Every case file possesses a permanent URL anchor (`#/artifact/:id`, `#/room/:id`, `#/index`, `#/exit`).
- **Session-only memory:** Remembers the visitor's investigative trail during their session without third-party surveillance, telemetry trackers, or cookies.

### 📦 Single-File Portable Distribution
Built using `vite-plugin-singlefile` to optionally compile into a 100% self-contained single `.html` document bundling all scripts, styles, and assets—making the entire museum archival, offline-capable, and distributable without a web server.

---

## 4. Tech Stack

- **Runtime & Language:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite 7](https://vite.dev/)
- **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Compilation:** [`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile)
- **State Management:** Custom React Context with Reducer and Hash Route Synchronizer

---

## 5. Repository Structure

```text
Mind_museum/
├── index.html                   # HTML entry point with semantic typography
├── package.json                 # Project manifest & build scripts
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite configuration with Tailwind v4 & SingleFile plugin
│
└── src/
    ├── App.tsx                  # Root museum coordinator & keyboard bindings
    ├── main.tsx                 # React entry point
    ├── index.css                # Global styles & design tokens
    │
    ├── components/              # Exhibition & Gallery Components
    │   ├── CaseFile.tsx         # Detailed investigative artifact reader
    │   ├── Chrome.tsx           # Archival header, status indicators & breadcrumbs
    │   ├── DomainView.tsx       # Room gallery & accession shelf views
    │   ├── Entry.tsx            # Museum entryway & prologue
    │   ├── Exit.tsx             # Curated exit, reading lists & colophon
    │   ├── IndexView.tsx        # Comprehensive master accession index
    │   ├── PullThread.tsx       # Interactive thread navigation handle
    │   ├── Reveal.tsx           # Connection reveal modal & relationship card
    │   ├── SearchOverlay.tsx    # Command palette search interface (⌘K)
    │   ├── Specimen.tsx         # Visual evidence, plates & diagram cards
    │   ├── ThreadLayer.tsx      # SVG canvas for dynamic connection threads
    │   └── ui.tsx               # Atomic UI components (badges, buttons, icons)
    │
    ├── data/
    │   ├── artifacts.ts         # The archival collection (all specimens & edges)
    │   └── types.ts             # Domain models, block types & status enums
    │
    ├── lib/
    │   ├── hooks.ts             # Keyboard shortcuts & sensory utilities
    │   └── thread.ts            # Topological thread calculations & audio earcons
    │
    ├── state/
    │   └── archive.tsx          # Session state, route dispatcher & visit tracker
    │
    └── utils/
        └── cn.ts                # Class merging utility (clsx + tailwind-merge)
```

---

## 6. Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or your preferred package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/AdwaitPr/Mind_museum.git
cd Mind_museum

# Install dependencies
npm install
```

### Development Server

Run the local Vite development server with hot module replacement:

```bash
npm run dev
```

Open your browser to `http://localhost:5173` to explore the archive.

### Production Build

Generate the optimized, self-contained single-file build:

```bash
npm run build
```

The resulting standalone file will be created at `dist/index.html`. You can preview the build locally:

```bash
npm run preview
```

---

## 7. Customization & Population

To populate the museum with your own work, modify [`src/data/artifacts.ts`](src/data/artifacts.ts):

1. **Add or Edit Artifacts:** Define specimens adhering to the `Artifact` schema in [`src/data/types.ts`](src/data/types.ts).
2. **Assign Rooms:** Map items to one of the five domains (`workshop`, `observatory`, `laboratory`, `library`, `wunderkammer`).
3. **Link Connections:** Specify connection target IDs and narrative relational notes to dynamically populate the Red Thread.
4. **Customize Evidence:** Populate `evidence` and `decisions` blocks with actual process documentation, code snippets, or scanned sketches.

---

## 8. License

This project is licensed under the [MIT License](LICENSE).
