import { Backdrop, Box, CircularProgress, List, ListItem, ListItemButton, TextField, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";

interface Article {
    title: string;
}

interface MenuProps {
    articles: { [id: string]: Article }
    isLoading: boolean
}

const Menu = (props: MenuProps) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const onEdit = (value: string) => {
        setSearchQuery(value.toLowerCase());
    };

    const getArticles = () => {
        let menuArticles: JSX.Element[] = [];
        for (let [id, article] of Object.entries(props.articles)) {
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
                open={props.isLoading}
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

}

export default Menu;