import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo } from "react";
import { FontSpec } from "../../../shared/model";
import { FlexBox } from "../../shared/components/flex-box";
import TabView from "../../shared/components/tab-view/tab-view";
import { TabViewContent } from "../../shared/components/tab-view/tab-view-content";
import { useGlyphs } from "../../shared/hooks/use-glyphs";
import { uuid } from "../../shared/utils";
import { GlyphGridFilter } from "./glyph-grid-filter";
import { GlyphGridItem } from "./glyph-grid-item/glyph-grid-item";

type GlyphGridProps = {
  fontSpec: FontSpec;
};

export function GlyphGrid({ fontSpec }: GlyphGridProps) {
  const [glyphsState, dispatchGlyphs] = useGlyphs();

  useEffect(() => {
    dispatchGlyphs({ type: "load", payload: { glyphs: fontSpec.glyphs } });
  }, [fontSpec]);

  const getTabLabel = useCallback(
    (pageIndex: number) => {
      const start = pageIndex * glyphsState.pageSize;
      const end = Math.min(start + glyphsState.pageSize - 1, glyphsState.allGlyphs.length);

      return `${start}-${end}`;
    },
    [glyphsState.pageSize, glyphsState.allGlyphs?.length]
  );

  const glyphItems = useMemo(() => {
    return glyphsState.pageGlyphs?.map((glyph) => (
      <GlyphGridItem key={glyph.index} glyph={glyph} fontSpec={fontSpec} />
    ));
  }, [glyphsState.pageGlyphs, fontSpec]);

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
      <TabView
        numTabs={glyphsState.numPages}
        onTabChange={(index) => dispatchGlyphs({ type: "change-page", payload: { page: index } })}
      >
        {Array.from({ length: glyphsState.numPages }, (_, pageIndex) => (
          <TabViewContent label={getTabLabel(pageIndex)} key={uuid()}>
            {(glyphsState.pageGlyphs?.length > 0 && glyphItems) || glyphPageEmpty}
          </TabViewContent>
        ))}
      </TabView>
    </FlexBox>
  );
}
