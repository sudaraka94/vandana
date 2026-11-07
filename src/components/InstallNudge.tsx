import React, { useState } from "react";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IosShareIcon from "@mui/icons-material/IosShare";

import { trackEvent } from "../analytics";
import { promptInstall, useInstallKind } from "../install";
import { SERIF } from "../theme/theme";

const DISMISS_KEY = "vandanaInstallDismissed";
const SNOOZE_DAYS = 30;

const wasDismissed = () => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(at) && Date.now() - at < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

// A card on the home screen inviting the reader to add Vandana to their home
// screen: an install button where the browser allows it (Android), or the
// steps for Safari (iPhone). "Not now" hides it for 30 days.
const InstallNudge = () => {
  const kind = useInstallKind();
  const [hidden, setHidden] = useState(wasDismissed);

  if (!kind || hidden) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Not remembered; it will show again next time.
    }
    setHidden(true);
    trackEvent("install_nudge", { action: "dismiss", platform: kind });
  };

  const install = async () => {
    trackEvent("install_nudge", { action: "install_tap", platform: kind });
    const accepted = await promptInstall();
    trackEvent("install_nudge", { action: accepted ? "installed" : "declined", platform: kind });
  };

  return (
    <Paper
      variant="outlined"
      component="section"
      aria-label="මුල් තිරයට එක් කරන්න"
      sx={{ position: "relative", display: "flex", gap: 1.5, p: 2, pr: 5, borderRadius: 3.5 }}
    >
      <Box component="img" src="/favicon.svg" alt="" sx={{ width: 44, height: 44, borderRadius: 2.5, flex: "none" }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: 17, lineHeight: 1.35 }}>
          වන්දනා දුරකථනයේ මුල් තිරයට එක් කරන්න
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.5, lineHeight: 1.5 }}>
          එක් තට්ටුවකින් විවෘත කර, අන්තර්ජාලය නැතිවත් කියවන්න.
        </Typography>
        {kind === "prompt" ? (
          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            <Button variant="contained" onClick={install} sx={{ height: 40 }}>
              එක් කරන්න
            </Button>
            <Button onClick={dismiss} sx={{ height: 40 }}>
              පසුවට
            </Button>
          </Box>
        ) : (
          <Typography component="ol" sx={{ fontSize: 13, lineHeight: 1.7, m: 0, mt: 1, pl: 2.5 }}>
            <li>
              බෙදාගන්න{" "}
              <IosShareIcon aria-hidden sx={{ fontSize: 17, verticalAlign: "-3px", color: "primary.main" }} /> බොත්තම ඔබන්න
              (නොපෙනේ නම් පළමුව ••• ඔබන්න).
            </li>
            <li>
              <b>මුල් තිරයට එක් කරන්න</b> තෝරා <b>එක් කරන්න</b> ඔබන්න.
              <Box component="span" sx={{ display: "block", color: "text.secondary", fontSize: 12 }}>
                ඉංග්‍රීසියෙන් නම්: Share → Add to Home Screen → Add
              </Box>
            </li>
          </Typography>
        )}
      </Box>
      <IconButton aria-label="පසුවට" onClick={dismiss} size="small" sx={{ position: "absolute", top: 6, right: 6, color: "text.secondary" }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default InstallNudge;
