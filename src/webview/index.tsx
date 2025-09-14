import { createRoot } from "react-dom/client";
import { App } from "./app/app";
import { LoadFontEvent, WebviewStateChangedEvent } from "@shared/message/messages";

window.addEventListener("load", () => {
  const vscodeApi = window.acquireVsCodeApi();

  vscodeApi.postMessage<WebviewStateChangedEvent>({
    name: "webview-state-changed",
    payload: {
      state: "ready"
    }
  });

  window.addEventListener("message", (event: MessageEvent<LoadFontEvent>) => {
    const {
      data: { name, payload }
    } = event;

    switch (name) {
      case "load-font": {
        createRoot(document.getElementById("root")).render(
          <App vscodeApi={vscodeApi} fontUri={payload.fileUri} />
        );
        break;
      }
      default:
        break;
    }
  });
});
