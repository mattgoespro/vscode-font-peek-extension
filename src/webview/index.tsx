import { createRoot } from "react-dom/client";
import { EditorMessage } from "../shared/events/messages";
import { FontPreview } from "./font-preview/font-preview";
import { WebviewContext } from "./shared/webview-context";
import { useOutputPanel } from "./shared/hooks/use-output-panel";

window.onload = () => {
  const vscodeApi = window.acquireVsCodeApi();

  console.log(vscodeApi);

  vscodeApi.postMessage<EditorMessage<"webview">>({
    data: { source: "webview", name: "webview-state-changed", state: "ready" }
  });

  window.onmessage = (event: MessageEvent<EditorMessage<"extension">>) => {
    if (event.data?.name === "font-glyphs-loaded") {
      useOutputPanel("Webview", vscodeApi).info("Font glyphs loaded", event.data.glyphs);

      const root = createRoot(document.getElementById("root"));

      root.render(
        <WebviewContext.Provider value={{ vscodeApi }}>
          <FontPreview glyphs={event.data?.glyphs ?? []} />
        </WebviewContext.Provider>
      );
    }
  };
};
