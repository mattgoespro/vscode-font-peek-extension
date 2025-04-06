import * as styles from "./glyph-page-item.module.scss";

type GlyphPageItemProps = {
  glyph: opentype.Glyph;
};

export function GlyphPageItem({ glyph }: GlyphPageItemProps) {
  return (
    <div className={styles["glyph"]}>
      <div className={styles["name"]}>{glyph.name}</div>
      <div className={styles["unicode"]}>{glyph.unicode}</div>
    </div>
  );
}
