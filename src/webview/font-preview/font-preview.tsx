import { useContext } from "react";
import { WebviewContext } from "../shared/webview-context";
import { GlyphPage } from "./glyph-page/glyph-page";
import { Container, Typography } from "@mui/material";

export function FontPreview() {
  const { fontSpec: fontData } = useContext(WebviewContext);

  return (
    <Container>
      <Typography variant="h1" textAlign="center">
        {fontData.name}
      </Typography>
      <GlyphPage />
    </Container>
  );
}
