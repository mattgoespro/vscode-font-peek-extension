import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { FlexBox } from "../../shared/components/flex-box";
import { GridView } from "../../shared/components/grid-view";
import TabView from "../../shared/components/tab-view/tab-view";
import { TabViewContent } from "../../shared/components/tab-view/tab-view-content";
import { FontContext } from "../../shared/contexts/font-context";
import { useGlyphs } from "../../shared/hooks/use-glyphs";
import { uuid } from "../../shared/utils";
import { GlyphGridFilter } from "./glyph-grid-filter";
import { GlyphGridItem } from "./glyph-grid-item/glyph-grid-item";

export function GlyphGrid() {
  const [glyphsState, dispatchGlyphs] = useGlyphs();
  const fontContext = useContext(FontContext);

  useEffect(() => {
    dispatchGlyphs({ type: "load", payload: { glyphs: fontContext.fontSpec.glyphs } });
  }, [fontContext.fontSpec]);

  const getPageLabel = useCallback(
    (pageIndex: number) => {
      const start = pageIndex * glyphsState.pageSize;
      const end = Math.min(start + glyphsState.pageSize - 1, glyphsState.allGlyphs.length);

      return `${start}-${end}`;
    },
    [glyphsState.pageSize, glyphsState.allGlyphs?.length]
  );

  const onPageChange = useCallback(
    (index: number) => dispatchGlyphs({ type: "change-page", payload: { page: index } }),
    []
  );

  const glyphItems = useMemo(() => {
    return glyphsState.currentPageGlyphs?.map((glyph) => (
      <GlyphGridItem glyph={glyph} fontSpec={fontContext.fontSpec} />
    ));
  }, [glyphsState.currentPageGlyphs, fontContext]);

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
      <GlyphGridFilter state={glyphsState} dispatch={dispatchGlyphs} />
      <TabView numTabs={glyphsState.numPages} onTabChange={onPageChange}>
        {Array.from({ length: glyphsState.numPages }, (_, pageIndex) => (
          <TabViewContent key={uuid()} label={getPageLabel(pageIndex)}>
            {(glyphsState.currentPageGlyphs?.length > 0 && (
              <GridView numColumns={10} key={uuid()}>
                {glyphItems}
              </GridView>
            )) ||
              glyphPageEmpty}
          </TabViewContent>
        ))}
      </TabView>
    </FlexBox>
  );
}
