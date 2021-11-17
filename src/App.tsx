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

  useEffect(() => {
    fetchMenu().then((response) => {
      const menuState: MenuState = {
        isMenuLoading: false,
        articles: response.data.articles,
        collections: response.data.collections
      }

      dispatch(updateMenu(menuState));
    });
  });

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route exact path="/" component={<MainMenu />} />
              <Route exact path="/collections/:collectionId" component={<ArticleMenu />} />
              <Route exact path="/articles/:articleId" component={<Article />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
