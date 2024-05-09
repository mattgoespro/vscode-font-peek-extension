import React from "react";
import { createRoot } from "react-dom/client";
import { FontGlyphsLoadedMessage, WebviewReadyMessage } from "../shared/event";
import { Editor } from "./FontPreview/FontPreview";
import "./preview.css";

const vscodeApi = window.acquireVsCodeApi();

window.onload = () => {
  vscodeApi.postMessage<WebviewReadyMessage>({ data: { state: "ready" } });

  window.onmessage = (event: MessageEvent<FontGlyphsLoadedMessage>) => {
    createRoot(document.getElementById("root")).render(<Editor glyphs={event.data?.glyphs} />);
  };
};
