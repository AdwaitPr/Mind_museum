import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { ARTIFACTS, EDGES, artifactById } from "@/data/artifacts";
import { DOMAINS, type DomainId } from "@/data/types";
import { emitThreadPulse } from "@/lib/thread";

/* ============================================================
   ARCHIVE STATE
   ------------------------------------------------------------
   Routes are hash-addressable so every case file has a
   permanent catalogue address. Exploration memory is kept for
   the session only: the archive remembers your investigation,
   it does not surveillance you.
   ============================================================ */

export type Route =
  | { view: "entry" }
  | { view: "index" }
  | { view: "room"; id: DomainId }
  | { view: "artifact"; id: string }
  | { view: "exit" };

export const edgeKey = (a: string, b: string) => [a, b].sort().join("→");

interface State {
  route: Route;
  visited: string[];
  traced: string[];
  rooms: DomainId[];
  sound: boolean;
  search: boolean;
  /** transient: connection currently being revealed */
  reveal: { from: string; to: string } | null;
}

type Action =
  | { type: "route"; route: Route }
  | { type: "visit"; id: string }
  | { type: "trace"; key: string }
  | { type: "rooms"; id: DomainId }
  | { type: "sound"; on: boolean }
  | { type: "search"; on: boolean }
  | { type: "reveal"; edge: { from: string; to: string } | null }
  | { type: "hydrate"; data: Partial<State> };

const STORAGE_KEY = "momm.session.v1";

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [head, arg] = raw.split("/");
  if (head === "index") return { view: "index" };
  if (head === "room" && arg && DOMAINS.some((d) => d.id === arg))
    return { view: "room", id: arg as DomainId };
  if (head === "file" && arg && artifactById(arg)) return { view: "artifact", id: arg };
  if (head === "exit") return { view: "exit" };
  return { view: "entry" };
}

function routeToHash(r: Route): string {
  switch (r.view) {
    case "index":
      return "#/index";
    case "room":
      return `#/room/${r.id}`;
    case "artifact":
      return `#/file/${r.id}`;
    case "exit":
      return "#/exit";
    default:
      return "#/";
  }
}

const initial: State = {
  route: { view: "entry" },
  visited: [],
  traced: [],
  rooms: [],
  sound: false,
  search: false,
  reveal: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "route": {
      if (JSON.stringify(action.route) === JSON.stringify(state.route)) return state;
      return { ...state, route: action.route, search: false, reveal: null };
    }
    case "visit":
      return state.visited.includes(action.id)
        ? state
        : { ...state, visited: [...state.visited, action.id] };
    case "rooms":
      return state.rooms.includes(action.id)
        ? state
        : { ...state, rooms: [...state.rooms, action.id] };
    case "trace":
      return state.traced.includes(action.key)
        ? state
        : { ...state, traced: [...state.traced, action.key] };
    case "sound":
      return { ...state, sound: action.on };
    case "search":
      return { ...state, search: action.on };
    case "reveal":
      return { ...state, reveal: action.edge };
    case "hydrate":
      return { ...state, ...action.data, reveal: null, search: false };
    default:
      return state;
  }
}

interface ArchiveApi extends State {
  navigate: (route: Route) => void;
  visit: (id: string) => void;
  trace: (a: string, b: string) => void;
  enterRoom: (id: DomainId) => void;
  setSound: (on: boolean) => void;
  setSearch: (on: boolean) => void;
  setReveal: (edge: { from: string; to: string } | null) => void;
  /** pick the next meaningful connection and reveal it */
  beginReveal: (fromId: string, targetId?: string) => void;
  resetSession: () => void;
  /** derived */
  visitedCount: number;
  roomsExplored: number;
  threadUnlocked: boolean;
  isVisited: (id: string) => boolean;
  isTraced: (a: string, b: string) => boolean;
  nextConnection: (from: string) => { from: string; to: string } | null;
}

