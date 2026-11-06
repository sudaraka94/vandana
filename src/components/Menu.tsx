import { Backdrop, Box, CircularProgress, List, ListItem, ListItemButton, TextField, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { loadMenu } from "../loadMenu";
import { selectHasMenuError, selectIsMenuLoading } from "../slices/menu";
import { useAppDispatch, useAppSelector } from "../store";
import StatusMessage from "./StatusMessage";

interface MenuItem {
    title: string;
    keywords?: string[];
}

interface MenuProps {
    articles: { [id: string]: MenuItem }
    routePrefix: string
}

// Search box and the list below it share one width so rows don't span wide screens.
const MENU_MAX_WIDTH = "55ch";

const matches = (query: string, id: string, item: MenuItem) => {
    if (!query) return true;
    return [item.title, id, ...(item.keywords ?? [])]
        .some(text => text?.toLowerCase().includes(query));
};

const Menu = (props: MenuProps) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectIsMenuLoading);
    const hasError = useAppSelector(selectHasMenuError);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const items = Object.entries(props.articles)
        .filter(([id, article]) => article && matches(searchQuery, id, article));

    const renderBody = () => {
        if (hasError) {
            return <StatusMessage message="පූරණය කිරීමට නොහැකි විය" onRetry={() => loadMenu(dispatch)} />;
        }
        if (isLoading) {
            return null;
        }
        if (items.length === 0 && searchQuery) {
            return <StatusMessage message="ගැළපෙන ප්‍රතිඵල නැත" />;
        }
        return (
            <List sx={{ maxWidth: MENU_MAX_WIDTH, mx: "auto" }}>
                {items.map(([id, article]) => (
                    <ListItem key={id}>
                        <ListItemButton sx={{ textAlign: "center" }} component={Link} to={`/${props.routePrefix}/${id}`}>
                            <Typography flexGrow={1} align="center" variant="h5">{article.title}</Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box>
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1 }, display: "flex", flexDirection: "row", justifyContent: "center" }}
                    noValidate
                    // Enter would otherwise submit the form and reload the page.
                    onSubmit={(event: React.FormEvent) => event.preventDefault()}
                >
                    <TextField color="primary" style={{
                        textAlign: 'center',
                        width: "100%",
                        maxWidth: MENU_MAX_WIDTH
                    }}
                        type="search"
                        onChange={event => setSearchQuery(event.target.value.trim().toLowerCase())} id="search" label="සොයන්න" variant="outlined" />
                </Box>
                {renderBody()}
            </Box>
        </>
    );

}

export default Menu;
