import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Backdrop,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  Typography,
  TextField,
  Box,
} from "@mui/material";

import { fetchMenu } from "../api";


interface MenuItem {
  id: string;
  title: string;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMenu()
      .then((response) => {
        setMenuItems(response.data.menuItems);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onEdit = (value: string) => {
    setSearchQuery(value.toLowerCase());
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1 },
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
          noValidate
        >
          <TextField
            color="primary"
            style={{
              textAlign: "center",
              width: "100%",
              maxWidth: "55ch",
            }}
            onChange={(event) => onEdit(event.target.value)}
            id="search"
            label="සොයන්න"
            variant="outlined"
          />
        </Box>
        <List>
          {menuItems.map((item) => {
            if (
              searchQuery &&
              !item.title.includes(searchQuery) &&
              !item.id.includes(searchQuery)
            ) {
              return null;
            }
            return (
              <ListItem key={item.id}>
                <ListItemButton
                  component={Link}
                  sx={{ textAlign: "center" }}
                  to={`/article/${item.id}`}
                >
                  <Typography flexGrow={1} align="center" variant="h5">
                    {item.title}
                  </Typography>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );
};

export default Menu;
