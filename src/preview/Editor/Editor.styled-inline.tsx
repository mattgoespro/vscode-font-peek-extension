import React from "react";
import { classId } from "../Shared/Style";
import { FontGlyph as FontGlyphView } from "../FontGlyph/FontGlyph";
import { FontGlyph } from "../../shared/model";
import { uuid } from "../Shared/UUID";
import styles from "./Editor.module.css";

const id = classId("Editor");

type EditorProps = {
  glyphs: FontGlyph[];
};

function Editor({ glyphs }: EditorProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#161616",
        width: "100%",
        height: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          margin: "20px 0",
          width: "100%",
          height: "100%"
        }}
      >
        <h1
          style={{
            position: "relative",
            fontFamily: "Roboto",
            fontWeight: "300",
            textAlign: "center",
            fontSize: "56px",
            margin: "20px 0"
          }}
        >
          Iconfonts Preview
        </h1>
        <h2 id={id("subtitle")}>
          <span
            style={{
              fontFamily: "Roboto",
              fontWeight: 200,
              fontSize: "24px",
              textAlign: "center",
              margin: "0 0 20px"
            }}
          >
            Click on the icon to copy the unicode
          </span>
          <input
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: 150,
              height: 35,
              padding: "0 10px",
              fontSize: "16px",
              fontFamily: "Roboto",
              fontWeight: 300,
              border: "none",
              borderRadius: 4,
              backgroundColor: "#333",
              color: "#797979"
            }}
            name="glyph-search-input"
            type="search"
            placeholder="Search for icon"
          />
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          flex: 1,
          width: "100%"
        }}
      >
        {(glyphs &&
          glyphs.length > 0 &&
          glyphs.map((glyph) => (
            <FontGlyphView
              key={uuid()}
              name={glyph.name}
              unicode={glyph.unicode}
              unencoded={glyph.unencoded}
              htmlEncoded={""}
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

export default Editor;
