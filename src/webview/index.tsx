import { createRoot } from "react-dom/client";
import { App } from "./app/app";
import { LoadFontEvent, WebviewStateChangedEvent } from "@shared/message/messages";
console.log("Creating webview root...");

const vscodeApi = window.acquireVsCodeApi();
window.addEventListener("load", () => {
  console.log("Webview loaded, sending ready event to extension...");
  vscodeApi.postMessage<WebviewStateChangedEvent>({
    name: "webview-state-changed",
    payload: {
      state: "ready"
    }
  });
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
      console.log("Received font URI to load:", payload.fileUri);
      break;
    }
    default:
      break;
  }
});
