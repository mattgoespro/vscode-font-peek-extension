import { FontGlyph } from "../../../../shared/model";
import { clamp } from "../../../shared/utils";

export const PAGINATION_MAX_NUM_PAGES = 10;

export function getChunkSize(numItems: number) {
  return Math.ceil(numItems / PAGINATION_MAX_NUM_PAGES);
}

export function getPageChunk(glyphs: FontGlyph[], startChunk: number, chunkSize: number) {
  return glyphs.slice(startChunk, clamp(startChunk + chunkSize, 0, glyphs.length));
}
