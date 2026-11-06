import { useEffect } from "react";
import SITE from "../site.json";

interface PageMeta {
  title?: string;
  description?: string;
  path: string;
}

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

// Keeps the tab title, description, canonical link and share tags in step with
// the page when moving around inside the app. The pre-built HTML for each page
// (scripts/prerender.mjs) sets the same values for the first load and crawlers.
export const pageTitle = (title?: string) => (title ? `${title} · ${SITE.name}` : `${SITE.name} · ${SITE.tagline}`);

export const usePageMeta = ({ title, description, path }: PageMeta) => {
  useEffect(() => {
    const fullTitle = pageTitle(title);
    const desc = description || SITE.description;
    const url = SITE.url + path;
    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path]);
};
