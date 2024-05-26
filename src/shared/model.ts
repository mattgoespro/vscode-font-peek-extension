export type FontGlyphVariant = {
  binary: string;
  unicode: string;
  hex: string;
};

export type FontGlyph = {
  id: number;
  name: string;
  binary: string;
  unicode: string;
  hex: string;
  variant?: FontGlyphVariant;
};
