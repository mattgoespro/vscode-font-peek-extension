import { FontSpec } from "@shared/model";
import { Glyph } from "opentype.js";

export function renderGlyph(canvas: HTMLCanvasElement, glyph: Glyph, fontSpec: FontSpec) {
  const marginTop = 8;
  const marginBottom = 8;
  const marginLeftRight = 8;

  canvas.width = 54;
  canvas.height = 54;
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  const width = canvas.width - marginLeftRight * 2;
  const height = canvas.height - marginTop - marginBottom;
  const head = fontSpec.features.headTable;
  const maxHeight = head.yMax - head.yMin;
  const fontScale = Math.min(width / (head.xMax - head.xMin), height / maxHeight);
  const fontSize = fontScale * fontSpec.features.unitsPerEm;
  const fontBaseline = marginTop + (height * head.yMax) / maxHeight;
  const glyphWidth = (glyph.advanceWidth ?? 1) * fontScale;
  const xMin = (canvas.width - glyphWidth) / 2;

  // Not using glyph.draw() because the fill color defaults to black
  // https://github.com/opentypejs/opentype.js/issues/421#issuecomment-578496004
  const path = glyph.getPath(xMin, fontBaseline, fontSize);

  path.fill = "#f0f0f0";
  path.draw(context);
}

export function enableHighDPICanvas(canvas: HTMLCanvasElement) {
  const pixelRatio = window.devicePixelRatio || 1;

  if (pixelRatio === 1) {
    return;
  }

  canvas.width = canvas.width * pixelRatio;
  canvas.height = canvas.height * pixelRatio;
  // canvas.style.width = `${width}px`;
  // canvas.style.height = `${height}px`;

  canvas.getContext("2d")?.scale(pixelRatio, pixelRatio);
}
