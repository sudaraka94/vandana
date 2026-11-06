import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import ArticleMenu from "./containers/ArticleMenu";
import Article from "./containers/Article";
import Layout from "./hoc/Layout";
import { theme } from "./theme/theme";
import MainMenu from "./containers/MainMenu";
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

function App() {
  const dispatch = useAppDispatch();

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
            <Route path="/" element={<MainMenu />} />
            <Route path="/collections/:collectionId" element={<ArticleMenu />} />
            <Route path="/articles/:articleId" element={<Article />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
