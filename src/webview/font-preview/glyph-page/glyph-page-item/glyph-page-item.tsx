import { Container, Typography } from "@mui/material";

type GlyphPageItemProps = {
  glyph: opentype.Glyph;
};

export function GlyphPageItem({ glyph }: GlyphPageItemProps) {
  return (
    <Container>
      <Typography variant="button">{glyph.name}</Typography>
      <Typography variant="caption">{glyph.unicode}</Typography>
    </Container>
  );
}
