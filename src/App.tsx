import React, { useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import Collection from "./containers/Collection";
import Article from "./containers/Article";
import Layout from "./hoc/Layout";
import { makeTheme, TOKENS } from "./theme/theme";
import Home from "./containers/Home";
import { PrefsProvider, usePrefs } from "./prefs";
import { useAppDispatch } from "./store";
import { loadMenu } from "./loadMenu";
import { NotFound } from "./components/StatusMessage";

const firebaseConfig = {
  apiKey: "AIzaSyDZmhbMzCOtPgCY5CItE8jtWlXeWs4kWQ8",
  projectId: "vandana-94dfa",
  appId: "1:901516946638:web:f5072b42552596b8c6b49f",
  measurementId: "G-Z9N1XMK4C6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

function ThemedApp() {
  const dispatch = useAppDispatch();
  const { themeMode } = usePrefs();
  const theme = useMemo(() => makeTheme(themeMode), [themeMode]);

  // Match the browser/OS bar to the top of the page.
  useEffect(() => {
    const color = themeMode === "night" ? TOKENS.night.surface : TOKENS[themeMode].accent;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, [themeMode]);

  // Load the menu once when the app starts.
  useEffect(() => {
    loadMenu(dispatch);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/:collectionId" element={<Collection />} />
            <Route path="/articles/:articleId" element={<Article />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
