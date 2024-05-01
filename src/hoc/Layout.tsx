import React, { useEffect, useState } from "react";

import { AppBar, Button, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "/images/VandanaLogo.svg";
import { ArrowBackIosNew } from "@mui/icons-material";

interface LayoutProps {
  children: JSX.Element;
}

const Layout = (props: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [backBtn, setBackBtn] = useState<JSX.Element | undefined>()

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath != "/") {
      setBackBtn(
        <Button variant="outlined" sx={{ color: '#ffff', borderColor: '#ffff', position: 'absolute' }}
          onClick={() => navigate(-1)}><ArrowBackIosNew /></Button>
      )
    } else {
      setBackBtn(undefined)
    }
  }, [location]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {backBtn}
          <Box display="flex" flex="1" justifyContent="center">
            <Link to="/">
              <img src={Logo} alt="වන්දනා" height={40} />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      {props.children}
      {/* <Box display="flex" width="100%" justifyContent="center"  marginBottom="1em">
        <Typography fontWeight={700} variant="subtitle2">
          Made with ❤️ by <MuiLink target="_blank" href="http://zeroonetech.xyz" underline="none">ZeroOne Technologies</MuiLink>
        </Typography>
      </Box> */}
    </Box>
  );
};

export default Layout;