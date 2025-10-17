import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FlexBox } from "../../shared/components/flex-box";
import { GridView } from "../../shared/components/grid-view";
import TabView from "../../shared/components/tab-view/tab-view";
import { TabViewContent } from "../../shared/components/tab-view/tab-view-content";
import { uuid } from "../../shared/utils";
import { GlyphGridFilter, GlyphGridFilterCriteria } from "./glyph-grid-filter";
import { GlyphGridItem } from "./glyph-grid-item/glyph-grid-item";
import { FontContext } from "../../shared/contexts/font-context";
import { Glyph } from "opentype.js";

export function GlyphGrid() {
  const fontContext = useContext(FontContext);
  const pageSize = 50;
  const [filterCriteria, setFilterCriteria] = useState<GlyphGridFilterCriteria>({
    name: "",
    unicode: "",
    sortBy: ""
  });
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFilteredGlyphs, setCurrentFilteredGlyphs] = useState<Glyph[]>([]);
  const [currentPageGlyphs, setCurrentPageGlyphs] = useState<Glyph[]>([]);

  useEffect(() => {
    const glyphs = fontContext.fontSpec.glyphs;

    setNumPages(Math.ceil(glyphs.length / pageSize));
    setCurrentPage(0);
    setCurrentFilteredGlyphs(glyphs);
  }, [fontContext.fontSpec]);

  useEffect(() => {
    // set the glyphs for the current page from the current filtered glyphs list
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, currentFilteredGlyphs.length);

    setCurrentPageGlyphs(currentFilteredGlyphs.slice(startIndex, endIndex));
  }, [currentPage, currentFilteredGlyphs]);

  useEffect(() => {
    let filteredGlyphs = [...fontContext.fontSpec.glyphs];

    // filter by name
    if (filterCriteria.name.trim() !== "") {
      filteredGlyphs = filteredGlyphs.filter((glyph) =>
        glyph.name?.toLowerCase().includes(filterCriteria.name.toLowerCase())
      );
    }

    // filter by unicode
    if (filterCriteria.unicode.trim() !== "") {
      filteredGlyphs = filteredGlyphs.filter((glyph) => {
        if (glyph.unicodes == null || glyph.unicodes.length === 0) {
          return false;
        }
        return glyph.unicodes.some((code) =>
          code.toString(16).toLowerCase().includes(filterCriteria.unicode.toLowerCase())
        );
      });
    }

    // sort by sort option
    switch (filterCriteria.sortBy) {
      case "name":
        filteredGlyphs.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "unicode":
        filteredGlyphs.sort((a, b) => (a.unicodes?.[0] ?? 0) - (b.unicodes?.[0] ?? 0));
    }

    setCurrentFilteredGlyphs(filteredGlyphs);
    setCurrentPage(0);
  }, [filterCriteria]);

  const onFilterCriteriaChange = useCallback(
    (criteria: GlyphGridFilterCriteria) => {
      setFilterCriteria(criteria);
    },
    [fontContext.fontSpec]
  );

  const getTabLabel = useCallback(
    (pageIndex: number) => {
      const start = pageIndex * pageSize;
      const end = Math.min(start + pageSize - 1, fontContext.fontSpec.glyphs.length);

      return `${start}-${end}`;
    },
    [fontContext]
  );

  const onPageChange = useCallback((index: number): void => setCurrentPage(index), []);

  const glyphPageEmpty = useMemo(() => {
    return (
      <Typography
        variant="caption"
        textAlign="center"
        width="12rem"
        alignSelf="center"
        gridArea="5/5"
      >
        No glyphs to show.
      </Typography>
    );
  }, []);

  return (
    <FlexBox direction="column" flexGrow={1} width="100%" gap={2}>
      <GlyphGridFilter criteriaChange={onFilterCriteriaChange} />
      <TabView numTabs={numPages} onTabChange={onPageChange}>
        {Array.from({ length: numPages }, (_, pageIndex) => (
          <TabViewContent key={uuid()} label={getTabLabel(pageIndex)}>
            {(currentPageGlyphs.length > 0 && (
              <GridView numColumns={10} key={uuid()}>
                {currentPageGlyphs.map((glyph) => (
                  <GlyphGridItem glyph={glyph} fontSpec={fontContext.fontSpec} />
                ))}
              </GridView>
            )) ||
              glyphPageEmpty}
          </TabViewContent>
        ))}
      </TabView>
    </FlexBox>
  );
}
