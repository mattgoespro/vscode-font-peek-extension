import { createRoot } from "react-dom/client";
import { EditorMessage } from "../shared/events/messages";
import { FontPreview } from "./font-preview/font-preview";
import { useNotifications, useOutputPanel } from "./shared/hooks";
import { WebviewContext } from "./shared/webview-context";

window.onload = () => {
  const vscodeApi = window.acquireVsCodeApi();
  console.log("Acquired Visual Studio Code API.");

  const outputPanel = useOutputPanel("Webview", vscodeApi);
  const notifier = useNotifications("Webview", vscodeApi);

  vscodeApi.postMessage<EditorMessage<"webview">>({
    data: { source: "webview", name: "webview-state-changed", state: "ready" }
  });

  window.addEventListener("message", (event: MessageEvent<EditorMessage<"extension">>) => {
    switch (event.data?.name) {
      case "font-glyphs-loaded": {
        const root = createRoot(document.getElementById("root"));

        root.render(
          <WebviewContext.Provider value={{ vscodeApi }}>
            <FontPreview glyphs={event.data?.glyphs ?? []} />
          </WebviewContext.Provider>
        );
      }
    }
  });

  window.addEventListener("error", (event: ErrorEvent) => {
    outputPanel.error(event.error);
    notifier.notify("error", event.error.message);
  });
};
