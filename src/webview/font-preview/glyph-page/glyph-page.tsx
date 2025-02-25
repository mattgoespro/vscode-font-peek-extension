import { FontGlyph } from "@shared/model";
import * as styles from "./glyph-page.module.scss";
import { GlyphSearchGrid } from "./glyph-search-grid/glyph-search-grid";

type GlyphPageProps = {
  glyphs: FontGlyph[];
};

export function GlyphPage({ glyphs }: GlyphPageProps) {
  return (
    <div className={styles["glyph-page-wrapper"]}>
      <GlyphSearchGrid glyphs={glyphs} />
    </div>
  );
}
