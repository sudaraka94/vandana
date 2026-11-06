import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface StatusMessageProps {
  message: string;
  // Shows a retry button when given.
  onRetry?: () => void;
  // Shows a link back to the home page.
  showHomeLink?: boolean;
}

const StatusMessage = ({ message, onRetry, showHomeLink }: StatusMessageProps) => (
  <Box display="flex" flexDirection="column" alignItems="center" gap={2} padding={4} textAlign="center">
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
    {onRetry && (
      <Button variant="outlined" onClick={onRetry}>
        නැවත උත්සාහ කරන්න
      </Button>
    )}
    {showHomeLink && (
      <Button variant="outlined" component={Link} to="/">
        මුල් පිටුවට
      </Button>
    )}
  </Box>
);

export default StatusMessage;

export const NotFound = () => <StatusMessage message="මෙම පිටුව සොයාගත නොහැක" showHomeLink />;
