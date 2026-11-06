import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";

import { Backdrop, Box, Button, CircularProgress, IconButton, Snackbar, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from "@mui/material";
import { MenuBook, Share, Star, StarBorder } from "@mui/icons-material";

import { fetchArticleById } from "../api";
import ArticleList from "../components/ArticleList";
import ContentContainer from "../components/ContentContainer";
import PageBar from "../components/PageBar";
import ReaderSettings from "../components/ReaderSettings";
import StatusMessage, { NotFound } from "../components/StatusMessage";
import { orderedArticles } from "../content";
import { usePageMeta } from "../hooks/usePageMeta";
import { useWakeLock } from "../hooks/useWakeLock";
import { LINE_HEIGHTS, usePrefs } from "../prefs";
import { selectAllArticles, selectCollections } from "../slices/menu";
import { useAppSelector } from "../store";
import { SERIF } from "../theme/theme";

import LogoSaffron from "/images/VandanaLogoSaffron.svg";
import LogoLamp from "/images/VandanaLogoLamp.svg";

interface ArticleData {
  title: string;
  content: string;
  translation?: string; // Sinhala meaning, when available
  source?: string;
}

type LoadState = "loading" | "loaded" | "notFound" | "error";

const isAxios404 = (error: unknown) =>
  (error as { response?: { status?: number } } | null)?.response?.status === 404;

const scrollProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
};

