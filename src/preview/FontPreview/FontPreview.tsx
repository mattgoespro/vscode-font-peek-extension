import { useState } from "react";
import { FontGlyph } from "../../shared/model";
import { useOutput } from "../Shared/Hooks/Logger";
import { genUuid } from "../Shared/Utils";
import * as styles from "./FontPreview.module.scss";
import { GlyphPagination } from "./GlyphPagination/GlyphPagination";
import { getTotalPages } from "./GlyphPagination/GlyphPagination.model";
import { GlyphPreview } from "./GlyphPreview/GlyphPreview";
import { GlyphSearch } from "./GlyphSearch/GlyphSearch";

type FontPreviewProps = {
  glyphs: FontGlyph[];
};

export function FontPreview(props: FontPreviewProps) {
  const [pageGlyphs, setPageGlyphs] = useState<FontGlyph[]>(props.glyphs);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [output] = useOutput("FontPreview");

  function onPageGlyphsChanged(pageGlyphs: FontGlyph[]) {
    output("setting page glyphs", pageGlyphs);
    setPageGlyphs(pageGlyphs);
  }

  function onGlyphSearch(name: string) {
    output("searching for", name);
    setSearchTerm(name);
  }

  return (
    <div className={styles["preview"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>Font Glyph Preview</h1>
        <h2 className={styles["subtitle"]}>Click on the icon to copy the font glyph unicode.</h2>
        <GlyphSearch onValueChange={onGlyphSearch} />
      </div>
      <div className={styles["preview-page"]}>
        {((pageGlyphs ?? []).length > 0 && (
          <>
            <div className={styles["pagination"]}>
              <GlyphPagination
                glyphs={props.glyphs}
                totalPages={getTotalPages(props.glyphs.length)}
                pageGlyphsChanged={onPageGlyphsChanged}
                searchTerm={searchTerm}
              />
            </div>
            <div className={styles["page-glyphs"]}>
              {pageGlyphs.map((glyph) => (
                <GlyphPreview
                  key={genUuid()}
                  name={glyph.name}
                  binary={glyph.binary}
                  unicode={glyph.unicode}
                  hex={glyph.hex}
                />
              ))}
            </div>
          </>
        )) || <span className={styles["no-glyphs"]}>No glyphs found.</span>}
      </div>
    </div>
  );
}
