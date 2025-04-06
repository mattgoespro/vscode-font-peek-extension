import opentype from "opentype.js";

export type FontGlyph = {
  id: number;
  name: string;
  binary: string;
  unicode: string;
  hex: string;
};

export type FontData = {
  name: string;
  features: {
    unitsPerEm: opentype.Font["unitsPerEm"];
    headTable: opentype.Table["head"];
  };
  glyphs: opentype.Glyph[];
};
