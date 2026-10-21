import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Comment, Journey } from "@/types/journey";
import { DEMO_USER, newId, sampleJourneys } from "@/data/sampleJourneys";

interface State {
  journeys: Journey[];
  bookmarks: string[];
  reactions: Record<string, number>;
  myReactions: string[];
  comments: Comment[];
}

const KEY = "cach-ma-minh-da:v2";
const initial: State = {
  journeys: sampleJourneys,
  bookmarks: [],
  reactions: {
    "hoc-ve-o-tuoi-30": 24,
    "lan-truot-dai-hoc": 57,
    "roi-thanh-pho": 12,
    "mua-dong-trong-dau": 88,
  },
  myReactions: [],
  comments: [
    {
      id: "cm1",
      journeyId: "lan-truot-dai-hoc",
      author: "Thảo",
      text: "Cảm ơn bạn đã viết ra. Mình cũng từng như vậy.",
      createdAt: "2026-01-12",
    },
  ],
};

interface Store extends State {
  saveJourney: (j: Journey) => void;
  deleteJourney: (id: string) => void;
  togglePublished: (id: string) => void;
  toggleBookmark: (id: string) => void;
  toggleReaction: (id: string) => void;
  addComment: (journeyId: string, text: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, loaded]);

  const toggleIn = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const saveJourney = useCallback((j: Journey) => {
    setState((s) => {
      const exists = s.journeys.some((x) => x.id === j.id);
      const next = { ...j, updatedAt: new Date().toISOString().slice(0, 10) };
      return {
        ...s,
        journeys: exists
          ? s.journeys.map((x) => (x.id === j.id ? next : x))
          : [next, ...s.journeys],
      };
    });
  }, []);

  const value: Store = {
    ...state,
    saveJourney,
    deleteJourney: (id) =>
      setState((s) => ({ ...s, journeys: s.journeys.filter((j) => j.id !== id) })),
    togglePublished: (id) =>
      setState((s) => ({
        ...s,
        journeys: s.journeys.map((j) => (j.id === id ? { ...j, published: !j.published } : j)),
      })),
    toggleBookmark: (id) => setState((s) => ({ ...s, bookmarks: toggleIn(s.bookmarks, id) })),
    toggleReaction: (id) =>
      setState((s) => {
        const had = s.myReactions.includes(id);
        return {
          ...s,
          myReactions: toggleIn(s.myReactions, id),
          reactions: { ...s.reactions, [id]: Math.max(0, (s.reactions[id] ?? 0) + (had ? -1 : 1)) },
        };
      }),
    addComment: (journeyId, text) =>
      setState((s) => ({
        ...s,
        comments: [
          ...s.comments,
          {
            id: newId("cm"),
            journeyId,
            author: DEMO_USER.name,
            text,
            createdAt: new Date().toISOString().slice(0, 10),
          },
        ],
      })),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}

/** Journeys visible to everyone: published and public. */
export const isVisible = (j: Journey) => j.published && j.privacy === "public";
