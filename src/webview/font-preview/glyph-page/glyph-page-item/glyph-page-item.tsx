import { FontGlyph } from "../../../../shared/model";
import * as styles from "./glyph-page-item.module.scss";

type GlyphPageItemProps = {
  glyph: FontGlyph;
};

export function GlyphPageItem({ glyph }: GlyphPageItemProps) {
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
