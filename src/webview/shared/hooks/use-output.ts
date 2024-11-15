import { useContext } from "react";
import { ExtensionWebviewContext } from "../extension-webview-context";
import { EditorMessage } from "../../../shared/events/messages";

export const useOutputPanel = (moduleContext: string) => {
  const vsCodeContext = useContext(ExtensionWebviewContext);

  return [
    (...args: unknown[]) => {
      vsCodeContext.vscodeApi.postMessage<EditorMessage<"webview">>({
        data: { source: "webview", name: "log-output", moduleContext, args }
      });
    }
  ];
};
