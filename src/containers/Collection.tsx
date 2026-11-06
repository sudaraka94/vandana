import React from "react";
import { Box, Typography } from "@mui/material";
import { shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";

import ArticleList from "../components/ArticleList";
import PageBar from "../components/PageBar";
import StatusMessage, { NotFound } from "../components/StatusMessage";
import { orderedArticles } from "../content";
import { loadMenu } from "../loadMenu";
import { selectAllArticles, selectCollections, selectHasMenuError, selectIsMenuLoading } from "../slices/menu";
import { useAppDispatch, useAppSelector } from "../store";

const Collection = () => {
  const { collectionId = "" } = useParams();
  const dispatch = useAppDispatch();
  const collections = useAppSelector(selectCollections);
  const articles = useAppSelector(selectAllArticles, shallowEqual);
  const isLoading = useAppSelector(selectIsMenuLoading);
  const hasError = useAppSelector(selectHasMenuError);
  const collection = collections[collectionId];

  const renderBody = () => {
    if (hasError) {
      return <StatusMessage message="පූරණය කිරීමට නොහැකි විය" onRetry={() => loadMenu(dispatch)} />;
    }
    if (isLoading) return null;
    if (!collection) return <NotFound />;
    const items = orderedArticles(collection, articles);
    return (
      <>
        <Box px={2.5} pt={2} pb={1}>
          <Typography variant="h4" component="h1">
            {collection.title}
          </Typography>
          <Typography color="text.secondary" fontSize={13}>
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
      <Box maxWidth={680} mx="auto" pb={6}>
        {renderBody()}
      </Box>
    </Box>
  );
};

export default Collection;
