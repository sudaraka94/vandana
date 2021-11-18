import { Home } from "@mui/icons-material";
import React from "react";
import BreadcrumbNav from "../components/BreadcrumbNav";
import Menu from "../components/Menu";
import { selectCollections } from "../slices/menu";
import { useAppSelector } from "../store";


const MainMenu = () => {
    const collections = useAppSelector(selectCollections);

    return (
        <>
            <BreadcrumbNav title="වන්දනා ක්‍රම" titleIcon={<Home sx={{ mr: 1, marginBottom: "-2.5px" }} fontSize="inherit"/>} />
            <Menu isLoading={false} articles={collections} routePrefix="collections" />
        </>
    );
}

export default MainMenu;