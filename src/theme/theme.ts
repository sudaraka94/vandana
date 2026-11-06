import { createTheme, Theme } from "@mui/material";

export type ThemeMode = "paper" | "white" | "night";

interface Tokens {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentTint: string;
  refrain: string;
  onAccent: string;
}

// "Pansala paper" design tokens. See the design page for the reasoning.
export const TOKENS: Record<ThemeMode, Tokens> = {
  paper: {
    bg: "#FBF6EC",
    surface: "#FFFDF8",
    ink: "#2E2216",
    muted: "#7A6650",
    line: "#EADFCB",
    accent: "#B4500F",
    accentTint: "#F6E3CC",
    refrain: "#8E6A12",
    onAccent: "#FFFFFF",
  },
  white: {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    ink: "#2B2118",
    muted: "#74655A",
    line: "#ECE4DA",
    accent: "#B4500F",
    accentTint: "#FBEBDD",
    refrain: "#8E6A12",
    onAccent: "#FFFFFF",
  },
  night: {
    bg: "#15110C",
    surface: "#1F1912",
    ink: "#EFE3CF",
    muted: "#A8977E",
    line: "#33291D",
    accent: "#F0A04B",
    accentTint: "#3A2814",
    refrain: "#D9B25E",
    onAccent: "#15110C",
  },
};

export const SERIF = '"Noto Serif Sinhala", "Noto Sans Sinhala", serif';
export const SANS = '"Noto Sans Sinhala", "Helvetica", "Arial", sans-serif';

declare module "@mui/material/styles" {
  interface Theme {
    tokens: Tokens;
  }
  interface ThemeOptions {
    tokens?: Tokens;
  }
}

export const makeTheme = (mode: ThemeMode): Theme => {
  const t = TOKENS[mode];
  return createTheme({
    tokens: t,
    palette: {
      mode: mode === "night" ? "dark" : "light",
      primary: { main: t.accent, contrastText: t.onAccent },
      background: { default: t.bg, paper: t.surface },
      text: { primary: t.ink, secondary: t.muted },
      divider: t.line,
    },
    // 4px unit: sx radius 3 = 12px (controls), 3.5 = 14px (cards), 5 = 20px (sheets).
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: SANS,
      h1: { fontFamily: SERIF, fontWeight: 600 },
      h2: { fontFamily: SERIF, fontWeight: 600 },
      h3: { fontFamily: SERIF, fontWeight: 600 },
      h4: { fontFamily: SERIF, fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.3 },
      h5: { fontFamily: SERIF, fontWeight: 600 },
      h6: { fontFamily: SERIF, fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: t.bg, color: t.ink },
        },
      },
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 12 } } },
      MuiToggleButtonGroup: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiToggleButton: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });
};
