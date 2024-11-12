import { useState } from "react";
import * as styles from "./glyph-pagination.module.scss";
import { styleClasses } from "../../../shared/utils";
import { getChunkSize, PAGINATION_MAX_NUM_PAGES } from "./glyph-pagination.model";

type GlyphPaginationProps = {
  totalGlyphs: number;
  onPageChange: (page: number) => void;
};

export function GlyphPagination({ totalGlyphs, onPageChange }: GlyphPaginationProps) {
  const [currentPage, setCurrentPage] = useState(0);

  function glyphRangeText(pageIndex: number) {
    const chunkSize = getChunkSize(totalGlyphs);
    const start = pageIndex * chunkSize + 1;
    const end = Math.min(start + chunkSize - 1, totalGlyphs);
    return `${start} - ${end}`;
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    onPageChange(page);
  }

  return (
    <div className={styles["pagination"]}>
      {Array.from({ length: PAGINATION_MAX_NUM_PAGES }, (_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={styleClasses(
            styles,
            "pagination-button",
            ...[currentPage === i ? "active" : undefined]
          )}
        >
          {glyphRangeText(i)}
        </button>
      ))}
    </div>
  );
}
