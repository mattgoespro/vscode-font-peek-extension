import React from "react";
import { classId } from "../Shared/Style";
import { FontGlyph } from "../FontGlyph/FontGlyph";
import { Glyph } from "../../extension/glyph";
import { uuid } from "../Shared/UUID";
import "./Editor.module.css";

const id = classId("Editor");

type EditorProps = {
  glyphs: Glyph[];
};

function Editor({ glyphs }: EditorProps) {
  return (
    <div id={id("preview")}>
      <div id={id("preview-header")}>
        <h1 id={id("title")}>Iconfonts Preview</h1>
        <h2 id={id("subtitle")}>
          <span>Click on the icon to copy the unicode</span>
          <input
            id={id("glyphsearch-input")}
            name="glyph-search-input"
            type="search"
            placeholder="Search for icon"
          />
        </h2>
      </div>
      <div id={id("glyphs")}>
        $
        {glyphs.map((glyph) => (
          <FontGlyph
            key={uuid()}
            name={glyph.name}
            unicode={glyph.unicode}
            unencoded={glyph.unencoded}
            htmlEncoded={""}
          />
        ))}
      </div>
    </div>
  );
}

export default Editor;
