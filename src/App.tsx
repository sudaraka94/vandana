import React, { Suspense, useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import Layout from "./hoc/Layout";
import { lazyWithReload } from "./lazy";
import { makeTheme, TOKENS } from "./theme/theme";
import Home from "./containers/Home";
import { PrefsProvider, usePrefs } from "./prefs";
import { NotFound } from "./components/StatusMessage";
import { usePageViews } from "./hooks/usePageViews";

// The reader and collection screens load on demand, so the home screen
// (where most visits start) downloads less.
const loadArticle = () => import("./containers/Article");
const loadCollection = () => import("./containers/Collection");
const Article = lazyWithReload(loadArticle);
const Collection = lazyWithReload(loadCollection);

// Lives inside the router so it can see route changes.
function PageViews() {
  usePageViews();
  return null;
}

function ThemedApp() {
  const { themeMode } = usePrefs();
  const theme = useMemo(() => makeTheme(themeMode), [themeMode]);

  // Match the browser/OS bar to the top of the page.
  useEffect(() => {
    const color = themeMode === "night" ? TOKENS.night.surface : TOKENS[themeMode].accent;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, [themeMode]);

  // Fetch the other screens in the background once the first one is up, so
  // opening a text doesn't wait for its code.
  useEffect(() => {
    const id = window.setTimeout(() => {
      loadArticle();
      loadCollection();
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <PageViews />
        <Layout>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections/:collectionId" element={<Collection />} />
              <Route path="/articles/:articleId" element={<Article />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <PrefsProvider>
      <ThemedApp />
    </PrefsProvider>
  );
}

export default App;
