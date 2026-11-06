import React from "react";

import { AppBar, Button, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import Logo from "/images/VandanaLogo.svg";
import { ArrowBackIosNew } from "@mui/icons-material";
import { selectAllArticles } from "../slices/menu";
import { useAppSelector } from "../store";

interface LayoutProps {
  children: JSX.Element;
}

// BrowserRouter numbers its history entries; idx 0 is the page the visitor
// landed on, so anything above 0 means there is an in-app page to go back to.
const hasInAppHistory = () => (window.history.state?.idx ?? 0) > 0;

const Layout = (props: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const articles = useAppSelector(selectAllArticles);

  // Where "back" goes when the visitor arrived straight on this page
  // (e.g. from a shared link): one level up instead of leaving the site.
  const parentPath = () => {
    const articleMatch = matchPath("/articles/:articleId", location.pathname);
    const collectionId = articleMatch?.params.articleId
      ? articles[articleMatch.params.articleId]?.collections?.[0]
      : undefined;
    return collectionId ? `/collections/${collectionId}` : "/";
  };

  const goBack = () => {
    if (hasInAppHistory()) {
      navigate(-1);
    } else {
      navigate(parentPath(), { replace: true });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {location.pathname !== "/" && (
            <Button
              variant="outlined"
              aria-label="ආපසු"
              sx={{ color: '#ffff', borderColor: '#ffff', position: 'absolute' }}
              onClick={goBack}
            >
              <ArrowBackIosNew />
            </Button>
          )}
          <Box display="flex" flex="1" justifyContent="center">
            <Link to="/">
              <img src={Logo} alt="වන්දනා" height={40} />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      {props.children}
    </Box>
  );
};

export default Layout;
