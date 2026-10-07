import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { ArtifactStatus, ArtifactType } from "@/data/types";

/* ============================================================
   ARCHIVAL PRIMITIVES
   ============================================================ */

export const TYPE_GLYPH: Record<ArtifactType, string> = {
  PROJECT: "▪",
  PROTOTYPE: "◦",
  EXPERIMENT: "⌁",
  FAILURE: "✕",
  OBSERVATION: "○",
  REFERENCE: "❝",
  SKETCH: "✎",
  PRINCIPLE: "§",
  QUESTION: "?",
  ANOMALY: "…",
};

export const TYPE_WEIGHT: Record<ArtifactType, string> = {
  PROJECT: "text-ink",
  PROTOTYPE: "text-graphite",
  EXPERIMENT: "text-graphite",
  FAILURE: "text-thread",
  OBSERVATION: "text-graphite",
  REFERENCE: "text-smoke",
  SKETCH: "text-graphite",
  PRINCIPLE: "text-ink",
  QUESTION: "text-thread",
  ANOMALY: "text-smoke",
};

export function TypeMark({ type, className }: { type: ArtifactType; className?: string }) {
  return (
    <span className={cn("mono-xs whitespace-nowrap", TYPE_WEIGHT[type], className)}>
      <span aria-hidden="true" className="mr-1 opacity-70">
        {TYPE_GLYPH[type]}
      </span>
      {type}
    </span>
  );
}

export function StatusMark({ status }: { status: ArtifactStatus }) {
  return (
    <span
      className={cn(
        "mono-xs whitespace-nowrap",
        status === "ABANDONED" || status === "SEALED"
          ? "text-faint line-through decoration-rule-2"
          : status === "UNRESOLVED" || status === "IN PROGRESS"
            ? "text-smoke"
            : "text-faint",
      )}
    >
      {status}
    </span>
  );
}

/** A finding-aid row: label left, value right, hairline under. */
export function MetaRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-rule/70 py-2",
        className,
      )}
    >
      <dt className="mono-xs text-faint">{label}</dt>
      <dd className="mono text-[11.5px] text-graphite">{value}</dd>
    </div>
  );
}

export function SectionLabel({
  children,
  n,
  className,
}: {
  children: ReactNode;
  n?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      {n ? <span className="mono-xs text-thread">{n}</span> : null}
      <span className="mono-xs text-faint">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-rule" />
    </div>
  );
}

/* ============================================================
   MARKER — a knot on the Red Thread, in the document.
   This is the DOM half of the thread: the canvas passes
   through every element carrying data-thread-node.
   ============================================================ */

interface MarkerProps {
  id: string;
  label: string;
  visited?: boolean;
  broken?: boolean;
  onClick?: () => void;
  title?: string;
  className?: string;
  size?: "sm" | "md";
}

export function Marker({
  id,
  label,
  visited,
  broken,
  onClick,
  title,
  className,
  size = "md",
}: MarkerProps) {
  const interactive = Boolean(onClick);
  return (
    <button
      type="button"
      data-thread-node={id}
      data-visited={visited ? "" : undefined}
      data-broken={broken ? "" : undefined}
      onClick={onClick}
      disabled={!interactive}
      title={title ?? label}
      aria-label={
        title ??
        `${label}${visited ? " — consulted" : ""}${broken ? " — untraced connection" : ""}`
      }
      aria-current={visited ? "true" : undefined}
      className={cn(
        "group relative flex items-center gap-2 font-mono uppercase tracking-[0.16em] transition-colors duration-300",
        size === "sm" ? "text-[9px]" : "text-[10px]",
        interactive ? "cursor-pointer text-graphite hover:text-thread" : "cursor-default",
        visited ? "text-ink" : "text-faint",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block rounded-full transition-all duration-300",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          visited ? "bg-thread ring-1 ring-thread/30" : "bg-transparent ring-1 ring-ink/50",
          interactive && "group-hover:scale-125",
          broken && "ring-2 ring-thread/50",
        )}
      />
      <span>{label}</span>
    </button>
  );
}

/** Vertical marginalia, used for room labels on wide screens. */
export function VerticalLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "vertical-rl mono-xs hidden rotate-180 whitespace-nowrap text-faint lg:block",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Inline markup: *emphasis* → <em>. Keeps long-form copy editable as plain strings. */
export function Rich({ text }: { text: string }) {
  const parts = text.split("*");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? <em key={i}>{p}</em> : <span key={i}>{p}</span>,
      )}
    </>
  );
}