const Ctx = createContext<ArchiveApi | null>(null);

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  /* hydrate + persist (session only) */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Partial<State>;
        dispatch({
          type: "hydrate",
          data: {
            visited: Array.isArray(data.visited) ? data.visited.filter((v) => artifactById(v)) : [],
            traced: Array.isArray(data.traced) ? data.traced : [],
            rooms: Array.isArray(data.rooms)
              ? (data.rooms.filter((r) => DOMAINS.some((d) => d.id === r)) as DomainId[])
              : [],
            sound: false,
          },
        });
      }
    } catch {
      /* nothing to restore */
    }
    dispatch({ type: "route", route: parseHash() });
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ visited: state.visited, traced: state.traced, rooms: state.rooms }),
      );
    } catch {
      /* storage unavailable — the archive simply forgets */
    }
  }, [state.visited, state.traced, state.rooms]);

  /* hash <-> route */
  useEffect(() => {
    const onHash = () => dispatch({ type: "route", route: parseHash() });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((route: Route) => {
    const next = routeToHash(route);
    if (window.location.hash === next) {
      dispatch({ type: "route", route });
    } else {
      window.location.hash = next;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* side effects of route: visiting artifacts / entering rooms */
  useEffect(() => {
    if (state.route.view === "artifact") dispatch({ type: "visit", id: state.route.id });
    if (state.route.view === "room") dispatch({ type: "rooms", id: state.route.id });
  }, [state.route]);

  const api = useMemo<ArchiveApi>(() => {
    const visitedCount = state.visited.length;
    const roomsExplored = state.rooms.length;
    const threadUnlocked = roomsExplored >= 3 && visitedCount >= 4;

    const nextConnection = (from: string) => {
      const art = artifactById(from);
      if (!art) return null;
      const scored = [...art.connections]
        .map((c) => {
          const target = artifactById(c.id);
          if (!target) return null;
          const cross = target.domain !== art.domain;
          const fresh = !state.traced.includes(edgeKey(from, c.id));
          const weight = c.weight === "primary" ? 2 : c.weight === "faint" ? 0 : 1;
          return { id: c.id, cross, fresh, weight, unvisited: !state.visited.includes(c.id) };
        })
        .filter(Boolean) as {
        id: string;
        cross: boolean;
        fresh: boolean;
        weight: number;
        unvisited: boolean;
      }[];
      scored.sort(
        (a, b) =>
          Number(b.fresh) - Number(a.fresh) +
          (Number(b.cross) - Number(a.cross)) * 0.6 +
          (b.weight - a.weight) * 0.4,
      );
      if (!scored.length) return null;
      return { from, to: scored[0].id };
    };

    return {
      ...state,
      navigate,
      visit: (id) => dispatch({ type: "visit", id }),
      trace: (a, b) => dispatch({ type: "trace", key: edgeKey(a, b) }),
      enterRoom: (id) => dispatch({ type: "rooms", id }),
      setSound: (on) => dispatch({ type: "sound", on }),
      setSearch: (on) => dispatch({ type: "search", on }),
      setReveal: (edge) => dispatch({ type: "reveal", edge }),
      resetSession: () => {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        dispatch({ type: "hydrate", data: { visited: [], traced: [], rooms: [] } });
      },
      visitedCount,
      roomsExplored,
      threadUnlocked,
      isVisited: (id) => state.visited.includes(id),
      isTraced: (a, b) => state.traced.includes(edgeKey(a, b)),
      nextConnection,
      beginReveal: (fromId, targetId) => {
        const next = targetId ? { from: fromId, to: targetId } : nextConnection(fromId);
        if (!next) return;
        dispatch({ type: "trace", key: edgeKey(next.from, next.to) });
        dispatch({ type: "reveal", edge: next });
        emitThreadPulse();
      },
    };
  }, [state, navigate]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useArchive() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useArchive must be used inside ArchiveProvider");
  return ctx;
}

/* ---------- shared selectors used by the Index and the map ---------- */

export const artifactsInRoom = (room: DomainId) => ARTIFACTS.filter((a) => a.domain === room);

export const typeCount = (room: DomainId) =>
  artifactsInRoom(room).reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {});

export const connectionsOf = (id: string) => EDGES.filter((e) => e.a === id || e.b === id);
