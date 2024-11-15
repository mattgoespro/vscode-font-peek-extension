import { Root, createRoot } from "react-dom/client";
import { EditorMessage } from "../shared/events/messages";
import { FontPreview } from "./font-preview/font-preview";
import "./index.css";
import { ExtensionWebviewContext } from "./shared/extension-webview-context";

window.onload = () => {
  const vscodeApi = window.acquireVsCodeApi();

  vscodeApi.postMessage<EditorMessage<"webview">>({
    data: { source: "webview", name: "webview-state-changed", state: "ready" }
  });

  window.onmessage = (event: MessageEvent<EditorMessage<"extension">>) => {
    if (event.data?.name === "font-glyphs-loaded") {
      createRoot(document.getElementById("root")).render(
        <ExtensionWebviewContext.Provider value={{ vscodeApi }}>
          <FontPreview glyphs={event.data?.glyphs ?? []} />
        </ExtensionWebviewContext.Provider>
      );
    }
  };
};
