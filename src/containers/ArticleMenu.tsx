import React from "react";

import { selectArticles, selectCollections } from "../slices/menu";
import { useAppSelector } from "../store";
import Menu from "../components/Menu";
import { useParams } from "react-router-dom";
import BreadcrumbNav from "../components/BreadcrumbNav";
import { Home } from "@mui/icons-material";

const ArticleMenu = () => {
    const { collectionId }: { collectionId: string | undefined } = useParams();
    const articles = collectionId ? useAppSelector(selectArticles(collectionId)) : {};
    const collections = useAppSelector(selectCollections);

    return (
        <>
            <BreadcrumbNav links={[{text: "වන්දනා ක්‍රම", to: "/", icon: <Home sx={{ mr: 1, marginBottom: "-2.5px" }} fontSize="inherit" />}]} title={collectionId? collections[collectionId]?.title : ""} />
            <Menu isLoading={false} articles={articles} routePrefix="articles" routePostfix={collectionId}/>
        </>
    );
};

export default ArticleMenu;
