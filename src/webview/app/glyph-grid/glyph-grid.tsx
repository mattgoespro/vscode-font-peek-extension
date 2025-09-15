import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect } from "react";
import { GlyphGridItem } from "./glyph-grid-item/glyph-grid-item";
import { GlyphGridFilter } from "./glyph-grid-filter";
import { FlexBox } from "../../shared/components/flex-box";
import TabView from "../../shared/components/tab-view/tab-view";
import { TabViewContent } from "../../shared/components/tab-view/tab-view-content";
import { useGlyphs } from "../../shared/hooks/use-glyphs";
import { uuid } from "../../shared/utils";
import { FontSpec } from "../../../shared/model";

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

  return (
    <FlexBox direction="column" align="center" m={2} p={2}>
      <Typography variant="h2" textAlign="center">
        Preview of
      </Typography>
      <Typography variant="h1" textAlign="center">
        {fontSpec.name}
      </Typography>

      <Box mt={3}>
        <GlyphGridFilter state={glyphsState} dispatch={dispatchGlyphs} />
        <TabView
          numTabs={glyphsState.numPages}
          onTabChange={(index) => dispatchGlyphs({ type: "change-page", payload: { page: index } })}
          sx={{ marginTop: "1rem" }}
        >
          {Array.from({ length: glyphsState.numPages }, (_, pageIndex) => (
            <TabViewContent label={getTabLabel(pageIndex)} key={uuid()}>
              {(glyphsState.pageGlyphs?.length > 0 &&
                glyphsState.pageGlyphs.map((glyph) => (
                  <GlyphGridItem glyph={glyph} key={uuid()} fontSpec={fontSpec} />
                ))) || (
                <Typography
                  variant="caption"
                  textAlign="center"
                  width="12rem"
                  alignSelf="center"
                  gridArea="5/5"
                >
                  No more glyphs to show.
                </Typography>
              )}
            </TabViewContent>
          ))}
        </TabView>
      </Box>
    </FlexBox>
  );
}
