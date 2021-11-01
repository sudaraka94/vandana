import React from "react";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import MuiLink from '@mui/material/Link';
import Logo from "/images/VandanaLogo.svg";
import { theme } from "../theme/theme";

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
      <Box display="flex" width="100%" flexDirection="row" justifyContent="center" top={10} bottom= {10} >
        <Typography fontWeight={700} variant="subtitle2">
          Made with ❤️ by <MuiLink target="_blank" href="http://zeroonetech.xyz" underline="none">ZeroOne Technologies</MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
