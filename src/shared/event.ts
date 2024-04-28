import { FontGlyph } from "./model";

export type WebviewReadyMessage = {
  state: "ready";
};

export type FontGlyphsLoadedMessage = {
  glyphs: FontGlyph[];
};
