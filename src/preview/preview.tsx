import { Root, createRoot } from "react-dom/client";
import { FontGlyphsLoadedMessage, WebviewReadyMessage } from "../shared/event";
import { FontPreview } from "./FontPreview/FontPreview";
import "./preview.css";

const vscodeApi = window.acquireVsCodeApi();

let root: Root = null;

window.onload = () => {
  vscodeApi.postMessage<WebviewReadyMessage>({ data: { state: "ready" } });

  window.onmessage = (event: MessageEvent<FontGlyphsLoadedMessage>) => {
    if (root !== null) {
      return;
    }

    root = createRoot(document.getElementById("root"));
    root.render(<FontPreview glyphs={event.data?.glyphs ?? []} />);
  };
};
