import React from "react";

import { AppBar, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

import Logo from "/images/VandanaLogo.svg";

interface LayoutProps {
  children: JSX.Element;
}

const Layout = (props: LayoutProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" flex="1" justifyContent="center">
            <Link to="/">
              <img src={Logo} alt="වන්දනා" height={40} />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      {props.children}
    </Box>
  );
};

export default Layout;
