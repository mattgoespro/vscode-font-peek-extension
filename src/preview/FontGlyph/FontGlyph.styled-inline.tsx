import React from "react";
import { className } from "../Shared/Style";
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flexBasis: "10%",
        border: "1px solid #444444",
        borderRadius: "8pt",
        padding: "10px"
      }}
    >
      <div
        style={{
          fontFamily: "Nunito",
          fontSize: "12px",
          color: "#b3b3b3",
          marginBottom: "5px"
        }}
      >
        {name}
      </div>
      <div
        style={{
          color: "white",
          fontFamily: "iconfont-preview !important",
          fontSize: "30px",
          fontStyle: "normal",
          marginBottom: "5px",
          ...{ "-webkit-font-smoothing": "antialiased", "-webkit-text-stroke-width": "0.2px" }
        }}
      >
        {unencoded}
      </div>
      <div
        style={{
          color: "#666666",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          gap: "10px",
          fontSize: "10px"
        }}
      >
        <span
          data-code="unicode"
          style={{
            position: "relative",
            color: "#4b4b4b",
            ...{
              ":hover::before": {
                position: "absolute",
                width: "100%",
                height: "50px",
                content: "attr(data-code)",
                placeContent: "center",
                backgroundColor: "#4b4b4b",
                filter: "opacity(60%)",
                top: "0",
                left: "0",
                padding: "2px",
                borderRadius: "4px",
                fontSize: "12px",
                color: "red"
              }
            }
          }}
        >
          {unicode}
        </span>
        <span
          data-code="html"
          style={{
            position: "relative",
            color: "#4b4b4b",
            ...{
              ":hover::before": {
                position: "absolute",
                width: "100%",
                height: "50px",
                content: "attr(data-code)",
                placeContent: "center",
                backgroundColor: "#4b4b4b",
                filter: "opacity(60%)",
                top: "0",
                left: "0",
                padding: "2px",
                borderRadius: "4px",
                fontSize: "12px",
                color: "red"
              }
            }
          }}
        >
          {htmlEncoded}
        </span>
      </div>
    </div>
  );
}