const Article = () => {
  const { articleId = "" } = useParams();
  const location = useLocation();
  const wide = useMediaQuery("(min-width:900px)");
  const prefs = usePrefs();
  const { fontSize, lineSpacing, keepAwake, themeMode, textLanguage, isFavourite, toggleFavourite, update } = prefs;

  const articles = useAppSelector(selectAllArticles, shallowEqual);
  const collections = useAppSelector(selectCollections);

  const [article, setArticle] = useState<ArticleData>();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useWakeLock(keepAwake && loadState === "loaded");

  // Read once per article open, so later lastRead saves don't re-trigger a resume.
  const resumeFrom = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    setFocused(false);
    const wantsResume = (location.state as { resume?: boolean } | null)?.resume;
    resumeFrom.current = wantsResume && prefs.lastRead?.id === articleId ? prefs.lastRead.progress : null;

    fetchArticleById(articleId).then((response) => {
      if (cancelled) return;
      const data = response.data;
      if (data && typeof data === "object" && typeof data.content === "string") {
        setArticle(data);
        setLoadState("loaded");
      } else if (response.error && !isAxios404(response.error)) {
        setLoadState("error");
      } else {
        // A 404, or the dev server answering with index.html for an unknown file.
        setLoadState("notFound");
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, attempt]);

  // After the text renders: jump to where the reader left off, or to the top.
  useEffect(() => {
    if (loadState !== "loaded") return;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: resumeFrom.current ? resumeFrom.current * max : 0 });
      setProgress(scrollProgress());
    });
  }, [loadState, article]);

  // Track reading progress and remember it for "continue reading".
  useEffect(() => {
    if (loadState !== "loaded") return;
    let saveTimer: number | undefined;
    const onScroll = () => {
      const p = scrollProgress();
      setProgress(p);
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => update({ lastRead: { id: articleId, progress: p } }), 600);
    };
    update({ lastRead: { id: articleId, progress: scrollProgress() } });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(saveTimer);
    };
  }, [loadState, articleId, update]);

  const meta = articles[articleId];
  const collectionId = meta?.collections?.[0];
  const collection = collectionId ? collections[collectionId] : undefined;
  const siblings = orderedArticles(collection, articles);
  const position = siblings.findIndex((a) => a.id === articleId);
  const next = position >= 0 ? siblings[position + 1] : undefined;
  const menuArticle = articles[articleId];

  usePageMeta({
    title: menuArticle ? `${menuArticle.title}${menuArticle.english ? ` (${menuArticle.english})` : ""}` : article?.title,
    description: menuArticle?.description,
    path: `/articles/${articleId}`,
  });
  const backTo = collectionId ? `/collections/${collectionId}` : "/";
  const backLabel = collection?.title ?? "මුල් පිටුව";
  const favourite = isFavourite(articleId);

  const share = async () => {
    const url = window.location.href;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      nav.share({ title: article?.title, url }).catch(() => undefined);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Nothing more we can do; the address bar still has the link.
    }
  };

  const actions = (
    <>
      <IconButton
        aria-label={favourite ? "ප්‍රියතම වලින් ඉවත් කරන්න" : "ප්‍රියතම වලට එක් කරන්න"}
        aria-pressed={favourite}
        onClick={() => toggleFavourite(articleId)}
        sx={{ color: favourite ? "primary.main" : "text.primary", width: 44, height: 44 }}
      >
        {favourite ? <Star /> : <StarBorder />}
      </IconButton>
      <IconButton aria-label="බෙදාගන්න" onClick={share} sx={{ color: "text.primary", width: 44, height: 44 }}>
        <Share fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="කියවීමේ සැකසුම්"
        onClick={() => setSettingsOpen(true)}
        sx={{ color: "text.primary", width: 44, height: 44, fontFamily: SERIF, fontWeight: 600, fontSize: 18, gap: "1px", alignItems: "baseline" }}
      >
        අ<Box component="span" sx={{ fontSize: 12 }}>අ</Box>
      </IconButton>
    </>
  );

  const renderText = () => {
    if (loadState === "notFound") return <NotFound />;
    if (loadState === "error") {
      return <StatusMessage message="පූරණය කිරීමට නොහැකි විය" hint="අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කරන්න" onRetry={() => setAttempt(attempt + 1)} />;
    }
    return (
      <Box
        component="article"
        // Tap the text to hide or show the bars (focus mode).
        onClick={(event: React.MouseEvent) => {
          if ((event.target as HTMLElement).closest("a, button")) return;
          setFocused((f) => !f);
        }}
        sx={{ maxWidth: 680, mx: "auto", px: { xs: 2.5, sm: 4 }, pt: 3, pb: 8, cursor: "default" }}
      >
        <Typography variant="h4" component="h1" align="center" sx={{ fontSize: { xs: 27, sm: 30 } }}>
          {article?.title}
        </Typography>
        {collection && (
          <Typography align="center" color="text.secondary" sx={{ fontSize: 12.5, mt: 0.5, mb: 3 }}>
            {menuArticle?.english && `${menuArticle.english} · `}
            {collection.title}
            {position >= 0 && ` · ${position + 1} / ${siblings.length}`}
          </Typography>
        )}
        {article?.translation && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={textLanguage}
              aria-label="පාඨයේ භාෂාව"
              onChange={(_, value) => value && update({ textLanguage: value })}
            >
              <ToggleButton value="pali" sx={{ px: 2, fontWeight: 600 }}>පාළි</ToggleButton>
              <ToggleButton value="sinhala" sx={{ px: 2, fontWeight: 600 }}>සිංහල අරුත</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        <ContentContainer
          article={article?.translation && textLanguage === "sinhala" ? article.translation : article?.content}
          fontSize={fontSize}
          lineHeight={LINE_HEIGHTS[lineSpacing]}
        />
        {article?.source && (
          <Typography color="text.secondary" align="center" sx={{ fontSize: 12.5, mt: 3 }}>
            මූලාශ්‍රය: {article.source}
          </Typography>
        )}

        {loadState === "loaded" && (
          <Box sx={{ mt: 4, bgcolor: (t) => t.tokens.accentTint, borderRadius: 4, p: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
            {next ? (
              <>
                <Typography color="text.secondary" sx={{ fontSize: 12.5, fontWeight: 600 }}>
                  ඊළඟට · {backLabel} {position + 2} / {siblings.length}
                </Typography>
                <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: 20 }}>
                  {next.title}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<MenuBook />}
                  component={Link}
                  to={`/articles/${next.id}`}
                  state={{ from: location.pathname }}
                  replace
                  sx={{ height: 48 }}
                >
                  කියවන්න
                </Button>
              </>
            ) : (
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                {backLabel} එකතුවේ අවසාන පාඨයයි.
              </Typography>
            )}
            <Button variant="outlined" component={Link} to={backTo} sx={{ height: 46 }}>
              {backLabel} ලැයිස්තුවට
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const reader = (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <PageBar backTo={backTo} backLabel={backLabel} actions={loadState === "loaded" ? actions : undefined} progress={loadState === "loaded" ? progress : undefined} hidden={focused} />
      {focused && (
        <Box sx={{ position: "fixed", top: "env(safe-area-inset-top, 0px)", left: 0, right: 0, height: 3, zIndex: 11, bgcolor: "divider" }}>
          <Box sx={{ height: "100%", width: `${Math.round(progress * 100)}%`, bgcolor: "primary.main" }} />
        </Box>
      )}
      {renderText()}
    </Box>
  );

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }} open={loadState === "loading"}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {wide && collection ? (
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Box
            component="nav"
            aria-label={collection.title}
            sx={{
              width: 320,
              flex: "none",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
              borderRight: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
              <Link to="/">
                <Box component="img" src={themeMode === "night" ? LogoLamp : LogoSaffron} alt="වන්දනා" sx={{ height: 32, display: "block" }} />
              </Link>
              <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600, mt: 2 }}>
                {collection.title} · {siblings.length}
              </Typography>
            </Box>
            <ArticleList articles={siblings} numbered currentId={articleId} />
          </Box>
          {reader}
        </Box>
      ) : (
        reader
      )}

      <ReaderSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} message="සබැඳිය පිටපත් කළා" />
    </>
  );
};

export default Article;
