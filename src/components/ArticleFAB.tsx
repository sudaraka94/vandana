import React, { ReactNode, useState } from "react";

import { MoreHoriz, MoreVert } from "@mui/icons-material";
import { Fab, Zoom } from "@mui/material";
import { Box } from "@mui/system";

interface IFabButton {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

interface IArticleFAB {
  fabButtons: IFabButton[];
}

export default function ArticleFAB(props: IArticleFAB) {
  const { fabButtons } = props;

  const [fabOpen, setFabOpen] = useState<boolean>(false);

  const toggleFab = () => {
    setFabOpen(!fabOpen);
  };

  return (
    <Box
      position="fixed"
      display="flex"
      flexDirection="column"
      gap={2}
      bottom={16}
      right={16}
    >
      {fabButtons.map((fab, i) => (
        <Zoom in={fabOpen} key={i}>
          <Fab
            color="primary"
            aria-label={fab.label}
            onClick={() => {
              fab.onClick();
            }}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
      <Zoom in={true} unmountOnExit>
        <Fab
          color="primary"
          aria-label="back"
          onClick={() => {
            toggleFab();
          }}
        >
          {fabOpen ? <MoreHoriz /> : <MoreVert />}
        </Fab>
      </Zoom>
    </Box>
  );
}
