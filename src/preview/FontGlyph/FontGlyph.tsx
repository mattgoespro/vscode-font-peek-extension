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
    <div className={styles["fontGlyph"]}>
      <div className={styles["name"]}>{name}</div>
      <div className={styles["unicode"]}>{unicode}</div>
      <div className={styles["codes"]}>
        <i>
          <span className={styles["code"]}>{binary}</span>
        </i>
        <i>
          <span className={styles["code"]}>{hex}</span>
        </i>
      </div>
    </div>
  );
}
