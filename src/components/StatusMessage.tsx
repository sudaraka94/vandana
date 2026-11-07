import React from "react";
import { Box, Button, SvgIcon, Typography } from "@mui/material";
import { Link } from "react-router";

interface StatusMessageProps {
  message: string;
  hint?: string;
  // Shows a retry button when given.
  onRetry?: () => void;
  // Shows a link back to the home page.
  showHomeLink?: boolean;
}

export const LotusIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 56, color: "primary.main", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" }}>
    <path d="M12 19c-3-2-4.5-5-4.5-8.5C9.5 11.5 11 13 12 15c1-2 2.5-3.5 4.5-4.5 0 3.5-1.5 6.5-4.5 8.5z" />
    <path d="M12 15c-1-3-1-6 0-9.5 1 3.5 1 6.5 0 9.5z" />
    <path d="M7.5 10.5C5 10 3.5 11 3 12c1.5 4 5 6.5 9 7M16.5 10.5c2.5-.5 4 .5 4.5 1.5-1.5 4-5 6.5-9 7" />
  </SvgIcon>
);

const StatusMessage = ({ message, hint, onRetry, showHomeLink }: StatusMessageProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, px: 3, py: 6, textAlign: "center" }}>
    <LotusIcon />
    <Typography variant="h6" component="p" sx={{ fontSize: 18 }}>
      {message}
    </Typography>
    {hint && (
      <Typography color="text.secondary" sx={{ fontSize: 14, maxWidth: "36ch" }}>
        {hint}
      </Typography>
    )}
    {onRetry && (
      <Button variant="outlined" onClick={onRetry} sx={{ mt: 1 }}>
        නැවත උත්සාහ කරන්න
      </Button>
    )}
    {showHomeLink && (
      <Button variant="contained" component={Link} to="/" sx={{ mt: 1 }}>
        මුල් පිටුවට
      </Button>
    )}
  </Box>
);

export default StatusMessage;

export const NotFound = () => <StatusMessage message="මෙම පිටුව සොයාගත නොහැක" showHomeLink />;
