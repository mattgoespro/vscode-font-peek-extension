import fontkit from "fontkit";
import vscode from "vscode";
import { FontGlyph } from "../shared/model";

export function loadFont(buffer: Buffer) {
  const font = loadFontData(buffer);
  return extractFontGlyphs(font);
}

function loadFontData(buffer: Buffer) {
  const font = fontkit.create(buffer);
  console.log(font);

  if (isFontCollection(font)) {
    vscode.window.showInformationMessage(`Font loaded with type ${font.type}.`);
    vscode.window.showInformationMessage("Loaded font as a font collection.");
  }

  return font as fontkit.Font;
}

function isFontCollection(
  font: fontkit.Font | fontkit.FontCollection
): font is fontkit.FontCollection {
  return (font as fontkit.FontCollection).fonts !== undefined;
}

export function extractFontGlyphs(font: fontkit.Font) {
  const MAX_GLYPH_STRING_LENGTH = 3;
  const glyphs: FontGlyph[] = [];

  for (let i = 0; i < font.characterSet.length; i++) {
    const glyph = font.glyphForCodePoint(font.characterSet[i]);

    const id = glyph.id;
    const name = glyph.name;
    const binary = glyph.codePoints[0];
    const hex = `&#x${binary.toString(16)}`;
    const unicode = String.fromCodePoint(binary);

    const glyphString = font.stringsForGlyph(glyph.id);

    if (glyphString.length > MAX_GLYPH_STRING_LENGTH) {
      continue;
    }

    glyphs.push({
      id,
      name,
      binary: `\\u${binary.toString(16)}`,
      unicode,
      hex
    });
  }

  return glyphs;
}
