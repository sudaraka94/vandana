import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { selectArticles, selectCollections } from "../slices/menu";
import { useAppSelector } from "../store";


const MainMenu = () => {
    const collections = useAppSelector(selectCollections);

    return (
        <>
            <Menu isLoading={false} articles={collections} />
        </>
    );
}

export default MainMenu;