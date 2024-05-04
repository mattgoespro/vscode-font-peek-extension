import React from "react";
import * as styles from "./FontGlyph.module.scss";

type FontGlyphProps = {
  name: string;
  unicode: string;
  unencoded: string;
  htmlEncoded: string;
};

export function FontGlyph({ name, unicode, unencoded, htmlEncoded }: FontGlyphProps) {
  return (
    <div className={styles["fontGlyph"]}>
      <div className={styles["name"]}>{name}</div>
      <div className={styles["unicode"]}>{unencoded}</div>
      <div className={styles["codes"]}>
        <i>
          <span data-code="unicode" className={styles["code"]}>
            {unicode}
          </span>
        </i>
        <i>
          <span data-code="html" className={styles["code"]}>
            {htmlEncoded}
          </span>
        </i>
      </div>
    </div>
  );
}
