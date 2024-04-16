import React from "react";
import { className } from "../Class";
import styles from "./FontGlyph.module.css";

type FontGlyphProps = {
  name: string;
  unicode: string;
  unencoded: string;
  htmlEncoded: string;
};

const styleClass = className<"FontGlyph">("--FontGlyph");
const css = (name: string) => styles[styleClass(name)];

export function FontGlyph({ name, unicode, unencoded, htmlEncoded }: FontGlyphProps) {
  return (
    <div className={css("glyph")} title={name}>
      <div className={css("name")}>${name}</div>
      <div className={css("unicode")}>${unicode}</div>
      <div className={css("codes")}>
        <span data-code="raw" className={css("code")}>
          ${unencoded}
        </span>
        <span data-code="unicode" className={css("code")}>
          ${htmlEncoded}
        </span>
      </div>
    </div>
  );
}
