import React from "react";
import Menu from "../components/Menu";
import { selectCollections } from "../slices/menu";
import { useAppSelector } from "../store";


const MainMenu = () => {
    const collections = useAppSelector(selectCollections);

    return (
        <>
            <Menu isLoading={false} articles={collections} routePrefix="collections" />
        </>
    );
}

export default MainMenu;