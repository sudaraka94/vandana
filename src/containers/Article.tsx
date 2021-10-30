import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Box } from "@mui/system";
import { Fab, Typography, Zoom } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { fetchArticleById } from "../api";

// used as the structure for the article
interface Article {
  title: string;
  content: string;
}

const Article = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    fetchArticleById(articleId).then((response) => {
      setArticle(response.data);
    });
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
      <Box paddingBottom={16} maxWidth={400}>
        <Typography variant="h4" align="center">
          {article?.title}
        </Typography>
        <Typography variant="body1" align="center">
          {article?.content}
        </Typography>
      </Box>
      <Box position="fixed" bottom={16} right={16}>
        <Zoom in={true}>
          <Fab color="primary" aria-label="back" href="/">
            <ArrowBack />
          </Fab>
        </Zoom>
      </Box>
    </Box>
  );
};

export default Article;
