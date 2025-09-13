import { Glyph } from "opentype.js";

export const GlyphOrderConstraintFn = {
  name: (glyphs: Glyph[]) => glyphs.sort((a, b) => a.name.localeCompare(b.name))
};
