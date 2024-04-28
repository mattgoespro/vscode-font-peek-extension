import Editor from "./Editor/Editor";
import React from "react";
import { createRoot } from "react-dom/client";
import { FontGlyphsLoadedMessage, WebviewReadyMessage } from "../shared/event";

window.onload = () => {
  const vscodeApi = window.acquireVsCodeApi();

  vscodeApi.postMessage({ data: { state: "ready" } } satisfies Partial<
    MessageEvent<WebviewReadyMessage>
  >);

  console.log("Loading preview");

  window.onmessage = (event: MessageEvent<FontGlyphsLoadedMessage>) => {
    console.log("Received extension message: ", event.data);
    console.log("---- Data: ", event.data);

    createRoot(createAppRoot()).render(<Editor glyphs={event.data?.glyphs} />);
  };
};

function createAppRoot() {
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);
  return root;
}
