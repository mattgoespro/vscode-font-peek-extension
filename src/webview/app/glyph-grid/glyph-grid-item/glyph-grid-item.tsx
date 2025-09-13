import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Glyph } from "opentype.js";
import { CELL_HEIGHT, CELL_WIDTH, enableHighDPICanvas, renderGlyph } from "./glyph-grid-item.model";
import { useRef } from "react";
import { FontSpec } from "@shared/model";

type GlyphGridItemProps = {
  glyph: Glyph;
  fontSpec: FontSpec;
};

export function GlyphGridItem({ glyph, fontSpec }: GlyphGridItemProps) {
  const setCanvasRef = useRef<HTMLCanvasElement>(null);
  const handleCanvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      enableHighDPICanvas(canvas, CELL_WIDTH, CELL_HEIGHT);
      renderGlyph(canvas, fontSpec, glyph.index);
    }
  };

  return (
    <Box
      display="table-cell"
      borderColor={(theme) => theme.palette.divider}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius="4px"
      padding="0.5rem"
    >
      <Container
        fixed
        disableGutters
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <canvas width={CELL_WIDTH} height={CELL_HEIGHT} ref={handleCanvasRef} />
        {(glyph.name != null && (
          <Typography variant="caption" textAlign="center" fontWeight="300">
            {glyph.name}
          </Typography>
        )) || (
          <Typography variant="caption" textAlign="center" fontStyle="italic" fontWeight="300">
            Unknown
          </Typography>
        )}
      </Container>
    </Box>
  );
}
