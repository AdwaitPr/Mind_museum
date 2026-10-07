/* ============================================================
   CONTENT MODEL
   ------------------------------------------------------------
   Everything the museum shows is derived from this file's types.
   To replace the demonstration archive with real work, edit
   src/data/artifacts.ts only. No component assumes a fixed
   structure, a fixed number of artifacts, or a fixed set of
   domains.
   ============================================================ */

export type DomainId =
  | "workshop"
  | "observatory"
  | "laboratory"
  | "library"
  | "wunderkammer";

export type ArtifactType =
  | "PROJECT"
  | "PROTOTYPE"
  | "EXPERIMENT"
  | "FAILURE"
  | "OBSERVATION"
  | "REFERENCE"
  | "SKETCH"
  | "PRINCIPLE"
  | "QUESTION"
  | "ANOMALY";

export type ArtifactStatus =
  | "CATALOGUED"
  | "IN PROGRESS"
  | "ABANDONED"
  | "UNRESOLVED"
  | "CIRCULATING"
  | "SEALED";

/** What kind of physical evidence the archive holds for an artifact. */
export type EvidenceKind =
  | "SCREEN"
  | "SCAN"
  | "PHOTOGRAPH"
  | "DIAGRAM"
  | "SKETCHBOOK"
  | "DOCUMENT";

export interface Connection {
  /** target artifact id */
  id: string;
  /** why the two are connected — the actual thought */
  note: string;
  /** how load-bearing the relationship is */
  weight?: "primary" | "secondary" | "faint";
}

export type Block =
  | { kind: "text"; text: string }
  | { kind: "quote"; text: string; source?: string }
  | { kind: "note"; label: string; text: string }
  | {
      kind: "evidence";
      label: string;
      caption: string;
      kindOf: EvidenceKind;
      aspect?: number;
      /** number of figures in a sequence, e.g. process steps */
      series?: number;
    }
  | { kind: "list"; label: string; items: string[] }
  | { kind: "decisions"; label?: string; items: { chose: string; because: string }[] }
  | { kind: "timeline"; label?: string; items: { when: string; what: string }[] }
  | {
      kind: "failure";
      label?: string;
      wrong: string;
      kept: string;
    }
  | { kind: "code"; label?: string; text: string }
  | { kind: "questions"; items: string[] };

export interface Artifact {
  id: string;
  /** archival accession label, e.g. "W-03 / 06" */
  accession: string;
  title: string;
  domain: DomainId;
  type: ArtifactType;
  year: string;
  status: ArtifactStatus;
  /** one-line shelf label used in the Index */
  short: string;
  /** catalogue summary — 1–2 sentences */
  summary: string;
  /** the case file body. length varies wildly on purpose. */
  blocks?: Block[];
  /** marginal metadata — measurement, medium, duration, location... */
  meta?: { label: string; value: string }[];
  /** relationships. the Red Thread is generated from these. */
  connections: Connection[];
  /** 0–1 position along the archive's continuous thread */
  thread: number;
  featured?: boolean;
  /** optional image alt text architecture note for future real evidence */
  alt?: string;
}

export interface Domain {
  id: DomainId;
  room: string;
  name: string;
  /** the room's function, in one clause */
  purpose: string;
  epigraph: string;
  /** roman numeral + catalogue prefix */
  numeral: string;
  prefix: string;
  tint: string;
}

export const DOMAINS: Domain[] = [
  {
    id: "workshop",
    room: "ROOM I",
    name: "The Workshop",
    purpose: "Things made",
    epigraph:
      "A finished object is the smallest part of the work. Everything around it is the argument.",
    numeral: "I",
    prefix: "W",
    tint: "#16150f",
  },
  {
    id: "observatory",
    room: "ROOM II",
    name: "The Observatory",
    purpose: "Things noticed",
    epigraph:
      "Most of what I design begins as something I saw and could not stop looking at.",
    numeral: "II",
    prefix: "O",
    tint: "#3c3a31",
  },
  {
    id: "laboratory",
    room: "ROOM III",
    name: "The Laboratory",
    purpose: "Things tested",
    epigraph:
      "I keep the failures at eye level. They are more instructive than the shelf above them.",
    numeral: "III",
    prefix: "L",
    tint: "#b3261e",
  },
  {
    id: "library",
    room: "ROOM IV",
    name: "The Library",
    purpose: "Things that informed the thinking",
    epigraph:
      "Influence is not a mood board. It is the specific sentences that rearranged me.",
    numeral: "IV",
    prefix: "B",
    tint: "#3c3a31",
  },
  {
    id: "wunderkammer",
    room: "ROOM V",
    name: "The Wunderkammer",
    purpose: "Things that do not fit",
    epigraph:
      "The drawer of things I cannot classify yet. Historically, this drawer predicts the next five years.",
    numeral: "V",
    prefix: "Q",
    tint: "#6f6b5e",
  },
];

export const domainById = (id: DomainId) =>
  DOMAINS.find((d) => d.id === id) as Domain;
