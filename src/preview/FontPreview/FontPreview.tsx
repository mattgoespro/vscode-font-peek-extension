import { useEffect, useState } from "react";
import { FontGlyph } from "../../shared/model";
import { genUuid } from "../Shared/utils";
import * as styles from "./FontPreview.module.scss";
import { GlyphPagination } from "./GlyphPagination/GlyphPagination";
import { GlyphPreview } from "./GlyphPreview/GlyphPreview";
import { GlyphSearch } from "./GlyphSearch/GlyphSearch";

type FontPreviewProps = {
  fontGlyphs: FontGlyph[];
};

export function FontPreview({ fontGlyphs }: FontPreviewProps) {
  const [glyphs, setGlyphs] = useState<FontGlyph[]>([]);

  useEffect(() => {
    setGlyphs(fontGlyphs);
  }, [fontGlyphs]);

  function onPageChange(glyphs: FontGlyph[]) {
    console.log("Showing glyphs from: ", glyphs[0].name, "to", glyphs[glyphs.length - 1].name);
    setGlyphs(glyphs);
  }

  function onGlyphSearch(name: string) {
    const foundGlyphs = fontGlyphs.filter((glyph) => glyph.name.includes(name));

    console.log("Found", foundGlyphs.length, "glyphs for search term:", name);
    setGlyphs(foundGlyphs);
  }

  return (
    <div className={styles["preview"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>Font Glyph Preview</h1>
        <h2 className={styles["subtitle"]}>Click on the icon to copy the font glyph unicode.</h2>
        <GlyphSearch onSearch={onGlyphSearch} />
      </div>
      <div className={styles["pagination"]}>
        <GlyphPagination glyphs={fontGlyphs} pageChange={onPageChange} />
      </div>
      <div className={styles["glyphs"]}>
        {(glyphs &&
          glyphs.length > 0 &&
          glyphs.map((glyph) => (
            <GlyphPreview
              key={genUuid()}
              name={glyph.name}
              binary={glyph.binary}
              unicode={glyph.unicode}
              hex={glyph.hex}
            />
          ))) || <h1 className={styles["no-glyphs"]}>No glyphs found.</h1>}
      </div>
    </div>
  );
}
