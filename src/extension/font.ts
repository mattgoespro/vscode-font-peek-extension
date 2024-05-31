import { Font, create } from "fontkit";
import { FontGlyph } from "../shared/model";

export function loadFont(buffer: Buffer) {
  const font = loadFontData(buffer);
  return extractFontGlyphs(font);
}

function loadFontData(buffer: Buffer) {
  return create(buffer) as Font;
}

export function extractFontGlyphs(font: Font) {
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
