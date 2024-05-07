import React from "react";
import { FontGlyph } from "../../shared/model";
import { FontGlyph as FontGlyphView } from "../FontGlyph/FontGlyph";
import { uuid } from "../Shared/UUID";
import * as styles from "./Editor.module.scss";

type EditorProps = {
  glyphs: FontGlyph[];
};

export function Editor({ glyphs }: EditorProps) {
  return (
    <div className={styles["preview"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>Iconfonts Preview</h1>
        <h2 className={styles["subtitle"]}>
          Click on the icon to copy the font glyph unicode.
          <input
            className={styles["glyph-search-input"]}
            name="glyph-search-input"
            type="search"
            placeholder="Search for icon"
          />
        </h2>
      </div>
      <div className={styles["glyphs"]}>
        {(glyphs &&
          glyphs.length > 0 &&
          glyphs.map((glyph) => (
            <FontGlyphView
              key={uuid()}
              name={glyph.name}
              binary={glyph.binary}
              unicode={glyph.unicode}
              hex={glyph.hex}
            />
          ))) || (
          <h1
            style={{
              position: "relative",
              fontFamily: "Roboto",
              fontWeight: "300",
              textAlign: "center",
              fontSize: "56px",
              margin: "20px 0",
              color: "#ffb617"
            }}
          >
            No glyphs found.
          </h1>
        )}
      </div>
    </div>
  );
}
