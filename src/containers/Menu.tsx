import React, { useEffect, useState } from "react";

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Box } from "@mui/system";

import { fetchMenu } from "../api";

interface MenuItem {
  id: string;
  title: string;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetchMenu().then((response) => {
      setMenuItems(response.data.menuItems);
    });
  }, []);

  return (
    <Box>
      <List>
        {menuItems.map((item) => {
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
