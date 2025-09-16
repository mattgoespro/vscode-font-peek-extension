import { Font, Glyph } from "opentype.js";

export type FontSpec = {
  name: string;
  features: {
    unitsPerEm: Font["unitsPerEm"];
    headTable: Font["tables"]["head"];
  };
  glyphs: Glyph[];
};
