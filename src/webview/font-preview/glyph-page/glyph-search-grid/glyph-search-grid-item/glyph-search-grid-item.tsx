import { FontGlyph } from "@shared/model";
import * as styles from "./glyph-search-grid-item.module.scss";

type GlyphSearchGridItemProps = {
  glyph: FontGlyph;
};

export function GlyphSearchGridItem({ glyph }: GlyphSearchGridItemProps) {
  return (
    <div className={styles["glyph"]}>
      <div className={styles["name"]}>{glyph.name}</div>
      <div className={styles["unicode"]}>{glyph.unicode}</div>
      <div className={styles["codes"]}>
        <span className={styles["code"]}>{glyph.binary}</span>
        <span className={styles["code"]}>{glyph.hex}</span>
      </div>
    </div>
  );
}
