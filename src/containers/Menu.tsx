import React, { useEffect, useState } from "react";

import { List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { fetchMenu } from "../api";
import { TextField } from "@material-ui/core";

interface MenuItem {
    id: string;
    title: string;
}

const Menu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        fetchMenu().then((response) => {
            setMenuItems(response.data.menuItems);
        });
    }, []);

    const onEdit = (value: string) => {
        setSearchQuery(value.toLowerCase());
        console.log(searchQuery)
    };

    return (
        <Box>
            <Box component="form" sx={{ '& > :not(style)': { m: 1 }, display: "flex", flexDirection: "row", justifyContent: "center" }} noValidate>
                <TextField style={{
                    textAlign: 'center',
                    width: "100%",
                    maxWidth: "55ch"
                }}
                    onChange={event => onEdit(event.target.value)} id="search" label="සොයන්න" variant="outlined" />
            </Box>
            <List>
                {menuItems.map((item) => {
                    if (searchQuery && !item.title.includes(searchQuery) && !item.id.includes(searchQuery)) {
                        return null
                    }
                    return (
                        <ListItem key={item.id}>
                            <ListItemButton sx={{ textAlign: "center" }} component="a" href={`/article/${item.id}`}>
                                <Typography flexGrow={1} align="center" variant="h5">{item.title}</Typography>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default Menu;
