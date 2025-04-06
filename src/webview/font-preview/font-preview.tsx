import { useContext } from "react";
import { WebviewContext } from "../shared/webview-context";
import * as styles from "./font-preview.module.scss";
import { GlyphPage } from "./glyph-page/glyph-page";

export function FontPreview() {
  const { fontSpec: fontData } = useContext(WebviewContext);
  return (
    <div className={styles["preview"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>{fontData.name}</h1>
        <h2 className={styles["title"]}>Font Glyph Preview</h2>
        <h2 className={styles["subtitle"]}>Click a glyph to copy its unicode value.</h2>
      </div>
      <GlyphPage />
    </div>
  );
}
