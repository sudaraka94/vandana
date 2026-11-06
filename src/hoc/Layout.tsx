import React from "react";
import { Box } from "@mui/material";

interface LayoutProps {
  children: React.ReactElement;
}

// Each screen draws its own header (home header or page bar), so the layout
// only provides the page background.
const Layout = ({ children }: LayoutProps) => (
  <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>{children}</Box>
);

export default Layout;
