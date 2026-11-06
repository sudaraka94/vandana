// Runs after `vite build`. Writes a real HTML file for every page so that
// search engines and AI crawlers (which often don't run JavaScript) get the
// full text, a page title, description, share tags and structured data, with
// HTTP status 200 instead of GitHub Pages' 404 fallback. React replaces the
// pre-built markup as soon as the app loads.
//
// Also writes sitemap.xml, llms.txt and llms-full.txt.
import fs from "node:fs";
import path from "node:path";

const OUT = "docs";
const read = (file) => fs.readFileSync(file, "utf8");
const SITE = JSON.parse(read("src/site.json"));
const menu = JSON.parse(read("public/content/menu.json"));
const template = read(path.join(OUT, "index.html"));
if (template.includes("application/ld+json")) {
  throw new Error("docs/index.html is already pre-rendered; run `vite build` first.");
}

const esc = (text = "") =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => SITE.url + p;

// Texts of a collection in recitation order (same rule as src/content.ts).
const ordered = (collectionId) =>
  menu.collections[collectionId].articles
    .map((id, index) => ({ article: menu.articles[id], index }))
    .filter((e) => e.article)
    .sort((a, b) => (a.article.order ?? Infinity) - (b.article.order ?? Infinity) || a.index - b.index)
    .map((e) => e.article);

const collectionInfo = (id) => SITE.collections[id] ?? { english: "", description: "", about: "" };
const collectionName = (id) =>
  `${menu.collections[id].title}${collectionInfo(id).english ? ` (${collectionInfo(id).english})` : ""}`;
const articleName = (a) => `${a.title}${a.english ? ` (${a.english})` : ""}`;

// HTML content to plain text, for llms-full.txt.
const ENTITIES = { nbsp: " ", shy: "", zwj: "\u200d", zwnj: "\u200c", ndash: "–", mdash: "—", amp: "&", quot: '"', lt: "<", gt: ">", apos: "'" };
const toText = (html) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h\d|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const breadcrumb = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(p) })),
});

// Plain, readable markup shown before the app loads (and to crawlers).
const STYLE = `<style>.pre{max-width:680px;margin:0 auto;padding:24px 20px 48px;font-family:"Noto Serif Sinhala","Noto Sans Sinhala",serif;color:#2B2118;line-height:1.8}.pre a{color:#B4500F}.pre nav{font-size:14px}.pre h1{font-size:28px;line-height:1.3;margin:16px 0 4px}.pre .sub{color:#6B5B4B;font-size:14px;margin:0 0 24px}.pre ul{padding-left:20px}</style>`;

