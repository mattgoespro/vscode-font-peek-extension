import opentype from "opentype.js";

export type FontGlyph = {
  id: number;
  name: string;
  binary: string;
  unicode: string;
  hex: string;
};

export type FontSpec = {
  name: string;
  features: {
    unitsPerEm: opentype.Font["unitsPerEm"];
    headTable: opentype.Table["head"];
  };
  glyphs: opentype.Glyph[];
};

export function loadFont(buffer: ArrayBuffer): FontSpec {
  const font = opentype.parse(buffer);

  const glyphs: opentype.Glyph[] = [];

  for (let glyphIndex = 0; glyphIndex < font.glyphs.length; glyphIndex++) {
    glyphs.push(font.glyphs.get(glyphIndex));
  }

  return {
    name: font.names.fontFamily.en,
    features: {
      unitsPerEm: font.unitsPerEm,
      headTable: font.tables.head
    },
    glyphs
  };
}
