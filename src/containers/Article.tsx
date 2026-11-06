import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box } from "@mui/system";
import { Backdrop, BottomNavigation, BottomNavigationAction, CircularProgress, Paper, Typography } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";

import { fetchArticleById } from "../api";
import ContentContainer from "../components/ContentContainer";
import StatusMessage, { NotFound } from "../components/StatusMessage";

interface Article {
  title: string;
  content: string;
}

type LoadState = "loading" | "loaded" | "notFound" | "error";

const FONT_SIZE_KEY = "articleFontSize";
const MIN_FONT_SIZE = 0.6;
const MAX_FONT_SIZE = 4;
const BOTTOM_BAR_HEIGHT = 56;

const clampFontSize = (size: number) => Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));

// The chosen text size is kept between texts and visits.
const readSavedFontSize = () => {
  try {
    const saved = parseFloat(localStorage.getItem(FONT_SIZE_KEY) ?? "");
    return Number.isFinite(saved) ? clampFontSize(saved) : 1;
  } catch {
    return 1;
  }
};

const saveFontSize = (size: number) => {
  try {
    localStorage.setItem(FONT_SIZE_KEY, String(size));
  } catch {
    // Storage can be unavailable (private mode); the size just won't be remembered.
  }
};

const isAxios404 = (error: unknown) =>
  (error as { response?: { status?: number } } | null)?.response?.status === 404;

const Article = () => {
  const { articleId = "" } = useParams();

  const [article, setArticle] = useState<Article>();
  const [fontSize, setFontSize] = useState<number>(readSavedFontSize);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetchArticleById(articleId).then((response) => {
      if (cancelled) return;
      const data = response.data;
      if (data && typeof data === "object" && typeof data.content === "string") {
        setArticle(data);
        setLoadState("loaded");
        window.scrollTo({ top: 0 });
      } else if (response.error && !isAxios404(response.error)) {
        setLoadState("error");
      } else {
        // A 404, or the dev server answering with index.html for an unknown file.
        setLoadState("notFound");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [articleId, attempt]);

  const changeFontSize = (factor: number) => {
    const next = clampFontSize(fontSize * factor);
    setFontSize(next);
    saveFontSize(next);
  };

  if (loadState === "notFound") {
    return <NotFound />;
  }

  if (loadState === "error") {
    return <StatusMessage message="පූරණය කිරීමට නොහැකි විය" onRetry={() => setAttempt(attempt + 1)} />;
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadState === "loading"}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={4}
        // Keep the last verse clear of the fixed text-size bar.
        paddingBottom={`calc(${BOTTOM_BAR_HEIGHT}px + 32px + env(safe-area-inset-bottom, 0px))`}
      >
        <Box width={"100%"} maxWidth={800}>
          <Typography variant="h4" align="center">
            {article?.title}
          </Typography>
          <ContentContainer article={article?.content} fontSize={fontSize} />
        </Box>

        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          elevation={3}
        >
          <BottomNavigation showLabels>
            <BottomNavigationAction
              label="අකුරු විශාල කරන්න"
              icon={<ZoomIn />}
              onClick={() => changeFontSize(1.1)}
              disabled={fontSize >= MAX_FONT_SIZE}
            />
            <BottomNavigationAction
              label="අකුරු කුඩා කරන්න"
              icon={<ZoomOut />}
              onClick={() => changeFontSize(1 / 1.1)}
              disabled={fontSize <= MIN_FONT_SIZE}
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </>
  );
};

export default Article;
