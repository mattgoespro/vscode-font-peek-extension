import { useEffect, useState } from "react";
import { FontGlyph } from "../../../shared/model";
import { useOutput } from "../../shared/hooks/use-output";
import { PAGINATION_CHUNK_SIZE, getPageChunk, getTotalPages } from "./glyph-pagination.model";
import * as styles from "./glyph-pagination.module.scss";
import { styleClasses } from "../../shared/utils";

type GlyphPaginationProps = {
  glyphs: FontGlyph[];
  pageGlyphsChanged: (glyphs: FontGlyph[]) => void;
};

export function GlyphPagination(props: GlyphPaginationProps) {
  const totalPages = getTotalPages(props.glyphs.length);

  const [currentPage, setCurrentPage] = useState(0);
  const [numEnabledPages, setNumEnabledPages] = useState<number>(totalPages);
  const [output] = useOutput("GlyphPagination");

  useEffect(() => {
    setCurrentPage(0);
  }, [props.glyphs]);

  useEffect(() => {
    output("glyphs ", props.glyphs);
    setNumEnabledPages(Math.ceil(props.glyphs.length / PAGINATION_CHUNK_SIZE));
  }, [currentPage]);

  function handlePageChange(page: number) {
    const chunkStartIndex = page * PAGINATION_CHUNK_SIZE;
    const chunk = getPageChunk(props.glyphs, chunkStartIndex, PAGINATION_CHUNK_SIZE);
    props.pageGlyphsChanged(chunk);
    setCurrentPage(page);
  }

  function glyphRangeText(pageIndex: number) {
    const start = pageIndex * PAGINATION_CHUNK_SIZE + 1;
    const end = Math.min(start + PAGINATION_CHUNK_SIZE - 1, props.glyphs.length);

    return `${start} - ${end}`;
  }

  return Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => handlePageChange(i)}
      className={styleClasses(
        styles,
        "pagination-button",
        ...[i >= numEnabledPages ? "disabled" : undefined, currentPage === i ? "active" : undefined]
      )}
    >
      {glyphRangeText(i)}
    </button>
  ));
}
