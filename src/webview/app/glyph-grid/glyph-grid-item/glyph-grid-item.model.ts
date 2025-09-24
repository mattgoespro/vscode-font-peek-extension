import { FontSpec } from "@shared/model";
import { Glyph } from "opentype.js";

export const CELL_WIDTH = 54;
export const CELL_HEIGHT = 54;
const CELL_MARGIN_TOP = 8;
const CELL_MARGIN_BOTTOM = 8;
const CELL_MARGIN_LEFT_RIGHT = 8;

export function renderGlyph(canvas: HTMLCanvasElement, glyph: Glyph, fontSpec: FontSpec) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, CELL_WIDTH, CELL_HEIGHT);

  const width = CELL_WIDTH - CELL_MARGIN_LEFT_RIGHT * 2;
  const height = CELL_HEIGHT - CELL_MARGIN_TOP - CELL_MARGIN_BOTTOM;
  const head = fontSpec.features.headTable;
  const maxHeight = head.yMax - head.yMin;
  const fontScale = Math.min(width / (head.xMax - head.xMin), height / maxHeight);
  const fontSize = fontScale * fontSpec.features.unitsPerEm;
  const fontBaseline = CELL_MARGIN_TOP + (height * head.yMax) / maxHeight;
  const glyphWidth = (glyph.advanceWidth ?? 1) * fontScale;
  const xMin = (CELL_WIDTH - glyphWidth) / 2;

  // Not using glyph.draw() because the fill color defaults to black
  // https://github.com/opentypejs/opentype.js/issues/421#issuecomment-578496004
  const path = glyph.getPath(xMin, fontBaseline, fontSize);

  path.fill = "#f0f0f0";
  path.draw(context);
}

export function enableHighDPICanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const pixelRatio = window.devicePixelRatio || 1;

  if (pixelRatio === 1) {
    return;
  }

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  canvas.getContext("2d")?.scale(pixelRatio, pixelRatio);
}
