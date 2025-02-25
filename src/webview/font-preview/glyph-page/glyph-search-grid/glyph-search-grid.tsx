import { FontGlyph } from "@shared/model";
import { useState } from "react";
import { genUuid } from "../../../shared/utils";
import { GlyphSearchGridItemFilter } from "./glyph-search-grid-item-filter/glyph-search-grid-item-filter";
import { GlyphSearchGridItem } from "./glyph-search-grid-item/glyph-search-grid-item";
import * as styles from "./glyph-search-grid.module.scss";

export type GlyphSearchGridProps = {
  glyphs: FontGlyph[];
};

export function GlyphSearchGrid({ glyphs }: GlyphSearchGridProps) {
  const [matchingGridItems, setMatchingGridItems] = useState<FontGlyph[]>(glyphs);

  function onFilterCriteriaChange(searchName: string) {
    setMatchingGridItems(
      glyphs.filter((glyph) => {
        return glyph.name.toLowerCase().includes(searchName.toLowerCase());
      })
    );
  }

  return (
    <div className={styles["grid"]}>
      <GlyphSearchGridItemFilter onFilterChange={onFilterCriteriaChange} />
      <div className={styles["grid-items"]}>
        {(matchingGridItems ?? []).map((gridItem) => (
          <GlyphSearchGridItem key={genUuid()} glyph={gridItem} />
        )) || <span className={styles["grid-no-matching-items"]}>No matching glyphs found.</span>}
      </div>
    </div>
  );
}
