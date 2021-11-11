import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box } from "@mui/system";
import { Backdrop, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowBack, ZoomIn, ZoomOut } from "@mui/icons-material";

import { fetchArticleById } from "../api";
import ContentContainer from "../components/ContentContainer";
import ArticleFAB from "../components/ArticleFAB";

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
  const navigate = useNavigate();

  const { articleId = "" }: IArticleParams = useParams();

  const [article, setArticle] = useState<Article>();
  const [fontSize, setFontSize] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchArticleById(articleId)
      .then((response) => {
        setArticle(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

  const fabButtons = [
    {
      label: "zoom in",
      icon: <ZoomIn />,
      onClick: zoomIn,
    },
    {
      label: "zoom out",
      icon: <ZoomOut />,
      onClick: zoomOut,
    },
    {
      label: "back",
      icon: <ArrowBack />,
      onClick: () => {
        navigate("/");
      },
    },
  ];

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={4}
      >
        <Box width={"100%"} maxWidth={800}>
          <Typography variant="h4" align="center">
            {article?.title}
          </Typography>
          <ContentContainer article={article?.content} fontSize={fontSize} />
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" p={1}>
          {article?.suggestions?.map((suggestion) => {
            return (
              <Button
                key={suggestion.id}
                variant="outlined"
                href={`/article/${suggestion.id}`}
              >
                {suggestion.title}
              </Button>
            );
          })}
        </Box>
        <ArticleFAB {...{ fabButtons }} />
      </Box>
    </>
  );
};

export default Article;
