import { FontGlyph } from "../../shared/model";
import * as styles from "./font-preview.module.scss";
import { GlyphPage } from "./glyph-page/glyph-page";

type FontPreviewProps = {
  glyphs: FontGlyph[];
};

export function FontPreview({ glyphs }: FontPreviewProps) {
  return (
    <div className={styles["preview"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>Font Glyph Preview</h1>
        <h2 className={styles["subtitle"]}>Click on the icon to copy the font glyph unicode.</h2>
      </div>
      <div className={styles["glyph-page"]}>
        <GlyphPage glyphs={glyphs} />
      </div>
    </div>
  );
}
