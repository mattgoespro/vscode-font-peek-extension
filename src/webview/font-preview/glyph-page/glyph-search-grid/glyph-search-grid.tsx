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
    <>
      <GlyphSearchGridItemFilter onFilterChange={onFilterCriteriaChange} />
      {((glyphs ?? []).length > 0 && (
        <>
          <div className={styles["search-grid-items"]}>
            {matchingGridItems.map((gridItem) => (
              <GlyphSearchGridItem key={genUuid()} glyph={gridItem} />
            ))}
          </div>
        </>
      )) || <span className={styles["no-glyphs"]}>No glyphs found.</span>}
    </>
  );
}
