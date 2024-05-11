import { useEffect, useState } from "react";
import { styleClasses } from "src/preview/Shared/utils";
import { FontGlyph } from "../../../shared/model";
import * as styles from "./GlyphPagination.module.scss";

const PAGE_SIZE = 50;

type GlyphPaginationProps = {
  glyphs: FontGlyph[];
  pageChange: (glyphs: FontGlyph[]) => void;
};

export function GlyphPagination(props: GlyphPaginationProps) {
  const { glyphs, pageChange } = props;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    console.log("Number of glyphs changed to: ", glyphs.length);
  }, [glyphs]);

  const totalPages = Math.ceil(glyphs.length / PAGE_SIZE);

  function handlePageChange(pageIndex: number) {
    setCurrentPage(pageIndex);
    pageChange(
      glyphs.slice(
        pageIndex * PAGE_SIZE,
        Math.min(Math.max(0, pageIndex * PAGE_SIZE + PAGE_SIZE), glyphs.length)
      )
    );
  }

  function glyphRangeText(pageIndex: number) {
    const start = pageIndex * PAGE_SIZE + 1;
    const end = Math.min(start + PAGE_SIZE - 1, glyphs.length);

    return `${start} - ${end}`;
  }
  return (
    <>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={styleClasses(
            styles,
            "pagination-button",
            currentPage === i ? "active" : undefined
          )}
        >
          {glyphRangeText(i)}
        </button>
      ))}
    </>
  );
}
