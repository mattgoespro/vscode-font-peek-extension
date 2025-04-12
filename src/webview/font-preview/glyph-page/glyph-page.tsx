import { useContext, useEffect, useState } from "react";
import { genUuid } from "../../shared/utils";
import { GlyphPageItem } from "./glyph-page-item/glyph-page-item";
import { GlyphPagination } from "./glyph-pagination/glyph-pagination";
import { GlyphSearch } from "./glyph-search/glyph-search";
import {
  getChunkSize,
  getPageChunk,
  PAGINATION_MAX_NUM_PAGES
} from "./glyph-pagination/glyph-pagination.model";
import { WebviewContext } from "../../shared/webview-context";
import { Container } from "@mui/system";
import { Typography } from "@mui/material";

type GlyphFilterCriteria = {
  currentSearchName?: string;
  currentPage?: number;
};

export function GlyphPage() {
  const { fontSpec } = useContext(WebviewContext);
  const [pageGlyphs, setPageGlyphs] = useState<opentype.Glyph[]>(fontSpec.glyphs);
  const [filterCriteria, setFilterCriteria] = useState<GlyphFilterCriteria>({
    currentPage: 0,
    currentSearchName: ""
  });
  console.log(`Total glyphs: ${pageGlyphs.length}`);
  console.log(`Max number of pages: ${PAGINATION_MAX_NUM_PAGES}`);
  console.log(`Page size: ${getChunkSize(pageGlyphs.length)}`);

  function filterGlyphs(criteria: GlyphFilterCriteria) {
    // filter out matchibng glyphs based on the search criteria
    const filteredGlyphs = pageGlyphs.filter((glyph) =>
      glyph.name.includes(criteria.currentSearchName)
    );

    return getPageChunk(
      filteredGlyphs,
      filterCriteria.currentPage ?? 0,
      getChunkSize(pageGlyphs.length)
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
    <Container>
      <GlyphSearch onValueChange={onSearchFilterCriteriaChange} />
      <Container>
        <GlyphPagination
          totalGlyphs={fontSpec.glyphs.length}
          onPageChange={onPageFilterCriteriaChange}
        ></GlyphPagination>
      </Container>
      {((fontSpec.glyphs ?? []).length > 0 && (
        <>
          <Container>
            {pageGlyphs.map((glyph) => (
              <GlyphPageItem key={genUuid()} glyph={glyph} />
            ))}
          </Container>
        </>
      )) || <Typography variant="caption">No glyphs found.</Typography>}
    </Container>
  );
}
