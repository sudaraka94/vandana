import { Box } from "@mui/system";
import React from "react";

interface IArticleContainer {
  article: string | undefined;
  fontSize: number;
}

export default function ContentContainer(props: IArticleContainer) {
  const { article = "", fontSize = 1 } = props;
  return (
    <Box
      fontSize={`${fontSize}em`}
      dangerouslySetInnerHTML={{ __html: article }}
    />
  );
}
