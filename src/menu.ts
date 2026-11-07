import { useSyncExternalStore } from "react";

// The list of texts and collections (public/content/menu.json, made by
// `yarn generate-content`). Loaded once and shared by every screen.

export interface MenuArticle {
  id: string;
  title: string;
  keywords?: string[];
  collections?: string[];
  // Optional, from content frontmatter: a one-line note and recitation order.
  note?: string;
  order?: number;
  // English name and one-line English summary, for search engines.
  english?: string;
  about?: string;
  description?: string;
}

export interface Collection {
  id: string;
  title: string;
  articles: string[];
}

export interface MenuState {
  status: "loading" | "loaded" | "error";
  articles: { [id: string]: MenuArticle };
  collections: { [id: string]: Collection };
}

let state: MenuState = { status: "loading", articles: {}, collections: {} };
const listeners = new Set<() => void>();

const setState = (next: MenuState) => {
  state = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

let pending: Promise<void> | null = null;

// Starts loading the menu; safe to call again (e.g. from a retry button).
export const loadMenu = () => {
  if (pending) return pending;
  if (state.status !== "loading") setState({ ...state, status: "loading" });
  pending = fetch("/content/menu.json")
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then((data) => {
      if (!data || typeof data !== "object" || !data.articles || !data.collections) throw new Error("Bad menu");
      setState({ status: "loaded", articles: data.articles, collections: data.collections });
    })
    .catch(() => setState({ ...state, status: "error" }))
    .finally(() => {
      pending = null;
    });
  return pending;
};

export const useMenu = () => useSyncExternalStore(subscribe, () => state);

export interface ArticleData {
  title: string;
  content: string;
  translation?: string; // Sinhala meaning, when available
  source?: string;
}

export type ArticleResult =
  | { status: "loaded"; data: ArticleData }
  | { status: "notFound" }
  | { status: "error" };

export const fetchArticle = async (id: string): Promise<ArticleResult> => {
  let response: Response;
  try {
    response = await fetch(`/content/${encodeURIComponent(id)}.json`);
  } catch {
    return { status: "error" }; // Offline or the request failed.
  }
  if (response.status === 404) return { status: "notFound" };
  if (!response.ok) return { status: "error" };
  try {
    const data = await response.json();
    if (data && typeof data === "object" && typeof data.content === "string") return { status: "loaded", data };
  } catch {
    // The dev server answers unknown files with index.html.
  }
  return { status: "notFound" };
};
