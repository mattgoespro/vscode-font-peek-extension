import { createRoot } from "react-dom/client";
import { FontGlyphsLoadedMessage, WebviewReadyMessage } from "../shared/event";
import { FontPreview } from "./FontPreview/FontPreview";
import "./preview.css";

const vscodeApi = window.acquireVsCodeApi();

window.onload = () => {
  vscodeApi.postMessage<WebviewReadyMessage>({ data: { state: "ready" } });

  window.onmessage = (event: MessageEvent<FontGlyphsLoadedMessage>) => {
    createRoot(document.getElementById("root")).render(
      <FontPreview fontGlyphs={event.data?.glyphs} />
    );
  };
};
