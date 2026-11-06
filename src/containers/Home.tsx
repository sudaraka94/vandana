import React, { useState } from "react";
import { Backdrop, Box, ButtonBase, CircularProgress, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { Close, MenuBook, Search, Star } from "@mui/icons-material";
import { shallowEqual } from "react-redux";
import { Link } from "react-router-dom";

import ArticleList from "../components/ArticleList";
import StatusMessage from "../components/StatusMessage";
import { COLLECTION_DESCRIPTIONS, matchesQuery } from "../content";
import { loadMenu } from "../loadMenu";
import { usePrefs } from "../prefs";
import { selectAllArticles, selectCollections, selectHasMenuError, selectIsMenuLoading } from "../slices/menu";
import { useAppDispatch, useAppSelector } from "../store";
import { SERIF } from "../theme/theme";

import Logo from "/images/VandanaLogo.svg";
import LogoLamp from "/images/VandanaLogoLamp.svg";

const COLUMN = 640;

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "සුබ උදෑසනක්";
  if (hour < 17) return "සුබ දවසක්";
  if (hour < 20) return "සුබ සන්ධ්‍යාවක්";
  return "සුබ රාත්‍රියක්";
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography component="h2" sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", mt: 1 }}>
    {children}
  </Typography>
);

const Home = () => {
  const dispatch = useAppDispatch();
  const collections = useAppSelector(selectCollections);
  const articles = useAppSelector(selectAllArticles, shallowEqual);
  const isLoading = useAppSelector(selectIsMenuLoading);
  const hasError = useAppSelector(selectHasMenuError);
  const { themeMode, lastRead, favourites } = usePrefs();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const night = themeMode === "night";
  const continueArticle = lastRead ? articles[lastRead.id] : undefined;
  const favouriteArticles = favourites.map((id) => articles[id]).filter(Boolean);
  const results = q ? Object.values(articles).filter((a) => matchesQuery(q, a)) : [];

  const renderDashboard = () => (
    <>
      {continueArticle && (
        <>
          <SectionLabel>දිගටම කියවන්න</SectionLabel>
          <Paper
            variant="outlined"
            component={Link}
            to={`/articles/${continueArticle.id}`}
            state={{ resume: true, from: "/" }}
            sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2, borderRadius: 3.5, textDecoration: "none", color: "text.primary" }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: 18 }} noWrap>
                {continueArticle.title}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12.5 }}>
                {collections[continueArticle.collections?.[0] ?? ""]?.title}
                {" · "}
                {Math.round((lastRead?.progress ?? 0) * 100)}% කියවා ඇත
              </Typography>
              <Box sx={{ height: 4, bgcolor: (t) => t.tokens.accentTint, borderRadius: 1, mt: 1, overflow: "hidden" }}>
                <Box sx={{ height: "100%", width: `${Math.round((lastRead?.progress ?? 0) * 100)}%`, bgcolor: "primary.main" }} />
              </Box>
            </Box>
            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: "primary.main", color: "primary.contrastText", display: "grid", placeItems: "center", flex: "none" }}>
              <MenuBook fontSize="small" />
            </Box>
          </Paper>
        </>
      )}

      <SectionLabel>කාණ්ඩ</SectionLabel>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 1.25 }}>
        {Object.entries(collections).map(([id, collection]) => (
          <ButtonBase
            key={id}
            component={Link}
            to={`/collections/${id}`}
            state={{ from: "/" }}
            sx={{
              bgcolor: (t) => t.tokens.accentTint,
              borderRadius: 3.5,
              p: 2,
              minHeight: 124,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              textAlign: "left",
              gap: 1,
            }}
          >
            <Typography sx={{ color: "primary.main", fontWeight: 600, fontSize: 22, fontFamily: "system-ui, sans-serif", lineHeight: 1 }}>
              {collection.articles.length}
            </Typography>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: 19, lineHeight: 1.3 }}>{collection.title}</Typography>
            {COLLECTION_DESCRIPTIONS[id] && (
              <Typography color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.45 }}>
                {COLLECTION_DESCRIPTIONS[id]}
              </Typography>
            )}
          </ButtonBase>
        ))}
      </Box>

      {favouriteArticles.length > 0 && (
        <>
          <SectionLabel>ප්‍රියතම</SectionLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {favouriteArticles.map((article) => (
              <ButtonBase
                key={article.id}
                component={Link}
                to={`/articles/${article.id}`}
                state={{ from: "/" }}
                sx={{ border: 1, borderColor: "divider", bgcolor: "background.paper", borderRadius: 99, px: 1.5, minHeight: 36, gap: 0.75, fontSize: 14 }}
              >
                <Star sx={{ fontSize: 15, color: "primary.main" }} />
                {article.title}
              </ButtonBase>
            ))}
          </Box>
        </>
      )}
    </>
  );

  const renderResults = () => {
    if (results.length === 0) {
      return (
        <StatusMessage
          message="කිසිවක් හමු නොවීය"
          hint="වෙනත් වචනයක් හෝ ඉංග්‍රීසි අකුරින් (jaya, rathana) උත්සාහ කරන්න"
        />
      );
    }
    return (
      <>
        <SectionLabel>ප්‍රතිඵල {results.length}</SectionLabel>
        <ArticleList
          articles={results}
          highlight={q}
          tagFor={(article) => collections[article.collections?.[0] ?? ""]?.title}
        />
      </>
    );
  };

  const renderBody = () => {
    if (hasError) {
      return <StatusMessage message="පූරණය කිරීමට නොහැකි විය" hint="අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කරන්න" onRetry={() => loadMenu(dispatch)} />;
    }
    if (isLoading) return null;
    return q ? renderResults() : renderDashboard();
  };

  return (
    <Box>
      <Backdrop sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        component="header"
        sx={{
          bgcolor: night ? "background.paper" : "primary.main",
          color: night ? "primary.main" : "primary.contrastText",
          borderRadius: "0 0 22px 22px",
          pt: "calc(env(safe-area-inset-top, 0px) + 14px)",
          pb: "44px",
          px: 2.5,
        }}
      >
        <Box sx={{ maxWidth: COLUMN, mx: "auto" }}>
          <Box component="img" src={night ? LogoLamp : Logo} alt="වන්දනා" sx={{ height: 38, display: "block" }} />
          <Typography sx={{ fontSize: 13, opacity: 0.9, mt: 1 }}>
            {greeting()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, maxWidth: COLUMN + 32, mx: "auto" }}>
        <Paper
          component="form"
          role="search"
          onSubmit={(event: React.FormEvent) => event.preventDefault()}
          elevation={0}
          sx={{
            mt: "-28px",
            height: 54,
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 1.75,
            pr: 0.5,
            borderRadius: 3.5,
            border: q ? 2 : 1,
            borderColor: q ? "primary.main" : "divider",
            boxShadow: "0 4px 14px rgba(80, 50, 10, 0.10)",
          }}
        >
          <Search sx={{ color: "text.secondary" }} />
          <InputBase
            id="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="සොයන්න · jaya, රතන…"
            inputProps={{ "aria-label": "සොයන්න", type: "search", enterKeyHint: "search" }}
            sx={{ flex: 1, fontSize: 16, "& input::-webkit-search-cancel-button": { display: "none" } }}
          />
          {query && (
            <IconButton aria-label="සෙවුම මකන්න" onClick={() => setQuery("")}>
              <Close />
            </IconButton>
          )}
        </Paper>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 2, pb: 6 }}>
          {renderBody()}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
