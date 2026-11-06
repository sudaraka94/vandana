import { Collection, MenuArticle } from "./slices/menu";
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
