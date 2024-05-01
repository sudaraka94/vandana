import React from "react";

import { selectArticles, selectCollections } from "../slices/menu";
import { useAppSelector } from "../store";
import Menu from "../components/Menu";
import { useParams } from "react-router-dom";

const ArticleMenu = () => {
    const { collectionId }: { collectionId?: string } = useParams();
    const articles = collectionId ? useAppSelector(selectArticles(collectionId)) : {};

    return (
        <>
            <Menu isLoading={false} articles={articles} routePrefix="articles" />
        </>
    );
};

export default ArticleMenu;
