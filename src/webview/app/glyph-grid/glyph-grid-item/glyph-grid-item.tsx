import Typography from "@mui/material/Typography";
import { FontSpec } from "@shared/model";
import { Glyph } from "opentype.js";
import { FlexBox } from "src/webview/shared/components/flex-box";
import { CELL_HEIGHT, CELL_WIDTH, enableHighDPICanvas, renderGlyph } from "./glyph-grid-item.model";

type GlyphGridItemProps = {
  glyph: Glyph;
  fontSpec: FontSpec;
};

export function GlyphGridItem({ glyph, fontSpec }: GlyphGridItemProps) {
  const handleCanvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      enableHighDPICanvas(canvas, CELL_WIDTH, CELL_HEIGHT);
      renderGlyph(canvas, glyph, fontSpec);
    }
  };

  return (
    <FlexBox
      direction="column"
      justify="center"
      align="center"
      sx={(theme) => ({
        borderColor: theme.palette.divider,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "4px",
        padding: "0.5rem"
      })}
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
    </FlexBox>
  );
}
