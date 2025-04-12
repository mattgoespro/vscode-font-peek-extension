import { useContext } from "react";
import { WebviewContext } from "../shared/webview-context";
import { GlyphPage } from "./glyph-page/glyph-page";
import { Container, Typography } from "@mui/material";

export function FontPreview() {
  const { fontSpec: fontData } = useContext(WebviewContext);

  return (
    <Container>
      <Container>
        <Typography variant="h1">{fontData.name}</Typography>
        <Typography variant="h2">Font Glyph Preview</Typography>
        <Typography variant="h3">Click a glyph to copy its unicode value.</Typography>
      </Container>
      <GlyphPage />
    </Container>
  );
}
