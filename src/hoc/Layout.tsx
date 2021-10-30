import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/">වන්දනා</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            {props.children}
        </Box>
    )
}

export default Layout