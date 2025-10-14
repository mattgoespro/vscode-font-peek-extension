import Typography from "@mui/material/Typography";
import { FontSpec } from "@shared/model";
import { Glyph } from "opentype.js";
import { FlexBox } from "src/webview/shared/components/flex-box";
import { enableHighDPICanvas, renderGlyph } from "./glyph-grid-item.model";

type GlyphGridItemProps = {
  glyph: Glyph;
  fontSpec: FontSpec;
};

export function GlyphGridItem({ glyph, fontSpec }: GlyphGridItemProps) {
  const handleCanvasRef = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      enableHighDPICanvas(canvas);
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
        padding: "0.25rem",
        height: "5rem"
      })}
    >
      <canvas ref={handleCanvasRef} />
      {(glyph.name != null && <Typography variant="caption">{glyph.name}</Typography>) || (
        <Typography variant="caption" fontStyle="italic">
          &lt;Unknown&gt;
        </Typography>
      )}
    </FlexBox>
  );
}
