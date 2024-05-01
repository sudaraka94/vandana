import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import ArticleMenu from "./containers/ArticleMenu";
import Article from "./containers/Article";
import Layout from "./hoc/Layout";
import { theme } from "./theme/theme";
import MainMenu from "./containers/MainMenu";
import { useAppDispatch } from "./store";
import { fetchMenu } from "./api";
import { MenuState, updateMenu } from "./slices/menu";

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
  // load menu upon loading the app
  const dispatch = useAppDispatch()
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {

    fetchMenu().then((response) => {
      const menuState: MenuState = {
        isMenuLoading: false,
        articles: response.data.articles,
        collections: response.data.collections
      }

      dispatch(updateMenu(menuState));
      setFirstLoad(false);
    });
  });

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ResetPath firstLoad={firstLoad} />
          <Layout>
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/collections/:collectionId" element={<ArticleMenu />} />
              <Route path="/articles/:articleId" element={<Article />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

const ResetPath: React.FC<{firstLoad: boolean}> = ({firstLoad}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!firstLoad) return;
    const currentURL = window.location.pathname + window.location.search;
    navigate(currentURL);
  });

  return null;
}

export default App;
