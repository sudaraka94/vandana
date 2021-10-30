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
                    <Link to="/">
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            වන්දනා
                        </Typography>
                    </Link>
                </Toolbar>
            </AppBar>
            {props.children}
        </Box>
    )
}

export default Layout