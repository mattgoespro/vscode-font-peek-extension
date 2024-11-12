import { Root, createRoot } from "react-dom/client";
import { FontGlyphsLoadedMessage, WebviewStateMessage } from "../shared/events/messages";
import { FontPreview } from "./font-preview/font-preview";
import "./index.css";
import { ExtensionWebviewContext } from "./shared/extension-webview-context";

let root: Root = null;

window.onload = () => {
  const vscodeApi = window.acquireVsCodeApi();

  vscodeApi.postMessage<WebviewStateMessage>({ data: { type: "webview-state", state: "ready" } });

  window.onmessage = (event: MessageEvent<FontGlyphsLoadedMessage>) => {
    if (root !== null) {
      return;
    }

    root = createRoot(document.getElementById("root"));
    root.render(
      <ExtensionWebviewContext.Provider value={{ vscodeApi }}>
        <FontPreview glyphs={event.data?.glyphs ?? []} />
      </ExtensionWebviewContext.Provider>
    );
  };
};

export const Preview = "Preview";
