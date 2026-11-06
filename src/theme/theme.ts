import { createTheme } from "@mui/material";
import { orange } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: orange,
  },
  typography: {
    // Load the Sinhala font ourselves so the text looks the same on every device.
    fontFamily: '"Noto Sans Sinhala", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
