import { FontGlyph } from "../model";

export type WebviewStateMessage = {
  type: "webview-state";
  state: "ready";
};

export type FontGlyphsLoadedMessage = {
  type: "font-glyphs-loaded";
  glyphs: FontGlyph[];
};

export type LogMessage = {
  type: "log";
  moduleContext: string;
  args: unknown[];
};
