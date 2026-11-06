import React from "react";
import { shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";

import { selectArticles, selectCollections, selectIsMenuLoading } from "../slices/menu";
import { useAppSelector } from "../store";
import Menu from "../components/Menu";
import { NotFound } from "../components/StatusMessage";

const ArticleMenu = () => {
    const { collectionId = "" } = useParams();
    const articles = useAppSelector(selectArticles(collectionId), shallowEqual);
    const collections = useAppSelector(selectCollections);
    const isMenuLoading = useAppSelector(selectIsMenuLoading);

    if (!isMenuLoading && Object.keys(collections).length > 0 && !collections[collectionId]) {
        return <NotFound />;
    }

    return <Menu articles={articles} routePrefix="articles" />;
};

export default ArticleMenu;
