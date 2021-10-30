import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Menu from "./containers/Menu";
import Article from "./containers/Article";
import Layout from "./hoc/Layout";
import { theme } from "./theme/theme";

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Switch>
              <Route exact path="/" component={Menu} />
              <Route exact path="/article/:articleId" component={Article} />
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
