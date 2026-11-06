import React from "react";
import { Box } from "@mui/material";

interface LayoutProps {
  children: React.ReactElement;
}

// Each screen draws its own header (home header or page bar), so the layout
// only provides the page background and the status bar strip.
const Layout = ({ children }: LayoutProps) => (
  <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
    {/* In the installed iPhone app the page runs under the status bar, which
        has white text. Keep a solid strip behind it so the time and battery
        stay readable on every screen, even while scrolling. Its height is 0 in
        a normal browser tab. */}
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "env(safe-area-inset-top, 0px)",
        zIndex: 1200,
        bgcolor: (t) => (t.palette.mode === "dark" ? t.palette.background.paper : t.palette.primary.main),
      }}
    />
    {children}
  </Box>
);

export default Layout;
