import React, { useEffect, useState } from "react";

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
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
        setSearchQuery(value);
    };

    return (
        <Box>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1 }, display: "flex", flex: "1", justifyContent: "center" }}
                noValidate
            >
                <TextField onChange={event => onEdit(event.target.value)} id="outlined-basic" label="Search" variant="outlined" />
            </Box>
            <List>
                {menuItems.map((item) => {
                    if(searchQuery && !item.title.includes(searchQuery) && !item.id.includes(searchQuery)) {
                        return null
                    }
                    return (
                        <ListItem key={item.id}>
                            <ListItemButton component="a" href={`/article/${item.id}`}>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default Menu;
