import React from "react";
import { Box, ButtonBase, Drawer, Slider, Switch, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import { LineSpacing, MAX_FONT_SIZE, MIN_FONT_SIZE, usePrefs } from "../prefs";
import { SERIF, ThemeMode, TOKENS } from "../theme/theme";

interface ReaderSettingsProps {
  open: boolean;
  onClose: () => void;
}

const THEMES: { mode: ThemeMode; label: string }[] = [
  { mode: "white", label: "සුදු" },
  { mode: "paper", label: "කඩදාසි" },
  { mode: "night", label: "රාත්‍රී" },
];

const SPACINGS: { value: LineSpacing; label: string }[] = [
  { value: "compact", label: "කුඩා" },
  { value: "normal", label: "සාමාන්‍ය" },
  { value: "relaxed", label: "විශාල" },
];

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const ReaderSettings = ({ open, onClose }: ReaderSettingsProps) => {
  const { fontSize, lineSpacing, themeMode, keepAwake, update } = usePrefs();

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      // Lighter scrim so the text behind shows the change live.
      slotProps={{
        backdrop: { sx: { bgcolor: "rgba(46, 34, 22, 0.25)" } },
        paper: {
          sx: {
            borderRadius: "20px 20px 0 0",
            maxWidth: 520,
            mx: "auto",
            px: 2.5,
            pt: 1.25,
            pb: "calc(22px + env(safe-area-inset-bottom, 0px))",
            display: "flex",
            flexDirection: "column",
            gap: 2.25,
          },
        },
      }}
    >
      <Box sx={{ width: 36, height: 4, borderRadius: 1, bgcolor: "divider", alignSelf: "center" }} />
      <Typography component="h2" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        කියවීමේ සැකසුම්
      </Typography>

      <Row label="අකුරු ප්‍රමාණය">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 0.5 }}>
          <Typography aria-hidden sx={{ fontFamily: SERIF, fontSize: 14 }}>
            අ
          </Typography>
          <Slider
            value={fontSize}
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={1}
            onChange={(_, value) => update({ fontSize: value as number })}
            aria-label="අකුරු ප්‍රමාණය"
            valueLabelDisplay="auto"
          />
          <Typography aria-hidden sx={{ fontFamily: SERIF, fontSize: 26 }}>
            අ
          </Typography>
        </Box>
      </Row>

      <Row label="පේළි පරතරය">
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={lineSpacing}
          onChange={(_, value) => value && update({ lineSpacing: value })}
          aria-label="පේළි පරතරය"
          sx={{ "& .MuiToggleButton-root": { fontSize: 14, py: 1.1 }, "& .Mui-selected": { fontWeight: 600 } }}
        >
          {SPACINGS.map((s) => (
            <ToggleButton key={s.value} value={s.value} color="primary">
              {s.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Row>

      <Row label="තේමාව">
        <Box role="radiogroup" aria-label="තේමාව" sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.25 }}>
          {THEMES.map(({ mode, label }) => {
            const t = TOKENS[mode];
            const selected = themeMode === mode;
            return (
              <ButtonBase
                key={mode}
                role="radio"
                aria-checked={selected}
                onClick={() => update({ themeMode: mode })}
                sx={{
                  height: 64,
                  borderRadius: 3,
                  bgcolor: t.bg,
                  color: mode === "night" ? t.accent : t.ink,
                  border: `1px solid ${mode === "night" ? t.bg : t.line}`,
                  outline: selected ? "2px solid" : "none",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.25,
                  fontSize: 12,
                }}
              >
                <Typography component="span" sx={{ fontFamily: SERIF, fontSize: 18, lineHeight: 1 }}>
                  අ
                </Typography>
                {label}
              </ButtonBase>
            );
          })}
        </Box>
      </Row>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography component="label" htmlFor="keep-awake" sx={{ fontSize: 15 }}>
          තිරය නිවී යාම වළක්වන්න
        </Typography>
        <Switch id="keep-awake" checked={keepAwake} onChange={(_, checked) => update({ keepAwake: checked })} />
      </Box>
    </Drawer>
  );
};

export default ReaderSettings;
