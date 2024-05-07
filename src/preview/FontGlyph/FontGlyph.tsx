import React from "react";
import * as styles from "./FontGlyph.module.scss";

type FontGlyphProps = {
  name: string;
  binary: number;
  unicode: string;
  hex: string;
};

export function FontGlyph({ name, binary, unicode, hex }: FontGlyphProps) {
  return (
    <div className={styles["glyph"]}>
      <div className={styles["name"]}>{name}</div>
      <div className={styles["unicode"]}>{unicode}</div>
      <div className={styles["codes"]}>
        <span className={styles["code"]}>{binary}</span>
        <span className={styles["code"]}>{hex}</span>
      </div>
    </div>
  );
}
