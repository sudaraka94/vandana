import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { Box } from "@mui/system";
import { Backdrop, BottomNavigation, BottomNavigationAction, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { Home, ZoomIn, ZoomOut } from "@mui/icons-material";

import { fetchArticleById } from "../api";
import ContentContainer from "../components/ContentContainer";
import BreadcrumbNav from "../components/BreadcrumbNav";
import { useAppSelector } from "../store";
import { selectCollections } from "../slices/menu";

// used as the structure for the article
interface Suggestion {
  id: string;
  title: string;
}

interface Article {
  title: string;
  content: string;
  suggestions: Suggestion[];
}

interface IArticleParams {
  articleId: string | undefined;
}

const Article = () => {
  const { articleId = "" }: IArticleParams = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const collections = useAppSelector(selectCollections);

  const [article, setArticle] = useState<Article>();
  const [fontSize, setFontSize] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetchArticleById(articleId)
      .then((response) => {
        setArticle(response.data);
        window.scrollTo({ top: 0 });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [articleId]);

  const zoomIn = () => {
    if (fontSize < 16) {
      setFontSize(fontSize * 1.1);
    } else {
      setFontSize(16);
    }
  };

  const zoomOut = () => {
    if (fontSize > 1) {
      setFontSize(fontSize * 0.9);
    } else {
      setFontSize(1);
    }
  };

  const getBreadCrumbLinks = () => {
    const collectionId = searchParams.get('collectionId');
    if (collectionId && collections) {
      return [
        { text: "වන්දනා ක්‍රම", to: "/", icon: <Home sx={{ mr: 1, marginBottom: "-2.5px" }} fontSize="inherit" /> },
        { text: collections[collectionId]?.title, to: "/collections/" + collectionId }
      ]
    }
    return [
      { text: "වන්දනා ක්‍රම", to: "/", icon: <Home sx={{ mr: 1, marginBottom: "-2.5px" }} fontSize="inherit" /> },
      { text: "සියලු ගථා", to: "/collections/all" },
    ]

  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <BreadcrumbNav links={getBreadCrumbLinks()} title={article ? article.title : ""} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={4}
      >
        <Box width={"100%"} maxWidth={800}>
          <Typography variant="h4" align="center">
            ☸ {article?.title}
          </Typography>
          <Divider sx={{marginTop: "7px"}} />
          <ContentContainer article={article?.content} fontSize={fontSize} />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
          p={1}
        >
        </Box>

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation showLabels>
            <BottomNavigationAction label="අකුරු විශාල කරන්න" icon={<ZoomIn />} onClick={zoomIn} />
            <BottomNavigationAction label="අකුරු කුඩා කරන්න" icon={<ZoomOut />} onClick={zoomOut} />
          </BottomNavigation>
        </Paper>
      </Box>
    </>
  );
};

export default Article;

