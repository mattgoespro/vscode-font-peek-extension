import { useEffect, useState } from "react";
import { FontGlyph } from "../../../shared/model";
import { useOutput } from "../../Shared/Hooks/Logger";
import { styleClasses } from "../../Shared/Utils";
import { PAGINATION_CHUNK_SIZE, getPageChunk } from "./GlyphPagination.model";
import * as styles from "./GlyphPagination.module.scss";

type GlyphPaginationProps = {
  glyphs: FontGlyph[];
  totalPages: number;
  searchTerm: string;
  pageGlyphsChanged: (glyphs: FontGlyph[]) => void;
};

export function GlyphPagination(props: GlyphPaginationProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [numEnabledPages, setNumEnabledPages] = useState<number>(props.totalPages);
  const [output] = useOutput("GlyphPagination");

  useEffect(() => {
    setCurrentPage(0);
  }, [props.glyphs]);

  useEffect(() => {
    output("GlyphPagination: glyphs ", props.glyphs);
    props.pageGlyphsChanged(props.glyphs.filter((glyph) => glyph.name.includes(props.searchTerm)));
    setNumEnabledPages(Math.ceil(props.glyphs.length / PAGINATION_CHUNK_SIZE));
  }, [props.searchTerm]);

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

  return Array.from({ length: props.totalPages }, (_, i) => (
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
