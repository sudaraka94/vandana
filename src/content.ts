import { Collection, MenuArticle } from "./menu";
import REDIRECTS from "./redirects.json";
import SITE from "./site.json";

// One-line descriptions shown on the home screen's collection cards.
export const COLLECTION_DESCRIPTIONS: { [id: string]: string } = Object.fromEntries(
  Object.entries(SITE.collections).map(([id, c]) => [id, c.description])
);

// Texts of a collection in recitation order: by `order` from the content
// frontmatter where given, otherwise in the order listed in menu.json.
export const orderedArticles = (
  collection: Collection | undefined,
  articles: { [id: string]: MenuArticle }
): MenuArticle[] => {
  if (!collection) return [];
  return collection.articles
    .map((id, index) => ({ article: articles[id], index }))
    .filter((entry) => Boolean(entry.article))
    .sort((a, b) => {
      const ao = a.article.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.article.order ?? Number.MAX_SAFE_INTEGER;
      return ao - bo || a.index - b.index;
    })
    .map((entry) => ({ ...entry.article, id: entry.article.id ?? collection.articles[entry.index] }));
};

// Case-insensitive match on title, id and keywords (so Latin like "jaya" works).
export const matchesQuery = (query: string, article: MenuArticle) => {
  if (!query) return true;
  return [article.title, article.id, ...(article.keywords ?? [])].some((text) =>
    text?.toLowerCase().includes(query)
  );
};

// Addresses used before the texts were renamed in 2024 (src/redirects.json).
// Old shared links and bookmarks are sent to the current page.
export const OLD_ARTICLE_IDS: { [oldId: string]: string } = REDIRECTS.articles;
export const OLD_COLLECTION_IDS: { [oldId: string]: string } = REDIRECTS.collections;
