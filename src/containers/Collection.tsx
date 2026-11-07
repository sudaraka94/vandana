import React from "react";
import { Box, Typography } from "@mui/material";
import { Navigate, useParams } from "react-router";

import ArticleList from "../components/ArticleList";
import PageBar from "../components/PageBar";
import StatusMessage, { NotFound } from "../components/StatusMessage";
import { OLD_COLLECTION_IDS, orderedArticles } from "../content";
import { usePageMeta } from "../hooks/usePageMeta";
import { loadMenu, useMenu } from "../menu";
import SITE from "../site.json";

const Collection = () => {
  const { collectionId = "" } = useParams();
  const { status, articles, collections } = useMenu();
  const isLoading = status === "loading";
  const hasError = status === "error";
  const collection = collections[collectionId];
  const info = (SITE.collections as Record<string, { english: string; description: string; about: string }>)[collectionId];

  usePageMeta({
    title: collection ? `${collection.title}${info ? ` (${info.english})` : ""}` : undefined,
    description: info ? `${info.description}. ${info.about}` : undefined,
    path: `/collections/${collectionId}`,
  });

  const newId = OLD_COLLECTION_IDS[collectionId];
  if (newId) return <Navigate to={`/collections/${newId}`} replace />;

  const renderBody = () => {
    if (hasError) {
      return <StatusMessage message="පූරණය කිරීමට නොහැකි විය" onRetry={() => loadMenu()} />;
    }
    if (isLoading) return null;
    if (!collection) return <NotFound />;
    const items = orderedArticles(collection, articles);
    return (
      <>
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Typography variant="h4" component="h1">
            {collection.title}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            පාඨ {items.length}
          </Typography>
        </Box>
        <ArticleList articles={items} numbered />
      </>
    );
  };

  return (
    <Box>
      <PageBar backTo="/" backLabel="මුල් පිටුව" />
      <Box sx={{ maxWidth: 680, mx: "auto", pb: 6 }}>
        {renderBody()}
      </Box>
    </Box>
  );
};

export default Collection;
