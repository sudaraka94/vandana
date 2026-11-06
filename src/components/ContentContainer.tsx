import React from "react";
import { Box } from "@mui/material";

import { SERIF } from "../theme/theme";

interface ContentContainerProps {
  article: string | undefined;
  fontSize: number; // px
  lineHeight: number;
}

export default function ContentContainer({ article = "", fontSize, lineHeight }: ContentContainerProps) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: article }}
      sx={{
        fontFamily: SERIF,
        fontSize: `${fontSize}px`,
        lineHeight,
        textAlign: "center",
        overflowWrap: "break-word",
        // Each <p> in the content is a stanza (or a line); give stanzas room to breathe.
        "& p": { margin: "0 0 1.1em" },
      }}
    />
  );
}
