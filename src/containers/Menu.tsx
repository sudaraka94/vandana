import React, { useEffect, useState } from "react";

import { Backdrop, CircularProgress, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { fetchMenu } from "../api";
import { TextField } from "@material-ui/core";

interface MenuItem {
    id: string;
    title: string;
}

interface Article {
    title: string;
}

const Menu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [articles, setArticles] = useState<Map<string, Article>>(new Map());

    useEffect(() => {
        fetchMenu().then((response) => {
            setArticles(new Map(response.data.articles));
        })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    const onEdit = (value: string) => {
        setSearchQuery(value.toLowerCase());
    };

    const getArticles = () => {
        let menuArticles: JSX.Element[] = [];
        for (let [id, article] of articles) {
            if (searchQuery && !article.title.includes(searchQuery) && !id.includes(searchQuery)) {
                continue;
            }
            menuArticles.push((
                <ListItem key={id}>
                    <ListItemButton sx={{ textAlign: "center" }} component="a" href={`/article/${id}`}>
                        <Typography flexGrow={1} align="center" variant="h5">{article.title}</Typography>
                    </ListItemButton>
                </ListItem>
            ))
        }

        return menuArticles;
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box>
                <Box component="form" sx={{ '& > :not(style)': { m: 1 }, display: "flex", flexDirection: "row", justifyContent: "center" }} noValidate>
                    <TextField color="primary" style={{
                        textAlign: 'center',
                        width: "100%",
                        maxWidth: "55ch"
                    }}
                        onChange={event => onEdit(event.target.value)} id="search" label="සොයන්න" variant="outlined" />
                </Box>
                <List>
                    {getArticles()}
                </List>
            </Box>
        </>
    );
};

export default Menu;
