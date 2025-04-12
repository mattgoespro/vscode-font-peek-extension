import { createRoot } from "react-dom/client";
import { EditorMessage } from "../shared/events/messages";
import { FontPreview } from "./font-preview/font-preview";
import { WebviewContext } from "./shared/webview-context";
import { ThemeProvider } from "@mui/material";
import { theme } from "./shared/theme";

window.onload = () => {
  const vscodeApi = window.acquireVsCodeApi();

  vscodeApi.postMessage<EditorMessage<"webview">>({
    data: { source: "webview", name: "webview-state-changed", payload: { state: "ready" } }
  });

  window.onmessage = (event: MessageEvent<EditorMessage<"extension">>) => {
    if (event.data?.name === "font-glyphs-loaded") {
      const root = createRoot(document.getElementById("root"));
      const { fontData } = event.data.payload;

      root.render(
        <ThemeProvider theme={theme}>
          <WebviewContext.Provider value={{ vscodeApi, fontSpec: fontData }}>
            <FontPreview />
          </WebviewContext.Provider>
        </ThemeProvider>
      );
    }
  };
};
