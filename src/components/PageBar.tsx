import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

interface PageBarProps {
  // Parent page: where "back" goes, and the name shown beside the arrow.
  backTo: string;
  backLabel: string;
  actions?: React.ReactNode;
  // 0..1; shows a thin reading-progress line under the bar.
  progress?: number;
  hidden?: boolean;
}

// BrowserRouter numbers its history entries; idx 0 is where the visitor landed.
const hasInAppHistory = () => (window.history.state?.idx ?? 0) > 0;

const PageBar = ({ backTo, backLabel, actions, progress, hidden }: PageBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    // Use the browser's back when it leads to the same parent page, so scroll
    // position is kept; otherwise go "up" (e.g. after opening a shared link).
    const cameFrom = (location.state as { from?: string } | null)?.from;
    if (hasInAppHistory() && cameFrom === backTo) {
      navigate(-1);
    } else {
      navigate(backTo, { replace: !hasInAppHistory() });
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "background.default",
        transform: hidden ? "translateY(-100%)" : "none",
        transition: "transform 200ms ease",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          pt: "env(safe-area-inset-top, 0px)",
          boxSizing: "content-box",
          borderBottom: progress === undefined ? 1 : 0,
          borderColor: "divider",
        }}
      >
        <ButtonBase
          onClick={goBack}
          aria-label={`ආපසු: ${backLabel}`}
          sx={{ color: "primary.main", borderRadius: 2, px: 1, height: 44, gap: 0.5, minWidth: 0 }}
        >
          <ArrowBackIosNew sx={{ fontSize: 18 }} />
          <Typography component="span" fontWeight={600} fontSize={15} noWrap>
            {backLabel}
          </Typography>
        </ButtonBase>
        <Box flex={1} />
        {actions}
      </Box>
      {progress !== undefined && (
        <Box sx={{ height: 3, bgcolor: "divider" }} role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <Box sx={{ height: "100%", width: `${Math.round(progress * 100)}%`, bgcolor: "primary.main" }} />
        </Box>
      )}
    </Box>
  );
};

export default PageBar;