const page = ({ p, title, description, type = "website", ld, body }) => {
  const url = abs(p);
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} · ${SITE.tagline}`;
  const head = [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="si_LK" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(fullTitle)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${abs(SITE.image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />`,
    jsonLd({ "@context": "https://schema.org", "@graph": ld }),
  ].join("\n    ");
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, "")
    .replace(/<meta name="description"[^>]*>\s*/, "")
    .replace("</head>", `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${STYLE}<div class="pre">${body}</div></div>`);
  const file = p === "/" ? path.join(OUT, "index.html") : path.join(OUT, `${p.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

const website = {
  "@type": "WebSite",
  "@id": abs("/#website"),
  name: SITE.name,
  alternateName: [SITE.english, SITE.tagline],
  url: abs("/"),
  inLanguage: "si",
  description: SITE.about,
};

const collectionIds = Object.keys(menu.collections);

// Home
page({
  p: "/",
  description: SITE.description,
  ld: [website],
  body: [
    `<h1>${esc(SITE.name)} · ${esc(SITE.tagline)}</h1>`,
    `<p class="sub">${esc(SITE.about)}</p>`,
    ...collectionIds.map(
      (id) =>
        `<h2><a href="/collections/${id}">${esc(collectionName(id))}</a></h2><p>${esc(collectionInfo(id).description)}</p><ul>${ordered(id)
          .map((a) => `<li><a href="/articles/${a.id}">${esc(articleName(a))}</a>${a.note ? ` · ${esc(a.note)}` : ""}</li>`)
          .join("")}</ul>`
    ),
  ].join("\n"),
});

// Collections
for (const id of collectionIds) {
  const p = `/collections/${id}`;
  const info = collectionInfo(id);
  const items = ordered(id);
  page({
    p,
    title: collectionName(id),
    description: `${info.description}. ${info.about}`,
    ld: [
      {
        "@type": "CollectionPage",
        "@id": abs(p),
        name: collectionName(id),
        description: info.about,
        url: abs(p),
        inLanguage: "si",
        isPartOf: { "@id": abs("/#website") },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: articleName(a), url: abs(`/articles/${a.id}`) })),
        },
      },
      breadcrumb([[SITE.name, "/"], [collectionName(id), p]]),
    ],
    body: [
      `<nav><a href="/">${esc(SITE.name)}</a></nav>`,
      `<h1>${esc(collectionName(id))}</h1>`,
      `<p class="sub">${esc(info.description)}. ${esc(info.about)}</p>`,
      `<ol>${items.map((a) => `<li><a href="/articles/${a.id}">${esc(articleName(a))}</a>${a.note ? ` · ${esc(a.note)}` : ""}</li>`).join("")}</ol>`,
    ].join("\n"),
  });
}

// Texts
const fullText = [];
for (const a of Object.values(menu.articles)) {
  const p = `/articles/${a.id}`;
  const data = JSON.parse(read(path.join("public/content", `${a.id}.json`)));
  const cid = a.collections?.[0];
  const crumbs = [[SITE.name, "/"], ...(cid ? [[collectionName(cid), `/collections/${cid}`]] : []), [articleName(a), p]];
  const siblings = cid ? ordered(cid).filter((s) => s.id !== a.id) : [];
  page({
    p,
    title: articleName(a),
    description: a.description,
    type: "article",
    ld: [
      {
        "@type": "CreativeWork",
        "@id": abs(p),
        name: a.title,
        alternateName: a.english,
        headline: articleName(a),
        description: a.about || a.description,
        abstract: a.note,
        keywords: (a.keywords || []).join(", "),
        genre: "Buddhist chant",
        inLanguage: "si",
        isAccessibleForFree: true,
        url: abs(p),
        image: abs(SITE.image),
        isPartOf: cid ? { "@id": abs(`/collections/${cid}`) } : { "@id": abs("/#website") },
      },
      breadcrumb(crumbs),
    ],
    body: [
      `<nav>${crumbs.slice(0, -1).map(([name, href]) => `<a href="${href}">${esc(name)}</a>`).join(" › ")}</nav>`,
      `<h1>${esc(a.title)}</h1>`,
      `<p class="sub">${[a.english, a.note].filter(Boolean).map(esc).join(" · ")}</p>`,
      `<article>${data.content}</article>`,
      data.translation ? `<h2>සිංහල අරුත</h2><article>${data.translation}</article>` : "",
      data.source ? `<p class="sub">මූලාශ්‍රය: ${esc(data.source)}</p>` : "",
      siblings.length
        ? `<h2>${esc(menu.collections[cid].title)}</h2><ul>${siblings.map((s) => `<li><a href="/articles/${s.id}">${esc(articleName(s))}</a></li>`).join("")}</ul>`
        : "",
    ].join("\n"),
  });
  fullText.push({ a, cid, text: toText(data.content), meaning: data.translation ? toText(data.translation) : "", source: data.source });
}

// sitemap.xml
const urls = ["/", ...collectionIds.map((id) => `/collections/${id}`), ...Object.keys(menu.articles).map((id) => `/articles/${id}`)];
fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${abs(u)}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);

// llms.txt: a short guide to the site for AI tools (https://llmstxt.org).
const llms = [
  `# ${SITE.english} (${SITE.name})`,
  "",
  `> ${SITE.about}`,
  "",
  "Texts are in Pali or Sinhala, written in Sinhala script. Each link below is a page with the full text.",
  `The complete text of every page is in one file: ${abs("/llms-full.txt")}`,
  "",
  ...collectionIds.flatMap((id) => [
    `## ${collectionInfo(id).english || id} (${menu.collections[id].title})`,
    "",
    collectionInfo(id).about,
    "",
    ...ordered(id).map((a) => `- [${articleName(a)}](${abs(`/articles/${a.id}`)}): ${a.about || a.note || ""}`),
    "",
  ]),
];
fs.writeFileSync(path.join(OUT, "llms.txt"), llms.join("\n"));

const full = [
  `# ${SITE.english} (${SITE.name}): full texts`,
  "",
  `> ${SITE.about}`,
  "",
  ...fullText.flatMap(({ a, cid, text, meaning, source }) => [
    `## ${articleName(a)}`,
    "",
    `URL: ${abs(`/articles/${a.id}`)}`,
    cid ? `Collection: ${collectionName(cid)}` : "",
    a.note ? `Note: ${a.note}` : "",
    a.about ? `About: ${a.about}` : "",
    source ? `Source: ${source}` : "",
    "",
    text,
    "",
    ...(meaning ? ["### Sinhala meaning (සිංහල අරුත)", "", meaning, ""] : []),
  ]),
];
fs.writeFileSync(path.join(OUT, "llms-full.txt"), full.filter((l, i, arr) => l !== "" || arr[i - 1] !== "").join("\n"));

console.log(`Pre-rendered ${urls.length} pages, sitemap.xml, llms.txt and llms-full.txt`);
