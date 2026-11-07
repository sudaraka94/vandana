import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router";

interface LayoutProps {
  children: React.ReactElement;
}

// Each screen draws its own header (home header or page bar), so the layout
// only provides the page background and the status bar strip.
const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const night = theme.palette.mode === "dark";
  // Color at the very top of the current screen: the home header, or the page bar.
  const top =
    pathname === "/"
      ? night
        ? theme.palette.background.paper
        : theme.palette.primary.main
      : theme.palette.background.default;

  // Safari on iOS 26 ignores <meta name="theme-color"> and tints the status
  // bar area with the page (html/body) background instead. Give the page the
  // color of the top of the screen; the app itself still draws its own
  // background below, so only the bar and the overscroll area change.
  useEffect(() => {
    document.documentElement.style.backgroundColor = top;
    document.body.style.backgroundColor = top;
  }, [top]);

  return (
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
};

export default Layout;
