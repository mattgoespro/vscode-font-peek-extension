import { useEffect, useState } from "react";
import { FontGlyph } from "../../../shared/model";
import { genUuid } from "../../shared/utils";
import { GlyphPageItem } from "./glyph-page-item/glyph-page-item";
import * as styles from "./glyph-page.module.scss";
import { GlyphPagination } from "./glyph-pagination/glyph-pagination";
import { GlyphSearch } from "./glyph-search/glyph-search";
import {
  getChunkSize,
  getPageChunk,
  PAGINATION_MAX_NUM_PAGES
} from "./glyph-pagination/glyph-pagination.model";

type GlyphPageProps = {
  glyphs: FontGlyph[];
};

type GlyphFilterCriteria = {
  currentSearchName?: string;
  currentPage?: number;
};

export function GlyphPage({ glyphs }: GlyphPageProps) {
  const [pageGlyphs, setPageGlyphs] = useState<FontGlyph[]>(glyphs);
  const [filterCriteria, setFilterCriteria] = useState<GlyphFilterCriteria>({
    currentPage: 0,
    currentSearchName: ""
  });
  console.log(`Total glyphs: ${glyphs.length}`);
  console.log(`Max number of pages: ${PAGINATION_MAX_NUM_PAGES}`);
  console.log(`Page size: ${getChunkSize(glyphs.length)}`);

  function filterGlyphs(criteria: GlyphFilterCriteria) {
    // filter out matchibng glyphs based on the search criteria
    const filteredGlyphs = glyphs.filter((glyph) =>
      glyph.name.includes(criteria.currentSearchName)
    );

    // page the search results
    return getPageChunk(
      filteredGlyphs,
      filterCriteria.currentPage ?? 0,
      getChunkSize(glyphs.length)
    );
  }

  function onSearchFilterCriteriaChange(searchName: string) {
    setFilterCriteria({
      currentSearchName: searchName,
      currentPage: filterCriteria.currentPage
    });
  }

  function onPageFilterCriteriaChange(page: number) {
    setFilterCriteria({
      currentSearchName: filterCriteria.currentSearchName,
      currentPage: page
    });
  }

  useEffect(() => {
    const filterResults = filterGlyphs(filterCriteria);
    setPageGlyphs(filterResults);
  }, [filterCriteria.currentPage, filterCriteria.currentSearchName]);

  return (
    <div className={styles["glyph-page-wrapper"]}>
      <GlyphSearch onValueChange={onSearchFilterCriteriaChange} />
      <div className={styles["glyph-pagination"]}>
        <GlyphPagination
          totalGlyphs={glyphs.length}
          onPageChange={onPageFilterCriteriaChange}
        ></GlyphPagination>
      </div>
      {((glyphs ?? []).length > 0 && (
        <>
          <div className={styles["glyph-list"]}>
            {pageGlyphs.map((glyph) => (
              <GlyphPageItem key={genUuid()} glyph={glyph} />
            ))}
          </div>
        </>
      )) || <span className={styles["no-glyphs"]}>No glyphs found.</span>}
    </div>
  );
}
