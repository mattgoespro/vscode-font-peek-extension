import React from "react";
import { classId } from "./Class";
import { FontGlyph } from "./FontGlyph/FontGlyph";
import { Glyph } from "../main/glyph";

const id = classId("Preview");

type PreviewProps = {
  glyphs: Glyph[];
};

function Preview({ glyphs }: PreviewProps) {
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

export default Preview;
