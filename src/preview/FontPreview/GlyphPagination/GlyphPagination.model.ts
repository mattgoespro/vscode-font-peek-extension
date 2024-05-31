import { FontGlyph } from "../../../shared/model";
import { clamp } from "../../Shared/Utils";

export const PAGINATION_CHUNK_SIZE = 50;

export function getTotalPages(totalItems: number): number {
  return Math.ceil(totalItems / PAGINATION_CHUNK_SIZE);
}

export function getPageChunk(glyphs: FontGlyph[], startChunk: number, chunkSize: number) {
  return glyphs.slice(startChunk, clamp(startChunk + chunkSize, 0, glyphs.length));
}
